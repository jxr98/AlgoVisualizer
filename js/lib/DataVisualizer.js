import * as d3 from "../thirdParty/d3.js";

export class ArrayVisualizer
{
    // svg handle
    #svg;
    #svgWidth;
    #svgHeight;

    // max transition delay
    #delay = 2000;

    // left right padding
    #padding = 100;

    // circle size
    #radius = 20;

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
        const idx = this.#data.findIndex((obj) => obj.id === dataID);
        if (idx > -1) {
            this.#data.splice(idx, 0, data);
            this.#update();
        }
    }

    // remove data by ID
    remove(dataID)
    {
        const idx = this.#data.findIndex((obj) => obj.id === dataID);
        if (idx > -1) {
            this.#data.splice(idx, 1);
            this.#update();
        }
    }

    ////////////////////////////////////////////////////////////////////
    //////// private functions
    
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