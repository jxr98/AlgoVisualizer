// In insertion sort, the array to be sorted is divided into two sub-arrays
// we start with first element of the array as the sorted array and the rest of the array
// as un-sorted array. We incrementally move elements from un-sorted section to sorted section via linear search.
// The array is sorted when the un-sorted section is empty
export class InsertionSort
{
    // handle to array visualizer
    #arrayVis = null;

    // internal states
    #done = false;
    #sortedIdx = 0;
    #arraySize = 0;
    #numComparisonsMade = 0;
    #originalArrayCopy = []
    #steppingLinearSearch = false;
    #dataBeingMoved = null

    // linear search states
    #linearSearchCurrentIdx = 0;
    #searchArray = []
    
    constructor(arrayVis)
    {
        this.#arrayVis = arrayVis;
        this.#arraySize = arrayVis.size();

        for (let i = 0; i < this.#arraySize; ++i)
        {
            this.#originalArrayCopy[i] = this.#arrayVis.get(i).value;
        }
    }

    ////////////////////////////////////////////////////////////////////
    //////// public functions
    isDone()
    {
        return this.#done;
    }

    step()
    {
        if (this.#done) return;

        // in each step move first element from unsorted section to sorted section
        if (this.#sortedIdx < this.#arraySize)
        {
            let dataMoved = this.#arrayVis.get(this.#sortedIdx);
            let dataNewPosition = this.#linearSearch(dataMoved, this.#sortedIdx)
            dataMoved.color = "red";
            this.#arrayVis.move(dataMoved.id, dataNewPosition)
            this.#sortedIdx++;
        }
        else
        {
            this.#done = true;
            this.#printStats();
        }
    }

    detailedStep()
    // a more refined step, shows increments of linear search as well
    {
        if (this.#done) return;

        if (this.#sortedIdx < this.#arraySize)
        {
            if (this.#steppingLinearSearch)
            // inserting unsorted data into sorted section
            {
                let searchResult = this.#linearSearchStep();
                if (searchResult != -1)
                // found target position in linear search
                {
                    this.#steppingLinearSearch = false; // move to next sorted node
                    this.#sortedIdx++; // size of sorted section increase by 1

                    this.#dataBeingMoved.color = "red";
                    this.#arrayVis.move(this.#dataBeingMoved.id, searchResult)
                }
                else
                // still have not found position
                {
                    this.#arrayVis.move(this.#dataBeingMoved.id, this.#linearSearchCurrentIdx)
                }
            }
            else
            // selecting a new unsorted data
            {
                this.#steppingLinearSearch = true;
                this.#dataBeingMoved = this.#arrayVis.get(this.#sortedIdx);
                this.#dataBeingMoved.color = "blue";
                this.#arrayVis.updateRendering(); // for the color change

                // configure linear search state
                this.#searchArray = []
                for (let i = 0; i < this.#arraySize; ++i)
                {
                    this.#searchArray[i] = this.#arrayVis.get(i).value;
                }
                this.#linearSearchCurrentIdx = 0;
                this.#arrayVis.move(this.#dataBeingMoved.id, this.#linearSearchCurrentIdx)
            }
        }
        else
        {
            this.#done = true;
            this.#printStats();
        }

    }

    ////////////////////////////////////////////////////////////////////
    //////// private functions

    // single step of linear search
    #linearSearchStep()
    {
        if (this.#linearSearchCurrentIdx < this.#sortedIdx)
        {
            this.#numComparisonsMade++;
            if (this.#searchArray[this.#linearSearchCurrentIdx] < this.#dataBeingMoved.value)
            {
                return this.#linearSearchCurrentIdx;
            }
            this.#linearSearchCurrentIdx++;
            return -1;
        }
        return this.#sortedIdx;
    }

    // find sorted position of data in the range from index 0 to endIndex
    #linearSearch(data, endIdx)
    {
        for (let i = 0; i <= endIdx ; i++)
        {
            this.#numComparisonsMade++;
            if (this.#arrayVis.get(i).value < data.value) return i;
        }
        return endIdx;
    }

    #printStats()
    {
        let sortedSequence = []
        for (let i = 0; i < this.#arraySize; ++i)
        {
            sortedSequence[i] = this.#arrayVis.get(i).value;
        }
        console.log("Insertion sort original sequence: " + this.#originalArrayCopy);
        console.log("Insertion sort final sequence: " + sortedSequence);
        console.log("Number of comparisons: " + this.#numComparisonsMade)
    }
}

// insertion sort with binary search
export class BinaryInsertionSort
{
    // handle to array visualizer
    #arrayVis = null;

    // internal states
    #done = false;
    #sortedIdx = 0;
    #arraySize = 0;
    #numComparisonsMade = 0;
    #originalArrayCopy = []
    #dataBeingMoved = null

    // search states
    #stepSearchCurrentIdx = 0;
    #steppingSearch = false;

    // binary search states
    #startIdx;
    #endIdx;
    #proxyArray = [] // cannot instantaneously modify array in which binary search is running, so need a proxy or fixed array
    
    constructor(arrayVis)
    {
        this.#arrayVis = arrayVis;
        this.#arraySize = arrayVis.size();

        for (let i = 0; i < this.#arraySize; ++i)
        {
            this.#originalArrayCopy[i] = this.#arrayVis.get(i).value;
        }
    }

    ////////////////////////////////////////////////////////////////////
    //////// public functions
    isDone()
    {
        return this.#done;
    }

    step()
    {
        if (this.#done) return;

        // in each step move first element from unsorted section to sorted section
        if (this.#sortedIdx < this.#arraySize)
        {
            let dataMoved = this.#arrayVis.get(this.#sortedIdx);
            let dataNewPosition = this.#binarySearch(dataMoved, this.#sortedIdx);
            dataMoved.color = "red";
            this.#arrayVis.move(dataMoved.id, dataNewPosition)
            this.#sortedIdx++;
        }
        else
        {
            this.#done = true;
            this.#printStats();
        }
    }

    detailedStep()
    // a more refined step, shows increments of linear search as well
    {
        if (this.#done) return;

        if (this.#sortedIdx < this.#arraySize)
        {
            if (this.#steppingSearch)
            // inserting unsorted data into sorted section
            {
                let searchResult = this.#stepSearch()
                if (searchResult != -1)
                // found target position in linear search
                {
                    this.#steppingSearch = false; // move to next sorted node
                    this.#sortedIdx++; // size of sorted section increase by 1

                    this.#dataBeingMoved.color = "red";
                    this.#arrayVis.move(this.#dataBeingMoved.id, searchResult)
                }
                else
                // still have not found position
                {
                    this.#arrayVis.move(this.#dataBeingMoved.id, this.#stepSearchCurrentIdx)
                }
            }
            else
            // selecting a new unsorted data
            {
                this.#steppingSearch = true;
                this.#dataBeingMoved = this.#arrayVis.get(this.#sortedIdx);
                this.#dataBeingMoved.color = "blue";
                this.#arrayVis.updateRendering(); // for the color change

                // configure search state
                this.#prepForNewSearch();
                this.#arrayVis.move(this.#dataBeingMoved.id, this.#stepSearchCurrentIdx)
            }
        }
        else
        {
            this.#done = true;
            this.#printStats();
        }

    }

    ////////////////////////////////////////////////////////////////////
    //////// private functions

    #prepForNewSearch()
    {
        this.#startIdx = 0;
        this.#endIdx = this.#sortedIdx;
        this.#stepSearchCurrentIdx = Math.floor((this.#startIdx + this.#endIdx) / 2);

        this.#proxyArray = []
        for (let i = 0; i <= this.#sortedIdx; ++i)
        {
            this.#proxyArray[i] = this.#arrayVis.get(i).value;
        }
    }

    // wrapper so we can choose the internal search algorithm
    #stepSearch()
    {
        this.#numComparisonsMade++; // each step is a comparison
        return this.#binarySearchStep();
    }

    #binarySearchStep()
    {
        
        if (this.#startIdx <= this.#endIdx)
        {
            let midValue =this.#proxyArray[this.#stepSearchCurrentIdx];
            if (midValue < this.#dataBeingMoved.value) {
                this.#endIdx = this.#stepSearchCurrentIdx - 1;
            }
            else if (this.#dataBeingMoved.value == midValue)
            {
                //console.log(`${this.#dataBeingMoved.value} == proxy[${this.#stepSearchCurrentIdx}]`)
                return this.#stepSearchCurrentIdx;
            }
            else 
            {
                this.#startIdx = this.#stepSearchCurrentIdx + 1;
            }
            this.#stepSearchCurrentIdx = Math.floor((this.#startIdx + this.#endIdx) / 2);
            
            return -1;
        }
        else
        {
            return this.#startIdx
        }
    }

    #binarySearch(data, endIdx)
    {
        let start = 0,
        end = endIdx;
        while (start <= end) {
            let mid = Math.floor((start + end) / 2),
            midValue = this.#arrayVis.get(mid).value;
            this.#numComparisonsMade++;
            if (midValue < data.value) {
                end = mid - 1;
            }
            else if (data.value == midValue)
            {
                return mid;
            }
            else 
            {
                start = mid + 1;
            }
        }
        return start;
    }

    #printStats()
    {
        let sortedSequence = []
        for (let i = 0; i < this.#arraySize; ++i)
        {
            sortedSequence[i] = this.#arrayVis.get(i).value;
        }
        console.log("Binary insertion sort original sequence: " + this.#originalArrayCopy);
        console.log("Binary insertion sort final sequence: " + sortedSequence);
        console.log("Number of comparisons: " + this.#numComparisonsMade)
    }
}