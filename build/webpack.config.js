const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.js', //入口文件，src下的index.js
    output: {
        path: path.join(__dirname, '../dist'), // 出口目录，dist文件
        filename: '[name].[hash].js' //这里name就是打包出来的文件名，因为是单入口，就是main，多入口下回分解
    },
    devServer: {
        contentBase: path.join(__dirname, "../dist"), //静态文件根目录
        port: 3333, // 端口
        host: '0.0.0.0',
        inline: true,
        hot: true,
        overlay: true,
        compress: true // 服务器返回浏览器的时候是否启动gzip压缩
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebPackPlugin({
            template: "public/index.html",
            filename: "index.html"
        }),
        new CleanWebpackPlugin([path.join(__dirname, 'dist')])
    ],
    devtool: 'eval-source-map'
};
