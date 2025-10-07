import asyncio
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Allow your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Or restrict to ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def run_ssh(node: str, action: str):
    cmd = f"ssh {node} 'python /home/ls565/parallel-bucket-visualizer/backend/led.py {action}'"
    asyncio.create_task(asyncio.create_subprocess_shell(cmd))

@app.post("/start")
async def start_job(request: Request):
    data = await request.json()
    nodes = data.get("nodes", 1)

    for i in range(1, nodes + 1):
        await run_ssh(f"n{i}", "on")

    # just return 200 OK with no body
    return Response(status_code=200)

@app.post("/stop")
async def stop_job():
    for i in range(1, 4):
        await run_ssh(f"n{i}", "off")

    return Response(status_code=200)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

