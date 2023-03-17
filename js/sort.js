import * as d3 from './thirdParty/d3.js';
import {ArrayVisualizer} from './lib/ArrayVisualizer.js'
import {InsertionSort} from './lib/InsertionSort.js'
import {BinaryInsertionSort} from './lib/InsertionSortBinary.js'
import { Logger } from './lib/Logger.js';
import { onBlur, interval } from './lib/page_sort.js';

//insertion sort
let insertionSortLogger = new Logger(d3.select("#InsertionSortLog"))
let insertionSortSimTimeoutHandles = []
const insertionSortArrayVis = new ArrayVisualizer(d3.select("#insertionSortSvg"), interval)
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
    onBlur(insertionSortInput, insertionSortArrayVis, insertionSortSimTimeoutHandles, insertionSortFactory);
})
onBlur(insertionSortInput, insertionSortArrayVis, insertionSortSimTimeoutHandles, insertionSortFactory); // start with default problem on page load


// binary insertion sort
let binarySortLogger = new Logger(d3.select("#binaryInsertionSortLog"))
let binInsertionSortTimeouts = []
const binInsertionSortArrayVis = new ArrayVisualizer(d3.select("#binaryInsertionSortSvg"), interval)
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
    onBlur(binInsertionSortInput, binInsertionSortArrayVis, binInsertionSortTimeouts, binInsertionSortFactory);
})
onBlur(binInsertionSortInput, binInsertionSortArrayVis, binInsertionSortTimeouts, binInsertionSortFactory); // start with default problem on page load