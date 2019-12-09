let HtmlPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let MiniCSSExtractPlugin = require('mini-css-extract-plugin');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let rules = require('./webpack.config.rules');
let path = require('path');

rules.push({
    test: /\.css$/,
    use: [
        MiniCSSExtractPlugin.loader,
        {
            loader: 'style-loader' 
        },
        {
            loader: 'css-loader' 
        }
    ]
});

module.exports = {
    entry: {
        index: './src/cookie.js',
        dnd: './src/cookie.js'
    },
    devServer: {
        index: './src/cookie.html'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve('dist')
    },
    devtool: 'source-map',
    module: { rules },
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                compress: {
                    drop_debugger: false
                }
            }
        }),
        new MiniCSSExtractPlugin('styles.css'),
        new HtmlPlugin({
            title: 'Main Homework',
            template: './src/cookie.hbs',
            filename: './src/cookie.html',
            chunks: ['cookie']
        }),
        new HtmlPlugin({
            title: 'Div Drag And Drop',
            template: './src/cookie-content.hbs',
            filename: './src/cookie-content.html',
            chunks: ['cookie-content']
        }),
        new CleanWebpackPlugin(['dist'])
    ]
};
