const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");

module.exports = merge(commonConfig, {
  mode: "development",

  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/index.html"],
  },
});
