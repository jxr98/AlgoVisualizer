This document describes depth-first search (DFS) algorithm page https://jxr98.github.io/AlgoVisualizer/html/dfs.html and documents user test procedures.

General UI
- [ ] Title of page is displayed in large letters at center position at beginning of page
- [ ] Navigation bar accessible at top page header, leading to home page and other algorithm pages within 1 click
- [ ] All elements in the page are responsive to resizing of the browser window
- [ ] The page is divided into three part and the left one is Log Panel. Log Panel shows the operations of nodes, lines
- [ ] The middle part is Input box and Graph Panel. Input source and target nodes and click start button to find a path between them and show it in the right part
- [ ] Click Graph Panel to generate nodes. Dragging from one node to another creates a line. Double-clicking on nodes and lines will delete them. Nodes have unique indexes. The graph will be adjusted automatically
- [ ] The entire DFS process will be animated in the graph panel. Each animation step is 1000ms. Yellow nodes means nodes visited in this step and red nodes mean that they are in the shortest path
- [ ] The right part is Instruction and result. Use instruction to learn how to use the website faster.


Test page defaults:
1. Visit https://jxr98.github.io/AlgoVisualizer/html/dfs.html
2. Upon click on the blank space of graph panel, expect a pink bubble with a number in it to appear
3. Upon drag from one bubble to another, expect an arrow to appear between them
4. Expect some additional information to be presented in the log panel of depth first search
5. Double click some nodes and lines in graph panel, expect them deleted and not displayed and expect log in log panel
6. Expect simulation to begin when enter source node and destination node and click the "start" button
7. Expect the shortest path to appear on the right side of the DFS page
8. Expect everything to be cleared after clicking the "reset" button
9. Expect save the current graph when click the "save the current graph"
10. Expect load the last saved graph when click the "load the last saved graph"

Test user input interaction:
1. Visit https://jxr98.github.io/AlgoVisualizer/html/dfs.html
2. For each simulation, click on the blank space of graph panel, and launch the simulation by clicking the "start" button after entering source code and destination code
  1. expect the shortest path to be displayed on the right side of the DFS page
  2. expect extra information about simulation for your search to be printed in the log panel
  3. expect the nodes on the shortest path to be displayed in red
  4. when attempting to launch simulation on invalid inputs, expect warnings to appear and the current simulation is undisturbed
