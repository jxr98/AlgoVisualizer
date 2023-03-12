//import 
import { BFS_search } from "./lib/BFS_search.js";
import * as d3 from "./thirdParty/d3.js";
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
var visualizationDiv=d3.select("body").append("div");
visualizationDiv.attr("class","col-12");
let textArea = visualizationDiv.append("textarea")
textArea.attr("readonly", true)
.attr("cols", 30)
 .style("height", "100px")

// console.log now mirrors to text area
redirectConsoleOutput(textArea);

//queue visualization
visualizationDiv.append("svg")
    .attr('width',1000)
    .attr('height',200)
    .style('border','1px solid #000')
    .attr('id','queueSvg')
    .append('text')
    .text('Queue')
    .attr('x',450)
    .attr('y',15);
    d3.select("#queueSvg")
        .append('text')
        .text('Head')
        .attr('x',1000-45)
        .attr('y',20);

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
        let processVertices = breadthFirstPaths.getProcess().TwoDArray;
        let OneDArray=breadthFirstPaths.getProcess().OneDArray;
        let size = processVertices.length;

        //append queueSVG
        var rectangles=d3.select("#queueSvg").selectAll(".recQueue").data(OneDArray);
        let recG=rectangles.enter()
            .append('g')
            .attr('class','recQueue');
        recG.append('rect')
            .attr('id', function (d) {
                return "rect" +d;
            })
            .attr('width',15)
            .attr('height',100)
            .attr('x',function (d,index) {
                return 1000-30-index*20;
            })
            .attr('y',50)
            .style('fill','#00ff0080')
            .attr('visibility','hidden');;

        recG.append("text")
            .attr("class", "text")
            .attr('id',function (d) {
                return "rectText" + d;
            })
            .attr('x',function (d,index) {
                return 1000-30-index*19;
            })
            .attr('y',110)
            .attr('visibility','hidden')
            .text(function (d) {
                return d;
            });

        for (let i = 0; i < size; i++) {
            let sameStepVertices = processVertices[i];
            let n = sameStepVertices.length;
            for (let j = 0; j < n; j++) {
                setTimeout(function(){
                    fGraph.changeColor(sameStepVertices[j], "yellow");
                    var rectangleID="#rect" + sameStepVertices[j];
                    var rectangleTextId="#rectText" + sameStepVertices[j];
                    d3.select(rectangleID).attr('visibility','visible');
                    d3.select(rectangleTextId).attr('visibility','visible');
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