
import SockJS from 'sockjs-client';
import Stomp from './stomp';
import WebData from '../common/WebData';
import {buildUrl} from '../services/apiCall';
import {emitter} from "../common/EventEmitter";

export class StompClient {
    stompClient = null;
    sockJs = null;

    constructor (url){
        url = buildUrl(url, '');
        this.sockJs = new SockJS(url, null, {transports: 'websocket', });
        this.stompClient = Stomp.over(this.sockJs);
        this.stompClient.debug = true;
    }

    connect (headers = {}){
        let that = this;
        return new Promise((resolve,reject )=>{
            that.stompClient.connect(headers,
                function (frame) {
                    console.log("WebSocket Open!");
                    resolve(frame);
                },
                function (error) {
                    reject("STOMP protocol error " + error);
                }
            );
        });
    }

    disconnect () {
        try{
            this.stompClient.disconnect(()=>{
                console.log("WebSocket Close!");
            });
        } catch (e){
            console.error(e)
        }
    }

    subscribe (destination, resolve, reject) {
        this.stompClient.subscribe(destination, (message) => {
            try{
                resolve(JSON.parse(message.body));
            } catch(error){
                reject && reject(error.message) || console.error(error);
            }
        });
    }

    subscribeSingle (destination) {
        let that = this;
        return new Promise((resolve, reject) => {
            that.stompClient.subscribe(destination, function (message) {
                try{
                    resolve(JSON.parse(message.body));
                } catch(error){
                    reject && reject(error.message) || console.error(error);
                }
            });
        })
    }

    send (destination, headers, object) {
        return this.stompClient.send(destination, headers, object);
    }
}

export class MessageService {

    stompClient = null;

    init (){
        let that = this;
        console.log("消息初始化");
        //系统消息数量
        that.onEmitter("fetchMessageCountStream");
        //聊天消息数量
        that.onEmitter("fetchChatMessageCountStream");
        //广播数量
        that.onEmitter("fetchBoradcastCountStream");

        //聊天消息
        that.onEmitter('fetchChatMessageStream');
        //登出
        that.onEmitter('fetchUserLogoutStream');
        //日程消息
        that.onEmitter('fetchMessageStream');
        // //广播通知
        // that.onEmitter('fetchBroadCastStream');
    }

    onEmitter = (method)=> {
        this[method]((...args) => {
            try {
                emitter.emit(method, ...args);
            } catch (e) {
                console.error(e)
            }
        });
    };

    connect (url) {
        let headers = {'x-auth-token': WebData.token };
        this.stompClient = new StompClient(url);
        return this.stompClient.connect(headers);
    }

    disconnect () {
        this.stompClient && this.stompClient.disconnect();
        console.log("消息销毁");
    }

    getReceivedMessages() {
        return this.stompClient.subscribeSingle("/app/received-messages");
    }

    getSentMessages() {
        return this.stompClient.subscribeSingle("/app/sent-messages");
    }

    //获取未读系统消息数量, 废弃
    getUnReadMessages() {
        return this.stompClient.subscribeSingle("/app/received-unReadMessage-count");
    }

    //获取未读系统消息数量
    getUnReadSysMessages() {
        return this.stompClient.subscribeSingle("/app/received-unReadSysMessage-count");
    }

    //获取未读的广播数量
    getUnReadBroadcastMessages() {
        return this.stompClient.subscribeSingle("/app/received-unReadBroadcast-count");
    }

    //获取所有聊天未读数量
    getUnReadChatMessages() {
        return this.stompClient.subscribeSingle("/app/unReadChatLog-count");
    }

    sendMessage (message) {
        if(message.templatePath){
            return this.stompClient.send("/app/send-message-with-template", {}, JSON.stringify(message));
        } else if(message.scheduleSendTime){
            return this.stompClient.send("/app/send-message-with-timestamp", {}, JSON.stringify(message));
        } else {
            return this.stompClient.send("/app/send-message", {}, JSON.stringify(message));
        }
    }

    //发送聊天消息
    sendChatMessage (message){
        return this.stompClient.send('/app/send-single-chat', {}, JSON.stringify(message));
    }

    sendMassMessage (message) {
        return this.stompClient.send("/app/send-mass-messages", {}, JSON.stringify(message));
        /* if(message.templatePath){
             return stompClient.send("/app/send-message-with-template",{}, JSON.stringify(message));
         } else if(message.scheduleSendTime){
             return stompClient.send("/app/send-message-with-timestamp",{}, JSON.stringify(message));
         } else {
             return stompClient.send("/app/send-mass-messages",{}, JSON.stringify(message));
         }*/
    }

    markMessageReaded(id) {
        return this.stompClient.send("/app/mark-message-is-readed", {}, id);
    }

    //标记聊天消息为已读
    markChatReaded(id) {
        return this.stompClient.send("/app/mark-chatLog-is-readed", {}, id);
    }

    // 日程消息 通知
    fetchMessageStream (resolve, reject) {
        return this.stompClient.subscribe("/user/queue/new-sysMessages", resolve, reject);
    }

    fetchErrorStream (resolve, reject) {
        this.stompClient.subscribe("/user/queue/errors", resolve, reject);
    }

    //系统消息数量
    fetchMessageCountStream (resolve, reject) {
        this.stompClient.subscribe("/user/queue/received-unReadSysMessage-count", resolve, reject);
    }

    //聊天消息数量
    fetchChatMessageCountStream (resolve, reject) {
        this.stompClient.subscribe("/user/queue/unReadChatLog-count", resolve, reject);
    }

    //广播消息数量
    fetchBoradcastCountStream (resolve, reject) {
        this.stompClient.subscribe("/user/queue/received-unReadBroadcast-count", resolve, reject);
    }

    //消息
    fetchChatMessageStream (resolve, reject) {
        this.stompClient.subscribe("/user/queue/new-chatLog", resolve, reject);
    }

    //广播
    fetchBroadCastStream (resolve, reject) {
        this.stompClient.subscribe("/user/queue/new-broadcast", resolve, reject);
    }

    //被踢
    fetchUserLogoutStream (resolve, reject) {
        this.stompClient.subscribe("/user/queue/new-logoutUserLog", resolve, reject);
    }
}

export default new MessageService();
