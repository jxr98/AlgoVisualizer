import * as d3 from "./thirdParty/d3.js";
import {Heap} from "./lib/Heap.js";
import {redirectConsoleOutput} from './lib/Logger.js'
import {isNumeric} from './lib/Utils.js'
import {line} from "./thirdParty/d3.js";

//set up a svg
var svg = d3.select("#graphSvg")

// setup log panel
var textArea=d3.select("#logPanel");

redirectConsoleOutput(textArea)

let heap;

document.getElementById("max-heap").onclick = function()
{
    let data = $("#message-box").val().split("\n")
    for (let i = 0; i < data.length; i++) {
        if (isNumeric(data[i])) continue
        else {
            console.log("please check input data")
            return
        }
    }
    heap = new Heap(svg, data, 0)
    heap.buildHeap()
    changeInputModel()

}

document.getElementById("min-heap").onclick = function()
{
    let data = $("#message-box").val().split("\n")
    for (let i = 0; i < data.length; i++) {
        if (isNumeric(data[i])) continue
        else {
            console.log("please check input data")
            return
        }
    }
    heap = new Heap(svg, data, 1)
    heap.buildHeap()
    changeInputModel()
}

function changeInputModel() {
    document.getElementById("create-tree").style.display = "none"
    document.getElementById("insert-replace").style.display = ""
}

document.getElementById("insert").onclick = function ()
{
    let data = $("#data").val()
    for (let i = 0; i < data.length; i++) {
        if (isNumeric(data[i])) continue
        else {
            console.log("please check input data")
            return
        }
    }
    heap.insert(data)
}

document.getElementById("delete").onclick = function ()
{
    heap.delete()
}