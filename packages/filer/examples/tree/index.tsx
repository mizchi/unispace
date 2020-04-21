import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import { Pane, Flex, Grid, Text } from "./lib/elements";
import { Draggable, Droppable } from "./lib/dnd";
import { ulid } from "ulid";

import type { Node as TreeNode } from "@mizchi/tree-utils";
import { ElementData } from "./lib/types";
import { sampleTree } from "./lib/mock";
import { useTreeState, TreeStateProvider } from "./lib/contexts";

const recipes = [
  {
    id: "text",
    initialProps: {
      children: "hello",
    },
  },
  { id: "image", initialProps: { src: "...." } },
  { id: "grid" },
];

function EditableBox({
  tree,
  depth,
  header,
  children,
  hideHeader = false,
}: {
  tree: TreeNode<ElementData>;
  depth: number;
  header?: React.ReactNode;
  children?: any;
  hideHeader?: boolean;
}) {
  return (
    <Flex flexDirection="column" border="1px solid #ccc" background="#eee">
      {!hideHeader &&
        (header ?? (
          <Flex height="24px" fontSize={16}>
            {tree.data.elementType}({tree.id.slice(-4)})
          </Flex>
        ))}
      <Flex flex={1} padding={8} background="white">
        {children ||
          tree.children.map((node) => {
            return <EditableView key={node.id} tree={node} depth={depth + 1} />;
          })}
      </Flex>
    </Flex>
  );
}

function BlankGridArea(props: { gridArea: string }) {
  return (
    <Droppable
      dropId={ulid()}
      onDrop={() => {
        console.log("on drop");
      }}
    >
      <Flex flex={1} padding={8} background="white" border="1px dashed black">
        <Text>DropMe [{props.gridArea}]</Text>
      </Flex>
    </Droppable>
  );
}

function EditableView(props: { tree: TreeNode<ElementData>; depth: number }) {
  const data = props.tree.data;
  switch (data.elementType) {
    case "root": {
      return (
        <EditableBox hideHeader tree={props.tree} depth={props.depth + 1} />
      );
    }
    case "grid": {
      const gridAreaNames = data.props.areas.flat();
      return (
        <EditableBox tree={props.tree} depth={props.depth + 1}>
          <Grid {...data.props}>
            {gridAreaNames.map((gridArea) => {
              const hit = props.tree.children.find((c) => {
                return (
                  c.data.elementType === "grid-area" &&
                  c.data.props.gridArea === gridArea
                );
              });
              return (
                <Pane gridArea={gridArea} key={gridArea}>
                  {hit ? (
                    <EditableView
                      key={hit.id}
                      tree={hit}
                      depth={props.depth + 1}
                    />
                  ) : (
                    <BlankGridArea gridArea={gridArea} />
                  )}
                </Pane>
              );
            })}
          </Grid>
        </EditableBox>
      );
    }
    case "grid-area": {
      return <EditableBox tree={props.tree} depth={props.depth + 1} />;
    }
    case "text": {
      return (
        <EditableBox tree={props.tree} depth={props.depth + 1}>
          <View tree={props.tree} />
        </EditableBox>
      );
    }
    case "image": {
      return (
        <EditableBox tree={props.tree} depth={props.depth + 1}>
          <View tree={props.tree} />
        </EditableBox>
      );
    }
    default: {
      return (
        <EditableBox tree={props.tree} depth={props.depth + 1}>
          WIP: {data.elementType}
        </EditableBox>
      );
    }
  }
}

function View(props: { tree: TreeNode<ElementData> }) {
  const data = props.tree.data;
  switch (data.elementType) {
    case "root": {
      // return <>root</>;
      return (
        <Pane>
          root
          {props.tree.children.map((c) => {
            return <>{c.id}</>;
          })}
        </Pane>
      );
      // );
    }
    case "grid": {
      const gridAreaNames = data.props.areas.flat();
      return (
        <Grid {...data.props}>
          {gridAreaNames.map((gridArea) => {
            const hit = props.tree.children.find((c) => {
              return (
                c.data.elementType === "grid-area" &&
                c.data.props.gridArea === gridArea
              );
            });
            return (
              <Pane gridArea={gridArea} key={gridArea}>
                {hit ? (
                  <View key={hit.id} tree={hit} />
                ) : (
                  <BlankGridArea gridArea={gridArea} />
                )}
              </Pane>
            );
          })}
        </Grid>
      );
    }
    case "grid-area": {
      return <View tree={props.tree} />;
    }
    case "text": {
      return <Text>{data.props.value}</Text>;
    }
    case "image": {
      return (
        <Pane>
          <img
            src={data.props.src}
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </Pane>
      );
    }
    default: {
      return <Text>WIP: {data.elementType}</Text>;
    }
  }
}

function EditableRootTree() {
  const { tree } = useTreeState();
  return <EditableView tree={tree} depth={0} />;
}

function PreviewRootTree() {
  const { tree } = useTreeState();
  return <View tree={tree} />;
}

function SourceList() {
  return (
    <Pane>
      {recipes.map((r) => {
        return (
          <Draggable id={r.id} key={r.id} sourceType="newItem">
            <Pane padding={8} height="32px" outline="1px solid black">
              {r.id}
            </Pane>
          </Draggable>
        );
      })}
    </Pane>
  );
}

function App() {
  const [mode, setMode] = useState<"editable" | "preview">("editable");
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
      <Flex flexDirection="column">
        <Flex display="flex" flex={1}>
          <TreeStateProvider initialTree={sampleTree}>
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
                </Flex>
              </Pane>
            </Flex>
            <Pane width={300}>Right</Pane>
          </TreeStateProvider>
        </Flex>
      </Flex>
    </>
  );
}

const main = document.createElement("main");
document.body.appendChild(main);
ReactDOM.render(<App />, main);
