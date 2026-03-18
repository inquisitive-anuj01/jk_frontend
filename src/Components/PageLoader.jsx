import React from "react";
import "./PageLoader.css";

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader-content">
        <img 
          src="/original-0ae5d67617b849826e2628cfecae4333.gif" 
          alt="Loading..." 
          className="loader-gif"
        />
      </div>
    </div>
  );
}

export default PageLoader;
