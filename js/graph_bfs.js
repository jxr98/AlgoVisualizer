//import 
import { BreadthFirstPaths } from "./lib/graph.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {ForceSimulationGraph} from "./lib/svg_graph.js";

//set up a svg
const width = 1200;
const height = 600;
var svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

const fGraph = new ForceSimulationGraph(svg, width, height);

svg.on('mousedown', function (e) {
    var coordinates = d3.pointer(e);
    fGraph.addNode(coordinates[0], coordinates[1]);
    fGraph.mouseDownNode=-1;
});

document.getElementById("connect-button").onclick = function () {
    var edgeInput=$("#formControlTextarea1").val();
    var edges=edgeInput.split(/\n/);
    for(var i=0;i<edges.length;i++){
        var points=edges[i].split(" ");
        fGraph.connectNodes(points[0],points[1]);
    }
};

document.getElementById("start-button").onclick = function()
{
    let vertices=$("#formControlTextarea2").val().split(" ");
    let breadthFirstPaths=new BreadthFirstPaths(fGraph.getGraphModel(), vertices[0])
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