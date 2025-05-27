import { Link } from "react-router-dom"; // Importing Link from react-router-dom for navigation
import "../App.css"; // Importing CSS styles

// Index component
function Index() {
  return (
    <div className="index"> {/* Main container for the index page */}
      <div className="declassified"></div> {/* Declassified Stamp */}
      <img src="/images/LOGO-SCP2.png" alt="SCP Logo" className="logo" /> {/* SCP Logo */}
      <div className="casefile">CASE FILE NO:</div> {/* Case File Label */}
      <div className="casefileno">30049314</div> {/* Case File Number */}
      <Link to="/home" className="folder-link"><strong>OPEN</strong></Link> {/* Open link, navigating to the home page */}
      <div className="footer-index"> {/* Footer section */}
        <h6>&copy; 2024 SCP Foundation. All rights reserved.</h6> 
      </div> 
    </div> 
  );
}

export default Index;
