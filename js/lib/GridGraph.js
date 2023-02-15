import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {ID2Position, position2ID } from "./Utils.js";

// graph with well defined coordinate system for each node
class GridGraph
{
    // 2D grid model
    #grid; 
    #numRow;
    #numCol;
    #squareSize = 200; // must be even number
    #defaultColour = "rgb(217, 217, 217)";
    
    // svg handle
    #svg = null

    // models for D3
    #nodes = [];

    constructor(svg)
    {
        this.#svg = svg
        let width = svg.attr("width"), height = svg.attr("height");
        this.#numRow = Math.floor(height / this.#squareSize);
        this.#numCol = Math.floor(width / this.#squareSize);
        this.#grid = new Array(this.#numRow).fill(new Array(this.#numCol).fill(0));
        console.log("#row:" + this.#numRow)
        console.log("#col:" + this.#numCol)
        console.log("Grid array:", `${JSON.stringify(this.#grid)}`)

        let idx = 0;
        for (let y = 0; y < this.#numRow; y++)
        {
            for (let x = 0; x < this.#numCol; x++)
            {
                this.#nodes[idx] = {
                    id: position2ID(x, y, this.#numCol),
                    name: `${x},${y}`,
                    fx: this.#squareSize/2 + this.#squareSize * x,
                    fy: this.#squareSize/2 + this.#squareSize * y
                }
                idx++;
            }
        }
        console.log("Node array:", `${JSON.stringify(this.#nodes)}`)
        
        const self = this;
        this.simulation = d3.forceSimulation()
            .nodes(this.#nodes)
            //.force("link", d3.forceLink([]).distance(this.#squareSize))
            .on("tick", function(){self.#tick(self)})
            .alphaDecay(0.002)
        
        // run update to render graphics
        this.#update()
    }
    
    ////////////////////////////////////////////////////////////////////
    //////// public interface

    getNumRow()
    {
        return this.#numRow;
    }
    getNumCol()
    {
        return this.#numCol;
    }

    ////////////////////////////////////////////////////////////////////
    //////// private functions

    #tick(self)
    {
        const offset = this.#squareSize / 2;
        self.#svg.selectAll('.node').each(function(d, i)
        {
            d3.select(this).attr("transform", "translate(" + (d.x - offset) + "," + (d.y - offset) + ")")
        })
    }

    #updateNodes(graphNodes)
    {
        const self = this;
        let node = this.#svg.selectAll('.node').data(graphNodes);
        let g = node.enter()
            .append('g')
            .attr('class', 'node')

        g.append('rect')
            .attr("width", this.#squareSize)
            .attr("height", this.#squareSize)
            .attr("id", function(d){return "c"+d.id;})
            .style("fill", function(d){
                //return d.hasOwnProperty("color") ? d.color : self.circleColour;
                return self.#defaultColour;
            })
            .on("mouseover", function(d){
                d3.select(this).style("fill", "red");

                // let targetID=d.target.id.slice(1);
                // self.mouseHoverNode = targetID;

                // left mouse button is clicked and a node is selected
                // if(d.buttons==1&&self.mouseDownNode!=null&&self.mouseDownNode!=DefaultMouseDownNode&&self.mouseDownNode!=targetID)
                // {
                //     self.link.source=self.mouseDownNode;
                //     self.link.target=targetID;
                //     self.connectNodes(self.link.source,self.link.target);
                //     self.mouseDownNode=DefaultMouseDownNode;
                // }
                
            })
            .on("mouseout", function(d){
                //d3.select(this).style("fill", d.hasOwnProperty("color") ? d.color : self.circleColour);
                d3.select(this).style("fill", self.#defaultColour);
                // if(d.buttons==1){
                //     self.mouseDownNode=d.target.id.slice(1);
                // }
                // self.mouseHoverNode = DefaultMouseDownNode;
            })
            

        g.append('text')
            .attr("class", "text")
            .attr("x", "50%")
            .attr("y", "50%")
            .text(function (d) { return d.name })
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
        // update nodes
        this.#updateNodes(this.#nodes)
    
        // update simulation
        this.simulation
            .nodes(this.#nodes)
            //.force("link", d3.forceLink(graphLinks).distance(100))
            //.force("charge", d3.forceManyBody().strength(-2))
            //.alpha(1) // need to reset alpha as well here
            .restart()
    }
}

export {GridGraph}

