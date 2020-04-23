const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
// @ts-ignore
const shared = require("../../webpack.shared.config");
module.exports = {
  ...shared,
  entry: path.join(__dirname, "src/index.tsx"),
  plugins: [new HTMLPlugin()],
};
