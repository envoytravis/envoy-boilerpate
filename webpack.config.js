var webpack = require('webpack');

module.exports = {
    entry: {
        main: './app/scripts/main',
    },
    output: {
        filename: '[name].js',
        chunkFilename: 'chunks/[id].js',
        path: __dirname + '/build/scripts',
        publicPath: '/scripts/'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            Velocity: 'velocity-animate',
        })
    ]
};