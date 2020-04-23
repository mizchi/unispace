import { ElementData } from "./types";
import type { Node as TreeNode } from "./tree-api";
import uniqueId from "lodash-es/uniqueId";

export const sampleTree: TreeNode<ElementData> = {
  id: "$root",
  data: { elementType: "root" },
  children: [
    {
      id: uniqueId(),
      data: {
        elementType: "grid",
        rows: ["1fr", "1fr"],
        columns: ["1fr", "1fr"],
        areas: [
          ["a", "b"],
          ["c", "d"],
        ],
      },
      children: [
        {
          id: uniqueId(),
          data: {
            elementType: "grid-area",
            gridArea: "a",
          },
          children: [
            {
              id: uniqueId(),
              data: { elementType: "text", value: "foo" },
              children: [],
            },
          ],
        },
        {
          id: uniqueId(),
          data: {
            elementType: "grid-area",
            gridArea: "b",
          },
          children: [],
        },
        {
          id: uniqueId(),
          data: {
            elementType: "grid-area",
            gridArea: "c",
          },
          children: [
            {
              id: uniqueId(),
              data: {
                elementType: "grid",
                rows: ["1fr"],
                columns: ["1fr", "1fr"],
                areas: [["e", "f"]],
              },
              children: [
                {
                  id: uniqueId(),
                  data: {
                    elementType: "grid-area",
                    gridArea: "e",
                  },
                  children: [],
                },
                {
                  id: uniqueId(),
                  data: {
                    elementType: "grid-area",
                    gridArea: "f",
                  },
                  children: [
                    {
                      id: uniqueId(),
                      data: {
                        elementType: "text",
                        value: "yyy",
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: uniqueId(),
          data: {
            elementType: "grid-area",
            gridArea: "d",
          },
          children: [
            {
              id: uniqueId(),
              data: {
                elementType: "image",
                src:
                  "http://imgcc.naver.jp/kaze/mission/USER/20140612/42/4930882/68/598x375xe4022b20b838933f265c1591.jpg",
              },
              children: [],
            },
          ],
        },
      ],
    },
  ],
};
