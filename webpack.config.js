const path = require("path");

module.exports = {
  devtool: "source-map",
  entry: {
    background: path.join(__dirname, "src", "background", "index.js"),
    "desktop-content": path.join(
      __dirname,
      "src",
      "content-scripts",
      "desktop.js"
    ),
    "mobile-content": path.join(
      __dirname,
      "src",
      "content-scripts",
      "mobile.js"
    ),
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist"),
  },
};
