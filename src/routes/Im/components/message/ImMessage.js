/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 15:18
 */
import React from 'react';
import ImMessageContainer from './ImMessageContainer';
import i18n from './../../../../lib/i18n';
import Tooltip from '../../../../components/Tip';

let defaultAvatar = require('../../assets/default.png');
export default class extends React.PureComponent {

    constructor (props) {
        super(props);

        this.state = {
            writeMsg: '',
        };
    }

    onWriteChange = (event)=> {
        let value = event.target.value;
        this.setState({ writeMsg: value});
    };

    renderTitle = ()=> {
        let { user, messageList } = this.props;
        return (
            <div className='im-message-container-title' >
                <div><img className='im-avatar' src={user.avatar}/></div>
                <div>
                    <div><span className='im-message-list-title noLineFeed'>{user.name}</span></div>
                    {/*<div><span className='im-message-list-msg noLineFeed'></span></div>*/}
                </div>
            </div>
        )
    };

    onTextKeyDown = (event)=> {
        let that = this;
        if(event.keyCode === 13 && !event.shiftKey){
            event.stopPropagation();
            event.preventDefault();
            that.onSend();
        }
    };

    onSend = ()=> {
        let that = this;
        let { writeMsg } = that.state;
        if(writeMsg.length){
            let { send, user } = that.props;
            send && send(user, writeMsg);
            that.setState({ writeMsg: ''});
        }
    };

    onRepeat = (message: string)=> {
        let that = this;
        let { repeat, user } = that.props;
        repeat && repeat(user, message);
    };

    openHistory = ()=> {
        this.props.openDrawer(1);
    };

    openFace = ()=> {

    };

    renderFace = ()=> {

        return (
            <div>jskldgjklsjgkl</div>
        )
    };

    renderWrite = ()=> {
        let { writeMsg } = this.state;
        return (
            <div className='im-message-container-write'>
                <div className='im-message-container-write-1'>
                    <div>
                        <div><i className='foddingicon fooding-annex'/></div>
                        <div><i className='foddingicon fooding-expression'/></div>
                        <div onClick={this.openHistory}><i className='foddingicon fooding-history-record'/></div>
                    </div>
                    <textarea className='scroll' value={writeMsg} onChange={this.onWriteChange} onKeyDown={this.onTextKeyDown}/>
                </div>
                <div className={`im-message-container-write-2 ${writeMsg.length? 'im-message-container-write-2-active' : ''}`} onClick={this.onSend}>
                    <span style={{color: writeMsg.length? '#2095f2': '#999'}} className='noselect'>{i18n.t(200427/*发送*/)}</span>
                </div>
            </div>
        )
    };

    render() {
        let { messageList, user, visible } = this.props;
        return (
            <div className='im-message-container' style={{display: visible? 'inherit': 'none'}}>
                { this.renderTitle() }
                <ImMessageContainer user={user} messageList={messageList} repeat={this.onRepeat} visible={visible}/>
                { this.renderWrite() }
            </div>
        );
    }
}
