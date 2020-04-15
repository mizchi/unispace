import { DraggableTree } from "../../src";
import React from "react";
import ReactDOM from "react-dom";

import * as treeUtils from "@mizchi/tree-utils/inverted";
import { Node } from "@mizchi/tree-utils";

type Payload = {
  value: string;
};

type Tree = Node<Payload>;
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
          children: []
        }
      ]
    },
    { id: "c", data: { value: "ccc" }, children: [] }
  ]
};

class App extends React.Component<{}, { tree: Tree; inv: InvertedTree }> {
  state = {
    tree: initialTree,
    inv: treeUtils.toInvertedTree(initialTree)
  };
  render() {
    const { inv } = this.state;
    return (
      <DraggableTree
        tree={this.state.tree}
        onItemDrop={(dragSourceId: string, dropTargetId: string) => {
          const fromParentId = inv.parentMap[dragSourceId];
          const toParentId = inv.parentMap[dropTargetId];

          // swap as sibling
          if (fromParentId === toParentId) {
            // todo
            const newInv = treeUtils.swapNodesInSiblings(
              inv,
              fromParentId as string,
              dragSourceId,
              dropTargetId
            );
            const newTree = treeUtils.toNode(newInv);
            this.setState({
              inv: newInv,
              tree: newTree
            });
          } else {
            const newInv = treeUtils.moveNode(inv, dragSourceId, dropTargetId);
            const newTree = treeUtils.toNode(newInv);
            this.setState({
              inv: newInv,
              tree: newTree
            });
          }
        }}
        renderItem={item => {
          const data = treeUtils.getData(inv, item.id);
          return (
            <div style={{ paddingLeft: `${item.depth}em` }}>{data.value}</div>
          );
        }}
      />
    );
  }
}

ReactDOM.render(<App />, document.querySelector(".root"));
