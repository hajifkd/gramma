const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (_env, argv) => {
    const isProduction = argv.mode === 'production';
    return {
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
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ]
                }
            ]
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { context: 'src/', from: '**/*.html', to: '[path][name][ext]' },
                    { context: 'src/', from: '**/*.png', to: '[path][name][ext]' },
                    { context: 'src/', from: '**/*.json', to: '[path][name][ext]' }
                ],
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css'
            })
        ],
        resolve: {
            extensions: ['.ts', '.js']
        },
        optimization: {
            minimize: isProduction
        }
    };
};