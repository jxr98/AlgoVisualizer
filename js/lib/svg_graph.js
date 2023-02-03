import { Graph } from "./graph.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

class ForceSimulationGraph
{
    #graph; // graph model
    svg; // handle to svg DOM element
    simulation; // handle to the force simulation model

    constructor(svg, width, height)
    {
        const self = this;
        this.#graph = new Graph()
        this.svg = svg
        this.simulation = d3.forceSimulation()
            .force("center", d3.forceCenter(width / 2, height / 2).strength(0.01))
            .nodes([])
            .force("link", d3.forceLink([]).distance(100))
            .on("tick", this.tick).on("tick", function () {
                // update graphics
                // update node locations back to our model
                svg.selectAll('.link')
                    .attr("x1", function (d) { return d.source.x })
                    .attr("y1", function (d) { return d.source.y })
                    .attr("x2", function (d) { return d.target.x })
                    .attr("y2", function (d) { return d.target.y })
                svg.selectAll('.node')
                    .attr("cx", function (d, i) { 
                        self.#graph.updateNodeProp(i, {x: d.x, y: d.y}); // sync d3 node model to our own model
                        return d.x;
                    })
                    .attr("cy", function (d, i) { 
                        return d.y;
                    })
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    })
            }).alphaDecay(0.002) // just added alpha decay to delay end of execution
    }

    getGraphModel()
    {
        return this.#graph;
    }

    changeColor(node, color)
    {
        this.#graph.updateNodeProp(node, {color: color});
        this.update();
        this.svg.selectAll("g").each(function(d)
        {
            d3.select(this).select("circle").style("fill", function(d){
                return d.hasOwnProperty("color") ? d.color : "rgb(217, 217, 217)";
            });
        });
    }

    update() {
        const self = this;

        // update links
        const graphNodes = this.#graph.getNodes();
        const graphLinks = this.#graph.getLinks();
        
        var link = this.svg.selectAll('.link').data(graphLinks);
        link.enter()
            .insert('line', '.node')
            .attr('class', 'link')
            .style('stroke', '#d9d9d9');
        link
            .exit()
            .remove()
    
        // update nodes
        var node = this.svg.selectAll('.node').data(graphNodes);
        var g = node.enter()
            .append('g')
            .attr('class', 'node')
            .call(d3.drag()
                .on('start', function (event, d){
                    d3.select(this).raise().attr("stroke", "black");
                })
                .on('drag', function (event, d){
                    d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y)
                    .attr("transform", "translate(" + d.x + "," + d.y + ")");
                    // fix location to drag location, so forces are ignored (otherwise cause jittering)
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on('end', function (event, d){
                    d3.select(this).attr("stroke", null);
                    // re-enable forces
                    d.fx = null;
                    d.fy = null;
                    self.simulation.alpha(1).restart();
                }));

        g.append('circle')
            .attr("r", 20)
            .attr("id", function(d){return "c"+d.id;})
            .style("fill", function(d){
                return d.hasOwnProperty("color") ? d.color : "rgb(217, 217, 217)";
            })
            .on("mouseover", function(d){
                d3.select(this).style("fill", "red");
            })
            .on("mouseout", function(d){
                d3.select(this).style("fill", d.hasOwnProperty("color") ? d.color : "rgb(217, 217, 217)");
            })

        g.append('text')
            .attr("class", "text")
            .text(function (d) { return d.id });
        node
            .exit()
            .remove();
    
        // update simulation
        this.simulation
            .nodes(graphNodes)
            .force("link", d3.forceLink(graphLinks).distance(100))
            .force("charge", d3.forceManyBody().strength(-2))
            .alpha(1) // need to reset alpha as well here
            .restart()
    }

    addNode(x=0, y=0) {
        const ret = this.#graph.addNode(x, y);
        this.update();
        return ret;
    }

    connectNodes(source, target) {
        this.#graph.addEdge(source, target);
        this.update();
    }
}
export {ForceSimulationGraph}