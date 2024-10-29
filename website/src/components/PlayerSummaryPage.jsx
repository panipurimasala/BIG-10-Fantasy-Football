import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PlayerSummaryPage.css';
import supabase from '../supabaseClient';

const PlayerSummaryPage = () => {
    const { playerId } = useParams(); // Using playerId from the URL
    const [player, setPlayer] = useState(null);
    const [weeklyStats, setWeeklyStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlayerAndStats = async () => {
            if (!playerId) {
                setError('Invalid player ID');
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const parsedPlayerId = parseInt(playerId, 10);
                if (isNaN(parsedPlayerId)) {
                    throw new Error('Invalid player ID');
                }

                console.log("Fetching player with ID:", parsedPlayerId); // Debugging log

                // Fetch player data using playerId
                const { data: playerData, error: playerError } = await supabase
                    .from('players')
                    .select('*')
                    .eq('player_id', parsedPlayerId)
                    .maybeSingle(); // Use maybeSingle to handle cases with no matching data

                if (playerError) {
                    console.error("Error fetching player:", playerError); // Log the error
                    throw playerError;
                }
                if (!playerData) {
                    throw new Error('Player not found');
                }
                setPlayer(playerData);

                // Fetch weekly stats for the player using player_id
                const { data: statsData, error: statsError } = await supabase
                    .from('weekly_stats')
                    .select('*')
                    .eq('player_id', parsedPlayerId);

                if (statsError) {
                    console.error("Error fetching weekly stats:", statsError); // Log the error
                    throw statsError;
                }
                setWeeklyStats(statsData);

                setLoading(false);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching data');
                setLoading(false);
            }
        };

        fetchPlayerAndStats();
    }, [playerId]);

    if (loading) return <p>Loading player details...</p>;
    if (error) return <p>Error fetching data: {error}</p>;

    return (
        <div className="PlayerSummary">
            <h1>{player?.name}</h1>
            <div className="player-details">
                <p><strong>Position:</strong> {player?.position}</p>
                <p><strong>Status:</strong> {player?.status}</p>
                <p><strong>Fantasy Points:</strong> {player?.fantasy_points}</p>
            </div>
            <div className="weekly-stats">
                <h2>Weekly Stats</h2>
                {weeklyStats.length > 0 ? (
                    <table className="WeeklyStatsTable">
                        <thead>
                            <tr>
                                <th>Week</th>
                                <th>Season</th>
                                <th>Game Date</th>
                                <th>Player Stats</th>
                            </tr>
                        </thead>
                        <tbody>
                            {weeklyStats.map((stat) => (
                                <tr key={stat.stat_id}>
                                    <td>{stat.week}</td>
                                    <td>{stat.season}</td>
                                    <td>{stat.game_date}</td>
                                    <td>
                                        {Object.entries(JSON.parse(stat.player_stats)).map(([key, value]) => (
                                            <p key={key} className="player-stat">{`${key}: ${value}`}</p>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No weekly stats available.</p>
                )}
            </div>
            <div className="back-to-agency">
                <Link to="/free_agency">Back to Free Agency</Link>
            </div>
        </div>
    );
};

export default PlayerSummaryPage;
