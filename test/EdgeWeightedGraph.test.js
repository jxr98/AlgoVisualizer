import {EdgeWeightedGraph} from "../js/lib/EdgeWeightedGraph";
import {Graph} from "../js/lib/Graph";
import * as d3 from '../js/thirdParty/d3.js';
import {expect, jest} from '@jest/globals';
import {Edge} from "../js/lib/Edge";

function graphFactory()
{
    return new EdgeWeightedGraph(new Graph());
}

describe('EdgeWeightedGraph positive tests', () => {
    let consoleSpy;
    let svg;
    let graph;
    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        svg = d3.select("body").append("svg").attr("width", 300).attr("height", 100)
        graph = new EdgeWeightedGraph(new Graph());
    });
    afterEach(() => {
        expect(consoleSpy).toHaveBeenCalledTimes(0);
        consoleSpy.mockRestore();
    });

    it('graph defaults', () => {
        expect(graph.getNumVertices()).toBe(0)
        expect(graph.getNumEdges()).toBe(0)
    });

    it('node properties', () => {
        let a = graph.addNode(0,0)
        graph.updateNodeProp(a, {test:1})
        let nodes = graph.getNodes()
        expect(nodes.length).toBe(1)
        expect(nodes[0].test).toBe(1)
    });

    it('basic graph APIs', () => {
        // create a chain
        // a-b-c-d-e
        let a = graph.addNode(0,0),
        b = graph.addNode(0,0),
        c = graph.addNode(0,0),
        d = graph.addNode(0,0),
        e = graph.addNode(0,0)
        graph.addEdge(new Edge(a,b,1))
        graph.addEdge(new Edge(b,c,1))
        graph.addEdge(new Edge(c,d,1))
        graph.addEdge(new Edge(d,e,1))
        expect(graph.getNumEdges()).toBe(4)
        expect(graph.getNumVertices()).toBe(5)
        expect(graph.checkConnection(a,b)).toBe(1)
        expect(graph.checkConnection(b,a)).toBe(1)
        expect(graph.checkConnection(a,c)).toBe(0)
        expect(graph.checkConnection(c,a)).toBe(0)

        expect(graph.getNodes().length).toBe(5)
        expect(graph.getLinks().length).toBe(8)
        
        graph.deleteNode(a)
        expect(graph.getNumEdges()).toBe(3)
        expect(graph.getNodes().length).toBe(4)
        graph.removeEdge(a,b)
        expect(graph.getNumEdges()).toBe(3)
        graph.removeEdge(c,b)
        graph.getLinks()
    });


});
