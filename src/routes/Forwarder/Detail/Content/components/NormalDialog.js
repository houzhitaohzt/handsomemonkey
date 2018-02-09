import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import RightKey from '../../../../../components/RightKey/RightKey';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../../../components/Select';
import DataTime from  '../../../../../components/Calendar/Calendar';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../../services/apiCall";
//引入弹层
import Dialog from '../../../../../components/Dialog/Dialog';
import {I18n} from '../../../../../lib/i18n';
import NameCheck from "../../../../../components/InputBoxCheck/NameCheck";
import fieldsFormat from '../../../../../common/FieldsFormat';
export class  NormalDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.data ={};
        this.state ={
        	clustersDate:[], //集团
        	companiesData:[] //企业
        }
        this.upload = this.upload.bind(this);
        this.nativeClick = this.nativeClick.bind(this);
        this.onCancelSecond = this.onCancelSecond.bind(this);
	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				that.props.onSaveAndClose(that.props.form.getFieldsValue(),that.data);
				that.props.form.resetFields();
			}
		})
	}
	onCancel(){
		let that = this;
		const {onCancel} = this.props;
		if(onCancel){
            onCancel();
            that.props.form.resetFields();
        }
	}
	upload(){
		this.onCancel();
		this.props.upload();
	}
	nativeClick = () => {
		let content=require('../../../../MenuSetting/components/MoreLanguageSetDialog').default;
		let element=React.createElement(content,{onSaveAndClose:this.upload,
			menusetView:this.props.initData.agnShipBe,
			apiHost:API_FOODING_DS,
			object:'agnShipBe',
			onCancel:this.onCancelSecond})
    	this.setState({
    		showDilaogsecond : true,
    		title: I18n.t(100496/*多语言配置*/),
    		dialogContent: element
    	})
	}
	onCancelSecond = () => {
		this.setState({
			showDilaogsecond:false
		})
	}
	componentDidMount(){
		// this.initCluster()
		// this.initCompany()
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {data,initData} = this.props;
		let {countryList,agnShipBe} = initData;
		let content;
		if(data.name.id == 'forwarder-detail-normal'){//货代公司详情常规
			let {agnShipBe,countrys} = initData;
			agnShipBe.country =agnShipBe.country || {};
		 	this.data = Object.assign({},agnShipBe,{title:'forwarder-detail-normal'})
           content =(
           	<div className={'girdlayout'} >
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{I18n.t(400158/*货代代码*/)}</label>		
                        <input type="text" disabled {...getFieldProps('code', {
                            initialValue:agnShipBe&&agnShipBe.code?agnShipBe.code:''
                        })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder=""/>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200562/*货代国家*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							isRequest={false}
							fieldName="cntryId"
							rules
							initValueOptions={countrys}
							initialValue={agnShipBe&&('country' in agnShipBe)?agnShipBe.country.id:''}
							className="col-md-9 col-lg-9"
						/>
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100001/*名称*/)}</label>		
						<NameCheck
							form={this.props.form}
							fieldName='name'
							rules={true}
							initialValue={agnShipBe&&agnShipBe.name?agnShipBe.name:''}
							className={'col-md-9 col-lg-9'}
						/>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100226/*英文名称*/)}</label>
						<NameCheck
							form={this.props.form}
							fieldName='enName'
							rules={true}
							isEnName={true}
							initialValue={agnShipBe&&agnShipBe.enName?agnShipBe.enName:''}
							className={'col-md-9 col-lg-9'}
						/>
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(100002/*描述*/)}</label>
						<input type="text" {...getFieldProps('description', {
                            initialValue:agnShipBe&&agnShipBe.description?agnShipBe.description:''
                        })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder=""/>
					</div>
				</div>
			</div>
           	);
		}else if(data.name.id == 'forwarder-detail-sign'){
			let agnShipBe = initData;
			this.data = Object.assign({},agnShipBe,{title:'forwarder-detail-sign'});
			content = (<div className={'girdlayout'} >
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100358/*税号*/)}</label>	
	                        <input type="text" {...getFieldProps('taxIdenSN', {
		                            initialValue:agnShipBe.taxIdenSN?String(agnShipBe.taxIdenSN):'',
									normalize: fieldsFormat.taxIdenSN
		                        })} className ={'col-md-9 col-lg-9 text-input-nowidth'} 
	                        />             
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100561/*法人代表*/)}</label>		
	                        <input type="text" {...getFieldProps('leglpsn', {
		                            initialValue:agnShipBe.leglpsn?agnShipBe.leglpsn:''
		                        })} 
		                        className ={'col-md-9 col-lg-9 text-input-nowidth'}
	                      	/>			                            
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100563/*成立日期*/)}</label>
							<div className={'col-md-9 col-lg-9 datetime'}>
								<DataTime 
								width={'100%'}  
								showTime = {false} 
								isShowIcon={true} 
								form={this.props.form} 
								name={'estabDate'} 
								value={agnShipBe.estabDate?new Date(agnShipBe.estabDate).Format('yyyy-MM-dd'):""}  
								validate={false} />
							</div>	                        			                            
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-5 col-lg-5'}>{i18n.t(100564/*注册资本*/)}</label>		
	                        <input type="text" {...getFieldProps('regCapital', {
		                            initialValue:agnShipBe.regCapital?agnShipBe.regCapital:'',
									rules: [{pattern: xt.pattern.positiveNonZero}],
		                        	})} 
	                        	className ={ getFieldError("regCapital") ?'col-md-7 col-lg-7 text-input-nowidth error-border':'col-md-7 col-lg-7 text-input-nowidth'} placeholder={""} 
	                        />		                           
						</div>
						<div className="form-group col-md-2 col-lg-2">
							<label className={'col-md-1 col-lg-1'}></label>		
	                       <ConstVirtualSelect
								form={this.props.form}
								fieldName="regCapitalCurrenId"
								apiType={apiPost}
								apiParams={'com.fooding.fc.ds.entity.Curren'}
								initValueOptions={agnShipBe&&agnShipBe.regCapitalCurren?[{id:agnShipBe.regCapitalCurren.id,localName:agnShipBe.regCapitalCurren.localName}]:[]}
								initialValue={agnShipBe&&agnShipBe.regCapitalCurren?agnShipBe.regCapitalCurren.id:''}
								className="col-md-11 col-lg-11"
						/>			                         
						</div>
					</div>
				</div>)
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
						
								{content}
							<Dialog width={976} visible={this.state.showDilaogsecond} title={this.state.title}>
								{this.state.dialogContent}
							</Dialog>	
				</FormWrapper>
			</div>
			);
	}
}
NormalDialog.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
NormalDialog.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const DialogFrom =createForm()(NormalDialog);
export default DialogFrom;
