import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
//引入select插件
import xt from '../../../../common/xt';
import {createForm,FormWrapper} from "../../../../components/Form";
import Select, {Option,ConstMiniSelect} from '../../../../components/Select';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP} from '../../../../services/apiCall';
import DataTime from "../../../../components/Calendar/Calendar";
class ProductFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);
		this.clientClick = this.clientClick.bind(this);
		props.normalRef && props.normalRef(this);
		this.getForm = this.getForm.bind(this);
		this.clear = this.clear.bind(this);
		this.search = this.search.bind(this);
	}
	search(){
		this.props.getPage();
	}
	getForm(){
		return this.props.form.getFieldsValue();
	}
	clear(){
		this.props.form.resetFields();
		this.props.getPage();
	}
	clientClick(data){
		if (data.trim() === '') return;
        apiGet(API_FOODING_DS, '/customer/search', {keyword: data}, response => {
            this.props.form.resetFields(['salBeId']);
            this.setState({clientArray: response.data || []});
        }, error => {
        })
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',
			clientArray:[],
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
		}, ()=>this.props.expandFilter(null, this.refs.header.offsetHeight))
	}
	render(){
		let domFilter;
		let {getNFieldProps,getFieldValue,getFieldProps}= this.props.form;
		let beField = getNFieldProps('salBeId',{
										initialValue:undefined
									 });
		let beFieldValue = getFieldValue("salBeId") || {};
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(201077/*结算单号*/)}</label>
						<input placeholder=''
								   type="text" {...getFieldProps('settleNo', {
						                initialValue:''
						            })}
								className={'text-input-filter-header'}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400011/*销售员*/)}</label>
						<input placeholder=''
								   type="text" {...getFieldProps('saleStaff', {
						                initialValue:''
						            })}
								className={'text-input-filter-header'}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
							 />
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(201078/*发运日期*/)}</label>
						<DataTime
							range={true}
									type="start"
									startName="shipSDate"
									endName="shipEDate"
									showTime={false}
									isShowIcon={true}
									width={'100%'}
									form={this.props.form}

						/>
						&nbsp;&nbsp;-&nbsp;&nbsp;
						<DataTime
							showTime={false}
									range={true}
									type="end"
									startName="shipSDate"
									endName="shipEDate"
									isShowIcon={true}
									width={'100%'}
								    form={this.props.form}

						/>
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(200612/*收款日期*/)}</label>
						<DataTime
							range={true}
									type="start"
									startName="receSDate"
									endName="receEDate"
									showTime={false}
									isShowIcon={true}
									width={'100%'}
									form={this.props.form}

						/>
						&nbsp;&nbsp;-&nbsp;&nbsp;
						<DataTime
							showTime={false}
									range={true}
									type="end"
									startName="receSDate"
									endName="receEDate"
									isShowIcon={true}
									width={'100%'}
								    form={this.props.form}

						/>
					</div>
					<div  className={'filter-header-information-pre'}>
						<label>{i18n.t(100230/*状态*/)}</label>
						<Select
							style={{width:194}}
							{...getNFieldProps('status', {
						                initialValue:undefined
						    })}
							name="region"
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
						>
		                  	<Option objValue = {{s_label:i18n.t(201079/*未结单*/),status:'1',statusName:i18n.t(201079/*未结单*/)}} key={'1'}>{i18n.t(201079/*未结单*/)}</Option>
		                  	<Option objValue = {{s_label:i18n.t(201080/*待结算*/),status:'5',statusName:i18n.t(201080/*待结算*/)}} key={'5'}>{i18n.t(201080/*待结算*/)}</Option>
		                  	<Option objValue = {{s_label:i18n.t(201081/*已结算*/),status:'10',statusName:i18n.t(201081/*已结算*/)}} key={'10'}>{i18n.t(201081/*已结算*/)}</Option>
						</Select>
					</div>
					<div className={'filter-header-key'}>
						<span className="search"><i className="foddingicon fooding-search_icon" onClick = {this.search}></i></span>
						<span className="clean"><i className="foddingicon fooding-clean_icon" onClick={this.clear}></i></span>
						<span className={this.state.expandClassName} onClick={this.search_more}><i className="foddingicon fooding-zk_icon"/></span>
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
		return(<div className={this.props.id?'none':'product-list-header'} ref='header'>{domFilter}</div>)
	}
}
export default createForm()(ProductFilterHeader);
