// NOTE: use v7 of D3 library
import * as d3 from './thirdParty/d3.js';
import {redirectConsoleOutput} from './lib/Logger.js'
import { GridGraph } from './lib/GridGraph.js';
import * as utils from "./lib/Utils.js"
import {AStar, Location} from './lib/AStar.js'

// setup svg
var svg = d3.select("#graphSvg")
let textArea = d3.select("#logPanel")
redirectConsoleOutput(textArea)

const g = new GridGraph(svg);
const interval = 50
let timeoutHandles = []



document.getElementById("start-button").onclick = function()
{
    if (!checkInputs(g)) return;
    let [srcX, srcY, dstX, dstY] = readInputs(),
    startLoc = new Location(srcX, srcY),
    endLoc = new Location(dstX, dstY)
    
    runSim(startLoc, endLoc);
}

function runSim(startLoc, endLoc)
{
  // clear all timeouts
  timeoutHandles.forEach(timeoutID => {
    clearTimeout(timeoutID);
  });
  timeoutHandles.splice(0,timeoutHandles.length)

  // TODO: clear all non-obstacle coloring on graph

  // setup sim
  let sim = new AStar(g, startLoc, endLoc),
  numSteps = sim.numAnimationSteps(),
  tick = 0

  // show animations
  for (let i =0; i < numSteps; ++i)
  {
    let timeoutID = setTimeout(function(){
      sim.animateStep();
    }, tick) 
    timeoutHandles.push(timeoutID)
    tick += interval
  }
  sim.printStats();
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