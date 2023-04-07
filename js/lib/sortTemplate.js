export function arrayVis2Str(arrayVis)
{
    if (arrayVis == null) return "";
    let array = []
    for (let i = 0; i < arrayVis.size(); ++i)
    {
        array[i] = arrayVis.get(i).value;
    }
    return array.toString();
}

export class TSort
{
    constructor() {}

    maxDetailedSteps(){console.error("not implemented")}
    isDone(){console.error("not implemented")}
    detailedStep(){console.error("not implemented")}
    
    /* istanbul ignore next */
    #printStats(){}
}