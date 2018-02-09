import React, {Component, PropTypes} from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
import Select, {Option, ConstVirtualSelect } from '../../../../components/Select';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import {I18n} from '../../../../lib/i18n';
//引入session数据
import WebData from '../../../../common/WebData';
class AddOrganization extends Component{
	constructor(props){
		super(props)
		this.state = this.initState();
	}
	initState(){
		return{
			ClustersData:[],//集团
			CompaniesData:[],//企业
			staffData:[] //分管人
		}
	}
	initCluster(){
		//init select country(初始化可选择集团信息)
		let ClustersData = this.state.ClustersData;
		apiGet(API_FOODING_ES,'/party/getLoginClusters',{},(response)=>{
			 ClustersData = response.data;
			this.setState({
				ClustersData:ClustersData
			})
		},(error)=>{

		})
	}
	initCompanyChange(e){
		//init select country(初始化可选择企业信息)
		let CompaniesData = this.state.CompaniesData;
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{},(response)=>{
			 CompaniesData = response.data;
			this.setState({
				CompaniesData:CompaniesData
			})
		},(error)=>{

		})
	}
	initStaff = (partyId) =>  {
		//init select(初始化集团分管人)
		let loginstaff = WebData.user.data.staff;
		partyId = partyId || loginstaff.ccid ;
		let staffData = this.state.staffData;
		apiGet(API_FOODING_ES,'/user/getListForPermissionsInParty',{typeAttributeIds:605,partyId:partyId},(response)=>{
			 staffData = response.data;
			this.setState({
				staffData:staffData
			})
		},(error)=>{

		})
	}
	//当集团数据改变，企业的选择数据就会不同
	clusterChange = (e) =>{
		//change select company(国家改变，可选择企业信息)
		let companiesData = this.state.companiesData;
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{id:e},(response)=>{
			this.props.form.setFieldsValue({"ccid": undefined,"staffIds": undefined});
			 companiesData = response.data;
			this.setState({
				companiesData:companiesData
			})
		},(error)=>{

		})
	}
	//当企业改变
	companyChange = (e) => {
		//change select company(企业改变，可选择分管人信息)
		this.props.form.setFieldsValue({"ccid": undefined,"staffIds": undefined});
		if(e.trim() === "") return;
		this.initStaff(e)
	}
	componentDidMount(){
		this.initCompanyChange();
		this.initCluster();
		this.initStaff(WebData.user.data.staff.ccid)
	}
	componentWillReceiveProps(nextPorps){

	}
	render(){
		const { getFieldProps, getFieldError } = this.props.form;
		const {ClustersData,CompaniesData, staffData} = this.state;
		let {valueone = {}} = this.props;
		let loginStaff = WebData.user.data.staff;
		return (<div className={'organization'}>
				<div className={'organization-title'}>
					<span className={'org'}>{I18n.t(100140/*组织*/)}</span>
				</div>
				<div className={'girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100243/*集团*/)}</label>
							<Select
								animation='slide-up'
								className ='currency-btn select-from-currency col-md-9 col-lg-9'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('clusId',{
									initialValue:valueone.cluster?valueone.cluster.id : (loginStaff.clusId? loginStaff.clusId:''),
									onChange:this.clusterChange
								})}
							>
								{
									ClustersData.map((e,i) =>{
										return (<Option key={i} value={String(e.id)} title={e.localName}>{e.localName}</Option>)
									})
								}
							</Select>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100486/*公司*/)}</label>
							<Select
								animation='slide-up'
								className ='currency-btn select-from-currency col-md-9 col-lg-9'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('ccid',{
									initialValue:valueone.company?valueone.company.id : (loginStaff && loginStaff.ccid? loginStaff.ccid:''),
									onChange:this.companyChange
								})}
							>
								{
									CompaniesData.map((e,i) =>{
										return (<Option key={i} value={String(e.id)} title={e.localName}>{e.localName}</Option>)
									})
								}
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100361/*分管人*/)}</label>
							 <ConstVirtualSelect
								form={this.props.form}
								pageSize={6}
								fieldName='staffIds'
								labelKey="staffLocalName"
								valueKeys='refId'
								isRequest={false}
								multi={true}
								initialValue={valueone.staffs?valueone.staffs.map(e => e.id):[JSON.stringify(valueone) === "{}"?WebData.user.data.staff.id:""]}
								initValueOptions={staffData}
								rules={true}
								className="col-md-9 col-lg-9"
							/>
						</div>
					</div>
				</div>
			</div>)
	}
}

const AddOrganizationForm = createForm()(AddOrganization);
export default AddOrganizationForm;
