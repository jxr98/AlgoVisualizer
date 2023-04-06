import * as utils from "./Utils.js"

export function readInputsFromTwoVertexInputModule()
{
    // see html/includings/twoVertexInput.html
    let srcNode = document.getElementById("srcNode").value,
    dstNode = document.getElementById("dstNode").value
    return [srcNode, dstNode];
}
export function checkInputsFromTwoVertexInputModule()
{
    // see html/includings/twoVertexInput.html
    let srcNode = document.getElementById("srcNode"),
    dstNode = document.getElementById("dstNode"),
    srcNodeFeedback = document.getElementById("srcNodeFeedback"),
    dstNodeFeedback = document.getElementById("dstNodeFeedback"),
    error = false

    if (utils.isNullOrEmptyStr(srcNode.value))
    {
        error = true;
        srcNodeFeedback.innerHTML = "Empty input(s)"
        srcNode.classList.add("is-invalid");
    }
    else
    {
        srcNode.classList.remove("is-invalid");
    }

    if ( utils.isNullOrEmptyStr(dstNode.value))
    {
        error = true;
        dstNodeFeedback.innerHTML = "Empty input(s)"
        dstNode.classList.add("is-invalid");
    }
    else
    {
        dstNode.classList.remove("is-invalid");
    }
    return !error;
}