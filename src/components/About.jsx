// src/components/About.jsx
import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>Welcome to CrecheSpot</h1>
      <p>
        <strong>Discover Care, Find CrecheSpot.</strong>
      </p>
      <p>
        At CrecheSpot, we help you find the perfect creche for your little ones. Browse through a variety of creches within your area, complete with detailed information including price ranges, facilities, and care options. Our platform ensures that parents and creches connect seamlessly.
      </p>
      <h2>For Creche Owners:</h2>
      <p>
        We offer an easy-to-use platform to create and manage your creche profile. Once registered, you can:
      </p>
      <ul>
        <li>Update your creche’s information regularly to keep parents informed.</li>
        <li>View and manage applications from parents who are interested in enrolling their children at your creche.</li>
        <li>Change the status of applications (e.g., pending, accepted, declined) and even move an accepted application to a student status.</li>
      </ul>
      <p>
        Join CrecheSpot today to streamline your creche management and connect with parents looking for the best care for their children.
      </p>
    </div>
  );
};

export default About;
