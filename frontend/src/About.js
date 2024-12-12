// About.js
import React from 'react';
import './About.css';
import Image1 from './image1.jpg';  // Notez l'utilisation de './'
import Image2 from './image2.png';  // Notez l'utilisation de './'

const About = () => (
  <section id="about" className="about-section">
    <h2>About US</h2>
    <div className="about-content">
      <div className="about-text">
        <p>This project is a modern image search engine that allows you to upload an image and retrieve visually similar ones using advanced search algorithms.</p>
        <h3>Prepared by:</h3>
      </div>
      <div className="about-images">
        <div className="team-member">
          <img src={Image1} alt="Malek Elmechi" className="about-image" />
          <p>Malek Elmechi</p>
        </div>
        <div className="team-member">
          <img src={Image2} alt="Fatma Krichen" className="about-image" />
          <p>Fatma Krichen</p>
        </div>
      </div>
    </div>
  </section>
);

export default About;
