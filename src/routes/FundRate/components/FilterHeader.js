import i18n from './../../../lib/i18n';
import React,{Component, PropTypes} from "react";

//引入select插件
import Select, { Option } from '../../../components/Select';
import {createForm,FormWrapper} from "../../../components/Form";
import {I18n} from '../../../lib/i18n';
import DataTime from '../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,getUser} from '../../../services/apiCall';
class ClientcontactFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.handleCertificate = this.handleCertificate.bind(this);
		this.search = this.search.bind(this);
		props.normalRef && props.normalRef(this);
		this.getForm = this.getForm.bind(this);
		this.clear = this.clear.bind(this);
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			info:[],
			minor:'filter-header-information-pre hidden'
		}
	}
	getForm(){
		return this.props.form.getFieldsValue();
	}
	handleCertificate(){
		var that = this;
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{clusId:getUser().staff.clusId},(response)=>{
			that.setState({
				info:response.data
			})
		},(error)=>{

		})
	}
	search(){
		this.props.getPage();
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
		},()=>this.props.expandFilter(null, this.refs.header.offsetHeight==0?1:this.refs.header.offsetHeight))
		
	}
	clear(){
		this.props.form.resetFields();
		this.props.getPage();
	}
	render(){
		let domFilter;
		const { getFieldProps, getFieldError ,getNFieldProps} = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						
						<label>{i18n.t(500229/*有效日期*/)}</label>
						<DataTime 
							width={200}  
							showTime = {false} 
							isShowIcon={true} 
							form={this.props.form}
							validate={false}
							name={'validityDate'}
						/>						
						
					
					</div>
					<div className={'filter-header-key'}>
						<span className="search" onClick = {this.search}><i className="foddingicon fooding-search_icon"></i></span>
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
		return(<div className={'clientcontact-list-header'} ref='header'>{domFilter}</div>)
	}
}
ClientcontactFilterHeader = createForm()(ClientcontactFilterHeader);
export default ClientcontactFilterHeader;
