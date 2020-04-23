import React from "react";
import { Pane, Grid, Text, Flex } from "./elements";
import { Node as TreeNode } from "../tree-api";
import { ElementData } from "../types";
import flatten from "lodash-es/flatten";
export function View(props: { tree: TreeNode<ElementData> }) {
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

    case "flex": {
      return (
        <Flex flexDirection={data.direction}>
          {props.tree.children.map((c) => {
            return <View key={c.id} tree={c} />;
          })}
        </Flex>
      );
    }

    case "grid": {
      const gridAreaNames = flatten(data.areas);
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
