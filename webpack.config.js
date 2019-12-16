const path = require("path");

module.exports = [
  // Library
  {
    entry: "./src/lib/exports.ts",
    devtool: "inline-source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dist")
    }
  },
  // Program
  {
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "build")
    }
  },
];
