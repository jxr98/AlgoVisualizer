//import
import { Dijkstra } from "./lib/Dijkstra's.js";
import * as d3 from "./thirdParty/d3.js";
import {ForceSimulationGraph} from "./lib/svg_graph.js";
import {redirectConsoleOutput} from './lib/Logger.js'
import {line} from "./thirdParty/d3.js";

// TODO: perhaps its better if DOM elements are present in HTML and we just get handles to them
// as opposed to creating svg, textarea, etc. DOM on the fly.

//set up a svg
const width = 1200;
const height = 600;
var svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// setup log panel
let textArea = d3.select("body").append("textarea")
textArea.attr("readonly", true)
    .attr("row", 2)
    .attr("cols", 100)
    .style("width", "800px")
    .style("height", "100px")

// console.log now mirrors to text area
redirectConsoleOutput(textArea)

const fGraph = new ForceSimulationGraph(svg);

let weightForm = false;
document.getElementById("fill-button").onclick = function()
{
    if (weightForm) {
        return;
    }
    weightForm = true;
    let lines = Array.from(fGraph.getGraphModel().getLinks());
    let parentDiv = document.createElement("div");
    for (let i = 0; i < lines.length; i++) {
        let childDiv = document.createElement("div");
        let newlabel = document.createElement("label");
        newlabel.setAttribute("for", "line_info");
        newlabel.innerHTML = "The weight of " + lines[i].source + " - " + lines[i].target + " :";
        childDiv.appendChild(newlabel);
        // Create an input element for each line
        let form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("name", i)
        let weight = document.createElement("input");
        weight.setAttribute("type", "text");
        weight.setAttribute("name", "weight");
        form.append(weight);
        childDiv.appendChild(form);
        parentDiv.appendChild(childDiv);
    }
    document.getElementById("parentDiv").appendChild(parentDiv);
}

document.getElementById("start-button").onclick = function()
{
    let lines = Array.from(fGraph.getGraphModel().getLinks());
    let weightedLines = [];
    for (let i = 0; i < lines.length; i++) {
        if (typeof parseInt(document.forms[i]["weight"].value) != 'number') {
            alert("The weight of " + lines[i].source + " - " + lines[i].target + " is not a integer" );
            return;
        }
    }
    for (let i = 0; i < lines.length; i++) {
        let weight = parseInt(document.forms[i]["weight"].value);
        weightedLines.push([lines[i].source, lines[i].target, weight]);
        weightedLines.push([lines[i].target, lines[i].source, weight]);
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