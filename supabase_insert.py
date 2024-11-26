import os
import requests
import json
import logging
from datetime import datetime, timedelta
import pytz
import threading
import time
from supabase import create_client, Client
from dotenv import load_dotenv  # Ensure you have python-dotenv installed

# Load environment variables from .env file (if present)
load_dotenv()

# Set up logging
LOG_FILE = 'supabase_insert_debug.log'
logging.basicConfig(
    level=logging.DEBUG,  # Set to DEBUG to capture all levels of logs
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()  # Also output logs to the console
    ]
)

# Validate environment variables
required_env_vars = ['SUPABASE_URL', 'SUPABASE_KEY', 'RSC_TOKEN']
missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    logging.error(f"Missing required environment variables: {', '.join(missing_vars)}")
    exit(1)

# Supabase connection parameters
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(url, key)
logging.info("Supabase client initialized.")

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

def log_function_entry_exit(func):
    """Decorator to log function entry and exit."""
    def wrapper(*args, **kwargs):
        logging.debug(f"Entering function: {func.__name__}")
        result = func(*args, **kwargs)
        logging.debug(f"Exiting function: {func.__name__}")
        return result
    return wrapper

@log_function_entry_exit
def fetch_team_schedule(team_id):
    params = {
        'RSC_token': RSC_token,
        'team_id': team_id
    }
    logging.debug(f"Fetching schedule for team_id {team_id} with params {params}")
    try:
        response = requests.get(schedule_api_url, params=params, timeout=10)
        response.raise_for_status()
        logging.debug(f"Schedule fetched successfully for team_id {team_id}")
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching schedule for team_id {team_id}: {e}")
        return None

@log_function_entry_exit
def get_weekly_schedules(team_ids):
    schedules = {}
    for team_id in team_ids:
        logging.debug(f"Fetching schedule for team_id {team_id}")
        schedule_data = fetch_team_schedule(team_id)
        if schedule_data:
            schedules[team_id] = schedule_data
            logging.debug(f"Schedule added for team_id {team_id}")
        else:
            logging.warning(f"No schedule data for team_id {team_id}")
    logging.info(f"Total schedules fetched: {len(schedules)}")
    return schedules

@log_function_entry_exit
def extract_game_times(schedules):
    game_times = []
    now_utc = datetime.now(pytz.utc)
    current_week = now_utc.isocalendar()[1] - 34  # Adjust for the start of the season MIGHT HAVE TO CHANGE EVERY YEAR
    logging.debug(f"Current UTC time: {now_utc}")
    logging.debug(f"Current ISO Week Number: {current_week}")
    
    for team_id, schedule_data in schedules.items():
        games = schedule_data.get('data', {}).get('NCAAFB', [])
        logging.debug(f"Processing {len(games)} games for team_id {team_id}")
        for game in games:
            game_week = game.get('week')
            logging.debug(f"Game week: {game_week}, Current week: {current_week}")
            if game_week != current_week:
                logging.debug("Skipping game not in the current week.")
                continue  # Skip games not in the current week

            game_time_str = game.get('game_time')
            if game_time_str and 'TBD' not in game_time_str:
                try:
                    # Example format: 'Sat, 28 Sep 2019 19:30:00 GMT'
                    game_time = datetime.strptime(game_time_str, '%a, %d %b %Y %H:%M:%S %Z')
                    game_time = game_time.replace(tzinfo=pytz.utc)  # Ensure UTC
                    game_times.append(game_time)
                    logging.debug(f"Parsed game time: {game_time}")
                except ValueError:
                    logging.warning(f"Invalid date format for game_time: {game_time_str}")
            else:
                logging.warning(f"Game time TBD for game: {game.get('game_ID')}")
                # Handle TBD times by assigning a default time (e.g., 1 PM UTC)
                game_date_str = game.get('game_date')
                if game_date_str:
                    try:
                        # Example date format: 'Sat, 28 Sep 2019'
                        game_date = datetime.strptime(game_date_str, '%a, %d %b %Y')
                        default_time = datetime.combine(game_date, datetime.min.time()) + timedelta(hours=13)  # 1 PM UTC
                        default_time = default_time.replace(tzinfo=pytz.utc)
                        game_times.append(default_time)
                        logging.debug(f"Assigned default game time: {default_time}")
                    except ValueError:
                        logging.error(f"Invalid date format for game_date: {game_date_str}")
                else:
                    logging.error(f"No game_date for game: {game.get('game_ID')}")
    logging.info(f"Total game times extracted: {len(game_times)}")
    return game_times

@log_function_entry_exit
def get_active_game_time_windows(game_times):
    game_duration = timedelta(hours=4)
    active_windows = []
    for game_time in game_times:
        start_time = game_time - timedelta(minutes=15)  # Start 15 minutes before game time
        end_time = game_time + game_duration
        active_windows.append((start_time, end_time))
        logging.debug(f"Added active window: {start_time} to {end_time}")
    logging.info(f"Total active windows before merging: {len(active_windows)}")
    return active_windows

@log_function_entry_exit
def merge_time_windows(windows):
    if not windows:
        logging.warning("No windows to merge.")
        return []
    windows.sort(key=lambda x: x[0])
    merged_windows = []
    for window in windows:
        if not merged_windows:
            merged_windows.append(window)
            logging.debug(f"Initialized merged window with: {window}")
        else:
            last_window = merged_windows[-1]
            if window[0] <= last_window[1]:
                merged = (last_window[0], max(last_window[1], window[1]))
                merged_windows[-1] = merged
                logging.debug(f"Merged window: {merged}")
            else:
                merged_windows.append(window)
                logging.debug(f"Added new merged window: {window}")
    logging.info(f"Total merged active windows: {len(merged_windows)}")
    return merged_windows

@log_function_entry_exit
def update_active_game_windows():
    global active_game_windows
    while True:
        now = datetime.now(pytz.utc)
        logging.debug(f"Checking if it's time to fetch schedules. Current UTC time: {now}")
        if now.weekday() == 6 and now.hour == 0 or not active_game_windows:
            logging.info("Fetching weekly schedules...")
            schedules = get_weekly_schedules(team_ids)
            game_times = extract_game_times(schedules)
            game_times = list(set(game_times))  # Remove duplicates
            active_windows = get_active_game_time_windows(game_times)
            merged_windows = merge_time_windows(active_windows)
            with lock:
                active_game_windows = merged_windows
                logging.info(f"Active game windows updated: {active_game_windows}")
            # Sleep for 1 hour to avoid multiple fetches within the same hour
            logging.debug("Sleeping for 1 hour after fetching schedules.")
            time.sleep(3600)
        else:
            # Sleep for a while before checking again
            logging.debug("Not time to fetch schedules yet. Sleeping for 5 minutes.")
            time.sleep(300)  # Check every 5 minutes

@log_function_entry_exit
def is_in_active_window():
    now = datetime.now(pytz.utc)
    logging.debug(f"Checking active windows against current UTC time: {now}")
    print(active_game_windows)
    with lock:
        for start_time, end_time in active_game_windows:
            logging.debug(f"Comparing with window: {start_time} to {end_time}")
            if start_time <= now <= end_time:
                logging.info(f"Current time {now} is within window {start_time} to {end_time}")
                return True
    logging.info("No active game windows found for current time.")
    return False

@log_function_entry_exit
def fetch_live_data():
    date_str = datetime.now().strftime('%Y-%m-%d')
    url = live_data_api_url.format(date=date_str)
    params = {
        'RSC_token': RSC_token
    }
    logging.debug(f"Fetching live data from {url} with params {params}")
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        logging.debug("Live data fetched successfully.")
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to fetch live data from {url}: {e}")
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

@log_function_entry_exit
def insert_data(data):
    for game in data.get('data', {}).get('NCAAFB', []):
        for team_key in ['home_team', 'away_team']:
            team = game['full_box'][team_key]
            if team['team_id'] in team_ids:
                logging.debug(f"Processing team_id {team['team_id']} for game_id {game['game_ID']}")
                # Upsert team
                try:
                    supabase.table('teams').upsert({
                        'team_id': team['team_id'],
                        'name': team_info[team['team_id']][0],
                        'abbreviation': team['abbrv'],
                        'mascot': team_info[team['team_id']][1],
                        'division': team.get('division_name', '')
                    }).execute()
                    logging.debug(f"Upserted team_id {team['team_id']} into 'teams' table.")
                except Exception as e:
                    logging.error(f"Error upserting team_id {team['team_id']}: {e}")

                # Insert or update players and stats
                for player_id, player in game.get('player_box', {}).get(team_key, {}).items():
                    position_raw = player.get('position', '')
                    position = position_mapping.get(position_raw)
                    if position is None:
                        logging.debug(f"Skipping player_id {player_id} with position {position_raw}")
                        continue  # Skip positions we're not interested in

                    status = player.get('status', '')
                    player_stats = player
                    fantasy_points = calculate_offensive_fantasy_points(player_stats, position)

                    # Prepare and insert stats
                    stats_json = json.dumps(player_stats)
                    try:
                        supabase.table('weekly_stats').upsert({
                            'player_id': player_id,
                            'game_id': game['game_ID'],
                            'week': game['week'],
                            'season': game['season'],
                            'player_stats': stats_json,
                            'game_date': game['game_time'],
                            'fantasy_points': fantasy_points
                        }).execute()
                        logging.debug(f"Upserted stats for player_id {player_id} into 'weekly_stats' table.")
                    except Exception as e:
                        logging.error(f"Error upserting stats for player_id {player_id}: {e}")

                    # Upsert into players table
                    try:
                        supabase.table('players').upsert({
                            'player_id': player_id,
                            'team_id': team['team_id'],
                            'name': player['player'],
                            'position': position,
                            'status': status,
                            'fantasy_points': fantasy_points
                        }).execute()
                        logging.debug(f"Upserted player_id {player_id} into 'players' table.")
                    except Exception as e:
                        logging.error(f"Error upserting player_id {player_id}: {e}")

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
                try:
                    supabase.table('weekly_stats').upsert({
                        'player_id': team_defense_player_id,
                        'game_id': game['game_ID'],
                        'week': game['week'],
                        'season': game['season'],
                        'player_stats': stats_json,
                        'game_date': game['game_time'],
                        'fantasy_points': fantasy_points
                    }).execute()
                    logging.debug(f"Upserted defense stats for team_id {team['team_id']} into 'weekly_stats' table.")
                except Exception as e:
                    logging.error(f"Error upserting defense stats for team_id {team['team_id']}: {e}")

                # Upsert into players table
                try:
                    supabase.table('players').upsert({
                        'player_id': team_defense_player_id,
                        'team_id': team['team_id'],
                        'name': team_defense_name,
                        'position': team_position,
                        'status': team_status,
                        'fantasy_points': fantasy_points
                    }).execute()
                    logging.debug(f"Upserted defense player_id {team_defense_player_id} into 'players' table.")
                except Exception as e:
                    logging.error(f"Error upserting defense player_id {team_defense_player_id}: {e}")

@log_function_entry_exit
def main():
    # Start a thread to update active game windows weekly
    schedule_thread = threading.Thread(target=update_active_game_windows)
    schedule_thread.daemon = True
    schedule_thread.start()
    logging.info("Started schedule update thread.")

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
            logging.debug("Sleeping for 1 minute before next fetch.")
            time.sleep(60)
        else:
            logging.info("No active games at this time.")
            # Sleep for 5 minutes before checking again
            logging.debug("Sleeping for 5 minutes before next check.")
            time.sleep(300)

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        logging.critical(f"Unhandled exception: {e}", exc_info=True)
