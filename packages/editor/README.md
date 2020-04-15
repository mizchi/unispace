# Monaco Workspace Editor

```
yarn add monaco-workspace-editor-react
```

## Example

```tsx
import React, { Suspense } from "react";
import ReactDOM from "react-dom";

const Editor = React.lazy(() =>
  import("monaco-workspace-editor-react/lib/index")
);

function App() {
  return (
    <>
      <Suspense fallback="...">
        <Editor
          currentFilepath="/index.tsx"
          initialFiles={{ "/index.tsx": "console.log('xxx')" }}
          onChangeFiles={(files) => {
            console.log(files);
          }}
        ></Editor>
      </Suspense>
    </>
  );
}

const main = document.createElement("main");
// main.style.width = "80vw";
// main.style.height = "80vh";
document.body.append(main);

ReactDOM.render(<App />, main);
```

## Expected Webpack Config

```js
const WorkerPlugin = require("worker-plugin");

module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    // ...
    new WorkerPlugin(),
  ],
};
```

## LICENSE

MIT
