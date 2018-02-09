import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';
//引入select插件
import {ConstMiniSelect, Option} from '../../../../../components/Select';
//引入时间插件

import {API_FOODING_ES, apiGet} from "../../../../../services/apiCall";

export class  OrigizationDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.data ={};
        this.state ={
        /*	clustersDate:[], //集团
        	companiesData:[], //企业
        	staffData:[] //分管人*/
        }
	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				onSaveAndClose(that.props.form.getFieldsValue(),that.data);
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

/*	initCluster(){
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
	//当企业改变
	companyChange = (e) => {
		//change select company(企业改变，可选择分管人信息)
		let staffData = this.state.staffData;
		apiGet(API_FOODING_ES,'/user/getListForPermissionsInParty',{partyId:e,partyTypeId:30},(response)=>{
			this.props.form.setFieldsValue({"staffIds": undefined});
			 staffData = response.data;
			this.setState({
				staffData:companiesData
			})
		},(error)=>{

		})
	}
	componentDidMount(){
		this.initCluster()
		this.initCompany()
	}*/
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
		let {data,initData} = this.props;
		let partyTypeId = data.name.allData.key == "customer"?601:605;
		this.data = Object.assign({},initData,{title:"orginzation"});
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:initData? initData.optlock:''
			})
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:initData? initData.id:''
			})
		debugger
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>	
					<div className={'  girdlayout'} >
					 	<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{data.name.data[0].key}</label>
								<ConstMiniSelect form={this.props.form}
								 pbj={{
									apiType:apiGet,
									 host:API_FOODING_ES,
									 uri: '/party/getLoginClusters',
									 params:{}
								}} fieldName="clusterId"
		                             initValueOptions={[{id:initData&&initData.cluster?initData.cluster.id:'',name:initData&&initData.cluster?initData.cluster.localName:''}]}
		                             reles={true}
		                             initialValue={initData&&initData.cluster?initData.cluster.id:''}
		                             className ={ 'currency-btn select-from-currency col-md-9 col-lg-9'}
		                        />		                            
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{data.name.data[1].key}</label>
								<ConstMiniSelect form={this.props.form}
									 pbj={{
										apiType:apiGet,
										 host:API_FOODING_ES,
										 uri: '/party/getLoginCompanies',
										 params:{id:getFieldValue('clusterId',initData&&initData.cluster?initData.cluster.id:'')}
									}} fieldName="ccid"
			                             initValueOptions={[{id:initData&&initData.company?initData.company.id:'',name:initData&&initData.company?initData.company.localName:''}]}
			                             reles={true}
			                             initialValue={initData&&initData.company?initData.company.id:''}
			                             className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
		                        />
							</div>							
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{data.name.data[2].key}</label>
								<ConstMiniSelect form={this.props.form}
									 pbj={{
										apiType:apiGet,
										 host:API_FOODING_ES,
										 uri: '/party/getPartysByType',
										 params:{typeAttributeIds:44,partyId:getFieldValue('ccid',initData&&initData.company?initData.company.id:'')}
									}} fieldName="departmentId"
			                             initValueOptions={[{id:initData&&initData.department?initData.department.id:'',name:initData&&initData.department?initData.department.localName:''}]}
			                             reles={true}
			                             initialValue={initData&&initData.department?initData.department.id:''}
			                             className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
		                        />
							</div>							
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{data.name.data[3].key}</label>
								<ConstMiniSelect form={this.props.form} 
									isRequest={Boolean(getFieldValue("departmentId",initData&&initData.department?initData.department.id:''))}
									refreshMark={getFieldValue("departmentId",initData&&initData.department?initData.department.id:'')} 
									 pbj={{
										apiType:apiGet,
										 host:API_FOODING_ES,
										 uri: '/user/getListForPermissionsInParty',
										 params:{typeAttributeIds:partyTypeId,partyId:getFieldValue("departmentId",initData&&initData.department?initData.department.id:'')}
									}} fieldName="staffIds"
										props={{tags: true}}
			                             initValueOptions={initData&&initData.staffs?initData.staffs.map(e => ({refId:e.id,staffLocalName:e.localName})): []}
			                              reles={true}
			                               optionValue={(da, di) => <Option key={di} value={ da.refId }>{da.staffLocalName}</Option>}
			                             initialValue={initData&&initData.staffs?initData.staffs.map(e => e.id): []}
			                             className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
		                        />	                            
							</div>
						</div>
				 	</div>						
				</FormWrapper>
			</div>
			);
	}
}
OrigizationDialog.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
OrigizationDialog.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const DialogFrom =createForm()(OrigizationDialog);
export default DialogFrom;
