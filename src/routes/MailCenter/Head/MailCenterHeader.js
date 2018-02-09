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

            //{name: i18n.t(200676/*邮件服务*/), url: '/mailCenter/server', id: 0},
            {name: i18n.t(200677/*邮件群发*/), url: '/mailCenter/send', id: 1},
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
