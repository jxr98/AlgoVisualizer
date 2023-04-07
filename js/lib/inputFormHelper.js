import * as utils from "./Utils.js"

/* istanbul ignore next */
export function readInputsFromTwoVertexInputModule()
{
    // see html/includings/twoVertexInput.html
    let srcNode = document.getElementById("srcNode").value,
    dstNode = document.getElementById("dstNode").value
    return [srcNode, dstNode];
}

/* istanbul ignore next */
export function checkTwoVertexInputIsValidGraphNodes(graph)
{
    // see html/includings/twoVertexInput.html
    let srcNode = document.getElementById("srcNode"),
    dstNode = document.getElementById("dstNode"),
    srcNodeFeedback = document.getElementById("srcNodeFeedback"),
    dstNodeFeedback = document.getElementById("dstNodeFeedback"),
    srcNodeError = false,
    dstNodeError = false

    

    // check src node
    if (utils.isNullOrEmptyStr(srcNode.value))
    {
        srcNodeError = true;
        srcNodeFeedback.innerHTML = "Empty input"
        srcNode.classList.add("is-invalid");
    }
    else if (!graph.isNodeValid(parseInt(srcNode.value)) || graph.isNodeDeleted(parseInt(srcNode.value)))
    {
        srcNodeError = true;
        srcNodeFeedback.innerHTML = "Node not available"
        srcNode.classList.add("is-invalid");
    }
    else
    {
        srcNode.classList.remove("is-invalid");
    }

    // check dst node
    if ( utils.isNullOrEmptyStr(dstNode.value))
    {
        dstNodeError = true;
        dstNodeFeedback.innerHTML = "Empty input"
        dstNode.classList.add("is-invalid");
    }
    else if (!graph.isNodeValid(parseInt(dstNode.value)) || graph.isNodeDeleted(parseInt(dstNode.value)))
    {
        dstNodeError = true;
        dstNodeFeedback.innerHTML = "Node not available"
        dstNode.classList.add("is-invalid");
    }
    else
    {
        dstNode.classList.remove("is-invalid");
    }

    return !(srcNodeError || dstNodeError);
}