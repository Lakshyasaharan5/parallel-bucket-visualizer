# parallel-bucket-visualizer
Interactive tool to visualize serial vs parallel processing in HPC

## Plan v1 for UI

<img src="./docs/assets/Plan1.png" width="50%">


## Time vs Cores

| Total Cores | Time (sec) | Notes                   |
| ----------- | ---------- | ----------------------- |
| 1           | 12         | Baseline, slowest       |
| 2           | 8          | ~1.5× speedup           |
| 3           | 6.5        | More speedup            |
| 4           | 5          | 2.4× faster than 1 core |
| 6           | 3.8        | Good scaling            |
| 8           | 3.2        | Plateau starting        |
| 9           | 3.0        | Almost no gain          |
| 12          | 2.8        | Plateau (limit reached) |
