import { useContext, useReducer, Dispatch } from "react";
import React from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { ElementTree } from "../types";
import { reducer, TreeState, getInitialState, TreeAction } from "../reducer";

export const TreeStateContext = React.createContext<TreeState>(null as any);
export const TreeDispatchContext = React.createContext<Dispatch<TreeAction>>(
  null as any
);

export function useTreeState() {
  return useContext(TreeStateContext);
}

export function useTreeDispatch() {
  return useContext(TreeDispatchContext);
}

export function TreeStateProvider(props: {
  initialTree: ElementTree;
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
