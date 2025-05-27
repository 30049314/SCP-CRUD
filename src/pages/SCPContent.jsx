import { useParams, Link } from "react-router-dom"; // Importing useParams and Link from react-router-dom
import Footer from "../components/Footer"; // Importing Footer component
import { supabase } from "../supabase"; // Importing supabase client
import { useSCP } from "../SCPContext"; // Importing custom hook to fetch SCP data

// This component displays the content of a specific SCP item based on the URL parameter
function SCPContent() {
  const { item } = useParams(); // Extracting the 'item' parameter from the URL
  const { scpItems, loading } = useSCP(); // Using custom hook to get SCP items and loading state

  if (loading) return null; // If loading, return null to avoid rendering before data is fetched

  const scpData = scpItems.find(scp => scp.item === item); // Finding the specific SCP data based on the 'item' parameter
  if (!scpData) {
    return (
      <div className="content">
        <div className="page">
          <h1>Loading...</h1>
        </div>
      </div>
    ); // If no data found, show loading message
  }

  // Helper function to safely parse arrays
  const parseArray = (field) => {
    if (!field) return []; // If field is null or undefined, return empty array
    if (Array.isArray(field)) return field; // If it's already an array, return it
    if (typeof field === "string") {
      try {
        const parsed = JSON.parse(field); // Attempt to parse JSON
        if (Array.isArray(parsed)) return parsed; // If parsed successfully and it's an array, return it
        if (parsed) return [parsed]; // If parsed but not an array, wrap it in an array
        return []; // If parsed but not an array, return empty array
      } catch {
        // If it's just a plain string, not JSON
        return field.trim() ? [field] : []; // If it's a non-empty string, wrap it in an array
      }
    }
    return []; // If it's neither a string nor an array, return empty array
  };

  // Render the SCP content
  return (
    <div className="content">
      <div className="page">
        <h1>{scpData.item || "Unknown SCP"}: {scpData.name || "No Name Available"}</h1>
        {parseArray(scpData.objectClass).length > 0 && (
          <div>
            <h3>Object Class:</h3>
            {parseArray(scpData.objectClass).map((cls, index) => (
              <span key={index} dangerouslySetInnerHTML={{ __html: cls }} />
            ))}
          </div>
        )}

        {scpData.description && parseArray(scpData.description).length > 0 && (
          <div>
            <h3><strong>Description:</strong></h3>
            {parseArray(scpData.description).map((desc, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: desc }} />
            ))}
          </div>
        )}

        {scpData.specialContainmentProcedure && parseArray(scpData.specialContainmentProcedure).length > 0 && (
          <div>
            <h3>Special Containment Procedure:</h3>
            {parseArray(scpData.specialContainmentProcedure).map((proc, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: proc }} />
            ))}
          </div>
        )}

        {/* Handle both old 'image' (string) and new 'images' (array or JSON string) */}
        {(() => {
          const imageUrls = scpData.imageUrls || parseArray(scpData.images).map(img => {
            const { data } = supabase.storage.from("images").getPublicUrl(img); // Fetching public URL from Supabase
            return data?.publicUrl || null; // Return null if public URL is not available
          }).filter(url => url); // Filter out null URLs
          if (imageUrls.length > 0) {
            return (
              <div className="scp-images">
                {imageUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`SCP Image ${idx + 1}`}
                    className="img_align"
                    onError={() => console.error(`Failed to load image: ${url}`)} // Debug log
                  />
                ))}
              </div>
            );
          } else if (scpData.image) {
            const { data } = supabase.storage.from("images").getPublicUrl(scpData.image); // Fetching public URL from Supabase
            if (!data?.publicUrl) return <div>Image not found: {scpData.image}</div>; // Debug log
            return (
              <div className="scp-images">
                <img
                  src={data.publicUrl}
                  alt={scpData.image}
                  className="img_align"
                  onError={() => console.error(`Failed to load image: ${data.publicUrl}`)} // Debug log
                />
              </div>
            );
          }
          return null;
        })()}

        {scpData.addendum && parseArray(scpData.addendum).length > 0 && (
          <div>
            {parseArray(scpData.addendum).map((add, index) => (
              <div key={index}>
                <h4>{add.title}</h4>
                <p dangerouslySetInnerHTML={{ __html: add.content }} />
              </div>
            ))}
          </div>
        )}

        {scpData.reference && parseArray(scpData.reference).length > 0 && (
          <div>
            <h3>Reference:</h3>
            {parseArray(scpData.reference).map((ref, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: ref }} />
            ))}
          </div>
        )}

        {scpData.chronologicalHistory && parseArray(scpData.chronologicalHistory).length > 0 && (
          <div>
            <h3>Chronological History:</h3>
            {parseArray(scpData.chronologicalHistory).map((history, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: history }} />
            ))}
          </div>
        )}

        {scpData.spaceTimeAnomalies && parseArray(scpData.spaceTimeAnomalies).length > 0 && (
          <div>
            <h3>Space-Time Anomalies:</h3>
            {parseArray(scpData.spaceTimeAnomalies).map((anomaly, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: anomaly }} />
            ))}
          </div>
        )}

        {scpData.additionalNotes && parseArray(scpData.additionalNotes).length > 0 && (
          <div>
            <h3>Additional Notes:</h3>
            {parseArray(scpData.additionalNotes).map((note, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: note }} />
            ))}
          </div>
        )}

        {scpData.appendix && parseArray(scpData.appendix).length > 0 && (
          <div>
            <h3>Appendix:</h3>
            {parseArray(scpData.appendix).map((append, index) => (
              <div key={index}>
                <h4>{append.title}</h4>
                {Array.isArray(append.content) ? (
                  append.content.map((line, lineIndex) => (
                    <p key={lineIndex} dangerouslySetInnerHTML={{ __html: line }} />
                  ))
                ) : (
                  <p dangerouslySetInnerHTML={{ __html: append.content }} />
                )}
              </div>
            ))}
          </div>
        )}


        {scpData.footnotes && (
          <div>
            <h3>Footnotes:</h3>
            <p className="footnote" dangerouslySetInnerHTML={{ __html: scpData.footnotes }} />
          </div>
        )}
        <Link to={`/${scpData.item}/update`} className="update-link"><strong>Update {scpData.item}</strong></Link>
        <Footer />
      </div>
      <Link to="/" className="folder-link"><strong>CLOSE</strong></Link>
    </div>
  );
}

export default SCPContent;