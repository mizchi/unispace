import React, { useState, useContext, useCallback } from "react";
import ReactDOM from "react-dom";
import { Pane, Flex, Text } from "./components/elements";
import { ElementSource } from "./types";
import { sampleTree, ELEMENT_SOURCES } from "./mock";
import { useTreeState, TreeStateProvider } from "./contexts/tree";
import { useDropOnTree } from "./contexts/dnd";
import { SourceList } from "./components/SourceList";
import { EditableView } from "./components/EditableView";
import { View } from "./components/View";

export function BlankPane(props: { parentId: string }) {
  const [_data, ref] = useDropOnTree({
    dropType: "blank",
    parentId: props.parentId,
  });
  return (
    <Flex
      ref={ref}
      flex={1}
      padding={8}
      background="#888"
      border="1px dashed black"
    >
      <Text opacity={0.5}>DROP ME</Text>
      {/* <Text>[DROP ME][{props.parentId}]</Text> */}
    </Flex>
  );
}

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

function App() {
  const [mode, setMode] = useState<"editable" | "preview" | "output">(
    "editable"
  );
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
      <TreeStateProvider initialTree={sampleTree}>
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
                    <button
                      disabled={mode === "editable"}
                      onClick={() => setMode("editable")}
                    >
                      editable
                    </button>
                    <button
                      disabled={mode === "preview"}
                      onClick={() => setMode("preview")}
                    >
                      preview
                    </button>
                    <button
                      disabled={mode === "output"}
                      onClick={() => setMode("output")}
                    >
                      output
                    </button>
                  </Flex>
                  {mode === "editable" && (
                    <Flex flex={1}>
                      <EditableRootTree />
                    </Flex>
                  )}
                  {mode === "preview" && (
                    <Flex flex={1}>
                      <PreviewRootTree />
                    </Flex>
                  )}
                  {mode === "output" && (
                    <Flex flex={1}>
                      <OutputTree />
                    </Flex>
                  )}
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
