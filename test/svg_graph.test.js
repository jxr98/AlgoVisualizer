import {ForceSimulationGraph} from "../js/lib/svg_graph";
import {expect, jest} from '@jest/globals';
import * as d3 from '../js/thirdParty/d3.js';
    
describe('positive tests', () => {
    let consoleSpy;
    let svg;
    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        svg = d3.select("body").append("svg").attr("width", 800).attr("height", 100)
    });
    afterEach(() => {
        expect(consoleSpy).toHaveBeenCalledTimes(0);
        consoleSpy.mockRestore();
    });
  
    it('constructor', () => {
        let g1 = new ForceSimulationGraph(svg, true)
        let g2 = new ForceSimulationGraph(svg, false)
    });
  
    it('basic graph APIs', () => {
        let g = new ForceSimulationGraph(svg, false)

        // create a chain
        // a-b-c-d-e
        let a = g.addNode(0,0),
        b = g.addNode(0,0),
        c = g.addNode(0,0),
        d = g.addNode(0,0),
        e = g.addNode(0,0)
        g.connectNodes(a,b)
        g.connectNodes(b,c)
        g.connectNodes(c,d)
        g.connectNodes(d,e)

        let graphModel = g.getGraphModel();
        expect(graphModel != null).toBeTruthy()
        expect(graphModel.getNumEdges()).toBe(4)
        expect(graphModel.getNumVertices()).toBe(5)

        // remove c
        // a-b d-e
        g.deleteNode(c)
        expect(graphModel.getNumEdges()).toBe(2)
        expect(graphModel.getNumVertices()).toBe(5) // num veritices dont decrease because of lazy delete

        // delete a-b edge
        // a b d-e
        g.disconnect(a,b)
        expect(graphModel.getNumEdges()).toBe(1)
        expect(graphModel.getNumVertices()).toBe(5) // num veritices dont decrease because of lazy delete
    });
  
    it('change color API', () => {
        let g = new ForceSimulationGraph(svg, false)
        let a = g.addNode(0,0)
        g.changeColor(a, "blue")
        let graphModel = g.getGraphModel();
        expect(graphModel.getNodeProperty(a).color).toBe("blue")
    });
});
  