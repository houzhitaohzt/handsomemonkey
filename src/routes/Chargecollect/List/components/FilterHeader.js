import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import {createForm,FormWrapper} from "../../../../components/Form";
import {I18n} from '../../../../lib/i18n';
import DataTime from '../../../../components/Calendar/Calendar';
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { Option,ConstVirtualSelect } from '../../../../components/Select'; // 下拉
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../../services/apiCall';
class ClientcontactFilterHeader extends Component{
constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.handleTransportationCompany = this.handleTransportationCompany.bind(this);
		this.huodaiClick = this.huodaiClick.bind(this);
		this.search = this.search.bind(this);
		this.clear = this.clear.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
		this.search_more=this.search_more.bind(this);
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
			huodaiArray:[],
			transportationCompany: [{id:1,name:''}], // 货代公司
								
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


	// 货运公司
	handleTransportationCompany(e){
		apiPost(API_FOODING_DS,'/enterprise/search',{keyword: e},
			(response)=>{							
				this.setState({	transportationCompany:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}
	huodaiClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.AgnShipBe'},
			(response)=>{
				that.setState({
					huodaiArray:response.data
				});
		},(error)=>{

		});
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
	search_more(){
		let classN,classMinor;
		if(this.state.expandClassName==='unfold'){
			classN ='fold';
			classMinor="filter-header-information-pre";//显示的全部条件输入框
		}else{
			classN="unfold";
			classMinor="filter-header-information-pre hidden";//隐藏条件输入框
		}
		this.setState({
            expandClassName: classN, minor: classMinor
        }, ()=>this.props.expandFilter(null, this.refs.header.offsetHeight));
	}

	render(){
		let domFilter;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400048/*单据编号*/)}</label>
						<input  type='text' 
							{...getFieldProps('no',{
								initialValue: ''
							})}
							placeholder=''
							style={{width:200}}
							className ={'text-input'}
								onKeyDown={(e)=>{
                                    if(e.keyCode == 13){this.searchFunc()}
                                }}
						/>						
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(500244/*纸质发票*/)}</label>
						<input  type='text' 
							{...getFieldProps('paperNo',{
								initialValue: ''
							})}
							placeholder=''
							style={{width:200}}
							className ={'text-input'}
								onKeyDown={(e)=>{
                                    if(e.keyCode == 13){this.searchFunc()}
                                }}
						/>						
					</div>

					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100299/*货代公司*/)}</label>
						<Select 
										                {...getNFieldProps('receiptCcId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										               
										                optionLabelProp="children"							
										                style={{width:200,marginRight:15}}
										                className ={'currency-btn select-from-currency'}							
										                onClick={this.huodaiClick}
										            >	
										                {this.state.huodaiArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, receiptCcId:o.id, receiptCcLcName:o.localName, receiptCcEnName:o.name}} title={o.name}>{o.localName}</Option>)}
						</Select>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100230/*状态*/)}</label>
						<Select
							{...getNFieldProps('isConfirmed',{
								initialValue: undefined								
							})} 
							animation='slide-up'
							placeholder=''
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"							
						>
							<Option key={0} value={''} title={i18n.t(400051/*不限*/)}>{i18n.t(400051/*不限*/)}</Option>						
							<Option key={0} value={'1'} title={i18n.t(201065/*已确认*/)}>{i18n.t(201065/*已确认*/)}</Option>
							<Option key={0} value={'0'} title={i18n.t(300069/*未确认*/)}>{i18n.t(300069/*未确认*/)}</Option>
							
						
						</Select>						
					</div>
					<div className={this.state.minor}>
						<label>{I18n.t(100323/*业务日期*/)}</label>
						<DataTime 
							width={200}  
							showTime = {false} 
							isShowIcon={true} 
							form={this.props.form}
							validate={false}
							name={'startDate'}
						/>						
						&nbsp;&nbsp;{I18n.t(500103/*至*/)}&nbsp;&nbsp;	
						<DataTime 
							width={200}  
							showTime = {false} 
							isShowIcon={true} 
							form={this.props.form}
							validate={false}
							name={'endDate'}
						/>
					</div>
					<div className={'filter-header-key'}>
						<span className="search" onClick={this.search}><i className="foddingicon fooding-search_icon"></i></span>
						<span className="clean"  onClick={this.clear}><i className="foddingicon fooding-clean_icon"></i></span>
						<span className={this.state.expandClassName} onClick={this.search_more}><i className="foddingicon fooding-zk_icon"></i></span>
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
