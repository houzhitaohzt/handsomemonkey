import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../components/RuleTemplate';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';

import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
export class ProviderDetail extends Component{
	constructor(props) {
        super(props);
		this.onCancel=this.onCancel.bind(this);
        this.state= {
            scrollHeight:0,
            scroll:0,
            visible:false,
            dialogTitle:'',
            sourceId:this.props.location.query.id,
            baozhuangData:[],
            inspectReportData:[],
            trayRequireData:[],
            CertificateData:[],
            ShipmarkPlugData:[],
            SupervisionData:[],
            TransportRequireData:[],
            dilogTelmp:<div></div>
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
                    if(data.id === "clientproduct-detail-pack"){//包装
                        apiForm(API_FOODING_DS,'/tradrulePack/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.baoZhuangInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id === "clientproduct-detail-inspectionreport"){//检验报告
                        apiForm(API_FOODING_DS,'/tradruleTest/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.inspectionreportInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id === "clientproduct-detail-trayrequire"){//托盘要求
                        apiForm(API_FOODING_DS,'/tradrulePallet/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.trayRequireInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id === "clientproduct-detail-Certificate"){//证书
                        apiForm(API_FOODING_DS,'/tradruleCertfct/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.CertificateInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id === "clientproduct-detail-ShipmarkPlug"){
                        apiForm(API_FOODING_DS,'/tradruleShipmark/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.ShipmarkPlugInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id === "clientproduct-detail-supervision"){//监装机构
                        apiForm(API_FOODING_DS,'/tradruleInspct/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.SupervisionInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id === "clientproduct-detail-TransportRequire"){
                        apiForm(API_FOODING_DS,'tradrulePropty/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.TransportRequireInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }
				}
		   	});
        }else{
        	let dialogTitle= data.action+data.name.title;
        	 this.setState({
        	 	visible:true,
                dialogTitle:dialogTitle,
                dilogTelmp:Template
        	});
        }
    }
    //包装 保存并新增
    saveBaozhuang = (value,data) => {       
       value=Object.assign({},value,{cstmMtlId:this.state.sourceId,dataTyId:50});
       if(JSON.stringify(data) !== "{}"){//表示是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
       }
       apiPost(API_FOODING_DS,'/tradrulePack/save',value,(response)=>{
            this.setState({visible:false});
            ServiceTips({text:response.message,type:'success'});
            this.baoZhuangInitData();            
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
    //包装初始化数据
    baoZhuangInitData = () =>　{
        apiGet(API_FOODING_DS,"/tradrulePack/getList",{sourceId:this.state.sourceId},response => {
            this.setState({baozhuangData:response.data})
        },errors => ServiceTips({text:errors.message,type:"error"}))
    }
    //检验报告
    inspectionreport = (value,data) => {
        value=Object.assign({},value,{sourceId :this.state.sourceId,dataTyId:50});
       if(JSON.stringify(data) !== "{}"){//表示是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
       }
       apiPost(API_FOODING_DS,'/tradruleTest/save',value,(response)=>{
            this.setState({visible:false});
            ServiceTips({text:response.message,type:'success'});
            this.inspectionreportInitData();                
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
    //检验报告初始化
    inspectionreportInitData = () => {
        apiGet(API_FOODING_DS,"/tradruleTest/getList",{sourceId:this.state.sourceId},response => {
            this.setState({inspectReportData:response.data})
        },errors => ServiceTips({text:errors.message,type:"error"}))
    }
    //托盘要求
    trayRequire = (value,data) => {
        value=Object.assign({},value,{sourceId :this.state.sourceId,dataTyId:50});
       if(JSON.stringify(data) !== "{}"){//表示是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
       }
       apiPost(API_FOODING_DS,'/tradrulePallet/save',value,(response)=>{
            this.setState({visible:false});
            ServiceTips({text:response.message,type:'success'});
            this.trayRequireInitData();                
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
    //托盘要求 初始化
    trayRequireInitData = () => {
        apiGet(API_FOODING_DS,"/tradrulePallet/getList",{sourceId:this.state.sourceId},response => {
            this.setState({trayRequireData:response.data})
        },errors => ServiceTips({text:errors.message,type:"error"}))
    }
    
    //证书 保存
    CertificateClick = (value,data) => {
        value=Object.assign({},value,{sourceId :this.state.sourceId,dataTyId:50});
       if(JSON.stringify(data) !== "{}"){//表示是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
       }
       apiPost(API_FOODING_DS,'/tradruleCertfct/save',value,(response)=>{
            this.setState({visible:false});
            ServiceTips({text:response.message,type:'success'});
            this.CertificateInitData();                
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
    //证书 初始化
    CertificateInitData = () =>　{
        apiGet(API_FOODING_DS,"/tradruleCertfct/getList",{sourceId:this.state.sourceId,dataTyId:50},response => {
            this.setState({CertificateData:response.data})
        },errors => ServiceTips({text:errors.message,type:"error"}))
    }
    //麦头 保存
    ShipmarkPlugClick = (value,data) => {
        value=Object.assign({},value,{sourceId :this.state.sourceId,dataTyId:50});
       if(JSON.stringify(data) !== "{}"){//表示是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
       }
       apiPost(API_FOODING_DS,'/tradruleShipmark/save',value,(response)=>{
            this.setState({visible:false});
            ServiceTips({text:response.message,type:'success'});
            this.ShipmarkPlugInitData();                
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
    //麦头 初始化
    ShipmarkPlugInitData = () => {
        apiGet(API_FOODING_DS,"/tradruleShipmark/getList",{sourceId:this.state.sourceId,dataTyId:50},response => {
            this.setState({ShipmarkPlugData:response.data})
        },errors => ServiceTips({text:errors.message,type:"error"}))
    }
    //监装机构
    SupervisionClick = (value,data,isAdd) => {
        let that = this;
        value=Object.assign({},value,{sourceId:this.state.sourceId});
       apiPost(API_FOODING_DS,'/tradruleInspct/save',value,(response)=>{
            that.setState({
                    visible:!!isAdd
                })
            ServiceTips({text:response.message,type:'success'});
            this.SupervisionInitData();                
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
            that.setState({
                    visible:!!isAdd
            })
        })
    }
    //监装机构 初始化
    SupervisionInitData = () => {
        apiGet(API_FOODING_DS,"/tradruleInspct/getPage",{sourceId:this.state.sourceId},response => {
            this.setState({SupervisionData:response.data.data})
        },errors => ServiceTips({text:errors.message,type:"error"}))
    }
    //运输要求
    TransportRequire = (value,data) => {
       value=Object.assign({},value,{sourceId:this.state.sourceId,dataTyId:50});
       if(JSON.stringify(data) !== "{}"){//表示是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
       }
       apiPost(API_FOODING_DS,'/tradrulePropty/save',value,(response)=>{
            this.setState({visible:false});
            ServiceTips({text:response.message,type:'success'});
            this.TransportRequireInitData();                
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
    //运输要求 初始化
    TransportRequireInitData = () => {
        apiGet(API_FOODING_DS,"/tradrulePropty/getList",{sourceId:this.state.sourceId,dataTyId:50},response => {
            this.setState({TransportRequireData:response.data})
        },errors => ServiceTips({text:errors.message,type:"error"}))
    }
	onCancel(){
        this.setState({visible:false});
	}

    componentDidMount(){
        this.baoZhuangInitData();
        this.inspectionreportInitData();
        this.trayRequireInitData();
        this.CertificateInitData();
        this.ShipmarkPlugInitData();
        this.SupervisionInitData();
        this.TransportRequireInitData();
        let padding = 80;
        let sch=document.body.offsetHeight-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
    }
    componentWillReceiveProps(nextProps){
        
    }
	render(){
		const commonForm = this.state.dilogTelmp;   
		return (
			  <div> 
	               <div className='scroll' style={{backgroundColor:'#f0f4f8',overflow:'auto',height:this.state.scrollHeight}}>        
		               <div className = 'col'>
		               <MeasureCommon 
                            menuList={[
                                {type:'add',permissions:'clien.dtl.add'},
                                {type:'delete',permissions:'clien.dtl.del'},
                                {type:'edit',permissions:'clien.edit'}                                        
                            ]}                       
                             onCancel ={this.onCancel} title ={i18n.t(200923/*包装要求*/)} 
                             Zindex ={9}
                             openDialog={this.handleClick}
                             DialogTempalte ={require('./PackPage').default}
                             showHeader ={true}
                             checkedRowsArray={[]}
                             id={'clientproduct-detail-pack'}
                             onSaveAndClose = {this.saveBaozhuang}
                             AjaxInit={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/tradrulePack/getInit'}
                             params={{}}
                             columns ={
                                [{
                                    title : i18n.t(200924/*指定包装*/),
                                    dataIndex : 'packagingName',
                                    key : "packagingName",
                                    width : '80%',
                                    render(data,row,index){
                                        return (<div title={data} className={'text-ellipsis'}>{data}</div>)
                                    }
                                },
                                {
                                    title : i18n.t(100123/*默认*/),
                                    dataIndex : 'dfutMrk',
                                    key : "dfutMrk",
                                    width : '15%',
                                    render(data,row,index){
                                        return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                         //return data?i18n.t(100141/*是*/):i18n.t(100142/*否*/);
                                    }
                                }]
                            }
                            data={this.state.baozhuangData}

                    />
                    <MeasureCommon 
                        menuList={[
                            {type:'add',permissions:'clien.dtl.add'},
                            {type:'delete',permissions:'clien.dtl.del'},
                            {type:'edit',permissions:'clien.edit'}                                        
                        ]}                    
                        onCancel ={this.onCancel} title ={i18n.t(200925/*检验报告*/)} 
                        openDialog={this.handleClick}
                                Zindex ={8}
                                 DialogTempalte ={require('./InspectionReport').default}
                                 showHeader ={true}
                                 checkedRowsArray={[]}
                                 id={'clientproduct-detail-inspectionreport'}
                                 onSaveAndClose = {this.inspectionreport}
                                 AjaxInit={true}
                                 API_FOODING={API_FOODING_DS}
                                 portname={'/tradruleTest/getInit'}
                                 params={{}}
                                 columns ={
                                 [
                                    {
                                        title : i18n.t(200337/*检测项目*/),
                                        dataIndex : 'testItemName',
                                        key : "testItemName",
                                        width : '30%',
                                        render(data,row,index){
                                            return (<div style={{color:'#9facbd'}} title={data}>{data}</div>)
                                        }
                                    },
                                    {
                                        title : i18n.t(200926/*检测方式*/),
                                        dataIndex : 'testMethName',
                                        key : "testMethName",
                                        width : '35%',
                                        render(data,row,index){
                                            return (<div title={data}>{data}</div>)
                                        }
                                    },
                                    {
                                        title : i18n.t(200338/*检测机构*/),
                                        dataIndex : 'servBeName',
                                        key : "servBeName",
                                        width : '30%',
                                        render(data,row,index){
                                            return (<div title={data}>{data}</div>)
                                        }
                                    }]
                                }
                                data={this.state.inspectReportData}
                    />
                     </div>
		               <div className = 'col' style={{paddingLeft:0}}>
		                    <div className='col'  style={{paddingLeft:0,paddingTop:0}}>
                                <MeasureCommon 
                                    menuList={[
                                        {type:'add',permissions:'clien.dtl.add'},
                                        {type:'delete',permissions:'clien.dtl.del'}
                                                                               
                                    ]}                                    
                                    onCancel ={this.onCancel} title ={i18n.t(100098/*证书*/)}
                                        Zindex ={3} 
                                        openDialog={this.handleClick}
                                         DialogTempalte ={require('./CertificateDialog').default}
                                         showHeader ={false}
                                         checkedRowsArray={[]}
                                         id={'clientproduct-detail-Certificate'}
                                         onSaveAndClose = {this.CertificateClick}
                                         AjaxInit={true}
                                        isPost={true}
                                        API_FOODING={API_FOODING_DS}
                                        portname={'/object/getMiniList'}
                                        params={{obj:'com.fooding.fc.ds.entity.Certfct'}}
                                        iconArray={[1,2]}
                                        menuItems={[1,2]}
                                         columns ={
                                            [{
                                                title : i18n.t(500070/*证书名称*/),
                                                dataIndex : 'localName',
                                                key : "localName",
                                                width : '90%',
                                                render(data,row,index){
                                                    return <div>{data}</div>
                                                }
                                            }
                                           ]
                                        }
                                        data={this.state.CertificateData}
                                /> 
                                <MeasureCommon 
                                    menuList={[
                                        {type:'add',permissions:'clien.dtl.add'},
                                        {type:'delete',permissions:'clien.dtl.del'}
                                                                               
                                    ]}                                   
                                    onCancel ={this.onCancel} title ={i18n.t(100105/*唛头*/)} 
                                         openDialog={this.handleClick}
                                         DialogTempalte ={require('./ShipmarkPlugDialog').default}
                                         showHeader ={true}
                                         checkedRowsArray={[]}
                                         id={'clientproduct-detail-ShipmarkPlug'}
                                         onSaveAndClose = {this.ShipmarkPlugClick}
                                         AjaxInit={true}
                                         API_FOODING={API_FOODING_DS}
                                         portname={'/tradruleShipmark/getInit'}
                                         params={{sourceId:this.state.sourceId}}
                                         columns ={
                                            [{
                                                title : i18n.t(100111/*标记项目*/),
                                                dataIndex : 'itemName',
                                                key : "itemName",
                                                width : '50%',
                                                render(data,row,index){
                                                    return (<div >{data&&data.localName?data.localName:data}</div>)
                                                }
                                            },{
                                                title : i18n.t(100148/*注释*/),
                                                dataIndex : "itemTxt",
                                                key : "itemTxt",
                                                width : "50%",
                                                render(data,row,index){
                                                    return data;
                                                }
                                            }]
                                        }
                                        data={this.state.ShipmarkPlugData}
                                />   
                            </div>
                    <div className='col' style={{paddingLeft:0,paddingTop:0,paddingRight: 0}}>
                            <MeasureCommon 
                                menuList={[
                                    {type:'add',permissions:'clien.dtl.add'},
                                    {type:'delete',permissions:'clien.dtl.del'}
                                                                         
                                ]}                               
                                onCancel ={this.onCancel} title ={i18n.t(100102/*监装机构*/)} 
                                 Zindex={9}
                                 openDialog={this.handleClick}
                                 DialogTempalte ={require('./SupervisionDialog').default}
                                 showHeader ={false}
                                 checkedRowsArray={[]}
                                 otherData = {{sourceId:this.state.sourceId}}
                                 id={'clientproduct-detail-supervision'}
                                 onSaveAndClose = {this.SupervisionClick}
                                 iconArray={[1,2]}
                                 menuItems={[1,2]}
                                 columns ={
                                    [{
                                        title : i18n.t(200927/*监装机构名称*/),
                                        dataIndex : 'localName',
                                        key : "localName",
                                        width:'90%',
                                        render(data,row,index){
                                            return <div>{data}</div>
                                        }
                                    }
                                   ]
                                }
                                data={this.state.SupervisionData}
                            />
                            <MeasureCommon 
                         menuList={[
                            {type:'add',permissions:'clien.dtl.add'},
                            {type:'delete',permissions:'clien.dtl.del'},
                            {type:'edit',permissions:'clien.edit'}                                        
                        ]}                   
                        onCancel ={this.onCancel} title ={i18n.t(100120/*托盘要求*/)} 
                                openDialog={this.handleClick}
                                Zindex ={7}
                                 DialogTempalte ={require('./TrayRequire').default}
                                 showHeader ={true}
                                 checkedRowsArray={[]}
                                 id={'clientproduct-detail-trayrequire'}
                                 onSaveAndClose = {this.trayRequire}
                                 AjaxInit={true}
                                 API_FOODING={API_FOODING_DS}
                                 portname={'/tradrulePallet/getInit'}
                                 params={{}}
                                 columns = {[{
                                        title : i18n.t(100124/*托盘类型*/),
                                        dataIndex : 'salvrTypeName',
                                        key : "salvrTypeName",
                                        width : '50%',
                                        render(data,row,index){
                                            return (<div>{data}</div>)
                                        }
                                    },{
                                        title : i18n.t(100123/*默认*/),
                                        dataIndex : "dfutMrk",
                                        key : "dfutMrk",
                                        width : "50%",
                                        render(data,row,index){
                                            return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                            //return <div>{data?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</div>;
                                        }
                                    }]
                                }
                                data={this.state.trayRequireData}
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