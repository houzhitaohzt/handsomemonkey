import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
//引入select插件
import Select, { Option, ConstVirtualSelect } from '../../../../components/Select';
import {I18n} from '../../../../lib/i18n';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
class ProductFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);
		this.serchClick=this.serchClick.bind(this);
		this.cleanClick=this.cleanClick.bind(this);
		props.formCall(this.props.form);
	}
	static propTypes={
		expand:PropTypes.bool,
		expandFilter:PropTypes.func
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

			dataMulDiv2sList:[] //产品分组
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
	search_more(){//收缩条件的展开和收缩
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
	serchClick = () =>{
		const { form } = this.props;
		this.props.serchClick();
	};
	cleanClick = () => {
		const { form,cleanClick } = this.props;
		form.resetFields();
		form.setFieldsValue({'mtlTypeId':""})
		cleanClick(null);
	};
	//进入页面时进行初始化
	// getData = () => {
	// 	apiGet(API_FOODING_DS,'/dataMulDiv2/getTree',{id:this.props.id},(response)=>{
		
	// 	},(error)=>{
	// 		ServiceTips({text:error.message,type:'error'});
	// 	})
	// }
	// componentDidMount(){
	// 	this.getData()
	// }
	render(){
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		let {dataMulDivsLable, dataMulDiv2s} = this.props;
		let domFilter;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100377/*产品编码*/)}</label>
						<input type="text" className={'text-input-filter-header'}
							{...getNFieldProps('code',{
									initialValue:''
								})}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.serchClick()}
                               }}
						/>
					</div>					
                    <div className={'filter-header-information-pre'}>
						<label>{I18n.t(500061/*产品名称*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName="mtlTypeId"
							apiType={apiPost}
							apiHost={API_FOODING_DS}
							apiParams="com.fooding.fc.ds.entity.MtlType"
							initValueOptions={dataMulDivsLable?[{id:dataMulDiv2s,localName:dataMulDivsLable}]:[]}
							initialValue={dataMulDiv2s || ""}
							style={{width:'250px'}}
							clearable={true}
						/>
					</div>
                    <div className={'filter-header-information-pre'}>
                        <label>{I18n.t(100226/*英文名称*/)}</label>
                        <input type="text" className={'text-input-filter-header'}
                               {...getNFieldProps('enName',{
                                   initialValue:''
                               })}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.serchClick()}
                               }}
						/>
                    </div>
					<div className={'filter-header-key'}>
						<span className="search" onClick={this.serchClick}><i className="foddingicon fooding-search_icon"/></span>
						<span className="clean" onClick={this.cleanClick}><i className="foddingicon fooding-clean_icon"/></span>
					</div>
					<div className={this.state.showFilter}>
						<span className="screen" onClick={this.show_hide_filter
						}><i className="foddingicon fooding-screen_icon"/></span>
					</div>
				</div>)
		}else{
			domFilter=(<div className={this.state.showFilter}>
					<span className="screen" onClick={this.show_hide_filter
					}><i className="foddingicon fooding-screen_icon"/></span>
				</div>)
		}
		return(<div className={'product-list-header'}>{domFilter}</div>)
	}
}
ProductFilterHeader = createForm()(ProductFilterHeader);
export default ProductFilterHeader;


/*<span className={'text-input-filter-header'} onClick={this.props.groupeClick} style={{display:'inline-block',lineHeight:"28px",float:"right"}}>{this.props.dataMulDivsLable}</span>*/