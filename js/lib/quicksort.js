import {Logger} from "./Logger.js"
import {arrayVis2Str} from "./sortTemplate.js"
import { TSort } from "./sortTemplate.js";

export class Quicksort extends TSort
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

    // handle to current pivot data
    #pivot = null

    // a stack consisting of ranges of elements that needs partitioning
    #partionStack = [];

    // partion move animation stack
    #partionMoves = []

    constructor(arrayVis, logger = null)
    {
        super();
        this.#arrayVis = arrayVis;
        this.#arraySize = arrayVis.size();
        this.#originalArrayStr = arrayVis2Str(this.#arrayVis)

        // init the partion stack
        this.#partionStack.push({low:0, high:arrayVis.size() - 1})

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
        this.detailedStep();
    }

    detailedStep()
    {
        if (this.#done) return; // sorting completed from prev step
        
        if (this.#partionStack.length == 0)
        // just finished sorting
        {
            if (this.#pivot != null)
            // change color for last pivot partioning
            {
                this.#pivot.color = "red";
                this.#arrayVis.updateRendering(); // for the color change)
            }
            this.#done = true;
            this.#printStats();
            return;
        }

        if(this.#partionMoves.length > 0)
        {
            // animate a single move from the partion move stack
            let move = this.#partionMoves.shift(),
            nodeID = move.id,
            moveAfterPivot = move.move === "afterPivot"
            let pivotIdx = this.#arrayVis.findDataIdxByID(this.#pivot.id);
            if (moveAfterPivot)
            {
                this.#arrayVis.move(nodeID, pivotIdx)
            }
            else
            {
                this.#arrayVis.move(nodeID, Math.max(0, pivotIdx-1))
            }
            this.#numMovesMade++
        }
        else
        {
            if (this.#pivot != null)
            {
                this.#pivot.color = "red";
                this.#arrayVis.updateRendering(); // for the color change)
            }

            // grab new partion problem from stack & select pivot
            let newPartitionRange = this.#partionStack.pop()
            let pivotIdx = this.#selectPivot(newPartitionRange.low, newPartitionRange.high);
            this.#pivot = this.#arrayVis.get(pivotIdx);
            this.#pivot.color = "blue";
            this.#arrayVis.updateRendering(); // for the color change

            // solve the partioning problem locally, cache all the moves needed and place the moves in a stack
            let newPivotPos = pivotIdx;
            for (let i = newPartitionRange.low; i <= newPartitionRange.high; ++i)
            {
                if (i == pivotIdx) continue;
                
                this.#numComparisonsMade++;

                let data = this.#arrayVis.get(i);
                if (data.value < this.#pivot.value && i < pivotIdx)
                {
                    this.#partionMoves.push({id:data.id, move:"afterPivot"});
                    newPivotPos--;
                }
                else if (data.value > this.#pivot.value && i > pivotIdx)
                {
                    this.#partionMoves.push({id:data.id, move:"beforePivot"});
                    newPivotPos++;
                }
            }

            // push sub partitioning problems in partion stack
            if (newPivotPos - 1 >= newPartitionRange.low)
            {
                this.#partionStack.push({low: newPartitionRange.low, high: newPivotPos - 1});
            }
            if (newPivotPos + 1 <= newPartitionRange.high)
            {
                this.#partionStack.push({low: newPivotPos + 1, high: newPartitionRange.high});
            }
        }
    }

    ////////////////////////////////////////////////////////////////////
    //////// private functions

    #selectPivot(lowIdx, highIdx)
    {
        return highIdx;
    }

    #printStats()
    {
        this.#logger.log("Quick sort original sequence: " + this.#originalArrayStr)
        this.#logger.log("Quick sort final sequence: " + arrayVis2Str(this.#arrayVis))
        this.#logger.log("Number of comparisons: " + this.#numComparisonsMade)
        this.#logger.log("Number of moves: " + this.#numMovesMade)
    }
}