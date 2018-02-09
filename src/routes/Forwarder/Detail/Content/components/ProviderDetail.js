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
        //结算币种 保存并新增
        this.onCstmSalListSaveAdd=this.onCstmSalListSaveAdd.bind(this);
        //结算币种 保存并关闭
        this.onCstmSalListSaveAndClose=this.onCstmSalListSaveAndClose.bind(this);
        //货代别名 保存并关闭
        //this.onBizExtNameSaveAndClose=this.onBizExtNameSaveAndClose.bind(this);
        //货代别名 保存并新增
        //this.onBizExtNameSaveAdd=this.onBizExtNameSaveAdd.bind(this);
        //地址用途
        //this.onAddressUserSaveAndClose=this.onAddressUserSaveAndClose.bind(this);

        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.onAddressListInitData();
        this.onContactInitData();
        this.onBankListInitData();
        this.onTradrultPaytermInitData();
    }
    initState(){
        return {
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>,
            id:this.props.location.query.id,
            addressList: [], //地址列表
            bankacctList: [], //银行账号
            bizExtNameList: [], //货代别名
            contactList: [], //联系方式列表
            cstmCrsetkt: [], //结算币种
            functnList: [], //功能地址列表
            tradrulePaytermList: [] //支付条款
        }
    }
    handleClick = (e, data, Template) => {
        let that = this;
        if(data.number== 2){
            let id = [],tempString = i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
            id = (data && data.record)? [data.record.id]:data.selectArr.map((o) => o.id);
            if(!(data && data.record || data.selectArr.length == 1)){
                tempString = i18n.t(100395/*已选中*/) + data.selectArr.length + i18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
            }
             Confirm(tempString, {
                  done: () => {
                    if(data.id == "forwarder-detail-addressList"){//地址列表
                        //id = "forwarder-detail-addressList"  表示是地址列表 此处id和传过去的id一样
                         apiForm(API_FOODING_DS,'/address/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.onAddressListInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "forwarder-detail-contact"){//联系方式
                        //id = "forwarder-detail-contact" 表示是联系方式
                        apiForm(API_FOODING_DS,'/contact/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onContactInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "forwarder-detail-bank"){//银行账号
                        apiForm(API_FOODING_DS,'/bankacct/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onBankListInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "forwarder-detail-tradrulepayterm"){//支付条款
                        // id = "forwarder-detail-tradrulepayterm" 为支付条款
                        apiForm(API_FOODING_DS,'/tradrulePayterm/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onTradrultPaytermInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "forwarder-detail-cstmSalList"){//结算币种
                        //id == "forwarder-detail-cstmSalList" 表示结算币种
                        apiForm(API_FOODING_DS,'/cstmSal/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onCstmSalListInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "forwarder-detail-tradruleTransbe"){//船公司要求
                        //id == "forwarder-detail-tradruleTransbe" 表示船公司要求
                        apiForm(API_FOODING_DS,'/tradruleTransbe/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onTradruleTransbeInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "forwarder-detail-tradruleBillrequ"){//单据要求
                        //id == "forwarder-detail-tradruleBillrequ" 表示单据要求
                        apiForm(API_FOODING_DS,'/tradruleBillrequ/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onTradruleBillrequInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "forwarder-detail-tradruleStatn"){//港口要求
                        //id = "forwarder-detail-tradruleStatn" 表示港口要求
                        apiForm(API_FOODING_DS,'/tradruleStatn/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onTradruleStatnInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "forwarder-detail-bizExtNameList"){//货代别名
                        //id = "forwarder-detail-bizExtNameList" 表示货代别名
                        apiForm(API_FOODING_DS,'/bizExtName/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            //that.onBizExtNameInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "forwarder-detail-addressUser"){//地址用途
                        //id = "provider-detail-addressUser" 表示可地址用途
                        apiForm(API_FOODING_DS,'/address/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                           // that.onAddressUserInitData();
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
                    visible:true,
                    dialogTitle:dialogTitle,
                    dilogTelmp:Template
            }); 
        }    
    }
    //保存常规，组织，注册信息  客户组织的编辑
    onSaveAndClose(value,data){
        let that = this;
        if(data.title == "forwarder-detail-normal"){//表示编辑货代常规
            value = Object.assign({},data,value);
            apiForm(API_FOODING_DS,'/agnShipBe/updateRoutine',value, response => {
                ServiceTips({text:response.message,type:'success'})
                that.props.getDetailData();
            }, error => {
                ServiceTips({text:error.message,type:'error'})
            })
        }else if(data.title == "forwarder-detail-sign"){//表示编辑货代注册信息
            value = Object.assign({},data,value);
            apiPost(API_FOODING_DS,'/agnShipBe/regInfo/updateRegInfo',value, response => {
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
       /* let that = this;
        value = Object.assign({},{beId:this.state.id,dfutMrk:false,dataTyId:80},value);
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
        let valueone = Object.assign({},{beId:this.state.id,dataTyId:80},value);
        if(JSON.stringify(data) !== "{}"){//表明是编辑
            valueone = Object.assign({},valueone,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/contact/save',valueone,(response) => {
            ServiceTips({text:response.message,type:'success'});  
            that.onContactInitData()  
            that.props.getDetailData()   
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
     //联系方式，保存并新增
    onContactSaveAdd = (value,data) => {
       let that = this;
       value = Object.assign({},{beId:this.state.id,dataTyId:80},value);
        apiPost(API_FOODING_DS,'/contact/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});  
            that.onContactInitData()
            that.props.getDetailData()    
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }

    //银行账号 保存并关闭
    onBankListSaveAndClose(value,data){
        let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:80},value);
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
        value = Object.assign({},{sourceId:this.state.id,dataTyId:80},value);
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
        value = Object.assign({},{sourceId:this.state.id,dataTyId:80},value);
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
        value = Object.assign({},{sourceId:this.state.id,dataTyId:80},value);
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
        value = Object.assign({},{sourceId:this.state.id,dataTyId:80},value);
        apiPost(API_FOODING_DS,'/cstmSal/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onCstmSalListInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
     //货代别名 保存并关闭
    // onBizExtNameSaveAndClose(value,data){
    //     let that = this;
    //     value = Object.assign({},{sourceId:this.state.id,dataTyId:80},value);
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
    //货代别名 保存并新增
    // onBizExtNameSaveAdd(value,data){
    //     let that = this;
    //     value = Object.assign({},{sourceId:this.state.id,dataTyId:80},value);
    //     apiPost(API_FOODING_DS,'/bizExtName/save',value,(response) => {
    //         ServiceTips({text:response.message,type:'success'});
    //         that.onBizExtNameInitData();          
    //     },(error)=>{
    //         ServiceTips({text:error.message,type:'error'});
    //     })
    // }

    //地址用途 保存并关闭
    // onAddressUserSaveAndClose(){
    //     this.setState({visible:false});
    //     this.onAddressUserInitData();//更新数据
    // }
     //地址用途 拉取数据
    // onAddressUserInitData(){
    //     let that = this;
    //     apiGet(API_FOODING_DS,'/address/funct/getList',{beId:this.state.id,dataTyId:80}, response => {
    //         that.setState({
    //             functnList:response.data
    //         })
    //     }, error => ServiceTips({text:error.message,type:'error'}))
    // }

    
    //地址列表的数据拉取
    onAddressListInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/address/address/getList',{beId:this.state.id,dataTyId:80}, response => {
            that.setState({
                addressList:response.data
            })
        }, error => ServiceTips({text:error.message,type:'error'}))
    }
    //联系方式 数据拉取
    onContactInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/contact/getList',{sourceId:this.state.id,dataTyId:80}, response => {
            that.setState({
                contactList:response.data
            })
        }, error => ServiceTips({text:error.message,type:'error'}))
    }
    //银行账号 数据拉取
    onBankListInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/bankacct/getList',{sourceId:this.state.id,dataTyId:80}, response => {
            that.setState({
                bankacctList:response.data
            })
        }, error => ServiceTips({text:error.message,type:'error'}))
    }
    //支付条款 数据拉取
    onTradrultPaytermInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/tradrulePayterm/getList', {sourceId:this.state.id,dataTyId:80}, response => {
            that.setState({
                tradrulePaytermList:response.data
            })
        }, error => ServiceTips({text:error.message,type:'error'}))
    }
    //结算币种 数据拉取
    onCstmSalListInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/cstmSal/getList',{sourceId:this.state.id,dataTyId:80}, response => {
            that.setState({
                cstmSalList:response.data
            })
        }, error => ServiceTips({text:error.message,type:'error'}))
    }
    //货代别名 拉取数据
    onBizExtNameInitData(){
       let that = this;
        apiGet(API_FOODING_DS,'/bizExtName/getList',{sourceId:this.state.id,dataTyId:80}, response => {
            that.setState({
                bizExtNameList:response.data
            })
        }, error => ServiceTips({text:error.message,type:'error'})) 
    }
    componentDidMount(){
        //this.onAddressUserInitData();
        //this.onCstmSalListInitData();
        //this.onBizExtNameInitData();
        if(!this.props.isDetail){
            this.getPage();
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
        window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));    
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
        const {addressList,bankacctList,contactList,tradrulePaytermList} = this.state;
        const agnShipBeVo = this.props.agnShipBeVo; 
        let regCapitalCurrenObj = this.props.regCapitalCurren;
        var that = this;
		return (
			  <div> 
	               <div className='scroll' style={{backgroundColor:'#f0f4f8',
	               height:this.state.scrollHeight,overflow:'auto'}}>             
		               <div className = 'col'>
		               	  <Template1 
                            menuList={[
                                {permissions:'forwarder.edit',type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
                            ]} 
                            upload={this.props.getDetailData}                            
                            Zindex={9} onCancel ={this.onCancel} 
		               		width={107}
                            DialogTempalte={require('./NormalDialog').default}
		               		isShowMenu={true} 
		               		openDialog={this.handleClick}
		               		onSaveAndClose={this.onSaveAndClose}
                            AjaxInit={true}
                            API_FOODING={API_FOODING_DS}
                            portname={'/agnShipBe/routine/getInit'}
                            params={{id:this.state.id}}
		                    id={'forwarder-detail-normal'} title={i18n.t(100138/*常规*/)} tempArray={[
		                    	{key:i18n.t(100226/*英文名称*/),value:agnShipBeVo.enName},
		                    	{key:i18n.t(100002/*描述*/),value:agnShipBeVo.description}]}
                            />
		                  <MeasureCommon 
                            menuList={[
                                {type:'add',permissions:'forwarder.dtl.add'},
                                {type:'delete',permissions:'forwarder.dtl.del'},
                                {type:'edit',permissions:'forwarder.edit'}                                        
                            ]}                            
                            onCancel ={this.onCancel} title ={i18n.t(100246/*地址列表*/)} 
                        Zindex ={8}
                        openDialog={this.handleClick}
                        onSaveAndClose={this.onAddressListSaveAndClose}
                         DialogTempalte ={require('../../../../Client/Detail/Content/components/AddressPurposeDialog').default}
                         showHeader ={false}
                         checkedRowsArray={[]}
                         id={'forwarder-detail-addressList'}
                         AjaxInit={true}
                         API_FOODING={API_FOODING_DS}
                         portname={'/address/getInit'}
                         params={{beId:this.state.id,dataTyId:80}}
                         otherData={{beId:this.state.id,dataTyId:80}}
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
                                    {type:'add',permissions:'forwarder.dtl.add'},
                                    {type:'delete',permissions:'forwarder.dtl.del'},
                                    {type:'edit',permissions:'forwarder.edit'}                                        
                                ]}                                
                                onCancel ={this.onCancel} title ={i18n.t(100500/*银行账号*/)}
                                Zindex ={6} 
                                openDialog={this.handleClick}
                                         DialogTempalte ={require('../../../../Client/Detail/Content/components/BankTemplateDialog').default}
                                         showHeader ={true}
                                         checkedRowsArray={[]}
                                         id={'forwarder-detail-bank'}
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
                                {permissions:'forwarder.edit',type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
                            ]}                            
                            Zindex={5} onCancel ={this.onCancel} 
		               		width={107}
                            DialogTempalte={require('./NormalDialog').default}
		               		isShowMenu={true} 
		               		openDialog={this.handleClick}
                            onSaveAndClose={this.onSaveAndClose}
                            AjaxInit={true}
                            API_FOODING={API_FOODING_DS}
                            portname={'/agnShipBe/regInfo/getInit'}
                            params={{id:this.state.id}}
		                    id={'forwarder-detail-sign'} title={i18n.t(100139/*注册信息*/)} tempArray={[
		                    	{key:i18n.t(100358/*税号*/),value:agnShipBeVo.taxIdenSN},
		                    	{key:i18n.t(100561/*法人代表*/),value:agnShipBeVo.leglpsn},
		                    	{key:i18n.t(100563/*成立日期*/),value:new Date(agnShipBeVo.estabDate).Format('yyyy-MM-dd')},
		                    	{key:i18n.t(100564/*注册资本*/),value:<b>{agnShipBeVo.regCapital} {agnShipBeVo.regCapital&&regCapitalCurrenObj && regCapitalCurrenObj.localName ||"" }</b>}

		                    ]}/>
		                    <Template1 title={i18n.t(100194/*系统信息*/)} Zindex={4} isShowIcon={false} id ={'31'}  
		                    tempArray={[{key:i18n.t(100143/*创建人*/),value:agnShipBeVo.createUserName},{key:i18n.t(100144/*修改人*/),value:agnShipBeVo.updateUserName},
		                    {key:i18n.t(100145/*创建时间*/),value:new Date(agnShipBeVo.createDate).Format('yyyy-MM-dd hh:mm:ss')},{key:i18n.t(100146/*修改时间*/),value:new Date(agnShipBeVo.updateDate).Format('yyyy-MM-dd hh:mm:ss')}]}
                            />
		               </div>
		               <div className = 'col' style={{paddingLeft:0}}>
		                  <div className='col'  style={{paddingLeft:0,paddingTop:0}}>
                           <MeasureCommon 
                                menuList={[
                                    {type:'add',permissions:'forwarder.dtl.add'},
                                    {type:'delete',permissions:'forwarder.dtl.del'},
                                    {type:'edit',permissions:'forwarder.edit'}                                        
                                ]}                            
                                onCancel ={this.onCancel} title ={i18n.t(100245/*联系方式*/)} 
                                Zindex={3}
                                openDialog={this.handleClick}
                                DialogTempalte ={require('../../../../Client/Detail/Content/components/ContactDialog').default}
                                showHeader ={false}
                                checkedRowsArray={[]}
                                id={'forwarder-detail-contact'}
                                onSaveAndClose={this.onContactSaveAndClose}
                                onSaveAdd={this.onContactSaveAdd}
                                AjaxInit={true}
                                API_FOODING={API_FOODING_DS}
                                portname={'/contact/getInit'}
                                params={{sourceId:this.state.id,dataTyId:80}}
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
                                                width:'75%',
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
                          </div>
                          <div className='col' style={{paddingLeft:0,paddingTop:0,paddingRight: 0}}>
                             <MeasureCommon 
                                menuList={[
                                    {type:'add',permissions:'forwarder.dtl.add'},
                                    {type:'delete',permissions:'forwarder.dtl.del'},
                                    {type:'edit',permissions:'forwarder.edit'}                                        
                                ]}                                
                                onCancel ={this.onCancel} title ={i18n.t(200563/*结算条款*/)} 
                                    Zindex={1}
                                    openDialog={this.handleClick}
                                     DialogTempalte ={require('./ForwarderPaymentDialog').default}
                                     showHeader ={false}
                                     checkedRowsArray={[]}
                                     id={'forwarder-detail-tradrulepayterm'}
                                     onSaveAdd={this.onTradrulePaytermListSaveAdd}
                                     onSaveAndClose={this.onTradrulePaytermListSaveAndClose}
                                     AjaxInit={true}
                                     API_FOODING={API_FOODING_DS}
                                     portname={'/tradrulePayterm/getInit'}
                                     params={{dataTyId:80,sourceId:this.state.id}}
                                     columns ={
                                        [{
                                            title : i18n.t(100133/*支付条款*/),
                                            dataIndex : 'payTrm',
                                            key : "payTrm",
                                            width:'80%',
                                            render(data,row,index){
                                                data = data !== null?data:"";
                                                if(typeof data == "object" && ('localName' in data)){
                                                    return <div className={'text-ellipsis'} title={data.localName}>{data.localName}</div>
                                                }
                                                return <div className={'text-ellipsis'} title={data}>{data}</div>
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

