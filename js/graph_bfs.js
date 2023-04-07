import { BFS_search } from "./lib/BFS_search.js";
import * as d3 from "./thirdParty/d3.js";
import {ForceSimulationGraph} from "./lib/svg_graph.js";
import {redirectConsoleOutput} from './lib/Logger.js';
import * as inputFormHelper from "./lib/inputFormHelper.js"
import * as cm from './lib/common.js'

//set up a svg
var svg = d3.select("#graphSvg")

// setup log panel
var visualizationDiv=d3.select("#thirdPanel").append("div");
var textArea=d3.select("#logPanel");

// console.log now mirrors to text area
redirectConsoleOutput(textArea);

//queue visualization
visualizationDiv.append("svg")
    .attr('height',400)
    .attr('width','100%')
    .style('border','1px solid #000')
    .attr('id','queueSvg');
    d3.select("#queueSvg")
        .append('text')
        .text('Head')
        .attr('x',1000-45)
        .attr('y',20);

const fGraph = new ForceSimulationGraph(svg);
fGraph.setLegend("unvisited", "pink")
fGraph.setLegend("search process", "yellow")
fGraph.setLegend("path", "red")

document.getElementById("start-button").onclick = function()
{
    let vertices = inputFormHelper.readInputsFromTwoVertexInputModule();
    if (!inputFormHelper.checkTwoVertexInputIsValidGraphNodes(fGraph.getGraphModel()))
    {
        return;
    }

    let breadthFirstPaths=new BFS_search(fGraph.getGraphModel(), vertices[0])
    let path= "From vertex " + vertices[0] + " to vertex " + vertices[1] +  ": "
    if(!breadthFirstPaths.hasPathTo(vertices[1])){
        $("#shortestPath").text("vertex " + vertices[0] + " and vertex " + vertices[1] + " are not connected");
    }else{
        let result = breadthFirstPaths.pathTo(vertices[1]);
        path += " " + result[result.length - 1];
        for(let i = result.length - 2; i >= 0; i--){
            path += " -> " + result[i];
        };
        // window.alert(path);
        $("#shortestPath").text(path);
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
            .attr('width','80%')
            .attr('height',15)
            .attr('x','10%')
            .attr('y',function (d,index) {
                return 10+index*20;
            })
            .style('fill','#00ff0080')
            .attr('visibility','hidden');;

        recG.append("text")
            .attr("class", "text")
            .attr('id',function (d) {
                return "rectText" + d;
            })
            .attr('x','48%')
            .attr('y',function (d,index) {
                return 20+index*20;
            })
            .attr('visibility','hidden')
            .text(function (d) {
                return d;
            });

        for (let i = 0; i < size; i++) {
            let sameStepVertices = processVertices[i];
            let n = sameStepVertices.length;
            for (let j = 0; j < n; j++) {
                setTimeout(function(){
                    fGraph.changeColor(sameStepVertices[j], cm.process_color);
                    var rectangleID="#rect" + sameStepVertices[j];
                    var rectangleTextId="#rectText" + sameStepVertices[j];
                    d3.select(rectangleID).attr('visibility','visible');
                    d3.select(rectangleTextId).attr('visibility','visible');
                }, cm.short_animation_gap * i);
            }
        }
        result.forEach(function(vertex) {
            setTimeout(function(){
                fGraph.changeColor(vertex, cm.endpoint_color);
            }, cm.short_animation_gap * size);
        });
    }
};