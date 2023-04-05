import { arrayVis2Str, TSort } from '../js/lib/sortTemplate.js';
import {expect, jest} from '@jest/globals';

test("sort template default implementation for maxDetailedSteps", () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    let g = new TSort()
    g.maxDetailedSteps()
    expect(consoleSpy).toHaveBeenCalledWith('not implemented');
    consoleSpy.mockRestore();
});
test("sort template default implementation for isDone", () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    let g = new TSort()
    g.isDone()
    expect(consoleSpy).toHaveBeenCalledWith('not implemented');
    consoleSpy.mockRestore();
});
test("sort template default implementation for detailedStep", () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    let g = new TSort()
    g.detailedStep()
    expect(consoleSpy).toHaveBeenCalledWith('not implemented');
    consoleSpy.mockRestore();
});
  


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