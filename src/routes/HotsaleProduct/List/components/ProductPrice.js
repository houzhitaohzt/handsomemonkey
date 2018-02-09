import React, {PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
import Select, {Option ,ConstVirtualSelect } from '../../../../components/Select';

import xt from "../../../../common/xt";

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import {I18n} from '../../../../lib/i18n';
import {ProductFind} from '../../../../components/FindGridSelect';

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
    productClick = (callback) => {
		apiPost(API_FOODING_DS,"/object/getMiniList",{obj:"com.fooding.fc.ds.entity.PlatformMaterial"},response => {
			let arr = response.data || undefined;
			callback(arr);
		},error => ServiceTips({text:error.message,type:'error'}))
	}

	//自动报价 保存并关闭
	onSaveAndClose(){
		let {onSaveAndClose, form} = this.props;
		form.validateFields((error,value) => {
			if(error){

			}else{
                apiForm(API_FOODING_DS,'/platformHotMaterial/save',value,response => {
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
						<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100379/*产品*/)}</label>
						<ProductFind
							form={this.props.form}
							apiUri='/platformMaterial/search'
							fieldName="mtlId"
							// productClick={this.productClick}
							rules={true}
							width={'280%'}
							initialValue = {undefined}
							valueKeys={ da => ({
                                mtlId:da.id,
								s_label:da.localName
							})}
							titleClass={'col-md-8 col-lg-8'}
							isSearch={false}
						/>

					</div>
				</div>
			</div>
		</FormWrapper>);
	}
}

ProductPrice=createForm()(ProductPrice);

export default ProductPrice;

{/*<ConstVirtualSelect*/}
	{/*form={this.props.form}*/}
	{/*fieldName="mtlId"*/}
	{/*rules*/}
	{/*apiType={apiPost}*/}
	{/*apiHost={API_FOODING_DS}*/}
	{/*apiParams="com.fooding.fc.ds.entity.PlatformMaterial"*/}
	{/*initValueOptions={[]}*/}
	{/*initialValue={undefined}*/}
	{/*className="col-md-5 col-lg-5"*/}
{/*/>*/}
