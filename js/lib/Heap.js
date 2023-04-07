import * as d3 from "../thirdParty/d3.js";
import * as cm from './common.js'

class Heap
{
    constructor(svg, data, kind) {
        this.start = 0
        // 0 - max; 1 - min
        this.kind = kind
        this.process = []
        this.data = data
        let len = this.data.length
        let count = 0
        let width = parseInt(svg.style("width"));
        let line_w = 21.5
        let line_h = 100
        let total_h = 50
        this.dataset = []
        this.nodes_x = [width / 2 - 8 * line_w, width /2 + 8 * line_w,
            width / 2 - 12 * line_w, width / 2 - 4 * line_w, width / 2 + 4 * line_w, width / 2 + 12 * line_w,
            width / 2 - 14 * line_w, width / 2 - 10 * line_w,  width / 2 - 6 * line_w, width / 2 - 2 * line_w,
            width / 2 + 2 * line_w, width / 2 + 6 * line_w, width / 2 + 10 * line_w, width / 2 + 14 * line_w,
            width / 2 - 15 * line_w, width / 2 - 13 * line_w,  width / 2 - 11 * line_w, width / 2 - 9 * line_w,
            width / 2 - 7 * line_w, width / 2 - 5 * line_w, width / 2 - 3 * line_w, width / 2 - 1 * line_w,
            width / 2 + 1 * line_w, width / 2 + 3 * line_w,  width / 2 + 5 * line_w, width / 2 + 7 * line_w,
            width / 2 + 9 * line_w, width / 2 + 11 * line_w, width / 2 + 13 * line_w, width / 2 + 15 * line_w]

        // lines group
        this.group1 = svg.append('g')
        // nodes group
        this.group2 = svg.append('g')

        // build tree
        if (len >= 1) {
            this.dataset.push([width / 2, total_h, this.data[0]])
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
                this.dataset.push([this.nodes_x[count - 1], total_h, this.data[count]])
                count++
                this.group1.append('line')
                    .style("stroke", cm.default_line_color)
                    .style("stroke-width", 3)
                    .attr("x1", this.dataset[count - 1][0])
                    .attr("y1", this.dataset[count - 1][1])
                    .attr("x2", this.dataset[Math.floor(count / 2) - 1][0])
                    .attr("y2", this.dataset[Math.floor(count / 2) - 1][1])
                    .attr('id', function() {
                        return "line" + (count - 1) + "-" + (Math.floor(count / 2) - 1)
                    })
            }
            total_h += line_h
        }

        // add nodes
        this.group2.selectAll("circle")
            .data(this.dataset)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return d[0];
            })
            .attr("cy", function(d) {
                return d[1];
            })
            .attr("r", 20)
            .attr('stroke', cm.default_line_color)
            .style("stroke-width", 3)
            .attr('fill', 'pink')
            .attr('id', function(d, i) {
                return "node" + i
            })

        let texts = this.group2.selectAll("text")
            .data(this.dataset)
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
            .attr('stroke', cm.default_line_color)
            .style("font-size", 12)
            .text(function (d) {
                return d[2]
            })
            .attr("text-anchor", "middle")
            .attr('id', function(d, i) {
                return "text" + i
            })

        // add index
        texts
            .append("text")
            .attr("x", function (d) {
                return d[0]
            })
            .attr("y", function (d) {
                return d[1] - 30
            })
            .attr('stroke', cm.default_line_color)
            .style("font-size", 12)
            .text(function (d, i) {
                return i
            })
            .attr("text-anchor", "middle")
            .attr('id', function(d, i) {
                return "index" + i
            })
    }

    insert(data) {
        data = parseInt(data)
        let n = this.data.length
        this.data.push(data)
        let x = this.nodes_x[n - 1]
        let y = 50 + 100 * Math.floor(Math.log2(n + 1))
        this.dataset.push([x, y, data])
        console.log("Insertion")
        // add nodes
        this.group2
            .append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 20)
            .attr('stroke', cm.default_line_color)
            .style("stroke-width", 3)
            .attr('fill', 'pink')
            .attr('id', "node" + n)
        // add text
        this.group2
            .append("text")
            .attr("x", x)
            .attr("y", y + 4)
            .attr('stroke', cm.default_line_color)
            .style("font-size", 12)
            .text(data)
            .attr("text-anchor", "middle")
            .attr('id', "text" + n)
        // add index
        this.group2
            .append("text")
            .attr("x", x)
            .attr("y", y - 30)
            .attr('stroke', cm.default_line_color)
            .style("font-size", 12)
            .text(n)
            .attr("text-anchor", "middle")
            .attr('id', "index" + n)

        // add line
        this.group1.append('line')
            .style("stroke", cm.default_line_color)
            .style("stroke-width", 3)
            .attr("x1", x)
            .attr("y1", y)
            .attr("x2", this.dataset[Math.floor((n - 1) / 2)][0])
            .attr("y2", this.dataset[Math.floor((n - 1) / 2)][1])
            .attr('id', "line" + n + "-" + Math.floor((n - 1) / 2))

        let i = Math.floor((n - 1) / 2)
        while (i != -1) {
            this.heapifyHeap(this.data, n + 1, i)
            i = Math.floor((i + 1) / 2) - 1
        }
        this.buildHeap()
    }

    delete() {
        let n = this.data.length - 1
        this.data[0] = this.data[n]
        this.data.pop()
        this.dataset.pop()
        console.log("Deletion")
        this.group2.select("#text" + 0).text(this.data[0])
        // remove nodes
        this.group2.select("#node" + n).remove()
        // remove text
        this.group2.select("#text" + n).remove()
        // remove index
        this.group2.select("#index" + n).remove()
        // remove line
        this.group1.select("#line" + n + "-" + Math.floor((n - 1) / 2)).remove()

        this.heapifyHeap(this.data, n + 1, 0)
        this.buildHeap()
    }

    buildHeap() {
        let len = this.data.length
        // Build heap (rearrange array)
        for (let i = Math.floor(len / 2) - 1; i >= 0; i--)
            this.heapifyHeap(this.data, len, i)
        let process = this.getProcess()
        let i = 1
        for (let j = 0; j < process.length; j++) {
            let p = process[j]
            setTimeout(function () {
                if (p[1] < len && p[2] < len)
                    console.log("The step " + j + " is checking nodes " + p[0] + ", " + p[1] + ", " + p[2] + ".")
                else if (p[1] >= len && p[2] < len)
                    console.log("The step " + j + " is checking nodes " + p[0] + ", " + p[2] + ".")
                else if (p[2] >= len && p[1] < len)
                    console.log("The step " + j + " is checking nodes " + p[0] + ", " + p[1] + ".")
                else if (p[2] >= len && p[1] >= len)
                    console.log("The step" + j +  " is checking node " + p[0] + ".")
            }, cm.short_animation_gap * i)
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
                    if (this.kind == 0)
                        console.log("Node " + p[0] + " is the largest in the subtree.")
                    else console.log("Node " + p[0] + " is the smallest in the subtree.")
                }, cm.short_animation_gap * i)
            this.unfocusNode(p[0], i);
            if (p[1] < len)
                this.unfocusNode(p[1], i)
            if (p[2] < len)
                this.unfocusNode(p[2], i)
            i++
        }
    }

    heapifyHeap(arr, N, i) {
        let extremum = i; // Initialize largest or smallest as root
        let l = 2 * i + 1; // left = 2*i + 1
        let r = 2 * i + 2; // right = 2*i + 2

        if (this.kind == 0) {
            // If left child is larger than root
            if (l < N && arr[l] > arr[extremum])
                extremum = l;
            // If right child is larger than extremum so far
            if (r < N && arr[r] > arr[extremum])
                extremum = r;
        } else {
            // If left child is smallest than root
            if (l < N && arr[l] < arr[extremum])
                extremum = l;

            // If right child is smallest than extremum so far
            if (r < N && arr[r] < arr[extremum])
                extremum = r;
        }

        this.process.push([i, l, r, extremum])

        // If largest or smallest is not root
        if (extremum != i) {
            let swap = arr[i];
            arr[i] = arr[extremum];
            arr[extremum] = swap;

            // Recursively heapify the affected sub-tree
            this.heapifyHeap(arr, N, extremum);
        }
    }

    focusNode(i, time) {
        setTimeout(function () {
            d3.select("#node" + i).attr('fill', 'yellow')
        }, cm.short_animation_gap * time)
    }

    unfocusNode(i, time) {
        setTimeout(function () {
            d3.select("#node" + i).attr('fill', 'pink')
        }, cm.short_animation_gap * time)
    }

    focusLine(i, j, time) {
        setTimeout(function () {
            d3.select("#line" + i + "-" + j).style("stroke", cm.focused_line_color)
            console.log("Node " + j + " is smaller than " + " node " + i + ".")
            console.log("So switch nodes " + j + " and " + i + ".")
        }, time * cm.short_animation_gap)
    }

    unfocusLine(i, j, time) {
        setTimeout(function () {
            d3.select("#line" + i + "-" + j).style("stroke", cm.default_line_color)
        }, cm.short_animation_gap * time)
    }

    swapText(i, j, time)
    {
        setTimeout(function () {
            let t1 = d3.select("#text" + i).text()
            let t2 = d3.select("#text" + j).text()
            d3.select("#text" + i).text(t2)
            d3.select("#text" + j).text(t1)
        }, time * cm.short_animation_gap)
    }

    getProcess()
    {
        let res = this.process.slice(this.start, this.process.length)
        this.start = this.process.length
        return res
    }
}

export {Heap}