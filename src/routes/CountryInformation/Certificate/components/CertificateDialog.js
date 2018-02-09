import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
import xt from '../../../../common/xt'; // 下拉
import Select, { Option,ConstVirtualSelect,ConstMiniSelect } from '../../../../components/Select';
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../../services/apiCall';
import Checkbox from '../../../../components/CheckBox';
import Tree ,{TreeNode} from 'rc-tree';
import Radio from '../../../../components/Radio';
import Input from '../../../../components/FormValidating/FormValidating';
import {I18n} from "../../../../lib/i18n";
export class CertificateDialog extends Component{
	constructor(props) {
		super(props);
		this.addSelect;
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.getData = this.getData.bind(this);
		this.onCheck = this.onCheck.bind(this);
		this.onExpand = this.onExpand.bind(this);
		this.state ={
			checkedKeys:[],
		    autoExpandParent: true,
		    expandedKeys: [],
		    info:{}
		}
		
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(this.props.num == 0){
					let params = this.props.form.getFieldsValue();
					delete params['id'];
					delete params['optlock'];
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				}this.props.form.resetFields();

				
			}
		})
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	onExpand(expandedKeys) {
	    console.log('onExpand', arguments);
	    this.setState({
	      expandedKeys,
	      autoExpandParent: false,
	    });
	}
	onCheck(checkedKeys) {
	    console.log(checkedKeys);
	    this.setState({
	      checkedKeys,
	    });
	}
	render(){
		const { getFieldProps, getFieldError , getNFieldProps} = this.props.form;
		let content = <div></div>;
		getFieldProps('dataTyId',{
									initialValue:10,
								});
		if(this.props.num == 0){
			getFieldProps('sourceId',{
									initialValue:this.props.sourceId,
			});
		    content=( 
		    	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100098/*证书*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Certfct' 
                                             fieldName="certifctId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 certifctId: da.id,
                                                 certifctLcName: da.localName,
                                                  certifctEnName:da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              allowClear
				                 	/>
							</div>
						</div>
					</div>
			</div>
			);
		}
		
		return (
			<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
	           {content}
			</FormWrapper>
			);
	}
}
const Certificate =createForm()(CertificateDialog);
export default Certificate;
