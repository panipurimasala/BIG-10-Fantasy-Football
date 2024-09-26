import requests
import json


def get_team_id_data(api_key: str):
    """gets team id data to be used to get rosters for each team, writes to team_id_data.json (which should already be filled)"""

    #aliases of teams as reference by sportradar
    big_ten_teams = ["ILL","IU","IOW","MAR","MSU","MICH","MIN","NEB","NW","OSU","ORE","PSU","PUR","RUT","UCLA","USC","WAS","WIS"]
    big_ten_team_data = []

    url = "https://api.sportradar.com/ncaafb/trial/v7/en/league/teams.json?api_key={}".format(api_key)

    headers = {"accept": "application/json"}

    response = requests.get(url, headers=headers)
    data = response.json()
    
    #filters for big ten teams
    for team in data["teams"]:
        if team["alias"] in big_ten_teams:
            big_ten_team_data.append(team)
    
    big_ten_team_data = {"teams": big_ten_team_data}

    #write to file
    with open('team_id_data.json', 'w') as f:
        json.dump(big_ten_team_data, f)


