import { GridGraph } from "../js/lib/GridGraph";
import * as d3 from "../js/thirdParty/d3.js";
import {expect, jest} from '@jest/globals';

test('test instantiation', () => {
    var width = 960,
        height = 500;
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "1px solid black")

    let g = new GridGraph(svg);

    // grid property APIs
    expect(g.getYRange()).toBeGreaterThan(0)
    expect(g.getXRange()).toBeGreaterThan(0)
    expect(g.getNodeID(0, 0)).toBe(0)

    // position API
    let {x, y} = g.getNodePosition(0)
    // console.log(x)
    // console.log(y)
    expect(x).toBe(0)
    expect(y).toBe(0)

    // obstacle APIs
    expect(g.isObstacle(0)).toBe(false)
    g.setObstacle(0)
    expect(g.isObstacle(0)).toBe(true)
    g.unsetObstacle(0)
    expect(g.isObstacle(0)).toBe(false)

    // graph traverse API
    let adj = g.getAdjacent(0)
    expect(adj.length).toBe(2)
    adj.forEach(function(node)
    {
        let {x, y} = g.getNodePosition(node)
        expect((x == 0 && y == 1) || (x == 1 && y == 0)).toBeTruthy()
    })

    // change color
    g.changeColor(0, "red")

});

test('getNodeID() Error detection', ()=>
{
    var svg = d3.select("body").append("svg")
        .attr("width", 960)
        .attr("height", 500)
        .style("border", "1px solid black")
    let g = new GridGraph(svg);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    g.getNodeID(-1, 0)
    expect(consoleSpy).toHaveBeenCalledWith('Invalid coordinates recieved');
    consoleSpy.mockRestore();
})

test('getNodePosition() Error detection', ()=>
{
    var svg = d3.select("body").append("svg")
        .attr("width", 960)
        .attr("height", 500)
        .style("border", "1px solid black")
    let g = new GridGraph(svg);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    g.getNodePosition(-1)
    expect(consoleSpy).toHaveBeenCalledWith('Invalid nodeID (getNodePosition)');
    consoleSpy.mockRestore();
})

test('getAdjacent() Error detection', ()=>
{
    var svg = d3.select("body").append("svg")
        .attr("width", 960)
        .attr("height", 500)
        .style("border", "1px solid black")
    let g = new GridGraph(svg);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    g.getAdjacent(-1)
    expect(consoleSpy).toHaveBeenCalledWith('Invalid nodeID (getAdjacent)');
    consoleSpy.mockRestore();
})

test('changeColor() Error detection', ()=>
{
    var svg = d3.select("body").append("svg")
        .attr("width", 960)
        .attr("height", 500)
        .style("border", "1px solid black")
    let g = new GridGraph(svg);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    g.changeColor(-1, "red")
    expect(consoleSpy).toHaveBeenCalledWith('Invalid nodeID (changeColor)');
    consoleSpy.mockRestore();
})

test('setObstacle() Error detection', ()=>
{
    var svg = d3.select("body").append("svg")
        .attr("width", 960)
        .attr("height", 500)
        .style("border", "1px solid black")
    let g = new GridGraph(svg);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    g.setObstacle(-1)
    expect(consoleSpy).toHaveBeenCalledWith('Invalid nodeID (setObstacle)');
    consoleSpy.mockRestore();
})

test('unsetObstacle() Error detection', ()=>
{
    var svg = d3.select("body").append("svg")
        .attr("width", 960)
        .attr("height", 500)
        .style("border", "1px solid black")
    let g = new GridGraph(svg);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    g.unsetObstacle(-1)
    expect(consoleSpy).toHaveBeenCalledWith('Invalid nodeID (unsetObstacle)');
    consoleSpy.mockRestore();
})