


import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-us-container">
            <div className="hero-section">
                <h1 className="hero-title">About Us</h1>
                <p className="hero-subtitle">Your ultimate destination for Big 10 Fantasy Football</p>
            </div>
            <div className="content-section">
                <h2>Our Mission</h2>
                <p>
                    At Big 10 Fantasy Football, our mission is to bring fans closer to the action by providing an immersive and interactive fantasy football experience focused on the Big 10 Conference.
                </p>

                <h2>Who We Are</h2>
                <p>
                    We are a team of passionate football enthusiasts and tech professionals dedicated to delivering the best fantasy sports platform for Big 10 fans. Our diverse backgrounds combine expertise in software development, sports analytics, and community engagement.
                </p>

                <h2>Contact Us</h2>
                <p>
                    We'd love to hear from you! Whether you have a question, feedback, or just want to talk football, feel free to reach out.
                </p>
                <ul className="contact-list">
                    <li>Email: <a href="mailto:support@big10fantasyfootball.com">support@big10fantasyfootball.com</a></li>
                    <li>Twitter: <a href="https://twitter.com/Big10Fantasy">@Big10Fantasy</a></li>
                    <li>Facebook: <a href="https://facebook.com/Big10FantasyFootball">Big 10 Fantasy Football</a></li>
                </ul>
            </div>
        </div>
    );
};

export default AboutUs;
