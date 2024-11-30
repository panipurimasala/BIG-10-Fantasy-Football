import React from 'react'
import './Navbar.css';
import { Link } from 'react-router-dom';
import Profile_functionality from './Profile_functionality';

const Navbar = () => {
  return (
    //Creating the navbar
    <nav className="navbar">
      {/*This is built for the left of the navbar*/}
      <div className="navbar-left">
        <a href="/" className="logo">
          BIG10 Fantasy
        </a>
      </div>
      {/*This is the center of the navbar*/}
      <div className="navbar-center">
        <ul className="nav-links">
          <li>
            <a href="/league_page">Leagues</a>
          </li>
          <li>
            <a href="/about">About Us</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          <li>
            <a href="/mock_draft">Mock Draft</a>
          </li>
          <li>
            <a href="/FreeAgency">Free Agency</a>
          </li>

        </ul>
      </div>
      {/*This is the right of the navbar*/}
      <div className="navbar-right">
        {/* <a href="/LoginButton" className="user-icon">
          <i className="fas fa-user">Profile</i>
        </a> */}
        <Profile_functionality className='Profile_functionality' />
      </div>
    </nav>
  )
}

export default Navbar;