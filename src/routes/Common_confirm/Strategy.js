import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../components/Form";
import i18n from './../../lib/i18n';

import ServiceTips from '../../components/ServiceTips'; // 提示
import {pageSize,sizeList,apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,getQueryString} from '../../services/apiCall';


import AreaCountry from '../Common_component/AreaCountry';
import {I18n} from "../../lib/i18n"; // 国家 地区


class PageDIV extends Component{
	constructor(props){
		super(props);

		this.state = {
			dataOne:{country:{}}, // get one
		}

	}

	componentDidMount(){
		this.getPage(); 

	}

	// get one 
	getPage = ()=> {
		let that = this;
		let {checkedData} = this.props;

		if( !checkedData['id']  ) return;

		apiGet(API_FOODING_DS,'/countryPricePolicy/getOne',{id:checkedData['id']},
			(response)=>{
				that.setState({
					dataOne: response.data
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	onSaveAndClose = ()=> {
		let that = this;
		let {dataOne} = this.state;
		let {form,getPage,onSaveAndClose} = this.props;

		form.validateFields((errors, value) => {
			if(errors){
			}else{
				let param = Object.assign({},{id:dataOne['id'],companyMtlId:getQueryString('id')},dataOne,value);

				apiPost(API_FOODING_DS,'/countryPricePolicy/save',param,
					(response)=>{
						ServiceTips({text:response.message,type:'success'});
						that.onCancel();
						getPage();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});	
			}
		})
	}

	onCancel = ()=> {
		this.props.onCancel();
		this.props.form.resetFields();
	}

	render(){
		let that = this;
		let {dataOne} = this.state;
		let {getFieldProps,getFieldError,getNFieldProps} = this.props.form;
		let {checkedData} = this.props;

		return (
			<div className="package-action-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
					<div className={'addnormal'} style={{marginBottom:'10px'}}>
						<div className={'girdlayout scroll'} style={{height:'298px',maxHeight:'298px'}}>						
							<div className={'row'}>
								<div className="form-group col-md-12">
									<label className={'col-md-3'}><span>*</span>{i18n.t(100087/*国家*/)}</label>
									<div className={'col-md-8'}>
										<AreaCountry 
											form={this.props.form}
											fieldName='cntryId'
											defaultValue={checkedData['id'] ? [{id:dataOne.country['id'],localName:dataOne.country['localName']}] : []}
											rules={true}
											disabled={ checkedData['id'] ? true : false}
										/>
									</div>
								</div>							
							</div>							

							<div className={'row'}>
								<div className="form-group col-md-12">
									<label className={'col-md-3'}><span>*</span>{i18n.t(200956/*终端客户定价*/)}(%)</label>
									<div className={'col-md-8'}>
										<input  
											style={{width:'100%'}}
											{...getFieldProps('beValue',{
												rules: [{required:true,pattern:xt.pattern.positiveNonZero}],								
												initialValue:dataOne['beValue'] || ''
											})}
											className={getFieldError("beValue") ?'text-input-nowidth error-border':'text-input-nowidth'} 
										/>
									</div>
								</div>							
							</div>
							<div className={'row'}>
								<div className="form-group col-md-12">
									<label className={'col-md-3'}><span>*</span>{i18n.t(200957/*贸易公司定价*/)}(%)</label>
									<div className={'col-md-8'}>
										<input  
											style={{width:'100%'}}
											{...getFieldProps('ccValue',{
												rules: [{required:true,pattern:xt.pattern.positiveNonZero}],								
												initialValue:dataOne['ccValue'] || ''
											})}
											className={getFieldError("ccValue") ?'text-input-nowidth error-border':'text-input-nowidth'} 
										/>
									</div>
								</div>							
							</div>
                            <div className={'row'}>
                                <div className="form-group col-md-12">
                                    <label className={'col-md-3'}><span>*</span>{I18n.t(100488/*其他*/)}{I18n.t(100486/*公司*/)}{i18n.t(600292/*定价*/)}(%)</label>
                                    <div className={'col-md-8'}>
                                        <input
                                            style={{width:'100%'}}
                                            {...getFieldProps('ocValue',{
                                                rules: [{required:true,pattern:xt.pattern.positiveNonZero}],
                                                initialValue:dataOne['ocValue'] || ''
                                            })}
                                            className={getFieldError("ocValue") ?'text-input-nowidth error-border':'text-input-nowidth'}
                                        />
                                    </div>
                                </div>
                            </div>
						</div>
					</div>
				</FormWrapper>
			</div>
		)
	}
}

export default createForm()(PageDIV);







