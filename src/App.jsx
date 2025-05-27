import { useEffect } from "react"; // Import useEffect from React
import { Routes, Route, useLocation } from "react-router-dom"; // Import Routes and Route from react-router-dom
import Folder from "./components/Folder"; // Import Folder component
import Home from "./pages/Home"; // Import Home component
import SCPContent from "./pages/SCPContent"; // Import SCPContent component
import Index from "./pages/Index"; // Import Index component
import NavMenu from "./components/NavMenu"; // Import NavMenu
import { SCPProvider } from "./SCPContext"; // <-- Import the provider
import CreateSCP from "./pages/CreateSCP"; // Import CreateSCP component
import UpdateSCP from "./pages/UpdateSCP"; // Import UpdateSCP component

// App component
function App() {
  const { pathname } = useLocation(); // Track route changes

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on every route change
  }, [pathname]); // Effect to scroll to top

  const hideNavMenu = pathname === "/"; // Hide NavMenu on the landing page

  // Render the application
  return (
    <SCPProvider>
      <Folder className="folder">
        {!hideNavMenu && <NavMenu />} {/* Show NavMenu if not on landing page */}
        <Routes>
          <Route path="/" element={<Index />} /> {/* Landing Page */}
          <Route path="/home" element={<Home />} /> {/* SCP List Page */}
          <Route path="/:item" element={<SCPContent />} /> {/* SCP Detail Page */}
          <Route path="/create" element={<CreateSCP />} /> {/* Create SCP Page */}
          <Route path="/:item/update" element={<UpdateSCP />} /> {/* Update SCP Page */}
        </Routes>
      </Folder>
    </SCPProvider>
  );
}

export default App;
