var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: ['./src/index.ts'],
    output: {
        path: path.resolve('./dist'),
        filename: 'redux-app.min.js'
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            { test: /.ts$/, use: ['ts-loader', 'ts-nameof-loader'] }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve("./src"), "node_modules"]
    }    
};