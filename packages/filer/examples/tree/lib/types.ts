import { InvertedTree } from "@mizchi/tree-utils/inverted";

import type { Node as TreeNode } from "@mizchi/tree-utils";
export type { Node as TreeNode } from "@mizchi/tree-utils";

export interface ElementNode {
  elementType: string;
}

export interface RootData extends ElementNode {
  elementType: "root";
}

export interface GridData extends ElementNode {
  elementType: "grid";
  props: {
    rows: Array<string>;
    columns: Array<string>;
    areas: string[][];
  };
}

export interface GridAreaData extends ElementNode {
  elementType: "grid-area";
  props: {
    gridArea: string;
  };
}

export interface StyleData extends ElementNode {
  elementType: "style";
  props: {
    style: object;
  };
}

export interface TextData extends ElementNode {
  elementType: "text";
  props: {
    value: string;
  };
}

export interface ImageData extends ElementNode {
  elementType: "image";
  props: {
    src: string;
  };
}

export type ElementData =
  | RootData
  | GridData
  | GridAreaData
  | StyleData
  | TextData
  | ImageData;
