import React from 'react';
import "../App.css"; // Import global styles for the app

function Footer() {
  // Function to smoothly scroll the page to the top when called
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <div className='footer'> {/* Container for the footer section */}
      {/* Back to Top link that triggers smooth scroll when clicked */}
      <h5>
        <a href="" onClick={scrollToTop} className="back-to-top"> {/* Link to scroll to top */}
          <strong>Back to Top</strong> 
        </a>
      </h5>
      {/* Footer copyright text */}
      <h6>&copy; 2024 SCP Foundation. All rights reserved.</h6> 
    </div>
  );
}

export default Footer;