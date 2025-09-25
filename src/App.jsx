import React, { useState } from "react";
import "./App.css";
import { DemoFlow } from "./DemoFlow"

function App() {
  const [isBlue, setIsBlue] = useState(false);

  return (
    <>
    <DemoFlow />
    <div className="app-container">
      <button onClick={() => setIsBlue(true)}>Make Blue</button>
      <button onClick={() => setIsBlue(false)}>Unset Blue</button>
      <div className="bucket">
        <div
          className="water"
          style={{
            height: isBlue ? "100%" : "0%",
          }}
        ></div>
      </div>
    </div>
    </>
  );
}

export default App;
