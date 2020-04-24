import React, { useState, useContext, useCallback } from "react";
import ReactDOM from "react-dom";
import { Pane, Flex } from "./components/elements";
import { ElementSource } from "./types";
import { sampleTree, rootTree, flexTree, ELEMENT_SOURCES } from "./mock";
import {
  useTreeState,
  TreeStateProvider,
  useTreeDispatch,
} from "./contexts/tree";
import { SourceList } from "./components/SourceList";
import { EditableView } from "./components/EditableView";
import { View } from "./components/View";
import { selectEditMode, TreeEditMode } from "./reducer";

function EditableRootTree() {
  const { tree } = useTreeState();
  return <EditableView tree={tree} depth={0} />;
}

function PreviewRootTree() {
  const { tree } = useTreeState();
  return <View tree={tree} />;
}

function OutputTree() {
  const { tree } = useTreeState();
  return (
    <Pane minHeight={0} height="80vh" overflow="auto">
      <pre>{JSON.stringify(tree, null, 2)}</pre>
    </Pane>
  );
}

const buttons = [
  {
    editMode: TreeEditMode.ELEMENT,
  },
  {
    editMode: TreeEditMode.LAYOUT,
  },
  {
    editMode: TreeEditMode.PREVIEW,
  },
  {
    editMode: TreeEditMode.OUTPUT,
  },
];

function EditModeButtonGroup() {
  const { editMode } = useTreeState();
  const dispatch = useTreeDispatch();

  return (
    <Pane>
      {buttons.map((b) => {
        return (
          <button
            key={b.editMode}
            disabled={editMode === b.editMode}
            onClick={() => dispatch(selectEditMode(b.editMode))}
          >
            {TreeEditMode[b.editMode]}
          </button>
        );
      })}
    </Pane>
  );
}

function SelectedModeTree() {
  const { editMode } = useTreeState();
  switch (editMode) {
    case TreeEditMode.ELEMENT:
    case TreeEditMode.LAYOUT: {
      return (
        <Flex flex={1}>
          <EditableRootTree />
        </Flex>
      );
    }
    case TreeEditMode.PREVIEW: {
      return (
        <Flex flex={1}>
          <PreviewRootTree />
        </Flex>
      );
    }
    case TreeEditMode.OUTPUT: {
      return (
        <Flex flex={1}>
          <OutputTree />
        </Flex>
      );
    }
  }
}

function App() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          html, body, main {padding: 0; margin: 0; width: 100vw; height: 100vh; }
          * { box-sizing: border-box; }
        `,
        }}
      />
      <TreeStateProvider initialTree={flexTree}>
        <Flex flexDirection="column">
          <Flex display="flex" flex={1}>
            <Flex>
              <Pane width={300}>
                <SourceList />
              </Pane>
              {/* Tree */}
              <Pane flex={1} padding={10}>
                <Flex flexDirection="column">
                  <Flex height={32}>
                    <EditModeButtonGroup />
                  </Flex>
                  <Flex height="calc(100% - 32px)">
                    <SelectedModeTree />
                  </Flex>
                </Flex>
              </Pane>
            </Flex>
            <Pane width={300}>
              <ElementPropsEditor />
            </Pane>
          </Flex>
        </Flex>
      </TreeStateProvider>
    </>
  );
}

function ElementPropsEditor() {
  const { selectedId, inv } = useTreeState();
  if (!selectedId) {
    return <>None</>;
  }
  const data = inv.dataMap[selectedId];
  return (
    <Pane>
      <pre style={{ padding: 0, margin: 0 }}>
        {JSON.stringify(data, null, 2)}
      </pre>{" "}
    </Pane>
  );
}

const main = document.createElement("main");
document.body.appendChild(main);
ReactDOM.render(<App />, main);
