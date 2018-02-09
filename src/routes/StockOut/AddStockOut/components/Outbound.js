import React, { Component,PropTypes } from 'react';
import Measurement from  '../../../../components/RuleTemplate';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import Template1  from  '../../../Client/Detail/Content/components/Template1';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import {I18n} from '../../../../lib/i18n';
export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.getList = this.getList.bind(this);
        this.addBeforeSaveClick = this.addBeforeSaveClick.bind(this);
    }
    handleClick = (e, data, Template) => {
    	var that = this;
        if(data.number ==2){
        	 Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				    apiForm(API_FOODING_ERP,'/noticestock/mtl/delete',{id:data.record.billDtlId},(response)=>{
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
        		apiGet(API_FOODING_ERP,'/noticestock/mtl/getOne',{id:id},(response)=>{
					let DialogTempalte = require('./requireDialog').default;
					let element=React.createElement(DialogTempalte,
						{onSaveAndClose:that.onSaveAndClose,onCancel:that.onCancel,
							getOne:response.data,
							data:data
					});
					that.setState({
						dilogTelmp:element,
						visible:true,
	                   dialogTitle:dialogTitle
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
     addBeforeSaveClick(initAjax){
    	if(this.props.id){
    		initAjax();
    	}else{
    		this.props.getForm(true,initAjax);
    	}
    }
    onSaveAndClose(value){
        var that = this;
        
        value = Object.assign({},value,{billId:this.props.id});
        apiPost(API_FOODING_ERP,'/noticestock/mtl/save',value,(response)=>{
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
            dilogTelmp:<div></div>
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
    	apiGet(API_FOODING_ERP,'/noticestock/mtl/getList',{billId:this.props.id},(response)=>{
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
	               <div style={{backgroundColor:'#f0f4f8',marginTop:'10px'}}>
		               <div>
		                    <Measurement 
								menuList={[
									{type:'add'},
									{type:'delete'},
									{type:'edit'}                                        
								]}							
								onCancel ={this.onCancel} title ={I18n.t(500166/*出库明细*/)} openDialog={this.handleClick}
			                    onSaveAndClose={this.onSaveAndClose}
			                     addBeforeSaveClick={this.addBeforeSaveClick}
			                      DialogTempalte ={require('./requireDialog').default}
			               		 onCancel = {this.onCancel}
			                     id={'41'}
			                     showHeader ={true}
			                     menuItems={[0,1,2]}
								iconArray={[0,1,2]}
			                     columns ={
			                    	[{
										title : I18n.t(100379/*产品*/),
										dataIndex : 'mtl'+language,
										key : "mtlLcName",
										width : '18%',
										render(data,row,index){
											return (<div title={data}>{data}</div>)
										}
									},{
										title : I18n.t(100382/*产品规格*/),
										dataIndex : "basSpeci",
										key : "basSpeci",
										width : "25%",
										render(data,row,index){
											return (<div title={data} className={'text-ellipsis'}>{data}</div>)
										}
									},{
										title : I18n.t(500163/*出库数量*/),
										dataIndex : "qty",
										key : "qty",
										width : "18%",
										render(data,row,index){
											return (<div>{data?(data+' '+row.uomLcName):''}</div>)
										}
									},{
										title : I18n.t(500140/*已操作数量*/),
										dataIndex : "hasBeenQty",
										key : "hasBeenQty",
										width : "18%",
										render(data,row,index){
											return (<div>{data?(data+' '+row.uomLcName):''}</div>)
										}
									},{
										title : I18n.t(100312/*供应商*/),
										dataIndex : 'vndBe'+language,
										key : "vndBeLcName",
										width : "21%",
										render(data,row ,index){
											return data;
										}
									}]
			                    }
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
