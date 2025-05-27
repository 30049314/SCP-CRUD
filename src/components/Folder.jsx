import React from "react";
import "../App.css"; // Ensure styles are applied

function Folder({ children }) {
  return (
    <div className="folder"> {/* Ensure the folder class is applied */}
      <div className="folder-link"></div> {/* Side tab UI */}
      <div className="content">{children}</div> {/* Page content */}
    </div>
  );
}

export default Folder;
