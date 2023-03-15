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
            
            // print some stats
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

    ////////////////////////////////////////////////////////////////////
    //////// private functions

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
}