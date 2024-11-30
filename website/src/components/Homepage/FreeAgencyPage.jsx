import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './FreeAgencyPage.css';
import supabase from '../../supabaseClient';


const FreeAgencyPage = ({ league = 'players' }) => {
    const [inputText, setInputText] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const [teams, setTeams] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlayersAndTeams = async () => {
            setLoading(true);
            try {
                // Fetch players
                let { data: playersData, error: playersError } = await supabase
                    .from(league)
                    .select('*');

                if (playersError) throw playersError;

                // Fetch teams
                let { data: teamsData, error: teamsError } = await supabase
                    .from('teams')
                    .select('*');

                if (teamsError) throw teamsError;

                // Create a lookup map for team names and other details
                const teamsMap = {};
                teamsData.forEach(team => {
                    teamsMap[team.team_id] = {
                        name: team.name,
                        abbreviation: team.abbreviation,
                        mascot: team.mascot,
                        division: team.division
                    };
                });

                setAllPlayers(playersData);
                setTeams(teamsMap);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchPlayersAndTeams();
    }, []);

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInputText(text);
        if (text !== '') {
            const filtered = allPlayers.filter(player =>
                player.name.toLowerCase().includes(text.toLowerCase())
            ).slice(0, 10);
            setFilteredPlayers(filtered);
        } else {
            setFilteredPlayers([]);
        }
    };

    if (loading) return <p>Loading players...</p>;
    if (error) return <p>Error fetching data: {error.message}</p>;

    return (
        <div className="FreeAgency">
            <div className="SearchBar">
                <input
                    type="text"
                    placeholder="Search for a player"
                    value={inputText}
                    onChange={handleInputChange}
                />
                {filteredPlayers.length > 0 && (
                    <ul className="PlayerList">
                        {filteredPlayers.map((player, index) => (
                            <li key={index} className="PlayerItem">
                                <Link to={`/free_agency/player/${player.player_id}`}>
                                    {player.name} - {player.position}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="AllPlayers">
                <h2>All Available Players</h2>
                <table className="PlayerTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Team</th>
                            <th>Fantasy Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allPlayers.map((player, index) => {
                            const team = teams[player.team_id];
                            return (
                                <tr key={index}>
                                    <td><Link to={`/free_agency/player/${player.player_id}`}>{player.name}</Link></td>
                                    <td>{player.position}</td>
                                    <td>{team ? `${team.name} (${team.abbreviation})` : 'Unknown Team'}</td>
                                    <td>{player.fantasy_points}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FreeAgencyPage;
