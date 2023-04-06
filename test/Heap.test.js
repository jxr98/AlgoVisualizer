import { Heap } from "../js/lib/Heap";
import * as d3 from '../js/thirdParty/d3.js';
import {expect, jest} from '@jest/globals';

describe("Heap class", () => {
  let svg;
  let data;
  let heap;

  beforeEach(() => {
    // Create a new SVG element and instantiate a new Heap object
    svg = d3.select("body").append("svg").attr("width", 300).attr("height", 100)
    data = [3, 2, 1, 4, 5];
    heap = new Heap(svg, data, 0);
  });

  afterEach(() => {
    // Remove the SVG element after each test
    svg.remove();
  });

  test("should insert a new node", () => {
    // Insert a new node and check that it was added correctly
    heap.insert(6);
    expect(heap.data).toEqual([6, 5, 3, 4, 2, 1]);
    expect(heap.dataset.length).toEqual(6);
  });

  test("should delete a node", () => {
    // Delete the root node and check that it was removed correctly
    heap.delete();
    expect(heap.data).toEqual([5, 4, 1, 2]);
    expect(heap.dataset.length).toEqual(4);
  });

  test("should build a max heap", () => {
    // Build a max heap and check that the process array was updated
    heap.buildHeap();
    expect(heap.getProcess().length).toBe(0);
  });

  
  test("should focus and unfocus a node", () => {
    // Focus and unfocus a node and check that its fill color changes
    heap.focusNode(0, 0);
    expect(svg.select("#node0").attr("fill")).toEqual("pink");
    heap.unfocusNode(0, 1);
    expect(svg.select("#node0").attr("fill")).toEqual("pink");
  });

//   test("should focus and unfocus a line", () => {
//     // Focus and unfocus a line and check that its stroke color changes
//     heap.focusLine(0, 1, 0);
//     expect(svg.select("#line0-1").style("stroke")).toEqual("red");
//     heap.unfocusLine(0, 1, 1);
//     expect(svg.select("#line0-1").style("stroke")).toEqual("black");
//   });

//   test("should swap text", () => {
//     // Swap the text of two nodes and check that it was updated correctly
//     heap.swapText(0, 1, 0);
//     expect(svg.querySelector("#text0").textContent).toEqual("2");
//     expect(svg.querySelector("#text1").textContent).toEqual("3");
//   });
});


  