This document describes Dijkstra's algorithm page https://jxr98.github.io/AlgoVisualizer/html/Dijkstra's.html and documents user test procedures.

General UI
- [ ] Title of page is displayed in large letters at center position at beginning of page
- [ ] Navigation bar accessible at top page header, leading to home page and other algorithm pages within 1 click
- [ ] All elements in the page are responsive to resizing of the browser window
- [ ] The page is divided into three part. The left part is Graph Data. When new line generated, the input box for this line is generated at the same time with initial weight value 1. The weight of each line can be altered
- [ ] The middle part is Input box and Graph Panel. Input source and target nodes and click start button to find a path between them and show it in the right part
- [ ] Click Graph Panel to generate nodes. Dragging from one node to another creates a line. Double-clicking on nodes and lines will delete them. Nodes have unique indexes. The graph will be adjusted automatically
- [ ] The entire process will be animated in the graph panel. Each animation step is 2000ms. Yellow nodes means nodes visited in this step and red nodes mean that they are in the shortest path
- [ ] The right part is Instruction, Result and Log Panel. Use instruction to learn how to use the website faster. The left one is Log Panel and it shows the operations of nodes, lines and output





Test page defaults:
1. Visit https://jxr98.github.io/AlgoVisualizer/html/dijkstra's.html
2. Upon click on the blank space of graph panel, expect a pink bubble with a number in it to appear
3. Upon drag from one bubble to another, expect an arrow to appear between them
4. Upon generating lines on the dijkstra page, expect a corresponding input box with a default value of 1 to be displayed in the weight panel
5. Expect some additional information to be presented in the log panel of Dijkstra's
6. Double click some nodes and lines in graph panel, expect them deleted and not displayed
7. Upon deleting lines in the BFS page, expect them to disappear in the weight panel
8. Expect simulation to begin when enter source node and destination node and click the "start" button
9. Expect the shortest path to appear on the right side of the BFS page
10. Expect everything to be cleared after clicking the "reset" button


Test user input interaction:
1. Visit https://jxr98.github.io/AlgoVisualizer/html/dijkstra's.html
2. For each simulation, click on the blank space of graph panel, and launch the simulation by clicking the "start" button after entering source code and destination code, and weight if needed
  1. expect the shortest path to be displayed on the right side of the Dijkstra's page
  2. expect extra information about simulation for your search to be printed in the log panel
  3. expect the nodes on the shortest path to be displayed in red
  4. when attempting to launch simulation on invalid inputs, expect warnings to appear and the current simulation is undisturbed
