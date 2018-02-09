import React,{Component, PropTypes} from "react";
import {createForm,FormWrapper} from "../../../components/Form";
// common 
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../components/Select'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language} from '../../../services/apiCall';
import {I18n} from "../../../lib/i18n";
import DataTime from '../../../components/Calendar/Calendar';

class ClientcontactFilterHeader extends Component{

	constructor(props){
		super(props);

		this.handleCertificate = this.handleCertificate.bind(this);
		this.searchFunc = this.searchFunc.bind(this);
		this.resetFunc = this.resetFunc.bind(this);		
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search = this.search.bind(this);
		this.clear = this.clear.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
		// this.state
		this.state = {
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',

			certificate: [{id:1,localName:''}],
			certifct: ''			
		};
	}

	static propTypes={
		expand:PropTypes.bool,
		expandFilter:PropTypes.func,
		initData:PropTypes.object
	}
	search(){
		this.props.getPage();
	}
	clear(){
		this.props.form.resetFields();
		this.props.getPage();
	}
	getForm(){
		return this.props.form.getFieldsValue();
	}
	static defaultProps={
		expand:false,
		expandFilter(){},
		showFilter:'comb-panel',
		expandClassName:'unfold',
		minor:'filter-header-information-pre hidden'
	}

	show_hide_filter(){
		let classN;
		if(this.state.showFilter==="comb-panel"){
			classN="comb-panel-floating";
		}else{
			classN="comb-panel";
		}
		this.setState({
			showFilter:classN
		})
	}

	// 证书名称 ajax
	handleCertificate(e){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Certfct'},
			(response)=>{							
				this.setState({	certificate:response.data });
			},(errors)=>{
				ServiceTips({text:errors,type:'error'});
		});
	}

	// 查找
	searchFunc(){
		let that = this;		
		const {form} = this.props;
		let sID = form.getFieldsValue();
		
		this.props.getPage(Object.assign({},sID));	// 刷新 列表
	}

	// 清空 
	resetFunc(){
		this.props.form.resetFields(); // 清除表单
		this.props.getPage({});	// 刷新 列表

	}

	render(){
		let domFilter;
		const { getNFieldProps, getFieldError } = this.props.form;

		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(500070/*证书名称*/)}</label>
						<Select
							{...getNFieldProps('certifctId',{
								initialValue:undefined
							})}
							placeholder=''
							optionFilterProp="children"														
							optionLabelProp="children"							
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							onClick={this.handleCertificate}							
							>
							{this.state.certificate.map((o,i)=><Option key={i} objValue={{s_label:o.localName, certifctId: o.id }} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
					<div className={'filter-header-key'}>
						<span className="search" onClick={this.search}><i className="foddingicon fooding-search_icon"></i></span>
						<span className="clean"  onClick={this.clear}><i className="foddingicon fooding-clean_icon"></i></span>
					</div>
					<div className={this.state.showFilter}>
						<span className="screen" onClick={this.show_hide_filter
						}><i className="foddingicon fooding-screen_icon"></i></span>
					</div>
				</div>)
		}else{
			domFilter=(<div className={this.state.showFilter}>
					<span className="screen" onClick={this.show_hide_filter
					}><i className="foddingicon fooding-screen_icon"></i></span>
				</div>)
		}
		return(<div className={'clientcontact-list-header'} ref="header">{domFilter}</div>)
	}
}
ClientcontactFilterHeader = createForm()(ClientcontactFilterHeader);
export default ClientcontactFilterHeader;
