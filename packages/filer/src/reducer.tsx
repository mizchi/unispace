import { toInvertedTree, InvertedTree } from "./tree-api/inverted";
import { reducerWithoutInitialState } from "typescript-fsa-reducers";
import { ElementData, TreeNode, GridAreaData } from "./types";
import actionCreatorFactory from "typescript-fsa";
import * as invUtils from "./tree-api/inverted";
import * as treeUtils from "./tree-api";

// import { ulid } from "ulid";
import uniqueId from "lodash-es/uniqueId";

// treeUtils.setNodeWithCursor()
export type TreeState = {
  tree: TreeNode<ElementData>;
  inv: InvertedTree<ElementData>;
  selectedId: string | null;
};

export const getInitialState = (tree: TreeNode<ElementData>) => {
  return {
    tree: tree,
    inv: toInvertedTree(tree),
    selectedId: null,
  };
};

const actionCreator = actionCreatorFactory();

export const selectNode = actionCreator<string | null>("select-node");
export const addChild = actionCreator<{
  parentId: string;
  data: ElementData;
  children?: TreeNode<ElementData>[];
}>("add-child");

export const swapNodes = actionCreator<{ aid: string; bid: string }>(
  "swap-nodes"
);

export const moveNode = actionCreator<{
  targetId: string;
  newParentId: string;
  newIndex?: number;
}>("move-node");

export type TreeAction =
  | ReturnType<typeof selectNode>
  | ReturnType<typeof addChild>
  | ReturnType<typeof moveNode>
  | ReturnType<typeof swapNodes>;

export const reducer = reducerWithoutInitialState<TreeState>()
  .case(addChild, (state, payload) => {
    const newNode: TreeNode<ElementData> = {
      id: uniqueId(),
      data: payload.data,
      children: payload.children ?? [],
    };
    const newInv = invUtils.appendNode(state.inv, newNode, payload.parentId);
    return {
      ...state,
      inv: newInv,
      tree: invUtils.toNode(newInv),
    };
  })
  .case(swapNodes, (state, { aid, bid }) => {
    const newTree = treeUtils.swapNodes(state.tree, aid, bid);
    return {
      ...state,
      inv: toInvertedTree(newTree),
      tree: newTree,
    };
  })
  .case(moveNode, (state, { targetId, newParentId, newIndex }) => {
    const newInv = invUtils.moveNode(
      state.inv,
      targetId,
      newParentId,
      newIndex
    );
    return {
      ...state,
      inv: newInv,
      tree: invUtils.toNode(newInv),
    };
  })

  .case(selectNode, (state, payload) => {
    return {
      ...state,
      selectedId: payload,
    };
  });