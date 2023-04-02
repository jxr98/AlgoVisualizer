import {arrayVis2Str} from "./sortTemplate.js"
import { TSort } from "./sortTemplate.js";
import {Logger} from "./Logger.js"

// insertion sort with binary search 
export class BinaryInsertionSort extends TSort
{
    #logger = null;

    // handle to array visualizer
    #arrayVis = null;

    // internal states
    #done = false;
    #sortedIdx = 0;
    #arraySize = 0;
    #numComparisonsMade = 0;
    #originalArrayStr = ""
    #dataBeingMoved = null

    // search states
    #stepSearchCurrentIdx = 0;
    #steppingSearch = false;

    // binary search states
    #startIdx;
    #endIdx;
    #proxyArray = [] // cannot instantaneously modify array in which binary search is running, so need a proxy or fixed array
    
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
    // a more refined step, shows increments of search as well
    {
        if (this.#done) return;

        if (this.#sortedIdx < this.#arraySize)
        {
            if (this.#steppingSearch)
            // inserting unsorted data into sorted section
            {
                let searchResult = this.#binarySearchStep();
                if (searchResult != -1)
                // found target position in binary search
                {
                    this.#steppingSearch = false; // move to next sorted node
                    this.#sortedIdx++; // size of sorted section increase by 1

                    this.#dataBeingMoved.color = "red";
                    this.#arrayVis.move(this.#dataBeingMoved.id, searchResult)
                    // console.log("final pos:  " + searchResult)
                }
                else
                // still have not found position
                {
                    this.#arrayVis.move(this.#dataBeingMoved.id, this.#stepSearchCurrentIdx)
                    // console.log("mid pos:  " + this.#stepSearchCurrentIdx)
                }
            }
            else
            // selecting a new unsorted data
            {
                this.#steppingSearch = true;
                this.#dataBeingMoved = this.#arrayVis.get(this.#sortedIdx);
                this.#dataBeingMoved.color = "blue";
                this.#arrayVis.updateRendering(); // for the color change

                // console.log("bin search on " + this.#dataBeingMoved.value)

                // configure search state
                this.#prepForNewSearch();
                // console.log("array:  " + this.#proxyArray)
                // this.#arrayVis.move(this.#dataBeingMoved.id, this.#stepSearchCurrentIdx)
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
        this.#endIdx = this.#sortedIdx-1;
         this.#stepSearchCurrentIdx = Math.max(Math.floor((this.#startIdx + this.#endIdx) / 2), 0);

        this.#proxyArray = []
        for (let i = 0; i <= this.#endIdx; ++i)
        {
            this.#proxyArray[i] = this.#arrayVis.get(i).value;
        }
    }

    #binarySearchStep()
    {
        this.#numComparisonsMade++
        if (this.#startIdx <= this.#endIdx)
        {
            this.#stepSearchCurrentIdx = Math.floor((this.#startIdx + this.#endIdx) / 2)
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
            
            
            return -1;
        }
        else
        {
            return this.#startIdx
        }
    }

    #binarySearch(data, endIdx)
    {
        let start = 0, end = endIdx;
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
        this.#logger.log("Binary insertion sort original sequence: " + this.#originalArrayStr);
        this.#logger.log("Binary insertion sort final sequence: " + arrayVis2Str(this.#arrayVis));
        this.#logger.log("Number of comparisons: " + this.#numComparisonsMade)
    }
}