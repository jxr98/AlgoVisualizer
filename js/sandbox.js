// NOTE: use v7 of D3 library
import * as d3 from './thirdParty/d3.js';
import {redirectConsoleOutput} from './lib/Logger.js'
import { GridGraph } from './lib/GridGraph.js';
import * as utils from "./lib/Utils.js"

// setup svg
var svg = d3.select("#graphSvg")
let textArea = d3.select("#logPanel")
redirectConsoleOutput(textArea)

const g = new GridGraph(svg);


document.getElementById("start-button").onclick = function()
{
  if (!checkInputs(g)) return;

  let [srcX, srcY, dstX, dstY] = readInputs();
  let startNode = g.getNodeID(srcX, srcY)
  let endNode = g.getNodeID(dstX, dstY)
  g.changeColor(startNode, "red")
  g.changeColor(endNode, "green")

  let visited = new Set()
  visited.add(startNode)
  let stack = []
  let parentMap = new Map()
  stack.push(startNode)
  let tick = 0
  let interval = 50

  while (stack.length != 0)
  {
      // DFS
      let currNode = stack.pop()

      // BFS
      //let currNode = stack.shift()

      if (currNode == endNode)
      {
          break;
      }

      g.getAdjacent(currNode).forEach(function(neighbor)
      {
          if (!visited.has(neighbor))
          {
              visited.add(neighbor)
              parentMap.set(neighbor, currNode)
              stack.push(neighbor)
              if (neighbor != endNode)
              {
                  setTimeout(function(){
                      g.changeColor(neighbor, "yellow")
                  }, tick) 
              } 
          } 
      })
      
      tick += interval
  }

  // back-track the path and highlight
  if (parentMap.has(endNode))
  {
      console.log("DONE")
      let curr = endNode
      while(curr != startNode)
      {
          let parent = parentMap.get(curr)
          if (parent != startNode)
          {
              setTimeout(function(){
                  g.changeColor(parent, "blue")
              }, tick)
          }
          curr = parent
          tick += interval
      }
  }

}


function readInputs()
{
  let srcX = document.getElementById("srcX").valueAsNumber,
    srcY = document.getElementById("srcY").valueAsNumber,
    dstX = document.getElementById("dstX").valueAsNumber,
    dstY = document.getElementById("dstY").valueAsNumber 
  return [srcX, srcY, dstX, dstY]
}

function emptyError(numberInputDom, feedbackDom)
{
  if (utils.isNullOrEmptyStr(numberInputDom.value))
  {
    feedbackDom.innerHTML = "Empty input"
    numberInputDom.classList.add("is-invalid");
    return true
  }

  numberInputDom.classList.remove("is-invalid");
  return false
}

function coordinateError(xInputDom, yInputDom, xFeedbackDom, yFeedbackDom, graph)
{
  let error = false,
  x = xInputDom.valueAsNumber,
  y = yInputDom.valueAsNumber,
  xValid = true,
  yValid = true

  // assume all is valid
  xInputDom.classList.remove("is-invalid");
  yInputDom.classList.remove("is-invalid");

  if (!graph.isValidX(x))
  {
    xFeedbackDom.innerHTML = "invalid x value"
    xInputDom.classList.add("is-invalid");
    xValid = false;
  }

  if (!graph.isValidY(y))
  {
    yFeedbackDom.innerHTML = "invalid y value"
    yInputDom.classList.add("is-invalid");
    yValid = false;
  }

  error = !xValid || !yValid;
  if (!error)
  {
    let nodeID =  graph.getNodeID(x,y)
    if (graph.isObstacle(nodeID))
    {
      xFeedbackDom.innerHTML = "coordinate occupied by obstacle"
      yFeedbackDom.innerHTML = ""
      xInputDom.classList.add("is-invalid");
      yInputDom.classList.add("is-invalid");
      error = true
    }
  }

  return error;
}

function checkInputs(graph)
{
  let srcXInput = document.getElementById("srcX"),
    srcYInput = document.getElementById("srcY"),
    dstXInput = document.getElementById("dstX"),
    dstYInput = document.getElementById("dstY"),
    srcXFeedback = document.getElementById("srcXFeedback"),
    srcYFeedback = document.getElementById("srcYFeedback"),
    dstXFeedback = document.getElementById("dstXFeedback"),
    dstYFeedback = document.getElementById("dstYFeedback")
  
  let coordError = false;
  let hasEmptySrcInput = emptyError(srcXInput, srcXFeedback)
  hasEmptySrcInput |= emptyError(srcYInput, srcYFeedback)
  if (!hasEmptySrcInput)
  {
    coordError |= coordinateError(srcXInput, srcYInput, srcXFeedback, srcYFeedback, graph)
  }

  let hasEmptyDstInput = emptyError(dstXInput, dstXFeedback)
  hasEmptyDstInput |= emptyError(dstYInput, dstYFeedback)
  if (!hasEmptyDstInput)
  {
    coordError |= coordinateError(dstXInput, dstYInput, dstXFeedback, dstYFeedback, graph)
  }

  if (hasEmptyDstInput || hasEmptySrcInput || coordError) return false;
  return true;
}