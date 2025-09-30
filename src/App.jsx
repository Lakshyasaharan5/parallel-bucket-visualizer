import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [nodes, setNodes] = useState(1);
  const [cores, setCores] = useState(1);
  const [fillPercent, setFillPercent] = useState(0);
  const [timeTaken, setTimeTaken] = useState(null);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);
  const [animate, setAnimate] = useState(true);

  const coreTimes = {
    1: 12, 2: 8, 3: 6.5, 4: 5,
    6: 3.8, 8: 3.2,
    9: 3, 12: 2.8
  };

  const handleSubmit = () => {
    const totalCores = nodes * cores;
    const duration = coreTimes[totalCores] || 12;

    if (intervalRef.current) clearInterval(intervalRef.current);

    // Reset animation
    setAnimate(false);
    setFillPercent(0);
    setTimeTaken(null);

    setTimeout(() => {
      setAnimate(true);

      let progress = 0;
      intervalRef.current = setInterval(() => {
        progress += 100 / (duration * 10);
        if (progress >= 100) {
          progress = 100;
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTimeTaken(duration);

          // Add entry to history once finished
          setHistory((prev) => [
            ...prev,
            { nodes, cores, totalCores, duration }
          ]);
        }
        setFillPercent(progress);
      }, 100);
    }, 50);
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setFillPercent(0);
    setTimeTaken(null);
    setNodes(1);
    setCores(1);
    setHistory([]); // clear history too
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
          Cores-per-node:
          <select value={cores} onChange={(e) => setCores(Number(e.target.value))}>
            {[1, 2, 3, 4].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <button onClick={handleSubmit}>Submit</button>
      </div>
      
      <div class="main">
        <div class="left">Graph here</div>
        <div class="center">
          <div className="bucket">
            <div
              className="water"
              style={{
                height: `${fillPercent}%`,
                transition: animate ? "height 0.3s linear" : "none"
              }}
            >
              {timeTaken && <span className="time-text">Time: {timeTaken} sec</span>}
            </div>
          </div>
        </div>
        <div class="right">
          <h3>History</h3>
          {history.map((h, i) => (
            <div key={i}>
              {h.nodes} node(s), {h.cores} core(s) → {h.duration} sec
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;
