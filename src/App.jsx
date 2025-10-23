import React, { useState, useRef } from "react";
import "./App.css";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';


// GITC 2404 ethernet cable IP: http://128.235.43.17:8000
// Head node static IP internal cluster: http://192.168.1.1:8000
const CLUSTER_URL = "http://192.168.1.1:8000";

function App() {
  const [nodes, setNodes] = useState(1);
  const [cores, setCores] = useState(1);
  const [fillPercent, setFillPercent] = useState(0);
  const [timeTaken, setTimeTaken] = useState(null);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);
  const [animate, setAnimate] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  const coreTimes = {
    // Single node (ideal scaling)
    "1-1": 12.0,
    "1-2": 6.94,
    "1-3": 5.29,
    "1-4": 4.49,

    // Two nodes — slight network overhead (~10–15%)
    "2-1": 7.6,   // 2 total cores
    "2-2": 4.1,   // 4 total cores
    "2-3": 3.7,   // 6 total cores
    "2-4": 3.4,   // 8 total cores

    // Three nodes — stronger overhead (~20–25%)
    "3-1": 6.1,   // 3 total cores → worse than 1N×3C
    "3-2": 3.9,   // 6 total cores
    "3-3": 3.4,   // 9 total cores
    "3-4": 3.2    // 12 total cores
  };

  const handleSubmit = async () => {
    const key = `${nodes}-${cores}`;
    const totalCores = nodes * cores;
    const duration = coreTimes[key] || 12;
    const ledOffDelay = 3000;

    if (intervalRef.current) clearInterval(intervalRef.current);

    // Disable Submit button
    setIsDisabled(true);

    // Step 1: Try turning ON LEDs — fire and forget
    (async () => {
      try {
        await fetch(`${CLUSTER_URL}/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nodes, cores }),
        });
      } catch (error) {
        console.warn("LED start failed (continuing anyway):", error);
      }
    })();

    // Reset animation instantly
    setAnimate(false);
    setFillPercent(0);
    setTimeTaken(null);

    // Step 2: Wait 3 sec for LED sync (optional visual delay)
    await new Promise((r) => setTimeout(r, ledOffDelay));

    // Step 3: Start animation
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

          // Step 4: Try turning OFF LEDs — fire and forget
          setTimeout(() => {
            (async () => {
              try {
                await fetch(`${CLUSTER_URL}/stop`, { method: "POST" });
              } catch (error) {
                console.warn("LED stop failed (continuing anyway):", error);
              }
            })();
          }, ledOffDelay); // 3-second delay


          // Save history
          setHistory((prev) => [...prev, { nodes, cores, totalCores, duration }]);

          // Step 5: Re-enable button
          setTimeout(() => setIsDisabled(false), ledOffDelay + 1000);
        }
        setFillPercent(progress);
      }, 100);
    }, 50);
  };

  const showFullGraph = () => {
    // handleReset();
    // Step 1: Clear existing history
    setHistory([]);

    // Step 2: Build a new array of all (nodes, cores) pairs from coreTimes
    const fullHistory = Object.entries(coreTimes).map(([key, duration]) => {
      const [nodes, cores] = key.split("-").map(Number);
      return {
        nodes,
        cores,
        totalCores: nodes * cores,
        duration
      };
    });

    // Step 3: Fill history with all of them
    setHistory(fullHistory);
  }

  const handleReset = () => {
    // Step 1: Stop any running animation immediately
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Step 2: Try to turn OFF LEDs — fire and forget (non-blocking)
    (async () => {
      try {
        await fetch(`${CLUSTER_URL}/stop`, { method: "POST" });
      } catch (error) {
        console.warn("LED stop failed (continuing anyway):", error);
      }
    })();

    // Step 3: Instantly reset UI state
    setFillPercent(0);
    setTimeTaken(null);
    setNodes(1);
    setCores(1);
    setHistory([]);
    setAnimate(false);

    // Step 4: Re-enable Submit button
    setIsDisabled(false);

    // Step 5: Re-enable animation after a short delay for smooth restart
    setTimeout(() => setAnimate(true), 100);
  };


  return (
    <div className="container">
      <div className="header">
        <h1>High Performance Computing</h1>
        <button className="reset-btn" onClick={handleReset}>Reset</button>
        <button className="full-graph-btn" onClick={showFullGraph}>Full Graph</button>
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

        <button onClick={handleSubmit} disabled={isDisabled}>
          {isDisabled ? "Running..." : "Submit"}
        </button>

      </div>

      <div className="main">
        <div className="left">
          <ResponsiveContainer width="100%" height={'90%'}>
            <LineChart
              data={[...history]
                .map((h) => ({
                  totalCores: h.nodes * h.cores,
                  duration: h.duration,
                }))
                .sort((a, b) => {
                  // First, compare by totalCores
                  if (a.totalCores !== b.totalCores) {
                    return a.totalCores - b.totalCores;
                  }
                  // Tie-breaker: compare by duration
                  return a.duration - b.duration;
                })}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              {/* X Axis — Total Cores */}
              <XAxis
                dataKey="totalCores"
                type="number"
                domain={[1, 12]}
                ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                tick={{ fontSize: 22, fontWeight: "bold", fill: "#333" }}
                label={{
                  value: "Total Cores",
                  position: "bottom",
                  offset: 4,
                  style: { fontSize: 22, fontWeight: "bold" },
                }}
              />

              {/* Y Axis — Time (bottom = 1, top = 12) */}
              <YAxis
                type="number"
                domain={[1, 12]}
                ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                tick={{ fontSize: 22, fontWeight: "bold", fill: "#333" }}
                label={{
                  value: "Time (sec)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: { fontSize: 22, fontWeight: "bold" },
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

      {/* --- Amdahl’s Law Section --- */}
      <div
        style={{
          marginTop: "70px",
          textAlign: "center",
          fontSize: "1.8rem",
          lineHeight: "2.6rem",
          color: "#333",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", marginBottom: "16px", fontWeight: "600" }}>
          <span style={{ color: "#7c1dff" }}>Infinite cores ∞</span> (Amdahl's Law)
        </h2>

        <p style={{ marginBottom: "10px" }}>
          Parallel portion (P): 75% &nbsp;&nbsp;|&nbsp;&nbsp; Serial portion (S): 25%
        </p>

        {/* Proper math using KaTeX */}
        <div
          style={{
            marginTop: "25px",
            display: "inline-block",
            textAlign: "center",
            fontSize: "1.8rem",
          }}
        >
          <BlockMath math={String.raw`T(N) = (S \times T_1) + \frac{P \times T_1}{N}`} />
          <br/>          
          <BlockMath
            math={String.raw`
              T(\textcolor{#7c1dff}{\infty}) =
              (0.25 \times 12) +
              \frac{0.75 \times 12}{\textcolor{#7c1dff}{\infty}}
              \approx \textcolor{#7c1dff}{3\text{ s}}
            `}
          />
        </div>
        <br/>
        <p style={{ fontStyle: "monospace", marginTop: "18px" }}>
          → Parallelism gives us power; HPC turns that power into performance.
        </p>
        <p style={{ fontStyle: "monospace", marginTop: "18px", color: "#7c1dff", fontSize: "2.5rem" }}>
          → This curve isn’t the end — it’s the starting point of optimization.
        </p>
        <p style={{ fontStyle: "italic", marginTop: "18px" }}>
          → The serial fraction is the ceiling — HPC is how we keep raising it.
        </p>
        <p style={{ fontStyle: "monospace", marginTop: "18px" }}>
          → Even with infinite cores, the challenge is to make the serial part smaller — that’s where real HPC magic begins.
        </p>
        <p style={{ fontStyle: "italic", marginTop: "18px"}}>
          → Real HPC work means pushing that curve down.
        </p>        
      </div>


    </div>
  );
}

export default App;
