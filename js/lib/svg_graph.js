import { UndirectedGraph } from "./UndirectedGraph.js";
import * as d3 from "../thirdParty/d3.js";
import {createDefaultGraph} from './Graph.js'

const DefaultMouseDownNode=-1;
const DefaultMouseHoverLink=-1;
const DefaultChargeSeparation = -2;

class Link{
    source;
    target;
}

const BLACKCOLOR='#000'
const SLATEGRAY ='#708090'

class ForceSimulationGraph
{
    #graph; // graph model
    svg; // handle to svg DOM element
    simulation; // handle to the force simulation model
    mouseDownNode;
    link;
    circleRadius = 25;
    circleColour = "pink";
    markerWH = 3;//marker width and height
    weighted; //record the graph if is weighted
    
    #chargeSeparation = DefaultChargeSeparation; // how much repulsion between nodes

    constructor(svg, weighted=false)
    {
        this.weighted = weighted;
        this.count = 1;
        let temp=document.querySelector ('svg')
            .getBoundingClientRect();
        let width = temp.right-temp.left, height = svg.attr("height");
        const self = this;
        this.#graph = new UndirectedGraph()
        this.svg = svg
        this.link=new Link();
        this.mouseDownNode = DefaultMouseDownNode;
        this.mouseHoverNode = DefaultMouseDownNode;
        this.mouseHoverLink = DefaultMouseHoverLink;
        this.simulation = d3.forceSimulation()
            .force("center", d3.forceCenter(width / 2, height / 2).strength(0.01))
            .nodes([])
            .force("link", d3.forceLink([]).distance(40).id(function(d){
                return d.id
            }))
            .on("tick", /* istanbul ignore next */function(){self.#tick(self)})
            .alphaDecay(0.002) // just added alpha decay to delay end of execution

        svg.on('mousedown', /* istanbul ignore next */function (e) {
            if (self.mouseHoverNode == DefaultMouseDownNode && self.mouseHoverLink == DefaultMouseHoverLink)
            {
                var coordinates = d3.pointer(e);
                self.addNode(coordinates[0], coordinates[1]);
                self.mouseDownNode=DefaultMouseDownNode;
            }
        });
        this.#defineArrowMarkers();

        // default graph
        // if (false)
        // {
        //     createDefaultGraph(this.#graph);
        //     this.#chargeSeparation = -20
        //     this.#update()
        //     this.#chargeSeparation = DefaultChargeSeparation
        // }
    }

    ////////////////////////////////////////////////////////////////////
    //////// public interface

    deleteNode(nodeID)
    {
        this.#graph.deleteNode(nodeID)
        this.#update();
    }

    disconnect(source, target)
    {
        this.#graph.removeEdge(source, target)
        this.#update();
    }

    addNode(x=0, y=0) {
        console.log(`Add node @(x,y): ${x.toFixed(0)}, ${y.toFixed(0)}`);
        const ret = this.#graph.addNode(x, y);
        this.#update();
        return ret;
    }

    connectNodes(source, target) {
        if(this.#graph.checkConnection(source,target)==0){
            console.log(`Connecting nodes ${source} <-> ${target}`);
            this.#graph.addEdge(source, target);
            this.#update();

            /* istanbul ignore next */
            if (this.weighted)
                this.#addWeightInputLine(source, target);
        }
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

    // ret is an array of {source,target, weight} objects
    highlightLinks(ret){
        // first make all links gray
        d3.selectAll('line')
            .style('stroke', SLATEGRAY);

        let self=this

        //only hightlight nodes in ret
        d3.selectAll('line')
            .each(function (d){
                if(self.checkLinkExistsInRet(ret,d.source.id,d.target.id)){
                    d3.select(this)
                        .style('stroke', BLACKCOLOR)
                        .style('stroke-width', 2.4);
                }
            })

    }

    checkLinkExistsInRet(ret,x,y){
        for(var i=0;i<ret.length;i++){
            if((x===parseInt(ret[i].source) && y===parseInt(ret[i].target)) ||
                (y===parseInt(ret[i].source) && x===parseInt(ret[i].target))){
                return true;
            }
        }
        return false
    }

    ////////////////////////////////////////////////////////////////////
    //////// private functions

    // this function updates the rendering for D3 simulation
    /* istanbul ignore next */
    #tick(self) {
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
        self.svg.selectAll('.node').each(function(d)
        {
            self.#graph.updateNodeProp(d.id, {x: d.x, y: d.y}); // sync d3 node model to our own model
            d3.select(this).attr("cx", d.x).attr("cy", d.y).attr("transform", "translate(" + d.x + "," + d.y + ")")
        })
    }

    #updateLink(graphLinks,linkColor)
    {
        let links = this.svg.selectAll('.link').data(graphLinks)
        let self = this

        let link = links.enter()
        .insert('line', '.node')
        .attr('class', 'link')
        .style('stroke', linkColor)
        .style('stroke-width', 1.9)
        .on("dblclick", /* istanbul ignore next */function(e, d){
            console.log("disconnect source " +  d.source.id + ", dst " + d.target.id)
             self.disconnect(d.source.id, d.target.id);
             if (this.weighted)
                self.#deleteWeightInputLineByLine(d.source.id, d.target.id)
             self.mouseHoverLink = DefaultMouseHoverLink;
        })
        .on("mouseover", /* istanbul ignore next */function(e){
            d3.select(this).style('stroke-width', 4)
            self.mouseHoverLink = 0;
        })
        .on("mouseout", /* istanbul ignore next */function(e){
            d3.select(this).style('stroke-width', 1.9)
            self.mouseHoverLink = DefaultMouseHoverLink;
        })


        link.style('marker-end', 'url(#end-arrow)')
        .style('marker-start', 'url(#start-arrow)')


        links.exit().remove()
    }

    // main update function for when there are changes to nodes/links
    #updateNodes(graphNodes)
    {
        const self = this;
        let node = this.svg.selectAll('.node')
        .data(graphNodes, function(d) {
            
            if (d === undefined)
            {
                console.log(graphNodes)
            }
            return d.id; 
        })

        let g = node.enter()
            .append('g')
            .attr('class', 'node')

        g.append('circle')
            .attr("r", this.circleRadius)
            .attr("id", function(d){return "c"+d.id;})
            .style("fill", function(d){
                return d.hasOwnProperty("color") ? d.color : self.circleColour;
            })
            .style("stroke", "black")
            .style("stroke-width", 3)
            .on("mouseover", /* istanbul ignore next */function(d){

                // mouse hover effect - ON
                d3.select(this).style("opacity", 0.6);
                d3.select(this).style("stroke-width", 6);

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
            .on("mouseout", /* istanbul ignore next */function(d){
                
                // mouse hover effect - OFF
                d3.select(this).style("opacity", 1);
                d3.select(this).style("stroke-width", 3);


                if(d.buttons==1){
                    self.mouseDownNode=d.target.id.slice(1);
                }
                self.mouseHoverNode = DefaultMouseDownNode;
            })
            .on("dblclick", /* istanbul ignore next */function(e, d){
                //console.log(d.id)
                 self.deleteNode(d.id);
                 if (this.weighted)
                     self.#deleteWeightInputLineByNode(d.id)
                 self.mouseHoverNode = DefaultMouseDownNode
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
                        user-select: none;')
            .attr("x", -4)         // set x position of left side of text
            .attr("y", 5)
            // .attr("text-anchor", "middle")
            // .attr("alignment-baseline", "central")
            
        node
            .exit()
            .remove();
    }

    #update() {
        // update links
        const graphLinks = this.#graph.getLinks();
        this.#updateLink(graphLinks,BLACKCOLOR)
    
        // update nodes
        const graphNodes = this.#graph.getNodes();
        this.#updateNodes(graphNodes)
    
        // update simulation
        this.simulation
            .nodes(graphNodes)
            .force("link", d3.forceLink(graphLinks).distance(100).id(function(d){return d.id;}))
            .force("charge", d3.forceManyBody().strength(this.#chargeSeparation))
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

    #addWeightInputLine(source, target) 
    /* istanbul ignore next */
    {
        let div = document.createElement("div")
        div.id = "weight" + this.count;
        // let line_info = document.createElement("label");
        // line_info.style.background = "grey";
        // line_info.style.width = "30px";
        // line_info.style.textAlign = "center";
        // line_info.innerHTML = this.count;
        // line_info.style.marginRight = "10px";
        let nodes_info = document.createElement("label")
        nodes_info.id = "nodes" + source + "+" + target
        nodes_info.style.background = "pink"
        nodes_info.style.width = "60px"
        nodes_info.style.textAlign = "center"
        nodes_info.innerHTML = source + " " + target
        nodes_info.style.marginRight = "10px"
        let weight_info = document.createElement("input")
        weight_info.id = "weight" + source + "+" + target
        weight_info.style.background = "#F0F8FF"
        weight_info.value = 1
        weight_info.style.border = 0
        // div.appendChild(line_info)
        div.appendChild(nodes_info)
        div.appendChild(weight_info)
        document.getElementById("weight-input").appendChild(div)
        this.count++
    }

    #deleteWeightInputLineByLine(node1, node2) 
    /* istanbul ignore next */{
        let line1 = document.getElementById("nodes" + node1 + "+" + node2)
        let line2 = document.getElementById("nodes" + node2 + "+" + node1)
        if (line1 != null) {
            line1.remove()
            document.getElementById("weight" + node1 + "+" + node2).remove()
        }
        if (line2 != null) {
            line2.remove()
            document.getElementById("weight" + node2 + "+" + node1).remove()
        }
    }

    
    #deleteWeightInputLineByNode(node) 
    /* istanbul ignore next */
    {
        let nodes = this.#graph.getNodes()
        let nodesNum = nodes.length
        let nodesMaxIndex = Object.values(nodes[nodesNum - 1])[0]
        for (let i = 0; i <= nodesMaxIndex; i++) {
            let line1 = document.getElementById("nodes" + node + "+" + i)
            let line2 = document.getElementById("nodes" + i + "+" + node)
            if (line1 != null) {
                line1.remove()
                document.getElementById("weight" + node + "+" + i).remove()
            }
            if (line2 != null) {
                line2.remove()
                document.getElementById("weight" + i + "+" + node).remove()
            }
        }
    }
}
export {ForceSimulationGraph}