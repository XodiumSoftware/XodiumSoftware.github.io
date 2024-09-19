const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src/assets/ts/xodium.index.ts"),
  devServer: {
    static: path.resolve(__dirname, "src"),
    compress: true,
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "src/assets/js"),
  },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  mode: "development",
};
