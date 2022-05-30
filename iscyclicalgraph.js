// to check code coverage, use isCyclicalGraph.html and coverage tool of Chrome

let getAllNodesArrangedFromFrontToBack;
let getNodesTakingInputFrom;

/**
 * @param getAllNodesArrangedFromFrontToBackFn must return a set
 * @param getNodesTakingInputFromFn must return a set
 */
export function setIsCyclicalGraphConfig(
  getAllNodesArrangedFromFrontToBackFn,
  getNodesTakingInputFromFn
) {
  getAllNodesArrangedFromFrontToBack = getAllNodesArrangedFromFrontToBackFn;
  getNodesTakingInputFrom = getNodesTakingInputFromFn;
}

export function isCyclicalGraph(graph) {
  let nodes = getAllNodesArrangedFromFrontToBack(graph);
  const nodesConfirmedToBeACyclic = new Set();
  for (const node of nodes) {
    if (isCyclicalNode(node, nodesConfirmedToBeACyclic)) {
      return true;
    }
    nodesConfirmedToBeACyclic.add(node);
  }
  return false;
}

function isCyclicalNode(node, nodesConfirmedToBeACyclic) {
  const encounteredNodes = new Set();
  let nodes = [node];
  while (nodes.length > 0) {
    const nextNodes = [];
    for (const nodeToCheck of nodes) {
      if (nodesConfirmedToBeACyclic.has(nodeToCheck)) {
        // If we encounter a node confirmed to be acyclic while always searching
        // in the forward direction,then it is guaranteed that neither the
        // acyclic node nor any of its forward nodes will be the marked node.
        continue;
      }
      const origSize = encounteredNodes.size;
      encounteredNodes.add(nodeToCheck);
      if (origSize === encounteredNodes.size) {
        continue;
      }
      const forwardNodes = getNodesTakingInputFrom(nodeToCheck);
      if (forwardNodes.has(node)) {
        return true;
      }
      for (const forwardNode of forwardNodes) {
        nextNodes.push(forwardNode);
      }
    }
    nodes = nextNodes;
  }
  return false;
}
