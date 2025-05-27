import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Footer from "../components/Footer.jsx"; // Import Footer component
import "../App.css"; // Import CSS styles
import { useSCP } from "../SCPContext"; // <-- Import the context

// Home component
function Home() {
  const { scpItems, loading } = useSCP(); // <-- Use context

  if (loading) return null; // Don't render until loaded

  // Shuffle and pick 5 random SCPs
  const featured = [...scpItems]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  // Check if there are any SCPs
  return (
    <div className="content">
      <div className="page">
        <h1>Welcome to the SCP Foundation</h1>
        <p>
          Explore the mysterious and classified SCPs documented by the Foundation.
          <br />
          Click on an SCP below to learn more about its unique characteristics.
        </p>
        <h2>10 Featured SCPs:</h2>
        <div className="scp-list">
          {featured.map((scp) => (
            <article className="scp-item" key={scp.item}>
              <Link to={`/${scp.item}`}>
                <h3>{scp.item}: {scp.name}</h3>
              </Link>
            </article>
          ))}
          <Link to="/create" className="create-link">Create New SCP</Link>
        </div>
        <Footer />
      </div>
      <Link to="/" className="folder-link">
        <strong>CLOSE</strong>
      </Link>
    </div>
  );
}

export default Home;