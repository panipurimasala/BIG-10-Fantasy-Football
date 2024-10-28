import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';

const PlayerSummaryPage = () => {
    const { playerId } = useParams();  // Assume route is set up with :playerId
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlayer = async () => {
            setLoading(true);
            let { data, error } = await supabase
                .from('players')
                .select('*')
                .eq('player_id', playerId);

            if (error) {
                setError(error);
            } else if (data && data.length > 0) {
                setPlayer(data[0]);
            } else {
                setError('Player not found');
            }
            setLoading(false);
        };

        fetchPlayer();
    }, [playerId]);

    if (loading) return <p>Loading player details...</p>;
    if (error) return <p>{error.message || error}</p>;

    return (
        <div className="PlayerSummary">
            <h1>{player.name}</h1>
            <div className="player-details">
                <p><strong>Position:</strong> {player.position}</p>
                <p><strong>Status:</strong> {player.status}</p>
                <p><strong>Fantasy Points:</strong> {player.fantasy_points}</p>
            </div>
        </div>
    );
};

export default PlayerSummaryPage;
