import * as d3 from "../thirdParty/d3.js";

export class ArrayVisualizer
{
    // svg handle
    #svg;
    #svgWidth;
    #svgHeight;

    // overflow handling
    #overflowPolicy = "hideLeft"; // overflow policy: "hideLeft" or "hideRight"
    #maxDataCount = 0; // estimated max number of data objects to display

    // max transition delay
    #delay;

    // container of data
    #data = [] // contains complete array data
    #displayData = [] // only contains array data that is to be displayed. Excludes overflow nodes

    // label text handles
    #leftLabel = null
    #rightLabel = null
    #titleLabel = null
    #leftOverflowNote = null
    #rightOverflowNote = null

    // resize observer
    #resiszeObs = null

    // legends handles
    #legends = []
    
    // constant parameters
    #padding = 100; // left right padding
    #opacity = 0.60; // circle size opacity
    #radius = 20; // circle size
    #defaultColor = "black"; // circle color default
    

    constructor(svg, delay = 2000)
    {
        let self = this;
        this.#svg = svg;
        this.#svgWidth = this.#svg.node().clientWidth;
        this.#svgHeight = this.#svg.node().clientHeight;
        this.#delay = delay;

        this.#maxDataCount = this.#estimateMaxNodeCapacity();
        

        // setup labels
        this.#leftLabel = this.#svg.append('text')
            .attr("class", "text")
            .text("")
        this.#rightLabel = this.#svg.append('text')
            .attr("class", "text")
            .text("")
        this.#titleLabel = this.#svg.append('text')
            .attr("class", "text")
            .text("")
        this.#leftOverflowNote = this.#svg.append('text')
            .attr("class", "text")
            .text("")
        this.#rightOverflowNote = this.#svg.append('text')
            .attr("class", "text")
            .text("")
        this.#updateOverflowLabels(true);

        // resize observer for the svg container
        this.#resiszeObs = new ResizeObserver(function()
        {   
            self.#onResize(self);
        }).observe(this.#svg.node());
            
    }

    ////////////////////////////////////////////////////////////////////
    //////// public functions

    changeOverflowPolicy(str)
    {
        if (str === "hideLeft" || str === "hideRight"){
            this.#overflowPolicy = str;
            this.#update();    
        }
    }

    clear()
    {
        this.#data = []
        this.#update()
    }

    get(idx)
    {
        if (idx > -1 && idx < this.size()) return this.#data[idx];
    }

    findDataIdxByID(dataID)
    {
        return this.#data.findIndex((obj) => obj.id === dataID);
    }

    size()
    {
        return this.#data.length;
    }

    setLegend(str, color)
    {
        // create new legend
        let newLegendGroup = this.#svg.append('g')
        .attr("class", "legend")
        .style("opacity", this.#opacity);

        this.#legends.push(newLegendGroup);
        newLegendGroup.append("rect")
        .attr("fill", color)
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", -25)
        .attr("y", -15)
        newLegendGroup.append("text").text(str)

        // reposition all the legends
        this.#updateLegends();
    }

    setTitle(str)
    {
        let self = this
        this.#titleLabel.text(str)
        .attr("transform", function()
        {
            let y = 20,
            rightX = self.#svgWidth/2,
            textDOM = d3.select(this).node()
            /* istanbul ignore next */
            if (typeof textDOM.getComputedTextLength === "function") rightX -= textDOM.getComputedTextLength()/2
            return "translate(" + rightX + "," + y + ")"
        })
    }

    setRightLabel(str)
    {
        let self = this
        this.#rightLabel.text(str)
            .attr("transform", function()
            {
                let y = self.#svgHeight/2,
                textDOM = d3.select(this).node(),
                rightX = self.#svgWidth - 10
                /* istanbul ignore next */
                if (typeof textDOM.getComputedTextLength === "function") rightX =  rightX - textDOM.getComputedTextLength()
                return "translate(" + rightX + "," + y + ")"
            })
    }

    setLeftLabel(str)
    {
        let y = this.#svgHeight/2,
        leftX = 10
        this.#leftLabel.text(str)
            .attr("transform", "translate(" + leftX + "," + y + ")")
    }

    // insert data to back of array
    insertLeft(data)
    {
        this.#data.unshift(data);
        this.#update();
    }

    // remove last array element
    removeLeft()
    {
        this.#data.shift();
        this.#update();
    }

    // insert data to front of array
    insertRight(data)
    {
        // console.log(`${JSON.stringify(data)}`)
        this.#data.push(data);
        this.#update();
    }

    // remove right most element
    removeRight()
    {
        this.#data.pop();
        this.#update();
    }

    // insert data object before element with given ID
    insertBefore(data, dataID)
    {
        const idx = this.findDataIdxByID(dataID);
        if (idx > -1) {
            this.#data.splice(idx, 0, data);
            this.#update();
        }
    }

    // remove data by ID
    remove(dataID)
    {
        const idx = this.findDataIdxByID(dataID);
        if (idx > -1) {
            this.#data.splice(idx, 1);
            this.#update();
        }
    }

    move(dataID, position)
    {
        this.#moveHelper(dataID, position);
        this.#update();
    }

    swapByID(dataID1, dataID2)
    {
        const idx1 = this.findDataIdxByID(dataID1);
        const idx2 = this.findDataIdxByID(dataID2);
        this.#moveHelper(dataID1, idx2);
        this.#moveHelper(dataID2, idx1);
        this.#update();
    }

    updateRendering()
    // sometimes visual properties are changed externally, user would want to call this to show rendering update
    {
        this.#update()
    }

    ////////////////////////////////////////////////////////////////////
    //////// private functions

    #updateOverflowLabels(hide = false)
    {
        if (hide)
        {
            this.#leftOverflowNote.style("opacity", 0);
            this.#rightOverflowNote.style("opacity", 0);
        }
        else
        {
            this.#leftOverflowNote.style("opacity", 1);
            this.#rightOverflowNote.style("opacity", 1);
        }

        let self = this;
        let y = this.#svgHeight/2 - 25,
        leftX = 10
        this.#leftOverflowNote.attr("transform", "translate(" + leftX + "," + y + ")");
        this.#rightOverflowNote.attr("transform", function()
        {
            let textDOM = self.#rightOverflowNote.node(),
            rightX = self.#svgWidth - 10
            /* istanbul ignore next */
            if (typeof textDOM.getComputedTextLength === "function") rightX =  rightX - textDOM.getComputedTextLength()
            return "translate(" + rightX + "," + y + ")"
        })
    }

    #updateLegends()
    {
        let self = this;
        let numLegends = this.#legends.length,
        spacing = self.#svgWidth/(numLegends+1)
        this.#legends.forEach(function(legendGroup, idx)
        {
            legendGroup.attr("transform", function()
            {
                let y = self.#svgHeight - 20,
                rightX = (1 + idx) * spacing
                return "translate(" + rightX + "," + y + ")"
            })
        });
    }
    
    #onResize(self)
    /* istanbul ignore next */
    // callback func
    {
        // update width and height
        self.#svgWidth = self.#svg.node().clientWidth;
        self.#svgHeight = self.#svg.node().clientHeight;

        // console.log(`SVG resized;`)
        // console.log(`width: ${self.#svgWidth}`)
        // console.log(`height: ${self.#svgHeight}`)

        // update labeling
        self.setLeftLabel(self.#leftLabel.text());
        self.setRightLabel(self.#rightLabel.text());
        self.setTitle(self.#titleLabel.text());
        self.#updateLegends();
        self.#updateOverflowLabels();
        this.#maxDataCount = this.#estimateMaxNodeCapacity()
        self.#update();

    }

    #moveHelper(dataID, position)
    {
        const idx = this.#data.findIndex((obj) => obj.id === dataID);
        if (idx > -1 && position < this.#data.length && position != idx) {
            let tmp = this.#data[idx];
            if (position > idx)
            {
                // move data right
                this.#data.splice(position+1, 0, tmp); // insert new copy of data
                this.#data.splice(idx, 1);     // remove old copy
                
            }
            else
            {
                // move data left
                this.#data.splice(position, 0, tmp); // insert new copy of data
                this.#data.splice(idx+1, 1);     // remove old copy
            }
        }
    }

    #estimateMaxNodeCapacity()
    {
        return Math.floor((this.#svgWidth - 2 * this.#padding) / (2 * this.#radius));
    }
    
    #findIdx(id, container)
    {
        return container.findIndex((obj) => obj.id === id);
    }

    #update() 
    /* istanbul ignore next */
    {
        // check for overflow
        this.#displayData = []
        let numDataHiden = 0;
        if (this.size() > this.#maxDataCount)
        {
            numDataHiden = this.size() - this.#maxDataCount;

            // based on overflow policy, hide certain data
            if (this.#overflowPolicy === "hideLeft")
            {
                for (let i = numDataHiden ; i < this.#data.length; ++i)
                {
                    this.#displayData[i - numDataHiden] = this.#data[i];
                }
                
                this.#leftOverflowNote.text("# hidden nodes: " + numDataHiden)
            }
            else
            {
                // hide right most nodes
                for (let i = 0 ; i < this.#maxDataCount; ++i)
                {
                    this.#displayData[i] = this.#data[i];
                }
                this.#rightOverflowNote.text("# hidden nodes: " + numDataHiden)
            }

            this.#updateOverflowLabels();
        }
        else
        {
            // display all data
            this.#displayData = this.#data;
            this.#updateOverflowLabels(true);
        }

        const self = this;
        let node = this.#svg.selectAll('.node').data(this.#displayData, function(d) { return d.id; });

        node.join(
            enter => 
            {
                // create new svg group
                let g = enter.append('g')
                .attr('class', 'node')
                .style('opacity', 0) // make it invisible initially, we will transition to make it appear
                
                // draw circle
                g.append('circle')
                .attr('r', self.#radius)
                .style('opacity', self.#opacity)
                .style("fill", function(d){
                    return d.hasOwnProperty("color") ? d.color : self.#defaultColor;
                });

                // draw text
                g.append('text')
                .attr("class", "text")
                .text(function (d) { 
                    //console.log(JSON.stringify(d, null, 2))
                    return d.hasOwnProperty("text") ? d.text : "";
                })
                .attr("pointer-events", "none")
                .style("-webkit-touch-callout", "none")
                .style("-khtml-user-select", "none")
                .style("-moz-user-select", "none")
                .style("-ms-user-select", "none")
                .style("user-select", "none")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .style("stroke", "#0000FF") //blue-ish

                // set initial location based on position of data in the array
                g.attr("transform", function(d)
                {
                    let y = self.#svgHeight/2,
                    x = self.#padding + self.#findIdx(d.id, self.#displayData) * (2 * self.#radius)
                    return "translate(" + x + "," + y + ")";
                })

                // slowly make the new data from invisible to visible
                g.transition()
                .duration(self.#delay)
                .style('opacity', self.#opacity)
            },
            update => {
                // positions of existing node must change to sync with position in array
                update.transition()
                .duration(self.#delay)
                .attr("transform", function(d)
                {
                    let y = self.#svgHeight/2,
                    x = self.#padding + self.#findIdx(d.id, self.#displayData) * 2 * self.#radius
                    return "translate(" + x + "," + y + ")";
                })
                // incase the enter transition is interrupted, we need to finish the opacity transition here
                // Otherwise, some nodes can be invisible
                .style('opacity', self.#opacity) 

                // update color
                update.select("circle")
                .transition()
                .duration(self.#delay)
                .style("fill", function(d){
                    return d.hasOwnProperty("color") ? d.color : self.#defaultColor;
                });
            },
            exit => {
                // nodes that are removed are faded away
                exit.transition()
                .duration(self.#delay)
                .style('opacity', 0)
                .remove()
            }
        )
    }
} // class 