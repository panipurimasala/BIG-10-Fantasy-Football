import React, { useState, useEffect } from "react";
import { json, useParams } from "react-router-dom";
import './MockDraft.css';
import supabase from "../supabaseClient";
import './LeagueDraft.css';
import MockDraft from "./MockDraft";

const LeagueDraft = () => {
    const { name } = useParams();
    const [teamName, setTeamName] = useState(null); // State to store the team name
    const [loading, setLoading] = useState(true);  // Loading state to show a loading indicator
    const [error, setError] = useState(null);      // Error state to catch any errors
    const [users, setUsers] = useState(null);
    

    
    const getTeamName = async () => {
        // Get the authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        // Handle any authentication errors
        if (authError) {
            console.error('Error fetching user:', authError);
            return 'No user found'; // Return a default string if there's an auth error
        }
    
        
        const {data: leagueNames, error: userError1 } = await supabase
            .from("leagues")
            .select("leagueid")
            .eq("league_name",name);
        if (userError1) {
            console.error('Error fetching user leagues:', userError1);
        }
        const league_id = leagueNames[0].leagueid;

        const { data: userLeagues, error: userError2 } = await supabase
            .from("user_leagues")
            .select("team_name")
            .eq("user_id", user.id)
            .eq("league_id", league_id);
        if (userError2) {
            console.error('Error fetching user leagues:', userError2);
            return 'Error fetching team name'; // Return a default string if there's an error
        }
    
        // If no team_name is found, return a default message
        if (!userLeagues || userLeagues.length === 0) {
            return 'No team assigned'; // Return a default string when no team is found
        }
    
        // Otherwise, return the first team_name found
        return userLeagues[0].team_name; // Returns a string
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
            setLoading(false); // set loading to false after getting team name
        }
        };
        const getUsers = async () => {
            try {
                const leagueid= await supabase.from("leagues").select("leagueid").eq("league_name", name);
                const l = leagueid.data[0]["leagueid"]
                const userss = await supabase.from("user_leagues").select("team_name").eq("league_id", l);
                setUsers(userss.data);
            } catch (err) {
                setError('Error fetching team name');
                console.error(err);
            }
        };
        getUsers();
        fetchTeamName();
    }, []); 

    const mapUsers = async() =>{
        return (
            <div className="userList">
            <h2>Teams in League</h2>
            {users.length > 0 ? (
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
        )
    }
    

    return (
        <div>
            <div className="leagueDraftTitleContainer">
                <h1 className="leagueDraftTitle">{name} Draft Page</h1>
                <p className="team-title">{teamName}</p>
            </div>
            <div className="draftContainer">
                <div className="draftFunction"><MockDraft /></div>
                <div className="draftOrder">
                    <h2>Draft Order</h2>
                    <p>No draft scheduled right now, <br />but feel free to play around with the mock draft</p>
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
        </div>
    );
}

export default LeagueDraft;