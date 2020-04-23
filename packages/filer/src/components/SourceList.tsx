import { Pane, Text } from "./elements";
import { ELEMENT_SOURCES } from "../mock";
import { useDragOnTree } from "../contexts/dnd";
import { ElementSource } from "../types";
import React from "react";

export function SourceList() {
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
      <Text>{props.source.displayName}</Text>
    </Pane>
  );
}
