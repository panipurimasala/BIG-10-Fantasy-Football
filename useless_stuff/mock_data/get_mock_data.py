import requests
import json

#aliases of teams as reference by sportradar
BIG_TEN_TEAMS_2024 = ["ILL","IU","IOW","MAR","MSU","MICH","MIN","NEB","NW","OSU","ORE","PSU","PUR","RUT","UCLA","USC","WAS","WIS"]

def get_team_id_data(api_key: str):
    """gets team id data to be used to get rosters for each team, writes to team_id_data.json"""

    big_ten_team_data = []

    url = "https://api.sportradar.com/ncaafb/trial/v7/en/league/teams.json?api_key={}".format(api_key)

    headers = {"accept": "application/json"}

    response = requests.get(url, headers=headers)
    #converts to dictionary
    data = response.json()
    
    #filters for big ten teams
    for team in data["teams"]:
        if team["alias"] in BIG_TEN_TEAMS_2024:
            big_ten_team_data.append(team)
    
    big_ten_team_data = {"teams": big_ten_team_data}

    #write to file
    with open("team_id_data.json", "w") as f:
        json.dump(big_ten_team_data, f)


def get_team_rosters(api_key: str):
    """gets big 10 team rosters and writes them to team_rosters folder"""
    
    with open("mock_data/team_id_data.json") as f:
        #json.load returns a dictionary
        teams_dict = json.load(f)
    
    headers = {"accept": "application/json"}
    for team in teams_dict["teams"]:
        url = "https://api.sportradar.com/ncaafb/trial/v7/en/teams/{}/full_roster.json?api_key={}".format(team["id"], api_key)
        response = requests.get(url, headers=headers)
        
        #converts to dictionary
        roster_data = response.json()

        #add to respective file
        with open("mock_data/team_rosters_2024/roster_{}_2024.json".format(team["alias"]),"w") as f:
            json.dump(roster_data, f)  