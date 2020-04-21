import { useDrag, DndProvider, useDrop, DragObjectWithType } from "react-dnd";
import React from "react";
import { Pane } from "./elements";

export const DND_CONTEXT = "dnd-context";

interface DragObject extends DragObjectWithType {
  type: string;
  dragId: string;
  sourceType: string;
}

type DropResult = {
  delta: { x: number; y: number } | null;
};

export function Draggable(props: {
  id: string;
  children: any;
  height?: any;
  sourceType: string;
}) {
  const [data, ref, preview] = useDrag<
    DragObject,
    DragObject,
    { isDragging: boolean }
  >({
    begin(monitor) {
      console.log("drag begin", props.id);
    },
    end(dropResult, monitor) {},
    // previewOptions: {},
    canDrag() {
      return true;
    },
    item: {
      type: DND_CONTEXT,
      dragId: props.id,
      sourceType: props.sourceType,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <Pane height={props.height} ref={ref}>
      {props.children}
    </Pane>
  );
}

export function Droppable(props: {
  dropId: string;
  children: any;
  onDrop: (payload: { dragId: string; dropId: string }) => void;
}) {
  const [data, drop] = useDrop<DragObject, DropResult, { isOver: boolean }>({
    accept: DND_CONTEXT,
    hover(item, monitor) {
      // console.log("hover");
    },
    canDrop() {
      return true;
    },
    drop(dragItem, monitor) {
      props.onDrop({ dropId: props.dropId, dragId: dragItem.dragId });
      return {
        delta: monitor.getDifferenceFromInitialOffset(),
      };
    },
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
      };
    },
  });

  return (
    <Pane ref={drop} background={data.isOver ? "red" : "transparent"}>
      {props.children}
    </Pane>
  );
}
