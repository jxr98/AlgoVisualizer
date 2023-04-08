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
2. Expect empty in two panels and input boxes and expect instruction shown
3. Upon click some nodes and lines in graph panel, expect them added and displayed correctly and expect log in log panel
4. Double click some nodes and lines in graph panel, expect them deleted and not displayed and expect log in log panel
7. Upon click "Start", expect simulation DFS display with correct nodes, correct color in process and correct shortest path
6. Upon click "Reset", expect reload this page

[//]: # (7. ) TODO for Xinrui
7. Upon click "Save The current Graph", expect
8. Upon click "Load The Last Saved Graph", expect