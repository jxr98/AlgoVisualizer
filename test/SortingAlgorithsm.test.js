import * as d3 from '../js/thirdParty/d3.js';
import {InsertionSort} from '../js/lib/SortingAlgorithms'
import {ArrayVisualizer} from '../js/lib/DataVisualizer'
import {expect, jest} from '@jest/globals';

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

    // verify sorted data is in descending
    for (let i = 0 ; i < numNode ; i++)
    {
        expect(g.get(i).value).toBe(numNode - i - 1);
    }

    // make sure no error
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    consoleSpy.mockRestore();
})