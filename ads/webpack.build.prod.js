const HtmlWebpackPlugin = require("html-webpack-plugin");
const { default: merge } = require("webpack-merge");
const common = require("./webpack.common");
const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
})