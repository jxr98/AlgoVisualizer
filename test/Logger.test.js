import {Logger, redirectConsoleOutput}  from "../js/lib/Logger";
import {expect, jest} from '@jest/globals';
import * as d3 from "../js/thirdParty/d3.js";

test('logger not binded to text area, logs go to console', ()=>
{
    let logger = new Logger()
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.log(1)
    expect(consoleSpy).toHaveBeenCalledWith('Logger: 1');
    consoleSpy.mockRestore();
})

test('logger not binded to text area, muted console', ()=>
{
    let logger = new Logger()
    logger.mute(true)
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.log(1)
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    consoleSpy.mockRestore();
})

test('logger binded to text area, logs only goes to textarea', ()=>
{
    let textArea = d3.select("body").append("textarea")
    let logger = new Logger(textArea)
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.log(1)
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    expect(textArea.text()).toBe("// Logger attached\n1");
    consoleSpy.mockRestore();
})

test('logger binded to text area, muted then unmuted', ()=>
{
    let textArea = d3.select("body").append("textarea")
    let logger = new Logger(textArea)
    logger.mute(true)
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.log(1)
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    expect(textArea.text()).toBe("// Logger attached");
    logger.mute(false)
    logger.log(1)
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    expect(textArea.text()).toBe("// Logger attached\n1");
    consoleSpy.mockRestore();
})

test('redirect console log', ()=>
{
    let textArea = d3.select("body").append("textarea")
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    redirectConsoleOutput(textArea)
    expect(textArea.text()).toBe("// Mirrored logs:");
    console.log(32)
    expect(consoleSpy).toHaveBeenCalledWith(32);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(textArea.text()).toBe("// Mirrored logs:\n32");

    consoleSpy.mockRestore();
})

test('redirect console error', ()=>
{
    let textArea = d3.select("body").append("textarea")
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    redirectConsoleOutput(textArea)
    expect(textArea.text()).toBe("// Mirrored logs:");
    console.error(32)
    expect(consoleSpy).toHaveBeenCalledWith(32);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(textArea.text()).toBe("// Mirrored logs:\nERROR: 32");

    consoleSpy.mockRestore();
})

test('redirect console not binded', ()=>
{
    let textArea = d3.select("body").append("textarea")
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    redirectConsoleOutput()
    expect(textArea.text()).toBe("");
    console.error(32)
    expect(consoleSpy).toHaveBeenCalledWith(32);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(textArea.text()).toBe("");

    consoleSpy.mockRestore();
})