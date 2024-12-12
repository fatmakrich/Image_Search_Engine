import Navbar from './Navbar';  // Import the Navbar component
import About from './About';  // Import the About component
import Description from './Description';  // Import the Description component
import Contact from './Contact';  // Import the Contact component
import './App.css';  // Optionally include global styles
import ImageUploader from './ImageUploader';  // Import the ImageUploader component

const App = () => {
  const handleNavClick = (event, target) => {
    event.preventDefault();
    window.location.hash = target;
  };

  return (
    <div className="App">
      {/* Navbar */}
      <Navbar handleNavClick={handleNavClick} />

      <main>
        {/* Image Uploader Component */}
        <ImageUploader />  

        {/* About Section */}
        <About />

        {/* Description Section */}
        <Description />

        {/* Contact Section */}
        <Contact />
      </main>

      <footer className="footer">
        <p>AIM 2024/2025</p>
      </footer>
    </div>
  );
};

export default App;
