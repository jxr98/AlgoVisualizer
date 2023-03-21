import { PriorityQueue } from '../js/lib/PriorityQueue'

describe('PriorityQueue', () => {
  let pq;
  beforeEach(() => {
    pq = new PriorityQueue();
  });

  test('enqueue should add an element with priority to the queue', () => {
    pq.enqueue('item1', 1);
    pq.enqueue('item2', 2);
    pq.enqueue('item3', 3);

    expect(pq.items.length).toBe(3);
    expect(pq.items[0].element).toBe('item1');
    expect(pq.items[1].element).toBe('item2');
    expect(pq.items[2].element).toBe('item3');
  });

  test('dequeue should remove and return the element with the highest priority', () => {
    pq.enqueue('item1', 1);
    pq.enqueue('item2', 2);
    pq.enqueue('item3', 3);

    expect(pq.dequeue()).toBe('item1');
    expect(pq.items.length).toBe(2);

    expect(pq.dequeue()).toBe('item2');
    expect(pq.items.length).toBe(1);

    expect(pq.dequeue()).toBe('item3');
    expect(pq.items.length).toBe(0);

    expect(pq.dequeue()).toBe('Underflow');
  });

  test('update should update the priority of an existing element', () => {
    pq.enqueue('item1', 1);
    pq.enqueue('item2', 2);
    pq.enqueue('item3', 3);

    pq.update('item1', 4);
    pq.update('item3', 0);

    expect(pq.items.length).toBe(3);
    expect(pq.items[0].element).toBe('item3');
    expect(pq.items[0].priority).toBe(0);

    expect(pq.items[1].element).toBe('item2');
    expect(pq.items[1].priority).toBe(2);

    expect(pq.items[2].element).toBe('item1');
    expect(pq.items[2].priority).toBe(4);
  });

  test('isEmpty should return true if the queue is empty', () => {
    expect(pq.isEmpty()).toBe(true);

    pq.enqueue('item1', 1);
    expect(pq.isEmpty()).toBe(false);

    pq.dequeue();
    expect(pq.isEmpty()).toBe(true);
  });
});
