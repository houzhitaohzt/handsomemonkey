import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Dialog  from '../../../../../components/Dialog';
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
import Confirm from '../../../../../components/Dialog/Confirm';
import shallowequal from 'shallowequal';
import MeasureCommon from  '../../../../../components/RuleTemplate';
export class TraderulesDetail extends Component{
	constructor(props){
		super(props);
        props.traderules && props.traderules(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        //证书 保存并关闭
        this.zhengshuSaveAndClose=this.zhengshuSaveAndClose.bind(this);
        this.zhengshuInitData=this.zhengshuInitData.bind(this);
        //证书 保存并关闭
        this.jianzhuangSaveAndClose=this.jianzhuangSaveAndClose.bind(this);
        this.jianzhuangInitData=this.jianzhuangInitData.bind(this);
        this.jianzhuangRightKey=this.jianzhuangRightKey.bind(this);
        //唛头
        this.maitouSaveAndClose=this.maitouSaveAndClose.bind(this);
        this.maitouInitData=this.maitouInitData.bind(this);
        //特殊要求
        this.teshuSaveAndClose=this.teshuSaveAndClose.bind(this);
        this.teshuInitData=this.teshuInitData.bind(this);
        //反倾销
        this.fanqingxiaoSaveAndClose=this.fanqingxiaoSaveAndClose.bind(this);
        this.fanqingxiaoInitData=this.fanqingxiaoInitData.bind(this);
        //托盘要求
        this.tuopanSaveAndClose=this.tuopanSaveAndClose.bind(this);
        this.tuopanInitData=this.tuopanInitData.bind(this);
        //税项
        this.shuixiangSaveAndClose=this.shuixiangSaveAndClose.bind(this);
        this.shuixiangInitData=this.shuixiangInitData.bind(this);
        //禁止销售
         this.jinzhiSaveAndClose=this.jinzhiSaveAndClose.bind(this);
        this.jinzhiInitData=this.jinzhiInitData.bind(this);
        this.zhengshuRightKey = this.zhengshuRightKey.bind(this);
		this.state={
            visible:false,
            scrollHeight:0, 
            dialogTitle:'',
            dilogTelmp:<div></div>,
            id:this.props.location.query.id, //列表頁传过来的id
            platformMtlId:this.props.location.query.platformMtlId,//列表页传过来的sourceId
            cntryId:this.props.location.query.cntryId, //列表页传过来的国家id
            zhengshu:this.props.zhengshuList || [], //证书
            jianzhuang:this.props.jianzhuang || [], //简装机构
            maitou:this.props.maitou || [], //唛头
            teshu:this.props.teshu || [], //特殊要求
            fanqingxiao:this.props.fanqingxiao || [], //反倾销
            tuopan:this.props.tuopan || [] ,//托盘要求
            shuixiang:this.props.shuixiang || [], //税项
            jinzhi:this.props.jinzhi || [], //禁止销售
            data:{}
        };
		this.getPages = this.getPages.bind(this);
	}
	getPages(){
        this.handleResize();
        this.zhengshuInitData();
        this.jianzhuangInitData();
        this.maitouInitData();
        this.teshuInitData();
        this.fanqingxiaoInitData();
        this.tuopanInitData();
        this.shuixiangInitData();
        this.jinzhiInitData();
        //this.getPage();
    }
	handleClick = (e, data, Template) => {
        let that = this;
        if(data.number== 2){
            debugger
            let id = [],tempString = i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
            id = (data && data.record)? [data.record.id]:data.selectArr.map((o) => o.id);
            if(!(data && data.record || data.selectArr.length == 1)){
                tempString = i18n.t(100395/*已选中*/) + data.selectArr.length + i18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
            }
             Confirm(tempString, {
                  done: () => {
                    if(data.id == "client-detail-zhengshu"){//证书删除
                        let certifctId = []
                         certifctId = (data && data.record)? [data.record.certifctId]:data.selectArr.map((o) => o.certifctId);
                         apiForm(API_FOODING_DS,'/tradruleCertfct/tradrule/delete',{certifctId:certifctId,cntryId:that.state.cntryId,platformMtlId:that.state.platformMtlId},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.zhengshuInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-jianzhuang"){//表示是监装机构删除
                        let instBeId = []
                        instBeId = (data && data.record)? [data.record.instBeId]:data.selectArr.map((o) => o.instBeId);
                         apiForm(API_FOODING_DS,'/tradruleInspct/tradrule/delete',{instBeId:instBeId,cntryId:that.state.cntryId,platformMtlId:that.state.platformMtlId},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.jianzhuangInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-maitou"){//表示是唛头删除
                        let itemId = []
                        itemId = (data && data.record)? [data.record.itemId]:data.selectArr.map((o) => o.itemId);
                         apiForm(API_FOODING_DS,'/tradruleShipmark/tradrule/delete',{itemId:itemId,cntryId:that.state.cntryId,platformMtlId:that.state.platformMtlId},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.maitouInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-teshu"){//表示是特殊要求删除
                         apiForm(API_FOODING_DS,'/tradrulePropty/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.teshuInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-fanqingxiao"){//表示是反倾销删除
                         apiForm(API_FOODING_DS,'/tradruleAntidump/tradrule/delete',{id:id,cntryId:that.state.cntryId,platformMtlId:that.state.platformMtlId},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.fanqingxiaoInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-tuopan"){//表示是托盘要求删除
                        let salvrId = []
                        salvrId = (data && data.record)? [data.record.salvrId]:data.selectArr.map((o) => o.salvrId);
                         apiForm(API_FOODING_DS,'/tradrulePallet/tradrule/delete',{salvrId:salvrId,cntryId:that.state.cntryId,platformMtlId:that.state.platformMtlId},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.tuopanInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-shuixiang"){//表示是税项删除
                         apiForm(API_FOODING_DS,'/price/tradrule/delete',{id:id,cntryId:that.state.cntryId,platformMtlId:that.state.platformMtlId},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.shuixiangInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-jinzhi"){//表示是禁止销售删除
                         apiForm(API_FOODING_DS,'/tradruleAntidump/tradrule/delete',{id:id,cntryId:that.state.cntryId,platformMtlId:that.state.platformMtlId},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.jinzhiInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }
   				}
   			})
        }else if(data.number == 3){
            //没有看到失效，所有失效先不做，留给后续再做
            return false;
        }else{
           this.setState({visible:!this.state.visible});
            let dialogTitle= data.action+data.name.title;
            this.setState({
                    dialogTitle:dialogTitle,
                    dilogTelmp:Template
            }); 
        } 
     }
    onSaveAndClose(){
    	this.setState({visible:false});
    }
    onCancel(){
    	this.setState({visible:false});
    }
    //证书 保存并关闭
   zhengshuSaveAndClose(value,data){
        let that = this;
        value = Object.assign({},{sourceId:this.state.platformMtlId,cntryId:this.state.cntryId,dataTyId:25},value);
         if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/tradruleCertfct/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.zhengshuInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //证书 数据拉取
    zhengshuInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/tradruleCertfct/getPage', {sourceId:this.state.platformMtlId,cntryId:this.state.cntryId,dataTyId:25}, response => {
            that.setState({
                zhengshu:response.data.data
            })
        }, error => console.log(error.message))
    }
    //监装 保存并关闭
    jianzhuangSaveAndClose(value,data,isAdd){
    	let that = this;
         value=Object.assign({},value,{sourceId:this.state.platformMtlId,cntryId:this.state.cntryId,dataTyId:25});
         apiPost(API_FOODING_DS,'/tradruleInspct/save',value,(response) => {
            that.setState({
                    visible:!!isAdd
                })
            ServiceTips({text:response.message,type:'success'});
            that.jianzhuangInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
             that.setState({
                    visible:!!isAdd
                })
        })
        this.setState({visible:false});
    }
    // 监装 数据拉取
    jianzhuangInitData(){
    	let that = this;
        apiGet(API_FOODING_DS,'/tradruleInspct/getPage', {sourceId:this.state.platformMtlId,cntryId:this.state.cntryId,dataTyId:25},
         response => {
         	
            that.setState({
                jianzhuang:response.data.data
            })
        }, error => console.log(error.message))
    }
    //唛头
    maitouSaveAndClose(value,data){
    	 let that = this;
        value = Object.assign({},{sourceId:this.state.platformMtlId,cntryId:this.state.cntryId,dataTyId:25},value);
        apiPost(API_FOODING_DS,'/tradruleShipmark/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.maitouInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }

    //唛头 数据拉取
    maitouInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/tradruleShipmark/getPage', {sourceId:this.state.platformMtlId,cntryId:this.state.cntryId,dataTyId:25}, response => {
            that.setState({
                maitou:response.data.data
            })
        }, error => console.log(error.message))
    }
    //特殊要求
    teshuSaveAndClose(value,data){
    	 let that = this;
        value = Object.assign({},{sourceId:this.state.platformMtlId,cntryId:this.state.cntryId,dataTyId:25},value);
        apiPost(API_FOODING_DS,'/tradrulePropty/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.teshuInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //特殊要求 数据拉取
     teshuInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/tradrulePropty/getPage', {sourceId:this.state.platformMtlId,cntryId:this.state.cntryId,dataTyId:25}, response => {
            that.setState({
                teshu:response.data.data
            })
        }, error => console.log(error.message))
    }
    //反倾销 保存并关闭
    fanqingxiaoSaveAndClose(value,data){
    	 let that = this;
        value = Object.assign({},{sourceId:this.state.platformMtlId,tradruleCntryId:this.state.cntryId,dataTyId:25,typeId:1},value);
        apiPost(API_FOODING_DS,'/tradruleAntidump/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.fanqingxiaoInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //反倾销 的数据拉取
     fanqingxiaoInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/tradruleAntidump/getPage', {sourceId:this.state.platformMtlId,tradruleCntryId:this.state.cntryId,dataTyId:25,typeId:1}, response => {
            that.setState({
                fanqingxiao:response.data.data
            })
        }, error => console.log(error.message))
    }
    //禁止销售 保存并关闭
    jinzhiSaveAndClose(value,data){
    	 let that = this;
        value = Object.assign({},{sourceId:this.state.platformMtlId,tradruleCntryId:this.state.cntryId,dataTyId:25,typeId:2},value);
        apiPost(API_FOODING_DS,'/tradruleAntidump/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.jinzhiInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //禁止销售 的数据拉取
     jinzhiInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/tradruleAntidump/getPage', {sourceId:this.state.platformMtlId,tradruleCntryId:this.state.cntryId,dataTyId:25,typeId:2}, response => {
            that.setState({
                jinzhi:response.data.data
            })
        }, error => console.log(error.message))
    }
    //托盘要求 保存并关闭
	tuopanSaveAndClose(value,data){
		    	 let that = this;
		        value = Object.assign({},{sourceId:this.state.platformMtlId,cntryId:this.state.cntryId,dataTyId:25},value);
		        apiPost(API_FOODING_DS,'/tradrulePallet/save',value,(response) => {
		            ServiceTips({text:response.message,type:'success'});
		            that.tuopanInitData();          
		        },(error)=>{
		            ServiceTips({text:error.message,type:'error'});
		        })
		        this.setState({visible:false});
	}
	//托盘要求 的数据拉取
	tuopanInitData(){
		        let that = this;
		        apiGet(API_FOODING_DS,'/tradrulePallet/getPage', {sourceId:this.state.platformMtlId,cntryId:this.state.cntryId,dataTyId:25}, response => {
		            that.setState({
		                tuopan:response.data.data
		            })
		        }, error => console.log(error.message))
	}
	//税项 保存并关闭
	shuixiangSaveAndClose(value,data){
		    	 let that = this;
		        value = Object.assign({},{sourceId:this.state.platformMtlId,cntryId:this.state.cntryId,dataTyId:25},value);
		        apiPost(API_FOODING_DS,'/price/save',value,(response) => {
		            ServiceTips({text:response.message,type:'success'});
		            that.shuixiangInitData();          
		        },(error)=>{
		            ServiceTips({text:error.message,type:'error'});
		        })
		        this.setState({visible:false});
	}
	//税项 的数据拉取
	shuixiangInitData(){
		        let that = this;
		        apiGet(API_FOODING_DS,'/price/getPage', {sourceId:this.state.platformMtlId,cntryId:this.state.cntryId,dataTyId:25}, response => {
		            that.setState({
		                shuixiang:response.data.data
		            })
		        }, error => console.log(error.message))
	}
    componentDidMount(){
        if(!this.props.isDetail){
            this.getPages();
        }
        window.addEventListener('resize', this.handleResize(20));
    }
    shouldComponentUpdate(nextProps,nextState){
        return (!shallowequal(nextProps, this.props))||(!shallowequal(this.state,nextState));
    }
    handleResize(e,height){
       
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        let scrollHeight = scroll + 90;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0)); 
    }
    zhengshuRightKey(e,data,target){
    	this.refs.zhengshu.handleClick(e,data,target);
    }
    jianzhuangRightKey(e,data,target){
    	this.refs.jianzhuang.handleClick(e,data,target);
    }
	render(){
		const commonForm = this.state.dilogTelmp;  
		 const {zhengshu,jianzhuang,maitou,teshu,fanqingxiao,tuopan,shuixiang,jinzhi} = this.state;
		return(<div className='scroll' style={{overflow:'auto',height:this.state.scrollHeight}}>
                <div className='col'>
    					<div className='col padding-left-0 padding-top-0'>
    					   		<MeasureCommon 
                                    menuList={[
                                        {type:'add'},
                                        {type:'delete'}
                                                                              
                                    ]}                                   
                                   title={i18n.t(100098/*证书*/)} 
                                    ref = "zhengshu"
                                    Zindex ={19}
                                    openDialog={this.handleClick}
                                    DialogTempalte ={require('./TraderulesDetailDialog').default}
                                    showHeader ={true}
                                    checkedRowsArray={[]}
                                    getSelectArr={[]}
                                    id={'client-detail-zhengshu'}
                                    onSaveAndClose={this.zhengshuSaveAndClose}
                                    onCancel={this.onCancel}
                                    AjaxInit={true}
                                    isPost={true}
                                    API_FOODING={API_FOODING_DS}
                                    portname={'/object/getMiniList'}
                                    params={{obj:'com.fooding.fc.ds.entity.Certfct'}}
                                    iconArray={[1,2]}
                                    menuItems={[1,2]}
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
                                data={zhengshu}
    					   		/>
    					    	<MeasureCommon 
                                    menuList={[
                                        {type:'add'},
                                        {type:'delete'}
                                                                              
                                    ]}                                
                                    title={i18n.t(100102/*监装机构*/)}
    					    		ref = "jianzhuang"
    						   		Zindex ={18}
    	                            openDialog={this.handleClick}
    	                             DialogTempalte ={require('./TraderulesDetailDialog').default}
    	                             showHeader ={true}
    	                             checkedRowsArray={[]}
    	                             isPost={true}
    	                             id={'client-detail-jianzhuang'}
    	                             onSaveAndClose={this.jianzhuangSaveAndClose}
    	                             onCancel={this.onCancel}
    	                             AjaxInit={true}
    	                             API_FOODING={API_FOODING_DS}
    	                             portname={'/object/getMiniList'}
    	                             params={
    	                             	{obj:'com.fooding.fc.ds.entity.ServBe',sourceId:this.props.sourceId,dataTyId:10,
    							                queryParams:[{
    							                    'attr':'beDataMulDivIds',
    							                    'expression':'oin',
    							                    'value':70

    							                }]
    						         	}
    						     	}
    	                               iconArray={[1,2]}
    	                               menuItems={[1,2]}
    	    					      columns ={
                                    [{
                                        title : i18n.t(100102/*监装机构*/),
                                        dataIndex : 'ccardType',
                                        key : "ccardType",
                                        width:'90%',
                                        render(data,row,index){
                                            return <div>{row.localName}</div>
                                        }
                                    
                                   	}]
                                   
                               }
                                data={jianzhuang}
    					   		/>
    					</div>
                    <div>
                        <div className='col padding-left-0 padding-top-0'>
                            <MeasureCommon  
                                menuList={[
                                    {type:'add'},
                                    {type:'delete'}
                                                                           
                                ]}                            
                                title={i18n.t(100120/*托盘要求*/)} 
                                Zindex ={2}
                                    openDialog={this.handleClick}
                                     DialogTempalte ={require('./TraderulesDetailDialog').default}
                                     showHeader ={true}
                                     checkedRowsArray={[]}
                                     getSelectArr={[]}
                                     onSaveAndClose={this.tuopanSaveAndClose}
                                     onCancel={this.onCancel}
                                     AjaxInit={true}
                                     id={'client-detail-tuopan'}
                                     API_FOODING={API_FOODING_DS}
                                     portname={'/tradrulePallet/getInit'}
                                     params={{}}
                                     columns ={
                                        [{
                                            title : i18n.t(100124/*托盘类型*/),
                                            dataIndex : 'salvrType',
                                            key : "salvrType",
                                            width : '50%',
                                            render(data,row,index){
                                                return (<div>{data?data.localName:''}</div>)
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
                                    data={tuopan}
                            />
                            <MeasureCommon  
                                menuList={[
                                    {type:'add'},
                                    {type:'delete'}
                                                                         
                                ]}                            
                                title={i18n.t(200872/*禁止销售*/)} 
                                Zindex ={1}
                                openDialog={this.handleClick}
                                 DialogTempalte ={require('./TraderulesDetailDialog').default}
                                 showHeader ={true}
                                 checkedRowsArray={[]}
                                 getSelectArr={[]}
                                 onSaveAndClose={this.jinzhiSaveAndClose}
                                 onCancel={this.onCancel}
                                 AjaxInit={true}
                                 id={'client-detail-jinzhi'}
                                 API_FOODING={API_FOODING_DS}
                                 portname={'/tradruleAntidump/getInit'}
                                 params={{}}
                                 columns ={
                                    [{
                                        title : i18n.t(100002/*描述*/),
                                        dataIndex : 'infoTxt',
                                        key : "infoTxt",
                                        width:'10%',
                                        render(data,row,index){
                                             return <div>{data}</div>
                                        }
                                    },{
                                        title : i18n.t(200873/*禁止开始日期*/),
                                        dataIndex : 'validDate',
                                        key : "validDate",
                                        width:'30%',
                                        render(data,row,index){
                                           return new Date(data).Format('yyyy-MM-dd');
                                        }
                                     },{
                                        title : i18n.t(200874/*禁止结束日期*/),
                                        dataIndex : 'endDate',
                                        key : "endDate",
                                        width:'30%',
                                        render(data,row,index){
                                            return new Date(data).Format('yyyy-MM-dd');
                                        }
                                    
                                    }]
                                   
                               }
                                data={jinzhi}
                            />
                        </div>
                    </div>
                </div>
                <div  className='col'>
                        <MeasureCommon
                            menuList={[
                                {type:'add'},
                                {type:'delete'}
                                                                       
                            ]}                       
                            id={'client-detail-maitou'} title={i18n.t(100105/*唛头*/)} 
                            Zindex ={12}
                            openDialog={this.handleClick}
                             DialogTempalte ={require('./TraderulesDetailDialog').default}
                             showHeader ={true}
                             checkedRowsArray={[]}
                             getSelectArr={[]}
                             onSaveAndClose={this.maitouSaveAndClose}
                             onCancel={this.onCancel}
                             AjaxInit={true}
                             isPost={true}
                             API_FOODING={API_FOODING_DS}
                            portname={'/object/getMiniList'}
                             params={{obj:'com.fooding.fc.ds.entity.Item'}}
                             columns ={
                                [{
                                    title : i18n.t(100111/*标记项目*/),
                                    dataIndex : 'item',
                                    key : "item",
                                    width:'90%',
                                    render(data,row,index){
                                        return <div>{data?data.localName:''}</div>
                                    }
                                },{
                                    title : i18n.t(100148/*注释*/),
                                    dataIndex : 'itemTxt',
                                    key : "itemTxt",
                                    width:'90%',
                                    render(data,row,index){
                                        return data;
                                    }
                                
                                }]
                               
                           }
                            data={maitou}
                        />

                            
                </div>
                <div  className='col'>
                        <MeasureCommon  
                            menuList={[
                                {type:'add'},
                                {type:'delete'}
                                                                      
                            ]}                        
                            title={i18n.t(200875/*反倾销*/)} 
                            Zindex ={9}
                            openDialog={this.handleClick}
                             DialogTempalte ={require('./TraderulesDetailDialog').default}
                             showHeader ={true}
                             checkedRowsArray={[]}
                             getSelectArr={[]}
                             onSaveAndClose={this.fanqingxiaoSaveAndClose}
                             onCancel={this.onCancel}
                             AjaxInit={true}
                             id={'client-detail-fanqingxiao'}
                             API_FOODING={API_FOODING_DS}
                             portname={'/tradruleAntidump/getInit'}
                             params={{}}
                             columns ={
                                [{
                                    title : i18n.t(200565/*国家/地区*/),
                                    dataIndex : 'country',
                                    key : "country",
                                    width:'60%',
                                    render(data,row,index){
                                         return <div>{data?data.localName:''}</div>
                                    }
                                },{
                                    title : i18n.t(200876/*反倾销税率*/),
                                    dataIndex : 'antiDumpRuty',
                                    key : "antiDumpRuty",
                                    width:'40%',
                                    render(data,row,index){
                                        return data;
                                    }
                                },{
                                    title : i18n.t(100286/*生效日期*/),
                                    dataIndex : 'validDate',
                                    key : "validDate",
                                    width:'40%',
                                    render(data,row,index){
                                       return new Date(data).Format('yyyy-MM-dd');
                                    }
                                 },{
                                    title : i18n.t(500120/*终止日期*/),
                                    dataIndex : 'endDate',
                                    key : "endDate",
                                    width:'40%',
                                    render(data,row,index){
                                        return new Date(data).Format('yyyy-MM-dd');
                                    }
                                
                                }]
                               
                           }
                            data={fanqingxiao}
                        />

                        <MeasureCommon  
                            menuList={[
                                {type:'add'},
                                {type:'delete'},
                                {type:'edit'}                                        
                            ]}                        
                            title={i18n.t(200877/*税项*/)}
                            Zindex ={8}
                            openDialog={this.handleClick}
                             DialogTempalte ={require('./TraderulesDetailDialog').default}
                             showHeader ={true}
                             checkedRowsArray={[]}
                             getSelectArr={[]}
                             onSaveAndClose={this.shuixiangSaveAndClose}
                             onCancel={this.onCancel}
                             AjaxInit={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/price/getInit'}
                             id={'client-detail-shuixiang'}
                             params={{}}
                             columns ={
                                [{
                                    title : i18n.t(200878/*税类别*/),
                                    dataIndex : 'taxType',
                                    key : "taxType",
                                    width:'10%',
                                    render(data,row,index){
                                        return <div>{data?data.localName:''}</div>
                                    }
                                },{
                                    title : i18n.t(200879/*税小类*/),
                                    dataIndex : 'taxSubType',
                                    key : "taxSubType",
                                    width:'10%',
                                    render(data,row,index){
                                        return <div>{data?data.localName:''}</div>;
                                    }
                                },{
                                    title : i18n.t(200080/*类型*/),
                                    dataIndex : 'priceType',
                                    key : "priceType",
                                    width:'10%',
                                    render(data,row,index){
                                        return <div>{data?data.name:''}</div>;
                                    }
                                },{
                                    title : i18n.t(200880/*税率*/),
                                    dataIndex : 'taxRate',
                                    key : "taxRate",
                                    width:'20%',
                                    render(data,row,index){
                                        return data;
                                    }
                                },{
                                    title : i18n.t(200246/*金额*/),
                                    dataIndex : 'sum',
                                    key : "sum",
                                    width:'20%',
                                    render(data,row,index){
                                        return data;
                                    }
                                },{
                                    title : i18n.t(100284/*币种*/),
                                    dataIndex : 'curren',
                                    key : "curren",
                                    width:'10%',
                                    render(data,row,index){
                                        return <div>{data?data.localName:''}</div>;
                                    }
                                },{
                                    title : i18n.t(100169/*单位*/),
                                    dataIndex : 'unitofmea',
                                    key : "unitofmea",
                                    width:'10%',
                                    render(data,row,index){
                                        return <div>{data?data.localName:''}</div>
                                    }
                                }]
                               
                           }
                            data={shuixiang}
                        />
                </div>
					
				<Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
		                {commonForm}
		        </Dialog>
			</div>);
	}
}
export default TraderulesDetail;
