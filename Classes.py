class FantasyFootballLeague:
    def __init__(self, league_name):
        self.league_name = league_name
        self.teams = []
        self.teamLimit = 12
        self.free_agents = []

    def add_team(self, team_name):
        team = self.FantasyFootballRoster(team_name)
        self.teams.append(team)

    def add_free_agent(self, player):
        self.free_agents.append(player)
    
    def remove_free_agent(self, player):
        if player in self.free_agents:
            self.free_agents.remove(player)

    def add_free_agent_to_team(self, team_name, player):
        for team in self.teams:
            if team.team_name == team_name:
                team.add_player(player)
        self.remove_free_agent(player)

    def drop_player_from_team(self, team_name, player):
        for team in self.teams:
            if team.team_name == team_name:
                team.drop_player(player)
        self.add_free_agent(player)

    def trade_players(self, team1_name, team2_name, player1, player2):
        team1, team2 = None, None
        for team in self.teams:
            if team.team_name == team1_name:
                team1 = team
            if team.team_name == team2_name:
                team2 = team
        if team1 and team2:
            team1.drop_player(player1)
            team1.add_player(player2)
            team2.drop_player(player2)
            team2.add_player(player1)

    def score_week(self):
        for team in self.teams:
            team.total_points = 0
            if team.QB: team.total_points += team.QB.points
            if team.RB1: team.total_points += team.RB1.points
            if team.RB2: team.total_points += team.RB2.points
            if team.WR1: team.total_points += team.WR1.points
            if team.WR2: team.total_points += team.WR2.points
            if team.TE: team.total_points += team.TE.points
            if team.FLEX: team.total_points += team.FLEX.points
            if team.K: team.total_points += team.K.points
            if team.DEF: team.total_points += team.DEF.points

    class Player:
        def __init__(self, name, position, team):
            self.name = name  # Player's name
            self.position = position  # e.g., "QB", "RB", "WR", "TE", "K", "DEF"
            self.team = team  # NFL team, e.g., "Chiefs", "Cowboys"
            # Rushing stats
            self.rushing_yards = 0
            self.rushing_touchdowns = 0
            self.fumbles = 0
            self.fumbles_lost = 0
            self.rush_attempts = 0
            # Passing stats
            self.passing_yards = 0
            self.passing_touchdowns = 0
            self.interceptions_thrown = 0
            self.pass_attempts = 0
            self.pass_completions = 0
            # Receiving stats
            self.receiving_yards = 0
            self.receiving_touchdowns = 0
            self.receptions = 0
            self.targets = 0
            # Kicking stats
            self.field_goals_missed = 0
            self.field_goals_made = 0
            self.field_goals_attempted = 0
            self.extra_points_missed = 0
            self.extra_points_made = 0
            self.extra_points_attempted = 0
            # Defense stats
            self.sacks = 0
            self.interceptions = 0
            self.fumbles_forced = 0
            self.fumbles_recovered = 0
            self.touchdowns = 0
            self.points_allowed = 0
            self.special_teams_tds = 0
            self.safeties = 0
            self.blocked_kicks = 0
            # Total stats
            self.points = 0  # Fantasy points scored by this player

    class FantasyFootballRoster:
        def __init__(self, team_name):
            self.team_name = team_name
            self.total_points = 0
            self.rosterSize = 0
            self.rosterLimit = 15
            self.QB = None
            self.RB1 = None
            self.RB2 = None
            self.WR1 = None
            self.WR2 = None
            self.TE = None
            self.FLEX = None
            self.K = None
            self.DEF = None
            self.bench1 = None
            self.bench2 = None
            self.bench3 = None
            self.bench4 = None
            self.bench5 = None
            self.bench6 = None
            self.benchOverflow = []

        def add_player(self, player):
            if self.rosterSize < self.rosterLimit:
                self.rosterSize += 1
                if player.position == "QB" and self.QB is None:
                    self.QB = player
                elif player.position == "RB" and self.RB1 is None:
                    self.RB1 = player
                elif player.position == "RB" and self.RB2 is None:
                    self.RB2 = player
                elif player.position == "WR" and self.WR1 is None:
                    self.WR1 = player
                elif player.position == "WR" and self.WR2 is None:
                    self.WR2 = player
                elif player.position == "TE" and self.TE is None:
                    self.TE = player
                elif player.position == "K" and self.K is None:
                    self.K = player
                elif player.position == "DEF" and self.DEF is None:
                    self.DEF = player
                else:
                    # Add to bench if no starting position is available
                    if self.bench1 is None:
                        self.bench1 = player
                    elif self.bench2 is None:
                        self.bench2 = player
                    elif self.bench3 is None:
                        self.bench3 = player
                    elif self.bench4 is None:
                        self.bench4 = player
                    elif self.bench5 is None:
                        self.bench5 = player
                    elif self.bench6 is None:
                        self.bench6 = player
                    else:
                        self.benchOverflow.append(player)
            else:
                print(f"Roster for {self.team_name} is full")

        def drop_player(self, player):
            positions = ["QB", "RB1", "RB2", "WR1", "WR2", "TE", "FLEX", "K", "DEF", "bench1", "bench2", "bench3", "bench4", "bench5", "bench6"]
            for pos in positions:
                if getattr(self, pos) == player:
                    setattr(self, pos, None)
                    self.rosterSize -= 1
                    return
            if player in self.benchOverflow:
                self.benchOverflow.remove(player)
                self.rosterSize -= 1

    #draft players
    def draft(league, rounds):
        for i in range(rounds):
            for team in league.teams:
                #add player to team
                player_name = input("Player name")
                player_position = input("Player position")
                player_team = input("Player team")
                player = league.Player(player_name, player_position, player_team)
                team.add_player(player)
                #remove player from free agents
                league.free_agents.remove(player)
            #reverse draft order
            league.teams.reverse()
        return league
