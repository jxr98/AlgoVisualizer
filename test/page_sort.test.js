import { onBlur, runSim } from '../js/lib/page_sort';
import {expect, jest} from '@jest/globals';

describe('onBlur', () => {
  let inputDOM;

  beforeEach(() => {
    // Set up a dummy input element
    inputDOM = {
      node: () => ({ value: '' }),
      attr: () => '',
      classed: jest.fn(),
    };
  });

  it('returns an empty array if the input is empty', () => {
    expect(onBlur(inputDOM)).toEqual([]);
  });

  it('parses a comma-separated string into an array of integers', () => {
    inputDOM.node = () => ({ value: '1, 2, 3' });
    expect(onBlur(inputDOM)).toEqual(["1", "2", "3"]);
  });

  it('trims whitespace around each element in the input array', () => {
    inputDOM.node = () => ({ value: ' 1 ,2,   3 ' });
    expect(onBlur(inputDOM)).toEqual(["1", "2", "3"]);
  });

  it('marks the input as invalid if it contains non-numeric values', () => {
    inputDOM.node = () => ({ value: '1, two, 3' });
    expect(onBlur(inputDOM)).toEqual([]);
    expect(inputDOM.classed).toHaveBeenCalledWith('is-invalid', true);
  });

  it('returns the input array if it is valid', () => {
    inputDOM.node = () => ({ value: '1, 2, 3' });
    expect(onBlur(inputDOM)).toEqual(["1", "2", "3"]);
  });
});

describe('runSim', () => {
  let inputArray, arrayVis, timeoutHandles, sortFactoryCallback, interval;

  beforeEach(() => {
    // Set up dummy parameters
    inputArray = ['1', '2', '3'];
    arrayVis = { clear: jest.fn(), insertRight: jest.fn() };
    timeoutHandles = [1, 2, 3];
    sortFactoryCallback = jest.fn(() => ({ maxDetailedSteps: () => 1, detailedStep: jest.fn() }));
    interval = { getDelay: jest.fn(() => 100) };
  });

  afterEach(() => {
    // Restore the original setTimeout function
    jest.useRealTimers();
  });

  it('clears the array model', () => {
    runSim(inputArray, arrayVis, timeoutHandles, sortFactoryCallback, interval);
    expect(arrayVis.clear).toHaveBeenCalled();
  });

})
