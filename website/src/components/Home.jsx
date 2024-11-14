import React from 'react'
import { useEffect, useState} from 'react';
import './Home.css';
import { FaFootballBall } from "react-icons/fa";
import injuriesData from "../assets/constants_file"
import InjuryCard from  "./InjuryCard"
import playersDat from '../assets/players_const';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import logo from '../assets/logosick.jpg';
import playwithfriends from '../assets/nottakenfromespn.png'

function ButtonLink({ to, children }) {
  return <Link to={to}><button className="btn-5">{children}</button></Link>;
}
function findTopPlayers (playerDict) {
    const playersArray = Object.entries(playerDict);
    playersArray.sort((a, b) => b[1].fantasy_points - a[1].fantasy_points);
    const topPlayersArray = playersArray.slice(0, 10);
    
    // Convert the sorted array back to an object
    const topPlayers = Object.fromEntries(topPlayersArray);
    
    return topPlayers;
}

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [playerDict, setPlayerDict] = useState({});
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
    
                setPlayerDict(playerMap);
            } catch (err) {
                console.error("Error fetching players:", err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchPlayers();
    }, []);
    const topPlayers = loading ? {} : findTopPlayers(playerDict);
  return (
  //Creating the home page
<div className="home">
    <div className="container">
        <div className="background"></div>

    <div className="upper_part">
    <div className="logo-container">
        <div className="learnff">How to Play</div>
        <div className="logo">
            <img src={logo} alt="Logo" />
        </div> </div>
            <h1 className =  "Title">BIG Ten Fantasy Football 2024</h1>
            <h2 className = "subtitle"> It isn't too late to play!</h2>
            <div>
                <ul className="draft_boxes"> 
                    
                    <li className = "dbox">
                        <div className="left_box_side">
                            <FaFootballBall />
                        </div>
                        <div className="right_box_side">
                            <ul className="rbox">
                                <li className = "boxheaders">
                                    Join a league
                                </li>
                                <li className="draft_descr">
                                    Play in our public leagues to get experience and have fun!
                                </li>                                
                            </ul>
                            <ButtonLink to="/League_Page">Join League</ButtonLink>
                        </div>
                    </li>
                    <li className = "dbox">
                    <div className="left_box_side">
                            <FaFootballBall />
                        </div>
                        <div className="right_box_side">
                            <ul className="rbox">
                                <li className="boxheaders">
                                    Create a league
                                </li>
                                <li className="draft_descr">
                                    Be a commissioner, set the rules you like and invite friends to play!
                                </li>                                
                            </ul>
                            <ButtonLink to="/League_Page">Create League</ButtonLink>
                        </div>
                    </li>
                </ul>
            </div>
            {/* Adding some appealing content */}
            <div className="top_players">
            <h2 className="top_playersheading">Top Players</h2>
            <ul className= "playerlist">
            {Object.entries(topPlayers).map(([key, player], index) => (
                                <li className="playernames" key={key}>
                                    {player.name} - {player.fantasy_points} points
                                </li>
                            ))}
            </ul>
            </div> 
            <div className="playwithfriends">
            <img  src= {playwithfriends} alt="cant see"/>
        </div>
        <div className="home_right">
            <div className="home">

            <div className="next_game">
            <h2>Next Game</h2>
            <p>Michigan vs Ohio State - Oct 21, 2024</p>
            </div>
            </div>
        </div>
        </div>
    </div>
    <div className="middle_part">

    </div>
</div>
  )
}

export default Home;