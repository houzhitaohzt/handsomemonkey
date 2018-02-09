import i18n from './../../../../lib/i18n';
/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 15:18
 */
import React from 'react';
import xt from '../../../../common/xt'

let defaultAvatar = require('../../assets/default.png');
let loadingImg = require('../../assets/loading.gif');
let reSendImg = require('../../assets/re_send.svg');
let dataFmt = {sameDay: 'LT', nextDay: '[明天] LT', lastDay: '[昨天] LT', month: 'MM-DD LT', year: 'YYYY-MM-DD LT', week: 'dddd LT'};
export default class ImMessageContainer extends React.PureComponent {

    constructor (props) {
        super(props);
        this.state = {

        };

        this.fristShow = false;
        this.isToBottom = false;
    }

    componentWillReceiveProps(props) {
        if(props.visible && props.visible !== this.props.visible){
            !this.fristShow && this.toBottom();
            this.fristShow = true;
        }

        if(props.messageList.length !== this.props.messageList.length){
            this.isToBottom = true;
        }
    }

    componentDidUpdate() {
        this.isToBottom && this.toBottom();
        this.isToBottom = false;
    }

    toBottom = ()=> {
        this.msgContainer.scrollTop = this.msgContainer.scrollHeight;
    };

    onRepeat = (item)=> {
        this.props.repeat && this.props.repeat(item);
    };

    //2条消息时间间距需大于1分钟
    renderTime = (item, index)=> {
        if(index > 0){
            let lastItem = this.props.messageList[index - 1];
            if(item.date - lastItem.date < 1000 * 60){
                 return null;
            }
        }
        return (
            <div className='im-message-container-time'>
                <span>{xt.date.formatCalendarNow(item.date, dataFmt)}</span>
            </div>
        )
    };

    renderMsgAvatar = (item)=> {
        let { user, messageList } = this.props;
        let avatar = item.type === 2? user.avatar: defaultAvatar;
        return (
            <img key='avatar' className='im-avatar' src={avatar}/>
        );
    };

    renderLoading = (item)=> {
        if(item.type === 2 || xt.isEmpty(item.status)) return null;
        if(item.status === 2) {
            return <div className='im-message-container-loading'><img src={loadingImg}/></div>
        } else if(item.status === 0){
            return (
                <div title={i18n.t(700108/*重发*/)} className='im-message-container-le' onClick={this.onRepeat.bind(this, item)}>
                    <img src={reSendImg}/>
                </div>
            );
        } else {
            return null;
        }
    };

    renderMsgItem = (item)=> {
        let rightClass = item.type === 2? "" : "im-message-container-sm21";
        return (
            <div key='msg' className='im-message-container-sm1'>
                { this.renderLoading(item) }
                <div className={`im-message-container-sm2 ${rightClass}`}>
                    <span>{item.message}</span>
                </div>
            </div>
        )
    };

    renderMessage = (item, index)=>{

        let showView = [this.renderMsgAvatar(item), this.renderMsgItem(item)];
        let rightClass = item.type === 2? "": "im-message-container-smr";
        return (
            <div key={index}>
                { this.renderTime(item, index) }
                <div className={`im-message-container-sm ${rightClass}`}>
                    { item.type === 2? showView: showView.reverse() }
                </div>
            </div>
        )
    };

    render() {
        let { messageList, user } = this.props;
        return (
            <div className='scroll im-message-container-center' ref={rf => this.msgContainer = rf}>
                { messageList.map(this.renderMessage) }
            </div>
        );
    }
}
