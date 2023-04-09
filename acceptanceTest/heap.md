This document describes generation/insertion/deletion algorithm of heap page https://jxr98.github.io/AlgoVisualizer/html/heap.html and documents user test procedures.

General UI
- [ ] Title of page is displayed in large letters at center position at beginning of page
- [ ] Navigation bar accessible at top page header, leading to home page and other algorithm pages within 1 click
- [ ] All elements in the page are responsive to resizing of the browser window
- [ ] The page is divided into three part. The left part is Heap Data. Input each data in each line
- [ ] The middle part is Tree Panel. When press the button create Max/Min Heap, the binary tree will be created with input data. Each node has its index on it and its value in it
- [ ] Check input if is number and has no extra blank line 
- [ ] The entire process of creation, insertion and deletion will be animated in the tree panel. Each animation step is 2000ms. Yellow nodes means nodes compared in this step and red lines means they will switch in next sec
- [ ] After press creat button, the left part will change into Data. Input one data for insert or empty for delete root
- [ ] The right part is Instruction and Log Panel. Use instruction to learn how to use the website faster. The left one is Log Panel, and it shows the operations of nodes, lines and output

  Test page defaults:
1. Visit https://jxr98.github.io/AlgoVisualizer/html/heap's.html
2. Expect empty in two panels, input box and expect instruction shown
3. Expect the input box in heap data grow as the number of lines increases 
4. Upon click "Create Max Heap", expect simulation of creating max heap display with correct nodes, lines, color and switch and expect log in log panel and expect heap data module changed into data module
5. Upon click "Create Min Heap", expect simulation of creating min heap display with correct nodes, lines, color and switch and expect log in log panel and expect heap data module changed into data module
6. Expect enter integer into input box in data, upon click "Insert", expect simulation of inserting a node from bottom and creating new heap display with correct nodes, lines, color and switch and expect log in log panel
7. Upon click "Delete", expect simulation of deleting the root of heap, putting the last leaf node to root and creating new heap display with correct nodes, lines, color and switch and expect log in log panel
8. Upon click "Reset", expect reload this page

Test user input interaction:
1. Visit https://jxr98.github.io/AlgoVisualizer/html/heap.html
2. For each simulation, enter an array in the heap data module on the left side, and launch the simulation by clicking the "create max heap" or "create min heap" button
  1. expect the simulation of creating max/min heap to be displayed in the tree panel
  2. expect extra information about simulation to be printed in the log panel
3. For inserting one node, enter the data on the left side, and launch the simulation by clicking the "insert" button
  1. expect the simulation of inserting a node to be displayed in the tree panel
  2. expect extra information about simulation to be printed in the log panel
4. For deleting the root of the heap, launch the simulation by clicking the "delete" button
  1. expect the simulation of deleting the root of the heap to be displayed in the tree panel
  2. expect extra information about simulation to be printed in the log panel

