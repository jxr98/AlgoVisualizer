//import
import { Dijkstra } from "./lib/Dijkstra's.js";
import * as d3 from "./thirdParty/d3.js";
import {ForceSimulationGraph} from "./lib/svg_graph.js";
import {redirectConsoleOutput} from './lib/Logger.js'
import {line} from "./thirdParty/d3.js";

// TODO: perhaps its better if DOM elements are present in HTML and we just get handles to them
// as opposed to creating svg, textarea, etc. DOM on the fly.

//set up a svg
var svg = d3.select("#graphSvg")

// setup log panel
var textArea=d3.select("#logPanel");

// console.log now mirrors to text area
redirectConsoleOutput(textArea)

const fGraph = new ForceSimulationGraph(svg, true);

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

document.getElementById("start-button").onclick = function()
{
    let lines = Array.from(fGraph.getGraphModel().getLinks());
    let weightedLines = [];
    for (let i = 1; i <= lines.length; i++) {
        let nodes_info = document.getElementById("nodes" + i).innerHTML.split(" ")
        let weight = document.getElementById("weight" + i).value
        if (!isNumeric(weight)) {
            window.alert("Please check the input in line " + i)
            return
        }
        weightedLines.push([nodes_info[0], nodes_info[1], parseInt(weight)]);
        weightedLines.push([nodes_info[1], nodes_info[0], parseInt(weight)]);
    }

    let vertices = $("#formControlTextarea2").val().split(" ");
    let DijkstraPaths = new Dijkstra(weightedLines, fGraph.getGraphModel(), vertices[0], vertices[1]);
    let path = "From vertex " + vertices[0] + " to vertex " + vertices[1] +  ": ";

    if (!DijkstraPaths.havePath()){
        $("#shortestPath").text("From vertex " + vertices[0] + " to vertex " + vertices[1] + " are not connected");
    } else {
        let result = DijkstraPaths.getPath();
        path += " " + result[0][0] + "(" + result[0][1] + ")";
        for (let i = 1; i < result.length ; i++){
            path += " -> " + result[i][0] + "(" + result[i][1] + ")";
        };
        $("#shortestPath").text(path);
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