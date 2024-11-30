// File: src/components/Homepage/Leagues/LeagueHomePage.jsx

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './LeagueHomePage.css';

const LeagueHomePage = () => {
    const { leagueName } = useParams();

    return (
        <div className="league-home-page">
            <h1>{leagueName} League Home Page</h1>
            <nav className="league-home-navbar">
                <ul className="league-home-nav-links">
                    <li>
                        <Link to={`/league_draft/${leagueName}`}>League Draft</Link>
                    </li>
                    <li>
                        <Link to={`/team_page/${leagueName}`}>Team Page</Link>
                    </li>
                    <li>
                        <Link to={`/league_free_agency/${leagueName}`}>League Free Agency</Link>
                    </li>
                </ul>
            </nav>
            {/* Add additional content or components as needed */}
        </div>
    );
};

export default LeagueHomePage;
