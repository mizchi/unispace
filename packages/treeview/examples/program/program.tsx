import { DraggableTree } from "../../src";
import React from "react";
import ReactDOM from "react-dom";

import * as treeUtils from "@mizchi/tree-utils/inverted";
import { Node } from "@mizchi/tree-utils";

const genId = () => Date.now().toString() + "-" + Math.random().toString();

type NodeType = "command" | "if" | "loop" | "blank" | "root" | "loopEnd";

type Data = {
  nodeType: NodeType;
  displayName: string;
};

type Tree = Node<Data>;
type InvertedTree = treeUtils.InvertedTree<Data>;

function createBlank(): Tree {
  return {
    id: genId(),
    data: { nodeType: "blank", displayName: "..." },
    children: []
  };
}

function createLoop(children: Tree[] = []): Tree {
  return {
    id: genId(),
    data: { nodeType: "loop", displayName: "loop" },
    children: [...children, createBlank()]
  };
}

const initialTree: Tree = {
  id: "root",
  data: { nodeType: "root", displayName: "<root>" },
  children: [
    createLoop(),
    createLoop([
      {
        id: genId(),
        data: { nodeType: "command", displayName: "print" },
        children: []
      },
      {
        id: genId(),
        data: { nodeType: "loopEnd", displayName: "loopEnd" },
        children: []
      }
    ]),
    {
      id: genId(),
      data: { nodeType: "command", displayName: "print" },
      children: []
    },
    createBlank()
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
        canDragItem={id => {
          const data = treeUtils.getData(inv, id);
          return data.nodeType !== "blank";
        }}
        canDropOnItem={id => {
          const data = treeUtils.getData(inv, id);
          return data.nodeType !== "blank";
        }}
        onItemDrop={(dragSourceId: string, dropTargetId: string) => {
          const fromParentId = inv.parentMap[dragSourceId];
          const toParentId = inv.parentMap[dropTargetId];
          // swap as sibling
          if (fromParentId === toParentId) {
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
            if (dropTargetId === fromParentId) {
              console.log("do nothing");
              return;
            }
            console.log("drop", dropTargetId);
            const children = inv.childrenMap[dropTargetId];
            const lastNode = treeUtils.getData(
              inv,
              children[children.length - 1]
            );

            const insertAt =
              lastNode.nodeType === "blank" ? children.length - 1 : null;

            const newInv = treeUtils.moveNode(
              inv,
              dragSourceId,
              dropTargetId,
              insertAt
            );
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
            <div style={{ paddingLeft: `${item.depth}em` }}>
              {data.displayName}
            </div>
          );
        }}
      />
    );
  }
}

ReactDOM.render(<App />, document.querySelector(".root"));
