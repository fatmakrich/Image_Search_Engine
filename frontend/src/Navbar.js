// Navbar.js
import React from 'react';
import './Navbar.css';

const Navbar = ({ handleNavClick }) => (
  <header className="header">
    <nav className="navbar">
      <a href="#about us" onClick={(e) => handleNavClick(e, '#about us')}>About us</a>
      <a href="#description" onClick={(e) => handleNavClick(e, '#description')}>Description</a>
      <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a>
    </nav>
  </header>
);

export default Navbar;
