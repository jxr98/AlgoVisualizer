import { GridGraph } from "../js/lib/GridGraph";
import * as d3 from "../js/thirdParty/d3.js";

test('test instantiation', () => {
    var width = 960,
        height = 500;
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "1px solid black")

    let g = new GridGraph(svg);
});