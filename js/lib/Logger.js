
// Logger has two modes
// First mode is output to console log if not given a textarea
// Second mode is to output to a given textarea
// Has the option to mute entirely
class Logger
{
    #textAreaHandle = null;
    #mute = false;

    constructor(textArea = null)
    {
        this.#textAreaHandle = textArea
        if (this.#textAreaHandle != null)
        {
            textArea.text("// Logger attached")    
        }
    }

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

    log(str)
    {
        if (this.#mute === true) return

        if (this.#textAreaHandle == null)
        {
            console.log("Logger: " + str)
        } 
        else
        {
            this.appendToTextArea(str)
        }
    }

    appendToTextArea(str)
    {
        if (this.#textAreaHandle == null) return
        this.#textAreaHandle.text(this.#textAreaHandle.text() + "\n" + str)

        // scroll to bottom to show new texts
        this.#textAreaHandle.property("scrollTop", this.#textAreaHandle.property("scrollHeight"))
    }

}

function redirectConsoleOutput(textarea)
{   
    if(!textarea) return;
    const console_log = window.console.log;
    window.console.log = function(...args){
        console_log(...args);
        args.forEach(function (arg){
            textarea.text(textarea.text() + "\n" + arg)
            //arg=>textarea.text() += `${JSON.stringify(arg)}\n`)
        })
        // scroll to bottom to show new texts
        textarea.property("scrollTop", textarea.property("scrollHeight"))
    }
}

export {Logger, redirectConsoleOutput}