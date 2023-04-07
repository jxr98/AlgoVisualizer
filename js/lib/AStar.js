import * as util from './Utils.js'
import * as common from './common.js'

export class Location
{
    x = 0;
    y = 0;
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
}

export class AStar
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
    #parentMap // map node to its parent

    // animation queue
    // each element object contains an array of nodeIDs and the color to set to
    #animationQueue = []


    // some stats
    #pathLength = 0;

    constructor(gridGraph, src, target)
    {
        this.#gridGraph = gridGraph
        this.#srcNode = this.#gridGraph.getNodeID(src.x, src.y)
        this.#targetNode = this.#gridGraph.getNodeID(target.x, target.y)
        this.#openSet = new Set()
        this.#visitedSet = new Set()
        this.#node2CostMap = new Map()
        this.#parentMap = new Map()

        this.#openSet.add(this.#srcNode)
        this.#visitedSet.add(this.#srcNode)
        this.#node2CostMap.set(this.#srcNode, 0)
        this.#parentMap.set(this.#srcNode, this.#srcNode)

        // generate animation data
        this.#run();

        // set color for start & target node 
        this.#gridGraph.changeColor(this.#srcNode, "blue")
        this.#gridGraph.changeColor(this.#targetNode, "red")
    }

    ////////////////////////////////////////////////////////////////////
    //////// public interface

    numAnimationSteps()
    {
        return this.#animationQueue.length;
    }

    animateStep()
    {
        if (this.#animationQueue.length == 0) return;

        let animation = this.#animationQueue.shift(),
        nodes = animation.nodes,
        color = animation.color,
        self = this
        nodes.forEach((nodeID) => {
            self.#gridGraph.changeColor(nodeID, color)
        })
    }

    isFinished()
    {
        return this.#isFinished;
    }

    foundPath()
    {
        return this.#pathFound;
    }

    printStats()
    {
        if (this.#pathFound)
        {
            console.log("Path found!")
            console.log("Number of tiles visited: " + this.#visitedSet.size)
            console.log("Number of tiles remaining in open queue: " + this.#openSet.size)
            console.log("Number of tiles expanded: " + (this.#visitedSet.size - this.#openSet.size))
            console.log("Path length: " + this.#pathLength)
        }
        else
        {
            console.log("No path exist!")
        }
    }

    ////////////////////////////////////////////////////////////////////
    //////// private interface

    // run a single increment of the search algorithm
    #step()
    {
        if (this.isFinished() || this.#openSet.size == 0)
        {
            this.#isFinished = true;
            return;
        }

        // take lowest cost node from set
        let self = this,
        node = -1,
        bestTotalCost = -1,
        bestPathCost = -1,
        astarFac = 2 // encourage fast search
        this.#openSet.forEach(function(openNode){
            // let openNodeCost = self.#calculateCost(openNode);
            let pathCost = self.#node2CostMap.get(openNode),
            estimatedCost = self.#estimatedCostToTarget(openNode),
            totalCost = pathCost + estimatedCost * astarFac

            if (node === -1 || (totalCost < bestTotalCost))
            {
                node = openNode;
                bestTotalCost = totalCost;
                bestPathCost = pathCost;
            }
        })
        this.#openSet.delete(node);

        // check if node is target
        if (node === this.#targetNode)
        {
            this.#isFinished = true;
            this.#pathFound = true;
            return;
        }

        // push neighbors of node to open and visited set 
        // update node2CostMap for each neighbor
        let currentNodePathCost = this.#node2CostMap.get(node);
        let neighbors = []
        this.#gridGraph.getAdjacent(node).forEach(function(neighbor)
        {
            if (!self.#visitedSet.has(neighbor) && !self.#gridGraph.isObstacle(neighbor))
            {
                self.#visitedSet.add(neighbor)
                self.#parentMap.set(neighbor, node)
                self.#openSet.add(neighbor)
                self.#node2CostMap.set(neighbor, currentNodePathCost+1)
                neighbors.push(neighbor)
            }
        })

        if (neighbors.length > 0)
        {
            this.#animationQueue.push({nodes: neighbors, color: common.process_color})
        }
    }
    
    #backTrack()
    {
        // if path exists, we need to have back tracking as part of the animation
        if (!this.#pathFound) return;

        let queue = []

        if (this.#parentMap.has(this.#targetNode))
        {
            let curr = this.#targetNode
            while(curr != this.#srcNode)
            {
                let parent = this.#parentMap.get(curr)
                if (parent != this.#srcNode)
                {
                    queue.push(parent)
                }
                curr = parent
            }
        }

        // flip the queue so animation shows path from src to dst
        let self = this
        self.#animationQueue.push({nodes: [self.#targetNode], color: common.focused_line_color})
        queue.forEach((nodeId) => {
            self.#animationQueue.push({nodes: [nodeId], color: common.focused_line_color})
        })

        this.#pathLength = queue.length + 2 // +2 for source and destination tiles
    }

    #run()
    {
        while(!this.isFinished())
        {
            this.#step();
        }

        this.#backTrack()
    }

    #estimatedCostToTarget(curNode)
    {
        let {x, y} = this.#gridGraph.getNodePosition(curNode)
        let ret = this.#gridGraph.getNodePosition(this.#targetNode),
        targetX = ret.x,
        targetY = ret.y
        return util.manhattanDistance(x,y,targetX, targetY)
    }
}