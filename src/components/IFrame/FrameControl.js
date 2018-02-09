import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import NavConnect from '../NavigateTabs/containers/AddContainer';
import Location from '../location/Container';
import {successTips, errorTips} from '../ServiceTips';
import xt from '../../common/xt';
import {emitter} from '../../common/EventEmitter';
import i18n from '../../lib/i18n';

class FrameControl extends Component {

    componentDidMount() {
        this.onBindFunc();
    }

    /**
     * 绑定相关的函数
     */
    onBindFunc = ()=> {
        window.navTabs = {
            close: this.closeTabs.bind(this),
            open: this.openTabs.bind(this),
            replace: this.replaceTabs.bind(this)
        };
        window.emitter = emitter;
        window.Tip = {successTips, errorTips};
    };

    /**
     * 关闭当前标签
     * @param options
     */
    closeTabs(options) {
        this.props.navCloseCurrentTab();
    };
    /**
     * 替换
     * @param title
     * @param url
     * @param [query]
     * @param [args]
     */
    replaceTabs(title, url, query = {}, args = {}){
        let {navReplaceTab} = this.props;
        let src = url.split("?")[0];
        let name = /\d+/g.test(title)? i18n.t(title): title;
        navReplaceTab({name, component: name,  url: src});
        this.props.router.push({pathname: src, query: Object.assign({}, query, xt.parseQueryParameter(url)), state: args});
    }

    /**
     * 打开新标签
     * @param title
     * @param url
     * @param [query]
     * @param [args]
     */
    openTabs (title, url, query = {}, args = {}) {
        let {navAddTab} = this.props;
        let src = url.split("?")[0];
        let name = /\d+/g.test(title)? i18n.t(title): title;
        navAddTab({name, component: name, url: src});
        this.props.router.push({pathname: src, query: Object.assign({}, query, xt.parseQueryParameter(url)), state: args});
    }

    render = ()=> null;
}

export default NavConnect(Location(withRouter(FrameControl)));
