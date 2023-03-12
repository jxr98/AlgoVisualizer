// NOTE: use v7 of D3 library
import * as d3 from './thirdParty/d3.js';
import {redirectConsoleOutput} from './lib/Logger.js'
import {ArrayVisualizer} from './lib/DataVisualizer.js'

// setup svg
var width = 800,
    height = 100;
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


let tick = 0;
let interval = 200; 
// IMPORTANT: need to sync transition speed with interval, otherwise you transition may occur way too slow/fast with respect to change
const g = new ArrayVisualizer(svg, interval)
g.setLeftLabel("left label")
g.setRightLabel("right label")
g.setTitle("title")

for (let i =0 ; i < 5; ++i)
{
    let data = {id : i, text: i}
    setTimeout(function(){g.insertLeft(data)}, tick)
    tick+=interval;
}
setTimeout(function(){g.insertRight({id:5, text: "hi"})}, tick)
tick+=interval;
setTimeout(function(){g.removeLeft()}, tick)
tick+=interval;
setTimeout(function(){g.remove(1)}, tick)
tick+=interval;
setTimeout(function(){g.removeRight()}, tick)
tick+=interval;
setTimeout(function(){g.insertBefore({id:6, text: "new"}, 0)}, tick)
