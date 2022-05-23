// to check code coverage, use isCyclicalGraph.html and coverage tool of Chrome

import { assert } from "https://asserta19.github.io/assert/assert.js";

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

function unitTest() {
  console.log("unitTest(): Entry");
  /*
      Simple graph as follows:
      4->2->1
      |__3_|
  */
  const configFn1 = /* getAllNodesArrangedFromFrontToBackFn = */ () =>
    new Set([1, 2, 3, 4]);
  const configFn2 = /* getNodesTakingInputFromFn = */ (node) => {
    assert([1, 2, 3, 4].includes(node));
    switch (node) {
      case 1:
        return new Set();
      case 2:
        return new Set([1]);
      case 3:
        return new Set([1]);
      case 4:
        return new Set([2, 3]);
    }
  };
  setIsCyclicalGraphConfig(configFn1, configFn2);
  assert(!isCyclicalGraph());

  setIsCyclicalGraphConfig(
    // test a different coverage, note that ordering of
    // getAllNodesArrangedFromFrontToBackFn is not expected to be guaranteed:
    () => new Set([4, 2, 3, 1]),
    configFn2
  );
  assert(!isCyclicalGraph());

  setIsCyclicalGraphConfig(
    /* getAllNodesArrangedFromFrontToBackFn = */ () => new Set([1]),
    /* getNodesTakingInputFromFn = */ (node) => {
      assert([1].includes(node));
      return new Set([1]);
    }
  );
  assert(isCyclicalGraph());

  /*
      Simple graph as follows:
      4->2->1┓
      └--3<---
     */
  const configFn3 = /* getNodesTakingInputFromFn = */ (node) => {
    assert([1, 2, 3, 4].includes(node));
    switch (node) {
      case 1:
        return new Set([3]);
      case 2:
        return new Set([1]);
      case 3:
        return new Set([4]);
      case 4:
        return new Set([2]);
    }
  };
  setIsCyclicalGraphConfig(configFn1, configFn3);
  assert(isCyclicalGraph());
}

if (window["runIsCyclicalGraphUnitTest"]) {
  unitTest();
  console.log("Ran unit test successfully.");
}
