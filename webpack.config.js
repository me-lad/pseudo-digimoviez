const path = require("path");

module.exports = {
  entry: "./public/js/App.js",
  output: {
    path: path.resolve(__dirname, "public/js"),
    filename: "webpack.bundle.js",
  },
  mode: "production",
};
