import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import OnlyreadyRuleTemplate from  '../../../../../components/OnlyreadyRuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../../services/apiCall";
export class ProductDetail extends Component{

	constructor(props) {
        super(props);
		// init func 
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.getPage = this.getPage.bind(this);
		// init state 
		this.state = {
            visible:false, 
            dialogTitle:'',
            dilogTelmp:<div></div>,
        	productList:[], // 产品
            staffList:[], // 职员

		};

    }

    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
		this.getPage();
    }	
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }

    getPage(){
		// 产品
    	apiGet(API_FOODING_ERP,'/activity/mtl/getPage',{billId:this.props.id},
		(response)=>{
    		this.setState({
    			productList:response.data.data || [],
    		});
    	},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
    	});

		// 职员
    	apiGet(API_FOODING_ERP,'/activity/staff/getPage',{billId:this.props.id},
		(response)=>{
    		this.setState({
    			staffList:response.data.data || [],
    		});
    	},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
    	});
    }

    onSaveAndClose(values){
        console.log(values);
        this.setState({visible:false});
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
	               	<div style={{backgroundColor:'#f0f4f8',overflow:'hidden'}}>

						<div style={{overflow:'hidden'}}>
			                <div className='col' style={{padding:0,paddingRight:10}}>
								<OnlyreadyRuleTemplate  title ={'* 参展产品'}
								showHeader ={true}
								columns ={
									[{
									title : i18n.t(100379/*产品*/),
									dataIndex : 'mtl'+language,
									key :'mtl'+language,
									width : '40%',
									render(data,row,index){
										return (<div title={data}>{data}</div>);
									}
								},{
									title : i18n.t(200172/*产品分类*/),
									dataIndex : "mtlTy"+language,
									key : "mtlTy"+language,
									width : "30%",
									render(data,row,index){
										return (<div title={data}>{data}</div>);
									}
								},{
									title : i18n.t(100382/*产品规格*/),
									dataIndex : "basSpeci",
									key : "basSpeci",
									width : "30%",
									render(data,row,index){
										return (<div title={data}>{data}</div>);
									}
								}]
								}
								data={this.state.productList}
								/>
			                </div>
		               		<div className = 'col' style={{padding:0}}>
			               		  <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={'* 参与职员'} openDialog={this.handleClick}
				                     id={'36'}
				                     showHeader ={true}
						                    columns ={
					                    	[{
											title : i18n.t(400145/*职员*/),
											dataIndex :  'staff'+language,
											key : 'staff'+language,
											width : '30%',
											render(data,row,index){
												return (<div title={data}>{data}</div>);
											}
										},{
											title : i18n.t(200714/*工作内容*/),
											dataIndex : "workNote",
											key : "workNote",
											width : "70%",
											render(data,row,index){
												return (<div title={data}>{data}</div>);
											}
										}]
					                    }
					                    data={this.state.staffList}
				                   />
			            	</div>
			        	</div>

		                <div className = 'col' style={{paddingLeft:0}}>
		                	<Template1 
								menuList={[
									{type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
								]}							
								onCancel ={this.onCancel} isShowMenu={true} openDialog={this.handleClick} id={'4'} title={i18n.t(100140/*组织*/)} isShowMenu={false}  isShowIcon={false} tempArray={[{key:i18n.t(500143/*集团组织*/),value:this.props.getOne["cluster"+language]},{key:i18n.t(100244/*企业*/),value:this.props.getOne["cc"+language]},{key:i18n.t(200119/*销售组织*/),value:this.props.getOne["sor"+language]},{key:i18n.t(400011/*销售员*/),value:this.props.getOne["saleStaff"+language]}]}/>
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
