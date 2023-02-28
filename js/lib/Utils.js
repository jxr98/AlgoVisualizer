// x should be less than xRange
// negative numbers not supported 
function position2ID(x, y, xRangeSize)
{
    return y * xRangeSize + x
}

// x should be less than xRange
// negative numbers not supported
function ID2Position(id, xRangeSize)
{
    let x = id % xRangeSize,
    y = (id - x) / xRangeSize
    return {x, y}
}

export {position2ID, ID2Position}