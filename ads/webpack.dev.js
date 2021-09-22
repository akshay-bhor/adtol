const HtmlWebpackPlugin = require("html-webpack-plugin");
const { default: merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
    mode: 'development',
    output: {
        filename: "[name].bundle.js",
    },
})