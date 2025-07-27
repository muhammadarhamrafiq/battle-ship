const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",

  plugins: [
    new htmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.html$/i,
        use: "html-loader",
      },
      {
        test: /\.(png|jpg|gif|svg|jpeg)$/i,
        type: "asset/resource",
      },
    ],
  },
};
