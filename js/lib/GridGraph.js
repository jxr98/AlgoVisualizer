import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {ID2Position, position2ID } from "./Utils.js";

// graph with well defined coordinate system for each node
class GridGraph
{
    // 2D grid model
    #grid; 
    #numRow;
    #numCol;
    #squareSize = 100; // must be even number
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
        let reducedHeight = this.#numRow*this.#squareSize,
        reducedWidth = this.#numCol*this.#squareSize

        
        this.#svg.attr("width", reducedWidth).attr("height", reducedHeight)
        //console.log("trimmed width and height to fit")

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
                    fy: this.#squareSize/2 + this.#squareSize * y,
                    color : this.#defaultColour
                }
                idx++;
            }
        }
        //console.log("Node array:", `${JSON.stringify(this.#nodes)}`)
        
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
    getNodeID(x, y)
    {
        return position2ID(x, y, this.#numCol);
    }
    getAdjacent(nodeID)
    {
        let {x, y} = ID2Position(nodeID, this.#numCol)
        let neighbors = [
            this.#getNodeAt(x+1, y),
            this.#getNodeAt(x-1, y),
            this.#getNodeAt(x, y+1),
            this.#getNodeAt(x, y-1)
        ]
        let ret = []
        neighbors.forEach(function(val){
            if (val != -1) ret[ret.length] = val
        })
        return ret
    }
    getGridArray()
    {
        return new Array(this.#numRow).fill(new Array(this.#numCol).fill(0));
    }

    changeColor(nodeID, color)
    {
        // change the color property in our model first
        //let nodeID = this.#getNodeAt(x, y);
        this.#nodes[nodeID].color = color

        let self = this
        this.#svg.selectAll("g").each(function(d)
        {
            d3.select(this).select("rect").style("fill", function(d){
                return d.hasOwnProperty("color") ? d.color : self.#defaultColour;
            });
        });
    }

    ////////////////////////////////////////////////////////////////////
    //////// private functions
    #getNodeAt(x, y)
    {
        
        if (x<0 || y <0 || x >= this.#numCol || y >= this.#numRow ) return -1;
        return position2ID(x, y, this.#numCol);
    }

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
                return d.hasOwnProperty("color") ? d.color : self.#defaultColour;
            })
            .style("stroke-width", 1)
            .style("stroke", "rgb(0,0,0)")
            // .on("mouseover", function(d){
            //     d3.select(this).style("fill", "red");
            // })
            // .on("mouseout", function(d){
            //     d3.select(this).style("fill", self.#defaultColour);
            // })
            
        const offset = this.#squareSize / 2;
        g.append('text')
            .attr("class", "text")
            .attr("x", offset)
            .attr("y", offset)
            .text(function (d) { return d.name })
            .attr("pointer-events", "none")
            .style("-webkit-touch-callout", "none")
            .style("-khtml-user-select", "none")
            .style("-moz-user-select", "none")
            .style("-ms-user-select", "none")
            .style("user-select", "none")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
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

