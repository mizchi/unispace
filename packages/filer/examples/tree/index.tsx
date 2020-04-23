import React, { useState, useContext, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { Pane, Flex, Grid, Text } from "./lib/elements";
import type { Node as TreeNode } from "@mizchi/tree-utils";
import { ElementData } from "./lib/types";
import { sampleTree } from "./lib/mock";
import {
  useTreeState,
  TreeStateProvider,
  useTreeDispatch,
} from "./lib/contexts";
import { selectNode } from "./lib/reducer";
import { useDragOnTree, useDropOnTree, ElementSource } from "./lib/dnd";

const ELEMENT_SOURCES: ElementSource[] = [
  {
    sourceType: "text",
    value: "",
  },
  {
    sourceType: "image",
    src:
      "http://imgcc.naver.jp/kaze/mission/USER/20140612/42/4930882/68/598x375xe4022b20b838933f265c1591.jpg",
    // src: "",
  },
  {
    sourceType: "grid",
    rows: ["1fr"],
    columns: ["1fr"],
    areas: [["x"]],
  },
];

function SourceList() {
  return (
    <Pane>
      {ELEMENT_SOURCES.map((source, index) => {
        return <DraggableElementSourceItem key={index} source={source} />;
      })}
    </Pane>
  );
}

function DraggableElementSourceItem(props: { source: ElementSource }) {
  const [, ref] = useDragOnTree({
    dragType: "source",
    source: props.source,
  });
  return (
    <Pane ref={ref} paddingTop={5} height={32} outline="1px solid black">
      <Text>{props.source.sourceType}</Text>
    </Pane>
  );
}

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
  const dispatch = useTreeDispatch();

  const ref = useRef<HTMLDivElement>(null);
  const [, dragRef] = useDragOnTree({
    dragType: "element",
    id: tree.id,
  });

  const [, dropRef] = useDropOnTree({
    dropType: "existed-element",
    id: tree.id,
  });

  dragRef(dropRef(ref));

  return (
    <Flex flexDirection="column" border="1px solid #ccc" background="#eee">
      {!hideHeader &&
        (header ?? (
          <Flex ref={ref} height="24px" fontSize={16}>
            <div
              onClick={() => {
                dispatch(selectNode(tree.id));
              }}
            >
              {tree.data.elementType}[{tree.id.slice(-4)}]
            </div>
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

function BlankGridArea(props: { gridArea: string; parentId: string }) {
  const [_data, ref] = useDropOnTree({
    dropType: "blank-grid-area",
    parentId: props.parentId,
    gridArea: props.gridArea,
  });
  return (
    <Flex
      ref={ref}
      flex={1}
      padding={8}
      background="white"
      border="1px dashed black"
    >
      <Text>[DROP ME][{props.gridArea}]</Text>
    </Flex>
  );
}

// function Droppable() {

// }

function EditableView(props: { tree: TreeNode<ElementData>; depth: number }) {
  const data = props.tree.data;
  console.log(props.tree.data);
  switch (data.elementType) {
    case "root": {
      return (
        <EditableBox hideHeader tree={props.tree} depth={props.depth + 1} />
      );
    }

    case "grid": {
      // @ts-ignore
      const gridAreaNames = data.areas.flat() as string[];
      const { rows, columns, areas } = data;
      return (
        <EditableBox tree={props.tree} depth={props.depth + 1}>
          <Grid rows={rows} columns={columns} areas={areas}>
            {gridAreaNames.map((gridArea) => {
              const hit = props.tree.children.find((c) => {
                return (
                  c.data.elementType === "grid-area" &&
                  c.data.gridArea === gridArea
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
                    <BlankGridArea
                      gridArea={gridArea}
                      parentId={props.tree.id}
                    />
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
          {props.tree.children.map((c) => {
            return <View key={c.id} tree={c} />;
            // return <>{c.id}</>;
          })}
        </Pane>
      );
    }
    case "grid": {
      // @ts-ignore
      const gridAreaNames = data.areas.flat() as string[];
      const { rows, columns, areas } = data;
      return (
        <Grid rows={rows} columns={columns} areas={areas}>
          {gridAreaNames.map((gridArea) => {
            const existNode = props.tree.children.find((c) => {
              return (
                c.data.elementType === "grid-area" &&
                c.data.gridArea === gridArea
              );
            });
            return (
              <Pane gridArea={gridArea} key={gridArea}>
                {existNode && <View key={existNode.id} tree={existNode} />}
              </Pane>
            );
          })}
        </Grid>
      );
    }
    case "grid-area": {
      return (
        <>
          {props.tree.children.map((c) => {
            return <View key={c.id} tree={c} />;
          })}
        </>
      );
    }
    case "text": {
      return <Text>{data.value}</Text>;
    }
    case "image": {
      return (
        <Pane>
          <img
            src={data.src}
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
