import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase"; 

// 1. Define context at the top
const SCPContext = createContext(); 

// 2. Helper function
function parseArray(field) {
  if (!field) return []; // Check for null or undefined
  if (Array.isArray(field)) return field; // return if already an array
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field); // Try to parse JSON
      if (Array.isArray(parsed)) return parsed; // return if parsed is an array
      if (parsed) return [parsed]; // return as single item array
      return []; // return empty array if parsed is falsy
    } catch {
      if (field.includes(",")) {
        return field.split(",").map(s => s.trim()); // Split by comma and trim
      }
      return field.trim() ? [field] : []; // return as single item array if not empty
    }
  }
  return []; // return empty array for other types
}

// 3. Provider
export function SCPProvider({ children }) {
  const [scpItems, setScpItems] = useState([]); // State to hold SCP items
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch SCP items from Supabase
  useEffect(() => {
    const fetchSCPItems = async () => {
      const { data, error } = await supabase
        .from("scp_subjects")
        .select("*"); // Fetch all SCP items
      if (!error && data) {
        const withUrls = data.map(scp => {
          let imageUrls = []; // Initialize imageUrls
          const imagesArr = parseArray(scp.images); // Parse images field
          if (imagesArr.length > 0) {
            imageUrls = imagesArr.map(img =>
              supabase.storage.from("images").getPublicUrl(img).data?.publicUrl || null
            ); 
          }
          return { ...scp, imageUrls }; // Add imageUrls to each SCP item
        });
        // Preload images
        withUrls.forEach(scp => {
          if (scp.imageUrls && scp.imageUrls.length > 0) {
            scp.imageUrls.forEach(url => {
              if (url) {
                const img = new window.Image(); // Create a new image element
                img.src = url; // Set the source to the URL
              }
            }); 
          }
        });
        // Sort SCP items by item number
        const sorted = withUrls.sort((a, b) => {
          const numA = parseInt(a.item.replace(/\D/g, ""), 10);
          const numB = parseInt(b.item.replace(/\D/g, ""), 10); 
          return numA - numB;
        });
        setScpItems(sorted); // Update state with sorted SCP items 
      }
      setLoading(false); // Set loading to false after fetching
    };
    fetchSCPItems();  
  }, []);

  // Cleanup function to reset state on unmount
  return (
    <SCPContext.Provider value={{ scpItems, loading }}>
      {children}
    </SCPContext.Provider>
  );
}

// 4. useSCP hook
export function useSCP() {
  return useContext(SCPContext); 
}