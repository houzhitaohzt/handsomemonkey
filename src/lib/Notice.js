
import WebData from '../common/WebData';
import {emitter} from "../common/EventEmitter";
import xt from '../common/xt';
import { notification } from 'antd';

const Notification = window.Notification || window.mozNotification || window.webkitNotification;

/**
 * 显示通知, 系统通知或者自定义通知
 */
export default class Notice {

    static request (){
        if (Notification && Notification.permission !== "granted") {
            Notification.requestPermission(function (status) {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
            });
        }
    }

    static open ({title, message, icon, duration = 6, ...args}){
        let {
            onClick = xt.noop
        } = args;
        if(window.Notification && Notification.permission === "granted") {
            // 弹出一个通知
            let n = new Notification(title, {
                body : message,
                icon : icon,
                tag: xt.guid()
            });
            n.onclick = function(event) {
                event.preventDefault();
                onClick();
            };
            // 两秒后关闭通知
            setTimeout(function() {
                n.close();
            }, duration * 1000);
        } else {
            notification.open({
                message: title,
                description: message,
                placement:"topRight",
                duration: duration, // 延时关闭
                key: xt.guid(),
            });
        }
    }
}
