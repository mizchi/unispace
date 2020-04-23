module.exports = {
  roots: [
    // "<rootDir>/packages/editor/src/",
    "<rootDir>/packages/filer/src",
    "<rootDir>/packages/filer/examples/tree",
    // "<rootDir>/packages/layout/src",
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
