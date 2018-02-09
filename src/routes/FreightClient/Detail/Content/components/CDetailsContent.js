import i18n from './../../../../../lib/i18n';
import React, {Component} from "react";
import Template1 from "./Template1";
import Dialog from "../../../../../components/Dialog";
import Confirm from "../../../../../components/Dialog/Confirm";
import MeasureCommon from "../../../../../components/RuleTemplate";

import {I18n} from "../../../../../lib/i18n";
//引入ajax请求
import {API_FOODING_DS, apiForm, apiGet, apiPost} from "../../../../../services/apiCall";
import ServiceTips from "../../../../../components/ServiceTips";

export class CDetailsContent extends Component{
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
        //结算币种 保存并新增
        this.onCstmSalListSaveAdd=this.onCstmSalListSaveAdd.bind(this);
        //结算币种 保存并关闭
        this.onCstmSalListSaveAndClose=this.onCstmSalListSaveAndClose.bind(this);
        //船公司要求 保存并新增
        this.onTradruleTransbeSaveAdd=this.onTradruleTransbeSaveAdd.bind(this);
        //船公司要求 保存并关闭
        this.onTradruleTransbeSaveAndClose=this.onTradruleTransbeSaveAndClose.bind(this);
        //单据要求 保存并关闭
        this.onTradruleBillrequSaveAndClose=this.onTradruleBillrequSaveAndClose.bind(this);
        //单据要求 保存并新增
        this.onTradruleBillrequSaveAdd=this.onTradruleBillrequSaveAdd.bind(this);
        //港口要求 保存并关闭
        this.onTradruleStatnSaveAndClose=this.onTradruleStatnSaveAndClose.bind(this);
        //港口要求 保存并新增
        this.onTradruleStatnSaveAdd=this.onTradruleStatnSaveAdd.bind(this);
        //运输要求 保存并关闭
         this.TransportRequireSaveAndClose=this.TransportRequireSaveAndClose.bind(this);
        //运输要求 保存并新增
        this.TransportRequireSaveAdd=this.TransportRequireSaveAdd.bind(this);
        //地址用途
        //this.onAddressUserSaveAndClose=this.onAddressUserSaveAndClose.bind(this);


        this.onAddressListInitData=this.onAddressListInitData.bind(this);
        this.onContactInitData=this.onContactInitData.bind(this);
        this.onBankListInitData=this.onBankListInitData.bind(this);
        this.onTradrultPaytermInitData=this.onTradrultPaytermInitData.bind(this);
        this.getPage = this.getPage.bind(this);
    }
    handleClick = (e, data, Template) => {
        let that = this;
        if(data.number== 2){
            let id = [],tempString = I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
            id = (data && data.record)? [data.record.id]:data.selectArr.map((o) => o.id);
            if(!(data && data.record || data.selectArr.length == 1)){
                tempString = I18n.t(100395/*已选中*/) + data.selectArr.length + I18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
            }
            Confirm(tempString, {
                  done: () => {
                    if(data.id == "client-detail-addressList"){//地址列表
                        //id = "client-detail-addressList"  表示是地址列表 此处id和传过去的id一样
                         apiForm(API_FOODING_DS,'/address/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.onAddressListInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-contact"){//联系方式
                        //id = "client-detail-contact" 表示是联系方式
                        apiForm(API_FOODING_DS,'/contact/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onContactInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-bank"){//银行账号
                        apiForm(API_FOODING_DS,'/bankacct/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onBankListInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-tradrulepayterm"){//支付条款
                        // id = "client-detail-tradrulepayterm" 为支付条款
                        apiForm(API_FOODING_DS,'/tradrulePayterm/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onTradrultPaytermInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-cstmSalList"){//结算币种
                        //id == "client-detail-cstmSalList" 表示结算币种
                        apiForm(API_FOODING_DS,'/cstmSal/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onCstmSalListInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-tradruleTransbe"){//船公司要求
                        //id == "client-detail-tradruleTransbe" 表示船公司要求
                        apiForm(API_FOODING_DS,'/tradruleTransbe/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onTradruleTransbeInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-tradruleBillrequ"){//单据要求
                        //id == "client-detail-tradruleBillrequ" 表示单据要求
                        apiForm(API_FOODING_DS,'/tradruleBillrequ/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onTradruleBillrequInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-tradruleStatn"){//港口要求
                        //id = "client-detail-tradruleStatn" 表示港口要求
                        apiForm(API_FOODING_DS,'/tradruleStatn/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onTradruleStatnInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-bizExtNameList"){//客户别名
                        //id = "client-detail-bizExtNameList" 表示客户别名
                        apiForm(API_FOODING_DS,'/bizExtName/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            //that.onBizExtNameInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-addressUser"){//地址用途
                        //id = "provider-detail-addressUser" 表示可地址用途
                        apiForm(API_FOODING_DS,'/address/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onAddressUserInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-yunshurequire"){//运输要求
                        //id = "provider-detail-addressUser" 表示运输要求
                        apiForm(API_FOODING_DS,'/tradrulePropty/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.TransportRequireInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }  
                }
            });
            return false;
        }else if(data.number == 3){
            //没有看到失效，所有失效先不做，留给后续再做
            return false;
        }else{
            let dialogTitle= data.action+data.name.title;
            this.setState({
                    visible: true,
                    dialogTitle:dialogTitle,
                    dilogTelmp:Template
            }); 
        }    
    }
    initState(){
        return {
            visible:false, 
            dialogTitle:'',
            dilogTelmp:<div></div>,
            id:this.props.location.query.id,
            addressList: [], //地址列表
            bankacctList:[], //银行账号
            contactList:[], //联系方式列表
            cstmSalList:[], //结算币种
            tradruleBillrequList: [], //单据要求
            tradrulePaytermList: [], //支付条款
            tradruleStatnList: [], // 港口要求
            tradruleTransbeList: [], //船公司要求
            TransportRequireList:[] //运输要求
        }
	}
    //保存常规，组织，注册信息  客户组织的{I18n.t(100439/*编辑*/)}
	onSaveAndClose(value,data){
        let that = this;
        if(data.title == "client-detail-normal"){//表示{I18n.t(100439/*编辑*/)}客户常规
            //表示{I18n.t(100439/*编辑*/)}客户常规
            value = Object.assign({},value,{id:this.state.id,optlock:data.optlock});
            apiForm(API_FOODING_DS,'/customer/updateRoutine',value, response => {
                ServiceTips({text:response.message,type:'success'})
                that.props.getDetailData();
            }, error => {
                ServiceTips({text:error.message,type:'error'})
            })
        }else if(data.title == "client-detail-sign"){//表示{I18n.t(100439/*编辑*/)}客户注册信息
            //表示{I18n.t(100439/*编辑*/)}客户注册信息
            value = Object.assign({},value,{id:this.state.id,optlock:data.optlock});
            apiPost(API_FOODING_DS,'/customer/regInfo/updateRegInfo',value, response => {
                ServiceTips({text:response.message,type:'success'})
                that.props.getDetailData();
            }, error => {
                ServiceTips({text:error.message,type:'error'})
            })
        }else if(data.title == "orginzation"){
            value = Object.assign({},value,{id:this.state.id,optlock:data.optlock,});
            apiForm(API_FOODING_DS,'/customer/updateParty',value, response => {
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
        this.setState({visible:false},() => this.onAddressListInitData());
    }

    //联系方式 保存并关闭
    onContactSaveAndClose(value,data){
        let that = this;
        //cntryId:data.cntryId  国家ID 是否必要，要的话就要到customer
        value = Object.assign({},{beId:this.state.id,dataTyId:30},value);
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
       value = Object.assign({},{beId:this.state.id,dataTyId:30},value);
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
        value = Object.assign({},{sourceId:this.state.id,dataTyId:30},value);
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
        value = Object.assign({},{sourceId:this.state.id,dataTyId:30},value);
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
        value = Object.assign({},{sourceId:this.state.id,dataTyId:30},value);
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
    //结算币种 保存并关闭
    onCstmSalListSaveAndClose(value,data){
        let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:30},value);
         if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/cstmSal/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onCstmSalListInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //结算币种 保存并新增
    onCstmSalListSaveAdd(value,data){
        let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:30},value);
        apiPost(API_FOODING_DS,'/cstmSal/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onCstmSalListInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
    //船公司要求 保存并关闭
    onTradruleTransbeSaveAndClose(value,data){
        let that = this;
        value = Object.assign({},{beId:this.state.id,dataTyId:30},value);
         if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/tradruleTransbe/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onTradruleTransbeInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //船公司要求 保存并新增
    onTradruleTransbeSaveAdd(value,data){
        let that = this;
        value = Object.assign({},{beId:this.state.id,dataTyId:30},value);
        apiPost(API_FOODING_DS,'/tradruleTransbe/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onTradruleTransbeInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
    //单据要求 保存并关闭
    onTradruleBillrequSaveAndClose(value,data){
        let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:30},value);
         if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/tradruleBillrequ/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onTradruleBillrequInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //单据要求 保存并新增
    onTradruleBillrequSaveAdd(value,data){
        let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:30},value);
        apiPost(API_FOODING_DS,'/tradruleBillrequ/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onTradruleBillrequInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
    //港口要求 保存并关闭
    onTradruleStatnSaveAndClose(value,data){
        let that = this;
        value = Object.assign({},{beId:this.state.id,dataTyId:30},value);
         if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/tradruleStatn/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onTradruleStatnInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //港口要求 保存并新增
    onTradruleStatnSaveAdd(value,data){
        let that = this;
        value = Object.assign({},{beId:this.state.id,dataTyId:30},value);
        apiPost(API_FOODING_DS,'/tradruleStatn/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onTradruleStatnInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
     //运输要求
       TransportRequireSaveAndClose(value,data){
        let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:30},value);
         if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/tradrulePropty/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.TransportRequireInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    TransportRequireSaveAdd (value,data){
         let that = this;
       value=Object.assign({},value,{sourceId:this.state.id,dataTyId:30},value)
       apiPost(API_FOODING_DS,'/tradrulePropty/save',value,(response)=>{
            this.setState({visible:false});
            ServiceTips({text:response.message,type:'success'});
            that.TransportRequireInitData();                
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
   
    //客户别名 保存并关闭
    // onBizExtNameSaveAndClose(value,data){
    //     let that = this;
    //     value = Object.assign({},{sourceId:this.state.id,dataTyId:30},value);
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
    //客户别名 保存并新增
    // onBizExtNameSaveAdd(value,data){
    //     let that = this;
    //     value = Object.assign({},{sourceId:this.state.id,dataTyId:30},value);
    //     apiPost(API_FOODING_DS,'/bizExtName/save',value,(response) => {
    //         ServiceTips({text:response.message,type:'success'});
    //         that.onBizExtNameInitData();          
    //     },(error)=>{
    //         ServiceTips({text:error.message,type:'error'});
    //     })
    // }

    //地址用途 保存并关闭
    // onAddressUserSaveAndClose(){
    //     this.setState({visible:false},() => this.onAddressListInitData());
    // }
    //地址用途 拉取数据
    // onAddressUserInitData(){
    //     let that = this;
    //     apiGet(API_FOODING_DS,'/address/funct/getList',{beId:this.state.id,dataTyId:30}, response => {
    //         that.setState({
    //             functnList:response.data
    //         })
    //     }, error => console.log(error.message))
    // }

	
    //地址列表的数据拉取
    onAddressListInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/address/address/getList',{beId:this.state.id,dataTyId:30}, response => {
            that.setState({
                addressList:response.data
            })
        }, error => console.log(error.message))
    }
    //联系方式 数据拉取
    onContactInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/contact/getList',{sourceId:this.state.id,dataTyId:30}, response => {
            that.setState({
                contactList:response.data
            })
        }, error => console.log(error.message))
    }
    //银行账号 数据拉取
    onBankListInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/bankacct/getList',{sourceId:this.state.id,dataTyId:30}, response => {
            that.setState({
                bankacctList:response.data
            })
        }, error => console.log(error.message))
    }
    //支付条款 数据拉取
    onTradrultPaytermInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/tradrulePayterm/getList', {sourceId:this.state.id,dataTyId:30}, response => {
            that.setState({
                tradrulePaytermList:response.data
            })
        }, error => console.log(error.message))
    }
    //结算币种 数据拉取
    onCstmSalListInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/cstmSal/getList',{sourceId:this.state.id,dataTyId:30,dataTyId:30}, response => {
            that.setState({
                cstmSalList:response.data
            })
        }, error => console.log(error.message))
    }
    //船公司要求 拉取数据
    onTradruleTransbeInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/tradruleTransbe/getList',{sourceId:this.state.id,dataTyId:30}, response => {
            that.setState({
                tradruleTransbeList:response.data
            })
        }, error => console.log(error.message))
    }
    //单据要求 拉取数据
    onTradruleBillrequInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/tradruleBillrequ/getList',{sourceId:this.state.id,dataTyId:30}, response => {
            that.setState({
                tradruleBillrequList:response.data
            })
        }, error => console.log(error.message))
    }
    //港口要求
    onTradruleStatnInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/tradruleStatn/getList',{sourceId:this.state.id,dataTyId:30}, response => {
            that.setState({
                tradruleStatnList:response.data
            })
        }, error => console.log(error.message))
    }
    //运输要求
     TransportRequireInitData(){
         let that = this;
        apiGet(API_FOODING_DS,"/tradrulePropty/getList",{sourceId:this.state.id,dataTyId:30},response => {
            that.setState({TransportRequireList:response.data})
        },errors => ServiceTips({text:errors.message,type:"error"}))
    }
    //客户别名 拉取数据
    // onBizExtNameInitData(){
    //    let that = this;
    //     apiGet(API_FOODING_DS,'/bizExtName/getList',{sourceId:this.state.id,dataTyId:30}, response => {
    //         that.setState({
    //             bizExtNameList:response.data
    //         })
    //     }, error => console.log(error.message)) 
    // }
    //变更记录
    onUpdateClick = (data,e) => {
        let content = require('../../../List/components/UpdateDialog').default;
        let element = React.createElement(content, {onCancel: this.onCancel,sourceId:data});
        this.setState({
            visible: true,
            dialogTitle: I18n.t(100428/*变更记录*/),
            dilogTelmp: element
        })
        e.stopPropagation();
    }
    componentDidMount(){
        // this.onAddressListInitData();
        // this.onContactInitData();
        // this.onBankListInitData();
        // this.onTradrultPaytermInitData();
        // this.onCstmSalListInitData();
        // this.onTradruleTransbeInitData();
        // this.onTradruleBillrequInitData();
        // this.onTradruleStatnInitData();
        // this.TransportRequireInitData();
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
    }
    getPage(){
        this.onAddressListInitData();
        this.onContactInitData();
        this.onBankListInitData();
        this.onTradrultPaytermInitData();
        this.onCstmSalListInitData();
        this.onTradruleTransbeInitData();
        this.onTradruleBillrequInitData();
        this.onTradruleStatnInitData();
        this.TransportRequireInitData();
    }
    handleResize(height){
        let padding =  225;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
        if(this.props.id !== nextProps.id){
            this.setState({sourceId:nextProps.id},() => {
                this.onAddressListInitData();
                this.onContactInitData();
                this.onBankListInitData();
                this.onTradrultPaytermInitData();
                this.onCstmSalListInitData();
                this.onTradruleTransbeInitData();
                this.onTradruleBillrequInitData();
                this.onTradruleStatnInitData();
                this.TransportRequireInitData();
            })
        }
    }
	render(){
        const commonForm = this.state.dilogTelmp;
        const {addressList,bankacctList,contactList,cstmSalList,tradruleBillrequList,tradrulePaytermList,tradruleStatnList,tradruleTransbeList,TransportRequireList} = this.state || this.props;
        let customer = this.props.customer || {};
        let regCapitalCurrenObj = this.props.regCapitalCurren;
		return  (
            <div> 
               <div className='scroll' style={{backgroundColor:'#f0f4f8',
               height:this.state.scrollHeight,overflow:'auto'}}>             
               <div className = 'col'>
                    <Template1 
                        menuList={[
                            {permissions:'clien.edit',type:I18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{I18n.t(100439/*编辑*/)}</div>}
                        ]}                        
                        Zindex={"12"} onCancel ={this.onCancel} isShowMenu={true} openDialog={this.handleClick} 
                        onSaveAndClose={this.onSaveAndClose}
                        AjaxInit={true}
                        API_FOODING={API_FOODING_DS}
                        portname={'/customer/routine/getInit'}
                        params={{id:this.state.id}}
                        upload={this.props.getDetailData}
                        id={'client-detail-normal'} 
                        title={I18n.t(100138/*常规*/)} 
                        tempArray={[
                            {key:I18n.t(100360/*客户类型*/),value:customer.type},
                            {key:I18n.t(100359/*客户等级*/),value:customer.level},
                            {key:I18n.t(100376/*交易条款*/),value:customer.incotm},
                            {key:I18n.t(100358/*税号*/),value:customer.taxIdenSN}
                            ]}
                    />
                   <MeasureCommon 
                        menuList={[
                            {type:'add',permissions:'clien.dtl.add'},
                            {type:'delete',permissions:'clien.dtl.del'},
                            {type:'edit',permissions:'clien.edit'}                                        
                        ]}                   
                        onCancel ={this.onCancel} title ={I18n.t(100481/*地址*/)} 
                        Zindex ={11}
                        openDialog={this.handleClick}
                        onSaveAndClose={this.onAddressListSaveAndClose}
                         DialogTempalte ={require('./AddressPurposeDialog').default}
                         showHeader ={false}
                         checkedRowsArray={[]}
                         id={'client-detail-addressList'}
                         AjaxInit={true}
                         API_FOODING={API_FOODING_DS}
                         portname={'/address/getInit'}
                         params={{beId:this.state.id,dataTyId:30}}
                         otherData={{beId:this.state.id,dataTyId:30}}
                         columns ={
                            [{
                                title : I18n.t(100087/*国家*/),
                                dataIndex : 'country',
                                key : "country",
                                width : '14%',
                                render(data,row,index){
                                    if(data&&data.localName){
                                        return (<div title={data.localName}>{data.localName}</div>)
                                    }
                                    return ;
                                }
                            },
                            {
                                title : I18n.t(100535/*省/州*/),
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
                                title : I18n.t(100248/*市*/),
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
                                title : I18n.t(100249/*区县*/),
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
                                title : I18n.t(100250/*详细地址*/),
                                dataIndex : 'name',
                                key : "name",
                                width : '24%',
                                render(data,row,index){
                                    return (<div title={data}>{data}</div>)
                                }
                            },
                            {
                                title : I18n.t(100251/*邮编*/),
                                dataIndex : "zip",
                                key : "zip",
                                width : "10%",
                                render(data,row,index){
                                    return data;
                                }
                            },{
                                title : I18n.t(100547/*地址类型*/),
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
                                title : I18n.t(100123/*默认*/),
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
                            {type:'add',permissions:'clien.dtl.add'},
                            {type:'delete',permissions:'clien.dtl.del'},
                            {type:'edit',permissions:'clien.edit'}                                        
                        ]}                        
                        onCancel ={this.onCancel} title ={I18n.t(100500/*银行账号*/)}
                        Zindex ={10} 
                        openDialog={this.handleClick}
                                 DialogTempalte ={require('./BankTemplateDialog').default}
                                 showHeader ={true}
                                 checkedRowsArray={[]}
                                 id={'client-detail-bank'}
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
                            {permissions:'clien.edit',type:I18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{I18n.t(100439/*编辑*/)}</div>}
                        ]}
                        onCancel ={this.onCancel} Zindex={9} isShowMenu={true} 
                        openDialog={this.handleClick} 
                        onSaveAndClose={this.onSaveAndClose}
                        AjaxInit={true}
                        API_FOODING={API_FOODING_DS}
                        portname={'/customer/regInfo/getInit'}
                        params={{id:this.state.id}}
                        id={'3'} 
                        title={I18n.t(100139/*注册信息*/)} 
                        tempArray={[
                            {key:I18n.t(100358/*税号*/),value:customer.taxIdenSN},
                            {key:I18n.t(100561/*法人代表*/),value:customer.leglpsn },
                            {key:I18n.t(100563/*成立日期*/),value:new Date(customer.estabDate).Format('yyyy-MM-dd')},
                            {key:I18n.t(100564/*注册资本*/),value:<b>{customer.regCapital} {customer.regCapital&&regCapitalCurrenObj && regCapitalCurrenObj.localName ||"" }</b>}]}
                    />
                    <Template1 
                        menuList={[
                            {permissions:'clien.edit',type:I18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{I18n.t(100439/*编辑*/)}</div>}
                        ]}                        
                        onCancel ={this.onCancel} Zindex={8} isShowMenu={true} 
                        openDialog={this.handleClick} id={'client'} 
                        allData={{key:'customer'}}
                        AjaxInit={true}
                        API_FOODING={API_FOODING_DS}
                        portname={'/customer/getOne'}
                        params={{id:this.state.id}}
                        isShowIcon={true}
                        DialogTempalte ={require('./OrigizationDialog').default}
                        title={I18n.t(100140/*组织*/)} onSaveAndClose={this.onSaveAndClose}  tempArray={[{
                            key:I18n.t(100243/*集团*/),
                            value:customer.cluster},{key:I18n.t(100486/*公司*/),
                            value:customer.company},{key:I18n.t(100361/*分管人*/),
                            value:customer.staff?(<b>{String(customer.staff)}<i className={'foddingicon fooding-approve'} title={I18n.t(100428/*变更记录*/)} onClick={this.onUpdateClick.bind(this,this.state.id)} style={{marginLeft:'5px'}}></i></b>):""}]}
                    />
                    <Template1 
                        menuList={[
                            {permissions:'clien.edit',type:I18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{I18n.t(100439/*编辑*/)}</div>}
                        ]}                    
                        onCancel ={this.onCancel}  title={I18n.t(100194/*系统信息*/)} id={'5'} 
                        isShowIcon={false}
                        tempArray={[{key:I18n.t(100143/*创建人*/),value:customer.createUserName},
                        {key:I18n.t(100144/*修改人*/),value:customer.updateUserName},
                        {key:I18n.t(100145/*创建时间*/),value:new Date(customer.createDate).Format('yyyy-MM-dd hh:mm:ss')},
                        {key:I18n.t(100146/*修改时间*/),value:new Date(customer.updateDate).Format('yyyy-MM-dd hh:mm:ss')}]}
                    />
               </div>
               <div className='col' style={{paddingLeft:0}}>
                   
                    <div className='col'  style={{paddingLeft:0,paddingTop:0}}>
                        <MeasureCommon 
                            menuList={[
                                {type:'add',permissions:'clien.dtl.add'},
                                {type:'delete',permissions:'clien.dtl.del'},
                                {type:'edit',permissions:'clien.edit'}                                        
                            ]}                    
                            onCancel ={this.onCancel} title ={I18n.t(100245/*联系方式*/)} 
                             Zindex={7}
                             openDialog={this.handleClick}
                             DialogTempalte ={require('./ContactDialog').default}
                             showHeader ={false}
                             checkedRowsArray={[]}
                             id={'client-detail-contact'}
                             onSaveAndClose={this.onContactSaveAndClose}
                             onSaveAdd={this.onContactSaveAdd}
                             AjaxInit={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/contact/getInit'}
                             params={{sourceId:this.state.id,dataTyId:30,cntryId:customer.cntryId}}
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
                                                    if(iconArray[i].num == (data&&data.id?data.id:data) ){
                                                        classN = iconArray[i].classn;
                                                        break;
                                                    }
                                                }
                                                return (<i style={{fontSize:'16px'}} className={classN}></i>)
                                            }
                                        },
                                        {
                                            title : I18n.t(100245/*联系方式*/),
                                            dataIndex : 'name',
                                            key : "name",
                                            width:'70%',
                                            render(data,row,index){
                                                if(data){
                                                    return (<div title={data}>{data}</div>)
                                                } 
                                                return ;                                           
                                            }
                                        },{
                                            title : I18n.t(100123/*默认*/),
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
                                {type:'add',permissions:'clien.dtl.add'},
                                {type:'delete',permissions:'clien.dtl.del'},
                                {type:'edit',permissions:'clien.edit'}                                        
                            ]}                        
                            onCancel ={this.onCancel} title ={I18n.t(100511/*结算币种*/)} 
                            Zindex ={6}
                            openDialog={this.handleClick}
                             DialogTempalte ={require('./AccountDialog').default}
                             showHeader ={false}
                             checkedRowsArray={[]}
                             id={'client-detail-cstmSalList'}
                             onSaveAdd={this.onCstmSalListSaveAdd}
                             onSaveAndClose={this.onCstmSalListSaveAndClose}
                             AjaxInit={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/cstmSal/getInit'}
                             params={{}}
                             columns ={
                                [{
                                    title : I18n.t(100511/*结算币种*/),
                                    dataIndex : 'curren',
                                    key : "curren",
                                    width:'90%',
                                    render(data,row,index){
                                        data = data !== null?data:"";
                                        if(typeof data == "object" && ('localName' in data)){
                                            return data.localName;
                                        }
                                        return data;
                                    }
                                },{
                                    title : I18n.t(100123/*默认*/),
                                    dataIndex : "dfutMrk",
                                    key : "dfutMrk",
                                    width : "10%",
                                    render(data,row,index){
                                        return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                    }
                                }
                               ]
                            }
                            data={cstmSalList}
                        />    
                        <MeasureCommon 
                            menuList={[
                                {type:'add',permissions:'clien.dtl.add'},
                                {type:'delete',permissions:'clien.dtl.del'},
                                {type:'edit',permissions:'clien.edit'}                                        
                            ]}                            
                            onCancel ={this.onCancel} title ={I18n.t(100512/*船公司要求*/)} 
                            Zindex ={5}
                            openDialog={this.handleClick}
                             DialogTempalte ={require('./ShippingCompanyDialog').default}
                             showHeader ={false}
                             checkedRowsArray={[]}
                             id={'client-detail-tradruleTransbe'}
                             onSaveAdd={this.onTradruleTransbeSaveAdd}
                             onSaveAndClose={this.onTradruleTransbeSaveAndClose}
                             AjaxInit={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/tradruleTransbe/getInit'}
                             params={{}}
                             columns ={
                                [{
                                    title : I18n.t(100513/*固定*/)/I18n.t(100514/*禁止*/),
                                    dataIndex : 'pickType',
                                    key:'pickType',
                                    width:'20%',
                                    render(data,row,index){
                                        data = data !== null?data:"";
                                        if(typeof data == "object" && ('name' in data)){
                                            return data.name;
                                        }
                                        return <div>{data}</div>
                                    }
                                },
                                {
                                    title : I18n.t(100515/*船公司名称*/),
                                    dataIndex : 'servBe',
                                    key:'servBe',
                                    width:'75%',
                                    render(data,row,index){
                                        data = data !== null?data:"";
                                        if(typeof data == "object" && ('localName' in data)){
                                            return data.localName;
                                        }
                                        return <div>{data}</div>
                                    }
                                }
                               ]
                            }
                            data={tradruleTransbeList}
                        /> 
                         <MeasureCommon 
                            menuList={[
                                {type:'add',permissions:'clien.dtl.add'},
                                {type:'delete',permissions:'clien.dtl.del'},
                                {type:'edit',permissions:'clien.edit'}                                        
                            ]}                            
                            onCancel ={this.onCancel} title ={i18n.t(200339/*运输要求*/)} 
                            Zindex ={4}
                            openDialog={this.handleClick}
                             DialogTempalte ={require('./TransportRequire').default}
                             showHeader ={false}
                             checkedRowsArray={[]}
                             id={'client-detail-yunshurequire'}
                             onSaveAdd={this.TransportRequireSaveAdd}
                             onSaveAndClose={this.TransportRequireSaveAndClose}
                             AjaxInit={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/tradrulePropty/getInit'}
                             params={{}}
                            columns ={
                                        [{
                                            title : i18n.t(100114/*要求类型*/),
                                            dataIndex : 'proptypeName',
                                            key : "proptypeName",
                                            width:'50%',
                                            render(data,row,index){
                                                return <div>{data}</div>
                                            }
                                        },{
                                            title : i18n.t(100148/*注释*/),
                                            dataIndex : 'infoTxt',
                                            key : "infoTxt",
                                            width:'50%',
                                            render(data,row,index){
                                                return <div>{data}</div>
                                            }
                                        }
                                       ]
                                    }
                            data={TransportRequireList}
                        />   
                    </div>
                    <div className='col' style={{paddingLeft:0,paddingTop:0,paddingRight: 0}}>
                        <MeasureCommon 
                            menuList={[
                                {type:'add',permissions:'clien.dtl.add'},
                                {type:'delete',permissions:'clien.dtl.del'},
                                {type:'edit',permissions:'clien.edit'}                                        
                            ]}                            
                            onCancel ={this.onCancel} title ={I18n.t(100133/*支付条款*/)} 
                            Zindex={3}
                            openDialog={this.handleClick}
                             DialogTempalte ={require('../../../../servBe/Detail/Content/components/TradrulePaytermListDialog').default}
                             showHeader ={false}
                             checkedRowsArray={[]}
                             id={'client-detail-tradrulepayterm'}
                             onSaveAdd={this.onTradrulePaytermListSaveAdd}
                             onSaveAndClose={this.onTradrulePaytermListSaveAndClose}
                             AjaxInit={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/tradrulePayterm/getInit'}
                             params={{dataTyId:30,sourceId:this.state.id}}
                             columns ={
                                [{
                                    title : I18n.t(100133/*支付条款*/),
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
                                    title : I18n.t(100123/*默认*/),
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
                                {type:'add',permissions:'clien.dtl.add'},
                                {type:'delete',permissions:'clien.dtl.del'},
                                {type:'edit',permissions:'clien.edit'}                                        
                            ]}                        
                            onCancel ={this.onCancel} title ={I18n.t(100128/*单据要求*/)} 
                            Zindex ={2}
                            openDialog={this.handleClick}
                             DialogTempalte ={require('./SingleCertificateDialog').default}
                             showHeader ={false}
                             checkedRowsArray={[]}
                             id={'client-detail-tradruleBillrequ'}
                             onSaveAdd={this.onTradruleBillrequSaveAdd}
                             onSaveAndClose={this.onTradruleBillrequSaveAndClose}
                             AjaxInit={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/tradruleBillrequ/getInit'}
                             params={{}}
                             columns ={
                                [{
                                    title : I18n.t(100128/*单据要求*/),
                                    dataIndex : 'billRequ',
                                    key : "billRequ",
                                    width:"45%",
                                    render(data,row,index){
                                        data = data !== null?data:"";
                                        if(typeof data == "object" && ('localName' in data)){
                                            return (<div className={'text-ellipsis'} title = {data.localName}>{data.localName}</div>);
                                        }
                                        return (<div className={'text-ellipsis'} title = {data}>{data}</div>);
                                    }
                                },{
                                    title : "itemTxt",
                                    dataIndex : 'itemTxt',
                                    key : "itemTxt",
                                    width:"50%",
                                    render(data,row,index){
                                        return (<div className={'text-ellipsis'} title = {data}>{data}</div>);
                                    }
                                }
                               ]
                            }
                            data={tradruleBillrequList}
                        /> 
                        <MeasureCommon 
                            menuList={[
                                {type:'add',permissions:'clien.dtl.add'},
                                {type:'delete',permissions:'clien.dtl.del'},
                                {type:'edit',permissions:'clien.edit'}                                        
                            ]}                            
                            onCancel ={this.onCancel} title ={I18n.t(100520/*港口要求*/)} 
                            Zindex={1}
                            openDialog={this.handleClick}
                             DialogTempalte ={require('./HarborDialog').default}
                             showHeader ={false}
                             checkedRowsArray={[]}
                             id={'client-detail-tradruleStatn'}
                             onSaveAdd={this.onTradruleStatnSaveAdd}
                             onSaveAndClose={this.onTradruleStatnSaveAndClose}
                             AjaxInit={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/tradruleStatn/getInit'}
                             params={{sourceId:this.state.id}}
                             columns ={
                                [{
                                    title : "pickType",
                                    dataIndex : 'pickType',
                                    width:'15%',
                                    key : "pickType",
                                    render(data,row,index){
                                        data = data !== null?data:"";
                                        if(typeof data == "object" && ('name' in data)){
                                            return data.name;
                                        }
                                        return data;
                                    }
                                },
                                {
                                    title : "country",
                                    dataIndex : 'country',
                                    width:'20%',
                                    key : "country",
                                    render(data,row,index){
                                        data = data !== null?data:"";
                                        if(typeof data == "object" && ('localName' in data)){
                                            return <div className="text-ellipsis" title={data.localName}>{data.localName}</div>;
                                        }
                                        return <div className="text-ellipsis" title={data}>{data}</div>;
                                    }
                                },{
                                    title : "statnType",
                                    dataIndex : 'statnType',
                                    width:'30%',
                                    key : "statnType",
                                    render(data,row,index){
                                        data = data !== null?data:"";
                                        if(typeof data == "object" && ('name' in data)){
                                            return <div className="text-ellipsis" title={data.name}>{data.name}</div>;
                                        }
                                        return <div className="text-ellipsis" title={data}>{data}</div>;
                                    }
                                },
                                {
                                    title : "statn",
                                    dataIndex : 'statn',
                                    width:'30%',
                                    key : "statn",
                                    render(data,row,index){
                                        data = data !== null?data:"";
                                        if(typeof data == "object" && ('localName' in data)){
                                            return <div className="text-ellipsis" title={data.localName}>{data.localName}</div>;
                                        }
                                        return <div className="text-ellipsis" title={data}>{data}</div>;
                                    }
                                }
                               ]
                            }
                            data={tradruleStatnList}
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
export default CDetailsContent;
