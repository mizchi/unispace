export type { Node as TreeNode } from "./tree-api";

export interface ElementNode {
  elementType: string;
}

export interface RootData extends ElementNode {
  elementType: "root";
}

export interface GridData extends ElementNode {
  elementType: "grid";
  rows: Array<string>;
  columns: Array<string>;
  areas: string[][];
}

export interface GridAreaData extends ElementNode {
  elementType: "grid-area";
  gridArea: string;
}

export interface StyleData extends ElementNode {
  elementType: "style";
  style: object;
}

export interface TextData extends ElementNode {
  elementType: "text";
  value: string;
}

export interface ImageData extends ElementNode {
  elementType: "image";
  src: string;
}

export type ElementData =
  | RootData
  | GridData
  | GridAreaData
  | StyleData
  | TextData
  | ImageData;

export type ElementSource =
  | {
      displayName: string;
      sourceType: "text";
      value: string;
    }
  | {
      displayName: string;

      sourceType: "image";
      src: string;
    }
  | {
      displayName: string;
      sourceType: "grid";
      rows: string[];
      columns: string[];
      areas: string[][];
    };

export type DragType =
  | {
      dragType: "source";
      source: ElementSource;
    }
  | {
      dragType: "element";
      id: string;
    };

export type DropType =
  | {
      dropType: "blank";
      parentId: string;
    }
  | {
      id: string;
      dropType: "existed-element";
    };
