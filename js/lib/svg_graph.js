import { Graph } from "./graph.js";
import * as d3 from "../thirdParty/d3.js";

const DefaultMouseDownNode=-1;

class Link{
    source;
    target;
}

class ForceSimulationGraph
{
    #graph; // graph model
    svg; // handle to svg DOM element
    simulation; // handle to the force simulation model
    mouseDownNode;
    link;
    circleRadius;
    circleColour;
    markerWH;//marker width and height

    constructor(svg)
    {
        let width = svg.attr("width"), height = svg.attr("height");
        this.circleRadius=25;//default
        this.circleColour="rgb(217, 217, 217)"; //default
        this.markerWH=3;//default
        const self = this;
        this.#graph = new Graph()
        this.svg = svg
        this.link=new Link();
        this.mouseDownNode = DefaultMouseDownNode;
        this.mouseHoverNode = DefaultMouseDownNode;
        this.simulation = d3.forceSimulation()
            .force("center", d3.forceCenter(width / 2, height / 2).strength(0.01))
            .nodes([])
            .force("link", d3.forceLink([]).distance(100).id(function(d){
                return d.id
            }))
            .on("tick", function(){self.#tick(self)})
            .alphaDecay(0.002) // just added alpha decay to delay end of execution
        
        svg.on('mousedown', function (e) {
            if (self.mouseHoverNode == DefaultMouseDownNode)
            {
                var coordinates = d3.pointer(e);
                self.addNode(coordinates[0], coordinates[1]);
                self.mouseDownNode=DefaultMouseDownNode;
            }
        });
        this.#defineArrowMarkers();
    }

    ////////////////////////////////////////////////////////////////////
    //////// public interface

    deleteNode(nodeID)
    {

    }

    disconnect(source, target)
    {
        
    }

    addNode(x=0, y=0) {
        console.log(`Add node @(x,y): ${x.toFixed(0)}, ${y.toFixed(0)}`);
        const ret = this.#graph.addNode(x, y);
        this.#update();
        return ret;
    }

    connectNodes(source, target) {
        console.log(`Connecting nodes ${source} <-> ${target}`);
        this.#graph.addEdge(source, target);
        this.#update();
    }

    getGraphModel()
    {
        return this.#graph;
    }

    changeColor(node, color)
    {
        this.#graph.updateNodeProp(node, {color: color});
        this.#update();
        this.svg.selectAll("g").each(function(d)
        {
            d3.select(this).select("circle").style("fill", function(d){
                return d.hasOwnProperty("color") ? d.color : self.circleColour;
            });
        });
    }

    ////////////////////////////////////////////////////////////////////
    //////// private functions

    // this function updates the rendering for D3 simulation
    #tick(self)
    {
        // update links and arrows
        self.svg.selectAll('.link').each(function(d){
            // calculation taken from https://codepen.io/mikehenrichs/pen/NWJZyw
            let deltaX = d.target.x - d.source.x,
            deltaY = d.target.y - d.source.y,
            dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
            normX = deltaX / dist,
            normY = deltaY / dist,
            sourcePadding = self.circleRadius + self.markerWH,
            targetPadding = self.circleRadius + self.markerWH,
            sourceX = d.source.x + (sourcePadding * normX),
            sourceY = d.source.y + (sourcePadding * normY),
            targetX = d.target.x - (targetPadding * normX),
            targetY = d.target.y - (targetPadding * normY);
            d3.select(this).attr("x1", sourceX).attr("y1", sourceY).attr("x2", targetX).attr("y2", targetY)
        })

        // update node locations and sync to our graph model
        self.svg.selectAll('.node').each(function(d, i)
        {
            self.#graph.updateNodeProp(i, {x: d.x, y: d.y}); // sync d3 node model to our own model
            d3.select(this).attr("cx", d.x).attr("cy", d.y).attr("transform", "translate(" + d.x + "," + d.y + ")")
        })
    }

    #updateLink(graphLinks)
    {
        var link = this.svg.selectAll('.link').data(graphLinks);
        if($('#flexSwitchCheckDefault').is(":checked")){
            link.enter()
                .insert('line', '.node')
                .attr('class', 'link')
                .style('stroke', '#000')
                .style('stroke-width', 1.9)
                .style('marker-end', 'url(#end-arrow)')
        }else{
            link.enter()
                .insert('line', '.node')
                .attr('class', 'link')
                .style('stroke', '#000')
                .style('stroke-width', 1.9)
                .style('marker-end', 'url(#end-arrow)')
                .style('marker-start', 'url(#start-arrow)')
        }
        link
            .exit()
            .remove()
    }

    // main update function for when there are changes to nodes/links
    #updateNodes(graphNodes)
    {
        const self = this;
        let node = this.svg.selectAll('.node').data(graphNodes);
        let g = node.enter()
            .append('g')
            .attr('class', 'node')

        g.append('circle')
            .attr("r", this.circleRadius)
            .attr("id", function(d){return "c"+d.id;})
            .style("fill", function(d){
                return d.hasOwnProperty("color") ? d.color : self.circleColour;
            })
            .on("mouseover", function(d){
                d3.select(this).style("fill", "red");

                let targetID=d.target.id.slice(1);
                self.mouseHoverNode = targetID;

                // left mouse button is clicked and a node is selected
                if(d.buttons==1&&self.mouseDownNode!=null&&self.mouseDownNode!=DefaultMouseDownNode&&self.mouseDownNode!=targetID)
                {
                    self.link.source=self.mouseDownNode;
                    self.link.target=targetID;
                    self.connectNodes(self.link.source,self.link.target);
                    self.mouseDownNode=DefaultMouseDownNode;
                }
                
            })
            .on("mouseout", function(d){
                d3.select(this).style("fill", d.hasOwnProperty("color") ? d.color : self.circleColour);
                if(d.buttons==1){
                    self.mouseDownNode=d.target.id.slice(1);
                }
                self.mouseHoverNode = DefaultMouseDownNode;
            })
            

        g.append('text')
            .attr("class", "text")
            .text(function (d) { return d.id })
            .attr("pointer-events", "none")
            .attr('style', '-webkit-touch-callout: none;\
                        -webkit-user-select: none;\
                        -khtml-user-select: none;\
                        -moz-user-select: none;\
                        -ms-user-select: none;\
                        user-select: none;');
        node
            .exit()
            .remove();
    }

    #update() {
        // update links
        const graphLinks = this.#graph.getLinks();
        this.#updateLink(graphLinks)
    
        // update nodes
        const graphNodes = this.#graph.getNodes();
        this.#updateNodes(graphNodes)
    
        // update simulation
        this.simulation
            .nodes(graphNodes)
            .force("link", d3.forceLink(graphLinks).distance(100))
            .force("charge", d3.forceManyBody().strength(-2))
            .alpha(1) // need to reset alpha as well here
            .restart()
    }

    #defineArrowMarkers(){
        this.svg.append('svg:defs').append('svg:marker')
            .attr('id', 'end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 5.5)
            .attr('markerWidth', self.markerWH)
            .attr('markerHeight', self.markerWH)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#000');

        this.svg.append('svg:defs').append('svg:marker')
            .attr('id', 'start-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 5.5)
            .attr('markerWidth', self.markerWH)
            .attr('markerHeight', self.markerWH)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M10,-5L0,0L10,5')
            .attr('fill', '#000');

    }
}
export {ForceSimulationGraph}