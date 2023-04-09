This document describes the sorting algorithm page https://jxr98.github.io/AlgoVisualizer/html/astar.html and documents user test procedures.

General UI
- [ ] Title of page is displayed in large letters at center position at beginning of page
- [ ] Navigation bar accessible at top page header, leading to home page and other algorithm pages within 1 click
- [ ] All elements in the page, with exception of the grid, are responsive to resizing of the browser window
- [ ] Introduction, instructions, and legends are available in right panel
- [ ] User input consists of two coordinate inputs and start button, along with interactive grid graph

Test simple use case
1. Visit https://jxr98.github.io/AlgoVisualizer/html/astar.html
2. Run a search from (0,0) to (7,7) without setting any obstacles
3. Expect shortest path to be displayed in red

Test obstacle input overlap
1. Visit https://jxr98.github.io/AlgoVisualizer/html/astar.html
2. Set input to search from (0,0) to (7,7)
3. Click on (0,0) tile to change it to obstacle
4. Expect error message "coordinate occupied by obstacle"

Test search with no solution
1. Visit https://jxr98.github.io/AlgoVisualizer/html/astar.html
2. Set input to search from (0,0) to (7,7)
3. Encircle (7,7) with obstacles and start simulation
4. Expect no path to be found

Test search with obstacles
1. Visit https://jxr98.github.io/AlgoVisualizer/html/astar.html
2. Set input to search from (0,0) to (7,7)
3. Create obstacles between source and destination tiles, ensure a path exist between the tiles
4. Run simulation
5. Expect a path to be found