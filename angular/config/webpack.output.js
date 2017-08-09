'use strict';

const path = require('path');

module.exports = {
    path: path.join(__dirname, '..', '..', 'src', 'main', 'resources', 'public'),
    filename: '[name].[chunkhash].bundle.js',
    sourceMapFilename: '[name].[chunkhash].bundle.map',
    chunkFilename: '[id].[chunkhash].chunk.js'
};
