// File: src/components/Homepage/MockDraft.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import './MockDraft.css'; // Ensure this CSS file exists
import LeagueDraftFunctionality from "./Leagues/Draft/LeagueDraftFunctionality"; // Adjusted import path

const MockDraft = () => {
    const { leagueName } = useParams();
    console.log("League Name from URL:", leagueName);
    const [teamName, setTeamName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [draftStarted, setDraftStarted] = useState(false);
    const [lengthofdraft, setLengthOfDraft] = useState(0);
    const [indOfPlayer, setIndOfPlayer] = useState(0);
    const [fbPlayerDict, setFbPlayerDict] = useState({});
    const [usersTeams, setUsersTeams] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const { data: playersData, error } = await supabase
                    .from('players')
                    .select('*');

                if (error) throw error;

                const playerMap = {};
                playersData.forEach(player => {
                    playerMap[player.name] = player;
                });

                setFbPlayerDict(playerMap);
            } catch (err) {
                console.error("Error fetching players:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    const navigateToLeagueFreeAgency = (name) => {
        console.log("Navigating to league free agency with name:", name);
        navigate(`/free_agency/${name}`);
    }

    const getTeamName = async () => {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
            console.error('Error fetching user:', authError);
            return 'No user found';
        }

        const { data: userLeagues, error: userError } = await supabase
            .from("user_leagues")
            .select("team_name")
            .eq("user_id", user.id);

        if (userError) {
            console.error('Error fetching user leagues:', userError);
            return 'Error fetching team name';
        }

        if (!userLeagues || userLeagues.length === 0) {
            return 'No team assigned';
        }

        return userLeagues[0].team_name;
    };

    useEffect(() => {
        const fetchTeamName = async () => {
            try {
                const teamNameFetched = await getTeamName();
                setTeamName(teamNameFetched);
            } catch (err) {
                setError('Error getting team name');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const getUsers = async () => {
            try {
                const { data: leagueData, error: leagueError } = await supabase
                    .from("leagues")
                    .select("leagueid")
                    .eq("league_name", leagueName);

                if (leagueError) throw leagueError;
                if (!leagueData || leagueData.length === 0) {
                    throw new Error("League not found");
                }

                const leagueIdValue = leagueData[0]["leagueid"];
                const { data: userTeamsData, error: userTeamsError } = await supabase
                    .from("user_leagues")
                    .select("team_name")
                    .eq("league_id", leagueIdValue);

                if (userTeamsError) throw userTeamsError;

                setUsers(userTeamsData);
                console.log("Users in league:", userTeamsData);
            } catch (err) {
                setError('Error fetching team names');
                console.error(err);
            }
        };

        fetchTeamName();
        getUsers();
    }, [leagueName]);

    const startDraft = () => {
        setDraftStarted(true);
        let tempUsersTeams = {};
        users.forEach(user => {
            tempUsersTeams[user.team_name] = { "QB": [], "RB": [], "WR": [], "TE": [], "K": [], "D/ST": [] };
        });
        setUsersTeams(tempUsersTeams);

        // Make a copy of the users array to shuffle
        const shuffledUsers = [...users];

        // Fisher-Yates shuffle
        for (let i = shuffledUsers.length - 1; i > 0; i--) {
            const randInd = Math.floor(Math.random() * (i + 1));
            [shuffledUsers[i], shuffledUsers[randInd]] = [shuffledUsers[randInd], shuffledUsers[i]];
        }

        // Set the shuffled array back to users state to re-render with the draft order
        setUsers(shuffledUsers);
        setLengthOfDraft(shuffledUsers.length);
    };

    const setCountInPage = (val) => {
        if (indOfPlayer === users.length - 1) {
            users.reverse();
        }
        setIndOfPlayer(val % users.length);
    }

    return (
        <div>
            <div className="leagueDraftTitleContainer">
                <h1 className="leagueDraftTitle">{leagueName} Mock Draft Page</h1>
                <p className="team-title">Your team: {teamName}</p>
            </div>
            <div className="draftContainer">
                <div className="draftFunction">
                    <LeagueDraftFunctionality onChangesInCount={setCountInPage} />
                </div>
                <div className="draftOrder">
                    <h2>Draft Order</h2>
                    {draftStarted ? (
                        "Draft ongoing"
                    ) : (
                        <button onClick={startDraft}>Start Draft</button>
                    )}
                    {draftStarted && (
                        <div>
                            <h3>Current team drafting: {users[indOfPlayer]?.team_name}</h3>
                            {users && users.length > 0 ? (
                                <ul>
                                    {users.map((user, index) => (
                                        <li key={index} className="teamItem">
                                            {user.team_name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No teams found in this league.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="userList">
                <h2>Teams in League</h2>
                {users && users.length > 0 ? (
                    <ul>
                        {users.map((user, index) => (
                            <li key={index} className="teamItem">
                                {user.team_name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No teams found in this league.</p>
                )}
            </div>
            <div>
                <button onClick={() => navigateToLeagueFreeAgency(leagueName)}>
                    Free Agency Page
                </button>
            </div>
        </div>
    );
};

export default MockDraft;