import React, { useRef } from "react";
import { Flex } from "./elements";
import { Node as TreeNode } from "../tree-api";
import { ElementData } from "../types";
import { useTreeDispatch } from "../contexts/tree";
import { selectNode, deleteNode } from "../reducer";
import { useDragOnTree, useDropOnTree } from "../contexts/dnd";
import { EditableView } from "./EditableView";
import { BlankPane } from "./BlankPane";
export function EditableBox({
  tree,
  depth,
  children,
  hideHeader = false,
}: {
  tree: TreeNode<ElementData>;
  depth: number;
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

  const isBlank = children == null && tree.children.length === 0;
  return (
    <Flex flexDirection="column" border="1px solid #ccc" background="#eee">
      {!hideHeader && (
        <Flex ref={ref} height="24px" fontSize={16}>
          <button
            onClick={() => {
              dispatch(selectNode(tree.id));
            }}
          >
            [i]
          </button>
          {tree.data.elementType}[{tree.id.slice(-4)}]
          <button
            style={{
              background: "red",
              // color: "white",
            }}
            onClick={() => {
              dispatch(deleteNode(tree.id));
            }}
          >
            [x]
          </button>
        </Flex>
      )}
      <Flex flex={1} paddingLeft={4} background="white">
        {isBlank && <BlankPane parentId={tree.id} />}
        {children ||
          tree.children.map((node) => {
            return <EditableView key={node.id} tree={node} depth={depth + 1} />;
          })}
      </Flex>
    </Flex>
  );
}
