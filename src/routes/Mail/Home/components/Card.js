/*
 * 卡片
 * */ 
import React, {PropTypes, Component} from "react";
import i18n from '../../../../lib/i18n';

import {createForm,FormWrapper} from '../../../../components/Form';
import Dialog from '../../../../components/Dialog/Dialog';//弹层

import {getQueryString, apiGet, apiPost, apiForm, API_FOODING_DS, language, pageSize, sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import Select, { ConstVirtualSelect, Option } from '../../../../components/Select'; // 下拉

import {SubMenu, Popover, Menu, Dropdown, Button, Icon, Input  } from 'antd';
import {ButtonDIV} from "./Common.js"; // 公共库  
import NavConnect from "../../../../components/NavigateTabs/containers/AddContainer";

let imgURL = require('../../../../styles/images/flag-red.png'); // 图片地址


// 新增 页面
class AddDIV extends Component {

    constructor(props) {
        super(props);
        let {sendMail} = this.props.row;

        // state init 
        this.state = {
            typeID: 0, // 往来类型
            nameID: '', // 往来名称搜索
            linkID: '', // 联系人搜索

            getOne: {nameVal:sendMail,linkVal:sendMail}, // 当前数据
            
        };
    }

    // 往来类型 change 
    typeChange = (ID)=>{
        this.setState({
            typeID:ID,
        },function(){
            this.setState({nameID:'', getOne:{linkVal:'',nameVal:''}});
            this.props.form.resetFields(['nameID','linkID']); 
        });
    }

    // 往来名称搜索 
    nameChange = (option)=>{
        let that = this;
        setTimeout(function(){
           that.props.form.validateFields((errors, value) =>{
                that.setState({
                    nameID:option['nameID'],
                    getOne: Object.assign(value,{linkVal:''})
                });
            });
            that.props.form.validateFields(()=>{});
        },100);
    }

    // 联系人搜索 
    linkChange = (option)=>{
        let that = this;
        setTimeout(function(){
           that.props.form.validateFields((errors, value) =>{
                that.setState({
                    linkID:option['linkID'],
                    getOne: value
                });
            });
            that.props.form.validateFields(()=>{});
        },100);        
    }



    // confirm
    confirmHandle = ()=>{
        let {confirmHandle,row} = this.props;

		this.props.form.validateFields((errors, value) =>{
			if(errors){
			}else{
                let data = {
                    email: row['sendMail'],
                    dataTyId:value['typeForm'],
                    entId:(value['entName'] == value['nameVal'] ? value['nameID'] : ''),
                    entContactId:(value['entContactName'] == value['linkVal'] ? value['linkID'] : ''),
                    entName:value['entName'],
                    entContactName:value['entContactName']
                }

				apiPost(API_FOODING_DS,'/enterprise/save',data,
					(response)=>{	
						ServiceTips({text:response.message,type:'success'});
                        this.props.getPage();
                        this.cancelHandle();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
        });
        
    }

    // cancel
    cancelHandle = ()=>{
        this.props.cancelHandle();
    }

    render(){
        let {getOne,typeID,nameID} = this.state;
		const {getFieldProps,getFieldValue,getFieldError} = this.props.form;

        return <div className="addnormal girdlayout">
            <div className="row">
                <div className="col-md-6">
                    <label className="col-md-4">{i18n.t(700077/*往来类型*/)}</label>
                    <ConstVirtualSelect 
                        fieldName="typeForm"
                        form={this.props.form} 
                        apiType={apiPost}
                        apiUri={"/enterprise/getDataTypes"}    
                        onChange={this.typeChange}
                        closeClear={true}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <label className="col-md-4">{i18n.t(700078/*往来名称搜索*/)}</label>
                    <div  onClick={()=> !typeID && ServiceTips({text:i18n.t(700079/*请选择往来类型！*/),type:'info'})}>
                        <ConstVirtualSelect 
                            fieldName="nameID"
                            refreshMark={getFieldValue("typeForm")}
                            form={this.props.form} 
                            apiType={apiPost}
                            apiUri={`/enterprise/search?dataTyId=${typeID}`} 
                            async={true}
                            apiParams='keyword'                            
                            onChange={this.nameChange}
                            closeClear={true}                            
                            valueKeys={ da => ({
                                nameID: da.id,
                                nameVal: da.localName,
                                basSpeci: da.specTxt,
                                s_label: da.localName
                            })}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <label className="col-md-4">{i18n.t(700080/*联系人搜索*/)}</label>
                    <div onClick={()=> !nameID && ServiceTips({text:i18n.t(700081/*请选择往来名称!*/),type:'info'})}>
                    <ConstVirtualSelect 
                        fieldName="linkID"
                        refreshMark={getFieldValue("nameID",{}).nameID}
                        form={this.props.form} 
                        apiType={apiGet}
                        apiUri={`/entContact/search?beId=${nameID}`} 
                        async={true}
                        apiParams='keyword'   
                        onChange={this.linkChange}
                        closeClear={true}                        
                        valueKeys={ da => ({
                            linkID: da.id,
                            linkVal: da.localName,
                            basSpeci: da.specTxt,
                            s_label: da.localName
                        })}
                    />
                    </div>
                </div>                
            </div>
            <div className="row">
                <div className="col-md-12">
                    <label className={'col-md-2'}><span>*</span>{i18n.t(700082/*往来名称*/)}</label>
                    <input type="text"
                        className ={getFieldError('entName')?'col-md-10 text-input-nowidth error-border':'col-md-10 text-input-nowidth'}
                        {...getFieldProps('entName',{
                            rules: [{required:true}],
                            initialValue:getOne['nameVal']
                        })}
                       
                    />  
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <label className={'col-md-2'}><span>*</span>{i18n.t(100370/*联系人*/)}</label>
                    <input type="text"
                        className ={getFieldError('entContactName')?'col-md-10 text-input-nowidth error-border':'col-md-10 text-input-nowidth'}
                       
                        {...getFieldProps('entContactName',{
                            rules: [{required:true}],
                            initialValue:getOne['linkVal']
                        })}
                    />
                </div>
            </div>
            <br/>
            <ButtonDIV confirmHandle={this.confirmHandle} cancelHandle={this.cancelHandle}/>
        </div>
    }
}

// 新增 页面
let AddDivForm = createForm()(AddDIV);


// content
class CContent extends Component {

    constructor(props) {
        super(props);
    }

    // 写邮件
    writeHandle = (toAddress)=>{
        let {row,data} = this.props;
        let {emailList=[]} = this.props.data;

        // 是否 带抄送
        let copyTo = (!toAddress && (emailList['length'] )>1) ? {ccAddressArray:emailList.filter(o=>!row['sendAddress'].includes(o)).join(';') } : {}; 
        window.navTabs.open(i18n.t(700006/*写邮件*/),`/email/write`,Object.assign({},{type:'compose',collectionName:row['collectName'],toAddress:toAddress || row['sendAddress']},copyTo),{refresh: true});
    }

    // 邮件往来
    mailComeTo = (active)=>{
        let {data} = this.props;
        let ID = data['mainId'];


        switch (data['dataTyId']) {
            case 30: // 客户
                window.navTabs.open(i18n.t(100311/*客户*/)+`(${data['mainName']})`,`/client/detail/${ID}`,{id:ID,index:active},{refresh:true});
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

    // icon 跳转
    iconHandle = (option)=>{

        this.props.navRemoveTab({name: option['title'], component: option['title'], url: option['url']});
        this.props.navAddTab({name: option['title'], component: option['title'], url: option['url']});
        this.props.router.push({pathname: option['url'],query:option.data});
        // window.navTabs.open(option['title'],option['url'],option['data'],{refresh:true});
    }

    // add 
    addHandle = ()=> this.props.addHandle();

    // toogle
    toggleHandle = (row)=> this.props.toggleHandle(row);

    render(){
        let {data,dataHead={},dataTypes={},row} = this.props;
        let {country,companyTelList=[],emailList=[],skypeList=[],mobileList=[],qqList=[],telList=[],faxList=[]}=data;
        let ID = data['companyId'];
        let name = data['companyName'];
        let dataTyId = data['dataTyId'];

        // icon toggle
        switch (data['dataTyId']) {
            case 30: // 客户
                var iconPage = <li className="link-btn">
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/client/detail/${ID}`,data:{id:ID,index:'detail'}})} className="foddingicon fooding-user-mail-new" title={i18n.t(100311/*客户*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/client/detail/${ID}`,data:{id:ID,index:'business'}})} className="foddingicon fooding-business-mail-new" title={i18n.t(100321/*商机*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/client/detail/${ID}`,data:{id:ID,index:'prices'}})} className="foddingicon fooding-quote" title={i18n.t(200921/*最新价格*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/client/detail/${ID}`,data:{id:ID,index:'date'}})} className="foddingicon fooding-date-mail-new" title={i18n.t(100587/*约会*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/client/detail/${ID}`,data:{id:ID,index:'contact'}})} className="foddingicon fooding-contact-mail-new" title={i18n.t(100588/*联络*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/client/detail/${ID}`,data:{id:ID,index:'activity'}})} className="foddingicon fooding-businessEcho-mail-new" title={i18n.t(100585/*市场活动响应*/)}></i>
                    </li>;
            break;
            case 100: // 客户联系人
                var iconPage = <li className="link-btn">
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/client/detail/${ID}`,data:{id:ID,index:'detail'}})} className="foddingicon fooding-user-mail-new" title={i18n.t(100311/*客户*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/client/detail/${ID}`,data:{id:ID,index:'business'}})} className="foddingicon fooding-business-mail-new" title={i18n.t(100321/*商机*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/client/detail/${ID}`,data:{id:ID,index:'prices'}})} className="foddingicon fooding-quote" title={i18n.t(200116/*报价*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/client/detail/${ID}`,data:{id:ID,index:'date'}})} className="foddingicon fooding-date-mail-new" title={i18n.t(100587/*约会*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/client/detail/${ID}`,data:{id:ID,index:'contact'}})} className="foddingicon fooding-contact-mail-new" title={i18n.t(100588/*联络*/)}></i>
                        <i onClick={this.iconHandle.bind(this,{title:i18n.t(100311/*客户*/)+`(${name})`,url:`/client/detail/${ID}`,data:{id:ID,index:'activity'}})} className="foddingicon fooding-businessEcho-mail-new" title={i18n.t(100585/*市场活动响应*/)}></i>
                    </li>;
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

        return  <aside className="mail-linkman-card" id="card">
                <header>
                    {/*<img src="/src/styles/images/flag-red.png" alt=""/>*/}
                    <img src={imgURL} alt=""/>
                    <li style={{overflow:'inherit'}} className="name">
                        <b onClick={this.mailComeTo.bind(this,'detail')} className="font-hide" title={data['mainName'] || row['sendMail']} style={{float:'left'}}>{data['mainName'] || row['sendMail']}</b>
                        { dataHead['queryFlag'] ?
                            <li style={{float:'left',position:'relative'}}>
                                <span>{dataTypes['name']}</span>
                                &nbsp;&nbsp;&nbsp;
                                <i className="glyphicon glyphicon-chevron-down pointer" id="dropdownMenu77" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenu77" style={{minWidth:'inherit'}}>
                                    { dataHead.dataTypes.map((o,i)=><li onClick={this.toggleHandle.bind(this,o)} className="pointer" style={{padding:'0px 5px',width:'max-content'}} key={o['id']}>{o['name']}</li>) }
                                </ul>                                        
                            </li>
                            :
                            <li style={{float:'left',position:'relative'}}>
                                <i onClick={this.addHandle} style={{top:'-1px',padding:'5px'}} className="glyphicon glyphicon-plus pointer"></i>          
                            </li>
                        }                      
                    </li>
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
                            {emailList.map((o,i)=><li className='font-hide pointer' onClick={this.writeHandle.bind(this,o)} key={i} title={o}>{o}</li>)}
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
            </aside>
    }
}
let Content =NavConnect(CContent);


export default class Card extends Component {

    constructor(props) {
        super(props);

        // init state 
        this.state = {
            showDialog: false, 
            data:{dataTypes:[]}, // toggle data
            dataTypes:{}, // 下拉数据 
            infoList:{}, // 页面 数据

            visible: false,
        }
    }   

	componentWillUpdate(){
        //this.positionHandle();
    }

    // show card 
    showCardHandle = (e)=>{
        e.stopPropagation();
        e.preventDefault();
		this.getPage();        
    }

    // 切换 卡片
    toggleHandle = (row) => {
        let {data,infoList} = this.state;
        this.setState({
            infoList:{},
            dataTypes: {}    
        },function(){
            this.setState({
                infoList:data.infoList.filter((o)=>o['dataTyId']==row['id'])[0],
                dataTypes: data.dataTypes.filter((o)=>o['id']==row['id'])[0]
            });            
        });
    }

    // 新增 
    addHandle = ()=>this.setState({showDialog: true});

    // cancelHandle
    cancelHandle = ()=>this.setState({showDialog: false});

    getPage = ()=>{
        let {row} = this.props;

        // apiGet(API_FOODING_DS,'/contact/getVisitingCard',{email:'2850286253@qq.com'},
        apiGet(API_FOODING_DS,'/contact/getVisitingCard',{email:row['sendMail']},
            (response)=>{
                let dataTypes = response.data['dataTypes'][0];				
                let infoList = response.data['infoList'].filter((o)=>o['dataTyId']==dataTypes['id'])[0];	
                this.setState({
                    data: response['data'],
                    dataTypes: dataTypes,
                    infoList: infoList,
                    visible:true,
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });	        
    }

    render(){
        let {visible,data,dataTypes={},infoList={},showDialog} = this.state;
        let {row,page,email} = this.props;


        let content = (
            <div ref="HTML">                  
                <Content toggleHandle={this.toggleHandle} addHandle={this.addHandle} dataTypes={dataTypes} dataHead={data} data={infoList} row={row} router={this.props.router}/>
                <Dialog style={{zIndex:111}} width={700} visible={showDialog} title={i18n.t(100392/*新增*/)}>
                    <AddDivForm getPage={this.getPage} row={row} getForm={this.getForm} confirmHandle={this.confirmHandle} cancelHandle={this.cancelHandle}/>
                </Dialog>
            </div>   
        );

        // 判断页面
        if(page){
            var resultPage = <Popover content={content} placement="rightTop" trigger="click" getPopupContainer={() => document.getElementById(this.props.id)}>
                <i onClick={this.showCardHandle} className="foddingicon fooding-card-mail-new" title={i18n.t(500291/*卡片*/)}></i>
            </Popover>
        } else{
            var resultPage = <Popover content={content} placement="rightTop" trigger="click" getPopupContainer={() => document.getElementById(this.props.id)}>
                { email ?
                    <a style={{display:'inline-block',width:"100%"}} onClick={this.showCardHandle} href="javascript:;" title={email}>{email}</a>
                    :
                    <a onClick={this.showCardHandle} href="javascript:;" title={row['sendName']}>{row['sendName']?row['sendName']:row['sendMail']}</a>
                }
            </Popover>            
        }

        return resultPage;
    } 
}