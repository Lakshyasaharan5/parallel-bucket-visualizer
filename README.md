# parallel-bucket-visualizer
Interactive tool to visualize serial vs parallel processing in HPC

## Plan v1 for UI

<img src="./docs/assets/Plan1.png" width="50%">


## Time vs Cores

| Nodes and cores | Time (sec) | 
| --------------- | ---------- | 
| 1N X 1C         |     12     | 
| 2N X 1C         |     9      | 
| 1N X 2C         |     7.5    | 
| 3N X 1C         |     6.5    | 
| 1N X 3C         |     6      | 
| 2N X 2C         |     5.5    | 
| 1N X 4C         |     5      | 
| 3N X 2C         |     4      | 
| 2N X 3C         |     3.8    | 
| 2N X 4C         |     3.2    | 
| 3N X 3C         |     3.0    | 
| 3N X 4C         |     2.8    | 

## TODO

- Plot points as user runs the jobs in realtime
- Add a button for the whole graph to show if needed
- Add points like 1 Node 2 Cores is better then 2 Nodes 1 Core
- Update the time accordingly
- Make history as a set or maybe not