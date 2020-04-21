import { toInvertedTree, InvertedTree } from "@mizchi/tree-utils/inverted";
import { ElementData, TreeNode } from "./types";

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

export function reducer(state: TreeState, action: any): TreeState {
  return state;
}
