var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    entry: {
        polyfill: "./src/app/polyfill",
        vendor: "./src/app/vendor",
        app: "./src/app/main"
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                loader: [
                    "babel-loader",
                    {
                        loader: "awesome-typescript-loader",
                        options: {
                            configFileName: helpers.root("tsconfig.json")
                        }
                    },
                    "angular2-template-loader"
                ],
                exclude: [/node_module/]
            },
            {
                test: /\.js/,
                loader: "babel-loader",
                exclude: [/node_mobule/],
                query: {
                    presets: ["es2015"]
                }
            },
            {
                test: /\.html/,
                loader: "html-loader"
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: 'img/[name].[ext]'
                        }
                    },
                    /* {
                        loader: "image-webpack-loader",
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            // the webp option will enable WEBP
                            webp: {
                                quality: 75
                            }
                        }
                    } */
                ]
            },
            {
                test: /\.scss$/, //rule for EXTERNAL CSS wich is common for all project gather to one extrental CSS file common.css
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract({
                    //fallback: 'style-loader',
                    use: [
                        {
                            loader: "css-loader" // creates style nodes from JS strings
                        },
                        {
                            loader: "postcss-loader",
                        },
                        {
                            loader: "sass-loader" // compiles Sass to CSS
                        }
                    ]
                })
            },
            {
                test: /\.scss$/, //rule for CSS in components
                include: helpers.root("src", "app"),
                use: [
                    {
                        loader: "raw-loader" // creates style nodes from JS strings
                    },
                    {
                        loader: "postcss-loader",
                    },
                    {
                        loader: "sass-loader" // compiles Sass to CSS
                    }
                ]
            }
        ]
    },
    plugins: [
        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./src'), // location of your src
            {} // a map of your routes
        ),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfill']
        }),

        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
}