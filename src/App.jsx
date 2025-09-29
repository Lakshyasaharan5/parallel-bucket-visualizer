import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [nodes, setNodes] = useState(1);
  const [cores, setCores] = useState(1);
  const [fillPercent, setFillPercent] = useState(0);
  const [timeTaken, setTimeTaken] = useState(null);
  const intervalRef = useRef(null);

  const coreTimes = {
    1: 12, 2: 11, 3: 10, 4: 9,
    5: 8, 6: 7, 7: 6, 8: 5,
    9: 4, 10: 3, 11: 2, 12: 1,
  };

  const handleSubmit = () => {
    const totalCores = nodes * cores;
    const duration = coreTimes[totalCores] || 12;

    if (intervalRef.current) clearInterval(intervalRef.current);
    setFillPercent(0);
    setTimeTaken(null);

    let progress = 0;
    intervalRef.current = setInterval(() => {
      progress += 100 / (duration * 10);
      if (progress >= 100) {
        progress = 100;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTimeTaken(duration);
      }
      setFillPercent(progress);
    }, 100);
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setFillPercent(0);
    setTimeTaken(null);
    setNodes(1);
    setCores(1);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>High Performance Computing</h1>
        <button className="reset-btn" onClick={handleReset}>Reset</button>
      </div>

      <div className="controls">
        <label>
          Nodes:
          <select value={nodes} onChange={(e) => setNodes(Number(e.target.value))}>
            {[1, 2, 3].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <label>
          Cores per Node:
          <select value={cores} onChange={(e) => setCores(Number(e.target.value))}>
            {[1, 2, 3, 4].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <button onClick={handleSubmit}>Submit</button>
      </div>

      <div className="bucket">
        <div
          className="water"
          style={{ height: `${fillPercent}%` }}
        >
          <div className="wave"></div>
          {timeTaken && <span className="time-text">Time: {timeTaken} sec</span>}
        </div>
      </div>
    </div>
  );
}

export default App;
