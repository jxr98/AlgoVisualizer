import { Dijkstra } from "./lib/Dijkstra's.js";
import * as d3 from "./thirdParty/d3.js";
import {ForceSimulationGraph} from "./lib/svg_tree.js";
import {redirectConsoleOutput} from './lib/Logger.js'
import {line} from "./thirdParty/d3.js";

//set up a svg
var svg = d3.select("#graphSvg")

// setup log panel
var textArea=d3.select("#logPanel");

redirectConsoleOutput(textArea)

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

document.getElementById("start-button").onclick = function()
{
    let data = $("#message-box").val().split("\n")
    for (let i = 0; i < data.length; i++) {
        if (isNumeric(data[i])) continue
        else window.alert("please check input data")
        data[i] = parseInt(data[i])
    }
    const fGraph = new ForceSimulationGraph(svg, data)
    fGraph.buildMaxHeap()
}