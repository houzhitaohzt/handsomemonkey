import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import {browserHistory, withRouter} from 'react-router';
import LocationConnect from '../../../components/location/Container';
function getActiveTab(pathname, navTabs) {
    let currents, activeTab = 0;
    currents = navTabs.filter((item, index) => (item.url == pathname));
    if (currents && currents.length > 0) {
        activeTab = currents[0].id;
    }
    return activeTab;
}

export class SystemSetHead extends Component {
    constructor(props) {
        super(props);
        this.arrar = [];
        let navTabs = [
            {name: i18n.t(201162/*组织机构*/), url: '/system/organization', id: 0},
            {name: i18n.t(201163/*权限设置*/), url: '/system/authority', id: 1},
            {name: "App权限设置", url: '/system/appauthority', id: 9},
            {name: i18n.t(201164/*用户管理*/), url: '/system/user', id: 2},
            {name: i18n.t(201165/*用户权限*/), url: '/system/user_sec', id: 3},
            {name: i18n.t(201166/*邮件服务器*/), url: '/system/mailserver', id: 4},
            {name: i18n.t(201167/*邮箱设置*/), url: '/system/mailbox', id: 5},
            {name: i18n.t(201168/*编号规则*/), url: '/system/number_rule', id: 6},
            {name: i18n.t(201169/*参数设置*/), url: '/system/price_parameters', id: 7},
            {name: i18n.t(700122/*邮件模板*/), url: '/system/mailTemplate', id: 8}
        ];

        let activeTab = getActiveTab(props.location.pathname, navTabs);
        this.state = {
            visible: false,
            isShow: false,
            navContent: navTabs,
            activeTab: activeTab
        };
        this.onClickLink = this.onClickLink.bind(this);
    }

    onClickLink(e, v) {
        // this.setState({
        //     activeTab: v.id
        // });
        let tab = {id: this.props.navigate.currentTab, url: v.url};
        this.props.updateTab(tab);
        browserHistory.push(v.url);
    }

    render() {
        let array_name = this.state.navContent;
        return (
            <div className={'system-header'}>
                <ul className={'system-header-ul'}>
                    {
                        array_name.map((item, i) => {
                            return (
                                <li onClick={() => this.onClickLink(i, item)} className={this.state.activeTab == item.id ? 'hightL' : ''}
                                    key={i}>{item.name}</li>)
                        })
                    }
                </ul>
            </div>
        )
    }
}
export default LocationConnect(withRouter(SystemSetHead));
