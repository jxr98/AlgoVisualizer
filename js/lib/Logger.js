class Logger
{
    #textAreaHandle = null;
    #mute = false;

    // if textArea is not given, output to standard console output with prefix
    constructor(textArea = null)
    {
        this.#textAreaHandle = textArea
        if (this.#textAreaHandle != null)
        {
            textArea.text("// Logs:")    
        }
    }

    // surpress/allow messages to go through
    mute(bool)
    {
        if (bool === true)
        {
            this.#mute = bool
        } 
        else
        {
            this.#mute = false
        }
    }

    // main API to log something
    log(str)
    {
        if (this.#mute === true) return

        if (this.#textAreaHandle == null)
        {
            console.log("Logger: " + str)
        } 
        else
        {
            this.#appendToTextArea(str)
        }
    }

    #appendToTextArea(str)
    {
        this.#textAreaHandle.text(this.#textAreaHandle.text() + "\n" + str)

        // scroll to bottom to show new texts
        this.#textAreaHandle.property("scrollTop", this.#textAreaHandle.property("scrollHeight"))
    }

}

// mirrors console.log to given textarea
// NOTE: this applies to ALL console.log, if you want more control/selectivity, use the Logger
function redirectConsoleOutput(textarea)
{   
    if(!textarea) return;
    const console_log = window.console.log;
    window.console.log = function(...args){
        console_log(...args);
        args.forEach(function (arg){
            // textarea.text(textarea.text() + "\n" + `${JSON.stringify(arg)}`)
            textarea.text(textarea.text() + "\n" + arg)
        })
        // scroll to bottom to show new texts
        textarea.property("scrollTop", textarea.property("scrollHeight"))
    }

    const console_error = window.console.error;
    window.console.error = function(...args){
        console_error(...args);
        args.forEach(function (arg){
            // textarea.text(textarea.text() + "\n" + `${JSON.stringify(arg)}`)
            // TODO: can we make error msg red color
            textarea.text(textarea.text() + "\nERROR: " + arg)
        })
        // scroll to bottom to show new texts
        textarea.property("scrollTop", textarea.property("scrollHeight"))
    }

    // messages to indicate attachement
    if (textarea.text() == "") textarea.text("// Logs:");

}

export {Logger, redirectConsoleOutput}