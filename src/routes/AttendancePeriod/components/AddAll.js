import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../components/Select';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Dialog from '../../../components/Dialog/Dialog';


import {apiGet,apiPost,apiForm,API_FOODING_HR,API_FOODING_ES,API_FOODING_DS} from '../../../services/apiCall';
import ServiceTips from "../../../components/ServiceTips";//提示框
import {I18n} from "../../../lib/i18n";
import xt from '../../../common/xt';


import WebData from '../../../common/WebData';





export class Productplug extends Component{
	
	constructor(props){
		super(props);
		let groupData = WebData.user.data.staff.cluster || {};

		// this state 
		this.state = {
			groupData:groupData, // 集团
			dataOne:{}, // getOne
		}; 

		
	}

	componentDidMount(){
		this.getPage(); 
    }

	componentWillUnmount() {
	}



	// 保存并关闭
	onSaveAndClose =()=> {
		let that = this;
		let {dataOne,groupData} = this.state;
		const {form,upload,onCancel,onSaveAndClose} = this.props;


		form.validateFields((errors, value) => {
			if(errors){
			}else{
				let params = Object.assign({},dataOne,value,{
					cluster:groupData,
				});


				apiPost(API_FOODING_HR,'/attendanceCycle/save',params,
					(response)=>{
						 ServiceTips({text:response.message,type:'success'});
						 upload();
						 that.props.form.resetFields();
						 that.onCancel();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				})
			}
		})
	}



	onCancel = ()=> {
		const {form, onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}

	// get one 
	getPage = ()=> {
		// let that = this;
		// let {checkedData} = this.props;	

		// if( !checkedData['id'] ) return;

		// apiGet(API_FOODING_HR,'/attendanceCycle/getOne',{id:checkedData['id']},
		// 	(response)=>{
		// 		that.setState({
		// 			dataOne: response['data']
		// 		});
		// 	},(errors)=>{
		// 		ServiceTips({text:errors.message,type:'error'});
		// });
	}



	render(){
		let that = this;
		let {dataOne,groupData} = this.state;
		let {checkedData,form} = this.props;
		const {getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;


		return (
			<div className="package-action-buttons">
				<FormWrapper
					showFooter={true}
					buttonLeft = {I18n.t(200043/*确定*/)}
					onSaveAndClose={this.onSaveAndClose}
					onCancel={this.onCancel}
					showSaveClose={this.props.showSaveClose}
					>
						<div className={'addnormal scroll'}>
							<div className={'girdlayout'}>
								<div className={'row'}>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(100243/*集团*/)}</label>
										<span>{groupData['localName']}</span>
									</div>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}><span>*</span>{I18n.t(100244/*企业*/)}</label>
										<ConstVirtualSelect form={this.props.form}
											apiHost={API_FOODING_ES}
											apiUri={'/party/getLoginCompanies'}
											apiParams={{clusId:groupData['id']}}
											
											fieldName="company"
                                    		initialValue={xt.initSelectValue(dataOne.company && dataOne.company.id , dataOne.company || {}, ['company'], 'localName', form, true)}
											valueKeys={da => ({
												...da,
												s_ignore_label: true
											})}
											rules={true}
											className ={'col-md-8 currency-btn select-from-currency'}
										/>
									</div>
								</div>					
								<div className={'row'}>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}><span>*</span>{I18n.t(400232/*年度*/)}</label>
										<ConstVirtualSelect
											form={this.props.form}
											apiType={apiGet}
											apiHost={API_FOODING_HR}
											apiUri={'/calendar/getYear'}
											fieldName="year"
											rules={true}
											apiParams={{obj:'com.fooding.fc.enumeration.AttendanceCycleType'}}
											className ={'col-md-8 currency-btn select-from-currency'}
											//initValueOptions={dataOne.year ? [String(dataOne.year)] : []}
											//initialValue={String( dataOne.year )}													
											valueKeys={da => String(da)}

										/>
									</div>

								</div>	


							</div>
						</div>
						<Dialog width={976} visible={this.state.showDilaogsecond} title={this.state.title}>
							{this.state.dialogContent}
						</Dialog>						
				</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(Productplug);
export default ProductForm;

