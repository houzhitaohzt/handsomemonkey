import i18n from './../../../lib/i18n';
import React,{Component, PropTypes} from "react";
//引入select插件
import Select, { Option } from '../../../components/Select'; // 下拉
import {createForm,FormWrapper} from "../../../components/Form";
import {I18n} from '../../../lib/i18n';
import DataTime from '../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';
class ClientcontactFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		// event func
		this.handleServbeType = this.handleServbeType.bind(this);
		this.search = this.search.bind(this);
		this.clear = this.clear.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
		this.state=this.initState(); 
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
			ServbeType: [{id:1,localName:''}],
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
	getForm(){
		return this.props.form.getFieldsValue();
	}
	// 查找
	search(){
		this.props.getPage();
	}
	clear(){
		this.props.form.resetFields();
		this.props.getPage();
	}
	// 监装机构 ajax 
	handleServbeType(){
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.ServBe',queryParams:[{attr:'beDataMulDivIds',expression:'oin',value:70}]},
			(response)=>{					
				this.setState({	ServbeType:response.data });
			},(errors)=>{
				ServiceTips({ text:errors.message,type:'error' });
		});
	}
	render(){
		let that = this;
		let domFilter;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100102/*监装机构*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('spLoadBeId',{
								rules: [{required:true}],
								initialValue: undefined								
							})}
							optionLabelProp="children"
							style={{width:200}}
							className ='currency-btn select-from-currency'
							onClick={this.handleServbeType}
						>
						{this.state.ServbeType.map((o,i)=><Option key={i} objValue={{s_label:o.localName, spLoadBeId: o.id, spLoadBeLcName:o.localName, spLoadBeLcName: o.name}} title={o.localName}>{o.localName}</Option>)}
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
		return(<div className={'clientcontact-list-header'}>{domFilter}</div>)
	}
}
ClientcontactFilterHeader = createForm()(ClientcontactFilterHeader);
export default ClientcontactFilterHeader;
