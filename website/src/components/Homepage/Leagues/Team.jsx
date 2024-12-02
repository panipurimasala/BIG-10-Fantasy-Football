import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../supabaseClient";
import './Team.css';



function addToTable(team, position) {
    //still bugged for wr and rb as they each have two slots
    if (team) {
        console.log(team);
        if (team[position].length === 0) {
            return "None";
        }
        else {
            const player = team[position][0];
            return player.name;
        }
    }
}


const teamTable = (team) => {
    return (
        <div className="table-container">
            <table className="starters-table">
                <thead className="starters-table-head"><tr><th colSpan="2">Your Team</th></tr></thead>
                <tbody className="starters-body">
                    <tr>
                        <td className = "position">QB</td>
                        <td className="player">{addToTable(team, "QB")}</td>
                    </tr>
                    <tr>
                        <td className = "position">RB</td>
                        <td className="player">{addToTable(team, "RB")}</td>
                    </tr>
                    <tr>
                        <td className = "position">RB</td>
                        <td className="player">{addToTable(team, "RB")}</td>
                    </tr>
                    <tr>
                        <td className = "position">WR</td>
                        <td className="player">{addToTable(team, "WR")}</td>
                    </tr>
                    <tr>
                        <td className = "position">WR</td>
                        <td className="player">{addToTable(team, "WR")}</td>
                    </tr>
                    <tr>
                        <td className = "position">TE</td>
                        <td className="player">{addToTable(team, "TE")}</td>
                    </tr>
                    <tr>
                        <td className = "position">FLEX</td>
                        <td className="player">{addToTable(team, "Flex")}</td>
                    </tr>
                    <tr>
                        <td className = "position">K</td>
                        <td className="player">{addToTable(team, "K")}</td>
                    </tr>
                </tbody>
            </table>
            <table className="benchTable">
                <thead>
                    <th className="benchTitle">Bench</th>
                </thead>
                <tbody>
                    {team["Bench"].map((player, index) => (
                        <tr key={index}>
                            <td className="benchRow"><span style={{ fontWeight: "bold"}}>{player.name} - </span> 
                            <span style={{fontStyle: "italic", color: "gray"}}>{player.position}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


const TeamPage = () => {
    const leagueName = useParams().leagueName;
    const [user, setUser] = useState(null);
    const [userTeam, setUserTeam] = useState(null);

    useEffect(() => {
        const getUserAndTeam = async() => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            const {data: userTeam, error: teamError} = await supabase
                .from(`${leagueName}_user_teams`)
                .select("team_players")
                .eq("user_id", user.id);
            
            if (teamError) {
                console.error("Error getting team" + teamError);
                return;
            }
            // console.log(userTeam[0].team_players);
            setUserTeam(userTeam[0].team_players);
        };
        getUserAndTeam();
    }, [])

    
    return userTeam ? teamTable(userTeam) : (
        <div>
            <h1>No Team Drafted</h1>
            <br />
            <h2>Draft To Get Started!!!</h2>
        </div>
    );
}
export default TeamPage;