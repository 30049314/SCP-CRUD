import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering
import App from './App'; // Import the main App component
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter for routing
import "./App.css"; // Import global CSS styles

// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);
