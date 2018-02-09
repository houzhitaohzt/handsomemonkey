/*
 * 卡片
 * */
import React, {PropTypes, Component} from "react";
import i18n from '../../lib/i18n';

import {getUser,getQueryString, apiGet, apiPost, apiForm, API_FOODING_DS, language, pageSize, sizeList} from '../../services/apiCall';
import ServiceTips from '../../components/ServiceTips';

import {SubMenu, Popover, Menu, Dropdown, Button, Icon, Input  } from 'antd';

import "./assets/index.less";

import 'bootstrap/js/dropdown';
import 'bootstrap/js/tooltip';

let imgURL = require('../../styles/images/flag-red.png'); // 图片地址





// content
class Content extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.refs['card'].parentNode.style.padding = '0px';
    }

    // 写邮件 
    writeHandle = (toAddress)=>{
        let login = getUser(); // 登录信息
        let {data} = this.props;
        let {emailList=[]} = data;

        // 是否 带抄送
        let copyTo = (!toAddress && (emailList['length'] )>1) ? {ccAddressArray:emailList.splice(1).join(';') } : {};
        window.navTabs.open(i18n.t(700006/*写邮件*/),`/email/write`,Object.assign({},{type:'compose',collectionName:login['defaultEmail'],toAddress:toAddress || data['emailList'][0]},copyTo),{refresh: true});
    }

    // 公司跳转  
    companyTo = (active)=>{
        let {data} = this.props;

        let ID = data['companyId'];
        let name = data['companyName'];

        switch (data['dataTyId']) {
            case 30: // 客户
                window.navTabs.open(i18n.t(100311/*客户*/)+`(${name})`,`/client/detail/${ID}`,{id:ID,index:active},{refresh:true});
            break;
            case 100: // 客户联系人
                window.navTabs.open(i18n.t(100311/*客户*/)+`(${name})`,`/client/detail/${ID}`,{id:ID,index:active},{refresh:true});
                // window.navTabs.open(i18n.t(300008/*客户联系人详情*/),`/clientcontact/detail`,{id:ID,index:active},{refresh:true});
            break;
            case 40: // 供应商
                window.navTabs.open(i18n.t(200935/*供应商详情*/),`/provider/detail`,{id:ID,index:active},{refresh:true});
            break;
            case 120: // 供应商联系人
                window.navTabs.open(i18n.t(200935/*供应商详情*/),`/provider/detail`,{id:ID,index:active},{refresh:true});
                // window.navTabs.open(i18n.t(300021/*供应商联系人详情*/),`/providercontact/detail`,{id:ID,index:active},{refresh:true});
            break;
            case 80: // 货代
                window.navTabs.open(i18n.t(200571/*货代详情*/),`/forwarder/detail`,{id:ID,index:active},{refresh:true});
            break;
            case 130: // 货代联系人
                window.navTabs.open(i18n.t(200571/*货代详情*/),`/forwarder/detail`,{id:ID,index:active},{refresh:true});
                // window.navTabs.open(i18n.t(300020/*货代联系人详情*/),`/forwardercontact/detail`,{id:ID,index:active},{refresh:true});
            break;
            case 90: // 服务机构
                window.navTabs.open(i18n.t(100313/*服务机构*/)+i18n.t(700083/*详情*/),`/servbe/detail`,{id:ID,index:active},{refresh:true});
            break;
            case 140: // 服务机构联系人
                window.navTabs.open(i18n.t(100313/*服务机构*/)+i18n.t(700083/*详情*/),`/servbe/detail`,{id:ID,index:active},{refresh:true});
                // window.navTabs.open(i18n.t(300022/*服务机构联系人详情*/),`/servcon/detail`,{id:ID,index:active},{refresh:true});
            break;
            default:
                break;
        }
        
    }

    // 邮件往来
    mailComeTo = (active)=>{
        let {data} = this.props;
        let ID = data['mainId'];

        switch (data['dataTyId']) {
            case 30: // 客户 
                window.navTabs.open(i18n.t(100311/*客户*/)+`(${ID})`,`/client/detail/${ID}`,{id:ID,index:active},{refresh:true});
            break;
            case 100: // 客户联系人 
                window.navTabs.open(i18n.t(300008/*客户联系人详情*/),`/clientcontact/detail`,{id:ID,index:active},{refresh:true});
            break;
            case 40: // 供应商 
                window.navTabs.open(i18n.t(200935/*供应商详情*/),`/provider/detail`,{id:ID,index:active},{refresh:true});
            break;
            case 120: // 供应商联系人 
                window.navTabs.open(i18n.t(300021/*供应商联系人详情*/),`/providercontact/detail`,{id:ID,index:active},{refresh:true});
            break;
            case 80: // 货代 
                window.navTabs.open(i18n.t(200571/*货代详情*/),`/forwarder/detail`,{id:ID,index:active},{refresh:true});
            break;
            case 130: // 货代联系人 
                window.navTabs.open(i18n.t(300020/*货代联系人详情*/),`/forwardercontact/detail`,{id:ID,index:active},{refresh:true});
            break;
            case 90: // 服务机构 
                window.navTabs.open(i18n.t(100313/*服务机构*/)+i18n.t(700083/*详情*/),`/servbe/detail`,{id:ID,index:active},{refresh:true});
            break;
            case 140: // 服务机构联系人 
                window.navTabs.open(i18n.t(300022/*服务机构联系人详情*/),`/servcon/detail`,{id:ID,index:active},{refresh:true});
            break;
            default:
                break;
        }

    }

    // icon 跳转 
    iconHandle = (option)=>{
        window.navTabs.open(option['title'],option['url'],option['data'],{refresh:true});
    }

    // 控制 icon 按钮 
    filterIcon = (s)=>{
        let {icon} = this.props;

        // 判断标识
        if(icon) return icon.filter((o)=>o==s).length ? true : false;

        return true;
    }

    render(){
        let {data,icon,freight} = this.props;
        let {country,companyTelList=[],emailList=[],skypeList=[],mobileList=[],qqList=[],telList=[],faxList=[]}=data;
        let ID = data['companyId'];
        let name = data['companyName'];
        let dataTyId = data['dataTyId'];
        let URL = freight ? 'freight':''; // 判断是否是 货代公司；

        // icon toggle 
        switch (data['dataTyId']) {
            case 30: // 客户 
                var iconPage = <li className="link-btn">
                        { this.filterIcon('detail') ? <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/${URL}client/detail/${ID}`,data:{id:ID,index:'detail'}})} className="foddingicon fooding-user-mail-new" title={i18n.t(100311/*客户*/)}></i> : '' }
                        { this.filterIcon('business') ? <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/${URL}client/detail/${ID}`,data:{id:ID,index:'business'}})} className="foddingicon fooding-business-mail-new" title={i18n.t(100321/*商机*/)}></i> : '' }
                        { this.filterIcon('prices') ? <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/${URL}client/detail/${ID}`,data:{id:ID,index:'prices'}})} className="foddingicon fooding-quote" title={i18n.t(200921/*最新价格*/)}></i> : '' }
                        { this.filterIcon('date') ? <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/${URL}client/detail/${ID}`,data:{id:ID,index:'date'}})} className="foddingicon fooding-date-mail-new" title={i18n.t(100587/*约会*/)}></i> : '' }
                        { this.filterIcon('contact') ? <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/${URL}client/detail/${ID}`,data:{id:ID,index:'contact'}})} className="foddingicon fooding-contact-mail-new" title={i18n.t(100588/*联络*/)}></i> : '' }
                        { this.filterIcon('activity') ? <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/${URL}client/detail/${ID}`,data:{id:ID,index:'activity'}})} className="foddingicon fooding-businessEcho-mail-new" title={i18n.t(100585/*市场活动响应*/)}></i> : '' }
                    </li>
            break;
            case 100: // 客户联系人
                var iconPage = <li className="link-btn">
                        { this.filterIcon('detail') ? <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/${URL}client/detail/${ID}`,data:{id:ID,index:'detail'}})} className="foddingicon fooding-user-mail-new" title={i18n.t(100311/*客户*/)}></i> : '' }
                        { this.filterIcon('business') ? <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/${URL}client/detail/${ID}`,data:{id:ID,index:'business'}})} className="foddingicon fooding-business-mail-new" title={i18n.t(100321/*商机*/)}></i> : '' }
                        { this.filterIcon('prices') ? <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/${URL}client/detail/${ID}`,data:{id:ID,index:'prices'}})} className="foddingicon fooding-quote" title={i18n.t(200921/*最新价格*/)}></i> : '' }
                        { this.filterIcon('date') ? <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/${URL}client/detail/${ID}`,data:{id:ID,index:'date'}})} className="foddingicon fooding-date-mail-new" title={i18n.t(100587/*约会*/)}></i> : '' }
                        { this.filterIcon('contact') ? <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/${URL}client/detail/${ID}`,data:{id:ID,index:'contact'}})} className="foddingicon fooding-contact-mail-new" title={i18n.t(100588/*联络*/)}></i> : '' }
                        { this.filterIcon('activity') ? <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/${URL}client/detail/${ID}`,data:{id:ID,index:'activity'}})} className="foddingicon fooding-businessEcho-mail-new" title={i18n.t(100585/*市场活动响应*/)}></i> : '' }
                    </li>
            break;
            case 40: // 供应商 
                var iconPage = <li className="link-btn">
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200935/*供应商详情*/),url:`/provider/detail`,data:{id:ID,index:'detail'}})} className="foddingicon fooding-provider-mail-new" title={i18n.t(100312/*供应商*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200935/*供应商详情*/),url:`/provider/detail`,data:{id:ID,index:'product'}})} className="foddingicon fooding-product-mail-new" title={i18n.t(100379/*产品*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200935/*供应商详情*/),url:`/provider/detail`,data:{id:ID,index:'date'}})} className="foddingicon fooding-date-mail-new" title={i18n.t(100587/*约会*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200935/*供应商详情*/),url:`/provider/detail`,data:{id:ID,index:'contact'}})} className="foddingicon fooding-contact-mail-new" title={i18n.t(100588/*联络*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200935/*供应商详情*/),url:`/provider/detail`,data:{id:ID,index:'activity'}})} className="foddingicon fooding-businessEcho-mail-new" title={i18n.t(100585/*市场活动响应*/)}></i>
                    </li>
            break;
            case 120: // 供应商联系人
                var iconPage = <li className="link-btn">
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200935/*供应商详情*/),url:`/provider/detail`,data:{id:ID,index:'detail'}})} className="foddingicon fooding-provider-mail-new" title={i18n.t(100312/*供应商*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200935/*供应商详情*/),url:`/provider/detail`,data:{id:ID,index:'product'}})} className="foddingicon fooding-product-mail-new" title={i18n.t(100379/*产品*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200935/*供应商详情*/),url:`/provider/detail`,data:{id:ID,index:'date'}})} className="foddingicon fooding-date-mail-new" title={i18n.t(100587/*约会*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200935/*供应商详情*/),url:`/provider/detail`,data:{id:ID,index:'contact'}})} className="foddingicon fooding-contact-mail-new" title={i18n.t(100588/*联络*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200935/*供应商详情*/),url:`/provider/detail`,data:{id:ID,index:'activity'}})} className="foddingicon fooding-businessEcho-mail-new" title={i18n.t(100585/*市场活动响应*/)}></i>
                    </li>
            break;
            case 80: // 货代 
                var iconPage = <li className="link-btn">
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200571/*货代详情*/),url:`/forwarder/detail`,data:{id:ID,index:'detail'}})} className="foddingicon fooding-freight-mail-new" title={i18n.t(500271/*货代*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200571/*货代详情*/),url:`/forwarder/detail`,data:{id:ID,index:'shiporder'}})} className="foddingicon fooding-shipping-mail-new" title={i18n.t(200370/*物流订单详情*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200571/*货代详情*/),url:`/forwarder/detail`,data:{id:ID,index:'date'}})} className="foddingicon fooding-date-mail-new" title={i18n.t(100587/*约会*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200571/*货代详情*/),url:`/forwarder/detail`,data:{id:ID,index:'contact'}})} className="foddingicon fooding-contact-mail-new" title={i18n.t(100588/*联络*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200571/*货代详情*/),url:`/forwarder/detail`,data:{id:ID,index:'activity'}})} className="foddingicon fooding-businessEcho-mail-new" title={i18n.t(100585/*市场活动响应*/)}></i>
                    </li>
            break;
            case 130: // 货代联系人
                var iconPage = <li className="link-btn">
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200571/*货代详情*/),url:`/forwarder/detail`,data:{id:ID,index:'detail'}})} className="foddingicon fooding-freight-mail-new" title={i18n.t(500271/*货代*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200571/*货代详情*/),url:`/forwarder/detail`,data:{id:ID,index:'shiporder'}})} className="foddingicon fooding-shipping-mail-new" title={i18n.t(200370/*物流订单详情*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200571/*货代详情*/),url:`/forwarder/detail`,data:{id:ID,index:'date'}})} className="foddingicon fooding-date-mail-new" title={i18n.t(100587/*约会*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200571/*货代详情*/),url:`/forwarder/detail`,data:{id:ID,index:'contact'}})} className="foddingicon fooding-contact-mail-new" title={i18n.t(100588/*联络*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(200571/*货代详情*/),url:`/forwarder/detail`,data:{id:ID,index:'activity'}})} className="foddingicon fooding-businessEcho-mail-new" title={i18n.t(100585/*市场活动响应*/)}></i>
                    </li>
            break;
            case 90: // 服务机构 
                var iconPage = <li className="link-btn">
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(700084/*服务机构详情*/),url:`/servbe/detail`,data:{id:ID,index:'detail'}})} className="foddingicon fooding-organization-mail-new" title={i18n.t(100313/*服务机构*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(700084/*服务机构详情*/),url:`/servbe/detail`,data:{id:ID,index:'date'}})} className="foddingicon fooding-date-mail-new" title={i18n.t(100587/*约会*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(700084/*服务机构详情*/),url:`/servbe/detail`,data:{id:ID,index:'contact'}})} className="foddingicon fooding-contact-mail-new" title={i18n.t(100588/*联络*/)}></i>
                    </li>
            break;
            case 140: // 服务机构联系人 
                var iconPage = <li className="link-btn">
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(700084/*服务机构详情*/),url:`/servbe/detail`,data:{id:ID,index:'detail'}})} className="foddingicon fooding-organization-mail-new" title={i18n.t(100313/*服务机构*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(700084/*服务机构详情*/),url:`/servbe/detail`,data:{id:ID,index:'date'}})} className="foddingicon fooding-date-mail-new" title={i18n.t(100587/*约会*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(700084/*服务机构详情*/),url:`/servbe/detail`,data:{id:ID,index:'contact'}})} className="foddingicon fooding-contact-mail-new" title={i18n.t(100588/*联络*/)}></i>
                    </li>
            break;
            default:
                var iconPage = <li className="link-btn"></li>;
                break;
        }


        return  <aside className="noohle-card" ref="card">
                    <header>
                        <img src={imgURL} alt="png"/>
                        <li onClick={this.mailComeTo.bind(this,'detail')} className="name font-hide" title={data['mainName']}><b>{data['mainName']}</b></li>
                        <li onClick={this.companyTo.bind(this,'detail')} className="company font-hide" title={data['companyName']}>{data['companyName']}</li>
                        { iconPage }
                        <span className="write" onClick={this.writeHandle.bind(this,null)} title={i18n.t(500272/*写信*/)}>
                            <i className="foddingicon fooding-write-mail"></i>
                            &nbsp;
                            <b>{i18n.t(500272/*写信*/)}</b>
                        </span>
                    </header>
                    <ol>
                        <li>
                            <i className="icon foddingicon fooding-nation_icon" title={i18n.t(100087/*国家*/)}></i>
                            <b className="font-hide" title={country || ''}>{country || ''}</b>
                        </li>
                        <li>
                            <i className="icon foddingicon fooding-mail" title={i18n.t(100229/*邮箱*/)}></i>
                            <b className="font-hide" title={emailList ? emailList[0] : ''}>{emailList ? emailList[0] : ''}</b>
                            { emailList['length'] ? <i className="arrows glyphicon glyphicon-chevron-down" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i> : ''}
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                {emailList.map((o,i)=><li onClick={this.writeHandle.bind(this,o)} className='font-hide pointer' key={i} title={o}>{o}</li>)}
                            </ul>
                        </li>
                        <li>
                            <i className="icon foddingicon fooding-skype-icon3" title={'skype'}></i>
                            <b className="font-hide" title={skypeList ? skypeList[0] : ''}>{skypeList ? skypeList[0] : ''}</b>
                            { skypeList['length'] ? <i className="arrows glyphicon glyphicon-chevron-down" id="dropdownMenu3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i> : ''}
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu3">
                                {skypeList.map((o,i)=><li className='font-hide' key={i} title={o}>{o}</li>)}
                            </ul>
                        </li>
                        <li>
                            <i className="icon foddingicon fooding-iphone" title={i18n.t(300009/*手机*/)}></i>
                            <b className="font-hide" title={mobileList ? mobileList[0] : ''}>{mobileList ? mobileList[0] : ''}</b>
                            { mobileList['length'] ? <i className="arrows glyphicon glyphicon-chevron-down" id="dropdownMenu4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i> : ''}
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu4">
                                {mobileList.map((o,i)=><li className='font-hide' key={i} title={o}>{o}</li>)}
                            </ul>
                        </li>
                        <li>
                            <i className="icon foddingicon fooding-qq-icon2" title={'QQ'}></i>
                            <b className="font-hide" title={qqList ? qqList[0] : ''}>{qqList ? qqList[0] : ''}</b>
                            { qqList['length'] ? <i className="arrows glyphicon glyphicon-chevron-down" id="dropdownMenu5" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i> : ''}
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu5">
                                {qqList.map((o,i)=><li className='font-hide' key={i} title={o}>{o}</li>)}
                            </ul>
                        </li>
                        <li>
                            <i className="icon foddingicon fooding-telephone-icon" title={i18n.t(100478/*电话*/)}></i>
                            <b className="font-hide" title={telList ? telList[0] : ''}>{telList ? telList[0] : ''}</b>
                            { telList['length'] ? <i className="arrows glyphicon glyphicon-chevron-down" id="dropdownMenu6" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i> : ''}
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu6">
                                {telList.map((o,i)=><li className='font-hide' key={i} title={o}>{o}</li>)}
                            </ul>
                        </li>
                        <li>
                            <i className="icon foddingicon fooding-fax-icon" title={i18n.t(100479/*传真*/)}></i>
                            <b className="font-hide" title={faxList ? faxList[0] : ''}>{faxList ? faxList[0] : ''}</b>
                            { faxList['length'] ? <i className="arrows glyphicon glyphicon-chevron-down" id="dropdownMenu7" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i> : ''}
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu7">
                                {faxList.map((o,i)=><li className='font-hide' key={i} title={o}>{o}</li>)}
                            </ul>
                        </li>
                    </ol>
                    { ((dataTyId != 160) && dataTyId ) ? <p onClick={this.mailComeTo.bind(this,'email')} className="bac-theme pointer">{i18n.t(700086/*邮件往来*/)}</p> :''}
            </aside>;
    }
}





export default class Card extends Component {

    constructor(props) {
        super(props);

        // init state 
        this.state = {
            cardData:{}, // 卡片信息
            target: document.body, // 目标标签
        }
    }

	componentDidMount(){
        let dom = this.targetDOM(this.refs.card);  // 目标 DOM 
        this.setState({target: dom});
    }

    // 获取 气泡目标元素 
    targetDOM = (dom)=>{
        let obj = dom.parentNode.attributes["class"];

        if( (obj && obj.value) == 'detail-layout__viewport'){
            return dom.parentNode;
        } else{
            return this.targetDOM(dom.parentNode);
        }
    }

    // show card 
    showCardHandle = (e)=>{
        e.stopPropagation();
        e.preventDefault();
		this.getPage();

    }

    getPage = ()=>{
        let {data,type} = this.props;

        // 判断卡片 类型 
        switch (type) {
            case 'admin' : // 客户分管人
                 var param = {beId:data['id'],dataTyId:160};
            break;
            case 'userLinkMan' : // 客户联系人 
                 var param = {beId:data['id'],dataTyId:100};
            break;
            case 'providerLinkMan' : // 供应商联系人 
                 var param = {beId:data['id'],dataTyId:120};
            break; 
            case 'forwarderLinkMan' : // 货代公司-联系人 
                 var param = {beId:data['id'],dataTyId:130};
            break;  
            case 'servbeLinkMan' : // 服务机构-联系人 
                 var param = {beId:data['id'],dataTyId:140};
            break;             
                       
            default:
                break;
        }


        apiGet(API_FOODING_DS,'/contact/getVisitingCardById',Object.assign({},param),
            (response)=>{
                this.setState({
                    cardData: response['data'] || {},
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });
    }

    render(){
        let {cardData,target} = this.state;
        let {type,data={},icon,freight} = this.props;


        return <Popover content={<Content freight={freight} data={cardData} icon={icon}/>} placement="rightTop" autoAdjustOverflow={true} trigger="click" getPopupContainer={() =>target}>
                <a ref={'card'} href="javascript:;" onClick={this.showCardHandle} title={data['localName']}>{data['localName']}</a>
            </Popover>;
    }
}