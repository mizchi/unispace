import React, { Suspense, useState, useEffect, useRef, Children } from "react";
import ReactDOM from "react-dom";
// @ts-ignore
import Tree from "tui-tree";
import "tui-tree/dist/tui-tree.css";

type Files = { [k: string]: string };

const Editor = React.lazy(() => import("../lib/index"));

const initialFiles: Files = {
  "/index.tsx": "console.log('xxx')",
  "/foo.tsx": "export default 1;",
};

type Tree = {
  text: string;
  children?: Tree[];
};

function filesToTreeData(files: Files) {
  const root: Tree = {
    text: "/",
    children: [],
  };
  const names = Object.keys(files);
  // @ts-ignore
  names.sort((a, b) => a > b);

  for (const name of names) {
    _dig(root, name);
  }
  return root;

  function _dig(parent: Tree, filename: string) {
    const names = filename.split("/");
    let cur = parent;
    names.forEach((dir, index) => {
      // end?
      if (names.length === index + 1) {
        cur.text = dir;
        delete cur.children;
        return;
      }
      // already exists?
      const hit = cur.children.find((c) => c.text === dir);
      if (hit) {
        cur = hit;
        return;
      }
      const newDir = {
        text: dir,
        children: [],
      };
      cur.children.push(newDir);
      cur = newDir;
    });
  }
}

function TreeUI(props: { files: Files }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tree, setTree] = useState(null);
  useEffect(() => {
    if (ref.current) {
      const treeData = filesToTreeData(props.files);

      const tree = new Tree(ref.current, {
        data: [treeData],
        nodeDefaultState: "opened",
      });
      setTree(tree);
    }
  }, [props.files]);
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
          <TreeUI files={currentFiles} />
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
