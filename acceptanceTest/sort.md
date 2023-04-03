This document describes the sorting algorithm page https://jxr98.github.io/AlgoVisualizer/html/sort.html and documents user test procedures.

General UI
- [ ] Title of page is displayed in large letters at center position at beginning of page
- [ ] Navigation bar accessible at top page header, leading to home page and other algorithm pages within 1 click
- [ ] All elements in the page are responsive to resizing of the browser window
- [ ] Buttons to expand and collapse all panels are available at beginning of page
- [ ] Animation speed control slider at beginning of page allows configuration of each animation step from 300ms to 1500ms. When is configuration is changed, simulations are automatically restarted.
- [ ] Each simulation consist of a short brief of the sorting algorithm, an input field allowing only comma delimited integer inputs, an simulation view, and a log panel
- [ ] Each sorting algorithms should sort the input sequence in descending order
- [ ] Labels are present in each simulation view
- [ ] Simulations are automatically launched on page load, using default inputs. Simulations can also be launched by clicking into the input field and clicking elsewhere to focus out from the input field.

Test page defaults:
1. Visit https://jxr98.github.io/AlgoVisualizer/html/sort.html
2. Expect the insertion sort panel to be open while other panels remain closed
3. Expect defult animation speed to be at lowest limit of 300 ms
4. Expect simulation to begin automatically for insertion sort using default inputs, and that the simulation concludes with the sequences being sorted from high to low
5. Expect some additional information to be presented in the log panel of insertion sort
6. Upon click "expand all", expect all panels to be open
7. Expect all sorting algorithm simulations to have consistent default inputs and expect the final sorted sequence for all sorting algorithms to be the same
8. Upon click "close all", expect all panels to be collapsed

Test user input:
1. Visit https://jxr98.github.io/AlgoVisualizer/html/sort.html
2. For each simulation input field, type in an integer sequence of your choice, and launch the simulation by clicking outside the input box
   1. expect the final sequence to be sorted in descending order
   2. expect extra information about simulation for your sequence to be printed in the log panel
   3. when attempting to launch simulation on invalid inputs, expect warnings to appear and the current simulation is undisturbed
