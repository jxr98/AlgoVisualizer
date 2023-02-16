// NOTE: use v7 of D3 library
import {ForceSimulationGraph} from './lib/svg_graph.js'
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {redirectConsoleOutput} from './lib/Logger.js'
import { GridGraph } from './lib/GridGraph.js';

// setup svg
var width = 960,
    height = 500;
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px solid black")

let textArea = d3.select("body").append("textarea")
textArea.attr("readonly", true)
.attr("row", 2)
.attr("cols", 100)
.style("width", "800px")
.style("height", "100px")
redirectConsoleOutput(textArea)

const g = new GridGraph(svg);
let startNode = g.getNodeID(0, 0)
let endNode = g.getNodeID(8, 4)
g.changeColor(startNode, "red")
g.changeColor(endNode, "green")

let visited = new Set()
visited.add(startNode)
let stack = []
let parentMap = new Map()
stack.push(startNode)
let tick = 0
let interval = 50

while (stack.length != 0)
{
    // DFS
    let currNode = stack.pop()

    // BFS
    //let currNode = stack.shift()

    if (currNode == endNode)
    {
        break;
    }

    g.getAdjacent(currNode).forEach(function(neighbor)
    {
        if (!visited.has(neighbor))
        {
            visited.add(neighbor)
            parentMap.set(neighbor, currNode)
            stack.push(neighbor)
            if (neighbor != endNode)
            {
                setTimeout(function(){
                    g.changeColor(neighbor, "yellow")
                }, tick) 
            } 
        } 
    })
    
    tick += interval
}

// back-track the path and highlight
if (parentMap.has(endNode))
{
    console.log("DONE")
    let curr = endNode
    while(curr != startNode)
    {
        let parent = parentMap.get(curr)
        if (parent != startNode)
        {
            setTimeout(function(){
                g.changeColor(parent, "blue")
            }, tick)
        }
        curr = parent
        tick += interval
    }
}