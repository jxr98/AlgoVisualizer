import {GraphDecorator} from "./GraphDecorator.js";
import {Graph} from "./Graph.js";
import {Edge} from "./Edge.js";

export class EdgeWeightedGraph extends GraphDecorator {
    #numVertices;
    #numEdges;
    graph; //type Graph
    #adjacent; // // adjacency list, array of sets
    #nodeProp; // array of objects
    constructor(graph) {
        super(graph);
        this.#numVertices = 0;
        this.#numEdges = 0;
        this.#adjacent = [];
        this.#nodeProp = [];
    }

    getNumVertices() {
        return this.#numVertices;
    }

    getNumEdges() {
        return this.#numEdges;
    }

    addNode(x = 0, y = 0) {
        const newNodeIndex = this.#numVertices++;
        this.#adjacent[newNodeIndex] = new Set();
        this.#nodeProp[newNodeIndex] = {x: x, y: y, delete: false};
        return newNodeIndex;
    }

    addEdge(edge) { // edge is of type Edge
        this.#adjacent[edge.source].add(edge);
        this.#adjacent[edge.target].add(edge);
        this.#numEdges++;
    }

    deleteNode(node) {
        // lazy delete
        this.updateNodeProp(node, {delete: true})

        // remove edge to this node from all other nodes
        for (let i = 0; i < this.#numVertices; i++) {
            this.removeEdge(node, i);
        }
    }

    removeEdge(source, target) {
        if (this.#removeEdgeFromEdgeSet(source, target) === 1) {
            this.#numEdges--;
        }
    }

    #removeEdgeFromEdgeSet(source, target, edge) { //edge is of type Edge
        var result = 0;
        let set1 = this.getAdjacent(source);
        if (set1 !== undefined) {
            for (var it of set1) {
                if (it.target === target || it.source === target) {
                    set1.delete(it);
                    result = 1;
                }
            }
        }
        let set2 = this.getAdjacent(target);
        if (set2 !== undefined) {
            for (var it of set2) {
                if (it.target === source || it.target === source) {
                    set2.delete(it);
                    result = 1;
                }
            }
        }
        return result;
    }


    checkConnection(v, w) {
        let connection1 = this.getAdjacent(v);
        if (connection1 !== undefined) {
            for (var it of connection1) {
                if (it.target === w || it.source === w) {
                    return 1;
                }
            }
        }
        let connection2 = this.getAdjacent(w);
        if (connection2 !== undefined) {
            for (var it of connection2) {
                if (it.target === v || it.target === v) {
                    return 1;
                }
            }
        }
        return 0;
    }

    getAdjacent(v) {
        return this.#adjacent[v];
    }

    updateNodeProp(node, prop) {
        this.#nodeProp[node] = Object.assign(this.#nodeProp[node], prop);
    }

    getNodes() {
        let ret = [];
        for (let i = 0; i < this.#numVertices; i++) {
            if (this.#nodeProp[i].delete === true) continue;

            let idx = ret.length;
            ret.push({
                id: i,
                name: i,
                x: this.#nodeProp[i].x,
                y: this.#nodeProp[i].y
            })

            // other props are merged
            ret[idx] = Object.assign(ret[idx], this.#nodeProp[i]);
        }
        return ret;
    }

    // this interface is designed for D3.force simulation
    getLinks() {
        const lookup = new Map();
        let ret = [];
        for (let i = 0; i < this.#numVertices; i++) {
            if (!lookup.has(i)) {
                lookup.set(i, new Set());
            }

            // if node i is deleted, skip
            if (this.#nodeProp[i].delete === true) continue;

            // check links for node i
            var adjacent = this.#adjacent[i];
            adjacent.forEach(function (value) {
                let neighborNode = parseInt(value.target);

                // if a link already exist, continue
                // this check here make sure that we dont have 2 links for each edge
                if (!lookup.get(i).has(neighborNode)) {
                    // since we are doing bi-directional links, add for both direction
                    lookup.get(i).add(neighborNode);
                    if (!lookup.has(neighborNode)) {
                        lookup.set(neighborNode, new Set());
                    }
                    lookup.get(neighborNode).add(i);
                    ret.push({
                        source: i,
                        target: neighborNode,
                        weight: value.weight
                    });
                }

            });
        }
        return ret;
    }
}
