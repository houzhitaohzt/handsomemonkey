import React,{Component, PropTypes} from "react";

//引入select插件
import Select, { Option } from 'rc-select';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入时间插件
import DataTime from '../../../../components/Calendar/Calendar'
import {I18n} from '../../../../lib/i18n';
import {permissionsBtn} from '../../../../services/apiCall';

class SendQuotationFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.onTabClick=this.onTabClick.bind(this);
		this.onTabClick = this.onTabClick.bind(this);
        props.formCall(this.props.form);
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
			activeTab:0
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
	onTabClick(id) {
        if (this.state.activeTab == id) return false;
        this.setState({ activeTab: id });
        this.props.form.setFieldsValue({status: id || ''});
        this.props.searchCustomer();
    }
	cleanForm = () => {
        this.props.form.resetFields();
        this.props.searchCustomer();
    };
	render(){
		let domFilter;
		let	 array = [{id: 0, content:I18n.t(500018/*全部订单*/)},{id:10,content:I18n.t(100457/*下单*/)},{permissions:'onlineorderseller.confirm',id:15,content:I18n.t(500021/*卖方确认*/)},{permissions:'onlineorderseller.close',id:20,content:I18n.t(100432/*关闭*/)}];
		let domButton = array.filter(o=>o['permissions'] ? permissionsBtn(o['permissions']) :1).map((e,i) => {
			return (<span key={i} onClick={this.onTabClick.bind(this,e.id)} className={e.id==this.state.activeTab?'single-click active':'single-click'}>{e.content}</span>)
		})
		const { getFieldProps, getFieldError } = this.props.form;
		getFieldProps('status', {initialValue: this.state.activeTab || ''});
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100325/*订单编号*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder=""
							{...getFieldProps('no',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.props.searchCustomer()}
                             }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(500023/*订单日期*/)}</label>
						<DataTime 
							width={200}  
							showTime = {false} 
							isShowIcon={true} 
							form={this.props.form}
							validate={false}
							name={'sbillDate'}
						/>						
						&nbsp;&nbsp;{I18n.t(500103/*至*/)}&nbsp;&nbsp;	
						<DataTime 
							width={200}  
							showTime = {false} 
							isShowIcon={true} 
							form={this.props.form}
							validate={false}
							name={'ebillDate'}
						/>
					</div>
					<div className={'filter-header-key'}>
						<span className="search" onClick={this.props.searchCustomer}><i className="foddingicon fooding-search_icon"/></span>
                        <span className="clean" onClick={this.cleanForm}><i className="foddingicon fooding-clean_icon"/></span>
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
		return(<div className={'clientcontact-list-header'}>
			<div className={'list-header-click'}>{domButton}</div>
			{domFilter}
		</div>)
	}
}
SendQuotationFilterHeader = createForm()(SendQuotationFilterHeader);
export default SendQuotationFilterHeader;
