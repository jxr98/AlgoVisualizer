import * as d3 from "../thirdParty/d3.js";
import {ID2Position, position2ID } from "./Utils.js";

const obstacleNodeID = -1;

// graph with well defined coordinate system for each node
class GridGraph
{
    // grid model
    #yRange;
    #xRange;
    #squareSize = 100; // must be even number
    #defaultColour = "rgb(217, 217, 217)";
    #obstacleColor = "black";
    #maxNodeID = 0;
    
    // svg handle
    #svg = null

    // models for D3
    #nodes = [];

    constructor(svg)
    {
        this.#svg = svg
        let width = svg.attr("width"), height = svg.attr("height");
        this.#yRange = Math.floor(height / this.#squareSize);
        this.#xRange = Math.floor(width / this.#squareSize);
        let reducedHeight = this.#yRange*this.#squareSize,
        reducedWidth = this.#xRange*this.#squareSize

        
        this.#svg.attr("width", reducedWidth).attr("height", reducedHeight)
        console.log("#yRange:" + this.#yRange)
        console.log("#xRange:" + this.#xRange)

        let idx = 0;
        for (let y = 0; y < this.#yRange; y++)
        {
            for (let x = 0; x < this.#xRange; x++)
            {
                let nodeID = position2ID(x, y, this.#xRange);
                this.#maxNodeID = Math.max(this.#maxNodeID, nodeID);
                this.#nodes[idx] = {
                    id: nodeID,
                    name: `${x},${y}`,
                    fx: this.#squareSize/2 + this.#squareSize * x,
                    fy: this.#squareSize/2 + this.#squareSize * y,
                    color : this.#defaultColour,
                    isObstacle : false
                }
                idx++;
            }
        }

        svg.on("click", function(e){
            //console.log("svg")
        })
        
        this.#setupSimulation();
    }
    
    ////////////////////////////////////////////////////////////////////
    //////// public interface

    getYRange()
    {
        return this.#yRange;
    }
    getXRange()
    {
        return this.#xRange;
    }
    getNodeID(x, y)
    {
        if (!this.#isValidX(x) || !this.#isValidY(y))
        {
            console.error("Invalid coordinates recieved")
        }
        return position2ID(x, y, this.#xRange);
    }
    getNodePosition(nodeID)
    {
        if (!this.#isValidID(nodeID))
        {
            console.error("Invalid nodeID (getNodePosition)")
        }
        return ID2Position(nodeID, this.#xRange)
    }
    isObstacle(nodeID)
    {
        let {x, y} = ID2Position(nodeID, this.#xRange)
        return this.#getNodeAt(x, y) == obstacleNodeID
    }
    getAdjacent(nodeID)
    {
        if (!this.#isValidID(nodeID))
        {
            console.error("Invalid nodeID (getAdjacent)")
        }
        let {x, y} = ID2Position(nodeID, this.#xRange)
        let neighbors = [
            this.#getNodeAt(x+1, y),
            this.#getNodeAt(x-1, y),
            this.#getNodeAt(x, y+1),
            this.#getNodeAt(x, y-1)
        ]

        // prune obstacle nodes
        let ret = []
        neighbors.forEach(function(val){
            if (val != obstacleNodeID) ret[ret.length] = val
        })
        return ret
    }
    getGridArray()
    {
        return new Array(this.#yRange).fill(new Array(this.#xRange).fill(0));
    }

    changeColor(nodeID, color)
    {
        if (!this.#isValidID(nodeID))
        {
            console.error("Invalid nodeID (changeColor)")
        }
        //let nodeID = this.#getNodeAt(x, y);
        this.#nodes[nodeID].color = color
    }

    setObstacle(nodeID)
    {
        if (!this.#isValidID(nodeID))
        {
            console.error("Invalid nodeID (setObstacle)")
        }
        this.#nodes[nodeID].isObstacle = true
    }

    unsetObstacle(nodeID)
    {
        if (!this.#isValidID(nodeID))
        {
            console.error("Invalid nodeID (unsetObstacle)")
        }
        this.#nodes[nodeID].isObstacle = false
    }

    ////////////////////////////////////////////////////////////////////
    //////// private functions
    #isValidX(x)
    {
        return x >=0 && x <this.#xRange
    }
    #isValidY(y)
    {
        return y >=0 && y <this.#yRange
    }
    #isValidID(nodeID)
    {
        return nodeID >= 0 && nodeID <= this.#maxNodeID
    }

    #setupSimulation()
    {
        const self = this;
        this.simulation = d3.forceSimulation()
            .nodes(this.#nodes)
            //.force("link", d3.forceLink([]).distance(this.#squareSize))
            .on("tick", function(){self.#tick(self)})
            .alphaDecay(0.002)
        
        // call update immediately to render graphics
        self.#update()

        // call update to keep the simulation running
        // otherwise, simulation stops and certain aspects of the grid may become non-responsive
        // NOTE: interval here should not be too long, otherwise simulation could end before update() is refreshed
        setInterval(function(){self.#update()}, 5000)
    }

    #getNodeAt(x, y)
    {
        
        if (x<0 || y <0 || x >= this.#xRange || y >= this.#yRange ) return obstacleNodeID;
        return position2ID(x, y, this.#xRange);
    }

    #tick(self)
    {
        const offset = this.#squareSize / 2;
        self.#svg.selectAll('.node').each(function(d, i)
        {
            // manage tile locations
            // TODO: since tile locations don't need to change every tick, maybe refactor this out?
            d3.select(this).attr("transform", "translate(" + (d.x - offset) + "," + (d.y - offset) + ")")

            // manage color
            d3.select(this).select("rect").style("fill", function(d){
                if (d.isObstacle) return self.#obstacleColor; // disallow change color on obstacles
                return d.hasOwnProperty("color") ? d.color : self.#defaultColour;
            });
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
            .on('click', function (e, d) {
                d.isObstacle = !d.isObstacle
                 console.log("rect")
            })
            //  .on("mouseover", function(d){
            //      d3.select(this).style("fill", "red");
            //      console.log(1)
            //  })
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
            .alpha(1) // need to reset alpha as well here
            .restart()
    }
}

export {GridGraph}

