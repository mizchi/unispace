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
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body, main { margin: 0; padding: 0; width: 100vw; height: 100vh; }`,
        }}
      ></style>
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

## LICENSE

MIT
