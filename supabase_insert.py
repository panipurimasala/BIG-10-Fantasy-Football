import requests
import json
import logging
from datetime import datetime, timedelta
import pytz
import threading
import time
from supabase import create_client, Client

# Set up logging
logging.basicConfig(level=logging.INFO)

# Supabase connection parameters
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(url, key)

# Your API token
RSC_token = os.getenv('RSC_TOKEN')

# API details
schedule_api_url = 'http://rest.datafeeds.rolling-insights.com/api/v1/schedule-season/2024/NCAAFB'
live_data_api_url = 'http://rest.datafeeds.rolling-insights.com/api/v1/live/{date}/NCAAFB'

# List of all relevant team IDs
team_ids = [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 174, 179, 172, 176]

# Team info mapping for all teams
team_info = {
    37: ("Indiana University", "Hoosiers"),
    38: ("University of Maryland", "Terrapins"),
    39: ("University of Michigan", "Wolverines"),
    40: ("Michigan State University", "Spartans"),
    41: ("Ohio State University", "Buckeyes"),
    42: ("Pennsylvania State University", "Nittany Lions"),
    43: ("Rutgers University", "Scarlet Knights"),
    44: ("University of Illinois", "Fighting Illini"),
    45: ("University of Iowa", "Hawkeyes"),
    46: ("University of Minnesota", "Golden Gophers"),
    47: ("University of Nebraska-Lincoln", "Cornhuskers"),
    48: ("Northwestern University", "Wildcats"),
    49: ("Purdue University", "Boilermakers"),
    50: ("University of Wisconsin-Madison", "Badgers"),
    174: ("University of Oregon", "Ducks"),
    179: ("University of Washington", "Huskies"),
    172: ("University of California, Los Angeles", "Bruins"),
    176: ("University of Southern California", "Trojans")
}

# Desired positions to include
desired_positions = ['QB', 'WR', 'TE', 'RB', 'K']

# Position mapping
position_mapping = {
    'QB': 'QB',
    'WR': 'WR',
    'TE': 'TE',
    'RB': 'RB',
    'PK': 'K',
    'K': 'K',
    # Positions to exclude are mapped to None
    'P': None,
    'DB': None,
    'DL': None,
    'LB': None,
    'S': None,
    'CB': None,
    # Add other positions if necessary
}

# Global variable to hold active game windows
active_game_windows = []

# Lock for threading
lock = threading.Lock()

def fetch_team_schedule(team_id):
    params = {
        'RSC_token': RSC_token,
        'team_id': team_id
    }
    response = requests.get(schedule_api_url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        logging.error(f"Failed to fetch schedule for team_id {team_id}")
        return None

def get_weekly_schedules(team_ids):
    schedules = {}
    for team_id in team_ids:
        schedule_data = fetch_team_schedule(team_id)
        if schedule_data:
            schedules[team_id] = schedule_data
    return schedules

def extract_game_times(schedules):
    game_times = []
    for team_id, schedule_data in schedules.items():
        games = schedule_data.get('data', {}).get('NCAAFB', [])
        for game in games:
            # Filter games for the upcoming week
            game_week = game.get('week')
            current_week = datetime.now().isocalendar()[1]
            if game_week != current_week:
                continue  # Skip games not in the current week

            game_time_str = game.get('game_time')
            if game_time_str and 'TBD' not in game_time_str:
                try:
                    # Example format: 'Sat, 28 Sep 2019 19:30:00 GMT'
                    game_time = datetime.strptime(game_time_str, '%a, %d %b %Y %H:%M:%S %Z')
                    game_times.append(game_time)
                except ValueError:
                    logging.warning(f"Invalid date format for game_time: {game_time_str}")
            else:
                logging.warning(f"Game time TBD for game: {game.get('game_ID')}")
                # Handle TBD times by assigning a default time (e.g., 1 PM local time)
                game_date_str = game.get('game_date')
                if game_date_str:
                    try:
                        # Example date format: 'Sat, 28 Sep 2019'
                        game_date = datetime.strptime(game_date_str, '%a, %d %b %Y')
                        default_time = datetime.combine(game_date, datetime.min.time()) + timedelta(hours=13)  # 1 PM
                        game_times.append(default_time)
                    except ValueError:
                        logging.error(f"Invalid date format for game_date: {game_date_str}")
                else:
                    logging.error(f"No game_date for game: {game.get('game_ID')}")
    return game_times

def get_active_game_time_windows(game_times):
    game_duration = timedelta(hours=4)
    active_windows = []
    for game_time in game_times:
        start_time = game_time - timedelta(minutes=15)  # Start 15 minutes before game time
        end_time = game_time + game_duration
        active_windows.append((start_time, end_time))
    return active_windows

def merge_time_windows(windows):
    windows.sort(key=lambda x: x[0])
    merged_windows = []
    for window in windows:
        if not merged_windows:
            merged_windows.append(window)
        else:
            last_window = merged_windows[-1]
            if window[0] <= last_window[1]:
                merged_windows[-1] = (last_window[0], max(last_window[1], window[1]))
            else:
                merged_windows.append(window)
    return merged_windows

def update_active_game_windows():
    global active_game_windows
    while True:
        # Fetch weekly schedules once a week (Sunday at midnight)
        now = datetime.now(pytz.utc)
        if now.weekday() == 6 and now.hour == 0:
            logging.info("Fetching weekly schedules...")
            schedules = get_weekly_schedules(team_ids)
            game_times = extract_game_times(schedules)
            game_times = list(set(game_times))  # Remove duplicates
            active_windows = get_active_game_time_windows(game_times)
            merged_windows = merge_time_windows(active_windows)
            with lock:
                active_game_windows = merged_windows
            logging.info("Active game windows updated.")
            # Sleep for 1 hour to avoid multiple fetches within the same hour
            time.sleep(3600)
        else:
            # Sleep for a while before checking again
            time.sleep(300)  # Check every 5 minutes

def is_in_active_window():
    now = datetime.now(pytz.utc)
    with lock:
        for start_time, end_time in active_game_windows:
            if start_time <= now <= end_time:
                return True
    return False

def fetch_live_data():
    date_str = datetime.now().strftime('%Y-%m-%d')
    url = live_data_api_url.format(date=date_str)
    params = {
        'RSC_token': RSC_token
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        logging.error(f"Failed to fetch live data from {url}")
        return None

def calculate_offensive_fantasy_points(player_stats, position):
    points = 0
    if position == 'QB':
        passing_yards = player_stats.get('passing_yards', 0)
        passing_touchdowns = player_stats.get('passing_touchdowns', 0)
        passing_interceptions = player_stats.get('passing_interceptions', 0)
        rushing_yards = player_stats.get('rushing_yards', 0)
        rushing_touchdowns = player_stats.get('rushing_touchdowns', 0)
        fumbles_lost = player_stats.get('fumbles_lost', 0)
        two_point_conversions = player_stats.get('two_point_conversion_succeeded', 0)

        points += passing_yards / 25
        points += passing_touchdowns * 4
        points += passing_interceptions * -2
        points += rushing_yards / 10
        points += rushing_touchdowns * 6
        points += two_point_conversions * 2
        points += fumbles_lost * -2
    elif position in ['WR', 'RB', 'TE']:
        rushing_yards = player_stats.get('rushing_yards', 0)
        rushing_touchdowns = player_stats.get('rushing_touchdowns', 0)
        receiving_yards = player_stats.get('receiving_yards', 0)
        receiving_touchdowns = player_stats.get('receiving_touchdowns', 0)
        receptions = player_stats.get('receptions', 0)
        fumbles_lost = player_stats.get('fumbles_lost', 0)
        two_point_conversions = player_stats.get('two_point_conversion_succeeded', 0)
        fumble_return_touchdowns = player_stats.get('fumble_return_touchdowns', 0)

        points += rushing_yards / 10
        points += rushing_touchdowns * 6
        points += receiving_yards / 10
        points += receiving_touchdowns * 6
        points += receptions * 1  # Assuming PPR scoring
        points += two_point_conversions * 2
        points += fumbles_lost * -2
        points += fumble_return_touchdowns * 6
    elif position == 'K':
        field_goals_made = player_stats.get('field_goals_made', 0)
        field_goal_distances = player_stats.get('field_goal_distances', [])
        extra_points_made = player_stats.get('extra_points_made', 0)
        points += extra_points_made * 1
        for distance in field_goal_distances:
            if distance >= 50:
                points += 5
            else:
                points += 3
    else:
        points = 0  # For other positions not specified
    return round(points, 1)

def calculate_defense_fantasy_points(team_stats, points_allowed):
    points = 0
    points += team_stats.get('sacks', 0) * 1
    points += team_stats.get('defense_interceptions', 0) * 2
    points += team_stats.get('defense_fumble_recoveries', 0) * 2
    points += team_stats.get('safeties', 0) * 2
    defensive_touchdowns = (team_stats.get('defense_touchdowns', 0) +
                            team_stats.get('interception_touchdowns', 0) +
                            team_stats.get('fumble_return_touchdowns', 0))
    points += defensive_touchdowns * 6
    kick_punt_return_touchdowns = (team_stats.get('kick_return_touchdowns', 0) +
                                   team_stats.get('punt_return_touchdowns', 0) +
                                   team_stats.get('blocked_kick_touchdowns', 0) +
                                   team_stats.get('blocked_punt_touchdowns', 0) +
                                   team_stats.get('field_goal_return_touchdowns', 0))
    points += kick_punt_return_touchdowns * 6
    points += team_stats.get('two_point_conversion_returns', 0) * 2
    # Points Allowed
    if points_allowed == 0:
        points += 10
    elif 1 <= points_allowed <= 6:
        points += 7
    elif 7 <= points_allowed <= 13:
        points += 4
    elif 14 <= points_allowed <= 20:
        points += 1
    elif 21 <= points_allowed <= 27:
        points += 0
    elif 28 <= points_allowed <= 34:
        points += -1
    else:  # 35+
        points += -4
    return round(points, 1)

def get_team_defense_player_id(team_id):
    return 100000 + team_id  # Arbitrary large number to avoid collision with player IDs

def insert_data(data):
    for game in data.get('data', {}).get('NCAAFB', []):
        for team_key in ['home_team', 'away_team']:
            team = game['full_box'][team_key]
            if team['team_id'] in team_ids:
                # Upsert team
                supabase.table('teams').upsert({
                    'team_id': team['team_id'],
                    'name': team_info[team['team_id']][0],
                    'abbreviation': team['abbrv'],
                    'mascot': team_info[team['team_id']][1],
                    'division': team.get('division_name', '')
                }).execute()

                # Insert or update players and stats
                for player_id, player in game.get('player_box', {}).get(team_key, {}).items():
                    position_raw = player.get('position', '')
                    position = position_mapping.get(position_raw)
                    if position is None:
                        continue  # Skip positions we're not interested in

                    status = player.get('status', '')
                    player_stats = player
                    fantasy_points = calculate_offensive_fantasy_points(player_stats, position)

                    # Prepare and insert stats
                    stats_json = json.dumps(player_stats)
                    supabase.table('weekly_stats').upsert({
                        'player_id': player_id,
                        'game_id': game['game_ID'],
                        'week': game['week'],
                        'season': game['season'],
                        'player_stats': stats_json,
                        'game_date': game['game_time'],
                        'fantasy_points': fantasy_points
                    }).execute()

                    # Upsert into players table
                    supabase.table('players').upsert({
                        'player_id': player_id,
                        'team_id': team['team_id'],
                        'name': player['player'],
                        'position': position,
                        'status': status,
                        'fantasy_points': fantasy_points
                    }).execute()

                # Process team defense
                team_defense_player_id = get_team_defense_player_id(team['team_id'])

                team_name = team_info[team['team_id']][0]
                team_defense_name = team_name + ' Defense'

                team_position = 'D/ST'

                team_status = 'ACT'  # Assuming team defense is always active

                team_stats = team['team_stats']

                # Points allowed
                points_allowed = team_stats.get('points_against_defense_special_teams', 0)

                fantasy_points = calculate_defense_fantasy_points(team_stats, points_allowed)

                # Prepare and insert stats for team defense
                stats_json = json.dumps(team_stats)
                supabase.table('weekly_stats').upsert({
                    'player_id': team_defense_player_id,
                    'game_id': game['game_ID'],
                    'week': game['week'],
                    'season': game['season'],
                    'player_stats': stats_json,
                    'game_date': game['game_time'],
                    'fantasy_points': fantasy_points
                }).execute()

                # Upsert into players table
                supabase.table('players').upsert({
                    'player_id': team_defense_player_id,
                    'team_id': team['team_id'],
                    'name': team_defense_name,
                    'position': team_position,
                    'status': team_status,
                    'fantasy_points': fantasy_points
                }).execute()

def main():
    # Start a thread to update active game windows weekly
    schedule_thread = threading.Thread(target=update_active_game_windows)
    schedule_thread.daemon = True
    schedule_thread.start()

    # Main loop to check for active game times and fetch live data
    while True:
        if is_in_active_window():
            logging.info("In active game window. Fetching live data...")
            data = fetch_live_data()
            if data:
                insert_data(data)
                logging.info("Data updated successfully.")
            else:
                logging.error("Failed to fetch live data.")
            # Wait for a minute before next fetch
            time.sleep(60)
        else:
            logging.info("No active games at this time.")
            # Sleep for 5 minutes before checking again
            time.sleep(300)

if __name__ == '__main__':
    main()
