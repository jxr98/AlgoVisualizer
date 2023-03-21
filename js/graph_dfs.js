//import
import { DFS } from "./lib/DFS.js";
import * as d3 from "./thirdParty/d3.js";
import {ForceSimulationGraph} from "./lib/svg_graph.js";
import {redirectConsoleOutput} from './lib/Logger.js'

//set up a svg
var svg = d3.select("#graphSvg")

// setup log panel
var textArea=d3.select("#logPanel");

// console.log now mirrors to text area
redirectConsoleOutput(textArea)

const fGraph = new ForceSimulationGraph(svg);

document.getElementById("start-button").onclick = function()
{
    let vertices = $("#formControlTextarea2").val().split(" ");
    let depthFirstPaths = new DFS(fGraph.getGraphModel(), vertices[0], vertices[1]);
    let path = "From vertex " + vertices[0] + " to vertex " + vertices[1] +  ": ";
    if (!depthFirstPaths.havePath()){
        $("#shortestPath").text("vertex " + vertices[0] + " and vertex " + vertices[1] + " are not connected");
    } else {
        let result = depthFirstPaths.getPath();
        path += " " + result[0];
        for (let i = 1; i < result.length ; i++){
            path += " -> " + result[i];
        };
        // window.alert(path);
        $("#shortestPath").text(path);
        let processVertices = depthFirstPaths.getProcess();
        let size = processVertices.length;
        let visited = new Array(fGraph.getGraphModel().getNumVertices()).fill(false);
        for (let i = 0; i < size; i++) {
            if (!visited[processVertices[i]]) {
                visited[processVertices[i]] = true;
                if (processVertices[i] != vertices[1])
                    setTimeout(function(){ fGraph.changeColor(processVertices[i], "yellow");}, 1000 * i);
                else setTimeout(function(){ fGraph.changeColor(processVertices[i], "red");}, 1000 * i);
            } else {
                visited[processVertices[i]] = false;
                setTimeout(function(){ fGraph.changeColor(processVertices[i], "grey");}, 1000 * i);
            }
        }
        result.forEach(function(vertex) {
            setTimeout(function(){
                fGraph.changeColor(vertex, "red");
            }, 1000 * size);
        });
    }
};