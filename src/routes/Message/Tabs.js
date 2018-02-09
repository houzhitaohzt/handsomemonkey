import i18n from './../../lib/i18n';
import React,{Component, PropTypes} from "react";
import {browserHistory, withRouter} from 'react-router';
import LocationConnect from '../../components/location/Container';
import {emitter} from '../../common/EventEmitter';
import WebData from '../../common/WebData';

function getActiveTab(pathname, navTabs) {
    let currents, activeTab = 0;
    currents = navTabs.filter((item, index) => (item.url == pathname));
    if (currents && currents.length > 0) {
        activeTab = currents[0].id;
    }
    return activeTab;
}
class MessageWirte extends Component{
	constructor(props){
		super(props);
		let navTabs = [
            // {name: '写消息', url: '/message/wirte', id: 0,className:'foddingicon fooding-write-mails_32'},
            // {name: '已收信息', url: '/message/shou', id: 1,className:'foddingicon fooding-write-mails_32'},
            // {name: '已发信息', url: '/message/send', id: 2,className:'foddingicon fooding-email_32'},
            // {name: '系统消息', url: '/message/system', id: 3,className:'foddingicon fooding-message_32'}
            {name: i18n.t(200763/*未读消息*/), url: '/message/list/1', id: 4, className:'foddingicon fooding-message_32'},
            {name: i18n.t(200764/*已读消息*/), url: '/message/list/2', id: 5, className:'foddingicon fooding-message_32'}
        ];

        let activeTab = getActiveTab(props.location.pathname, navTabs);
        this.state = {
            visible: false,
            isShow: false,
            navContent: navTabs,
            activeTab: activeTab,
            count: WebData.messageCount,
        };
	}
	onClickLink(e, v){
	     let tab = {id: this.props.navigate.currentTab, url: v.url};
        this.props.updateTab(tab);
        browserHistory.push(v.url);
	}

    componentDidMount() {
        emitter.on("fetchMessageCountStream", count => this.setState({count}));
    }

    componentWillUnmount() {
        emitter.off('fetchMessageCountStream');
    }

	render(){
		let array_name = this.state.navContent;
		let count = this.state.count;
		return (
			   <ul className={'message-left'}>
                    {
                        array_name.map((item, i) => {
                            let countMsg = item.id === 4 && count > 0? `(${count})`: "";
                            return (
                                <li onClick={() => this.onClickLink(i, item)} className={this.state.activeTab == item.id ? 'active' : ''} key={i}>
                                    <i className={item.className}/>{item.name}{countMsg}
                                </li>
                            )
                        })
                    }
                </ul>
			  )
	}

}
export default  LocationConnect(withRouter(MessageWirte));