import React, { useState, useRef } from "react";
import "./App.css";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

function App() {
  const [nodes, setNodes] = useState(1);
  const [cores, setCores] = useState(1);
  const [fillPercent, setFillPercent] = useState(0);
  const [timeTaken, setTimeTaken] = useState(null);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);
  const [animate, setAnimate] = useState(true);

  const coreTimes = {
    "1-1": 12,
    "2-1": 8,
    "1-2": 7.5,
    "3-1": 6.5,
    "1-3": 6,
    "2-2": 5.5,
    "1-4": 5,
    "3-2": 4,
    "2-3": 3.8,
    "2-4": 3.2,
    "3-3": 3.0,
    "3-4": 2.8
  };

  const handleSubmit = () => {
    const key = `${nodes}-${cores}`;
    const totalCores = nodes * cores;
    const duration = coreTimes[key] || 12;

    if (intervalRef.current) clearInterval(intervalRef.current);

    // Reset animation instantly
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

          // Save history
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

      <div className="main">
        <div className="left">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={[...history]
                .map((h) => ({
                  totalCores: h.nodes * h.cores,
                  duration: h.duration,
                }))
                .sort((a, b) => a.totalCores - b.totalCores)}              
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              {/* X Axis — Total Cores */}
              <XAxis
                dataKey="totalCores"
                type="number"
                domain={[1, 12]}
                ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                label={{
                  value: "Total Cores",
                  position: "insideBottom",
                  offset: -5,
                  style: { fontSize: 16, fontWeight: "bold" },
                }}
              />

              {/* Y Axis — Time (bottom = 1, top = 12) */}
              <YAxis
                type="number"
                domain={[1, 12]}
                ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                label={{
                  value: "Time (sec)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: { fontSize: 16, fontWeight: "bold" },
                }}
              />

              <Tooltip
                formatter={(val, name, props) => [
                  `${val} sec`,
                  `${props.payload.totalCores} cores`,
                ]}
              />

              <Line
                type="monotone"
                dataKey="duration"
                stroke="#7c4dff"
                strokeWidth={3}
                dot={{ r: 6, fill: "#7c4dff" }}
                activeDot={{ r: 8, fill: "#7c4dff" }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>





        <div className="center">
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
        <div className="right">
          <h3>History</h3>
          {history.map((h, i) => (
            <div key={i}>
              {h.nodes}N x {h.cores}C → {h.duration} sec
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;
