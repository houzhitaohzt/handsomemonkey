/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 15:18
 */
import React from 'react';

import ImList from './ImList';
import ImMessage from './ImMessage';
import UUID from 'uuid';
import Drawer from 'rc-drawer';
import Message from '../../../../lib/message';
import {emitter} from '../../../../common/EventEmitter';
import {apiGet, apiPost, apiForm, API_FOODING_MESSAGE} from "../../../../services/apiCall";
import {errorTips, successTips} from "../../../../components/ServiceTips";
import WebData from '../../../../common/WebData';

import ImHistory from './ImHistory';

let defaultAvatar = require('../../assets/default.png');
let noMsgImg = require('../../assets/no_msg.png');
// status = 0 发送失败, 1 已发送, 2 发送中, 3 未读, 4 已读
export default class extends React.PureComponent {

    constructor(props) {
        super(props);

        let message = new Map();
        this.state = {
            userList: [],
            messageMap: message,
            selectUser: null,
            frameAry: [],
            drawerOpen: false,
            drawerType: -1,
        };
        this.offAry = [];
    }

    componentDidMount() {
        emitter.on("fetchChatMessageStream", this.receiveMessage);
        this.requestChatList();
    }

    componentWillUnmount() {
        emitter.off("fetchChatMessageStream", this.receiveMessage);
    }

    componentWillReceiveProps(props) {
        if( !props.visible){
            this.setState({ selectUser: null });
        }
    }

    /**
     * 获取所有聊天窗口
     */
    requestChatList = () => {
        let that = this;
        apiGet(API_FOODING_MESSAGE, '/chatUser/getCharUserByUserId', {},
            ({data}) => {
                this.appendChatList(data);
            }, (error) => {
                window.Tip.errorTips("初始化聊天信息失败!");
            });
    };

    appendChatList = (data)=> {
        let that = this;
        let {userList, messageMap} = this.state;
        data.forEach(room => {
            let chatRoom = room.chatRoom,
                chatUser = chatRoom.members.find(da => String(da.userId) !== String(room.userId));
            if (chatUser) {
                let chat = {
                    id: String(chatUser.userId),
                    roomId: chatRoom.id,
                    type: chatRoom.roomTypeId,
                    name: chatUser.staffLocalName,
                    avatar: defaultAvatar,
                };
                messageMap.set(chat.id, []);
                userList.push(chat);

                that.requestOffline(chat);
            }
        });
        that.setState({userList: userList.slice(), messageMap});
    };

    requestOffline = (user)=> {
        let that = this;
        let { messageMap } = that.state;
        let message = messageMap.get(String(user.id));
        if( that.offAry.indexOf(String(user.id)) === -1 ){
            that.offAry.push(String(user.id));
            apiGet(API_FOODING_MESSAGE, '/singleChatLog/getLogByRoomId', {
                chatRoomId: user.roomId,
            }, ({ data }) => {
                let chatMsg = [];
                data.forEach(msg => {
                    let chat = {
                        id: msg.id,
                        status: 3,//未读
                        type: String(msg.sender.userId) === String(user.id) ? 2: 1,
                        date: msg.createDate,
                        message: msg.content
                    };
                    chatMsg.push(chat);
                });
                messageMap.set(String(user.id), chatMsg.concat(message));
                that.setState({ messageMap: new Map(messageMap) });
            }, error => {   });
        }
    };

    //接收消息
    receiveMessage = (message) => {
        let selectUser = this.state.selectUser || {};
        let user = {
            id: message.sender.userId,
            name: message.sender.staffLocalName,
            avatar: defaultAvatar,
            roomId: message.chatRoom.id
        };
        this.appendUser(user);
        this.appendMessage(user, {
            id: message.id,
            status: String(selectUser.id) === String(user.id)? 4: 3,//未读
            type: 2,
            date: message.createDate,
            message: message.content
        });
        if(String(selectUser.id) === String(user.id)){
            Message.markChatReaded(message.id);
        }
    };

    //删除一个,聊天窗口
    onRemoveChat = (item) => {
        let messageMap = this.state.messageMap;
        if(messageMap.get(String(item.id)).findIndex(da => da.status === 3) !== -1){
            return alert("当前会话有未读消息, 不可删除!");
        }

        let selectUser = this.state.selectUser;
        let userList = Array.from(this.state.userList);
        let index = userList.findIndex(da => da.id === item.id);
        if (index !== -1) {
            userList.splice(index, 1);
        }
        if (selectUser && item.id === selectUser.id) {
            selectUser = null;
        }
        this.setState({userList, selectUser});

        apiPost(API_FOODING_MESSAGE, "/chatUser/removeChatRoom", {
            "userId": String(WebData.user.data.id),
            "chatRoomId": [
                item.roomId,
            ]
        }, data => {}, error => console.log(error));
    };

    appendUser = (user) => {
        let {userList, messageMap} = this.state;
        let msgUser = userList.find(da => String(da.id) === String(user.id));
        if (!msgUser) {
            msgUser = {...user, avatar: defaultAvatar};
            userList = [msgUser].concat(userList);
            messageMap.set(String(msgUser.id), []);
        }
        this.setState({userList, messageMap});
    };

    //打开一个消息对话框
    openMessage = (user) => {
        let that = this;
        let {userList, messageMap} = that.state;
        let msgUser = userList.find(da => String(da.id) === String(user.id));
        if (!msgUser) {
            msgUser = {...user, avatar: defaultAvatar};
            messageMap.set(String(msgUser.id), []);
            apiForm(API_FOODING_MESSAGE, '/chatRoom/createChatRoom', {receiverId: user.id},
                ({data: room}) => {
                    msgUser = {...msgUser, type: room.roomTypeId, roomId: room.id};
                    userList = [msgUser].concat(userList);
                    that.setState({userList, selectUser: msgUser, messageMap});
                }, error => {
                    window.Tip.errorTips("初始化单聊失败!");
                });
        } else {
            that.setState({selectUser: msgUser});
        }
    };

    onUserChange = (item) => {
        let that = this;
        if(item === that.state.selectUser) return;
        if (item) {
            //设置此人所有消息为已读
            let { messageMap } = that.state;
            let message = messageMap.get(String(item.id));
            message.forEach(da => da.status = 4);
            messageMap.set(String(item.id), message.slice());
            that.setState({selectUser: item, messageMap});

            that.updateMsgStatus(item);
        } else {
            that.setState({selectUser: null});
        }
    };

    //更新这个房间所有消息为已读
    updateMsgStatus = (item)=> {
        apiGet(API_FOODING_MESSAGE, "/singleChatLog/updateChatStatus", {
            chatRoomId: item.roomId
        }, ()=> {
        }, error => {
        });
    };

    onRepeat = (user, msg) => {
        let {messageMap} = this.state;
        let message = messageMap.get(String(user.id));
        let sendMsg = message.find(da => String(da.id) === String(msg.id));
        sendMsg.status = 2;

        message = Array.from(message);
        messageMap.set(String(user.id), message);
        this.setState({userMessage: message, messageMap});
        this.sendRequest(user, sendMsg);
    };

    sendMessage = (user, msg) => {
        let sendMsg = {
            id: UUID.v4(),
            status: 2,//发送中
            type: 1,
            date: Date.now(),
            message: msg
        };
        this.appendMessage(user, sendMsg);
        this.sendRequest(user, sendMsg);
    };

    appendMessage = (user, msg) => {
        let {messageMap} = this.state;
        let message = Array.from(messageMap.get(String(user.id)));
        message.push(msg);
        messageMap.set(String(user.id), message);
        this.setState({messageMap, userMessage: message});
    };

    sendRequest = (user, sendMsg) => {
        let that = this;

        // console.log(Message.sendMessage({
        //     "senderId": String(WebData.user.data.id),
        //     "receiveId": String(user.id),
        //     "chatRoomId": String(user.roomId),
        //     "content": sendMsg.message
        // }))

        apiPost(API_FOODING_MESSAGE, "/singleChatLog/sendChat", {
            "senderId": String(WebData.user.data.id),
            "receiveId": String(user.id),
            "chatRoomId": String(user.roomId),
            "content": sendMsg.message
        }, (response) => {
            this.sendMsgStatus(user, sendMsg, 1);
        }, (error) => {
            this.sendMsgStatus(user, sendMsg, 0);
            console.log(error);
        }, {isLoading: false});
    };

    onOpenChange = (open)=> {
        this.setState({ drawerOpen: open});
    };

    openDrawer = (drawerType)=> {
        this.setState({ drawerOpen: true, drawerType});
    };

    closeDrawer = ()=> {
        this.setState({ drawerOpen: false});
    };

    sendMsgStatus = (user, sendMsg, status) => {
        let that = this;
        let {messageMap} = that.state;
        let message = messageMap.get(String(user.id));
        message.find(da => String(da.id) === String(sendMsg.id)).status = status;
        message = Array.from(message);
        messageMap.set(String(user.id), message);
        that.setState({userMessage: message, messageMap});
    };

    renderDrawer = ()=> {
        let {  } = this.props;
        let { selectUser, drawerType, drawerOpen} = this.state;
        let Comp = null;
        switch ( drawerType ){
            case 1: Comp = ImHistory; break; //历史记录
        }
        return (
            <div className='im-message-drawer-side-container'>
                <div className='im-message-drawer-title'>
                    <div><span>历史记录</span></div>
                    <div onClick={this.closeDrawer}>
                        <i className='foddingicon fooding-fork'/>
                    </div>
                </div>
                {Comp && <Comp selectUser={selectUser} drawerOpen={drawerOpen}/>}
            </div>
        );
    };

    renderNoMsg = () => (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1}}><img src={noMsgImg}/></div>
    );

    render() {
        let that = this;
        let {} = that.props;
        let {userList, messageMap, userMessage, selectUser, drawerOpen} = that.state;
        let component = [];
        userList.forEach((user, index) => {
            component.push(
                <ImMessage visible={user === selectUser} user={user}
                           key={user.id + "-" + index} messageList={messageMap.get(String(user.id))}
                           send={that.sendMessage} repeat={that.onRepeat} openDrawer={that.openDrawer}
                />
            );
        });
        return (
            <Drawer
                position={'right'}
                touch={true}
                open={drawerOpen}
                docked={false}
                enableDragHandle={true}
                transitions={true}
                dragToggleDistance={30}
                onOpenChange={this.onOpenChange}
                sidebar={this.renderDrawer()}
                style={{marginTop: '58px'}}
                sidebarStyle={{backgroundColor: '#F1F4F8', borderBottomRightRadius: '6px', willChange: 'inherit'}}
                overlayStyle={{backgroundColor: 'transparent'}}
            >
                <div className='im-message'>
                    <ImList userList={userList} messageList={messageMap} onChange={that.onUserChange} user={selectUser}
                            remove={this.onRemoveChat}/>
                    {!selectUser ? this.renderNoMsg() : null}
                    {component}
                </div>
            </Drawer>

        );
    }
}
