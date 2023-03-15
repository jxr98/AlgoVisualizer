// NOTE: use v7 of D3 library
import * as d3 from './thirdParty/d3.js';
import {redirectConsoleOutput} from './lib/Logger.js'
import {ArrayVisualizer} from './lib/DataVisualizer.js'
import {InsertionSort} from './lib/SortingAlgorithms.js'

// setup svg
var svg = d3.select("#insertionSortSvg")

let textArea = d3.select("#LogPanel")
textArea.attr("readonly", true)
redirectConsoleOutput(textArea)

let tick = 0;
let interval = 500; 
// IMPORTANT: need to sync transition speed with interval, otherwise you transition may occur way too slow/fast with respect to change
const g = new ArrayVisualizer(svg, interval)
g.setLeftLabel("left label")
g.setRightLabel("right label")
g.setTitle("title")
g.setLegend("sorted", "red")
g.setLegend("un-sorted", "black")

setTimeout(function(){g.insertLeft({id:0, text:1, value:1 })}, tick)
tick+=interval;
setTimeout(function(){g.insertLeft({id:1, text:5, value:5 })}, tick)
tick+=interval;
setTimeout(function(){g.insertLeft({id:2, text:4, value:4 })}, tick)
tick+=interval;
setTimeout(function(){g.insertLeft({id:3, text:0, value:0 })}, tick)
tick+=interval;
setTimeout(function(){g.insertLeft({id:4, text:2, value:2 })}, tick)
tick+=interval;

setTimeout(function(){
    let sort = new InsertionSort(g)
    for (let i = 0 ; i < 6; ++i)
    {
        setTimeout(function(){sort.step()}, tick)
        tick+=interval;
    }
}, tick)
