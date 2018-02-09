/**
 *  邮件 公共方法
 **/
import React, {PropTypes, Component} from "react";
import i18n from '../../../../lib/i18n';

import {getUser,getQueryString, apiGet, apiPost, apiForm, API_FOODING_MAIL, language, pageSize, sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import Confirm from '../../../../components/Dialog/Confirm';

/**
 * 公共方法
 */
class Common {

    // 补零
    Appendzero(num){
        return  num > 9 ? num : '0'+num;
    }
}
let CommonFunc = new Common();



// 获取 屏幕高度
export const availHeight = document.body.offsetHeight-85; //screen.availHeight-170;


// 星期天 
function weekListFunc(num){
    return [i18n.t(400178/*星期日*/),i18n.t(400172/*星期一*/),i18n.t(400173/*星期二*/),i18n.t(400174/*星期三*/),i18n.t(400175/*星期四*/),i18n.t(400176/*星期五*/),i18n.t(400177/*星期六*/)][num];
}

// 邮件时间格式化 - 列表
export function  timeFormat(time,active){
    if(!time) return;

    let now = new Date();
    let nowY = now.getFullYear();
    let nowM = now.getMonth()+1;
    let nowD = now.getDate();

    let t = new Date(time);
    let y = t.getFullYear();
    let m = t.getMonth()+1;
    let d = t.getDate();
    let h = t.getHours();
    let min = t.getMinutes();
    let s = t.getSeconds();
    let w = t.getDay();

    // TODO 详细日期 
    if(active == 'detail') return y+'-'+CommonFunc.Appendzero(m)+'-'+CommonFunc.Appendzero(d)+ ' '+h+':'+CommonFunc.Appendzero(min) +'  ('+weekListFunc(w)+')' ;

    // TODO 简洁日期
    if( (nowY==y) && (nowM==m) && (nowD==d) ) return i18n.t(400148/*今天*/)+h+':'+CommonFunc.Appendzero(min);
    if( (nowY==y) && (nowM==m) && (nowD==d+1) ) return i18n.t(700087/*昨天*/)+h+':'+CommonFunc.Appendzero(min);
    if( (nowY==y) && (nowM==m) && (nowD==d+2) ) return i18n.t(700088/*前天*/)+h+':'+CommonFunc.Appendzero(min);

    // TODO 标准日期
    return String(y).substring(2) + '-' +CommonFunc.Appendzero(m)+'-' +CommonFunc.Appendzero(d) +' '+ h+':'+CommonFunc.Appendzero(min);
}

// 主题 简化显示 
export function themeAbb(s=''){
    let num = 0;
    let str = s.replace(/re[:：]|fw[:：]|read[:：]|回复[:：]/ig,function(){
        num ++;
        return '';
    });

    return <span>{num ? <span className="label-info" style={{display: 'inline', padding: '.2em .6em .3em', fontSize: '75%',
        lineHeight: 1, textAlign: 'center', whiteSpace: 'nowrap', verticalAlign: 'baseline', borderRadius: '.25em'}}>RE: {num}</span>:''}<span>{str.trim()}</span></span>;
}






/******************************  公共方法  ******************************/

// dialog 按钮组
export class ButtonDIV extends Component {
    render(){
        let {confirmHandle,cancelHandle,confirmText=i18n.t(200043/*确定*/),} = this.props;

        return  <div className="row">
            <p style={{textAlign:'center'}}>
                { confirmHandle ? <button type="button" onClick={confirmHandle} className="btn btn-primary btn-sm" style={{marginRight:'13px'}}>{confirmText}</button> :'' }
                <button type="button" onClick={cancelHandle} className="btn btn-default btn-sm">{i18n.t(100461/*取消*/)}</button>
            </p>
        </div>
    }
}

// 判断 至少一封邮件
export function commonRow (row){

    if(!row['length']) {
        ServiceTips({text:i18n.t(700089/*请选择一封邮件！*/),type:'info'});
        return false;
    }

    return true;
}

// 判断 只能一封邮件
export function commonOnlyRow (row){

    if(!row['length']) {
        ServiceTips({text:i18n.t(700089/*请选择一封邮件！*/),type:'info'});
        return false;
    }

    if(row['length']>1) {
        ServiceTips({text:i18n.t(700090/*最多选择一封邮件!*/),type:'info'});
        return false;
    }

    return row;
}

// 邮件详情
export function detailFunc (row,active,option){
    let param = option ? {param:option} : {};
    window.navTabs.open(i18n.t(700091/*邮件详情*/)+`(${row['subject']}){${row['id']}}`,`/mail/detail/${row['id']}`,Object.assign(param,{page:active,mailId:row['id'],collectionName:row['collectName'],isOwn:(getUser().staff.contacts.filter((o)=>o['localName']==row['collectName']).length ? true : false)}),{refresh: true});
}

// 邮件预览
export function previewHandle (){
    console.log(this);
}

/*********************** 功能按钮  ************************/

// 公共请求
export function commonAjax(o={}){

    if(o['message']){
        Confirm(o['message'], {
            done: () => {
                apiForm(API_FOODING_MAIL,o['url'],o['data'],
                    (response)=>{
                        o['success'] && ServiceTips({text: response.message,type: 'success'});
                        // ServiceTips({text: response.message,type: 'success'});
                        o['callBack'] && o['callBack']();
                    },(errors)=>{
                        ServiceTips({text: errors.message,type: 'error'});
                });
            }
        });
    } else{
        apiForm(API_FOODING_MAIL,o['url'],o['data'],
            (response)=>{
                // ServiceTips({text: response.message,type: 'success'});
                o['success'] && ServiceTips({text: response.message,type: 'success'});
                o['callBack'] && o['callBack']();
            },(errors)=>{
                ServiceTips({text: errors.message,type: 'error'});
        });
    }
}



// nav 按钮功能
export function NavBtnFunc(o={}){
    let {row,callBack,confirm,message} = o;
    if(!commonRow(row)) return;

    // TODO
    let ID = row.map((o)=>o['id']);
    if(message.isLishi && message['folder'] == "null"){ //移动至历史邮箱
      apiForm(API_FOODING_MAIL,'/box/toHistory',{mailIds:ID,collectionName:row[0].collectName},(response)=>{
        callBack();
      },(error)=>{
        ServiceTips({type:'error',text:error.message});
      });
      return false;
    }
    switch (message['btn']) {
        case 'delete':   // 删除
            var param = {url: '/box/delete', data: {mailIds:ID,collectionName:row[0]['collectName']}};
        break;
        case 'signRead':  // 标记 已读|未读
            var param = {url: '/box/mark', data: {mailIds:ID,collectionName:row[0]['collectName'],markRead:message['active'] == 'read' ? true : false}};
        break;
        case 'move':  // 移动
            var param = {url: '/box/move', data: {mailIds:ID,collectionName:row[0]['collectName'],box:message['box'],folder:message['folder']}};
        break;
        case 'recover':  // 恢复
            var param = {url: '/box/recover', data: {mailIds:ID,collectionName:row[0]['collectName'],isFolder:message['isFolder']}};
        break;
        case 'destroy':  // 彻底删除
            var param = {url: '/box/remove', data: {mailIds:ID,collectionName:row[0]['collectName']}};
        break;
        default:
            break;
    }

    if(confirm){
        Confirm(confirm, {
            done: () => {
                commonAjax({url:param['url'],data:param['data'],callBack:callBack});
            }
        });
    } else{
        commonAjax({url:param['url'],data:param['data'],callBack:callBack});
    }

}
