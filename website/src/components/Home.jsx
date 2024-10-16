import React from 'react'
import './Home.css';
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
                        One
                    </li>
                    <li className = "dbox">
                        Two
                    </li>
                </ul>
            </div>
            {/* Adding some appealing content */}
            <div className="top_players">
            <h2>Top Players</h2>
            <ul>
                <li>Player 1 - 100 pts</li>
                <li>Player 2 - 90 pts</li>
                <li>Player 3 - 85 pts</li>
            </ul>
            </div>
            {/*Creating the next game part of the webpage*/}
            <div className="next_game">
            <h2>Next Game</h2>
            <p>Michigan vs Ohio State - Oct 21, 2024</p>
            </div>
        </div>

        <div className="home_right">
            <div className="news_header">Big Ten Fantasy News</div>
            <hr></hr>
            <div>Dummy_Data</div>
            <div className="injuries">
                <h2>Injuries</h2>
                <hr></hr>
                <h4>List of injured people</h4>
                <a>View more Injuries</a>
            </div>
        </div>
    </div>
    <div className="middle_part">

    </div>
</div>
  )
}

export default Home;