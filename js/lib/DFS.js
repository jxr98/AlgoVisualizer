class DFS {
    // graph which will be searched
    graph;
    // record vertices if visited in the present path
    visited;
    // record visited vertices order
    // when first time visited, turn light; second time visited, turn grey
    verticesStatus;
    // stack for store the present path
    path;
    // array for store all paths from start vertex to target
    allPaths;
    // target vertex
    target;
    constructor(graph, start, target) {
        this.visited = new Array(graph.getNumVertices()).fill(false);
        this.verticesStatus = [];
        this.target = target;
        this.allPaths = [];
        this.path = [];
        this.graph = graph;
        this.traverse(start);
    }

    // DFS whole graph from start vertex(v)
    traverse (v) {
        if (this.visited[v]) return;
        this.path.push(v);
        if (v == this.target) {
            this.allPaths.push([...this.path]);
        }
        this.visited[v] = true;
        this.verticesStatus.push(v);
        let adjacents = Array.from(this.graph.getAdjacent(v));
        for (let i = 0; i < adjacents.length; i++) {;
            this.traverse(adjacents[i]);
        }
        this.visited[v] = false;
        this.verticesStatus.push(v);
        this.path.pop();
    }

    // check if there is a path from start vertex to v
    havePath () {
        if (this.allPaths.length != 0) return true;
        return false;
    }

    // return the shortest path from start vertex to v
    getPath () {
        let minLength = this.graph.getNumVertices() + 1;
        let minPath = [];
        for (let i = 0; i < this.allPaths.length; i++) {
            if (minLength > this.allPaths[i].length) {
                minLength = this.allPaths[i].length;
                minPath = this.allPaths[i];
            }
        }
        return minPath;
    }

    getProcess() {
        return this.verticesStatus;
    }

}

export {DFS}