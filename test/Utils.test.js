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

test('isNumeric test', ()=>{
    expect(utils.isNumeric(1)).toBe(true);
    expect(utils.isNumeric(0)).toBe(true);
    expect(utils.isNumeric(-100)).toBe(true);
    expect(utils.isNumeric(-100.)).toBe(true); // implicit conversion from -100. to -100
    expect(utils.isNumeric("-100")).toBe(true);
    expect(utils.isNumeric(0.2)).toBe(false);
    expect(utils.isNumeric("-100.")).toBe(false);
    expect(utils.isNumeric("-100.3")).toBe(false);
    expect(utils.isNumeric("x")).toBe(false);
})

test('isNullOrEmptyStr test', ()=>{
    expect(utils.isNullOrEmptyStr(null)).toBe(true);
    expect(utils.isNullOrEmptyStr("")).toBe(true);
    expect(utils.isNullOrEmptyStr("x")).toBe(false);
})

test('getValueFromCookie test', ()=>{
    expect(utils.getValueFromCookie("")).toBe("");


    document.cookie = "cname= 1; hello=2"
    expect(utils.getValueFromCookie("cname")).toBe("1");
    document.cookie = " hello=2"
    expect(utils.getValueFromCookie("hello")).toBe("2");
})
