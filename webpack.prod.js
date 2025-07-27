const path = require("path");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");

module.exports = merge(commonConfig, {
  mode: "production",
  output: {
    filename: "script.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
});
