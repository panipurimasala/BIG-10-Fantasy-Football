class FantasyFootballLeague:
    def __init__(self, league_name):
        self.league_name = league_name
        self.teams = []
        self.teamLimit = 12
        self.free_agents = []
        self.matchups = {}
        self.week = 1

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
            team.score_week()
    
    #assign matchups for each week
    def assign_matchups(self):
        for i in range(10): #10 weeks in a season
            matchups = []
            for j in range(self.teamLimit // 2):
                if i % self.teamLimit == j:
                    matchup = (self.teams[j], self.teams[(j + i + 1) % self.teamLimit])
                else:
                    matchup = (self.teams[self.teamLimit], self.teams[(j + i) % self.teamLimit])
                matchups.append(matchup)
            self.matchups[i] = matchups

    #simulate a week of matchups
    def score_league(self):
        for matchup in self.matchups[self.week]:
            team1, team2 = matchup
            team1_score = team1.score_week()
            team2_score = team2.score_week()
            if team1_score > team2_score:
                team1.wins += 1
                team2.losses += 1
            else:
                team2.wins += 1
                team1.losses += 1
            team1.season_points_scored += team1_score
            team2.season_points_scored += team2_score
            team1.season_points_scored_against += team2_score
            team2.season_points_scored_against += team1_score

    def seed_playoffs(self):
        self.teams.sort(key=lambda x: (x.wins, x.season_points_scored - x.season_points_scored_against), reverse=True)
        return self.teams[:6]
    
    def advance_week(self):
        self.week += 1

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
            self.field_goals_made_0_39 = 0
            self.field_goals_made_40_49 = 0
            self.field_goals_made_50_plus = 0
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

        def calculate_points(self):
            self.points = (
                self.rushing_yards // 10 
                + self.rushing_touchdowns * 6 
                - self.fumbles_lost * 1
                - self.fumbles * 1
                + self.passing_yards // 25 
                + self.passing_touchdowns * 4 
                - self.interceptions_thrown * 2 
                + self.receiving_yards // 10 
                + self.receiving_touchdowns * 6 
                + self.receptions * 1
                - self.field_goals_missed * 1
                + self.field_goals_made_0_39 * 3
                + self.field_goals_made_40_49 * 4
                + self.field_goals_made_50_plus * 5
                - self.extra_points_missed * 1
                + self.extra_points_made * 1
                + self.sacks * 1
                + self.interceptions * 2
                + self.fumbles_forced * 1
                + self.fumbles_recovered * 1
                + self.touchdowns * 6
                + self.special_teams_tds * 6
                + self.safeties * 2
                + self.blocked_kicks * 2
            )
            if self.points_allowed == 0:
                self.points += 10
            elif self.points_allowed <= 6:
                self.points += 7
            elif self.points_allowed <= 13:
                self.points += 4
            elif self.points_allowed <= 20:
                self.points += 1
            elif self.points_allowed <= 27:
                self.points += 0
            elif self.points_allowed <= 34:
                self.points -= 1
            else:
                self.points -= 4

    class FantasyFootballRoster:
        def __init__(self, team_name):
            self.team_name = team_name
            self.total_points = 0
            self.rosterSize = 0
            self.rosterLimit = 15
            self.wins = 0
            self.losses = 0
            self.season_points_scored = 0
            self.season_points_scored_against = 0
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

        def score_week(self):
            self.total_points = 0
            if self.QB: self.total_points += self.QB.calculate_points()
            if self.RB1: self.total_points += self.RB1.calculate_points()
            if self.RB2: self.total_points += self.RB2.calculate_points()
            if self.WR1: self.total_points += self.WR1.calculate_points()
            if self.WR2: self.total_points += self.WR2.calculate_points()
            if self.TE: self.total_points += self.TE.calculate_points()
            if self.FLEX: self.total_points += self.FLEX.calculate_points()
            if self.K: self.total_points += self.K.calculate_points()
            if self.DEF: self.total_points += self.DEF.calculate_points()

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
