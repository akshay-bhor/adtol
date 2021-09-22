const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack'); 

require('dotenv').config(); 

module.exports = {
    entry: {
        text: "./js/text.js",
        native: "./js/native.js",
        banner: "./js/banner.js",
        feed: "./js/feed.js",
        pop: "./js/pop.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude : [
                    /\bcore-js\b/,
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { useBuiltIns: "usage", corejs: 3 }]
                        ],
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: 'body'
        }),
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env)
        }),
    ]
}