import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
//引入select插件
import Select, { Option } from 'rc-select';
import Calendar from '../../../../components/Calendar/Calendar';
class ProductFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);
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
			minor:'filter-header-information-pre hidden'
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
			expandClassName:classN,minor:classMinor
		})
	}
	render(){
		let domFilter;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400048/*单据编号*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder=""
							   style={{width:194,marginRight:15}}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400025/*仓库*/)}</label>
						<Select
							placeholder=""
							style={{width:194}}
							name="region"
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
						>
		                  	<Option value="5785df87c9a516aed89003d9">{i18n.t(100311/*客户*/)}</Option>
						</Select>
					</div>
					<div className={'filter-header-information-pre'}>
					<label>{i18n.t(400145/*职员*/)}</label>
						<Select
							placeholder=""
							style={{width:194}}
							name="region"
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
						>
		                  	<Option value="5785df87c9a516aed89003d9">{i18n.t(100311/*客户*/)}</Option>
						</Select>
					</div>
					<div className={'filter-header-key'}>
						<span className="search"><i className="foddingicon fooding-search_icon"></i></span>
						<span className="clean"><i className="foddingicon fooding-clean_icon"></i></span>
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
		return(<div className={'product-list-header'}>{domFilter}</div>)
	}
}
export default ProductFilterHeader;
