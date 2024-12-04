import requests
import json
import os

#aliases of teams as reference by sportradar
BIG_TEN_TEAMS = ["ILL","IU","IOW","MAR","MSU","MICH","MIN","NEB","NW","OSU","ORE","PSU","PUR","RUT","UCLA","USC","WAS","WIS"]


def get_season_schedule(api_key: str):
    """gets all big ten regular season games and writes them to week_specific files"""
    url = "https://api.sportradar.com/ncaafb/trial/v7/en/games/{}/REG/schedule.json?api_key={}".format(2023, api_key)
    
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    data = response.json()
    
    big_ten_weeks = {}
    #13 weeks in regular season
    for i in range(1, 14):
        big_ten_weeks[i] = [] 

    for week in range(13):
        for game in data["weeks"][week]["games"]:
            if game["home"]["alias"] in BIG_TEN_TEAMS or game["away"]["alias"] in BIG_TEN_TEAMS:
                big_ten_weeks[week + 1].append(game)
    
    for week in big_ten_weeks.keys():
        with open("mock_data/2023_stats/weekly_games_2023/week_{}_games.json".format(week),"w") as f:
            json.dump(big_ten_weeks[week], f)

def get_game_statistics(api_key: str):
    """gets relevant fantasy stats for each game and writes to respective files in indiv_game_stats directory"""
    week_file_list = os.listdir("mock_data/2023_stats/weekly_games_2023")

    week_counter = 1
    for week_file in week_file_list:
        with open("mock_data/2023_stats/weekly_games_2023/{}".format(week_file), "r") as f:
            #json.load returns a dictionary
            game_list = json.load(f)
            
        return_game_list = []
        for game in game_list:
            url = "https://api.sportradar.com/ncaafb/trial/v7/en/games/{}/statistics.json?api_key={}".format(game["id"], api_key)

            headers = {"accept": "application/json"}

            response = requests.get(url, headers=headers)
            data = response.json()
            try:
                assert "summary" in data
            except AssertionError:
                continue
            
            #only pull specific stats from request
            game_dict = {}
            game_dict["home"] = {}
            game_dict["away"] = {}
            game_dict["home"]["kicking"] = {}
            game_dict["away"]["kicking"] = {}
            game_dict["home"]["defense_specteams"] = {}
            game_dict["away"]["defense_specteams"] = {}

            game_dict["home"]["overview"] = data["summary"]["home"]
            game_dict["away"]["overview"] = data["summary"]["away"]
            data = data["statistics"]
            
            for team in ["home", "away"]:
                game_dict[team]["rushing"] = data[team]["rushing"]["players"]
                game_dict[team]["passing"] = data[team]["passing"]["players"]
                game_dict[team]["receiving"] = data[team]["passing"]["players"]
                game_dict[team]["two_point_conv"] = data[team]["extra_points"]["conversions"]["players"]

                game_dict[team]["kicking"]["field_goals"] = data[team]["field_goals"]["players"]
                game_dict[team]["kicking"]["pat"] = data[team]["extra_points"]["kicks"]["players"]

                game_dict[team]["defense_specteams"]["defense_totals"] = data[team]["defense"]["totals"]
                touchdown_total = data[team]["touchdowns"]
                game_dict[team]["defense_specteams"]["touchdowns"] = (touchdown_total["fumble_return"] + touchdown_total["int_return"] 
                                                                    + touchdown_total["kick_return"] + touchdown_total["punt_return"])
            
            return_game_list.append(game_dict)
        
        with open("mock_data/2023_stats/indiv_game_stats/week_{}.json".format(week_counter), "w") as f:
            json.dump(return_game_list, f)
        week_counter += 1


    

"""if __name__ == "__main__":
    get_game_statistics("Oz4C70zeuhotrlPcVXhiB6T5ftBgsFaOVbTlXzMY")"""

if __name__ == "__main__":
    with open("mock_data/2023_stats/indiv_game_stats/week_1.json","r") as f:
        mylist = json.load(f)
    print(len(mylist))