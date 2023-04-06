import * as d3 from '../js/thirdParty/d3.js';
import {ArrayVisualizer, TransitionDelay, defaultTransitionDelay} from '../js/lib/ArrayVisualizer'
import {expect, jest} from '@jest/globals';

// mock ResizeObserverMock
class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

describe('negative tests', () => {
    let consoleSpy;
    //let svg;
    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        //svg = d3.select("body").append("svg").attr("width", 800).attr("height", 100)
    });
    afterEach(() => {
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('Transition delay non integer constructor', () => {
        let g = new TransitionDelay("s");
    });
    it('Transition delay non integer in setter', () => {
        let g = new TransitionDelay();
        g.setDelay(-1.5)
    });

});
  

test('Transition delay', ()=>
{
    let g = new TransitionDelay();
    expect(g.getDelay()).toBe(defaultTransitionDelay);
    g.setDelay(1)
    expect(g.getDelay()).toBe(1);
})

test('Array visualizer',()=>{
    // setup svg
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    var width = 300,
        height = 100;
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "1px solid black")

    let interval = new TransitionDelay(); 
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
    g.move(0, 1)
    g.swapByID(0, 2)
    g.changeOverflowPolicy("hideRight")
    g.clear()
    g.updateRendering()
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    consoleSpy.mockRestore();
})