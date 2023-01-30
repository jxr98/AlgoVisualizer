//import 
import { Graph, BreadthFirstPaths } from "./lib/graph.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

//set up a svg
const width = 1200;
const height = 600;
var svg = d3.select('body')
    .append('svg')
    .attr('width',width)
    .attr('height',height);
var graph = new Graph();
svg.on('mousedown',mouseDown);
initiateGraph();
document.getElementById("connect-button").onclick = clickOnConnectButton;
document.getElementById("start-button").onclick = clickOnStartButton;

function addNode(x,y)
{
    const nodeIdx = graph.addNode();
    svg.append('circle')
        .attr('cx',x)
        .attr('cy',y)
        .attr('r',30)
        .attr('stroke','black')
        .attr('fill','#a1d99b')
        .attr('id',"c"+nodeIdx);
    svg.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('stroke', 'black')
        .style("font-size", 17)
        .text(nodeIdx);
}

function mouseDown(e) {
    var coordinates = d3.pointer(e);
    addNode(coordinates[0], coordinates[1]);
}

function clickOnConnectButton(){
    //read edges from user input
    var edgeInput=$("#formControlTextarea1").val();
    var edges=edgeInput.split(/\n/);

    for(var i=0;i<edges.length;i++){
        var points=edges[i].split(" ");
        drawLinesBetweenCircles(points[0],points[1]);
    }
}

function clickOnStartButton() {
    let vertices=$("#formControlTextarea2").val().split(" ");
    let breadthFirstPaths=new BreadthFirstPaths(graph,0)
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
        let size = processVertices.getSize();
        for (let i = 0; i < size; i++) {
            let sameStepVertices = processVertices.getAtIndex(i);
            let n = sameStepVertices.length;
            for (let j = 0; j < n; j++) {
                setTimeout(function(){d3.select("#c"+sameStepVertices[j]).attr('fill','yellow')}, 1000 * i);
            }
        }
        result.forEach(function(vertex) {
            setTimeout(function(){d3.select("#c"+vertex).attr('fill','red')}, 1000 * size);
        });
    }
}

function initiateGraph(){
    addNode(300, 200);
    addNode(1100, 200);
}

//draw a line between nodeOne(int index) and nodeTwo(int index)
function drawLinesBetweenCircles(nodeOne,nodeTwo){
    graph.addEdge(nodeOne,nodeTwo);
    var x1=d3.select("#c"+nodeOne).attr("cx");
    var y1=d3.select("#c"+nodeOne).attr("cy");
    var x2=d3.select("#c"+nodeTwo).attr("cx");
    var y2=d3.select("#c"+nodeTwo).attr("cy");
    svg.append('line')
        .attr('x1',x1)
        .attr('y1',y1)
        .attr('x2',x2)
        .attr('y2',y2)
        .attr('stroke','black');
}



