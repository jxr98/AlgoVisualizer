//import
import { Dijkstra } from "./lib/Dijkstra's.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {ForceSimulationGraph} from "./lib/svg_graph.js";
import {redirectConsoleOutput} from './lib/Logger.js'
import {line} from "./thirdParty/d3.js";

// TODO: perhaps its better if DOM elements are present in HTML and we just get handles to them
// as opposed to creating svg, textarea, etc. DOM on the fly.

//set up a svg
const width = 600;
const height = 1000;
let svg = d3.select('#middle-frame')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('stroke', 'black');

// setup log panel
let textArea = d3.select("#right-frame").append("textarea")
textArea.attr("readonly", true)
    .attr("row", 2)
    .attr("cols", 100)
    .style("width", "380px")
    .style("height", "1000px")

// console.log now mirrors to text area
redirectConsoleOutput(textArea)

const fGraph = new ForceSimulationGraph(svg, true);

document.getElementById("start-button").onclick = function()
{
    let lines = Array.from(fGraph.getGraphModel().getLinks());
    let weightedLines = [];
    for (let i = 1; i <= lines.length; i++) {
        let weight_info = document.getElementById(i.toString()).value.split(" ");
        weightedLines.push([weight_info[0], weight_info[1], parseInt(weight_info[2])]);
        weightedLines.push([weight_info[1], weight_info[0], parseInt(weight_info[2])]);
    }


    let vertices = $("#formControlTextarea2").val().split(" ");
    let DijkstraPaths = new Dijkstra(weightedLines, fGraph.getGraphModel(), vertices[0], vertices[1]);
    let path = "From vertex " + vertices[0] + " to vertex " + vertices[1] +  ": ";

    if (!DijkstraPaths.havePath()){
        window.alert("From vertex " + vertices[0] + " to vertex " + vertices[1] + " are not connected");
    } else {
        let result = DijkstraPaths.getPath();
        path += " " + result[0][0] + "(" + result[0][1] + ")";
        for (let i = 1; i < result.length ; i++){
            path += " -> " + result[i][0] + "(" + result[i][1] + ")";
        };
        window.alert(path);
        let process = DijkstraPaths.getProcess();
        let size = result.length;
        for (let i = 0; i < size; i++) {
            if (i == 0 || i == size - 1)
                setTimeout(function(){fGraph.changeColor(result[i][0], "pink");}, 2000 * i);
            setTimeout(function(){ fGraph.changeColor(result[i][0], "yellow");}, 2000 * i);
            setTimeout(function()
            {
                console.log("Step " + i + ":")
                console.log("current vertex: " + result[i][0]);
                console.log("changed vertex and weight after relaxation:");
                let relaxationSize = process[i].length;
                for (let j = 0; j < relaxationSize; j++) {
                    console.log("vertex: " + process[i][j][0] + ", weight: " + process[i][j][1]);
                }
            }, 2000 * i);
            setTimeout(function(){ fGraph.changeColor(result[i][0], "red");}, 2000 * size);
        }
    }
};