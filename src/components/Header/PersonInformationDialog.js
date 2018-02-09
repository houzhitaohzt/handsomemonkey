import i18n from './../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../Form";
//引入select插件
import Select, { Option } from 'rc-select';
import {I18n} from '../../lib/i18n';
import WebData from '../../common/WebData';
import {apiGet, apiPost, apiForm, API_FOODING_DS} from '../../services/apiCall';
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
	}

	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onCancel: PropTypes.func,
		initData:PropTypes.object
	}

	initState(){
		return {
			initData:{},
			bumen:'',
			gawei:''
		}
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}
	componentDidMount(){
		// apiPost(API_FOODING_DS,'/object/getMiniList',
		// 	{obj:'com.fooding.fc.es.entity.Party',
		// 	 "queryParams":[{"attr":"id","expression":"=",
		// 	 "value":WebData.user.data.staff.organizationId}]},(response)=>{
		// 	 	this.setState({
		// 	 		bumen:response.data[0].localName
		// 	 	});
		// 	 },(error)=>{

		// 	 });
		// apiPost(API_FOODING_DS,'/object/getMiniList',
		// 	{obj:'com.fooding.fc.es.entity.Party',
		// 	 "queryParams":[{"attr":"id","expression":"=",
		// 	 "value":WebData.user.data.staff.positnId}]},(response)=>{
		// 	 	let gawei = response.data[0]?response.data[0].localName:'';
		// 	 	this.setState({
		// 	 		gawei:gawei
		// 	 	});
		// 	 },(error)=>{

		// });
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	render(){
		const {form,data} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		return (<FormWrapper showFooter={true}  onCancel={this.onCancel} showSaveClose={false}>
				<div className={'girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>用户名</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'} style={{fontSize:'14px'}}>{WebData.user?WebData.user.data.loginName:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100231/*姓名*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'} style={{fontSize:'14px'}}>{WebData.user?WebData.user.data.staff.localName:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100486/*公司*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'} style={{fontSize:'14px'}}>{WebData.user?WebData.user.data.staff.cluster.localName:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100238/*部门*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph shengyue'} style={{fontSize:'14px'}}>{WebData.user&&WebData.user.data.staff.organization?WebData.user.data.staff.organization.localName:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>岗位</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'} style={{fontSize:'14px'}}>{WebData.user&&WebData.user.data.staff.positn?WebData.user.data.staff.positn.localName:''}</p>
							</div>
						</div>
					</div>
				</div>
			</FormWrapper>);
	}
}

const PersonInformationView = createForm()(CommonForm);

export default PersonInformationView;

