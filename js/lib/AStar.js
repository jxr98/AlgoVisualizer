import {GridGraph} from './GridGraph.js'

class Location
{
    x = 0;
    y = 0;
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
}

class AStar
{
    #gridGraph
    #srcNode
    #targetNode

    #isFinished = false;
    #pathFound = false;

    // ideally use min-heap based priority queue
    #openSet
    #visitedSet

    // stores cost
    #node2CostMap // path cost

    constructor(gridGraph, src, target)
    {
        this.#gridGraph = gridGraph
        this.#srcNode = this.#gridGraph.getNodeID(src.x, src.y)
        this.#targetNode = this.#gridGraph.getNodeID(target.x, target.y)
        this.#openSet = new Set()
        this.#visitedSet = new Set()

        this.#openSet.add(this.#srcNode)
        this.#visitedSet.add(this.#srcNode)
    }

    ////////////////////////////////////////////////////////////////////
    //////// public interface

    // calls step() until algorithm is completed
    run()
    {
        while(!this.isFinished())
        {
            this.step();
        }
    }

    // run a single increment of the search algorithm
    step()
    {
        if (this.isFinished()) return;
        if (this.#openSet.size == 0) return;

        // take lowest cost node from set
        let node = -1,
        nodeCost = -1;
        this.#openSet.forEach(function(openNode){
            let openNodeCost = this.#calculateCost(openNode);
            if (nodeCost === -1 || openNodeCost < nodeCost)
            {
                node = openNode;
                nodeCost = openNodeCost;
            }
        })

        // check if node is target
        if (node === this.#targetNode)
        {
            this.#isFinished = true;
            this.#pathFound = true;
            return;
        }

        // push neighbors of node to open and visited set 

    }

    // Following APIs peek current states of the algorithm

    isFinished()
    {
        return this.#isFinished;
    }

    ////////////////////////////////////////////////////////////////////
    //////// private interface

    #calculateCost(node)
    {
        let pathCost = this.#node2CostMap.get(node);
        let estimatedCost = this.#estimatedCostToTarget(node)
        return pathCost + estimatedCost;
    }

    #estimatedCostToTarget(curNode)
    {
        // use manhattan distance
        return 0;
    }
}

export {AStar, Location}