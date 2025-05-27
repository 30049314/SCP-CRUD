import { useRef } from "react"; // Importing useRef hook for referencing DOM elements
import { NavLink } from "react-router-dom"; // Importing NavLink for navigation links
import "../App.css"; // Importing global styles for the app
import { useSCP } from "../SCPContext"; // Importing custom context for managing SCP data

function NavMenu() {
  const { scpItems, loading } = useSCP(); // <-- Use context for data and loading
  const navRef = useRef(null); // Creating a reference for the nav element

  if (loading) return null; // Only render NavMenu when loading is false

  const scrollNav = (direction) => {
    if (!navRef.current) return; // Ensure navRef is defined

    const container = navRef.current; // Get the current nav element
    const tabs = Array.from(container.children); // Get all child elements (tabs) of the nav
    const scrollLeft = container.scrollLeft; // Get the current scroll position of the nav

    // Scroll to the next tab in the specified direction
    if (direction === "right") {
      for (let i = 0; i < tabs.length; i++) {
        const tabLeft = tabs[i].offsetLeft; // Get the left offset of the tab
        if (tabLeft > scrollLeft + 1) {
          container.scrollTo({ left: tabLeft, behavior: "smooth" }); // Scroll to the tab
          break; // Exit the loop after scrolling to the first tab in the direction
        }
      }
    } else {
      for (let i = tabs.length - 1; i >= 0; i--) {
        const tabLeft = tabs[i].offsetLeft; // Get the left offset of the tab
        const tabRight = tabLeft + tabs[i].offsetWidth; // Get the right offset of the tab
        // Check if part of tab is before visible area
        if (tabRight < scrollLeft - 1 || (i === 0 && tabLeft < scrollLeft)) {
          container.scrollTo({ left: tabLeft, behavior: "smooth" }); // Scroll to the tab
          break; // Exit the loop after scrolling to the first tab in the direction
        }
      }
    }
  };
  // Render the navigation menu
  return (
    <div className="navmenu-container"> {/* Container for the nav menu */}
      <button className="scroll-button" onClick={() => scrollNav("left")}>◀</button> {/* Button to scroll left */}
      <nav ref={navRef} className="navmenu"> {/* Navigation menu */}
        <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>HOME</NavLink> {/* Home link */}
        {scpItems.map((scp, index) => (
          <NavLink
            key={scp.item || index} // Use index as a fallback for the key
            to={`/${scp.item || "unknown"}`} // Fallback to "unknown" if 'item' is missing
            className={({ isActive }) => (isActive ? "active" : "")} 
            title={scp.item || "Unknown SCP"}> 
            {scp.item ? index + 1 : "?"} {/* Display "?" if 'item' is missing */}
          </NavLink> 
        ))}
        < NavLink to="/create"
          className={({ isActive }) => (isActive ? "active" : "")}
          title="Create New SCP Entry"> {/* Link to create new SCP entry */}
          +
        </NavLink>
      </nav>
      <button className="scroll-button" onClick={() => scrollNav("right")}>▶</button> {/* Button to scroll right */}
    </div>
  );
}

export default NavMenu;
