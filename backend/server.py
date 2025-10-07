import asyncio
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Allow your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # change to your frontend IP for safety later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Helper Function ----------
async def run_ssh(node: str, action: str, lights: int):
    """
    Runs LED control script remotely via SSH.
    Example: ssh n1 'python3 /path/to/led.py --switch on --lights 3'
    """
    cmd = (
        f"ssh {node} "
        f"'python3 /home/ls565/parallel-bucket-visualizer/backend/led.py "
        f"--switch {action} --lights {lights}'"
    )
    return await asyncio.create_subprocess_shell(cmd)
# ------------------------------------


# ---------- ENDPOINTS ----------
@app.post("/start")
async def start_job(request: Request):
    """
    Trigger LEDs ON concurrently — non-blocking for speed.
    """
    data = await request.json()
    nodes = data.get("nodes", 1)
    cores = data.get("cores", 1)

    for i in range(1, nodes + 1):
        # Fire & forget each LED activation task
        asyncio.create_task(run_ssh(f"n{i}", "on", cores))

    # Return instantly (LEDs still turning on asynchronously)
    return Response(status_code=200)


@app.post("/stop")
async def stop_job():
    """
    Turn all LEDs OFF — waits for completion to ensure shutdown before re-enabling Submit.
    """
    tasks = [
        run_ssh(f"n{i}", "off", 4)  # use max 4 LEDs per node
        for i in range(1, 4)        # assuming 3 compute nodes
    ]
    await asyncio.gather(*tasks)

    return Response(status_code=200)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

