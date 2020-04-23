import React, { useRef } from "react";
import { Flex } from "./elements";
import { Node as TreeNode } from "../tree-api";
import { ElementData } from "../types";
import { useTreeDispatch } from "../contexts/tree";
import { selectNode } from "../reducer";
import { useDragOnTree, useDropOnTree } from "../contexts/dnd";
import { EditableView } from "./EditableView";
export function EditableBox({
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
            <button
              onClick={() => {
                dispatch(selectNode(tree.id));
              }}
            >
              [i]
            </button>
            {tree.data.elementType}[{tree.id.slice(-4)}]
          </Flex>
        ))}
      <Flex flex={1} paddingLeft={4} background="white">
        {children ||
          tree.children.map((node) => {
            return <EditableView key={node.id} tree={node} depth={depth + 1} />;
          })}
      </Flex>
    </Flex>
  );
}
