import {
  useDrag,
  useDrop,
  DropTargetMonitor,
  DragSourceMonitor,
} from "react-dnd";
import {
  ElementData,
  TreeNode,
  GridAreaData,
  GridData,
  DragType,
  DropType,
} from "../types";
import { useTreeDispatch } from "./tree";
import { swapNodes, moveNode, addChild } from "../reducer";
import { ulid } from "ulid";
import { uniqueId } from "lodash-es";
// import { ElementData, TreeNode } from "./types";

export const DND_CONTEXT = "dnd-context";

type DragSpec<T> = {
  canDrag?: () => boolean;
  collect?: (monitor: DragSourceMonitor) => T;
};

export function useDragOnTree<T = any>(
  dragType: DragType,
  spec: DragSpec<T> = {}
) {
  return useDrag<DragType & { type: typeof DND_CONTEXT }, void, T>({
    canDrag: spec.canDrag ?? (() => true),
    begin() {
      console.log("begin", dragType);
    },
    item: {
      type: DND_CONTEXT,
      ...dragType,
    },
    collect: spec.collect,
  });
}

export function useDropOnTree<T = any>(
  drop: DropType,
  spec: {
    canDrop?: () => boolean;
    collect?: (monitor: DropTargetMonitor) => T;
  } = {}
) {
  const dispatch = useTreeDispatch();
  return useDrop<DragType & { type: typeof DND_CONTEXT }, any, T>({
    accept: DND_CONTEXT,
    canDrop: spec.canDrop || (() => true),
    collect: spec.collect,
    drop(drag, _monitor) {
      console.log("drag", drag, ": drop to", drop);
      switch (drag.dragType) {
        case "source": {
          switch (drop.dropType) {
            case "blank": {
              let childData: ElementData | null = null;
              let children: TreeNode<ElementData>[] = [];
              if (drag.source.sourceType == "text") {
                childData = {
                  elementType: "text",
                  value: ulid().slice(-5),
                };
              }

              if (drag.source.sourceType == "image") {
                childData = {
                  elementType: "image",
                  src: drag.source.src,
                };
              }

              if (drag.source.sourceType == "flex") {
                childData = {
                  elementType: "flex",
                  direction: drag.source.direction,
                };
              }

              if (drag.source.sourceType == "grid") {
                childData = {
                  elementType: "grid",
                  rows: drag.source.rows,
                  columns: drag.source.columns,
                  areas: drag.source.areas,
                };
                // @ts-ignore
                children = drag.source.areas.flat().map((areaName: string) => {
                  return {
                    id: uniqueId(),
                    data: {
                      elementType: "grid-area",
                      gridArea: areaName,
                    } as GridAreaData,
                    children: [],
                  };
                });
              }

              if (childData == null) {
                throw new Error(`Unknown ${drag.source.sourceType}`);
              }

              dispatch(
                addChild({ parentId: drop.parentId, data: childData, children })
              );
              return;
              // TODO: create blank
            }
            default: {
              return;
            }
          }
        }
        case "element": {
          switch (drop.dropType) {
            case "blank": {
              dispatch(
                moveNode({
                  targetId: drag.id,
                  newParentId: drop.parentId,
                })
              );
              return;
            }
            case "existed-element": {
              dispatch(swapNodes({ aid: drag.id, bid: drop.id }));
              return;
            }
            default: {
              return;
            }
          }
        }
      }
      return {};
    },
  });
}
