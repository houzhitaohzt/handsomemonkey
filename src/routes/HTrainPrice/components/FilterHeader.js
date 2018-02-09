import i18n from './../../../lib/i18n';
import React,{Component, PropTypes} from "react";

//引入select插件
import Select, { Option } from '../../../components/Select';
import {createForm,FormWrapper} from "../../../components/Form";
//引入时间插件
import {I18n} from '../../../lib/i18n';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../services/apiCall';
import DataTime from '../../../components/Calendar/Calendar';
class ClientcontactFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.qiyunClick = this.qiyunClick.bind(this);
		this.huodaiClick = this.huodaiClick.bind(this);
		this.chuangsClick = this.chuangsClick.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
		this.search = this.search.bind(this);
		this.clean = this.clean.bind(this);
		this.search_more=this.search_more.bind(this);
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',
			qiyunArray:[],
			routeArray:[],
			chuangArray:[]
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
	qiyunClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Statn',
			queryParams:[{
			attr:"statnTyId",
			expression:"=",
			value:20
		}]
		},
			(response)=>{
				that.setState({
					qiyunArray:response.data
				})
		},(error)=>{

		});
	}
	huodaiClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.TransRout'},
			(response)=>{
				that.setState({
					routeArray:response.data
				})
		},(error)=>{

		});
	}
	chuangsClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',
			{
				"obj":"com.fooding.fc.ds.entity.Carrier",
				"prettyMark":true
			},
			(response)=>{
				that.setState({
					chuangArray:response.data
				});
		},(error)=>{

		});
	}
	render(){
		let domFilter;
		const { getFieldProps, getFieldError,getNFieldProps} = this.props.form;
		getFieldProps('type',{
					initialValue:20
			});
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100177/*航线*/)}</label>
							<Select
										                {...getNFieldProps('routeId',{
										                   
										                    initialValue:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                style={{width:200,marginRight:15}}
										                className ={'currency-btn select-from-currency'}
										                onClick={this.huodaiClick}
										            >
										                {this.state.routeArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, routeId : o.id, routeLcName:o.localName, routeEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100297/*起运港*/)}</label>
							<Select 
										                {...getNFieldProps('sStatnId',{
										                    
										                    initialValue:undefined
										                })}
										                optionLabelProp="children"							
										                style={{width:200,marginRight:15}}
										                className ={'currency-btn select-from-currency'}							
										                onClick={this.qiyunClick}
										            >	
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, sStatnId: o.id, sStatnLcName :o.localName, sStatnEnName: o.name}} title={o.name}>{o.localName}</Option>)}
							 </Select>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100298/*目的港*/)}</label>
						<Select 
										                {...getNFieldProps('eStatnId',{
										                    
										                    initialValue:undefined
										                })}
										                optionLabelProp="children"							
										                style={{width:200,marginRight:15}}
										                className ={'currency-btn select-from-currency'}							
										                onClick={this.qiyunClick}
										            >	
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, eStatnId: o.id, eStatnLcName:o.localName, eStatnEnName:o.name}} title={o.name}>{o.localName}</Option>)}
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
					<div className={this.state.minor}>
						<label>{I18n.t(400049/*业务状态*/)}</label>
						<Select
								{...getNFieldProps('reStatus',{
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
													
													
								<Option key={1} value={'1'} title={I18n.t(300039/*草稿*/)}>{I18n.t(300039/*草稿*/)}</Option>
								<Option key={2} value={'35'} title={I18n.t(201012/*已发布*/)}>{I18n.t(201012/*已发布*/)}</Option>
								<Option key={3} value={'0'} title={i18n.t(500275/*已作废*/)}>{i18n.t(500275/*已作废*/)}</Option>
							</Select>
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
		return(<div className={'clientcontact-list-header'}>{domFilter}</div>)
	}
}
ClientcontactFilterHeader = createForm()(ClientcontactFilterHeader);
export default ClientcontactFilterHeader;
