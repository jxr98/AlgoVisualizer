import {Logger} from "./Logger.js"
import {arrayVis2Str} from "./sortTemplate.js"
import { TSort } from "./sortTemplate.js";

// In insertion sort, the array to be sorted is divided into two sub-arrays
// we start with first element of the array as the sorted array and the rest of the array
// as un-sorted array. We incrementally move elements from un-sorted section to sorted section via linear search.
// The array is sorted when the un-sorted section is empty
export class InsertionSort extends TSort
{
    // handle to array visualizer
    #arrayVis = null;

    // internal states
    #done = false;
    #sortedIdx = 0;
    #arraySize = 0;
    #numComparisonsMade = 0;
    #originalArrayStr = ""
    #steppingLinearSearch = false;
    #dataBeingMoved = null
    #numMovesMade = 0

    // linear search states
    #linearSearchCurrentIdx = 0;
    #searchArray = []

    #logger = null;
    
    constructor(arrayVis, logger = null)
    {
        super();
        this.#arrayVis = arrayVis;
        this.#arraySize = arrayVis.size();
        this.#originalArrayStr = arrayVis2Str(this.#arrayVis)

        this.#logger = logger == null ? new Logger() : logger;
    }

    ////////////////////////////////////////////////////////////////////
    //////// public functions

    maxDetailedSteps()
    {
        let n = this.#arraySize + 1;
        return n * n;
    }

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
            this.#numMovesMade++
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
                    this.#numMovesMade++
                }
                else
                // still have not found position
                {
                    this.#arrayVis.move(this.#dataBeingMoved.id, this.#linearSearchCurrentIdx)
                    this.#numMovesMade++
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
                this.#numMovesMade++
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
            if (this.#searchArray[this.#linearSearchCurrentIdx] <= this.#dataBeingMoved.value)
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
            if (this.#arrayVis.get(i).value <= data.value) return i;
        }
        return endIdx;
    }

    #printStats()
    {
        this.#logger.log("Insertion sort original sequence: " + this.#originalArrayStr)
        this.#logger.log("Insertion sort final sequence: " + arrayVis2Str(this.#arrayVis))
        this.#logger.log("Number of comparisons: " + this.#numComparisonsMade)
        this.#logger.log("Number of moves: " + this.#numMovesMade)

        
        // console.log("Insertion sort original sequence: " + this.#originalArrayStr);
        // console.log("Insertion sort final sequence: " + arrayVis2Str(this.#arrayVis));
        // console.log("Number of comparisons: " + this.#numComparisonsMade)
    }
}