require('babel-polyfill');
require('core-js/es6');
require('core-js/es7');
import './lib/i18n';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './lib/store/createStore';
import AppContainer from './containers/AppContainer';
import './styles/bootstrap/css/bootstrap.css';
import './styles/noohle.less';

import "./components/Table/assets/index.less";
import "./components/Table/assets/fooding/index.less";
import "./components/Table/assets/fooding/second.less";
import "./components/Table/assets/animation.less";
import "./components/Dropdown/assets/index.less";
import "./components/Dropdown/assets/color_filter.less";
import "./components/RightKey/react-contextmenu.less";
import "./components/Calendar/assets/index.less";
import "./components/Checkbox/assets/index.less";
import "./components/Form/assets/index.less";
import "./components/Menu/assets/index.less";
import "./components/Radio/asset/index.less";
import "./components/TimePicker/assets/index.less";
import "./components/Tip/assets/index.less";
import "./components/Tip/assets/second.less";
import "./components/Trigger/assets/index.less";
import "./components/Dialog/dialog.less";
import "./components/Select/assets/index.less";
import "./styles/fonts/fontsize.less";
import './common/common';
import "./styles/System/Total.less";
// ========================================================
// Store Instantiation
// ========================================================
import {useStrict} from 'mobx';
const initialState = window.___INITIAL_STATE__;
const store = createStore(initialState);

useStrict(true);
// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.body.appendChild(document.createElement('root'));

let domRender = routes => {
    ReactDOM.render(
        <AppContainer store={store} routes={routes}/>,
        MOUNT_NODE
    )
};

let render = () => {
    domRender(require('./routes/index').default(store));
};

// This code is excluded from production bundle
if (module.hot) {
    // Development render functions
    const renderApp = render;
    const renderError = (error) => {
        const RedBox = require('redbox-react').default;

        ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    };

    // Wrap render in try/catch
    render = () => {
        try {
            renderApp()
        } catch (error) {
            renderError(error)
        }
    };

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
        setImmediate(() => {
            ReactDOM.unmountComponentAtNode(MOUNT_NODE);
            render()
        })
    )
}
// ========================================================
// Go!
// ========================================================
render();
