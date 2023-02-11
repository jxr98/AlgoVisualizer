import { Graph } from "./graph.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

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
    mouseHover;

    constructor(svg, width, height)
    {
        const self = this;
        this.#graph = new Graph()
        this.svg = svg
        this.link=new Link();
        this.mouseDownNode = DefaultMouseDownNode;
        this.mouseHoverNode = DefaultMouseDownNode;
        //this.defineArrowMarkers();
        this.simulation = d3.forceSimulation()
            .force("center", d3.forceCenter(width / 2, height / 2).strength(0.01))
            .nodes([])
            .force("link", d3.forceLink([]).distance(100).id(function(d){
                return d.id
            }))
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
            .style('stroke', '#000')
            .style('stroke-width', 4)
            .style('marker-start', 'url(#start-arrow)')
            .style('marker-end', 'url(#end-arrow)')

        // if($('#flexSwitchCheckDefault').is(":checked")){
        // }

        link
            .exit()
            .remove()
    
        // update nodes
        var node = this.svg.selectAll('.node').data(graphNodes);
        var g = node.enter()
            .append('g')
            .attr('class', 'node')

        g.append('circle')
            .attr("r", 20)
            .attr("id", function(d){return "c"+d.id;})
            .style("fill", function(d){
                return d.hasOwnProperty("color") ? d.color : "rgb(217, 217, 217)";
            })
            .on("mouseover", function(d){
                d3.select(this).style("fill", "red");

                var targetID=d.target.id.slice(1);
                self.mouseHoverNode = targetID;

                if(d.buttons==1&&self.mouseDownNode!=null&&self.mouseDownNode!=DefaultMouseDownNode&&self.mouseDownNode!=targetID){// left mouse button is clicked and a node is selected
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
    
        // update simulation
        let links = d3.forceLink(graphLinks).distance(100).id(function(d){
            return d.index;
        });

        this.simulation
            .nodes(graphNodes)
            .force("link", links)
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