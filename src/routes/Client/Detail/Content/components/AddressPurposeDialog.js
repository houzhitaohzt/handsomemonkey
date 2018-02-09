import i18n from './../../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';
//引入select插件
import {ConstMiniSelect, ConstVirtualSelect} from '../../../../../components/Select';
import {I18n} from '../../../../../lib/i18n';
import {API_FOODING_DS, apiPost} from "../../../../../services/apiCall";
import Checkbox from '../../../../../components/CheckBox';
import ServiceTips from '../../../../../components/ServiceTips';

import xt from '../../../../../common/xt'; // 下拉

class  AddressPurposeDialog extends Component{
	constructor(props){
		super(props);
	}
	onSaveAndClose = () => {
		let that = this;
		let newObj = {}
		const {form, onSaveAndClose,data,API_FOODING = API_FOODING_DS, initData, otherData } = that.props;
		newObj = Object.assign({},data.otherData,otherData);
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				let apiPortName = "/address/save";
				if(data.number == 0){
					let {address} = initData;
					value = Object.assign({},newObj,value,{id:address.id,optlock:address.optlock})
				}else if(data.number == 1){
					let arrBizFuncType = value.arrBizFuncType || [],isPass=false;
					for(let j = 0; j < arrBizFuncType.length; j++){
						if(arrBizFuncType[j].selected){
							isPass = true;
							break;
						}
					}
					if(!isPass) {
							ServiceTips({text:I18n.t(400153/*请至少选中一条地址类型*/),type:"error"});
							return false;
						}
					value = Object.assign({},newObj,value);
				}
				apiPost(API_FOODING,apiPortName,value,response => {
					ServiceTips({text:response.message,type:'success'});
					onSaveAndClose();
					this.props.form.resetFields();
				},error => ServiceTips({text:error.message,type:"error"}))
			}
		})
	}
	onCancel = () => {
		const {onCancel}=this.props;
        if(onCancel){
            onCancel();
            this.props.form.resetFields();
        }
	}
	componentDidMount(){
		//this.initGet(null,this.props.data)
	}
	componentWillReceiveProps(nextProps){

	}
	render(){
		let {form, data, initData} = this.props;
		const { getNFieldProps, getFieldError, getFieldProps, getFieldValue } = form;
		let {bizFuncTypes, initCountry = {},address = {} } = initData;
		initCountry = initCountry?initCountry:{};
		let dom;
		if(data.number == 1){
			dom = (<div className={'girdlayout scroll'} style={{height:"334px",overflow:'auto'}}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100087/*国家*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								apiType={apiPost}
								apiParams="com.fooding.fc.ds.entity.Country"
		                        fieldName="cntryId" rules
								initValueOptions={[initCountry]}
								initialValue={initCountry && initCountry.id}
		                    />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100535/*省/州*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={Boolean(getFieldValue("cntryId",initCountry&&initCountry.id))}
								refreshMark={getFieldValue("cntryId",initCountry&&initCountry.id)}
								apiParams={{"obj":'com.fooding.fc.ds.entity.Area',
									 "queryParams":[{"attr":"parentId","expression":"=","value":getFieldValue("cntryId",initCountry&&initCountry.id)}]
									}}
								apiType={apiPost}
		                        fieldName="provinceId"
								clearable
		                    />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100248/*市*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								apiType={apiPost}
								isRequest={Boolean(getFieldValue('provinceId'))}
								refreshMark={getFieldValue('provinceId')}
								apiParams={{"obj":'com.fooding.fc.ds.entity.Area',
								"queryParams":[{"attr":"parentId","expression":"=","value":getFieldValue('provinceId')}]
								}}
		                        fieldName="cityId" clearable
		                    />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100249/*区县*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								apiType={apiPost}
								isRequest={Boolean(getFieldValue("cityId"))}
								refreshMark={getFieldValue("cityId")}
								apiParams={{"obj":'com.fooding.fc.ds.entity.Area',
									"queryParams":[{"attr":"parentId","expression":"=","value":getFieldValue("cityId")}]}
								}
		                        fieldName="districtId"
								clearable={true}
		                    />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}><span>*</span>{I18n.t(100250/*详细地址*/)}</label>
							<input type='text'
								className ={getFieldError('name')?'col-md-10 col-lg-10 text-input-nowidth error-border':'col-md-10 col-lg-10 text-input-nowidth'}
								{...getFieldProps('name',
		                            {
		                            	validateFirst: true,
										rules: [{required:true,}],
		                                initialValue:String(address.name || '')
		                        })}
		                    />
						</div>
					</div>
					<div className='row'>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100251/*邮编*/)}</label>
							<input type='text'
								className ={'col-md-8 col-lg-8 text-input-nowidth'}
								{...getFieldProps('zip',
		                            {
		                                initialValue:String(address.zip || '')
		                        })}
		                    />
						</div>
					</div>
					<div className={'row'} style={{border:'1px solid #ccc',borderRadius:'6px',margin:"0px 5px 0px 80px"}}>
						<div className={'row'} style={{backgroundColor:"#f8f6f9",borderBottom:"1px solid #ccc"}}>
							<div className="form-group col-xs-12 col-md-12">
								<label className={'col-xs-2 col-md-2'} style={{color:"#9facbd"}}>{I18n.t(400154/*是否选中*/)}</label>
								<label className={'col-xs-2 col-md-2'} style={{color:"#9facbd"}}>{I18n.t(100547/*地址类型*/)}</label>
								<label className={'col-xs-8 col-md-8'} style={{textAlign:"center",color:"#9facbd"}}>{I18n.t(100123/*默认*/)}</label>
							</div>
						</div>
						<div className={'row'}>
							{
								bizFuncTypes.map((e,i) => {
									return (
										<div className="form-group col-xs-12 col-md-12" key={i}>
											<label className={'col-xs-2 col-md-2'}>
												<input type="hidden" {...getFieldProps("arrBizFuncType[" + i + "].id" ,{
														initialValue:e.id
													})} />
												<Checkbox
													{...getFieldProps("arrBizFuncType[" + i + "].selected" ,{
														initialValue: false
													})}
													checked={this.props.form.getFieldValue("arrBizFuncType[" + i + "].selected")}
												/>
											</label>
											<label className={'col-xs-2 col-md-2'}>{e.name}</label>
											<label className={'col-xs-8 col-md-8'} style={{textAlign:'center'}}>
												<Checkbox
													{...getFieldProps("arrBizFuncType[" + i + "].defMark" ,{
														initialValue: false
													})}
													checked={this.props.form.getFieldValue("arrBizFuncType[" + i + "].defMark")}
												/>
											</label>
										</div>
									)
								})
							}
						</div>
					</div>
				</div>)
		}else if(data.number == 0){
			dom = (<div className={'girdlayout scroll'}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100087/*国家*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								apiParams="com.fooding.fc.ds.entity.Country"
		                        fieldName="cntryId"
								apiType={apiPost}
		                        initValueOptions={address.cntryId ?[address.country]: []}
		                        rules
								initialValue={address.cntryId}
		                    />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100535/*省/州*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={Boolean(getFieldValue("cntryId",address.cntryId))}
								refreshMark={getFieldValue("cntryId",address.cntryId)}
								apiType={apiPost}
								apiParams={{"obj":'com.fooding.fc.ds.entity.Area',
									 "queryParams":[{"attr":"parentId","expression":"=","value":getFieldValue("cntryId",address.cntryId)}]}}
		                        fieldName="provinceId"
								clearable={true}
								initValueOptions={address.provinceId? [address.province] : []}
								initialValue={address.provinceId &&
								address.cntryId === getFieldValue("cntryId",address.cntryId) ? address.provinceId: undefined}
		                    />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100248/*市*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={Boolean(getFieldValue("provinceId",address.provinceId))}
								refreshMark={getFieldValue("provinceId",address.provinceId)}
								apiType={apiPost}
								apiParams={{"obj":'com.fooding.fc.ds.entity.Area',
									 "queryParams":[{"attr":"parentId","expression":"=","value":getFieldValue("provinceId",address.provinceId)}]}}
		                        fieldName="cityId"
								clearable={true}
								initValueOptions={address.cityId? [address.city] : []}
								initialValue={address.cityId &&
								address.cntryId === getFieldValue("cntryId",address.cntryId) &&  address.provinceId === getFieldValue("provinceId",address.provinceId)? address.cityId: undefined}
		                    />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100249/*区县*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={Boolean(getFieldValue("cityId",address.cityId))}
								refreshMark={getFieldValue("cityId",address.cityId)}
								apiType={apiPost}
								apiParams={{"obj":'com.fooding.fc.ds.entity.Area',
									 "queryParams":[{"attr":"parentId","expression":"=","value":getFieldValue("cityId",address.cityId)}]}}
		                        fieldName="districtId"
								clearable={true}
								initValueOptions={address.district? [address.district] : []}
								initialValue={address.districtId &&
								address.cntryId === getFieldValue("cntryId",address.cntryId) &&  address.provinceId === getFieldValue("provinceId",address.provinceId) && address.cityId === getFieldValue("cityId",address.cityId)? address.districtId: undefined}
		                    />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}><span>*</span>{I18n.t(100250/*详细地址*/)}</label>
							<input type='text'

								className ={getFieldError('name')?'col-md-10 col-lg-10 text-input-nowidth error-border':'col-md-10 col-lg-10 text-input-nowidth'}
								{...getFieldProps('name',
		                            {
		                            	validateFirst: true,
										rules: [{required:true,}],
		                                initialValue:String(address.name || '')
		                        })}
		                    />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100251/*邮编*/)}</label>
							<input type='text'
								className ={'col-md-8 col-lg-8 text-input-nowidth'}
								{...getFieldProps('zip',
		                            {
		                                initialValue:String(address.zip || '')
		                        })}
		                    />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100547/*地址类型*/)}</label>
							<ConstMiniSelect
								form={this.props.form}
								pbj="com.fooding.fc.enumeration.BizFuncType"
		                        fieldName="bizFuncTypeId"
		                        initValueOptions={[]}
		                        reles={true}
								optionValue={(da, di) => <Option key={di} objValue={{
									bizFuncTypeId: da.id,
									s_label: da.name
								}}>{da.localName}</Option>}
								initialValue={
				                xt.initSelectValue(address.bizFuncTypeId, {bizFuncTypeId:address.bizFuncTypeId, localName:address.bizFuncType.name},
								 ['bizFuncTypeId'], 'localName', this.props.form)}
		                        className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
		                    />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100123/*默认*/)}</label>
							<Checkbox
								{...getFieldProps("dfutMrk" ,{
									initialValue: address.dfutMrk || false
								})}
								checked={this.props.form.getFieldValue("dfutMrk")}
							/>
						</div>
					</div>
				</div>)
		}
		return(
			<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
				{dom}
			</FormWrapper>
			);
	}
}
AddressPurposeDialog.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
AddressPurposeDialog.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const AddressPurposeForm =createForm()(AddressPurposeDialog);
export default AddressPurposeForm;


/**/


/*<div className="address-use-dialog">
<div className="up">
<div className="head">
	<div className="scroll address-scroll">
		    {
		    	[{id:"1",name:i18n.t(500049*//*收货地址*//*),dfutMrk:false},{id:'2',name:i18n.t(200428*//*文件地址*//*),dfutMrk:true}].map((e,i)=>{
		    		return(
		    			<ul key={i}>
	           			<li>
	           				<input type="hidden" {...getFieldProps("bizFuncType[" + i + "].id" ,{
									initialValue:e.id
								})} />
							<Checkbox
								{...getFieldProps("bizFuncType[" + i + "].dfutMrk" ,{
									initialValue:e.dfutMrk || false
								})}
								checked={this.props.form.getFieldValue("bizFuncType[" + i + "].dfutMrk")}
							/>
	           				{e.name}
	           			</li>
	           			<li>
							<Checkbox
								{...getFieldProps("bizFuncType[" + i + "].defaultMark" ,{
									initialValue:e.defaultMark || false
								})}
								checked={this.props.form.getFieldValue("bizFuncType[" + i + "].defaultMark")}
							/>
	           			</li>
	           		</ul>
		    		)
		    	})
   		}
	</div>
</div>
</div>
</div>*/

/*
	<div className={'row'}>
		<div className="form-group col-xs-6 col-md-6">
			<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100481*//*地址*//*)}</label>
			<ConstMiniSelect
				form={this.props.form}
				pbj="com.fooding.fc.ds.entity.Country"
				fieldName="cntryId"
				initValueOptions={initCountry&&initCountry.id?[{id:initCountry.id,name:initCountry.localName,localName:initCountry.localName,s_lable:initCountry.localName}]:[]}
				reles={true}
				allowClear={true}
				initialValue={ initCountry&&initCountry.id || undefined}
				className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
			/>
		</div>
		<div className="form-group col-xs-6 col-md-6">
			<label className={'col-xs-4 col-md-4'}>{I18n.t(100481*//*地址*//*)}</label>
			<ConstMiniSelect
				form={this.props.form}
				isRequest={Boolean(getFieldValue("cntryId",initCountry&&initCountry.id))}
				refreshMark={getFieldValue("cntryId",initCountry&&initCountry.id)}
				pbj={{
					params:{"obj":'com.fooding.fc.ds.entity.Area',
						"queryParams":[{"attr":"parentId","expression":"=","value":getFieldValue('cntryId',initCountry&&initCountry.id)}]}
					}}
				fieldName="provinceId"
				initValueOptions={[]}
				reles={false}
				allowClear={true}
				initialValue={ String('')}
				className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
			/>
		</div>
	</div>
	<div className={'row'}>
		<div className="form-group col-xs-6 col-md-6">
			<label className={'col-xs-4 col-md-4'}>{I18n.t(100481*//*地址*//*)}</label>
			<ConstMiniSelect
				form={this.props.form}
				isRequest={Boolean(getFieldValue("provinceId"))}
				refreshMark={getFieldValue("provinceId")}
				pbj={{
					params:{"obj":'com.fooding.fc.ds.entity.Area',
						"queryParams":[{"attr":"parentId","expression":"=","value":getFieldValue('provinceId')}]}
					}}
				fieldName="cityId"
				initValueOptions={[]}
				reles={false}
				allowClear={true}
				initialValue={ String('')}
				className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
			/>
		</div>
		<div className="form-group col-xs-6 col-md-6">
			<label className={'col-xs-4 col-md-4'}>{I18n.t(100249*//*区县*//*)}</label>
			<ConstMiniSelect
				form={this.props.form}
				isRequest={Boolean(getFieldValue("cityId"))}
				refreshMark={getFieldValue("cityId")}
				pbj={{
					params:{"obj":'com.fooding.fc.ds.entity.Area',
						"queryParams":[{"attr":"parentId","expression":"=","value":getFieldValue('cityId')}]}
					}}
				fieldName="districtId"
				initValueOptions={[]}
				reles={false}
				allowClear={true}
				initialValue={ String('')}
				className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
			/>
		</div>
	</div>
	<div className={'row'}>
		<div className="form-group col-xs-6 col-md-6">
			<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100481*//*地址*//*)}</label>
			<input type='text'
				className ={getFieldError('name')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
				placeholder={I18n.t(100481*//*地址*//*)}
				{...getFieldProps('name',
					{
						validateFirst: true,
						rules: [{required:true,}],
						initialValue:''
				})}
			/>
		</div>
		<div className="form-group col-xs-6 col-md-6">
			<label className={'col-xs-4 col-md-4'}>{I18n.t(100251*//*邮编*//*)}</label>
			<input type='text'
				className ={'col-md-8 col-lg-8 text-input-nowidth'}
				placeholder={I18n.t(100251*//*邮编*//*)}
				{...getFieldProps('zip',
					{
						initialValue:''
				})}
			/>
		</div>
	</div>
*/
