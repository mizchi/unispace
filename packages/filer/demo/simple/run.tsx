import { DraggableTree } from "../../src";
import React, { useState } from "react";
import ReactDOM from "react-dom";

import * as treeUtils from "@mizchi/tree-utils/inverted";
import { Node as TreeNode } from "@mizchi/tree-utils";

type Payload = {
  value: string;
};

type Tree = TreeNode<Payload>;
type InvertedTree = treeUtils.InvertedTree<Payload>;

const initialTree: Tree = {
  id: "root",
  data: { value: "root" },
  children: [
    {
      id: "a",
      data: { value: "aaa" },
      children: [
        {
          id: "b",
          data: { value: "bbb" },
          children: [],
        },
      ],
    },
    { id: "c", data: { value: "ccc" }, children: [] },
  ],
};

function App() {
  const [state, setState] = useState({
    tree: initialTree,
    inv: treeUtils.toInvertedTree(initialTree),
  });
  return (
    <DraggableTree
      tree={state.tree}
      onItemDrop={(dragSourceId: string, dropTargetId: string) => {
        const fromParentId = state.inv.parentMap[dragSourceId];
        const toParentId = state.inv.parentMap[dropTargetId];

        // swap as sibling
        if (fromParentId === toParentId) {
          // todo
          const newInv = treeUtils.swapNodesInSiblings(
            state.inv,
            fromParentId as string,
            dragSourceId,
            dropTargetId
          );
          const newTree = treeUtils.toNode(newInv);
          setState({
            inv: newInv,
            tree: newTree,
          });
        } else {
          const newInv = treeUtils.moveNode(
            state.inv,
            dragSourceId,
            dropTargetId
          );
          const newTree = treeUtils.toNode(newInv);
          setState({
            inv: newInv,
            tree: newTree,
          });
        }
      }}
      renderItem={(item) => {
        const data = treeUtils.getData(state.inv, item.id) as any;
        return (
          <div style={{ paddingLeft: `${item.depth}em` }}>{data.value}</div>
        );
      }}
    />
  );
}

ReactDOM.render(<App />, document.querySelector(".root"));
