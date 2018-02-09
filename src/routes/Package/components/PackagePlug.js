import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option } from '../../../components/Select';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';
import {I18n} from "../../../lib/i18n";
import AddMoreLanguage from "../../../components/AddMoreLanguage"; 
import {apiGet, apiPost, apiForm, language, API_FOODING_ERP, API_FOODING_DS, API_FOODING_ES} from '../../../services/apiCall';
export class PackagePlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.state=this.initState();
		this.caizhiClick = this.caizhiClick.bind(this);
		this.jiliangdanweiClick = this.jiliangdanweiClick.bind(this);
	}
	initState(){
		return {
			caizhiArray:[],
			jiliangdanweiArray:[]
			
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
				if(this.props.DialogContent == 1){
					let params = this.props.form.getFieldsValue();
					delete params['id'];
					delete params['optlock'];
					delete params['nameValues'];
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				}this.props.form.resetFields();

				
			}
		})
	}
	//材质
	caizhiClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Textur'},
		
			(response)=>{
				that.setState({
					caizhiArray:response.data
				})
		},(error)=>{

		});
	}
	jiliangdanweiClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Unitofmea'},
		
			(response)=>{
				that.setState({
					jiliangdanweiArray:response.data
				})
		},(error)=>{

		});
	}
	onSaveAdd(){
		this.onSaveAndClose(true);
	}
	onCancel(){
		const {form, onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		let {checkedData,info} = this.props;
		info = info || {};
		info.dataTypes = info.dataTypes || [];
		info.storOperts = info.storOperts || [];
		info.texturs = info.texturs || [];
		info.unitofmeas = info.unitofmeas || [];
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100029/*材质*/)}</label>
								<Select
											animation='slide-up'
											
											onClick={this.caizhiClick}
											className ={ getFieldError("texturId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
											optionLabelProp="children"
											{...getFieldProps('texturId',{
												validateFirst: true,
												rules: [{required:true}],
												initialValue:undefined
											})}
											allowClear
										>
											{
												this.state.caizhiArray.map((e,i)=>{
												return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
												})
											}
										</Select> 
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100030/*规格单位*/)}</label>
								<Select
											animation='slide-up'
											
											onClick={this.jiliangdanweiClick}
											className ={ getFieldError("lenUomId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
											optionLabelProp="children"
											{...getFieldProps('lenUomId',{
												validateFirst: true,
												rules: [{required:true}],
												initialValue:undefined
											})}
											allowClear
										>
											{
												this.state.jiliangdanweiArray.map((e,i)=>{
												return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
												})
											}
										</Select> 
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100031/*规格长*/)}</label>
								<Input form={this.props.form} obj={{name:'lenNum',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100032/*规格宽*/)}</label>
								<Input form={this.props.form} obj={{name:'widNum',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100033/*规格高*/)}</label>
								<Input form={this.props.form} obj={{name:'higNum',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100034/*容积单位*/)}</label>
								<Select
											animation='slide-up'
											
											onClick={this.jiliangdanweiClick}
											className ={ getFieldError("volUomId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
											optionLabelProp="children"
											{...getFieldProps('volUomId',{
												validateFirst: true,
												rules: [{required:true}],
												initialValue:undefined
											})}
											allowClear
										>
											{
												this.state.jiliangdanweiArray.map((e,i)=>{
												return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
												})
											}
										</Select> 
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100035/*容积量*/)}</label>
								<Input form={this.props.form} obj={{name:'volNum',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100036/*承重单位*/)}</label>
								<Select
											animation='slide-up'
											
											onClick={this.jiliangdanweiClick}
											className ={ getFieldError("wtUomId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
											optionLabelProp="children"
											{...getFieldProps('wtUomId',{
												validateFirst: true,
												rules: [{required:true}],
												initialValue:undefined
											})}
											allowClear
										>
											{
												this.state.jiliangdanweiArray.map((e,i)=>{
												return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
												})
											}
										</Select> 
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100038/*承重*/)}</label>
								<Input form={this.props.form} obj={{name:'lodWtNum',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100039/*自重*/)}</label>
								<Input form={this.props.form} obj={{name:'netWtNum',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{I18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('description', {
						                                initialValue:''
						                    })} className={'col-md-9 col-lg-9 text-input-nowidth'}/>
								</div>
						</div>
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:checkedData?checkedData.id:''
			})
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:checkedData?checkedData.optlock:''
			})
			getFieldProps('nameValues', {
							            	validateFirst: true,
						                    initialValue:checkedData?checkedData.nameValues:''
			})
			getFieldProps('name',{
						validateFirst: true,
						initialValue:checkedData? checkedData.name:''
			})
			   content = (
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text', 
										initialValue:checkedData?checkedData.code:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text', 
										initialValue:checkedData?checkedData.localName:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
								<AddMoreLanguage 
								    menusetView={checkedData}
								    object = {'packaging'}
								    upload={this.props.upload}
								    onCancel ={this.onCancel}
								     isShowId={true}
							    />
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{I18n.t(100029/*材质*/)}</label>
								<Select
											animation='slide-up'
											
											onClick={this.caizhiClick}
											className ={ getFieldError("texturId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
											optionLabelProp="children"
											{...getNFieldProps('texturId',{
												validateFirst: true,
												rules: [{required:true}],
												initialValue:checkedData.textur?{s_label:checkedData.textur.name,texturId:checkedData.textur.id}:undefined
											})}
											allowClear
										>
											{
												this.state.caizhiArray.map((e,i)=>{
												return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
												})
											}
										</Select> 
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100030/*规格单位*/)}</label>
								<Select
											animation='slide-up'
											
											onClick={this.jiliangdanweiClick}
											className ={ getFieldError("lenUomId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
											optionLabelProp="children"
											{...getNFieldProps('lenUomId',{
												validateFirst: true,
												rules: [{required:true}],
												initialValue:checkedData.unitofmea?{s_label:checkedData.unitofmea.name,lenUomId:checkedData.unitofmea.id}:undefined

											})}
											allowClear
										>
											{
												this.state.jiliangdanweiArray.map((e,i)=>{
												return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
												})
											}
										</Select> 
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100031/*规格长*/)}</label>
								<Input form={this.props.form} obj={{name:'lenNum',type:'text', 
										initialValue:checkedData?checkedData.lenNum:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100032/*规格宽*/)}</label>
								<Input form={this.props.form} obj={{name:'widNum',type:'text', 
										initialValue:checkedData?checkedData.widNum:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100033/*规格高*/)}</label>
								<Input form={this.props.form} obj={{name:'higNum',type:'text', 
										initialValue:checkedData?checkedData.higNum:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100034/*容积单位*/)}</label>
								<Select
											animation='slide-up'
											
											onClick={this.jiliangdanweiClick}
											className ={ getFieldError("volUomId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
											optionLabelProp="children"
											{...getNFieldProps('volUomId',{
												validateFirst: true,
												rules: [{required:true}],
												initialValue:checkedData.volume?{s_label:checkedData.volume.name,volUomId:checkedData.volume.id}:undefined
											})}
											allowClear
										>
											{
												this.state.jiliangdanweiArray.map((e,i)=>{
												return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
												})
											}
										</Select> 
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100035/*容积量*/)}</label>
								<Input form={this.props.form} obj={{name:'volNum',type:'text', 
										initialValue:checkedData?checkedData.volNum:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100036/*承重单位*/)}</label>
								<Select
											animation='slide-up'
											
											onClick={this.jiliangdanweiClick}
											className ={ getFieldError("wtUomId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
											optionLabelProp="children"
											{...getNFieldProps('wtUomId',{
												validateFirst: true,
												rules: [{required:true}],
												initialValue:checkedData.weight?{s_label:checkedData.weight.name,wtUomId:checkedData.weight.id}:undefined
											})}
											allowClear
										>
											{
												this.state.jiliangdanweiArray.map((e,i)=>{
												return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
												})
											}
										</Select> 
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100038/*承重*/)}</label>
								<Input form={this.props.form} obj={{name:'lodWtNum',type:'text', 
										initialValue:checkedData?checkedData.lodWtNum:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100039/*自重*/)}</label>
								<Input form={this.props.form} obj={{name:'netWtNum',type:'text', 
										initialValue:checkedData?checkedData.netWtNum:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{I18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('description', {
						                                initialValue:checkedData?checkedData.description:''
						                    })} className={'col-md-9 col-lg-9 text-input-nowidth'}/>
								</div>
						</div>
					</div>
			</div>
			)
		}else if(this.props.DialogContent==5){
			content = (
				<div className={'girdlayout scroll'} style={{overflow:'auto'}}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100000/*代码*/)}</label>
							<div className={'col-xs-9 col-md-9'}>
								<p>{checkedData?checkedData.code:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100001/*名称*/)}</label>
							<div className={'col-xs-9 col-md-9'}>
								<p>{checkedData?checkedData.localName:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100029/*材质*/)}</label>
							<div className={'col-xs-9 col-md-9'}>
								<p>{checkedData.textur?checkedData.textur.localName:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100030/*规格单位*/)}</label>
							<div className={'col-xs-9 col-md-9'}>
								<p>{checkedData.unitofmea?checkedData.unitofmea.localName:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100031/*规格长*/)}</label>
							<div className={'col-xs-9 col-md-9'}>
								<p>{checkedData?checkedData.lenNum:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100032/*规格宽*/)}</label>
							<div className={'col-xs-9 col-md-9'}>
								<p>{checkedData?checkedData.widNum:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100033/*规格高*/)}</label>
							<div className={'col-xs-9 col-md-9'}>
								<p>{checkedData?checkedData.higNum:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100034/*容积单位*/)}</label>
							<div className={'col-xs-9 col-md-9'}>
								<p>{checkedData.volume?checkedData.volume.localName:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100035/*容积量*/)}</label>
							<div className={'col-xs-9 col-md-9'}>
								<p>{checkedData?checkedData.volNum:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100036/*承重单位*/)}</label>
							<div className={'col-xs-9 col-md-9'}>
								<p>{checkedData.weight?checkedData.weight.localName:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100038/*承重*/)}</label>
							<div className={'col-xs-9 col-md-9'}>
								<p>{checkedData?checkedData.lodWtNum:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100039/*自重*/)}</label>
							<div className={'col-xs-9 col-md-9'}>
								<p>{checkedData?checkedData.netWtNum:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100002/*描述*/)}</label>
							<div className={'col-xs-9 col-md-9'}>
								<p>{checkedData?checkedData.description:''}</p>
							</div>
						</div>
					</div>
				</div>
			)
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper 
					showFooter={true} 
					buttonLeft = {this.props.buttonLeft} 
					onSaveAndClose={this.onSaveAndClose} 
					onCancel={this.onCancel}
					onSaveAdd={this.onSaveAdd}
					showSaveAdd={this.props.showSaveAdd}
					showSaveClose={this.props.showSaveClose}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(PackagePlug);
export default ProductForm;
