import { useContext, useReducer, Dispatch } from "react";
import React from "react";
import { toInvertedTree, InvertedTree } from "@mizchi/tree-utils/inverted";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { ElementData, TreeNode } from "./types";
import { reducer, TreeState, getInitialState } from "./reducer";

export const TreeStateContext = React.createContext<TreeState>(null as any);
export const TreeDispatchContext = React.createContext<Dispatch<any>>(
  null as any
);

export function useTreeState() {
  return useContext(TreeStateContext);
}

export function useTreeDispatch() {
  return useContext(TreeDispatchContext);
}

export function TreeStateProvider(props: {
  initialTree: TreeNode<ElementData>;
  children: any;
}) {
  const initialState = getInitialState(props.initialTree);
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DndProvider backend={Backend}>
      <TreeStateContext.Provider value={state}>
        <TreeDispatchContext.Provider value={dispatch}>
          {props.children}
        </TreeDispatchContext.Provider>
      </TreeStateContext.Provider>
    </DndProvider>
  );
}
