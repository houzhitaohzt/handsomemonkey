import React, { Component,PropTypes } from 'react';
import RightKey from '../../../../../components/RightKey/RightKey';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect,ConstMiniSelect } from '../../../../../components/Select';
import Calendar from  '../../../../../components/Calendar/Calendar';
import Checkbox from '../../../../../components/CheckBox';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../../services/apiCall";
import Input from '../../../../../components/FormValidating/FormValidating';
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
        this.initCluster=this.initCluster.bind(this);
        this.initCompany=this.initCompany.bind(this);
        this.clusterChange=this.clusterChange.bind(this);
        this.state ={
        	clustersDate:[], //集团
        	companiesData:[] //企业
        }
        this.data = null;
        this.upload = this.upload.bind(this);
        this.nativeClick = this.nativeClick.bind(this);
        this.onCancelSecond = this.onCancelSecond.bind(this);
	}
	initCluster(){
		//init select cluster(初始化可选择集团信息)
		let clustersDate = this.state.clustersDate;
		apiGet(API_FOODING_ES,'/party/getLoginClusters',{},(response)=>{
			 clustersDate = response.data;
			this.setState({
				clustersDate:clustersDate
			})
		},(error)=>{

		})
	}
	initCompany(){
		//init select company(初始化可选择企业信息)
		let companiesData = this.state.companiesData;
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{},(response)=>{
			 companiesData = response.data;
			this.setState({
				companiesData:companiesData
			})
		},(error)=>{

		})
	}
	upload(){
		this.onCancel();
		this.props.upload();
	}
	nativeClick = () => {
		let content=require('../../../../MenuSetting/components/MoreLanguageSetDialog').default;
		let element=React.createElement(content,{onSaveAndClose:this.upload,
			menusetView:this.props.initData.serbBe,
			apiHost:API_FOODING_DS,
			object:'servBe',
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
	//当集团数据改变，企业的选择数据就会不同
	clusterChange(e){
		//change select company(国家改变，可选择企业信息)
		let companiesData = this.state.companiesData;
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{id:e},(response)=>{
			this.props.form.setFieldsValue({"ccid": undefined});
			 companiesData = response.data;
			this.setState({
				companiesData:companiesData
			})
		},(error)=>{

		})
	}
	componentDidMount(){
		//this.initCluster()
		//this.initCompany()
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
		let {data,initData} = this.props;
		let {clustersDate,companiesData} = this.state;
		let content;
		if(data.name.id == 'servBe-detail-normal'){//表示服务机构详情常规
			let {servBe,countrys} = initData;
			servBe.country = servBe.country ||{};
			//servBe = initData;
			this.data = Object.assign({},servBe,{title:"servBe-detail-normal"});
			content=(<div className={'girdlayout'}>
					<input type="hidden" {...getFieldProps('id', {
                                initialValue:servBe&&('id' in servBe)?servBe.id:''
                            })} />
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100339/*服务机构代码*/)}</label>		
                            <input type="text" {...getFieldProps('code', {
                            	validateFirst: true,
								rules: [{required:true,}],
                                initialValue:servBe&&('code' in servBe)?servBe.code:''
                            })} className ={ getFieldError("code") ?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'} placeholder={""}/>         
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100087/*国家*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={false}
								fieldName="cntryId"
								rules
								initValueOptions={countrys}
								initialValue={servBe&&('country' in servBe)?servBe.country.id:''}
								className="col-md-9 col-lg-9"
							/>                          
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100001/*名称*/)}</label>	
							<NameCheck
								form={this.props.form}
								fieldName='name'
								rules={true}
								initialValue={servBe&&servBe.name?servBe.name:''}
								className={'col-md-9 col-lg-9'}
							/>					
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100226/*英文名称*/)}</label>	
							<NameCheck
								form={this.props.form}
								fieldName='enName'
								rules={true}
								isEnName={true}
								initialValue={servBe&&servBe.enName?servBe.enName:''}
								className={'col-md-9 col-lg-9'}
							/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100002/*描述*/)}</label>						
                            <input type="text" {...getFieldProps('description', {
                                initialValue:servBe&&('description' in servBe)?servBe.description:''
                            })} className ={'col-md-9 col-lg-9 text-input-nowidth'} />
						</div>
					</div>						
			</div>)
		}else if(data.name.id == 'servBe-detail-signInformation'){//表示服务机构注册信息
			
			let servBe = initData;
		let taxIdenSN = getFieldProps('taxIdenSN', {
            normalize: fieldsFormat.taxIdenSN,
            initialValue:servBe.taxIdenSN?String(servBe.taxIdenSN):''
        });

        let taxIdenComp = <input type="text" value={taxIdenSN.value} onChange={(...args)=>taxIdenSN.onChange(...args)}
                                 className ={ getFieldError("taxIdenSN") ?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'} placeholder=""/>;
			this.data = Object.assign({},servBe,{title:"servBe-detail-signInformation"});
			content=(<div className={'  girdlayout'}>
					<input type="hidden" {...getFieldProps('id', {
                                initialValue:servBe&&('id' in servBe)?servBe.id:''
                            })} />
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100358/*税号*/)}</label>		
                            {taxIdenComp}         
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100561/*法人代表*/)}</label>
							<input type="text" {...getFieldProps('leglpsn', {
                                initialValue:servBe.leglpsn?servBe.leglpsn:''
                            })} className ={'col-md-9 col-lg-9 text-input-nowidth'} placeholder={""}/>		                            
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100563/*成立日期*/)}</label>			
                            <div className={'col-md-9 col-lg-9 datetime'}>
								<Calendar 
									width={'100%'}  
									showTime = {false} 
									isShowIcon={true} 
									form={this.props.form}
									validate={false}
									className ={getFieldError('estabDate')?'error-border':''}
									name={'estabDate'}
									value={servBe.estabDate?new Date(servBe.estabDate).Format('yyyy-MM-dd'):""}										
								/>
                            </div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-5 col-lg-5'}>{I18n.t(100564/*注册资本*/)}</label>		
	                        <input type="text" {...getFieldProps('regCapital', {
		                            initialValue:servBe.regCapital?servBe.regCapital:'',
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
								initValueOptions={servBe&&servBe.regCapitalCurren?[{id:servBe.regCapitalCurren.id,localName:servBe.regCapitalCurren.localName}]:[]}
								initialValue={servBe&&servBe.regCapitalCurren?servBe.regCapitalCurren.id:''}
								className="col-md-11 col-lg-11"
						/>			                         
						</div>
					</div>					
			</div>)
		}else if(data.name.id == '33'){
			let commonInit = initData;
			this.data = Object.assign({},commonInit,{title:"orginzation"});
			content=(<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100243/*集团*/)}</label>		
                            <ConstMiniSelect form={this.props.form}
								 pbj={{
									apiType:apiGet,
									 host:API_FOODING_ES,
									 uri: '/party/getLoginClusters',
									 params:{}
								}} fieldName="clusterId"
		                             initValueOptions={[{id:commonInit&&commonInit.cluster?commonInit.cluster.id:'',name:commonInit&&commonInit.cluster?commonInit.cluster.localName:''}]}
		                             reles={true}
		                             initialValue={commonInit&&commonInit.cluster?commonInit.cluster.id:''}
		                             className ={ 'currency-btn select-from-currency col-md-9 col-lg-9'}
		                        />
							        
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100486/*公司*/)}</label>
							<ConstMiniSelect form={this.props.form}
							refreshMark={getFieldValue("clusterId",commonInit.cluster.id) ||getFieldValue('clusterId')}
								pbj={{
										apiType:apiGet,
										 host:API_FOODING_ES,
										 uri: '/party/getLoginCompanies',
										 params:{clusId:getFieldValue('clusterId',commonInit&&commonInit.cluster?commonInit.cluster.id:'') || getFieldValue('clusterId') }

									}} fieldName="ccid"
			                            reles={true}
			                            initialValue={xt.initSelectValue(commonInit.company.id && getFieldValue('clusterId',commonInit.cluster.id) == commonInit.cluster.id, commonInit.company, ['id'], 'localName', this.props.form)}
										 className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
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
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.data);
				this.props.form.resetFields();
			}
		})
	}
	onCancel(){
		const {onCancel}=this.props;
        if(onCancel){
            onCancel();
            this.props.form.resetFields();
        }
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

/*
<Select
	animation='slide-up'
	placeholder={""}
	className ={ getFieldError("cntryId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
	choiceTransitionName="rc-select-selection__choice-zoom"
	optionLabelProp="children"
	{...getFieldProps('cntryId',{
		validateFirst: true,
		rules: [{required:true}],
		initialValue:serbBe&&('country' in serbBe)?serbBe.country.id:''
	})}
>
	{
		countrys.map((e,i) =>{
			return (<Option key={i} value={e.id} title={e.name}>{e.name}</Option>)
		})
	}
</Select>		  
*/
