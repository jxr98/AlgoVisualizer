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
1. Visit https://jxr98.github.io/AlgoVisualizer/html/Dijkstra's.html
2. Expect empty in all panels, input boxes and queue and expect instruction shown
3. Upon click some nodes and lines in graph panel, expect them added and displayed correctly and expect log in log panel
4. When lines generated, expect corresponding input box with default value 1 displayed in weight panel 
5. Double click some nodes and lines in graph panel, expect them deleted and not displayed and expect log in log panel 
6. When lines deleted, expect corresponding input box disappeared in weight panel
7. Expect all weights inputted 
8. Upon click "Start", expect simulation of Dijkstra's algorithm display with correct nodes, correct color in process and correct shortest path 
9. Upon click "Reset", expect reload this page