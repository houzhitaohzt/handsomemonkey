import React,{Component, PropTypes} from "react";
//引入select插件
import Select, { Option } from '../../../components/Select';
import {createForm,FormWrapper} from "../../../components/Form";
import {I18n} from '../../../lib/i18n';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../services/apiCall';
class ClientcontactFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.qiyunClick = this.qiyunClick.bind(this);
		this.huodaiClick = this.huodaiClick.bind(this);
		this.chuangsClick = this.chuangsClick.bind(this);
		this.search = this.search.bind(this);
		this.clear = this.clear.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
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
			qiyunArray:[],
			huodaiArray:[],
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
		},()=>this.props.expandFilter(null, this.refs.header.offsetHeight==0?1:this.refs.header.offsetHeight))
	}
	search(){
		this.props.getPage();
	}
	getForm(){
		let obj ={};
		obj = Object.assign({},this.props.form.getFieldsValue())
		return obj;
	}
	clear(){
		this.props.form.resetFields()
		this.props.getPage();
	}
	qiyunClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Statn',
			queryParams:[{
			attr:"statnTyId",
			expression:"=",
			value:40
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
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.AgnShipBe'},
			(response)=>{
				that.setState({
					huodaiArray:response.data
				});
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
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		getFieldProps('type',{
										                    initialValue:40
			});
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(500112/*起运车站*/)}</label>
						<Select 
										                {...getNFieldProps('sStatnId',{
										                    rules: [{required:true}],
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
						<label>{I18n.t(500113/*目的车站*/)}</label>
						<Select 
										                {...getNFieldProps('eStatnId',{
										                    rules: [{required:true}],
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
						<label>{I18n.t(100299/*货代公司*/)}</label>
						<Select 
										                {...getNFieldProps('forBeId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										               
										                optionLabelProp="children"							
										                style={{width:200,marginRight:15}}
										                className ={'currency-btn select-from-currency'}							
										                onClick={this.huodaiClick}
										            >	
										                {this.state.huodaiArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, forBeId:o.id, forBeLcName:o.localName, forBeEnName:o.name}} title={o.name}>{o.localName}</Option>)}
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
		return(<div className={'clientcontact-list-header'} ref="header" >{domFilter}</div>)
	}
}
ClientcontactFilterHeader = createForm()(ClientcontactFilterHeader);
export default ClientcontactFilterHeader;
