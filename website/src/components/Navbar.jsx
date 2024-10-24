import React from 'react'
import './Navbar.css';
import { Link } from 'react-router-dom';
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
            <a href="/players">Your Players</a>
          </li>
          <li>
            <a href="/league_page">Leagues</a>
          </li>
          <li>
            <a href="/about">About Us</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          <Link to="/draft_page">Draft</Link>
  
        </ul>
      </div>
      {/*This is the right of the navbar*/}
      <div className="navbar-right">
        <a href="/account" className="user-icon">
          <i className="fas fa-user">Profile</i>
        </a>
      </div>
  </nav>
  )
}

export default Navbar;