import * as d3 from '../js/thirdParty/d3.js';
import {ArrayVisualizer} from '../js/lib/ArrayVisualizer'
import {expect, jest} from '@jest/globals';

// mock ResizeObserverMock
class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;
  
test('Array visualizer',()=>{
    // setup svg
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    var width = 800,
        height = 100;
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "1px solid black")

    let interval = 200; 
    const g = new ArrayVisualizer(svg, interval)
    g.setLeftLabel("left label")
    g.setRightLabel("right label")
    g.setTitle("title")
    g.setLegend("sorted", "red")
    g.setLegend("un-sorted", "black")
    for (let i =0 ; i < 5; ++i)
    {
        let data = {id : i, text: i}
        g.insertLeft(data)
    }
    g.insertRight({id:5, text: "hi"})
    g.removeLeft()
    g.remove(1)
    g.remove(-1)
    g.removeRight()
    g.insertBefore({id:6, text: "new"}, 0)

    expect(consoleSpy).toHaveBeenCalledTimes(0);
    consoleSpy.mockRestore();
})