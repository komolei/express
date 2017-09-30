const path = require('path');
const webpack = require('webpack');
const extractTextWebpackPlugin = require('extract-text-webpack-plugin');
const UgLifyJsPlugin = require("uglifyjs-webpack-plugin");
// const importBabel = require("babel-plugin-import");
// const 

let app = './app/view/js/app.js'
// let app = { app: ['babel-polyfill', 'react-hot-loader/patch', './app.js'] }
// let app = { app: ['babel-polyfill', 'react-hot-loader/patch', './newSrc/index.js'] }
// let app = { app: ['./Ant/index.js'] }
// let app = { app: ['babel-polyfill', './app.js'] }
// use for src's index.js
// let app = { app: ['babel-polyfill', './src/index.js'] }

module.exports = {
    entry: app,
    output: {
        path: path.resolve(__dirname, './app/view/dist'),
        filename: '[name].js',
        publicPath: "./app/view/dist/"
    },
    // devtool: 'source-map',
    // devServer: {
    //     hot: true,
    //     contentBase: path.resolve(__dirname, "./"),
    //     publicPath: './'
    // },
    resolve: {
        alias: {
            im: path.resolve(__dirname, "./js/index.jsx"),
            tryagain: path.resolve(__dirname, "./js/tryagain.jsx"),
        }
    },
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                exclude: /node_moudles/,
                use: {
                    loader: "babel-loader",
                    //  options: {
                    //     presets: [
                    //         "es2015", {
                    //             "modules": false,
                    //         }]
                    // }
                }
            },
            {
                test: /\.scss$/,
                use: extractTextWebpackPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader", { loader: 'postcss-loader' }, {
                            loader: "sass-loader"
                        }
                    ]
                })
            },
            {
                test: /\.css$/,
                // exclude: /node_modules/,
                // use: {
                //     loader: 'css-loader',
                //     options: {
                //         sourceMap: true
                //     }
                // }
                use: extractTextWebpackPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: 'css-loader',
                    }, {
                        loader: 'postcss-loader',
                        // options: {
                        //     // config: {
                        //     //     path: './postcss.config.js'
                        //     // }
                        // }
                    }]
                    // use: ['css-loader', 'postcss-loader']
                })
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            outputPath: 'images/',
                            publicPath: './'
                        }
                    }]
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        // attrs: [':data-src'],
                        minimize: true,
                    }
                }
            }

        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.HotModuleReplacementPlugin({
        //     // Options...
        // }),
        new extractTextWebpackPlugin("[name].css"),
        new UgLifyJsPlugin({
            test: /\.js($&#124;\?)/i,
            include: /\/dist/,
            compress: true,
            mangle: true,
            beautify: true,
            // comments: true,
        }),
        // new importBabel(
        //     {
        //         libraryName: "antd",
        //         style: "css",
        //     })
    ]
}