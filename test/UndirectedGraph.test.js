import { UndirectedGraph } from '../js/lib/UndirectedGraph'
import {expect, jest} from '@jest/globals';

describe('UndirectedGraph error testing', () => {
  let consoleSpy;
  let graph;
  beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      graph = new UndirectedGraph();
  });
  afterEach(() => {
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
  });

  it('bad node ID', () => {
    let node = graph.addNode();
    graph.deleteNode("x")
  });

});


describe('UndirectedGraph', () => {
  let graph;

  beforeEach(() => {
    graph = new UndirectedGraph();
  });

  test('getNumVertices should return 0 initially', () => {
    expect(graph.getNumVertices()).toBe(0);
  });

  test('getNumEdges should return 0 initially', () => {
    expect(graph.getNumEdges()).toBe(0);
  });

  test('addNode should add a node to the graph', () => {
    const nodeIndex = graph.addNode();
    expect(graph.getNumVertices()).toBe(1);
    expect(nodeIndex).toBe(0);
  });

  test('addEdge should add an edge between two nodes', () => {
    graph.addNode();
    graph.addNode();
    graph.addEdge(0, 1);
    expect(graph.getNumEdges()).toBe(1);
    expect(graph.checkConnection(0, 1)).toBe(1);
  });


  it('should not add edge if one of the parameters is NaN', () => {
    graph.addNode();
    graph.addEdge(0, NaN);
    expect(graph.getNumEdges()).toBe(0);
  });

  test('removeEdge should remove an edge between two nodes', () => {
    graph.addNode();
    graph.addNode();
    graph.addEdge(0, 1);
    expect(graph.getNumEdges()).toBe(1);
    graph.removeEdge(0, 1);
    expect(graph.getNumEdges()).toBe(0);
    expect(graph.checkConnection(0, 1)).toBe(0);
  });

  test('updateNodeProp should update the properties of a node', () => {
    const nodeIndex = graph.addNode();
    graph.updateNodeProp(nodeIndex, { x: 10, y: 20 });
    expect(graph.getNodes()[0]).toEqual(expect.objectContaining({ x: 10, y: 20 }));
  });

  test('getAdjacent should return the neighbors of a node', () => {
    const nodeIndex = graph.addNode();
    graph.addNode();
    graph.addNode();
    graph.addEdge(nodeIndex, 1);
    graph.addEdge(nodeIndex, 2);
    expect(graph.getAdjacent(nodeIndex).size).toBe(2);
    expect(graph.getAdjacent(nodeIndex).has(1)).toBe(true);
    expect(graph.getAdjacent(nodeIndex).has(2)).toBe(true);
  });

  test('getNodes should return an array of nodes with their properties', () => {
    const nodeIndex1 = graph.addNode(10, 20);
    graph.addNode(30, 40);
    graph.addNode(50, 60);
    graph.deleteNode(1);
    const nodes = graph.getNodes();
    expect(nodes.length).toBe(2);
    expect(nodes[0]).toEqual(expect.objectContaining({ x: 10, y: 20 }));
    expect(nodes[0]).toEqual(expect.objectContaining({ delete: false }));
    expect(nodes[1]).toEqual(expect.objectContaining({ delete: false }));
  });

  test('getLinks should return an array of edges between nodes', () => {
    const nodeIndex1 = graph.addNode();
    const nodeIndex2 = graph.addNode();
    const nodeIndex3 = graph.addNode();
    graph.addEdge(nodeIndex1, nodeIndex2);
    graph.addEdge(nodeIndex1, nodeIndex3);
    graph.addEdge(nodeIndex2, nodeIndex3);
    const links = graph.getLinks();
    expect(links.length).toBe(3);
    expect(links).toContainEqual(expect.objectContaining({ source: nodeIndex1, target: nodeIndex2 }));
    expect(links).toContainEqual(expect.objectContaining({ source: nodeIndex1, target: nodeIndex3 }));
    expect(links).toContainEqual(expect.objectContaining({ source: nodeIndex2, target: nodeIndex3 }));
  });

  test('checkConnection should return 0 if there is no connection between two nodes', () => {
    const nodeIndex1 = graph.addNode();
    const nodeIndex2 = graph.addNode();
    graph.addEdge(nodeIndex1, nodeIndex2);
    expect(graph.checkConnection(nodeIndex1, 0)).toBe(0);
  });

  test('checkConnection should return 1 if there is a connection between two nodes', () => {
    const nodeIndex1 = graph.addNode();
    const nodeIndex2 = graph.addNode();
    graph.addEdge(nodeIndex1, nodeIndex2);
    expect(graph.checkConnection(nodeIndex1, nodeIndex2)).toBe(1);
  });

  test('should log warning if parameters are not integers', () => {
    console.warn = jest.fn();
    graph.checkConnection('a', 1);
    expect(console.warn).toHaveBeenCalledWith('[UndirectedGraph::checkConnection] Parameter is not a number');
  });

  test('should log error if parameters are invalid', () => {
    console.error = jest.fn();
    graph.checkConnection(1, 'b');
    expect(console.error).toHaveBeenCalledWith('[UndirectedGraph::checkConnection] Parameter is invalid');
  });

  test('deleteNode should do nothing if the node ID is not a number', () => {
    graph.addNode();
    graph.deleteNode('1');
    expect(graph.getNumVertices()).toBe(1);
  });

  test('deleteNode should do nothing if the node ID is invalid', () => {
    graph.addNode();
    graph.deleteNode(NaN);
    expect(graph.getNumVertices()).toBe(1);
  });

  test('delete and check', () => {
    let a = graph.addNode(10, 20),
    b = graph.addNode(30, 40)
    graph.deleteNode(a);
    const nodes = graph.getNodes();
    expect(nodes.length).toBe(1);
    expect(graph.isNodeDeleted(a)).toBeTruthy();
    expect(graph.isNodeValid(a)).toBe(true);
    expect(graph.isNodeValid(b)).toBe(true);
    expect(graph.isNodeValid(-1)).toBe(false);
    expect(graph.isNodeValid(2)).toBe(false);
    expect(graph.isNodeValid(3.2)).toBe(false);
  });

  test('removeEdge should do nothing if either parameter is invalid', () => {
    graph.addNode();
    graph.addNode();
    graph.addEdge(0, 1);
    graph.removeEdge(NaN, 1);
    graph.removeEdge(0, NaN);
    expect(graph.getNumEdges()).toBe(1);
  });


  test('updateNodeProp should do nothing if the property is not a valid object', () => {
    const nodeIndex = graph.addNode();
    graph.updateNodeProp(nodeIndex, 'invalid');
    expect(graph.getNodes()[0]).toEqual(expect.objectContaining({ x: 0, y: 0 }));
  });



  test('checkConnection should do nothing if either parameter is not a number', () => {
    const nodeIndex1 = graph.addNode();
    graph.checkConnection('0', nodeIndex1);
    graph.checkConnection(nodeIndex1, '0');
    expect(graph.checkConnection('0', '0')).toBe(0);
  });
  
  test('delete node and remove edge', () => {
    let g = new UndirectedGraph();
    let node0 = g.addNode();
    let node1 = g.addNode();
    let node2 = g.addNode();
    let node3 = g.addNode();
    g.addEdge(node0, node1);
    g.addEdge(node1, node2);
    g.addEdge(node2, node3);
    g.addEdge(node3, node0);
    expect(g.getNumVertices()).toBe(4);
    expect(g.getNumEdges()).toBe(4);

    // delete a node and remove its edges
    g.deleteNode(node2);
    expect(g.getNumVertices()).toBe(4);
    expect(g.getNumEdges()).toBe(2);

    // remove an edge
    g.removeEdge(node0, node1);
    expect(g.getNumEdges()).toBe(1);
    expect(g.checkConnection(node1, node0)).toBe(0);
    expect(g.checkConnection(node3, node0)).toBe(1);
});

  test('check connections', () => {
    let g = new UndirectedGraph();
    let node0 = g.addNode();
    let node1 = g.addNode();
    let node2 = g.addNode();
    g.addEdge(node0, node1);
    expect(g.checkConnection(node0, node1)).toBe(1);
    expect(g.checkConnection(node2, node1)).toBe(0);
    expect(g.checkConnection(node0, node2)).toBe(0);
});
});
