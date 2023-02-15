//import 
import { BFS_search } from "./lib/BFS_search.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {ForceSimulationGraph} from "./lib/svg_graph.js";
import {redirectConsoleOutput} from './lib/Logger.js'

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

document.getElementById("start-button").onclick = function()
{
    let vertices=$("#formControlTextarea2").val().split(" ");
    let breadthFirstPaths=new BFS_search(fGraph.getGraphModel(), vertices[0])
    let path= "From vertex " + vertices[0] + " to vertex " + vertices[1] +  ": "
    if(!breadthFirstPaths.hasPathTo(vertices[1])){
        window.alert("From vertex " + vertices[0] + " to vertex " + vertices[1] + " are not connected");
    }else{
        let result = breadthFirstPaths.pathTo(vertices[1]);
        path += " " + result[result.length - 1];
        for(let i = result.length - 2; i >= 0; i--){
            path += " -> " + result[i];
        };
        window.alert(path);
        let processVertices = breadthFirstPaths.getProcess();
        let size = processVertices.length;
        for (let i = 0; i < size; i++) {
            let sameStepVertices = processVertices[i];
            let n = sameStepVertices.length;
            for (let j = 0; j < n; j++) {
                setTimeout(function(){
                    fGraph.changeColor(sameStepVertices[j], "yellow");
                }, 1000 * i);
            }
        }
        result.forEach(function(vertex) {
            setTimeout(function(){
                fGraph.changeColor(vertex, "red");
            }, 1000 * size);
        });
    }
};