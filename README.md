# parallel-bucket-visualizer
Interactive tool to visualize serial vs parallel processing in HPC

<img src="./docs/assets/Plan3.png" width="70%">

<img src="./docs/assets/amdahl-law.png" width="70%">

## Setup

### Start frontend on local macbook

```bash
$ git clone https://github.com/Lakshyasaharan5/parallel-bucket-visualizer.git

$ brew install npm

$ npm install

$ npm run dev
```

### Start backend on Pi cluster head node

```bash
$ cd /home/ls565/parallel-bucket-visualizer/backend

$ python server.py
```

### Kevin's Slurm LED light script

```bash
$ lux_cpu_leds &
# wait for LEDs to complete the activation pattern

$ cd /home/ls565
# this is where welcome.sh is located

$ /usr/local/bin/runntasks welcome.sh
```


## Time vs Cores

| Nodes and cores | Time (sec) | 
| --------------- | ---------- | 
| 1N X 1C         |     12     | 
| 2N X 1C         |     8      | 
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


- <del>Fix delay in animation and LEDs toggling.</del>
- <del>Keep the submit button disabled until everything is done</del>
- <del>Make the flow robust so it doesn't break when someone clicks so many things at once</del>
- <del>Check fronted portability on another laptop</del>


