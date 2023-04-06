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

describe('positive tests', () => {
    let consoleSpy;
    let svg;
    let array;
    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        svg = d3.select("body").append("svg").attr("width", 300).attr("height", 100)
        array = new ArrayVisualizer(svg, new TransitionDelay())
    });
    afterEach(() => {
        expect(consoleSpy).toHaveBeenCalledTimes(0);
        consoleSpy.mockRestore();
    });

    it('Transition delay normal usage', () => {
        let g = new TransitionDelay();
        expect(g.getDelay()).toBe(defaultTransitionDelay);
        g.setDelay(1)
        expect(g.getDelay()).toBe(1);
    });

    it('array labeling', () => {
        array.setLeftLabel("left label")
        array.setRightLabel("right label")
        array.setTitle("title")
        array.setLegend("sorted", "red")
        array.setLegend("un-sorted", "black")
    });

    it('array operations', () => {
        const numInserted = 5;
        for (let i =0 ; i < numInserted; ++i)
        {
            let data = {id : i, text: i}
            array.insertLeft(data)
        }
        expect(array.size()).toBe(numInserted)


        array.insertRight({id:5, text: "hi"})
        array.removeLeft()
        array.remove(1)
        array.remove(-1)
        array.removeRight()
        array.insertBefore({id:6, text: "new"}, 0)
        array.move(0, 1)
        array.swapByID(0, 2)
        array.changeOverflowPolicy("hideRight")
        
        
        array.clear()
        array.updateRendering()
        expect(array.size()).toBe(0)
    });

    it('array clear', () => {
        expect(array.size()).toBe(0)
        const numInserted = 5;
        for (let i =0 ; i < numInserted; ++i)
        {
            let data = {id : i, text: i}
            array.insertLeft(data)
        }
        expect(array.size()).toBe(numInserted)
        array.clear()
        expect(array.size()).toBe(0)
    });


});
