import React,{Component, PropTypes} from "react";
import {createForm,FormWrapper} from "../../../components/Form";
// common 
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../components/Select'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';
import {I18n} from "../../../lib/i18n";
class ClientcontactFilterHeader extends Component{

	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.handlePortType = this.handlePortType.bind(this);
		this.handleStatesPort = this.handleStatesPort.bind(this);
		this.handleTransportationCompany = this.handleTransportationCompany.bind(this);
		this.handleDestinationPort = this.handleDestinationPort.bind(this);
		this.changePortType = this.changePortType.bind(this);
		this.search = this.search.bind(this);
		props.normalRef && props.normalRef(this);
		this.getForm = this.getForm.bind(this);
		this.clear = this.clear.bind(this);

	}
	static propTypes={
		expand:PropTypes.bool,
		expandFilter:PropTypes.func,
		initData:PropTypes.object
	}
	static defaultProps={
		expand:false,
		expandFilter(){},
		showFilter:'comb-panel',
		expandClassName:'unfold',
		minor:'filter-header-information-pre hidden'
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',

			portType: [{id:1,localName:''}], // 港口类型（运输方式）
			statesPort: [{id:1,localName:''}], // 起运港
			destinationPort: [{id:1,localName:''}], // 目的港						
			transportationCompany: [{id:1,localName:''}], // 货代公司
			
			
			
			portTypeID: '', // 港口类型 id
			portTypeVal:'', // 港口类型的值
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
		})
	}

	// 港口类型
	handlePortType(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.portType,
			(response)=>{			
				this.setState({	portType:response.data.filter((o)=>Number(o['id']) == 10 || Number(o['id']) == 20)});
			},(errors)=>{
				ServiceTips({ text:errors.message,type:'error' });
		});		
	}

	// 港口类型 切换
	changePortType(value){
		this.props.form.resetFields(['sStatnId','eStatnId']); // 清除表单
		switch( value ){
			case '10':
				this.setState({ portTypeID:value, portTypeVal:'seaBox', statesPort: [{id:1,localName:''}]});
			break;
			case '20':
				this.setState({ portTypeID:value, portTypeVal:'trainBox', statesPort: [{id:1,localName:''}]});				
			break;
			default:
				this.setState({ portTypeID:'', portTypeVal:'seaBox', portTypeResult:false, statesPort: [{id:1,localName:''}]});				
				ServiceTips({ text:I18n.t(600006/*只支持铁运或者海运！*/),type:'error'});
		}
	}

	// 起运港 
	handleStatesPort(){
		let that = this;
		this.state.portTypeID ?
			that.props.form.validateFields((errors, value)=>{  
				apiPost(API_FOODING_DS,'/object/getMiniList',
				{
					"obj":"com.fooding.fc.ds.entity.Statn", 
					"queryParams":[{attr: "statnTyId", expression: "=", value: value['statnTyId']}]	
				},
				(response)=>{							
					this.setState({	statesPort:response.data });
				},(errors)=>{
					ServiceTips({ text:errors.message,type:'error'});
				})		
			})		
			:
			ServiceTips({ text:I18n.t(600007/*请选择运输方式！*/),type:'error'});
	}


	// 目的港 
	handleDestinationPort(){
		let that = this;
		this.state.portTypeID ?
			that.props.form.validateFields((errors, value)=>{  
				apiPost(API_FOODING_DS,'/object/getMiniList',
				{
					"obj":"com.fooding.fc.ds.entity.Statn", 
					"queryParams":[{attr: "statnTyId", expression: "=", value: value['statnTyId']}]	
				},
				(response)=>{							
					this.setState({	destinationPort:response.data });
				},(errors)=>{
					ServiceTips({ text:errors.message,type:'error'});
				})		
			})
			:
			ServiceTips({ text:I18n.t(600007/*请选择运输方式！*/),type:'error'});
	}


	// 货运公司
	handleTransportationCompany(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.transportationCompany,
			(response)=>{							
				this.setState({	transportationCompany:response.data });
			},(errors)=>{
				ServiceTips({ text:errors.message,type:'error' });
		});		
	}

	getForm(){
		return this.props.form.getFieldsValue();
	}
	search(){
		this.props.getPage();
	}
	clear(){
		this.props.form.resetFields();
		this.props.getPage();
	}


	render(){
		let domFilter;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100224/*运输方式*/)}</label>
						<Select
							{...getFieldProps('statnTyId',{
								initialValue:undefined							
							})} 
							animation='slide-up'
							placeholder=''
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"							
							onClick={this.handlePortType}
							onSelect={this.changePortType}													
						>
							{this.state.portType.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>						
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100297/*起运港*/)}</label>
						<Select
							{...getNFieldProps('sStatnId',{
								initialValue:undefined								
							})} 
							animation='slide-up'
							placeholder=''
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"							
							onClick={this.handleStatesPort}
						>
							{this.state.statesPort.map((o,i)=><Option key={i} value={o.id} title={o.localName}>{o.localName}</Option>)}
						</Select>						
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100298/*目的港*/)}</label>
						<Select
							{...getNFieldProps('eStatnId',{
								initialValue:undefined								
							})} 
							animation='slide-up'
							placeholder=''
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"							
							onClick={this.handleDestinationPort}
						>
							{this.state.destinationPort.map((o,i)=><Option key={i} value={o.id} title={o.localName}>{o.localName}</Option>)}
						</Select>						
					</div>					
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(200343/*货运公司*/)}</label>
						<Select
							{...getNFieldProps('lsBeId',{
								initialValue:undefined								
							})} 
							animation='slide-up'
							placeholder=''
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"							
							onClick={this.handleTransportationCompany}
						>
							{this.state.transportationCompany.map((o,i)=><Option key={i} value={o.id} title={o.localName}>{o.localName}</Option>)}
						</Select>	
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
		return(<div className={'clientcontact-list-header'}>{domFilter}</div>)
	}
}
ClientcontactFilterHeader = createForm()(ClientcontactFilterHeader);
export default ClientcontactFilterHeader;
