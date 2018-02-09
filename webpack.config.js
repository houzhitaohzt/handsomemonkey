const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postcssCssnext = require('postcss-cssnext');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const env = process.env.NODE_ENV || 'production';
const os = require('os');
const moment = require('moment');
const FastUglifyJsPlugin = require('fast-uglifyjs-plugin');
// const Dashboard = require('webpack-dashboard');
// const DashboardPlugin = require('webpack-dashboard/plugin');
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const webpackConfig = {};

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// console.log(config) ------------------------------------ Externals
// ------------------------------------
webpackConfig.externals = {

};
// webpackConfig.externals['react/lib/ExecutionEnvironment'] = true
// webpackConfig.externals['react/lib/ReactContext'] = true
// webpackConfig.externals['react/addons'] = true


function plugins() {
    if (env === 'production') {
        let TransferWebpackPlugin = require('transfer-webpack-plugin');
        return [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new ExtractTextPlugin('style.css', {allChunks: true}),
            new webpack.optimize.DedupePlugin(),
            new FastUglifyJsPlugin({
                // debug设为true可输出详细缓存使用信息:
                debug: false,
                // 默认开启缓存，提高uglify效率，关闭请使用:
                cache: true,
                // 默认缓存路径为项目根目录，手动配置请使用:
                cacheFolder: path.resolve(__dirname, 'build/.uglify'),
                // 工作进程数，默认os.cpus().length
                workerNum: os.cpus().length,
                //default
                sourceMap: false, minimize: true, comments: false,
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    warnings: false,
                    //     sequences: false,
                    //     properties: true,
                    //     dead_code: true,
                    //     conditionals: false,
                    //     comparisons: true,
                    //     evaluate: false,
                    //     booleans: true,
                    //     loops: false,
                    //     unused: false,
                    //     hoist_funs: false,
                    //     if_return: true,
                    //     join_vars: true,
                    //     collapse_vars: false,
                    //     reduce_vars: false,
                    //     cascade: true,
                    //     side_effects: false,
                    //     negate_iife: false
                }
            }),
            // new webpack.NoErrorsPlugin(),
            new webpack.optimize.OccurenceOrderPlugin(),
            // new webpack.DllReferencePlugin({
            //     context: __dirname,
            //     manifest: require('./build/dll/dist/manifest.json')
            // }),
            new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', Infinity),
            new CleanWebpackPlugin(['dist'], {
                root: __dirname,
                verbose: true,
                dry: false
            }),
            new HtmlWebpackPlugin({
                version: moment().format('YYYYMMDDHHmm'),
                hash: true,
                cache: false,
                template: './static/template/index.ejs',
                favicon: './static/template/favicon.ico',
            }),
            // new TransferWebpackPlugin([
            //     {from: 'email', to: 'email'}
            // ], path.join(__dirname))
        ]
    }
    return [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new webpack.optimize.DedupePlugin(),
        // new DashboardPlugin(new Dashboard().setData),
        new ExtractTextPlugin('style.css', {allChunks: true}),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require("./build/dll/debug/manifest.json")
        }),
        new HtmlWebpackPlugin({
            version: moment().format('YYYYMMDDHHmm'),
            template: './static/template/index-dev.ejs',
            favicon: './static/template/favicon.ico',
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', Infinity),
        // new BundleAnalyzerPlugin()
    ]
}
const BASE_CSS_LOADER = 'css?sourceMap&-minimize';
const pathToLessLoader = __dirname + "/dist";
function loaders() {
    let loaders = [];
    let fixs = [
        {
            test: /\.(png|jpg|gif)$/,
            loader: 'url?limit=1&name=images/[hash].[ext]'
        },
        // LESS
        {
            test: /\.less/,
            loader: ExtractTextPlugin.extract("css!less")
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            include: path.resolve(__dirname, 'src'),
            query: {
                presets: [
                    'react-app', 'stage-1'
                ],
                plugins: ['transform-decorators-legacy'],
                cacheDirectory: true
            }
        },
        {
            test: /\.css(\?[a-z0-9=.]+)?$/, // Only .css files
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader?' + JSON.stringify({discardComments: {removeAll: true}})) // Run both loaders
        },
        {test: /\.(woff(2)?|eot|ttf|svg)(\?[a-z0-9=.]+)?$/, loader: 'url-loader?limit=100000&name=fonts/[hash].[ext]'}

    ];
    loaders = loaders.concat(fixs);
    if (env === 'production') {
        loaders.push({
            test: /^.js$/,
            loader: "annotation",
        })
    }
    return loaders;
}

function entry() {
    let vendor = [
        'react',
        'react-dom',
        'react-router',
        'redux',
        'react-modal',
        'react-redux',
        'react-router-redux',
        'redux-thunk',
        'sockjs-client',
        'immutable',
        'object-assign',
        'shallowequal',
        'superagent',
        'superagent-defaults',
        'superagent-promise',
        'react-select',
        'react-virtualized',
        'react-virtualized-select',
        'async-validator',
        'moment',
        './src/common/EventEmitter',
        './src/common/RSA',
        './src/common/xt'
    ];
    if (env === 'production') {
        return {
            app: ["babel-polyfill",'./src/index'],
            vendor
        }
    }
    vendor.push(
        './src/components/Trigger',
        './src/components/TreeSelect',
        './src/components/Tree',
        './src/components/Tip',
        './src/components/TimePicker',
        './src/components/TabSwitch',
        './src/components/Tabs',
        './src/components/Table',
        './src/components/Slider',
        './src/components/ServiceTips',
        './src/components/SelectChange',
        './src/components/Select',
        './src/components/RightKey',
        './src/components/Radio',
        './src/components/Print',
        './src/components/Page',
        './src/components/NavigateTabs',
        './src/components/Menu',
        './src/components/Header',
        './src/components/Loading',
        './src/components/Form',
        './src/components/Dialog',
        './src/components/Calendar',
        './src/components/button',
        './src/components/Animate',
        './src/components/AddSplitNumber',
        './src/components/AddRadio',
        './src/components/AddMoreLanguage',
        './src/components/AddCompetitor',
        './src/components/StateShow',
        './src/components/SystemRuleTem',
        './src/services/apiCall'
    );
    return {
        app: ["babel-polyfill",'./src/dev'],
        //app: './src/dev',
        // vendor
    }

}

function output() {
    if (env === 'production') {
        return {
            path: path.join(__dirname, 'dist'),
            filename: 'fooding_[name]_[chunkhash].js',
            chunkFilename: 'fooding_[id]_[chunkhash].js',
            publicPath: '/'
        }
    }
    return {
        path: path.join(__dirname, 'public'),
        filename: 'fooding_[name].js',
        publicPath: '/'
    }
}

let devtool = 'cheap-module-source-map';
if (env === 'production') {
    devtool = undefined;
}

/* config */
module.exports = {
    devtool: devtool,
    entry: entry(),
    output: output(),
    module: {
        loaders: loaders()
    },
    postcss: [postcssCssnext({browsers: ['last 2 versions']})],
    devServer: {
        port: 5000,
        host: '0.0.0.0',
        historyApiFallback: true,
        disableHostCheck: true,
        proxy: [
            {
                context: ['/33/noohle-message/**'],
                target: 'ws://192.168.1.33',
                ws: true,
                toProxy: true,
                changeOrigin: true,
                pathRewrite: {"/33": ''},
                secure: false
            },
            {
                context: ['/75/noohle-message/**'],
                target: 'ws://192.168.1.75',
                ws: true,
                toProxy: true,
                changeOrigin: true,
                pathRewrite: {"/75": ''},
                secure: false
            },
            {
                context: ['/33/**'],
                target: 'http://192.168.1.33',
                changeOrigin: true,
                pathRewrite: {"/33": ''},
                secure: false
            },
            {
                context: ['/75/**'],
                target: 'http://192.168.1.75',
                changeOrigin: true,
                pathRewrite: {"/75": ''},
                secure: false
            }
        ]
    },
    resolve: {
        root: path.resolve('src'),
        extensions: ['', '.js', '.jsx'],
    },
    externals: webpackConfig.externals,
    plugins: plugins()
};
