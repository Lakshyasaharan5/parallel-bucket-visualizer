import React, { useState } from "react";
import "./App.css";

function App() {
  const [isBlue, setIsBlue] = useState(false);

  return (
    <div className="app-container">
      <div className="bucket">
        <div
          className="water"
          style={{
            height: isBlue ? "100%" : "0%",
          }}
        ></div>
      </div>
      <button onClick={() => setIsBlue(true)}>Make Blue</button>
      <button onClick={() => setIsBlue(false)}>Unset Blue</button>
    </div>
  );
}

export default App;
