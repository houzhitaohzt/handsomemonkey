import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
//引入弹层
// common
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import {ConstMiniSelect, Option} from '../../../../components/Select'; // 下拉
import xt from '../../../../common/xt'; // 下拉
// ajax
import {API_FOODING_DS, API_FOODING_ERP, apiGet, apiPost,} from '../../../../services/apiCall';
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
		this.addClick = this.addClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
	}
	deleteClick(i){
    	let priceArray=this.state.priceArray;
    	priceArray.splice(i, 1, null);
    	this.setState({
    		priceArray:priceArray
    	});
	}
	 initState() {
        return {
        	productArray:[],
            billDtlId: null,
            productData: {},
            priceArray:[]
        }
    }
    addClick(){
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
	componentWillReceiveProps (props){
		let {data} = props;
        let {billDtlId} = this.state;
        let record = data.number === 1 ? null : data.record;
        if (record && record.billDtlId !== billDtlId) {
            this.getEditOne(record.billDtlId);
        }
	}

	componentDidMount() {
      let that = this;
		apiGet(API_FOODING_ERP,'/productpricing/dtl/getList',
			{billId:this.props.otherData.getOne.billId},(response)=>{
				this.setState({
					priceArray:response.data.length>0?response.data:[{}]
				});
			},(error)=>{

		});
    }

    getEditOne = billDtlId => {
        if (!billDtlId) return;
        this.setState({billDtlId});
        apiGet(API_FOODING_ERP, '/productpricing/dtl/getOne', {id: billDtlId},
            response => {
                this.setState({businessOne: response.data, productData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

	onSaveAndClose(isAdd){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				if(this.props.data.number == 0){
					value = Object.assign({},this.state.productData,this.state.businessOne,value,{billId:this.props.otherData.getOne.billId});
				}else{
					value = Object.assign({},this.state.productData,value,{billId:this.props.otherData.getOne.billId})
				}
				apiPost(API_FOODING_ERP,'/productpricing/dtl/save',value,(response)=>{
						this.props.onSaveAndClose();
						this.props.form.resetFields();
						this.props.onCancel();
						ServiceTips({text:response.message,type:'sucess'});
						this.setState({...this.initState()});
				},(error)=>{
						ServiceTips({text:error.message,type:'error'});
				})
			}

    	});
	}
	onCancel(){
		this.props.form.resetFields();
		this.setState({...this.initState()}, this.props.onCancel);
	}
	render(){
		let that = this;
		let {data} = this.props;
		let initData = this.state.productData;
		const { getNFieldProps, getFieldProps, getFieldError,getFieldValue} = this.props.form;
		let content = <div></div>
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
			if(data.number == 0 || data.number == 1){
				content =(
						<div className={'  girdlayout'}>
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
			}
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
					<div className="scroll" style={{maxHeight:'300px',overflowY:'auto'}}>
						{content}
					</div>
			</FormWrapper>);
	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;
