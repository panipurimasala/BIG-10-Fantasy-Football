import json
import os
import random

class Draft_Instance:
    def __init__(self):
        #teams that will draft, players (and their profiles) will occupy lists in tuple form
        self.team1 = {"QB":[], "RB":[], "WR":[], "TE":[], "K":[], "D/ST":[]}
        self.team2 = {"QB":[], "RB":[], "WR":[], "TE":[], "K":[], "D/ST":[]}
        
        self.all_players_dict = {}
        team_dir = os.listdir("mock_data/team_rosters_2024")[1:-1]
        for team in team_dir:
            with open("mock_data/team_rosters_2024/{}".format(team), "r") as f:
                data = json.load(f) 
            f.close()  

            for player in data["players"]:
                player_dict = {}
                if player["position"] in ["QB", "RB", "WR", "TE", "K"]:
                    player_dict["position"] = player["position"]
                    player_dict["eligibility"] = player["eligibility"]
                    player_dict["team"] = data["alias"]
                    player_name = player["name"]
                    while player_name in self.all_players_dict:
                        player_name.append(".")

                    self.all_players_dict[player_name] = player_dict

    def draft(self, team, i):
        player = input(f"Team{i}, Pick a player (player must be fully typed and spelled correctly): ")
        while player not in self.all_players_dict:
            player = input("Player does not exist, please enter a new player to draft: ")
        team[self.all_players_dict[player]["position"]].append((player, self.all_players_dict(player)))
        self.all_players_dict.pop(player)
    
    def random_draft(self, team):
        player = random.choice(list(self.all_players_dict.keys()))
        team[self.all_players_dict[player]["position"]].append((player, self.all_players_dict[player]))
        self.all_players_dict.pop(player)
        
    
        
    def draft_players(self):
        """draft players in however many rounds are specified to two teams
        can change to either human run draft or random draft by commenting and uncommenting code"""
        for i in range(16):
            if i % 2 == 0:
                #self.draft(self.team1, 1)
                #self.draft(self.team2, 2)
                self.random_draft(self.team1)
                self.random_draft(self.team2)
            else:
                #self.draft(self.team2, 2)
                #self.draft(self.team1, 1)
                self.random_draft(self.team2)
                self.random_draft(self.team1)
                


if __name__ == "__main__":
    draft = Draft_Instance()
    print(len(draft.all_players_dict))
    draft.draft_players()
    print(len(draft.all_players_dict))


    print(draft.team1)
    print(draft.team2)


