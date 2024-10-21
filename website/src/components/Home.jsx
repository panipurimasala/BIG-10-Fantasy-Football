import React from 'react'
import './Home.css';
import { FaFootballBall } from "react-icons/fa";
import injuriesData from "../assets/constants_file"
import InjuryCard from  "./InjuryCard"
import playersDat from '../assets/players_const';
const Home = () => {
  return (
  //Creating the home page
<div className="home">
    <div className="upper_part">
        {/*This is the left part of the home page where we should put the draft boxes, news info*/}
        <div className="home_left">
            <h1>BIG Ten Fantasy Football 2024</h1>
            <h3> It isn't too late to play!</h3>
            <div>
                <ul className="draft_boxes">
                    
                    <li className = "dbox">
                        <div className="left_box_side">
                            <FaFootballBall />
                        </div>
                        <div className="right_box_side">
                            <ul className="rbox">
                                <li>
                                    Join a league
                                </li>
                                <li className="draft_descr">
                                    Play in our public leagues to get experience and have fun!
                                </li>                                
                            </ul>
                            <button>Join league</button>
                        </div>
                    </li>
                    <li className = "dbox">
                    <div className="left_box_side">
                            <FaFootballBall />
                        </div>
                        <div className="right_box_side">
                            <ul className="rbox">
                                <li>
                                    Create a league
                                </li>
                                <li className="draft_descr">
                                    Be a commissioner, set the rules you like and invite friends to play!
                                </li>                                
                            </ul>
                            <button>Create league</button>
                        </div>
                    </li>
                </ul>
            </div>
            {/* Adding some appealing content */}
            <div className="top_players">
            <h2>Top Players</h2>
            <ul>
                {playersDat.map((player,index) =>(
                    <li>{index+1}. {player.name} - {player.points}</li>
                ))}
            </ul>
            </div>
            <div className="news_header">Big Ten Fantasy News</div>
            <hr></hr>
            <div>Dummy_Data</div>
        </div>

        <div className="home_right">
            <div className="home">
            {/* Other code */}
            <div className="injuries">
                <h2>Injuries</h2>
                {injuriesData.map((player, index) => (
                <InjuryCard 
                    playerImage={player.playerImage}
                    name={player.name}
                    team={player.team}
                    position={player.position}
                    status={player.status}
                    injury={player.injury}
                />
                ))}
                {/* <a href="#">View more Injuries</a> */}
            </div>
            {/*Creating the next game part of the webpage*/}
            <div className="next_game">
            <h2>Next Game</h2>
            <p>Michigan vs Ohio State - Oct 21, 2024</p>
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