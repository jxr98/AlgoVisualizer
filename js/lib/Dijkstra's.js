import {PriorityQueue} from "./PriorityQueue.js";
class Dijkstra {
    // graph which will be searched
    graph;
    // target vertex
    target;
    // [source, target, weight]
    weight;
    // distance from source to every vertex
    dist = [];
    // record the predecessor of every vertex, -1 means no predecessor
    prev = [];
    // vertex whose min. weight is not confirmed
    pq = new PriorityQueue();
    // record confirmed vertex
    visited = new Set();
    // weight info in each step
    record = [];

    constructor(weightInfo, graph, source, target) {
        this.weight = weightInfo;
        this.target = target;
        this.graph = graph;
        this.traverse(source);
    }

    // use Dijkstra's algorithm to traverse whole graph from start vertex(v) to target vertex(target)
    traverse (v) {
        let vertexNum = this.graph.getNumVertices();
        for (let i = 0; i < vertexNum; i++) {
            this.dist[i] = Infinity;
            this.prev[i] = -1;
            this.pq.enqueue(i, this.dist[i]);
        }
        this.dist[v] = 0;
        this.pq.update(v, this.dist[v]);
        this.record.push([["none", "none"]]);

        while (!this.pq.isEmpty()) {
            let u = this.pq.dequeue();
            let updateInfo = [];
            for (let i = 0; i < this.weight.length; i++) {
                let s = this.weight[i][0];
                if (s != u) continue;
                let t = this.weight[i][1];
                /* istanbul ignore next */
                if (this.visited.has(t)) continue;
                let w = this.weight[i][2];
                let alt = this.dist[u] + w;
                /* istanbul ignore next */
                if (alt < this.dist[t]) {
                    this.dist[t] = alt;
                    this.prev[t] = u;
                    this.pq.update(t, this.dist[t]);
                    updateInfo.push([t, this.dist[t]]);
                }
            }
            /* istanbul ignore next */
            if (updateInfo == []) updateInfo = [["none", "none"]];
            this.record.push(updateInfo);
            if (u == this.target) break;
        }
    }

    // check if there is a path from start vertex to v
    havePath () {
        if (this.dist[this.target] != Infinity) return true;
        return false;
    }

    // return the shortest path from v to target, shown every node and its min. weight from v
    getPath () {
        let cur = this.target;
        let res = [[this.target, this.dist[this.target]]];
        while (this.prev[cur] != -1) {
            cur = this.prev[cur];
            res.unshift([cur, this.dist[cur]]);
        }
        return res;
    }

    getProcess () {
        return this.record;
    }

}

export {Dijkstra}