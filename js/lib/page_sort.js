let idCounter = 0; // IDs must be unique, thus we have a counter here to generate new 

export function onBlur(inputDOM)
{
    
    let input = inputDOM.node().value == "" ? inputDOM.attr("placeholder") : inputDOM.node().value;
    let inputArr = input.split(",").map(item => item.trim());

    // input validation
    let error = false;
    inputArr.forEach(element => {
        let isnum = /^-?\d+$/.test(element); // regex tester
        if (!isnum)
        {
            error = true;
        }
    });

    inputDOM.classed("is-invalid", error);
    if (error) return [];
    return inputArr;
}

export function runSim(inputArray, arrayVis, timeoutHandles, sortFactoryCallback, interval)
{
    // clear array model
    arrayVis.clear()

    // clear all timeouts from previous simulation
    timeoutHandles.forEach(timeoutID => {
        clearTimeout(timeoutID);
    });
    timeoutHandles.splice(0,timeoutHandles.length)

    let tick = 0;

    // insert array
    inputArray.forEach((ele) => {
        let num = parseInt(ele);
        /* istanbul ignore next */
        let timeoutID = setTimeout(function(){
            arrayVis.insertRight({id: idCounter++, text: ele, value: num})
        }, tick)
        tick += interval.getDelay();
        timeoutHandles.push(timeoutID)
        
    })

    // run sort
    /* istanbul ignore next */
    let sortTimeoutID = setTimeout(function(){
        tick = 0;
        let sort = sortFactoryCallback()
        let numSteps = sort.maxDetailedSteps()
        for (let i = 0 ; i < numSteps; ++i)
        {
            let timeoutID = setTimeout(function(){sort.detailedStep()}, tick)
            tick+=interval.getDelay();
            timeoutHandles.push(timeoutID)
        }
    }, tick)
    timeoutHandles.push(sortTimeoutID)
}