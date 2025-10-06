import subprocess
from fastapi import FastAPI, Request
import uvicorn

app = FastAPI()

def run_ssh_command(node: str, action: str):
    """Run the SSH LED command on a given node."""
    try:
        cmd = ["ssh", node, f"python /home/ls565/fast-server/tmp.py {action}"]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"[{node}] {action} -> success")
        if result.stdout:
            print("stdout:", result.stdout.strip())
        if result.stderr:
            print("stderr:", result.stderr.strip())
    except subprocess.CalledProcessError as e:
        print(f"[{node}] {action} -> ERROR")
        print("stderr:", e.stderr.strip())


@app.post("/start")
async def start_job(request: Request):
    data = await request.json()
    nodes_count = data.get("nodes", 1)
    tasks = data.get("tasks", 1)

    print(f"nodes: {nodes_count}, tasks: {tasks}")

    for i in range(1, nodes_count + 1):
        run_ssh_command(f"n{i}", "on")

    return {"status": "started", "nodes": nodes_count, "tasks": tasks}


@app.post("/stop")
async def stop_job():
    print("stopping lights on ALL nodes...")

    for i in range(1, 4):  # always hit n1, n2, n3
        run_ssh_command(f"n{i}", "off")

    return {"status": "stopped", "nodes": "all"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

