import React,{Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
import {I18n} from '../../../../lib/i18n';
import i18n from './../../../../lib/i18n';
import DataTime from '../../../../components/Calendar/Calendar';
import Select, { Option } from '../../../../components/Select';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
class ForwarderFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);
		this.costlvtrClick = this.costlvtrClick.bind(this);
		this.hangxianClick = this.hangxianClick.bind(this);
		this.chuangsClick = this.chuangsClick.bind(this);
		this.bizhongClick = this.bizhongClick.bind(this);
		this.qiyunClick = this.qiyunClick.bind(this);
		this.search = this.search.bind(this);
		this.clear = this.clear.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
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
	static defaultProps={
		expand:false,
		expandFilter(){},
		showFilter:'comb-panel',
		expandClassName:'unfold',
		minor:'filter-header-information-pre hidden'
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
			chuangArray:[],
			qiyunArray:[],
			hanxianArray:[],
			bizhongArray:[],
			costlvtrArray:[]
		}
	}
	chuangsClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.AgnShipBe'},
			(response)=>{
				that.setState({
					chuangArray:response.data
				});
		},(error)=>{

		});
	}
	hangxianClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.TransRout'},
			(response)=>{
				that.setState({
					hanxianArray:response.data
				});
		},(error)=>{

		});
	}
	bizhongClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Curren'},
			(response)=>{
				that.setState({
					bizhongArray:response.data
				});
		},(error)=>{

		});
	}
	costlvtrClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Costlvtr'},
			(response)=>{
				that.setState({
					costlvtrArray:response.data
				});
		},(error)=>{

		});
	}
	qiyunClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Statn',
			queryParams:[{
			attr:"statnTyId",
			expression:"=",
			value:30
		}]
		},
			(response)=>{
				that.setState({
					qiyunArray:response.data
				})
		},(error)=>{

		});
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
			expandClassName:classN,minor:classMinor
		})
	}
	render(){
		let domFilter;
		const { getFieldProps, getFieldError,getNFieldProps } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100155/*港口*/)}</label>
						<Select
											{...getNFieldProps('statnId',{
													                   
													                    initialValue:undefined
													                })}
													                placeholder=''
													                optionLabelProp="children"
													                 style={{width:200,marginRight:15}}
													                className ={'currency-btn select-from-currency'}
													                onClick={this.qiyunClick}
										>
													                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, statnId: o.id, statnLcName :o.localName, statnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										</Select>
					</div>
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
													                onClick={this.hangxianClick}
										>
													                 {this.state.hanxianArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, routeId: o.id, routeLcName :o.localName, routeEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										</Select>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(500121/*费用名称*/)}</label>
						<Select
											{...getNFieldProps('costlvtrId',{
													                   
													                    initialValue:undefined
													                })}
													                placeholder=''
													                optionLabelProp="children"
													                 style={{width:200,marginRight:15}}
													                className ={'currency-btn select-from-currency'}
													                onClick={this.costlvtrClick}
										>
													               {this.state.costlvtrArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, costlvtrId: o.id, costlvtLcName :o.localName, costlvtEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										</Select>
					</div>
					<div className={'filter-header-information-pre'}>
						 <label>{I18n.t(500125/*货币*/)}</label>
						<Select
											{...getNFieldProps('cnyId',{
													                   
													                    initialValue:undefined
													                })}
													                placeholder=''
													                optionLabelProp="children"
													                 style={{width:200,marginRight:15}}
													                className ={'currency-btn select-from-currency'}
													                onClick={this.bizhongClick}
										>
													                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName :o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
													                
										</Select>

					</div>
					<div className={this.state.minor}>
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
						<label>{I18n.t(100288/*发布日期*/)}</label>
						<DataTime 
							width={200}  
							showTime = {false} 
							isShowIcon={true} 
							form={this.props.form}
							validate={false}
							name={'reDate'}
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
		return(<div className={'clientcontact-list-header'}>{domFilter}</div>)
	}
}
ForwarderFilterHeader = createForm()(ForwarderFilterHeader);
export default ForwarderFilterHeader;
