// NOTE: use v7 of D3 library
import * as d3 from './thirdParty/d3.js';
import {redirectConsoleOutput} from './lib/Logger.js'
import {ArrayVisualizer} from './lib/DataVisualizer.js'
import {InsertionSort} from './lib/SortingAlgorithms.js'

// get handles to HTML elements
var svg = d3.select("#insertionSortSvg")
let textArea = d3.select("#LogPanel")
redirectConsoleOutput(textArea)

const interval = 500; // controls simulation speed
let idCounter = 0; // IDs must be unique, thus we have a counter here to generate new 

let timeoutHandles = []
const g = new ArrayVisualizer(svg, interval)
g.setLeftLabel("left label")
g.setRightLabel("right label")
g.setTitle("Insertion Sort")
g.setLegend("sorted", "red")
g.setLegend("un-sorted", "grey")

// functionalize the user input
let inputField = d3.select("#arrayInput");
inputField.on("blur", function()
{
    onBlur();
})

// start with default problem on page load
onBlur();

function onBlur()
{
    let input = inputField.node().value == "" ? inputField.attr("placeholder") : inputField.node().value;
    let inputArr = input.split(",").map(item => item.trim());

    // input validation
    let error = false;
    inputArr.forEach(element => {
        let isnum = /^\d+$/.test(element); // regex tester
        if (!isnum)
        {
            error = true;
            console.log(`${element} is not an integer`)
        }
    });
    if (error) return;

    // input is good, start simulation
    runSim(inputArr);
}

function runSim(inputArray)
{
    // clear array model
    g.clear()

    // clear all timeouts from previous simulation
    timeoutHandles.forEach(timeoutID => {
        clearTimeout(timeoutID);
    });
    timeoutHandles = []

    let tick = 0;

    // insert array
    inputArray.forEach((ele) => {
        let num = parseInt(ele);
        let timeoutID = setTimeout(function(){
            g.insertRight({id: idCounter++, text: ele, value: num})
        }, tick)
        tick += interval;
        timeoutHandles.push(timeoutID)
    })

    // run sort
    
    let sortTimeoutID = setTimeout(function(){
        let sort = new InsertionSort(g)    
        let numSteps = inputArray.length

        for (let i = 0 ; i < numSteps + 1; ++i)
        {
            let timeoutID = setTimeout(function(){sort.step()}, tick)
            tick+=interval;
            timeoutHandles.push(timeoutID)
        }
    }, tick - interval)
    timeoutHandles.push(sortTimeoutID)

}


