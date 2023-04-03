class maxHeap {
    constructor() {
        this.process = []
    };

    buildHeap(arr)
    {
        var N = arr.length;
        // Build heap (rearrange array)
        for (var i = Math.floor(N / 2) - 1; i >= 0; i--)
            this.heapify(arr, N, i);
    }

    heapify(arr, N, i) {
        var largest = i; // Initialize largest as root
        var l = 2 * i + 1; // left = 2*i + 1
        var r = 2 * i + 2; // right = 2*i + 2

        // If left child is larger than root
        if (l < N && arr[l] > arr[largest])
            largest = l;

        // If right child is larger than largest so far
        if (r < N && arr[r] > arr[largest])
            largest = r;

        this.process.push([i, l, r, largest])
        console.log([i, l, r, largest])
        console.log(arr)

        // If largest is not root
        if (largest != i) {
            var swap = arr[i];
            arr[i] = arr[largest];
            arr[largest] = swap;

            // Recursively heapify the affected sub-tree
            this.heapify(arr, N, largest);
        }
    }

    getProcess()
    {
       return this.process
    }
};

class minHeap {
    constructor() {
        this.process = []
    };

    buildHeap(arr)
    {
        var N = arr.length;
        // Build heap (rearrange array)
        for (var i = Math.floor(N / 2) - 1; i >= 0; i--)
            this.heapify(arr, N, i);
    }

    heapify(arr, N, i) {
        var smallest = i; // Initialize largest as root
        var l = 2 * i + 1; // left = 2*i + 1
        var r = 2 * i + 2; // right = 2*i + 2

        // If left child is larger than root
        if (l < N && arr[l] < arr[smallest])
            smallest = l;

        // If right child is larger than largest so far
        if (r < N && arr[r] < arr[smallest])
            smallest = r;

        this.process.push([i, l, r, smallest])

        // If largest is not root
        if (smallest != i) {
            var swap = arr[i];
            arr[i] = arr[smallest];
            arr[smallest] = swap;

            // Recursively heapify the affected sub-tree
            this.heapify(arr, N, smallest);
        }
    }

    getProcess()
    {
        return this.process
    }
};

export {maxHeap, minHeap}