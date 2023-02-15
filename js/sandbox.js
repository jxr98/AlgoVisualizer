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