import {Logger} from "./Logger.js"
import {arrayVis2Str} from "./sortTemplate.js"
import { TSort } from "./sortTemplate.js";

export class MergeSort extends TSort
{
    #logger = null;

    // handle to array visualizer
    #arrayVis = null;

    // internal states
    #done = false;
    #arraySize = 0;
    #numComparisonsMade = 0;
    #numMovesMade = 0;
    #originalArrayStr = ""

    // sorted ranges
    #sortedRanges = []

    //  move animation stack
    #moves = []

    constructor(arrayVis, logger = null)
    {
        super();
        this.#arrayVis = arrayVis;
        this.#arraySize = arrayVis.size();
        this.#originalArrayStr = arrayVis2Str(this.#arrayVis)
        this.#logger = logger == null ? new Logger() : logger;

        // set up divided ranges
        for (let i = 0; i < arrayVis.size(); ++i)
        {
            this.#sortedRanges.push({low:i, high:i})
        }
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

    detailedStep()
    {
        if (this.#done) return; // sorting completed from prev step

        if(this.#moves.length > 0)
        // animate a single move from the partion move stack
        {
            let move = this.#moves.shift(),
            nodeID = move.id,
            position = move.position
            this.#arrayVis.move(nodeID, position)
            this.#numMovesMade++

            // mark moved item with red to indicate sorted
            let idx = this.#arrayVis.findDataIdxByID(nodeID);
            this.#arrayVis.get(idx).color = "red"
            this.#arrayVis.updateRendering();
            return;
        }

        if (this.#sortedRanges.length === 1)
         // just finished sorting
        {
            this.#done = true;
            this.#printStats();
            
            return;
        }
        
        // compute more moves by picking two sorted ranges to merge and record all the re-arragements
        let range1 = this.#sortedRanges.shift(),
        range2 = this.#sortedRanges.shift(),
        idx1 = range1.low,
        idx2 = range2.low,
        mergedIdx = range1.low

        // the two ranges are not contiguous, push range1 to the back and re-insert range2 to front
        if (range1.high > range2.low)
        {
            this.#sortedRanges.push(range1);
            this.#sortedRanges.unshift(range2);
            return;
        }

        // merge into new sorted range
        while (idx1 <= range1.high || idx2 <= range2.high)
        {
            if (idx2 > range2.high || (idx1 <= range1.high && this.#getValue(idx1) >= this.#getValue(idx2))) 
            {
                this.#moves.push({
                        id:this.#getID(idx1),
                        position: mergedIdx
                    })
                idx1++;
            }
            else if (idx1 > range1.high || (idx2 <= range2.high && this.#getValue(idx2) >= this.#getValue(idx1)))
            {
                this.#moves.push({
                    id:this.#getID(idx2),
                    position: mergedIdx
                })
                idx2++;
            }
            mergedIdx++;
        }
        this.#sortedRanges.push({low:range1.low, high:range2.high})

        // mark all items in moves array with blue to indicate sorting
        let self = this;
        this.#moves.forEach(function(val)
        {
            let idx = self.#arrayVis.findDataIdxByID(val.id);
            if (idx != -1)
            {
                self.#arrayVis.get(idx).color = "blue"
            }
        })
        this.#arrayVis.updateRendering();
    }

    ////////////////////////////////////////////////////////////////////
    //////// private functions

    #getValue(idx)
    {
        return this.#arrayVis.get(idx).value
    }
    #getID(idx)
    {
        return this.#arrayVis.get(idx).id
    }

    #printStats()
    {
        this.#logger.log("Merge sort original sequence: " + this.#originalArrayStr)
        this.#logger.log("Merge sort final sequence: " + arrayVis2Str(this.#arrayVis))
        this.#logger.log("Number of comparisons: " + this.#numComparisonsMade)
        this.#logger.log("Number of moves: " + this.#numMovesMade)
    }
}