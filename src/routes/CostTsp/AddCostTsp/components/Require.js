import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Measurement from  '../../../../components/RuleTemplate';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import Template1  from  '../../../Client/Detail/Content/components/Template1';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.getList = this.getList.bind(this);
        this.addBeforeSaveClick = this.addBeforeSaveClick.bind(this);
    }
    addBeforeSaveClick(initAjax){
    	if(this.props.id){
    		initAjax();
    	}else{
    		this.props.getForm(true,initAjax);
    	}
    }
    handleClick = (e, data, Template) => {
    	var that = this;
        if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				    apiForm(API_FOODING_ERP,'/lsbeport/cost/delete',{id:data.record.billDtlId},(response)=>{
				    	ServiceTips({text:response.message,type:'sucess'});
				    	this.getList();
				    },(error)=>{
				    	ServiceTips({text:error.message,type:'error'});
				    })
				  }
		   	});
        }else{
        	let dialogTitle= data.action+data.name.title;
        	if(data.number == 0){
        		let id= data.record.billDtlId;
        		this.setState({
	        	 	visible:true,
	                dialogTitle:dialogTitle
	        	});
        		apiGet(API_FOODING_ERP,'/lsbeport/cost/getOne',{id:id},(response)=>{
					let DialogTempalte = require('./requireDialog').default;
					let element=React.createElement(DialogTempalte,
						{onSaveAndClose:that.onSaveAndClose,onCancel:that.onCancel,
							otherData:response.data,data:data
					});
					that.setState({
						dilogTelmp:element
					});
				},(error)=>{

				})
        	}else {
        		let DialogTempalte = require('./requireDialog').default;
				let element=React.createElement(DialogTempalte,
						{onSaveAndClose:that.onSaveAndClose,onCancel:that.onCancel,data:data});
	        	this.setState({
	        	 	visible:true,
	                dialogTitle:dialogTitle,
	                dilogTelmp:element
	        	});
        	}
        }
    }
    onSaveAndClose(value){
        var that = this;
        value = Object.assign({},value,{billId:this.props.id});
        apiPost(API_FOODING_ERP,'/lsbeport/cost/save',value,(response)=>{
        	ServiceTips({text:response.message,type:'sucess'});
        	that.getList();
        },(error)=>{
			ServiceTips({text:error.message,type:'error'});
        });
        this.setState({visible:false});
    }
	onCancel(){
        this.setState({visible:false});
	}
    initState(){
        return {
            visible:false, 
            dialogTitle:'',
            dilogTelmp:<div></div>,
            data:[]
        }
	}
    componentDidMount(){
        this.handleResize();
        if(this.props.id){
        	 this.getList();
        }
        window.addEventListener('resize', this.handleResize(20));
    }
    getList(){
    	var that = this;
    	apiGet(API_FOODING_ERP,'/lsbeport/cost/getList',{billId:this.props.id},(response)=>{
    		that.setState({
    			data:response.data
    		});
    	},(error)=>{

    	});
    }
    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 173:262;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }
	render(){
		const commonForm = this.state.dilogTelmp;
		return (
			  <div>
	               <div style={{backgroundColor:'#f0f4f8'}}>
		               <div style={{marginTop:'10px'}}>
		                    <Measurement 
								menuList={[
									{type:'add'},
									{type:'delete'},
									{type:'edit'}                                        
								]}							
								onCancel ={this.onCancel} title ={i18n.t(500124/*明细*/)} 
		                        openDialog={this.handleClick}
		                        addBeforeSaveClick={this.addBeforeSaveClick}
		                        DialogTempalte ={require('./requireDialog').default}
			                    onSaveAndClose={this.onSaveAndClose}
			               		onCancel = {this.onCancel}
			                    id={'45'}
			                    showHeader ={true}
			                    columns ={
			                    	[{
										title : i18n.t(500121/*费用名称*/),
										dataIndex : 'costlvtr'+language,
										key : "costlvtr"+language,
										width : '18%',
										render(data,row,index){
															return (<div title={data}>{data}</div>)
										}
									},{
										title : i18n.t(500122/*标准费用*/),
										dataIndex : "costAgg",
										key : "costAgg",
										width : "25%",
										render(data,row,index){
											return (<div>{data?(toDecimal(data)+' '+row.cnyLcName):''}</div>)
										}
									},{
										title : i18n.t(500088/*装箱类型*/),
										dataIndex : "packTyName",
										key : "packTyName",
										width : "18%",
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(100214/*箱型*/),
										dataIndex : "contnrTy"+language,
										key : "contnrTy"+language,
										width : "18%",
										render(data,row,index){
											return (<div>{data}</div>)
										}
									},{
										title : i18n.t(500123/*计算模式*/),
										dataIndex : 'chargeTyName',
										key : "chargeTyName",
										width : "21%",
										render(data,row ,index){
											return data;
										}
									}]
			                    }
			                    menuItems={[0,1,2]}
			                    iconArray={[0,1,2]}
			                    data={this.state.data}
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
export default ProductDetail;
