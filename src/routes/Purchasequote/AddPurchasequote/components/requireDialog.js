import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option,ConstMiniSelect} from '../../../../components/Select';
import DataTime from  '../../../../components/Calendar/Calendar';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import ServiceTips from '../../../../components/ServiceTips';
import Calendar from  '../../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
export class AirPricePlug extends Component{
	constructor(props){
		super(props);
		this.state= this.initState(props);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.leixingClick=this.leixingClick.bind(this);
	   this.addClick = this.addClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
		this.planeIndex = 0;
	}
	deleteClick(i){
		let priceArray=this.state.priceArray;
    	priceArray.splice(i, 1, null);
    	this.setState({
    		priceArray:priceArray
    	});
	}
    addClick(i){
    	this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
		    	let that = this;
		    	let array = this.state.priceArray;
		    	array.push({});
		    	this.setState({
		    		priceArray:array
		    	})
			}
	      	
    	})
    }
	initState = (props = {}) =>{
		return {
			leixingArray:[],
			data:{},
			getOne: props.getOne || {},
			priceArray:[]
		}
	};
	leixingClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.ExeNumType'},
		(response)=>{
				that.setState({
					leixingArray:response.data
				})
		},(error)=>{

		});
	}
	componentDidMount(){
		let that = this;
		apiGet(API_FOODING_ERP,'/purquotation/price/getList',
			{billId:this.props.zhu.billId},(response)=>{
				this.setState({
					priceArray:response.data.length>0?response.data:[{}]
				});
			},(error)=>{

		});
	}
	onSaveAndClose(isAdd){
		let that = this;
		this.props.form.validateFields((error, value) => {
			
			if(error){
				console.log(error, value);
			}else{
				 value =Object.assign({},value,{billId:this.props.zhu.billId});
				 apiPost(API_FOODING_ERP,'/purquotation/price/save',value,(response)=>{
		        	ServiceTips({text:response.message,type:'sucess'});
		        	this.props.onSaveAndClose();
		        	that.onCancel();
		        },(error)=>{
					ServiceTips({text:error.message,type:'error'});
		        });
			}
	      	
    	});
	}
	onCancel(){
		this.setState({...this.initState()});
		this.props.form.resetFields();
		this.props.onCancel();
	}
	componentWillReceiveProps(props){
		if((props.getOne || {}).billDtlId !== (this.state.getOne || {}).billDtlId){
			
			this.setState({getOne: props.getOne||{}});
		}
		
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError,getFieldValue,getNFieldProps} = this.props.form;
		let {getTermModes,data} = this.props;
		let {getOne}= this.state;
		let initData = this.props.otherData ||{};
		let content = <div></div>;
		let common =<div></div>;
		let priceArray = this.state.priceArray;
		let lastIndex = -1;
		common=priceArray.map((e,i)=>{
			if( !e) return e;
			console.log(lastIndex);
			let obj =e.countType?{countTypeName:e.countTypeName,countType:e.countType}:{countTypeName:i18n.t(200953/*指定数值*/),countType:20}
			let comp = (<div className={'row'} key={i} style={{marginBottom:'10px'}}>
								 <div className="form-group col-xs-1 col-md-1">
						  		 </div>
								 <div className="form-group col-xs-2 col-md-2">
									<input type='text' className={getFieldError('priceRanges['+i+'].sNum')?
									     'col-xs-10 col-md-10 text-input-nowidth error-border':'col-xs-10 col-md-10 text-input-nowidth'} 
														placeholder=""
														{...getFieldProps('priceRanges['+i+'].sNum',{
															initialValue:(getFieldValue('priceRanges['+lastIndex+'].eNum')?getFieldValue('priceRanges['+lastIndex+'].eNum'):(e.sNum?e.sNum:0))
														})} 
										disabled
									/>
								</div>
								<div className="form-group col-xs-2 col-md-2">
									<input type='text' className={getFieldError('priceRanges['+i+'].eNum')?
													'col-xs-10 col-md-10 text-input-nowidth error-border':'col-xs-10 col-md-10 text-input-nowidth'} 
														placeholder=""
														{...getFieldProps('priceRanges['+i+'].eNum',{
															rules:[{required:true},(rule, value, callback) => {
																if(parseFloat(value) >
																	(getFieldValue('priceRanges['+(i-1)+'].eNum')?getFieldValue('priceRanges['+(i-1)+'].eNum'):0) 
																	&& parseFloat(value) >= 0 && ( !getFieldValue('priceRanges['+(i+1)+'].eNum')||parseFloat(value)<getFieldValue('priceRanges['+(i+1)+'].eNum')
																)){
																	   callback([]);
																} else callback([i18n.t(400102/*数量不能大于*/) + getFieldValue('priceRanges['+(i-1)+'].eNum')]);
															}],
															initialValue:e.eNum?e.eNum:''
														})} 
									/>
								</div>
								<div className="form-group col-xs-2 col-md-2">
									<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.enumeration.ExeNumType'}
			                                                 }} fieldName={'priceRanges['+i+'].countType'}
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(["countType"], obj,
			                                                 	 ['countType', 'countTypeName'], "countTypeName", this.props.form)
			                                                 }
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     countType: da.id,
			                                                     countTypeName: da.name,
			                                                     s_label: da.name
			                                                 }}>{da.name}</Option>}
			                            className ='currency-btn select-from-currency col-md-10 col-lg-10'							
			                       />
								</div>
								<div className="form-group col-xs-2 col-md-2">
									<input type='text' className={getFieldError('priceRanges['+i+'].convertValue')?'error-border col-xs-10 col-md-10 text-input-nowidth':
									'col-xs-10 col-md-10 text-input-nowidth'} 
														placeholder=""
														{...getFieldProps('priceRanges['+i+'].convertValue',{
															initialValue:e.convertValue?e.convertValue:'',
															rules: [{required:true}]
														})} 
													/>
								</div>
								<div className="form-group col-xs-3 col-md-3">
									<i className='foddingicon fooding-add-icon3' 
									onClick={this.addClick.bind(this,i)}></i>
									{  i==0?'':
										<i className='foddingicon fooding-delete-icon4'
									    style={{paddingLeft:'20px'}} onClick={this.deleteClick.bind(this,i)}></i>
									}
								</div>
							</div>
							)
			lastIndex = i;
			return comp;
		});
		//订单产品
				content =(
						<div className={'  girdlayout scorll'} style={{maxHeight: '300px',overflowY: 'auto'}}>						    
						  	<div className={'row'}>
						  		 <div className="form-group col-xs-1 col-md-1">
						  		 </div>
						  		 <div className="form-group col-xs-2 col-md-2">
						  		 	<label className={'col-xs-12 col-md-12'} style={{textAlign:'left'}}><span>*</span>{i18n.t(200939/*起始数值*/)}</label>
						  		 </div>
								  <div className="form-group col-xs-2 col-md-2">
						  		 	<label className={'col-xs-12 col-md-12'} style={{textAlign:'left'}}><span>*</span>{i18n.t(200940/*终止数值*/)}</label>
						  		 </div> 
						  		  <div className="form-group col-xs-2 col-md-2">
						  		 	<label className={'col-xs-12 col-md-12'} style={{textAlign:'left'}}><span>*</span>{i18n.t(200080/*类型*/)}</label>
						  		 </div>  
						  		  <div className="form-group col-xs-2 col-md-2">
						  		 	<label className={'col-xs-12 col-md-12'} style={{textAlign:'left'}}><span>*</span>{i18n.t(200954/*金额/比例*/)}</label>
						  		 </div>            
							</div>
							{common}
							
						</div>)
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} 
					onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(AirPricePlug);
export default ProductForm;