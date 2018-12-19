const path = require('path');
const webpack = require('webpack');

const settings = {
    entry: [
        'babel-polyfill',
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        compress: true,
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                include: [path.join(__dirname, 'src')],
                use: [{loader: 'eslint-loader'}]
            },
            {
                test: /\.js$/,
                include: [path.join(__dirname, 'src')],
                use: [
                    {
                        loader: 'babel-loader',
                        query: {cacheDirectory: true}
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg|woff(2)?|ttf|eot|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            context: __dirname
                        }
                    }
                ]
            },
            {
                test: /\.s?css$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {loader: 'sass-loader'},
                    {loader: 'postcss-loader'},
                ]
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({options: {}}),//для eslint
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ]
};

module.exports = settings;