import React,{Component, PropTypes} from "react";
//引入select插件
import Select, { Option ,ConstMiniSelect ,ConstVirtualSelect} from '../../../../components/Select/';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList,commonAjax} from '../../../../services/apiCall';
import {createForm,FormWrapper} from "../../../../components/Form";
import {I18n} from '../../../../lib/i18n';
import xt from '../../../../common/xt';
import WebData from "../../../../common/WebData";
//引入时间插件
import DataTime from '../../../../components/Calendar/Calendar';
class ClientcontactFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search = this.search.bind(this);
		this.clean=this.clean.bind(this);
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
		}
	}
	// 查找
	search(){
		this.props.getPage();
	}
	getForm(){
		let obj ={};
		obj = Object.assign({},this.props.form.getFieldsValue())
		return obj;
	}
	clean(){
		this.props.form.resetFields()
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
		const { getFieldProps, getFieldError,getNFieldProps } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(400048/*单据编号*/)}</label>
						<input 
											    type="text"
												{...getFieldProps('no',{
												
												initialValue:''})}
												style={{width:200}}
												className={'text-input-nowidth'}
												onKeyDown={(e)=>{
                                                    if(e.keyCode == 13){this.search()}
                                                }}
							/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(500129/*源单编号*/)}</label>
						<input 
											    type="text"
												{...getFieldProps('sourceNo',{
												
												initialValue:''})}
												style={{width:200}}
												className={'text-input-nowidth'}
												onKeyDown={(e)=>{
                                                    if(e.keyCode == 13){this.search()}
                                                }}
							/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(400145/*职员*/)}</label>
						<ConstVirtualSelect
                        placeholder=""
                        form={this.props.form}
                        style={{width:200}}
                        fieldName='staffId'
                        apiHost={API_FOODING_ES}
                        apiUri='/staff/getListByCcId'
                        apiParams={{
                            ccid: WebData.user.data.staff.ccid
                            
                        }}
                        valueKeys={ da => ({
					         staffId: da.id,
					         staffLcName: da.localName,
					         staffEnName: da.name,
					        s_label: da.localName
					    })}
                        
                    />
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(400025/*仓库*/)}</label>
						<ConstVirtualSelect
                        placeholder=""
                        form={this.props.form}
                        fieldName='slId'
                        apiType = {apiPost}
                        style={{width:200}}
                        apiHost={API_FOODING_DS}
                        apiUri='/object/getMiniList'
                        apiParams={{
                            obj:'com.fooding.fc.ds.entity.StorLocatn'
                           
                        }}
                       
                        valueKeys={ da => ({
					        slId: da.id,
					         slLcName: da.localName,
					         slEnName: da.name,
					        s_label: da.localName
					    })}
                    />
					</div>
					<div className={this.state.minor}>
						<label>{I18n.t(500131/*事物类型*/)}</label>
						<ConstVirtualSelect
                        placeholder=""
                        form={this.props.form}
                        fieldName='stOpeId'
                        apiType = {apiPost}
                        style={{width:200}}
                        apiHost={API_FOODING_DS}
                        apiUri='/object/getMiniList'
                        apiParams={{
                            obj:'com.fooding.fc.ds.entity.StorOpert'
                           
                        }}
                       
                        valueKeys={ da => ({
					        stOpeId: da.id,
					        stOpeLcName: da.localName,
					        stOpeEnName: da.name,
					        s_label: da.localName
					    })}
                    />
					</div>
					<div className={this.state.minor}>
						<label>{I18n.t(400049/*业务状态*/)}</label>
						<Select
								{...getNFieldProps('status',{
									initialValue:undefined								
								})} 
								animation='slide-up'
								placeholder=''
								style={{width:200}}
								className ='currency-btn select-from-currency'
								prefixCls="rc-select-filter-header"
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"							
							>
													
								<Option key={0} value={'0'} title={I18n.t(400051/*不限*/)}>{I18n.t(400051/*不限*/)}</Option>					
								<Option key={1} value={'1'} title={I18n.t(300039/*草稿*/)}>{I18n.t(300039/*草稿*/)}</Option>
								<Option key={2} value={'10'} title={I18n.t(400053/*已审批*/)}>{I18n.t(400053/*已审批*/)}</Option>
								<Option key={3} value={'5'} title={I18n.t(200258/*已提交*/)}>{I18n.t(200258/*已提交*/)}</Option>
							</Select>
					</div>
					<div className={this.state.minor}>
						<label>{I18n.t(500023/*订单日期*/)}</label>
						<DataTime 
							width={200}  
							showTime = {false} 
							isShowIcon={true} 
							form={this.props.form}
							validate={false}
							name={'sDate'}
						/>						
						&nbsp;&nbsp;{I18n.t(500103/*至*/)}&nbsp;&nbsp;	
						<DataTime 
							width={200}  
							showTime = {false} 
							isShowIcon={true} 
							form={this.props.form}
							validate={false}
							name={'eDate'}
						/>
					</div>
					<div className={'filter-header-key'}>
						<span className="search"><i className="foddingicon fooding-search_icon" onClick={this.search}></i></span>
						<span className="clean"><i className="foddingicon fooding-clean_icon" onClick={this.clean}></i></span>
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
