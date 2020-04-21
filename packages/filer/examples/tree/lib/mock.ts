import { ulid } from "ulid";
import { ElementData } from "./types";
import type { Node as TreeNode } from "@mizchi/tree-utils";

export const sampleTree: TreeNode<ElementData> = {
  id: "root",
  data: { elementType: "root" },
  children: [
    {
      id: ulid(),
      data: {
        elementType: "grid",
        props: {
          rows: ["1fr", "1fr"],
          columns: ["1fr", "1fr"],
          areas: [
            ["a", "b"],
            ["c", "d"],
          ],
        },
      },
      children: [
        {
          id: ulid(),
          data: {
            elementType: "grid-area",
            props: {
              gridArea: "a",
            },
          },
          children: [
            {
              id: ulid(),
              data: { elementType: "text", props: { value: "hello" } },
              children: [],
            },
          ],
        },
        {
          id: ulid(),
          data: {
            elementType: "grid-area",
            props: {
              gridArea: "c",
            },
          },
          children: [
            {
              id: ulid(),
              data: {
                elementType: "grid",
                props: {
                  rows: ["1fr"],
                  columns: ["1fr", "1fr"],
                  areas: [["e", "f"]],
                },
              },
              children: [
                {
                  id: ulid(),
                  data: {
                    elementType: "grid-area",
                    props: {
                      gridArea: "e",
                    },
                  },
                  children: [
                    {
                      id: ulid(),
                      data: {
                        elementType: "text",
                        props: {
                          value: "hello",
                        },
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
          id: ulid(),
          data: {
            elementType: "grid-area",
            props: {
              gridArea: "d",
            },
          },
          children: [
            {
              id: ulid(),
              data: {
                elementType: "image",
                props: {
                  src:
                    "http://imgcc.naver.jp/kaze/mission/USER/20140612/42/4930882/68/598x375xe4022b20b838933f265c1591.jpg",
                },
              },
              children: [],
            },
          ],
        },
      ],
    },
  ],
};
