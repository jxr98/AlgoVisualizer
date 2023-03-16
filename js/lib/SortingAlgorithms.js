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
                this.#linearSearchCurrentIdx = 0;
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
            if (this.#arrayVis.get(this.#linearSearchCurrentIdx).value < this.#dataBeingMoved.value)
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