import * as d3 from "../thirdParty/d3.js";

// TODO: need to determine max capacity of visualizer
// TODO: need to design what happens when capacity is exceeded
// TODO: API for legends on bottom

export class ArrayVisualizer
{
    // svg handle
    #svg;
    #svgWidth;
    #svgHeight;

    // max transition delay
    #delay;

    // left right padding
    #padding = 100;

    // circle
    #radius = 20;
    #defaultColor = "black";

    // max number of data objects to show
    #maxDataCount = 10;

    // container of data
    #data = []

    // label text handles
    #leftLabel = null
    #rightLabel = null
    #titleLabel = null

    constructor(svg, delay = 2000)
    {
        this.#svgWidth = svg.attr("width");
        this.#svgHeight = svg.attr("height");
        this.#svg = svg;
        this.#delay = delay;

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
            
    }

    ////////////////////////////////////////////////////////////////////
    //////// public functions

    get(idx)
    {
        if (idx > -1 && idx < this.size()) return this.#data[idx];
    }

    size()
    {
        return this.#data.length;
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
        const idx = this.#findDataIdxByID(dataID);
        if (idx > -1) {
            this.#data.splice(idx, 0, data);
            this.#update();
        }
    }

    // remove data by ID
    remove(dataID)
    {
        const idx = this.#findDataIdxByID(dataID);
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
        const idx1 = this.#findDataIdxByID(dataID1);
        const idx2 = this.#findDataIdxByID(dataID2);
        this.#moveHelper(dataID1, idx2);
        this.#moveHelper(dataID2, idx1);
        this.#update();
    }

    ////////////////////////////////////////////////////////////////////
    //////// private functions

    #findDataIdxByID(dataID)
    {
        return this.#data.findIndex((obj) => obj.id === dataID);
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
    
    #findIdx(id)
    {
        return this.#data.findIndex((obj) => obj.id === id);
    }

    #update() 
    {
        const self = this;
        let node = this.#svg.selectAll('.node').data(self.#data, function(d) { return d.id; });

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
                .style('opacity', 0.5)
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
                    x = self.#padding + self.#findIdx(d.id) * 2 * self.#radius
                    return "translate(" + x + "," + y + ")";
                })

                // slowly make the new data from invisible to visible
                g.transition()
                .duration(self.#delay)
                .style('opacity', 0.75)
            },
            update => {
                // positions of existing node must change to sync with position in array
                update.transition()
                .duration(self.#delay)
                .attr("transform", function(d)
                {
                    let y = self.#svgHeight/2,
                    x = self.#padding + self.#findIdx(d.id) * 2 * self.#radius
                    return "translate(" + x + "," + y + ")";
                })

                // update color
                update.select("circle")
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