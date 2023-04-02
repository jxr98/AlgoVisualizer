import * as d3 from './thirdParty/d3.js';
import {ArrayVisualizer, TransitionDelay} from './lib/ArrayVisualizer.js'
import {InsertionSort} from './lib/InsertionSort.js'
import {BinaryInsertionSort} from './lib/InsertionSortBinary.js'
import { Logger } from './lib/Logger.js';
import { onBlur, runSim } from './lib/page_sort.js';
import { Quicksort } from './lib/quicksort.js';
import { MergeSort } from './lib/mergeSort.js';

let transitionDelay = new TransitionDelay();

//insertion sort
let insertionSortLogger = new Logger(d3.select("#InsertionSortLog"))
let insertionSortSimTimeoutHandles = []
const insertionSortArrayVis = new ArrayVisualizer(d3.select("#insertionSortSvg"), transitionDelay)
insertionSortArrayVis.setTitle("Insertion Sort")
insertionSortArrayVis.setLegend("sorted", "red")
insertionSortArrayVis.setLegend("un-sorted", "grey")
insertionSortArrayVis.setLegend("node being sorted", "blue")
let insertionSortInput = d3.select("#insertionSortArrayInput");
let insertionSortFactory = () =>{
    return new InsertionSort(insertionSortArrayVis, insertionSortLogger); 
};
insertionSortInput.on("blur", function()
{
    let inputArr = onBlur(insertionSortInput);
    if (inputArr.length > 0){
        runSim(inputArr, insertionSortArrayVis, insertionSortSimTimeoutHandles, insertionSortFactory, transitionDelay);
    }
})
 // start with default problem on page load
 runSim(onBlur(insertionSortInput), insertionSortArrayVis, insertionSortSimTimeoutHandles, insertionSortFactory, transitionDelay);


// binary insertion sort
let binarySortLogger = new Logger(d3.select("#binaryInsertionSortLog"))
let binInsertionSortTimeouts = []
const binInsertionSortArrayVis = new ArrayVisualizer(d3.select("#binaryInsertionSortSvg"), transitionDelay)
binInsertionSortArrayVis.setTitle("Binary Insertion Sort")
binInsertionSortArrayVis.setLegend("sorted", "red")
binInsertionSortArrayVis.setLegend("un-sorted", "grey")
binInsertionSortArrayVis.setLegend("node being sorted", "blue")
let binInsertionSortInput = d3.select("#binaryInsertionArrayInput");
let binInsertionSortFactory = () =>{
    return new BinaryInsertionSort(binInsertionSortArrayVis, binarySortLogger); 
};
binInsertionSortInput.on("blur", function()
{
    let inputArr = onBlur(binInsertionSortInput);
    if (inputArr.length > 0){
        runSim(inputArr, binInsertionSortArrayVis, binInsertionSortTimeouts, binInsertionSortFactory, transitionDelay);
    }
})
// start with default problem on page load
runSim(onBlur(binInsertionSortInput), binInsertionSortArrayVis, binInsertionSortTimeouts, binInsertionSortFactory, transitionDelay);

// quicksort
let quickSortLogger = new Logger(d3.select("#quickSortLog"))
let quickSortTimeouts = []
const quickSortArrayVis = new ArrayVisualizer(d3.select("#quickSortSvg"), transitionDelay)
quickSortArrayVis.setTitle("Quick Sort")
quickSortArrayVis.setLegend("sorted", "red")
quickSortArrayVis.setLegend("un-sorted", "grey")
quickSortArrayVis.setLegend("pivot", "blue")
let quickSortInput = d3.select("#quickSortArrayInput");
let quickSortFactory = () =>{
    return new Quicksort(quickSortArrayVis, quickSortLogger); 
};
quickSortInput.on("blur", function()
{
    let inputArr = onBlur(quickSortInput);
    if (inputArr.length > 0){
        runSim(inputArr, quickSortArrayVis, quickSortTimeouts, quickSortFactory, transitionDelay);
    }
    
})
// start with default problem on page load
runSim(onBlur(quickSortInput), quickSortArrayVis, quickSortTimeouts, quickSortFactory, transitionDelay);

// merge sort
let mergeSortLogger = new Logger(d3.select("#mergeSortLog"))
let mergeSortTimeouts = []
const mergeSortArrayVis = new ArrayVisualizer(d3.select("#mergeSortSvg"), transitionDelay)
mergeSortArrayVis.setTitle("Quick Sort")
mergeSortArrayVis.setLegend("sorted", "red")
mergeSortArrayVis.setLegend("un-sorted", "grey")
mergeSortArrayVis.setLegend("range being merged", "blue")
let mergeSortInput = d3.select("#mergeSortArrayInput");
let mergeSortFactory = () =>{
    return new MergeSort(mergeSortArrayVis, mergeSortLogger); 
};
mergeSortInput.on("blur", function()
{
    let inputArr = onBlur(mergeSortInput);
    if (inputArr.length > 0){
        runSim(inputArr, mergeSortArrayVis, mergeSortTimeouts, mergeSortFactory, transitionDelay);
    }
})
// start with default problem on page load
runSim(onBlur(mergeSortInput), mergeSortArrayVis, mergeSortTimeouts, mergeSortFactory, transitionDelay);

// transition speed ctrl
d3.select("#speedCtrl").on("change", function()
{
    // if setting didnt change, do nothing
    let newSpeed = parseInt(d3.select(this).node().value);
    if (newSpeed == transitionDelay.getDelay()) return;

    // update transition speed
    transitionDelay.setDelay(newSpeed)

    // restart all sims
    insertionSortInput.dispatch("blur")
    binInsertionSortInput.dispatch("blur")
    quickSortInput.dispatch("blur")
    mergeSortInput.dispatch("blur")
})
