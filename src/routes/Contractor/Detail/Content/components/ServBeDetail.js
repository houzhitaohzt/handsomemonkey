import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
//引入国际化 
import {I18n} from '../../../../../lib/i18n';  
export class ServBeDetail extends Component{
	constructor(props) {
        super(props);
        props.detail && props.detail(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.onAddressListSaveAndClose=this.onAddressListSaveAndClose.bind(this);
        this.onContactSaveAndClose=this.onContactSaveAndClose.bind(this);
        this.onBankListSaveAndClose=this.onBankListSaveAndClose.bind(this);

        this.getPage=this.getPage.bind(this);

        this.state=this.initState();
    }
    getPage(){
        this.onAddressListInitData();
        this.onBankListInitData();
        this.onContactInitData();
        
    }
     initState(){
        return {
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>,
            id:this.props.location.query.id, //列表頁传过来的id
            addressList: [],
            bankacctList:[],
            contactList:[],
            functnList: [],
            partnerList:[],
            tradrulePaytermList:[]
        }
    }
    handleClick = (e, data, Template) => {
        if(data.number ==2){
            let id = [],tempString = I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
            id = (data && data.record)? [data.record.id]:data.selectArr.map((o) => o.id);
            if(!(data && data.record || data.selectArr.length == 1)){
                tempString = I18n.t(100395/*已选中*/) + data.selectArr.length + I18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
            }
            if(data.id == "servbe-detail-addressList"){//地址列表
                Confirm(tempString, {
                    done: () => {
                        apiForm(API_FOODING_DS,'/address/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            this.onAddressListInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    },
                    close: () => {
                        console.log('no ')
                    }
                });
            }else if(data.id == "servbe-detail-contact"){//联系方式
                Confirm(tempString, {
                    done: () => {
                        apiForm(API_FOODING_DS,'/contact/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            this.props.getDetailData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    },
                    close: () => {
                        console.log('no ')
                    }
                });
            }else if(data.id == "servbe-detail-bank"){//银行账号
                Confirm(tempString, {
                    done: () => {
                        apiForm(API_FOODING_DS,'/bankacct/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            this.onBankListInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    },
                    close: () => {
                        console.log('no ')
                    }
                });
            }else if(data.id == "servBe-detail-addressUser"){//地址用途
                Confirm(tempString, {
                    done: () => {
                        apiForm(API_FOODING_DS,'/address/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            this.props.getDetailData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    },
                    close: () => {
                        console.log('no ')
                    }
                });
            }
        }else if(data.number == 3){
            //没有看到失效，所以让失效先不走，留给后续再做
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
    onSaveAndClose(value,data){
        if(data.title == "carrier-detail-normal"){//承运人常规
             value = Object.assign({},data,value);
            apiForm(API_FOODING_DS,'/carrier/updateRoutine',value,(response) => {
                ServiceTips({text:response.message,type:'success'});
                this.props.getDetailData();
            },(error) => {
                ServiceTips({text:error.message,type:'error'});
            })
        }else if(data.title == "carrier-detail-signInformation"){//承运人注册信息
            value = Object.assign({},data,value);
            apiPost(API_FOODING_DS,'/carrier/updateRegInfo',value,(response) => {
                ServiceTips({text:response.message,type:'success'});
                this.props.getDetailData();
            },(error) => {
                ServiceTips({text:error.message,type:'error'});
            })
        }else if(data.title == "orginzation"){//承运人组织
            value = Object.assign({},value,{id:data.id});
            apiForm(API_FOODING_DS,'/carrier/updateParty',value,(response) => {
                ServiceTips({text:response.message,type:'success'});
                this.props.getDetailData();
            },(error) => {
                ServiceTips({text:error.message,type:'error'});
            })
        }
        this.setState({visible:false});
    }
    //地址列表的数据拉取
    onAddressListInitData =() => {
        let that = this;
        apiGet(API_FOODING_DS,'/address/address/getList',{beId:this.state.id,dataTyId:85}, response => {
            that.setState({
                addressList:response.data
            })
        }, error => ServiceTips({text:error.message,type:'error'}))
    }
    //地址列表保存并关闭
    onAddressListSaveAndClose(value,data){
        /*value = Object.assign({},{beId:this.state.id,dfutMrk:false,dataTyId:85},value);
        if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/address/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            this.props.getDetailData()
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});*/

        this.setState({visible:false},() => this.onAddressListInitData());
    }
    
    //银行账号 数据拉取
    onBankListInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/bankacct/getList',{sourceId:this.state.id,dataTyId:85}, response => {
            that.setState({
                bankacctList:response.data
            })
        }, error => console.log(error.message))
    }
    //银行账号保存并关闭
    onBankListSaveAndClose(value,data){
        let valueone = Object.assign({},{sourceId:this.state.id,dataTyId:85},value);
         if(JSON.stringify(data) !== "{}"){//表明是编辑
            valueone = Object.assign({},valueone,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/bankacct/save',valueone,(response) => {
            ServiceTips({text:response.message,type:'success'});
            this.onBankListInitData();
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
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
    //联系方式的保存并关闭
    onContactSaveAndClose(value,data){
        let valueone = Object.assign({},{beId:this.state.id,dataTyId:85},value);
        if(JSON.stringify(data) !== "{}"){//表明是编辑
            valueone = Object.assign({},valueone,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/contact/save',valueone,(response) => {
            ServiceTips({text:response.message,type:'success'});
            this.onContactInitData();
            this.props.getDetailData(); 
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //联系方式，保存并新增
    onContactSaveAdd = (value,data) => {
       let that = this;
       value = Object.assign({},{beId:this.state.id,dataTyId:85},value);
        apiPost(API_FOODING_DS,'/contact/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});  
            that.props.onContactInitData(); 
            that.props.getDetailData(); 
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }


	onCancel(){
        this.setState({visible:false});
	}

    componentDidMount(){
	    if(!this.props.isDetail){
	        this.getPage();
        }
        this.handleResize();
        window.addEventListener('resize', this.handleResize(0));
    }
    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = 225;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
        // if( (this.state.tradrulePaytermList !==null && !this.state.tradrulePaytermList.length) || this.state.tradrulePaytermList !== nextProps.tradrulePaytermList) {
        //     this.setState({
        //         tradrulePaytermList:nextProps.tradrulePaytermList
        //     })
        // }
        if(this.props.id !== nextProps.id){
            this.setState({sourceId:nextProps.id},() => {
                this.onAddressListInitData();
                this.onBankListInitData();
                this.onContactInitData();
                
            })
        }
    }
	render(){
		const commonForm = this.state.dilogTelmp;
        let {servBeVo ={} } = this.props;
        let regCapitalCurrenObj = this.props.regCapitalCurren;
		return (
			  <div>
	               <div className='scroll' style={{backgroundColor:'#f0f4f8',
	               height:this.state.scrollHeight,overflow:'auto'}}>
		               <div className = 'col'>
                            <Template1 
                                menuList={[
                                    {permissions:'contractor.edit',type:I18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{I18n.t(100439/*编辑*/)}</div>}
                                ]}  
                                upload={this.props.getDetailData}                      
                                onCancel ={this.onCancel} Zindex={11}
                                width={107}
                                DialogTempalte={require('./NormalDialog').default}
                                isShowMenu={true}
                                openDialog={this.handleClick}
                                onSaveAndClose={this.onSaveAndClose}
                                AjaxInit={true}
                                API_FOODING={API_FOODING_DS}
                                portname={'/carrier/routine/getInit'}
                                params={{id:this.state.id}}
                                id={'carrier-detail-normal'} title={I18n.t(100138/*常规*/)} tempArray={[
                                    {key:I18n.t(100226/*英文名称*/),value:servBeVo.enName?servBeVo.enName:''},
                                    {key:I18n.t(100002/*描述*/),value:servBeVo.description}
                                ]}
                            />
                            <MeasureCommon 
                                menuList={[
                                    {type:'add',permissions:'contractor.dtl.add'},
                                    {type:'delete',permissions:'contractor.dtl.del'},
                                    {type:'edit',permissions:'contractor.edit'}                                        
                                ]}                            
                                onCancel ={this.onCancel} title ={I18n.t(100481/*地址*/)}
                                    Zindex ={10}
                                    openDialog={this.handleClick}
                                    onSaveAndClose={this.onAddressListSaveAndClose}
                                    DialogTempalte ={require('../../../../Client/Detail/Content/components/AddressPurposeDialog').default}
                                    showHeader ={false}
                                    checkedRowsArray={[]}
                                    id={'servbe-detail-addressList'}
                                    AjaxInit={true}
                                    API_FOODING={API_FOODING_DS}
                                    portname={'/address/getInit'}
                                    params={{beId:this.state.id,dataTyId:85}}
                                    otherData={{beId:this.state.id,dataTyId:85}}
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
                                    data={this.state.addressList}
                            />
                          <MeasureCommon 
                                menuList={[
                                    {type:'add',permissions:'contractor.dtl.add'},
                                    {type:'delete',permissions:'contractor.dtl.del'},
                                    {type:'edit',permissions:'contractor.edit'}                                        
                                ]}                               
                                onCancel ={this.onCancel} title ={I18n.t(100500/*银行账号*/)}
                                    Zindex ={8}
                                    openDialog={this.handleClick}
                                        DialogTempalte ={require('../../../../Client/Detail/Content/components/BankTemplateDialog').default}
                                        showHeader ={true}
                                        checkedRowsArray={[]}
                                        onSaveAndClose={this.onBankListSaveAndClose}
                                        id={'servbe-detail-bank'}
                                        otherData={{sourceId:this.state.id}}
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
                                            }]
                                }
                                    data={this.state.bankacctList}
                            />
                          <Template1 
                            menuList={[
                                {permissions:'contractor.edit',type:I18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{I18n.t(100439/*编辑*/)}</div>}
                            ]}                          
                            onCancel ={this.onCancel} Zindex={7}
		               		width={107}
                            DialogTempalte={require('./NormalDialog').default}
		               		isShowMenu={true}
		               		openDialog={this.handleClick}
		               		onSaveAndClose={this.onSaveAndClose}
                            AjaxInit={true}
                            API_FOODING={API_FOODING_DS}
                            portname={'/carrier/regInfo/getInit'}
                            params={{id:this.state.id}}
		                    id={'carrier-detail-signInformation'} title={I18n.t(100139/*注册信息*/)} tempArray={[
		                    	{key:I18n.t(100358/*税号*/),value:servBeVo.taxIdenSN||""},
		                    	{key:I18n.t(100561/*法人代表*/),value:servBeVo.leglpsn||"" },
		                    	{key:I18n.t(100563/*成立日期*/),value:servBeVo.estabDate?new Date(servBeVo.estabDate).Format('yyyy-MM-dd'):""},
		                    	{key:I18n.t(100564/*注册资本*/),value:<b>{servBeVo.regCapital || ""} {servBeVo.regCapital&&regCapitalCurrenObj && regCapitalCurrenObj.localName ||"" }</b>}

		                    ]} />
		               </div>
		               <div className = 'col' style={{paddingLeft:0}}>
                                <MeasureCommon 
                                    menuList={[
                                        {type:'add',permissions:'contractor.dtl.add'},
                                        {type:'delete',permissions:'contractor.dtl.del'},
                                        {type:'edit',permissions:'contractor.edit'}                                        
                                    ]}                               
                                    onCancel ={this.onCancel} title ={I18n.t(100245/*联系方式*/)}
                                    Zindex={4}
                                    openDialog={this.handleClick}
                                    DialogTempalte ={require('../../../../Client/Detail/Content/components/ContactDialog').default}
                                    showHeader ={false}
                                    checkedRowsArray={[]}
                                    onSaveAndClose={this.onContactSaveAndClose}
                                    onSaveAdd={this.onContactSaveAdd}
                                    id={'servbe-detail-contact'}
                                    AjaxInit={true}
                                    API_FOODING={API_FOODING_DS}
                                    portname={'/contact/getInit'}
                                    params={{sourceId:this.state.id,dataTyId:85}}
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
                                                    {classn:'foddingicon fooding-web',type:'site',num:70},
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
                                    data={this.state.contactList}
                                />

		               </div>
	               </div>
	                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
		                {commonForm}
		            </Dialog>
               </div>
			);
	}

}
export default ServBeDetail;



