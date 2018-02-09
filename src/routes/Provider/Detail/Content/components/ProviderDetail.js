import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';

import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, getUser} from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
import {I18n} from "../../../../../lib/i18n";

export class ProviderDetail extends Component{
	constructor(props) {
        super(props);
        props.detail && props.detail(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();

        //地址列表 保存并关闭
        this.onAddressListSaveAndClose=this.onAddressListSaveAndClose.bind(this);
        //联系方式 保存并关闭
        this.onContactSaveAndClose=this.onContactSaveAndClose.bind(this);
        //银行账号 保存并关闭
        this.onBankListSaveAndClose=this.onBankListSaveAndClose.bind(this);

        //支付条款 保存并关闭
        this.onTradrulePaytermListSaveAndClose=this.onTradrulePaytermListSaveAndClose.bind(this);
        //支付条款 保存并新增
        this.onTradrulePaytermListSaveAdd=this.onTradrulePaytermListSaveAdd.bind(this);

         //供应商别名 保存并关闭
        //this.onBizExtNameSaveAndClose=this.onBizExtNameSaveAndClose.bind(this);
        //供应商别名 保存并新增
        //this.onBizExtNameSaveAdd=this.onBizExtNameSaveAdd.bind(this);
        //交货港别名 保存并关闭
        this.onBestatnListSaveAndClose=this.onBestatnListSaveAndClose.bind(this);
        ////交货港别名 保存并新增
        this.onBestatnListSaveAdd=this.onBestatnListSaveAdd.bind(this);

        //可提供证书 保存并关闭
        this.onTradruleCertfctSaveAndClose=this.onTradruleCertfctSaveAndClose.bind(this);
        //可提供证书 保存并新增
        this.onTradruleCertfctSaveAdd=this.onTradruleCertfctSaveAdd.bind(this);
        //地址用途
       // this.onAddressUserSaveAndClose=this.onAddressUserSaveAndClose.bind(this);

        this.getPages = this.getPages.bind(this);
    }
    getPages(){
        this.onAddressListInitData();
        this.onContactInitData();
        this.onBankListInitData();
        this.onTradrultPaytermInitData();
        // this.onBizExtNameInitData();
        this.onBestatnListInitData();
        this.onTradruleCertfctInitData();
        //this.onAddressUserInitData();
    }
    initState(){
        return {
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>,
            id:this.props.location.query.id,

            addressList: [], //地址列表
            bankacctList: [], //银行账号
            bizExtNameList:  [], //供应商别名
            contactList:  [], //联系方式列表
            functnList: [], //功能地址列表
            tradrulePaytermList: [], //支付条款
            beStatnList: [], //交货港
            tradruleCertfctList: [], //可提供证书
        }
    }
    handleClick = (e, data, Template) => {
        let that = this;
        if(data.number ==2){
            let id = [],tempString = i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
            id = (data && data.record)? [data.record.id]:data.selectArr.map((o) => o.id);
            if(!(data && data.record || data.selectArr.length == 1)){
                tempString = i18n.t(100395/*已选中*/) + data.selectArr.length + i18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
            }
             Confirm(tempString, {
                  done: () => {
                    if(data.id == "provider-detail-addressList"){//地址列表
                        //id = "provider-detail-addressList"  表示是地址列表 此处id和传过去的id一样
                         apiForm(API_FOODING_DS,'/address/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.onAddressListInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "provider-detail-contact"){//联系方式
                        //id = "provider-detail-contact" 表示是联系方式
                        apiForm(API_FOODING_DS,'/contact/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onContactInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "provider-detail-bank"){//银行账号
                        apiForm(API_FOODING_DS,'/bankacct/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onBankListInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "provider-detail-tradrulepayterm"){//支付条款
                        // id = "provider-detail-tradrulepayterm" 为支付条款
                        apiForm(API_FOODING_DS,'/tradrulePayterm/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onTradrultPaytermInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "provider-detail-bizExtNameList"){//供应商别名
                        //id = "provider-detail-bizExtNameList" 表示供应商别名
                        apiForm(API_FOODING_DS,'/bizExtName/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            //that.onBizExtNameInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "provider-detail-bestatn"){//交货港
                        //id = "provider-detail-bestatn" 表示交货港
                        apiForm(API_FOODING_DS,'/beStatn/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onBestatnListInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-tradruleCertfct"){//可提供证书
                        //id = "provider-detail-tradruleCertfct" 表示可提供证书
                        apiForm(API_FOODING_DS,'/tradruleCertfct/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onTradruleCertfctInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "provider-detail-addressUser"){//功能地址
                        //id = "provider-detail-tradruleCertfct" 表示功能地址
                        apiForm(API_FOODING_DS,'/address/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            //that.onAddressUserInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }
                }
            });
        }else if(data.number == 3){
            //没有看到失效，所有失效先不做，留给后续再做
            return false;
        }else{
        	let dialogTitle= data.action+data.name.title;
        	 this.setState({
        	 	visible:true,
                dialogTitle:dialogTitle,
                dilogTelmp:Template
        	});
        }
    }
     //保存常规，组织，注册信息  客户组织的编辑
    onSaveAndClose(value,data){
        let that = this;
        if(data.title == "provider-detail-normal"){//表示编辑供应商常规
            //表示编辑客户常规
            value = Object.assign({},data,value);
            apiForm(API_FOODING_DS,'/vendor/updateRoutine',value, response => {
                ServiceTips({text:response.message,type:'success'})
                that.props.getDetailData();
            }, error => {
                ServiceTips({text:error.message,type:'error'})
            })
        }else if(data.title == "provider-detail-sign"){//表示编辑供应商注册信息
            //表示编辑供应商注册信息
            value = Object.assign({},value,{id:this.state.id,optlock:data.optlock});
            apiPost(API_FOODING_DS,'/vendor/regInfo/updateRegInfo',value, response => {
                ServiceTips({text:response.message,type:'success'})
                that.props.getDetailData();
            }, error => {
                ServiceTips({text:error.message,type:'error'})
            })
        }else if(data.title == "orginzation"){
            value = Object.assign({},value,{id:this.state.id,optlock:data.optlock,});
            apiForm(API_FOODING_DS,'/vendor/updateParty',value, response => {
                ServiceTips({text:response.message,type:'success'})
                that.props.getDetailData();
            }, error => {
                ServiceTips({text:error.message,type:'error'})
            })
        }
        this.setState({visible:!this.state.visible});
    }
	onCancel(){
        this.setState({visible:false});
	}

     //地址列表 保存并关闭
    onAddressListSaveAndClose(value,data){
        /*let that = this;
        value = Object.assign({},{beId:this.state.id,dfutMrk:false,dataTyId:40},value);
        if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/address/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});  
            that.onAddressListInitData();         
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});*/

         this.setState({visible:false},() => this.onAddressListInitData());
    }

    //联系方式 保存并关闭
    onContactSaveAndClose(value,data){
        let that = this;
        //cntryId:data.cntryId  国家ID 是否必要，要的话就要到customer
        value = Object.assign({},{beId:this.state.id,dataTyId:40},value);
        if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/contact/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});  
            that.onContactInitData();
            that.props.getDetailData();     
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //联系方式，保存并新增
    onContactSaveAdd = (value,data) => {
       let that = this;
       value = Object.assign({},{beId:this.state.id,dataTyId:40},value);
        apiPost(API_FOODING_DS,'/contact/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});  
            that.onContactInitData();
            that.props.getDetailData(); 
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }

    //银行账号 保存并关闭
    onBankListSaveAndClose(value,data){
        let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:40},value);
         if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/bankacct/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onBankListInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }

    //支付条款 保存并关闭    
    onTradrulePaytermListSaveAndClose(value,data){
        let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:40},value);
         if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/tradrulePayterm/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onTradrultPaytermInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //支付条款 保存并新增
    onTradrulePaytermListSaveAdd(value,data){
        let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:40},value);
        //  if(JSON.stringify(data) !== "{}"){//表明是编辑
        //     value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        // }
        apiPost(API_FOODING_DS,'/tradrulePayterm/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onTradrultPaytermInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
    //供应商别名 保存并关闭
    // onBizExtNameSaveAndClose(value,data){
    //     let that = this;
    //     value = Object.assign({},{sourceId:this.state.id,dataTyId:40},value);
    //      if(JSON.stringify(data) !== "{}"){//表明是编辑
    //         value = Object.assign({},value,{id:data.id,optlock:data.optlock});
    //     }
    //     apiPost(API_FOODING_DS,'/bizExtName/save',value,(response) => {
    //         ServiceTips({text:response.message,type:'success'});
    //         that.onBizExtNameInitData();          
    //     },(error)=>{
    //         ServiceTips({text:error.message,type:'error'});
    //     })
    //     this.setState({visible:false});
    // }
    //供应商别名 保存并新增
    // onBizExtNameSaveAdd(value,data){
    //     let that = this;
    //     value = Object.assign({},{sourceId:this.state.id,dataTyId:40},value);
    //     apiPost(API_FOODING_DS,'/bizExtName/save',value,(response) => {
    //         ServiceTips({text:response.message,type:'success'});
    //         that.onBizExtNameInitData();          
    //     },(error)=>{
    //         ServiceTips({text:error.message,type:'error'});
    //     })
    // }

    //交货港 保存并关闭
    onBestatnListSaveAndClose(value,data){
        let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:40},value);
         if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/beStatn/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onBestatnListInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //交货港 保存并新增
    onBestatnListSaveAdd(value,data){
        let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:40},value);
        apiPost(API_FOODING_DS,'/beStatn/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onBestatnListInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }

    //可提供证书 保存并关闭
    onTradruleCertfctSaveAndClose(value,data){
        let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:40},value);
         if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/tradruleCertfct/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onTradruleCertfctInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //可提供证书 保存并新增
    onTradruleCertfctSaveAdd(value,data){
        let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:40},value);
        apiPost(API_FOODING_DS,'/tradruleCertfct/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onTradruleCertfctInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
    //地址用途 保存并关闭
    // onAddressUserSaveAndClose(){
    //     this.setState({visible:false});
    //     this.onAddressUserInitData();//更新数据
    // }

     //地址列表的数据拉取
    onAddressListInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/address/address/getList',{beId:this.state.id}, response => {
            that.setState({
                addressList:response.data
            })
        }, error => console.log(error.message))
    }
    //联系方式 数据拉取
    onContactInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/contact/getList',{sourceId:this.state.id}, response => {
            that.setState({
                contactList:response.data
            })
        }, error => console.log(error.message))
    }
    //银行账号 数据拉取
    onBankListInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/bankacct/getList',{sourceId:this.state.id}, response => {
            that.setState({
                bankacctList:response.data
            })
        }, error => console.log(error.message))
    }
    //支付条款 数据拉取
    onTradrultPaytermInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/tradrulePayterm/getList', {sourceId:this.state.id}, response => {
            that.setState({
                tradrulePaytermList:response.data
            })
        }, error => console.log(error.message))
    }
    //供应商别名 拉取数据
    // onBizExtNameInitData(){
    //    let that = this;
    //     apiGet(API_FOODING_DS,'/bizExtName/getList',{sourceId:this.state.id}, response => {
    //         that.setState({
    //             bizExtNameList:response.data
    //         })
    //     }, error => console.log(error.message)) 
    // }
    //交货港 拉取数据
    onBestatnListInitData(){
       let that = this;
        apiGet(API_FOODING_DS,'/beStatn/getList',{sourceId:this.state.id}, response => {
            that.setState({
                beStatnList:response.data
            })
        }, error => console.log(error.message)) 
    }

    //可提供证书 拉取数据
    onTradruleCertfctInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/tradruleCertfct/getList',{sourceId:this.state.id}, response => {
            that.setState({
                tradruleCertfctList:response.data
            })
        }, error => console.log(error.message))
    }
    //地址用途 拉取数据
    // onAddressUserInitData(){
    //     let that = this;
    //     apiGet(API_FOODING_DS,'/address/funct/getList',{beId:this.state.id}, response => {
    //         that.setState({
    //             functnList:response.data
    //         })
    //     }, error => console.log(error.message))
    // }

    componentDidMount(){
        if(!this.props.isDetail){
            // this.getPages();
        }
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        let padding = 262;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0)); 
        if(this.props.id !== nextProps.id && !this.props.isDetail){
            // this.setState({sourceId:nextProps.id},() => {
            //     this.onAddressListInitData();
            //     this.onContactInitData();
            //     this.onBankListInitData();
            //     this.onTradrultPaytermInitData();
            //     this.onBestatnListInitData();
            //     this.onTradruleCertfctInitData();
            // })
        }
    }
    // 写邮件
    writeHandle = (toAddress) => {
        let login = getUser(); // 登录信息
        window.navTabs.open(i18n.t(700006/*写邮件*/), `/email/write`, Object.assign({}, {
            type: 'compose',
            collectionName: login['defaultEmail'],
            toAddress: toAddress
        }), {refresh: true});
    };
	render(){
		const commonForm = this.state.dilogTelmp;   
        const {addressList,bankacctList,bizExtNameList,contactList,functnList,beStatnList,tradruleCertfctList,tradrulePaytermList} = this.state;
        const vendor = this.props.vendor;
        let regCapitalCurrenObj = this.props.regCapitalCurren;
        var that = this;
		return (
			  <div> 
	               <div className='scroll' style={{backgroundColor:'#f0f4f8',
	               height:this.state.scrollHeight,overflow:'auto'}}>             
		               <div className = 'col'>
		               		<Template1 
                                menuList={[
                                    {permissions:'provider.edit',type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
                                ]} 
                                upload = {this.props.getDetailData}                              
                                onCancel ={this.onCancel} Zindex ={10} 
    		               		width={107}
                                DialogTempalte={require('./NormalDialog').default}
    		               		isShowMenu={true} 
    		               		openDialog={this.handleClick}
    		               		onSaveAndClose={this.onSaveAndClose}
                                AjaxInit={true}
                                API_FOODING={API_FOODING_DS}
                                portname={'/vendor/routine/getInit'}
                                params={{id:this.state.id}}
    		                    id={'provider-detail-normal'} title={i18n.t(100138/*常规*/)} tempArray={[
    		                    	{key:i18n.t(200968/*供应商类别*/),value:vendor.cstmType},
    		                    	{key:i18n.t(200468/*供应商等级*/),value:vendor.cstmLevel},
    		                    	{key:i18n.t(100002/*描述*/),value:vendor.description}
		                    ]}/>

                    <MeasureCommon 
                        menuList={[
                            {type:'add',permissions:'provider.dtl.add'},
                            {type:'delete',permissions:'provider.dtl.del'},
                            {type:'edit',permissions:'provider.edit'}                                        
                        ]}                    
                        onCancel ={this.onCancel} title ={i18n.t(100246/*地址列表*/)} 
                        Zindex ={9}
                        openDialog={this.handleClick}
                        onSaveAndClose={this.onAddressListSaveAndClose}
                         DialogTempalte ={require('../../../../Client/Detail/Content/components/AddressPurposeDialog').default}
                         showHeader ={false}
                         checkedRowsArray={[]}
                         id={'provider-detail-addressList'}
                         AjaxInit={true}
                         API_FOODING={API_FOODING_DS}
                         portname={'/address/getInit'}
                         params={{beId:this.state.id,dataTyId:40}}
                         otherData={{beId:this.state.id,dataTyId:40}}
                         columns ={
                            [{
                                title : i18n.t(100087/*国家*/),
                                dataIndex : 'country',
                                key : "country",
                                width : '14%',
                                render(data,row,index){
                                    if(data&&data.localName){
                                        return (<div title={data.localName}>{data.localName}</div>)
                                    }
                                    return;
                                }
                            },
                            {
                                title : i18n.t(100247/*省*/),
                                dataIndex : 'province',
                                key : "province",
                                width : '14%',
                                render(data,row,index){
                                    if(data&&data.localName){
                                        return (<div title={data.localName}>{data.localName}</div>)
                                    }
                                    return;
                                }
                            },
                            {
                                title : i18n.t(100248/*市*/),
                                dataIndex : 'city',
                                key : "city",
                                width : '14%',
                                render(data,row,index){
                                    if(data&&data.localName){
                                        return (<div title={data.localName}>{data.localName}</div>)
                                    }
                                    return;
                                }
                            },
                            {
                                title : i18n.t(100249/*区县*/),
                                dataIndex : 'district',
                                key : "district",
                                width : '14%',
                                render(data,row,index){
                                    if(data&&data.localName){
                                        return (<div title={data.localName}>{data.localName}</div>)
                                    }
                                    return;
                                }
                            },
                            {
                                title : i18n.t(100250/*详细地址*/),
                                dataIndex : 'name',
                                key : "name",
                                width : '24%',
                                render(data,row,index){
                                    return (<div title={data}>{data}</div>)
                                }
                            },
                            {
                                title : i18n.t(100251/*邮编*/),
                                dataIndex : "zip",
                                key : "zip",
                                width : "10%",
                                render(data,row,index){
                                    return data;
                                }
                            },{
                                title : i18n.t(100547/*地址类型*/),
                                dataIndex : 'bizFuncType',
                                key : "bizFuncType",
                                width : '14%',
                                render(data,row,index){
                                    data = data !== null?data:"";
                                    if(typeof data == "object" && ('name' in data)){
                                            return data.name;
                                        }
                                    return (<div title={data}>{data}</div>)
                                }
                            },{
                                title : i18n.t(100123/*默认*/),
                                dataIndex : "dfutMrk",
                                key : "dfutMrk",
                                width : "8%",
                                render(data,row,index){
                                    return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                }
                            }]
                        }
                        data={addressList}
                    />
                    <MeasureCommon 
                            menuList={[
                                {type:'add',permissions:'provider.dtl.add'},
                                {type:'delete',permissions:'provider.dtl.del'},
                                {type:'edit',permissions:'provider.edit'}                                        
                            ]}                       
                            onCancel ={this.onCancel} title ={i18n.t(100500/*银行账号*/)}
                            Zindex ={7} 
                            openDialog={this.handleClick}
                             DialogTempalte ={require('../../../../Client/Detail/Content/components/BankTemplateDialog').default}
                             showHeader ={true}
                             checkedRowsArray={[]}
                             id={'provider-detail-bank'}
                             onSaveAndClose={this.onBankListSaveAndClose}
                             AjaxInit={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/bankacct/getInit'}
                             params={{}}
                             columns ={
                                    [{ 
                                        title : I18n.t(100501/*账户名称*/),
                                        dataIndex : 'name',
                                        key : "name",
                                        width : '18%',
                                        render(data,row,index){
                                            return <div className={'text-ellipsis'} title={data}>{data}</div>
                                        }
                                    },
                                    { 
                                        title : I18n.t(100500/*银行账号*/),
                                        dataIndex : 'bacctCode',
                                        key : "bacctCode",
                                        width : '20%',
                                        render(data,row,index){
                                            return <div className={'text-ellipsis'} title={data}>{data}</div>
                                        }
                                    },{ 
                                        title : I18n.t(100507/*开户行*/),
                                        dataIndex : 'bankName',
                                        key : "bankName",
                                        width : '35%',
                                        render(data,row,index){
                                            return <div className={'text-ellipsis'} title={data}>{data}</div>
                                        }
                                    },{ 
                                        title : I18n.t(100504/*收款人*/),
                                        dataIndex : 'actStaff',
                                        key : "actStaff",
                                        width : '10%',
                                        render(data,row,index){
                                            return <div className={'text-ellipsis'} title={data}>{data}</div>
                                        }
                                    },
                                    {
                                        title : I18n.t(100284/*币种*/),
                                        dataIndex : 'curren',
                                        key : "curren",
                                        width:'10%',
                                        render(data,row,index){
                                            data = data !== null?data:"";
                                            if(typeof data == "object" && ('localName' in data)){
                                                    return data.localName;
                                                }
                                            return (<div title={data}>{data}</div>)
                                        }
                                    },{
                                        title : I18n.t(100123/*默认*/),
                                        dataIndex : "dfutMrk",
                                        key : "dfutMrk",
                                        width : "12%",
                                        render(data,row,index){
                                            return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                        }
                                    }
                                   ]
                            }
                            data={bankacctList}
                        />
                    <Template1 
                            menuList={[
                                {permissions:'provider.edit',type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
                            ]}                    
                            onCancel ={this.onCancel} Zindex ={6}
		               		width={107}
                            DialogTempalte={require('./NormalDialog').default}
		               		isShowMenu={true} 
		               		openDialog={this.handleClick}
		               		onSaveAndClose={this.onSaveAndClose}
                            AjaxInit={true}
                            API_FOODING={API_FOODING_DS}
                            portname={'/vendor/regInfo/getInit'}
                            params={{id:this.state.id}}
		                    id={'provider-detail-sign'} title={i18n.t(100139/*注册信息*/)} tempArray={[
		                    	{key:i18n.t(100358/*税号*/),value:vendor.taxIdenSN},
		                    	{key:i18n.t(100561/*法人代表*/),value:vendor.leglpsn},
		                    	{key:i18n.t(100563/*成立日期*/),value:new Date(vendor.estabDate).Format('yyyy-MM-dd')},
		                    	{key:i18n.t(100564/*注册资本*/),value:<b>{vendor.regCapital} {vendor.regCapital&&regCapitalCurrenObj && regCapitalCurrenObj.localName ||"" }</b>} 

		                    ]}/>
		                    <Template1                         
                            DialogTempalte={require('./NormalDialog').default}
                            onCancel ={this.onCancel} isShowMenu={true}  openDialog={this.handleClick}
                            onSaveAndClose={this.onSaveAndClose}
                            AjaxInit={true}
                            API_FOODING={API_FOODING_DS}
                            portname={'/vendor/getInit'}
                            params={{id:this.state.id}}
                            id={'orginzation'} title={i18n.t(100140/*组织*/)}  isShowIcon={false} tempArray={[{key:i18n.t(100243/*集团*/),value:vendor.cluster},{key:i18n.t(100486/*公司*/),value:vendor.company}]}/>
		                    <Template1 title={i18n.t(100194/*系统信息*/)} id ={'5'}  isShowIcon={false} DialogTempalte={require('./NormalDialog').default}
		                    tempArray={[{key:i18n.t(100143/*创建人*/),value:vendor.createUserName},{key:i18n.t(100144/*修改人*/),value:vendor.updateUserName},
		                    {key:i18n.t(100145/*创建时间*/),value:new Date(vendor.createDate).Format('yyyy-MM-dd hh:mm:ss')},{key:i18n.t(100146/*修改时间*/),value:new Date(vendor.updateDate).Format('yyyy-MM-dd hh:mm:ss')}]}/>
		               </div>
		               <div className = 'col' style={{paddingLeft:0}}>
		           
                    <div className='col'  style={{paddingLeft:0,paddingTop:0}}>
                         <MeasureCommon 
                            menuList={[
                                {type:'add',permissions:'provider.dtl.add'},
                                {type:'delete',permissions:'provider.dtl.del'},
                                {type:'edit',permissions:'provider.edit'}                                        
                            ]}                   
                            onCancel ={this.onCancel} title ={i18n.t(100245/*联系方式*/)} 
                            Zindex={5}
                            openDialog={this.handleClick}
                            DialogTempalte ={require('../../../../Client/Detail/Content/components/ContactDialog').default}
                            showHeader ={false}
                            checkedRowsArray={[]}
                            id={'provider-detail-contact'}
                            onSaveAndClose={this.onContactSaveAndClose}
                            onSaveAdd={this.onContactSaveAdd}
                            AjaxInit={true}
                            API_FOODING={API_FOODING_DS}
                            portname={'/contact/getInit'}
                            params={{sourceId:this.state.id,dataTyId:40,cntryId:vendor.cntryId}}
                            columns ={
                                        [{
                                            title : "linkType",
                                            dataIndex : 'linkType',
                                            key : "linkType",
                                            width : '16%',
                                            render(data,row,index){
                                                let classN = '';
                                                let iconArray = [
                                                    {classn:'foddingicon fooding-company_icon',type:'site',num:10},
                                                    {classn:'foddingicon fooding-tel_icon2',type:'phone',num:20},
                                                    {classn:'foddingicon fooding-fax-icon2',type:'fax',num:30},
                                                    {classn:'foddingicon fooding-qq-icon2',type:'QQ',num:40},
                                                    {classn:'foddingicon fooding-facebook',type:'site',num:50},
                                                    {classn:'foddingicon fooding-weibo',type:'site',num:60},
                                                    {classn:'foddingicon fooding-weite',type:'site',num:70},
                                                    {classn:'foddingicon fooding-email_32',type:'email',num:80},
                                                    {classn:'foddingicon fooding-nation_icon',type:'email',num:90},
                                                    {classn:'foddingicon fooding-phone_icon2',type:'mobilephone',num:100},
                                                    {classn:'foddingicon fooding-skype-icon2',type:'skype',num:110},
                                                    {classn:'foddingicon fooding-whatsapp',type:'site',num:130},
                                                    {classn:'foddingicon fooding-weixin',type:'site',num:140}];

                                                for(let i = 0; i < iconArray.length; i++){
                                                    if(iconArray[i].num == (data&&data.id?data.id:data)){
                                                        classN = iconArray[i].classn;
                                                        break;
                                                    }
                                                }
                                                return (<i style={{fontSize:'16px'}} className={classN}></i>)
                                            }
                                        },
                                        {
                                            title : i18n.t(100245/*联系方式*/),
                                            dataIndex : 'name',
                                            key : "name",
                                            width:'70%',
                                            render(data,row,index){
                                                if(row.linkTyId == 80){

                                                    return <a  onClick={that.writeHandle.bind(that,data,row)} className='link-color'>{data}</a>;
                                                }else{
                                                    return (<div title={data} className={'text-ellipsis'}>{data}</div>);
                                                }
                                            }
                                        },{
                                            title : i18n.t(100123/*默认*/),
                                            dataIndex : "dfutMrk",
                                            key : "dfutMrk",
                                            width : "10%",
                                            render(data,row,index){
                                                return <i style = {{display: 'block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                            }
                                        }
                                    ]
                                    }
                            data={contactList}
                        />
                        <MeasureCommon 
                            menuList={[
                                {type:'add',permissions:'provider.dtl.add'},
                                {type:'delete',permissions:'provider.dtl.del'},
                                {type:'edit',permissions:'provider.edit'}                                        
                            ]}                       
                            onCancel ={this.onCancel} title ={i18n.t(200969/*交货港*/)} 
                            Zindex ={4}
                            openDialog={this.handleClick}
                            DialogTempalte ={
                                require('./DeliveryDialog').default
                            }
                            showHeader ={false}
                            checkedRowsArray={[]}
                            id={'provider-detail-bestatn'}
                            onSaveAndClose={this.onBestatnListSaveAndClose}
                            onSaveAdd={this.onBestatnListSaveAdd}
                            AjaxInit={true}
                            API_FOODING={API_FOODING_DS}
                            portname={'/beStatn/getInit'}
                            params={{}}
                            columns ={
                                [{title : i18n.t(100156/*港口类型*/),
                                dataIndex : 'statnType',
                                width:'30%',
                                key : "statnType",
                                render(data,row,index){
                                        data = data !== null?data:"";
                                            if(typeof data == "object" && ('localName' in data)){
                                                    return data.localName;
                                                }
                                            return (<div title={data}>{data}</div>)
                                    }
                                },
                                {
                                    title : i18n.t(100155/*港口*/),
                                    dataIndex : 'statn',
                                    width:'30%',
                                    key : "statn",
                                    render(data,row,index){
                                          data = data !== null?data:"";
                                            if(typeof data == "object" && ('localName' in data)){
                                                    return data.localName;
                                                }
                                            return (<div title={data}>{data}</div>)
                                    }
                                },
                                {
                                    title : i18n.t(200466/*加收费用*/),
                                    dataIndex : 'extCharge',
                                    width:'30%',
                                    key : "extCharge",
                                    render(data,row,index){
                                       return <div>{data}&nbsp;&nbsp;{row.curren}/{row.unitofmea}</div>
                                    }
                                }]}
                                data={beStatnList}
                            /> 
                           
                    </div>
                    <div className='col' style={{paddingLeft:0,paddingTop:0,paddingRight: 0}}>
                        <MeasureCommon 
                            menuList={[
                                {type:'add',permissions:'provider.dtl.add'},
                                {type:'delete',permissions:'provider.dtl.del'},
                                {type:'edit',permissions:'provider.edit'}                                        
                            ]}                       
                            onCancel ={this.onCancel} title ={i18n.t(100133/*支付条款*/)} 
                            Zindex={2}
                            openDialog={this.handleClick}
                             DialogTempalte ={require('../../../../servBe/Detail/Content/components/TradrulePaytermListDialog').default}
                             showHeader ={false}
                             checkedRowsArray={[]}
                             id={'provider-detail-tradrulepayterm'}
                             onSaveAdd={this.onTradrulePaytermListSaveAdd}
                             onSaveAndClose={this.onTradrulePaytermListSaveAndClose}
                             AjaxInit={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/tradrulePayterm/getInit'}
                             params={{dataTyId:40,sourceId:this.state.id}}
                             columns ={
                                [{
                                    title : i18n.t(100133/*支付条款*/),
                                    dataIndex : 'payTrm',
                                    key : "payTrm",
                                    width:'80%',
                                    render(data,row,index){
                                        data = data !== null?data:"";
                                        if(typeof data == "object" && ('localName' in data)){
                                            return <div className={'text-ellipsis'}>{data.localName}</div>
                                        }
                                        return <div className={'text-ellipsis'}>{data}</div>
                                    }
                                },{
                                    title : i18n.t(100123/*默认*/),
                                    dataIndex : "dfutMrk",
                                    key : "dfutMrk",
                                    width : "10%",
                                    render(data,row,index){
                                        return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                    }
                                }
                               ]
                            }
                            data={tradrulePaytermList}
                        /> 
                        <MeasureCommon 
                            menuList={[
                                {type:'add',permissions:'provider.dtl.add'},
                                {type:'delete',permissions:'provider.dtl.del'}

                            ]}
                            iconArray={[1,2]}
                            menuItems={[1,2]}
                            onCancel ={this.onCancel} title ={i18n.t(200963/*可提供证书*/)}
                             Zindex ={1}
                             openDialog={this.handleClick}
                             DialogTempalte ={require('./CertfctDialog').default}
                             showHeader ={false}
                             checkedRowsArray={[]}
                             id={'client-detail-tradruleCertfct'}
                             onSaveAndClose={this.onTradruleCertfctSaveAndClose}
                             onSaveAdd={this.onTradruleCertfctSaveAdd}
                             AjaxInit={true}
                             isPost={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/object/getMiniList'}
                             params={{obj:'com.fooding.fc.ds.entity.Certfct'}}
                             columns ={
                                 [{
                                     title : i18n.t(100098/*证书*/),
                                     dataIndex : 'ccardType',
                                     key : "ccardType",
                                     width:'100%',
                                     render(data,row,index){
                                         return (<div>{row.localName}</div>);
                                     }

                                 }]
                             }
                             data={tradruleCertfctList}
                        /> 
                            
                    </div>
               </div>
           </div>
	                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
		                {commonForm}
		            </Dialog>
        </div>
			);
	}

}
export default ProviderDetail;

 
