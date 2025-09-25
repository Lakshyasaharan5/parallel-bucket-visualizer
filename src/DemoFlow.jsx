import React, { useState } from "react";

export function DemoFlow() {
  const TOTAL_BUCKETS = 20;
  const [nodes, setNodes] = useState(1);
  const [tasks, setTasks] = useState(1);
  const [filledCount, setFilledCount] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const startJob = async () => {
    const workers = nodes * tasks;
    setFilledCount(0); // reset

    // tell backend to trigger lights
    await fetch("http://128.235.43.17:8000/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodes, tasks }),
    });

    // schedule buckets filling in waves
    const id = setInterval(() => {
      setFilledCount((prev) => {
        const next = Math.min(prev + workers, TOTAL_BUCKETS);
        if (next >= TOTAL_BUCKETS) {
          clearInterval(id);
          setIntervalId(null);
        }
        return next;
      });
    }, 1000); // one wave per second

    setIntervalId(id);
  };

  const stopJob = async () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setFilledCount(0);

    await fetch("http://128.235.43.17:8000/stop", { method: "POST" });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Pi Cluster Demo (Parallel Buckets)</h1>

      <div style={{ marginBottom: "15px" }}>
        <label>
          Nodes:
          <select value={nodes} onChange={(e) => setNodes(Number(e.target.value))}>
            {[1, 2, 3].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: "20px" }}>
          Tasks per Node:
          <select value={tasks} onChange={(e) => setTasks(Number(e.target.value))}>
            {[1, 2, 3, 4].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      <button onClick={startJob} style={{ marginRight: "10px" }}>Start</button>
      <button onClick={stopJob}>Stop</button>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        {Array.from({ length: TOTAL_BUCKETS }, (_, i) => (
          <div
            key={i}
            style={{
              width: "40px",
              height: "80px",
              border: "2px solid black",
              background: i < filledCount ? "dodgerblue" : "white",
              margin: "5px",
              transition: "background 0.5s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

