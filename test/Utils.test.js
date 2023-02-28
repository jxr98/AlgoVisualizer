import * as utils  from "../js/lib/Utils";

test('2D coordinate conversion', ()=>
{
    let xRange = 100,
    x_input = [0, 99],
    y_input = 20

    x_input.forEach(function(x_val)
    {
        expect(x_val).toBeLessThan(xRange)
        let id = utils.position2ID(x_val, y_input, xRange)
        let {x, y} = utils.ID2Position(id, xRange)
        expect(x).toBe(x_val)
        expect(y).toBe(y_input)
    })
})