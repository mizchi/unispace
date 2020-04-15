import React from "react";
import { Node } from "@mizchi/tree-utils";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import ReactDnDHTML5Backend from "react-dnd-html5-backend";

const DND_GROUP = "$react-draggalble-tree";

type DraggableTreeProps<T> = {
  tree: Node<T>;
  canDragItem?: (id: string) => boolean;
  canDropOnItem?: (id: string) => boolean;
  onItemDrop: (dragSourceId: string, dropTargetId: string) => void;
  renderItem: (itemProps: FlatItem) => React.ReactElement<any>;
};

export const DraggableTree = DragDropContext(ReactDnDHTML5Backend)(function<T>(
  props: DraggableTreeProps<T>
) {
  const flatItems = toFlatItems(props.tree);
  return (
    <>
      {flatItems.map(item => {
        return (
          <DraggableItem
            key={item.id}
            id={item.id}
            onDrop={props.onItemDrop}
            canDragItem={props.canDragItem}
            canDropOnItem={props.canDropOnItem}
          >
            {props.renderItem(item)}
          </DraggableItem>
        );
      })}
    </>
  );
});

type DraggableItemProps = {
  id: string;
  canDragItem: void | ((id: string) => boolean);
  canDropOnItem: void | ((id: string) => boolean);
  onDrop: (sourceId: string, dropId: string) => void;
};

const DraggableItem: React.ComponentType<DraggableItemProps> = compose(
  DropTarget<DraggableItemProps>(
    DND_GROUP,
    {
      // hover(props, monitor, component: any) {
      // console.log("hover");
      // },
      canDrop(props, _monitor) {
        return props.canDropOnItem != null
          ? props.canDropOnItem(props.id)
          : true;
      },
      drop(dropProps, monitor, _dropComponent) {
        if (monitor) {
          const dragSourceProps: DraggableItemProps = monitor.getItem();
          if (dropProps.id !== dragSourceProps.id) {
            dragSourceProps.onDrop(dragSourceProps.id, dropProps.id);
          }
        }
      }
    },
    connect => {
      return {
        connectDropTarget: connect.dropTarget()
      };
    }
  ),
  DragSource<DraggableItemProps>(
    DND_GROUP,
    {
      canDrag(props) {
        return props.canDragItem != null ? props.canDragItem(props.id) : true;
      },
      beginDrag(props) {
        return props;
      }
    },
    (connect, monitor) => {
      return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
      };
    }
  )
)((props: any) => {
  return props.connectDragSource(props.connectDropTarget(props.children));
});

function compose(...funcs: Function[]) {
  return funcs.reduce((a, b) => (...args: any) => a(b(...args)));
}

type FlatItem = {
  id: string;
  parentId: string | null;
  depth: number;
};

function toFlatItems<T>(tree: Node<T>): FlatItem[] {
  const items: FlatItem[] = [];
  function walk(node: Node<T>, parentId: string | null, depth: number) {
    items.push({
      id: node.id,
      parentId: parentId,
      depth
    });
    node.children.forEach(child => {
      walk(child, node.id, depth + 1);
    });
  }
  walk(tree, null, 0);

  return items;
}
