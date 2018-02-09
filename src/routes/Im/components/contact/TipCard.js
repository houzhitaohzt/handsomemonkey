/*
 * 卡片
 * */
import React, {PropTypes, Component} from "react";
import i18n from '../../../../lib/i18n';

import {
    getUser,
    getQueryString,
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_DS,
    language,
    pageSize,
    sizeList
} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import {SubMenu, Popover, Menu, Dropdown, Button, Icon, Input} from 'antd';

import "../../../Common_confirm/assets/index.less";

import 'bootstrap/js/dropdown';
import 'bootstrap/js/tooltip';

let imgURL = require('../../../../styles/images/flag-red.png'); // 图片地址
let defaultAvatar = require('../../assets/default.png');


// content
class Content extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.refs['card'].parentNode.style.padding = '0px';
        this.refs['card'].parentNode.style.paddingTop = '8px';
    }

    // 写邮件
    writeHandle = (toAddress) => {
        let login = getUser(); // 登录信息
        let {data} = this.props;
        let {emailList = []} = data;

        // 是否 带抄送
        let copyTo = (!toAddress && (emailList['length'] ) > 1) ? {ccAddressArray: emailList.splice(1).join(';')} : {};
        window.navTabs.open(i18n.t(700006/*写邮件*/), `/email/write`, Object.assign({}, {
            type: 'compose',
            collectionName: login['defaultEmail'],
            toAddress: toAddress || data['emailList'][0]
        }, copyTo), {refresh: true});
    };


    // 发消息
    mailComeTo = () => {
        this.props.mailComeTo && this.props.mailComeTo();
    };

    // icon 跳转
    iconHandle = (option) => {
        window.navTabs.open(option['title'], option['url'], option['data'], {refresh: true});
    }

    // 控制 icon 按钮
    filterIcon = (s) => {
        let {icon} = this.props;

        // 判断标识
        if (icon) return icon.filter((o) => o == s).length ? true : false;

        return true;
    }

    render() {
        let {data, icon, freight} = this.props;
        let {country, companyTelList = [], emailList = [], skypeList = [], mobileList = [], qqList = [], telList = [], faxList = []} = data;

        return <aside className="noohle-card" ref="card">
            <header>
                <img src={imgURL} alt="png"/>
                <li onClick={this.mailComeTo.bind(this, 'detail')} className="name font-hide" title={data['mainName']}>
                    <b>{data['mainName']}</b></li>
                <li onClick={this.mailComeTo.bind(this, 'detail')} className="company font-hide"
                    title={data['companyName']}>{data['companyName']}</li>
                <li className="link-btn"></li>
            </header>
            <ol>
                <li>
                    <i className="icon foddingicon fooding-nation_icon" title={i18n.t(100087/*国家*/)}></i>
                    <b className="font-hide" title={country || ''}>{country || ''}</b>
                </li>
                <li>
                    <i className="icon foddingicon fooding-mail" title={i18n.t(100229/*邮箱*/)}></i>
                    <b className="font-hide" title={emailList ? emailList[0] : ''}>{emailList ? emailList[0] : ''}</b>
                    {emailList['length'] ?
                        <i className="arrows glyphicon glyphicon-chevron-down" id="dropdownMenu2" data-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false"></i> : ''}
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                        {emailList.map((o, i) => <li onClick={this.writeHandle.bind(this, o)}
                                                     className='font-hide pointer' key={i} title={o}>{o}</li>)}
                    </ul>
                </li>
                <li>
                    <i className="icon foddingicon fooding-skype-icon3" title={'skype'}></i>
                    <b className="font-hide" title={skypeList ? skypeList[0] : ''}>{skypeList ? skypeList[0] : ''}</b>
                    {skypeList['length'] ?
                        <i className="arrows glyphicon glyphicon-chevron-down" id="dropdownMenu3" data-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false"></i> : ''}
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu3">
                        {skypeList.map((o, i) => <li className='font-hide' key={i} title={o}>{o}</li>)}
                    </ul>
                </li>
                <li>
                    <i className="icon foddingicon fooding-iphone" title={i18n.t(300009/*手机*/)}></i>
                    <b className="font-hide"
                       title={mobileList ? mobileList[0] : ''}>{mobileList ? mobileList[0] : ''}</b>
                    {mobileList['length'] ?
                        <i className="arrows glyphicon glyphicon-chevron-down" id="dropdownMenu4" data-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false"></i> : ''}
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu4">
                        {mobileList.map((o, i) => <li className='font-hide' key={i} title={o}>{o}</li>)}
                    </ul>
                </li>
                <li>
                    <i className="icon foddingicon fooding-qq-icon2" title={'QQ'}></i>
                    <b className="font-hide" title={qqList ? qqList[0] : ''}>{qqList ? qqList[0] : ''}</b>
                    {qqList['length'] ?
                        <i className="arrows glyphicon glyphicon-chevron-down" id="dropdownMenu5" data-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false"></i> : ''}
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu5">
                        {qqList.map((o, i) => <li className='font-hide' key={i} title={o}>{o}</li>)}
                    </ul>
                </li>
                <li>
                    <i className="icon foddingicon fooding-telephone-icon" title={i18n.t(100478/*电话*/)}></i>
                    <b className="font-hide" title={telList ? telList[0] : ''}>{telList ? telList[0] : ''}</b>
                    {telList['length'] ?
                        <i className="arrows glyphicon glyphicon-chevron-down" id="dropdownMenu6" data-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false"></i> : ''}
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu6">
                        {telList.map((o, i) => <li className='font-hide' key={i} title={o}>{o}</li>)}
                    </ul>
                </li>
                <li>
                    <i className="icon foddingicon fooding-fax-icon" title={i18n.t(100479/*传真*/)}></i>
                    <b className="font-hide" title={faxList ? faxList[0] : ''}>{faxList ? faxList[0] : ''}</b>
                    {faxList['length'] ?
                        <i className="arrows glyphicon glyphicon-chevron-down" id="dropdownMenu7" data-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false"></i> : ''}
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu7">
                        {faxList.map((o, i) => <li className='font-hide' key={i} title={o}>{o}</li>)}
                    </ul>
                </li>
            </ol>
            <p onClick={this.mailComeTo.bind(this, 'email')}
               className="bac-theme pointer">发信息</p>
        </aside>;
    }
}


export default class Card extends Component {

    constructor(props) {
        super(props);

        // init state
        this.state = {
            cardData: {}, // 卡片信息
            target: document.body, // 目标标签
            visible:false
        }
    }
    componentDidMount() {
        let dom = this.targetDOM(this.refs.tipcard);
        this.setState({target: dom});
    }

    // 获取 气泡目标元素
    targetDOM = (dom)=>{
        let obj = dom.parentNode.attributes["class"];

        if( (obj && obj.value) == 'container-body'){
            return dom.parentNode;
        } else{
            return this.targetDOM(dom.parentNode);
        }
    }

    // show card
    showCardHandle = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.getPage();
    };

    getPage = () => {
        let {data} = this.props;
        if (!data['id']) return false;

        apiGet(API_FOODING_DS, '/contact/getVisitingCardById', {beId: data['id'], dataTyId: 160},
            (response) => {
                this.setState({
                    cardData: response['data'] || {},
                });
            }, (errors) => {
                ServiceTips({text: errors.message, type: 'error'});
            });
    }

    mailComeTo = () => {
      this.props.mailComeTo && this.props.mailComeTo(this.props.data)
    };

    render() {
        let {cardData, target} = this.state;
        let {data = {}, icon,index} = this.props;

        return <Popover content={<Content data={cardData} icon={icon} mailComeTo={this.mailComeTo}/>} placement="bottom"
                         trigger="click" getPopupContainer={() => target} autoAdjustOverflow={true} overlayStyle={{paddingTop:"8px",paddingLeft:"0px",paddingRight:"0px",paddingBottom:"0px"}}>
                <div key={index} className='im-concat-container-item' ref={'tipcard'} onClick={this.showCardHandle}>
                    <div className='im-concat-container-item-c' >
                        <img className='im-avatar' src={defaultAvatar}/>
                        <span className='noLineFeed'>{data && data.localName?data.localName:""}</span>
                    </div>
                </div>
        </Popover>;
    }
}