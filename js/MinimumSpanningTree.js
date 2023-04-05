//import
import { PrimMST } from "./lib/PrimMST.js";
import * as d3 from "./thirdParty/d3.js";
import {ForceSimulationGraph} from "./lib/svg_graph.js";
import {redirectConsoleOutput} from './lib/Logger.js'
import {Graph} from "./lib/Graph.js";
import {EdgeWeightedGraph} from "./lib/EdgeWeightedGraph.js";
import {Edge} from "./lib/Edge.js";
import {isNumeric} from "./lib/Utils.js";

//set up a svg
var svg = d3.select("#graphSvg")

// setup log panel
// var visualizationDiv=d3.select("#thirdPanel").append("div");
var textArea=d3.select("#logPanel");

// console.log now mirrors to text area
redirectConsoleOutput(textArea);

const fGraph = new ForceSimulationGraph(svg,true);

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

    // the code is to construct a graph bc js doesn't allow multiple constructors
    var edgeWeightedGraph = new EdgeWeightedGraph(new Graph());
    for(var i=0;i<fGraph.getGraphModel().getNumVertices();i++){
        edgeWeightedGraph.addNode();
    }
    for(var i=0;i<weightedLines.length;i+=2){
        edgeWeightedGraph.addEdge(new Edge(weightedLines[i][0],weightedLines[i][1],weightedLines[i][2]))
    }

    var primMST = new PrimMST(edgeWeightedGraph);

    if(primMST.checkGraphConnection(edgeWeightedGraph)){
        var edges = primMST.edges();
        fGraph.highlightLinks(edges);

        // weights must be put at the end bc, when calculating weights, all edges will be deleted
        var path = "The sum of weights is " + primMST.weights() + ".";
        $("#shortestPath").text(path);
    }else{
        window.alert("The graph is not connected, so cannot derive a minimum spanning tree from it.");
    }

};

// // array of numbers, three numbers in a group to denote <source target weight>
// function constructEdgeWeightedGraph(weightedLines, numberOfVertices){
//     var graph = new EdgeWeightedGraph(new Graph());
//     for(var i=0;i<numberOfVertices;i++){
//         graph.addNode();
//     }
//     for(var i=0;i<weightedLines.length;i+=2){
//         graph.addEdge(new Edge(weightedLines[i][0],weightedLines[i][1],weightedLines[i][2]))
//     }
//     return graph;
// }