import React from "react";
import { Pane, Grid, Flex } from "./elements";
import { Node as TreeNode } from "../tree-api";
import { ElementData, ElementTree } from "../types";
import flatten from "lodash-es/flatten";
import { EditableBox } from "./EditableBox";
import { BlankPane } from "./BlankPane";
import { View } from "./View";

export function EditableView(props: { tree: ElementTree; depth: number }) {
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
      return (
        <EditableBox hideHeader tree={props.tree} depth={props.depth + 1} />
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

    case "flex": {
      const isBlank = props.tree.children.length === 0;
      if (isBlank) {
        return (
          <EditableBox hideHeader tree={props.tree} depth={props.depth + 1}>
            <Flex flexDirection={data.direction}>
              {isBlank ? (
                <BlankPane
                  parentId={props.tree.id}
                  text={`Add ${data.direction}`}
                />
              ) : (
                <View tree={props.tree} />
              )}
            </Flex>
          </EditableBox>
        );
      }

      return (
        <EditableBox hideHeader tree={props.tree} depth={props.depth + 1}>
          <Flex flexDirection={data.direction}>
            <Flex flex={4} flexDirection={data.direction}>
              {props.tree.children.map((child) => {
                return <EditableView tree={child} depth={props.depth + 1} />;
              })}
            </Flex>
            <Flex flex={1}>
              <BlankPane
                parentId={props.tree.id}
                text={`Add ${data.direction}`}
              />
            </Flex>
          </Flex>
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
