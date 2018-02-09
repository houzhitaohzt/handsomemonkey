import React, {PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
import Select, {Option ,ConstVirtualSelect } from '../../../../components/Select';

import xt from "../../../../common/xt";

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import {I18n} from '../../../../lib/i18n';

class ProductPrice extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);

	}
	static PropTypes={
		data:PropTypes.object,
		form:PropTypes.object,
		onSaveAndClose:PropTypes.func,
		onCancel:PropTypes.func,
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}

	initState(){
		return{

		}
	}

	//自动报价 保存并关闭
	onSaveAndClose(){
		let {onSaveAndClose, form} = this.props;
		form.validateFields((error,value) => {
			if(error){

			}else{
                apiForm(API_FOODING_DS,'/hotProductClassify/save',value,response => {
					ServiceTips({text:response.message,type:'success'});
					onSaveAndClose();
                },error => ServiceTips({text:error.message,type:'error'}))
			}
		})
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel()
		}
	}
	render(){
		const {getFieldProps, getFieldError} = this.props.form;
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
			<div className={'girdlayout'}>
				<div className="row">
					<div className="form-group col-md-12 col-lg-12">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(200172/*产品分类*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName="dataMulDiv2Id"
							rules
							apiType={apiPost}
							apiHost={API_FOODING_DS}
							apiParams="com.fooding.fc.ds.entity.DataMulDiv2"
							initValueOptions={[]}
							initialValue={undefined}
							className="col-md-5 col-lg-5"
						/>
					</div>
				</div>
			</div>
		</FormWrapper>);
	}
}

ProductPrice=createForm()(ProductPrice);

export default ProductPrice;
