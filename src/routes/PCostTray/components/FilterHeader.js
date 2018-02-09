import i18n from './../../../lib/i18n';
import React,{Component, PropTypes} from "react";

//引入select插件
import Select, { Option } from '../../../components/Select';
import {createForm,FormWrapper} from "../../../components/Form";
import {I18n} from '../../../lib/i18n';
import DataTime from '../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../services/apiCall';
class ClientcontactFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.qiyunClick = this.qiyunClick.bind(this);
		this.huodaiClick = this.huodaiClick.bind(this);
		this.search = this.search.bind(this);
		this.clear = this.clear.bind(this);
		props.normalRef && props.normalRef(this);
		this.getForm = this.getForm.bind(this);
		this.handleCertificate = this.handleCertificate.bind(this);
	}
	getForm(){
		return this.props.form.getFieldsValue();
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',
			qiyunArray:[],
			huodaiArray:[],
			statnTyArray:[]
		}
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
	search(){
		this.props.getPage();
	}
	clear(){
		this.props.form.resetFields();
		this.props.getPage();
	}
	qiyunClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Statn'},
			(response)=>{
				that.setState({
					qiyunArray:response.data
				});
		},(error)=>{

		});
	}
	huodaiClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.es.entity.Party',
			queryParams:[{attr:"typeId",expression:"=",value:30},{attr:"businessId",expression:"=",value:30}]},
			(response)=>{
				that.setState({
					huodaiArray:response.data
				});
		},(error)=>{

		});
	}
	handleCertificate(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.TransportType'},
			(response)=>{
				that.setState({
					statnTyArray:response.data
				});
		},(error)=>{

		});
	}
	render(){
		let domFilter;
		const { getFieldProps, getFieldError,getNFieldProps} = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100156/*港口类型*/)}</label>
							<Select
										                {...getNFieldProps('statnTyId',{
										                   initialValue:undefined
										                })}
														 style={{width:200,marginRight:15}}
										                optionLabelProp="children"
										                className ={'currency-btn select-from-currency '}
										                onClick={this.handleCertificate}
										            >
										                {this.state.statnTyArray.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
							</Select>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100297/*起运港*/)}</label>
						<Select 
										                {...getNFieldProps('sStatnId',{
										                    initialValue:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                style={{width:200,marginRight:15}}
										                className ={getFieldError('sStatnId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}							
										                onClick={this.qiyunClick}
										            >	
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, sStatnId : o.id, sStatnLcName:o.localName, sStatnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100299/*货代公司*/)}</label>
						<Select 
										                {...getNFieldProps('forBeId ',{
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                style={{width:200,marginRight:15}}
										                className ={'currency-btn select-from-currency'}							
										                onClick={this.huodaiClick}
										            >	
										                {this.state.huodaiArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, forBeId:o.id, forBeLcName:o.localName, forBeEnName:o.name}} title={o.name}>{o.name}</Option>)}
										            </Select>
					</div>
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
		return(<div className={'clientcontact-list-header'} ref='header'>{domFilter}</div>)
	}
}
ClientcontactFilterHeader = createForm()(ClientcontactFilterHeader);
export default ClientcontactFilterHeader;
