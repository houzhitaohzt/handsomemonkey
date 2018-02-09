import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
import Checkbox from '../../../../components/CheckBox';
import {I18n} from '../../../../lib/i18n';
// common
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, {Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select'; // 下拉
import xt from '../../../../common/xt'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../../services/apiCall';

import AreaCountry from '../../../Common_component/AreaCountry'; // 国家 地区 


class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		// this.productChange = this.productChange.bind(this);
	    this.productSelect = this.productSelect.bind(this);
		this.state=this.initState();
	}
	 initState() {
        return {
        	productArray:[],
            billDtlId: null,
            productData: {},
        }
    }
	productSelect(key){
		for(var i=0;i<this.state.productArray.length;i++){
			if(this.state.productArray[i].id == key){
				// this.props.form.setFieldsValue({title:this.state.productArray[i].localName});
				return this.state.productArray[i].localName;
			}
		}
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
        let {data} = this.props;
        // this.productChange();
        if (data.number !== 1 && data.record) {
            this.getEditOne(data.record.billDtlId);
        }
    }

    getEditOne = billDtlId => {
        if (!billDtlId) return;
        this.setState({billDtlId});
        apiGet(API_FOODING_ERP, '/productpricing/policy/getOne', {id: billDtlId},
            response => {
                this.setState({businessOne: response.data, productData: response.data});
            }, error => {
                // errorTips(error.message);
            });
    };

	onSaveAndClose(isAdd){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				if(this.props.data.number == 0){
					value = Object.assign({},this.state.businessOne,value,{billId:this.props.otherData.getOne.billId});
				}else{
					value = Object.assign({},value,{billId:this.props.otherData.getOne.billId})
				}
				delete value.key;
				delete value.title;
				apiPost(API_FOODING_ERP,'/productpricing/policy/save',value,(response)=>{
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
		let beFieldValue = this.props.form.getFieldValue("title")|| {};
		let obj = Object.assign({},initData,{id:initData.countryId,localName:initData.countryLcName,name:initData.countryEnName});
		let content = <div></div>

		let countriesValue= [xt.initSelectValue(initData["country"+language], obj, ['id', 'localName', 'name'],"localName", this.props.form)];
		content =(
						<div style={{height:'330px'}} className={'girdlayout scroll'}>
						  	<div className={'row'}>
                                <div className="form-group col-xs-12 col-md-12">
                                    <label className={'col-xs-2 col-md-2'}><span>*</span>{i18n.t(100087/*国家*/)}</label>
									<div className="col-md-10">
										<AreaCountry 
											form={this.props.form}
											fieldName='countries'
											defaultValue={countriesValue}
											rules={true}
											disabled={initData.billDtlId?true:false}
										/>
									</div>

                                    {/*<ConstVirtualSelect form={this.props.form}
                                                        apiType={apiPost}
                                                        apiParams='com.fooding.fc.ds.entity.Country'
                                                        fieldName="countries"
                                                        initRequest
                                                        multi rules
                                                        initialValue={countriesValue}
                                                        valueKeys={da => (da)}
                                                        disabled={initData.billDtlId?true:false}
                                                        className ={'col-md-10 col-lg-10'}
                                    />*/}

                                </div>
							</div>
							<div className='row'>
								 <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}><span>*</span>{i18n.t(200955/*国家定价*/)}</label>
													<ConstMiniSelect form={this.props.form}
															style ={{float:'left'}}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.enumeration.ExeNumType'}
			                                                 }} fieldName="countryType"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["countryType"], initData, ['countryType', 'countryTypeName'], "countryTypeName", this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     countryType: da.id,
			                                                     countryTypeName: da.name,
			                                                     s_label: da.name
			                                                 }}>{da.name}</Option>}
                                                                     reles={true}
			                                                 className ='currency-btn select-from-currency col-md-3 col-lg-3'
			                                		/>
			                                		<div className='col-md-1 col-lg-1'>
			                                		</div>
													 <input type='text'
															className={getFieldError('countryValue')?'error-border col-xs-6 col-md-6 text-input-nowidth':
																'col-xs-6 col-md-6 text-input-nowidth'}
															placeholder=""
															{...getFieldProps('countryValue',{
																initialValue:initData.countryValue?initData.countryValue:'',
																rules: [{required:true}]
															})}
													 />
												</div>
							</div>
							<div className={'row'}>
								 <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}><span>*</span>{i18n.t(200956/*终端客户定价*/)}</label>
													<ConstMiniSelect form={this.props.form}
															style ={{float:'left'}}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.enumeration.ExeNumType'}
			                                                 }} fieldName="beType"
			                                                 initValueOptions={[]}
                                                                     reles={true}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["beType"], initData, ['beType', 'beTypeName'], "beTypeName", this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     beType: da.id,
			                                                     beTypeName: da.name,
			                                                     s_label: da.name
			                                                 }}>{da.name}</Option>}
			                                                 className ='currency-btn select-from-currency col-md-3 col-lg-3'
			                                		/>
			                                		<div className='col-md-1 col-lg-1'>
			                                		</div>
													 <input type='text'
															className={getFieldError('beValue')?'error-border col-xs-6 col-md-6 text-input-nowidth':
																'col-xs-6 col-md-6 text-input-nowidth'}
															placeholder=""
															{...getFieldProps('beValue',{
																initialValue:initData.beValue?initData.beValue:'',
																rules: [{required:true}]
															})}
													 />
												</div>
							</div>
							<div className='row'>
								 <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}><span>*</span>{i18n.t(200957/*贸易公司定价*/)}</label>
													<ConstMiniSelect form={this.props.form}
															style ={{float:'left'}}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.enumeration.ExeNumType'}
			                                                 }} fieldName="ccType"
			                                                 initValueOptions={[]}
                                                                     reles={true}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["ccType"], initData, ['ccType', 'ccTypeName'], "ccTypeName", this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     ccType: da.id,
			                                                     ccTypeName: da.name,
			                                                     s_label: da.name
			                                                 }}>{da.name}</Option>}
			                                                 className ='currency-btn select-from-currency col-md-3 col-lg-3'
			                                		/>
			                                		<div className='col-md-1 col-lg-1'>
			                                		</div>
			                                		<input type='text'
														className={getFieldError('ccValue')?'error-border col-xs-6 col-md-6 text-input-nowidth':
															'col-xs-6 col-md-6 text-input-nowidth'}
														placeholder=""
														{...getFieldProps('ccValue',{
															initialValue:initData.ccValue?initData.ccValue:'',
															rules: [{required:true}]
														})}
                                     				/>
												</div>
							</div>
						</div>);
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
					<div  className="scroll ">
						{content}
					</div>
			</FormWrapper>);
	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;
