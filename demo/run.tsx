import React, { Suspense, useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
// @ts-ignore
import Tree from "tui-tree";
import "tui-tree/dist/tui-tree.css";

const Editor = React.lazy(() => import("../lib/index"));

const initialFiles: { [k: string]: string } = {
  "/index.tsx": "console.log('xxx')",
  "/foo.tsx": "export default 1;",
};

var data = [
  {
    text: "rootA",
    children: [
      { text: "sub-A1" },
      { text: "sub-A2" },
      { text: "sub-A3" },
      { text: "sub-A4" },
      {
        text: "sub-A5",
        state: "closed",
        children: [
          { text: "sub-A5A", children: [{ text: "sub-A5A1" }] },
          { text: "sub_A5B" },
        ],
      },
      { text: "sub-A6" },
      { text: "sub-A7" },
      { text: "sub-A8" },
      {
        text: "sub-A9",
        state: "closed",
        children: [{ text: "sub-A9A" }, { text: "sub-A9B" }],
      },
      { text: "sub-A10" },
      { text: "sub-A11" },
      { text: "sub-A12" },
    ],
  },
  {
    text: "rootB",
    state: "closed",
    children: [{ text: "sub-B1" }, { text: "sub-B2" }, { text: "sub-B3" }],
  },
];

function TreeUI(props: { files: { [k: string]: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tree, setTree] = useState(null);
  useEffect(() => {
    if (ref.current) {
      const tree = new Tree(ref.current, { data, nodeDefaultState: "opened" });
      setTree(tree);
    }
  }, []);
  return <div ref={ref} className="tui-tree-wrap"></div>;
}

function App() {
  const [currentFiles, setFiles] = useState(initialFiles);
  const [filepath, setFilepath] = useState("/index.tsx");
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html, body, main {
              margin: 0; padding: 0; width: 100vw; height: 100vh;
            }
            * {
              box-sizing: border-box;
            }
          `,
        }}
      ></style>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ width: "240px", height: "100%" }}>
          <TreeUI />
          {Object.keys(currentFiles).map((fname, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setFilepath(fname);
                }}
              >
                {fname}
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1, height: "100%" }}>
          <Suspense fallback="...">
            <Editor
              currentFilepath={filepath}
              initialFiles={initialFiles}
              onChangeFiles={(files) => {
                setFiles(files);
              }}
            ></Editor>
          </Suspense>
        </div>
      </div>
    </>
  );
}

const main = document.createElement("main");
document.body.append(main);

ReactDOM.render(<App />, main);
