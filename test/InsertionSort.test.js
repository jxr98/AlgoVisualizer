import * as d3 from '../js/thirdParty/d3.js';
import {InsertionSort} from '../js/lib/InsertionSort'
import {ArrayVisualizer} from '../js/lib/ArrayVisualizer'
import {expect, jest} from '@jest/globals';
import { arrayVis2Str } from '../js/lib/sortTemplate.js';

// mock ResizeObserverMock
class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

test('Insertion sort',()=>{
    // setup svg
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    var svg = d3.select("body").append("svg").attr("width", 800).attr("height", 100)
    let numNode = 5;
    const g = new ArrayVisualizer(svg)
    for (let i = 0 ; i < numNode ; i++)
    {
        g.insertRight({id : i, text: i, value: i})
    }

    // verify original data is in ascending
    for (let i = 0 ; i < numNode ; i++)
    {
        expect(g.get(i).value).toBe(i);
    }

    // sort
    let sort = new InsertionSort(g)
    for (let i = 0 ; i < numNode + 1 ; i++)
    {
        // verify that sort is indeed not complete
        if (i < numNode)
        {
            expect(sort.isDone()).toBe(false);
        }
        sort.step();
    }

    // verify sort is complete
    expect(sort.isDone()).toBe(true);

    // verify "maxDetailedSteps"
    expect(sort.maxDetailedSteps()).toBe(36);

    // verify sorted data is in descending
    for (let i = 0 ; i < numNode ; i++)
    {
        expect(g.get(i).value).toBe(numNode - i - 1);
    }

    // make sure no error
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    consoleSpy.mockRestore();
})


test('detailed step',()=>{
    // setup svg
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    var svg = d3.select("body").append("svg").attr("width", 800).attr("height", 100)
    let numNode = 5;
    const g = new ArrayVisualizer(svg)
    for (let i = 0 ; i < numNode ; i++)
    {
        g.insertRight({id : i, text: i, value: i})
    }

    // verify original data is in ascending
    for (let i = 0 ; i < numNode ; i++)
    {
        expect(g.get(i).value).toBe(i);
    }

    // sort
    let sort = new InsertionSort(g)
    while (!sort.isDone())
    {
        sort.detailedStep();

        // verify that the unsorted element is moved to the correct position
        if (sort.steppingLinearSearch && sort.linearSearchCurrentIdx != 0) {
            expect(g.get(sort.dataBeingMoved.id - 1).value <= g.get(sort.dataBeingMoved.id).value).toBe(true);
        }
    }

    // verify sort is complete
    expect(sort.isDone()).toBe(true);

    // verify sorted data is in descending
    for (let i = 0 ; i < numNode ; i++)
    {
        expect(g.get(i).value).toBe(numNode - i - 1);
    }

    // make sure no error
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    consoleSpy.mockRestore();
})


//test arrayVis2Str
test("should return an empty string if arrayVis is null", () => {
    const result = arrayVis2Str(null);
    expect(result).toEqual("");
  });
  
  test("should convert an arrayVis object to a comma-separated string", () => {
    const arrayVis = {
      size: () => 3,
      get: (index) => ({ value: `item${index}` }),
    };
    const result = arrayVis2Str(arrayVis);
    expect(result).toEqual("item0,item1,item2");
  });
  
  test("should convert an empty arrayVis object to an empty string", () => {
    const arrayVis = {
      size: () => 0,
      get: (index) => null,
    };
    const result = arrayVis2Str(arrayVis);
    expect(result).toEqual("");
  });
  
  test("should convert an arrayVis object with one element to a string", () => {
    const arrayVis = {
      size: () => 1,
      get: (index) => ({ value: "single" }),
    };
    const result = arrayVis2Str(arrayVis);
    expect(result).toEqual("single");
  });
  
  