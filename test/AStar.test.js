import * as d3 from '../js/thirdParty/d3.js';
import {Location, AStar} from '../js/lib/AStar'
import { GridGraph } from '../js/lib/GridGraph';
import {expect, jest} from '@jest/globals';

describe('positive tests', () => {
    let consoleSpy;
    let svg;
    let graph;
    let heightSpy;
    let widthSpy;
    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        let width = 800, height = 800
        svg = d3.select("body").append("svg").attr("width", width).attr("height", height)
        heightSpy = jest.spyOn(svg.node(), 'clientHeight', 'get').mockImplementation(() => height);
        widthSpy = jest.spyOn(svg.node(), 'clientWidth', 'get').mockImplementation(() => width);
        graph = new GridGraph(svg);
        

    });
    afterEach(() => {
        expect(consoleSpy).toHaveBeenCalledTimes(0);
        consoleSpy.mockRestore();
    });

    it('Default location parameters', () => {
        let loc = new Location();
        expect(loc.x).toBe(undefined)
        expect(loc.y).toBe(undefined)
    });

    it('Custom location', () => {
        let loc = new Location(-1,3);
        expect(loc.x).toBe(-1)
        expect(loc.y).toBe(3)
    });

    it('Astar, path exist', () => {
        let startLoc = new Location(0, 0)
        let endLoc = new Location(3, 3);
        let sim = new AStar(graph, startLoc, endLoc)
        const numSteps = sim.numAnimationSteps();
        for (let i =0; i < numSteps; ++i)
        {
            sim.animateStep();
        }
        sim.printStats();
        expect(sim.foundPath()).toBeTruthy()
    })

    it('Astar, path does not exist', () => {
        let startLoc = new Location(0, 0)
        let endLoc = new Location(3, 3);
        graph.setObstacle(graph.getNodeID(1,0))
        graph.setObstacle(graph.getNodeID(0,1))
        let sim = new AStar(graph, startLoc, endLoc)
        const numSteps = sim.numAnimationSteps();
        for (let i =0; i < numSteps; ++i)
        {
            sim.animateStep();
        }
        sim.animateStep();
        sim.printStats();
        expect(sim.foundPath()).toBeFalsy()
    })

});