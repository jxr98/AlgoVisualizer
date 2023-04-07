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

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

function getValueFromCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function isNullOrEmptyStr(str)
{
    return str == null || str == "";
}

export function manhattanDistance(x1,y1,x2,y2)
{
    return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

export {position2ID, ID2Position, isNumeric,getValueFromCookie}

