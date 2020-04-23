import React from "react";
import { Pane, Grid } from "./elements";
import { Node as TreeNode } from "../tree-api";
import { ElementData } from "../types";
import flatten from "lodash-es/flatten";
import { EditableBox } from "./EditableBox";
import { BlankPane } from "../index";
import { View } from "./View";
export function EditableView(props: {
  tree: TreeNode<ElementData>;
  depth: number;
}) {
  const data = props.tree.data;
  switch (data.elementType) {
    case "root": {
      return (
        <EditableBox hideHeader tree={props.tree} depth={props.depth + 1} />
      );
    }
    case "grid": {
      const gridAreaNames = flatten(data.areas);
      const { rows, columns, areas } = data;
      return (
        <EditableBox hideHeader tree={props.tree} depth={props.depth + 1}>
          <Grid rows={rows} columns={columns} areas={areas}>
            {gridAreaNames.map((gridArea) => {
              const hit = props.tree.children.find((c) => {
                return (
                  c.data.elementType === "grid-area" &&
                  c.data.gridArea === gridArea
                );
              })!;
              return (
                <Pane gridArea={gridArea} key={gridArea}>
                  <EditableView
                    key={hit.id}
                    tree={hit}
                    depth={props.depth + 1}
                  />
                </Pane>
              );
            })}
          </Grid>
        </EditableBox>
      );
    }
    case "grid-area": {
      const showBlankArea = props.tree.children.length === 0;
      return (
        <EditableBox hideHeader tree={props.tree} depth={props.depth + 1}>
          {showBlankArea ? (
            <BlankPane parentId={props.tree.id} />
          ) : (
            props.tree.children.map((node) => {
              return (
                <EditableView
                  key={node.id}
                  tree={node}
                  depth={props.depth + 1}
                />
              );
            })
          )}
        </EditableBox>
      );
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
