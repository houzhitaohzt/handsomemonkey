import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Measurement from  '../../../../components/RuleTemplate';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import Template1  from  '../../../Client/Detail/Content/components/Template1';
import Selle from "./Selle";


// ajax 
import ServiceTips from '../../../../components/ServiceTips';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../services/apiCall";


export class ProductDetail extends Component{

	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
       
		// init func 
		this.addBeforeSaveClick = this.addBeforeSaveClick.bind(this);
		this.handleProduct = this.handleProduct.bind(this);
		this.handlePersonnel = this.handlePersonnel.bind(this);
		

		// init state 
		this.state = {
            visible:false, 
            dialogTitle:'',
            initData:{},
            dilogTelmp:<div></div>,

			billId: '',  
			productData:{}, // 产品
			personnelData:{}, // 职员
		};


    }


    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }

 	addBeforeSaveClick(initAjax){

    	if(this.props.getOne.billId){
    		initAjax();
    	}else{
    		this.props.onSaveAndClose(initAjax);
    	}
    }

	// 产品 操作
    handleProduct = (e, data, Template) => {

		let that = this;
		if(data.number == 2){
			// 删除 
			if(data.selectArr.length>1){
				ServiceTips({text:i18n.t(500220/*不支持批量操作!*/),type:'error'});
			} else{
				Confirm('确认删除已选中的数据？', {
					done: () => {
						apiForm(API_FOODING_ERP,'/activity/mtl/delete',{id: data.selectArr[0].billDtlId},
							(response)=>{	
								ServiceTips({text:'成功！',type:'success'});
								that.props.productList();
							},(errors)=>{
								ServiceTips({text:errors.message,type:'error'});
						});
					}
				});	
			}
		} else if( data.number == 1 ){
			// 新增
			let dialogTitle= data.action+data.name.title;
			that.setState({
				visible:true,
				dialogTitle:dialogTitle,
				dilogTelmp:Template,
			});
		} else{
			// 编辑
			apiGet(API_FOODING_ERP,'/activity/mtl/getOne',{id:data.record.billDtlId},
				(response)=>{
					let dialogTitle= data.action+data.name.title;
					that.setState({
						productData:response.data,
						visible:true,
						dialogTitle:dialogTitle,
						dilogTelmp:Template,
					});
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});	
		} 

    }

	// 职员 操作
    handlePersonnel = (e, data, Template) => {

		let that = this;		
		if(data.number == 2){
			// 删除 
			if(data.selectArr.length>1){
				ServiceTips({text:i18n.t(500220/*不支持批量操作!*/),type:'error'});
			} else{
				Confirm('确认删除已选中的数据？', {
					done: () => {
						apiForm(API_FOODING_ERP,'/activity/staff/delete',{id: data.selectArr[0].billDtlId},
							(response)=>{	
								ServiceTips({text:'成功！',type:'success'});
								that.props.personnelList();
							},(errors)=>{
								ServiceTips({text:errors.message,type:'error'});
						});
					}
				});	
			}
		} else if( data.number == 1 ){
			// 新增
			let dialogTitle= data.action+data.name.title;
			this.setState({
				visible:true,
				dialogTitle:dialogTitle,
				dilogTelmp:Template,
			});
		} else{
			// 编辑
			apiGet(API_FOODING_ERP,'/activity/staff/getOne',{id:data.record.billDtlId},
				(response)=>{
					let dialogTitle= data.action+data.name.title;
					this.setState({
						productData:response.data,
						visible:true,
						dialogTitle:dialogTitle,
						dilogTelmp:Template,
					});
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});	
		} 
    }
  

    //保存产品
    onSaveAndClose(values){
        this.setState({visible:false});

		switch(values){
			case 1 :
				this.props.productList();	// 产品		
			break;
			case 2 :
				this.props.personnelList();	// 职员					
			break;
			default:
		}
		
    }
	onCancel(){
        this.setState({visible:false});
	}
	
    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 173:262;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }





	render(){


		const commonForm = this.state.dilogTelmp;
		return (
			<div>
				<div style={{backgroundColor:'#f0f4f8',overflow:'hidden',paddingTop:'10px'}}>
					<div className='col'style={{padding:0,paddingRight:'10px'}}>
						<Measurement 
							menuList={[
								{type:'add'},
								{type:'delete'},
								{type:'edit'}                                        
							]}						
							onCancel ={this.onCancel} 
							title ={i18n.t(200713/*参展产品*/)} 
							openDialog={this.handleProduct}
							id={''}
							addBeforeSaveClick = {this.addBeforeSaveClick}
							otherData = {this.props.getOne}
							
							onSaveAndClose={this.onSaveAndClose}
							onCancel = {this.onCancel}
							DialogTempalte ={require('../dialog/Product').default}
							showHeader ={true}
							columns ={
								[{
									title : i18n.t(100379/*产品*/),
									dataIndex : 'mtl'+language,
									key : "mtl"+language,
									width : '40%',
									render(data,row,index){
										return (<div title={data}>{data}</div>);
									}
								},{
									title : i18n.t(200172/*产品分类*/),
									dataIndex :"mtlTy"+language,
									key :"mtlTy"+language,
									width : "30%",
									render(data,row,index){
										return (<div title={data}>{data}</div>);
									}
								},{
									title : i18n.t(100382/*产品规格*/),
									dataIndex :"basSpeci",
									key :"basSpeci",
									width : "30%",
									render(data,row,index){
										return (<div title={data}>{data}</div>);
									}
								}]
							}
							data={this.props.productData}
							
						/>
					</div>
					<div className = 'col' style={{padding:0}}>
						<Measurement 
							menuList={[
								{type:'add'},
								{type:'delete'},
								{type:'edit'}                                        
							]}						
							title ={i18n.t(400143/*参与人员*/)}
							id={'36'}
							addBeforeSaveClick = {this.addBeforeSaveClick}
							otherData = {this.props.getOne}
							
							onSaveAndClose={this.onSaveAndClose}
							onCancel = {this.onCancel}							
							openDialog={this.handlePersonnel}
							DialogTempalte ={require('../dialog/Personnel').default}
							showHeader ={true}
							columns ={
								[{
									title : i18n.t(400145/*职员*/),
									dataIndex :  'staff'+language,
									key : 'staff'+language,
									width : '40%',
									render(data,row,index){
										return (<div title={data}>{data}</div>);
									}
								},{
									title : i18n.t(200714/*工作内容*/),
									dataIndex : "workNote",
									key : "workNote",
									width : "60%",
									render(data,row,index){
										return (<div title={data}>{data}</div>);
									}
								}]
							}
							data={this.props.personnelData}
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
