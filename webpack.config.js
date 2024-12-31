const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        content_script: './src/content_script.ts',
        background: './src/background.ts',
        'options/options': './src/options/options.ts',
        'popup/popup': './src/popup/popup.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { context: 'src/' ,from: '**/*.html', to: '[path][name][ext]' },
                { context: 'src/' ,from: '**/*.png', to: '[path][name][ext]' },
                { context: 'src/' ,from: '**/*.json', to: '[path][name][ext]' }
            ],
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js']
    }
};