// File: src/components/Homepage/Contact.jsx

import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formStatus, setFormStatus] = useState('Send');

    const onSubmit = (e) => {
        e.preventDefault();
        setFormStatus('Submitting...');
        // Simulate form submission
        setTimeout(() => {
            setFormStatus('Submitted');
        }, 2000);
    };

    return (
        <div className="contact-container">
            <div className="contact-hero">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you! Please fill out the form below.</p>
            </div>
            <div className="contact-form-container">
                <form onSubmit={onSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Name<span>*</span></label>
                        <input type="text" id="name" name="name" required placeholder="Your Name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email<span>*</span></label>
                        <input type="email" id="email" name="email" required placeholder="Your Email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message<span>*</span></label>
                        <textarea id="message" name="message" required placeholder="Your Message"></textarea>
                    </div>
                    <button type="submit" className="submit-button">{formStatus}</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
