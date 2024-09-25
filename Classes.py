class Player:
    def __init__(self, name, position, team):
        self.name = name # Player's name
        self.position = position  # e.g., "QB", "RB", "WR", "TE", "K", "DEF"
        self.team = team  # NFL team, e.g., "Chiefs", "Cowboys"
        #rushing stats
        self.rushing_yards = 0
        self.rushing_touchdowns = 0
        self.fumbles = 0
        self.fumbles_lost = 0
        self.rush_attempts = 0
        #passing stats
        self.passing_yards = 0
        self.passing_touchdowns = 0
        self.interceptions_thrown = 0
        self.pass_attempts = 0
        self.pass_completions = 0
        #receiving stats
        self.receiving_yards = 0
        self.receiving_touchdowns = 0
        self.receptions = 0
        self.targets = 0
        #kicking stats
        self.field_goals_missed = 0
        self.field_goals_made = 0
        self.field_goals_attempted = 0
        self.extra_points_missed = 0
        self.extra_points_made = 0
        self.extra_points_attempted = 0
        #defense stats
        self.sacks = 0
        self.interceptions = 0
        self.fumbles_forced = 0
        self.fumbles_recovered = 0
        self.touchdowns = 0
        self.points_allowed = 0
        self.special_teams_tds = 0
        self.safeties = 0
        self.blocked_kicks = 0
        #total stats
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
            print("Roster is full")

    def drop_player(self, player):
        if self.QB == player:
            self.QB = None
        elif self.RB1 == player:
            self.RB1 = None
        elif self.RB2 == player:
            self.RB2 = None
        elif self.WR1 == player:
            self.WR1 = None
        elif self.WR2 == player:
            self.WR2 = None
        elif self.TE == player:
            self.TE = None
        elif self.FLEX == player:
            self.FLEX = None
        elif self.K == player:
            self.K = None
        elif self.DEF == player:
            self.DEF = None
        elif self.bench1 == player:
            self.bench1 = None
        elif self.bench2 == player:
            self.bench2 = None
        elif self.bench3 == player:
            self.bench3 = None
        elif self.bench4 == player:
            self.bench4 = None
        elif self.bench5 == player:
            self.bench5 = None
        elif self.bench6 == player:
            self.bench6 = None
        else:
            self.benchOverflow.remove(player)
        self.rosterSize -= 1
        

class FantasyFootballLeague:
    def __init__(self, league_name):
        self.league_name = league_name
        self.teams = []
        self.teamLimit = 12
        self.free_agents = []

    def add_team(self, team_name):
        team = FantasyFootballRoster(team_name)
        self.teams.append(team)

    def add_free_agent(self, team_name, player):
        for team in self.teams:
            if team.team_name == team_name:
                team.add_player(player)
        self.free_agents.remove(player)

    def drop_player(self, team_name, player):
        for team in self.teams:
            if team.team_name == team_name:
                team.drop_player(player)
        self.free_agents.append(player)

    def trade_players(self, team1, team2, player1, player2):
        for team in self.teams:
            if team.team_name == team1:
                team.drop_player(player1)
                team.add_player(player2)
            if team.team_name == team2:
                team.drop_player(player2)
                team.add_player(player1)

    def score_week(self):
        for team in self.teams:
            team.total_points = 0
            team.total_points += team.QB.points
            team.total_points += team.RB1.points
            team.total_points += team.RB2.points
            team.total_points += team.WR1.points
            team.total_points += team.WR2.points
            team.total_points += team.TE.points
            team.total_points += team.FLEX.points
            team.total_points += team.K.points
            team.total_points += team.DEF.points
