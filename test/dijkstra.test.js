import {Dijkstra} from "../js/lib/Dijkstra's";

describe('Dijkstra', () => {
    test('finds shortest path in graph', () => {
      const graph = {
        getNumVertices: () => 4,
      };
      const weightInfo = [
        [0, 1, 2],
        [0, 2, 4],
        [1, 2, 1],
        [1, 3, 5],
        [2, 3, 1],
      ];
      const source = 0;
      const target = 3;
      const dijkstra = new Dijkstra(weightInfo, graph, source, target);
  
      expect(dijkstra.havePath()).toBe(true);
      expect(dijkstra.getPath()).toEqual([
        [0, 0],
        [1, 2],
        [2, 3],
        [3, 4],
      ]);

    //   const expectedProcess = [
    //     [['none', 'none']],
    //     [[[1, 2], [2, 4]]],
    //     [[[2, 3]],[3, 5]],
    //     [[[3, 4]]],
    //   ];
    //   expect(dijkstra.getProcess()).toEqual(expectedProcess);
    });
    });
  
    // test('returns false when no path exists', () => {
    //   const graph = {
    //     getNumVertices: () => 3,
    //   };
    //   const weightInfo = [
    //     [0, 1, 2],
    //   ];
    //   const source = 0;
    //   const target = 1;
    //   const dijkstra = new Dijkstra(weightInfo, graph, source, target);
  
    //   expect(dijkstra.havePath()).toBe(false);
    // });
