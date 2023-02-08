//import
import { DFS } from "./lib/DFS.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {ForceSimulationGraph} from "./lib/svg_graph.js";

//set up a svg
const width = 1200;
const height = 600;
let svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

const fGraph = new ForceSimulationGraph(svg, width, height);

document.getElementById("start-button").onclick = function()
{
    let vertices = $("#formControlTextarea2").val().split(" ");
    let depthFirstPaths = new DFS(fGraph.getGraphModel(), vertices[0], vertices[1]);
    let path = "From vertex " + vertices[0] + " to vertex " + vertices[1] +  ": ";
    if (!depthFirstPaths.havePath()){
        window.alert("From vertex " + vertices[0] + " to vertex " + vertices[1] + " are not connected");
    } else {
        let result = depthFirstPaths.getPath();
        console.log(result);
        path += " " + result[0];
        for (let i = 1; i < result.length ; i++){
            path += " -> " + result[i];
        };
        window.alert(path);
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
    }
};