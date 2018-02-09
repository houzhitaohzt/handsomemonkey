const webpack = require('webpack');
const path = require('path');
const isDebug = process.env.NODE_ENV === 'development';
const outputPath = isDebug ? path.join(__dirname, 'build/dll/debug') : path.join(__dirname, 'build/dll/dist');
const fileName = '[name].js';

// 资源依赖包，提前编译
const lib = [
    'react',
    'react-dom',
    'react-router',
    'react-modal',
    'prop-types',
    'clone',
    'create-react-class',
    'rc-tree',
    'history',
    'redux',
    'react-redux',
    'redux-thunk',
    'react-router-redux',
    'immutable',
    'whatwg-fetch',
    'superagent',
    'superagent-defaults',
    'superagent-promise',
    'redbox-react',
    'react-css-modules',
    'moment',
    'rc-tree',
    'rc-form',
    'rc-select',
    'rc-upload',
    'rc-progress',
    'rc-tooltip',
    'rc-collapse',
    'rc-align',
    'lodash',
    'lodash.isarray',
    'lodash.noop',
    'lodash.keys',
    'lodash.get',
    'lodash.has',
    'lodash.isfunction',
    'lodash.isarguments',
    'lodash._getnative',
    'react-select',
    'react-virtualized',
    'react-virtualized-select',
    'url',
    'sockjs-client',
    'uuid',
    'object-path',
    'core-js',
    'antd',
    'strip-ansi',
    'classnames',
    'async-validator',
    'component-classes',
    'css-animation',
    'dom-scroll-into-view',
    'hoist-non-react-statics',
    'object-assign',
    'shallowequal',
    'timers-browserify',
    'handsontable',
    'mobx',
    'mobx-react',
    'react-big-calendar',
    'react-data-binding',
    'react-draggable',
    'react-draggable-list',
    'react-dropdown',
    'react-grid-layout',
    'react-infinite-calendar',
    'jquery',
    'bootstrap',
];

const plugin = [
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    }),
    new webpack.DllPlugin({
        /**
         * path
         * 定义 manifest 文件生成的位置
         * [name]的部分由entry的名字替换
         */
        path: path.join(outputPath, 'manifest.json'),
        /**
         * name
         * dll bundle 输出到那个全局变量上
         * 和 output.library 一样即可。
         */
        name: '[name]',
        context: __dirname
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        mangle: {
            except: ['$', 'exports', 'require']
        },
        compress: {warnings: false},
        output: {comments: false}
    })
];

if (!isDebug) {
    plugin.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
    )
}

module.exports = {
    // devtool: '#source-map',
    entry: {
        lib: lib
    },
    output: {
        path: outputPath,
        filename: fileName,
        /**
         * output.library
         * 将会定义为 window.${output.library}
         * 在这次的例子中，将会定义为`window.vendor_library`
         */
        library: '[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: plugin
};
