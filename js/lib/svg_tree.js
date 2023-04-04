import * as d3 from "../thirdParty/d3.js";
import {maxHeap, minHeap} from "./Heap.js";

class ForceSimulationGraph
{
    constructor(svg, data) {
        this.svg = svg
        this.data = data
        let len = this.data.length
        let count = 0
        let width = parseInt(this.svg.style("width"));
        let line_w = 21.5
        let line_h = 100
        let total_h = 50
        let dataset = []
        let nodes_x = [width / 2 - 8 * line_w, width /2 + 8 * line_w,
            width / 2 - 12 * line_w, width / 2 - 4 * line_w, width / 2 + 4 * line_w, width / 2 + 12 * line_w,
            width / 2 - 14 * line_w, width / 2 - 10 * line_w,  width / 2 - 6 * line_w, width / 2 - 2 * line_w,
            width / 2 + 2 * line_w, width / 2 + 6 * line_w, width / 2 + 10 * line_w, width / 2 + 14 * line_w,
            width / 2 - 15 * line_w, width / 2 - 13 * line_w,  width / 2 - 11 * line_w, width / 2 - 9 * line_w,
            width / 2 - 7 * line_w, width / 2 - 5 * line_w, width / 2 - 3 * line_w, width / 2 - 1 * line_w,
            width / 2 + 1 * line_w, width / 2 + 3 * line_w,  width / 2 + 5 * line_w, width / 2 + 7 * line_w,
            width / 2 + 9 * line_w, width / 2 + 11 * line_w, width / 2 + 13 * line_w, width / 2 + 15 * line_w]
        if (len >= 1) {
            dataset.push([width / 2, total_h, this.data[0]])
            total_h += line_h
            count += 1
        }

        for (let i = 0; i < len; i++) {
            data[i] = parseInt(data[i])
        }

        for (let i = 1; i < Math.ceil(Math.log2(len + 1)); i++) {
            for (let j = -Math.pow(2, i) / 2; j <= Math.pow(2, i) / 2; j++)
            {
                if (j == 0) continue
                if (count == len) break
                dataset.push([nodes_x[count - 1], total_h, this.data[count]])
                count++
                this.svg.append('line')
                    .style("stroke", "black")
                    .style("stroke-width", 3)
                    .attr("x1", dataset[count - 1][0])
                    .attr("y1", dataset[count - 1][1])
                    .attr("x2", dataset[Math.floor(count / 2) - 1][0])
                    .attr("y2", dataset[Math.floor(count / 2) - 1][1])
                    .attr('id', function() {
                        return "line" + (count - 1) + "-" + (Math.floor(count / 2) - 1)
                    })
            }
            total_h += line_h
        }

        // add nodes
        this.svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return d[0];
            })
            .attr("cy", function(d) {
                return d[1];
            })
            .attr("r", 20)
            .attr('stroke', 'black')
            .style("stroke-width", 3)
            .attr('fill', 'pink')
            .attr('id', function(d, i) {
                return "node" + i
            })

        let texts = this.svg.selectAll("text")
            .data(dataset)
            .enter();

        // add data
        texts
            .append("text")
            .attr("x", function (d) {
                return d[0]
            })
            .attr("y", function (d) {
                return d[1] + 4
            })
            .attr('stroke', 'black')
            .style("font-size", 12)
            .text(function (d) {
                return d[2]
            })
            .attr("text-anchor", "middle")
            .attr('id', function(d, i) {
                return "text" + i
            })

        texts
            .append("text")
            .attr("x", function (d) {
                return d[0]
            })
            .attr("y", function (d) {
                return d[1] - 30
            })
            .attr('stroke', 'black')
            .style("font-size", 12)
            .text(function (d, i) {
                return i
            })
            .attr("text-anchor", "middle")
    }

    buildMaxHeap() {
        let len = this.data.length
        let heap = new maxHeap()
        heap.buildHeap(this.data)
        let process = heap.getProcess()
        let i = 1
        for (let j = 0; j < process.length; j++) {
            let p = process[j]
            setTimeout(function () {
                if (p[1] < len && p[2] < len)
                    console.log("The " + j + " step is checking nodes " + p[0] + ", " + p[1] + ", " + p[2] + ".")
                else if (p[1] >= len && p[2] < len)
                    console.log("The " + j + " step is checking nodes " + p[0] + ", " + p[2] + ".")
                else if (p[2] >= len && p[1] < len)
                    console.log("The " + j + " step is checking nodes " + p[0] + ", " + p[1] + ".")
                else if (p[2] >= len && p[1] >= len)
                    console.log("The " + j + " step is checking node " + p[0] + ".")
            }, 1000 * i)
            // focus three nodes which will be compared
            this.focusNode(p[0], i);
            if (p[1] < len)
                this.focusNode(p[1], i)
            if (p[2] < len)
                this.focusNode(p[2], i)
            i++

            // focus two nodes which will be switch / continue to next 3 nodes
            if (p[0] != p[3]) {
                this.focusLine(p[3], p[0], i++)
                this.swapText(p[3], p[0], i++)
                this.unfocusLine(p[3], p[0], i)
            }
            else
                setTimeout(function () {
                    console.log("Node " + p[0] + " is the largest in the subtree.")
                }, 1000 * i)
            this.unfocusNode(p[0], i);
            if (p[1] < this.data.length)
                this.unfocusNode(p[1], i)
            if (p[2] < this.data.length)
                this.unfocusNode(p[2], i)
            i++
        }
    }

    buildMinHeap() {
        let len = this.data.length
        let heap = new minHeap()
        heap.buildHeap(this.data)
        let process = heap.getProcess()
        let i = 1
        for (let j = 0; j < process.length; j++) {
            let p = process[j]
            setTimeout(function () {
                if (p[1] < len && p[2] < len)
                    console.log("The " + j + " step is checking nodes " + p[0] + ", " + p[1] + ", " + p[2] + ".")
                else if (p[1] >= len && p[2] < len)
                    console.log("The " + j + " step is checking nodes " + p[0] + ", " + p[2] + ".")
                else if (p[2] >= len && p[1] < len)
                    console.log("The " + j + " step is checking nodes " + p[0] + ", " + p[1] + ".")
                else if (p[2] >= len && p[1] >= len)
                    console.log("The " + j + " step is checking node " + p[0] + ".")
            }, 1000 * i)
            // focus three nodes which will be compared
            this.focusNode(p[0], i);
            if (p[1] < len)
                this.focusNode(p[1], i)
            if (p[2] < len)
                this.focusNode(p[2], i)
            i++

            // focus two nodes which will be switch / continue to next 3 nodes
            if (p[0] != p[3]) {
                this.focusLine(p[3], p[0], i++)
                this.swapText(p[3], p[0], i++)
                this.unfocusLine(p[3], p[0], i)
            }
            else
                setTimeout(function () {
                    console.log("Node " + p[0] + " is the smallest in the subtree.")
                }, 1000 * i)
            this.unfocusNode(p[0], i);
            if (p[1] < this.data.length)
                this.unfocusNode(p[1], i)
            if (p[2] < this.data.length)
                this.unfocusNode(p[2], i)
            i++
        }
    }

    focusNode(i, time) {
        setTimeout(function () {
            d3.select("#node" + i).attr('fill', 'yellow')
        }, 1000 * time)
    }

    unfocusNode(i, time) {
        setTimeout(function () {
            d3.select("#node" + i).attr('fill', 'pink')
        }, 1000 * time)
    }

    focusLine(i, j, time) {
        setTimeout(function () {
            d3.select("#line" + i + "-" + j).style("stroke", "red")
            console.log("Node " + j + " is smaller than " + " node " + i + ".")
            console.log("So switch nodes " + j + " and " + i + ".")
        }, time * 1000)
    }

    unfocusLine(i, j, time) {
        setTimeout(function () {
            d3.select("#line" + i + "-" + j).style("stroke", "black")
        }, 1000 * time)
    }

    swapText(i, j, time)
    {
        setTimeout(function () {
            let t1 = d3.select("#text" + i).text()
            let t2 = d3.select("#text" + j).text()
            d3.select("#text" + i).text(t2)
            d3.select("#text" + j).text(t1)
        }, time * 1000)
    }
}
export {ForceSimulationGraph}
