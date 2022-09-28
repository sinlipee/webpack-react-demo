const path = require('path')
const dotenv = require('dotenv')
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDev = process.env.NODE_ENV === 'development';
/**
 * Setup env for environment
 */
const basePath = path.join(__dirname) + '/.env';
const envPath = basePath + '.' + process.env.NODE_ENV;
const finalPath = fs.existsSync(envPath) ? envPath : basePath;
const fileEnv = dotenv.config({ path: finalPath });



module.exports = {
    entry: ['./src/scss/bundle.scss'],
    output: {
        path: path.join(__dirname, "/dist"), // the bundle output path
        filename: "bundle.js", // the name of the bundle
    },
    resolve: {
        extensions: [".js", ".scss"],
    },
    module: {
        rules: [
            {
                test: /\.(css|sass|scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: false,
                        },
                    },
                    {
                        loader: "resolve-url-loader",
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: false,
                        },
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+|scss)?$/,
                use: [
                    {
                        loader: "file-loader",
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html", // to import index.html file inside index.js
        }),
        new MiniCssExtractPlugin({
            filename: "bundle.css",
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(fileEnv.parsed),
        }),
        new FileManagerPlugin({
            events: {
                onEnd: {
                    copy: [
                        {
                            source: path.resolve(__dirname, "dist/*.{css,js}"),
                            destination: path.resolve(
                                __dirname,
                                "theme-app-extension/assets/"
                            ),
                        },
                    ],
                },
            },
        }),
    ],
    devServer: {
        port: 3030, // you can change the port
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // .js and .jsx files
                exclude: /node_modules/, // excluding the node_modules folder
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.(sa|sc|c)ss$/, // styles files
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
                loader: "url-loader",
                options: { limit: false },
            },
        ],
    },
};
