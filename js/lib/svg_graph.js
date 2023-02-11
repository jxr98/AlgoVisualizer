import { Graph } from "./graph.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const DefaultMouseDownNode=-1;
const CircleRadius = 20;

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
    mouseHover;

    constructor(svg, width, height)
    {
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
            .on("tick", function(){self.tick(self)})
            .alphaDecay(0.002) // just added alpha decay to delay end of execution
        
        svg.on('mousedown', function (e) {
            if (self.mouseHoverNode == DefaultMouseDownNode)
            {
                var coordinates = d3.pointer(e);
                self.addNode(coordinates[0], coordinates[1]);
                self.mouseDownNode=DefaultMouseDownNode;
            }
        });
        this.defineArrowMarkers();
    }

    // this function updates the rendering for D3 simulation
    tick(self)
    {
        // update links and arrows
        self.svg.selectAll('.link').each(function(d, i){
            let deltaX = d.target.x - d.source.x,
            deltaY = d.target.y - d.source.y,
            dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
            normX = deltaX / dist,
            normY = deltaY / dist,
            sourcePadding = CircleRadius + 3,
            targetPadding = CircleRadius + 3,
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

    updateLink(graphLinks)
    {
        var link = this.svg.selectAll('.link').data(graphLinks);
        link.enter()
            .insert('line', '.node')
            .attr('class', 'link')
            .style('stroke', '#000')
            .style('stroke-width', 4)
            .style('marker-start', 'url(#start-arrow)')
            .style('marker-end', 'url(#end-arrow)')
        link
            .exit()
            .remove()
    }

    // main update function for when there are changes to nodes/links
    updateNodes(graphNodes)
    {
        const self = this;
        let node = this.svg.selectAll('.node').data(graphNodes);
        let g = node.enter()
            .append('g')
            .attr('class', 'node')

        g.append('circle')
            .attr("r", CircleRadius)
            .attr("id", function(d){return "c"+d.id;})
            .style("fill", function(d){
                return d.hasOwnProperty("color") ? d.color : "rgb(217, 217, 217)";
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
                d3.select(this).style("fill", d.hasOwnProperty("color") ? d.color : "rgb(217, 217, 217)");
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

    update() {
        // update links
        const graphLinks = this.#graph.getLinks();
        this.updateLink(graphLinks)
    
        // update nodes
        const graphNodes = this.#graph.getNodes();
        this.updateNodes(graphNodes)
    
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

    defineArrowMarkers(){
        this.svg.append('svg:defs').append('svg:marker')
            .attr('id', 'end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 6)
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#000');

        this.svg.append('svg:defs').append('svg:marker')
            .attr('id', 'start-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 4)
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M10,-5L0,0L10,5')
            .attr('fill', '#000');

    }
}
export {ForceSimulationGraph}