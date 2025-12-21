
const HtmlwepackPlugin = require('html-webpack-plugin');
const { resolve, join } = require('path');

 const port = 3200;
module.exports = {
    devServer: {
        historyApiFallback: true, // For react-router
        static: {
            directory: join(__dirname, '../dist'),
        },
        hot: true,
        port
    },

    plugins: [
        new HtmlwepackPlugin({
            filename: 'index.html',
            favicon: './public/favicon.ico',
            template: join(__dirname, '../src/index-dev.html'),
            inject: true,
        })
    ]
}