
export const interval = 300; // controls simulation speed
let idCounter = 0; // IDs must be unique, thus we have a counter here to generate new 

export function onBlur(inputDOM, arrayVis, timeoutHandles, sortFactoryCallback)
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
            console.log(`${element} is not an integer`)
        }
    });
    if (error) return;

    // input is good, start simulation
    runSim(inputArr, arrayVis, timeoutHandles, sortFactoryCallback);
}

export function runSim(inputArray, arrayVis, timeoutHandles, sortFactoryCallback)
{
    // clear array model
    arrayVis.clear()

    // clear all timeouts from previous simulation
    timeoutHandles.forEach(timeoutID => {
        clearTimeout(timeoutID);
    });
    timeoutHandles = []

    let tick = 0;

    // insert array
    inputArray.forEach((ele) => {
        let num = parseInt(ele);
        let timeoutID = setTimeout(function(){
            arrayVis.insertRight({id: idCounter++, text: ele, value: num})
        }, tick)
        tick += interval;
        timeoutHandles.push(timeoutID)
    })

    // run sort
    let sortTimeoutID = setTimeout(function(){
        tick = 0;
        let sort = sortFactoryCallback()
        let numSteps = sort.maxDetailedSteps()
        for (let i = 0 ; i < numSteps; ++i)
        {
            let timeoutID = setTimeout(function(){sort.detailedStep()}, tick)
            tick+=interval;
            timeoutHandles.push(timeoutID)
        }

        // for (let i = 0 ; i < numSteps + 1; ++i)
        // {
        //     let timeoutID = setTimeout(function(){sort.step()}, tick)
        //     tick+=interval;
        //     timeoutHandles.push(timeoutID)
        // }

    }, tick)
    timeoutHandles.push(sortTimeoutID)
}