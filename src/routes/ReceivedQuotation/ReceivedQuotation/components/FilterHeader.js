import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
//引入select插件
import {createForm} from "../../../../components/Form";

class ReceivedQuotationFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.onTabClick=this.onTabClick.bind(this);
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
		minor:'filter-header-information-pre hidden',
        activeTab:0
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
    onTabClick = (id) =>{
        if (this.state.activeTab == id) return false;
        this.setState({ activeTab: id });
        this.props.form.setFieldsValue({status: id || ''});
        this.props.searchCustomer();
    };
    cleanForm = () => {
        this.props.form.resetFields();
    };
	render(){
		let domFilter;
        let array = [
            {id: 0, content: i18n.t(200045/*全部报价*/)},
            {id: 10, content: i18n.t(200047/*报价中*/)}, {id: 15, content: i18n.t(200046/*全部已接受*/)},
            {id: 12, content: i18n.t(200048/*部分接受*/)}, {id: 20, content: i18n.t(200049/*已关闭*/)}
        ];
        let domButton = array.map((e,i) => {
            return (<span key={i} onClick={this.onTabClick.bind(this,e.id)} className={e.id==this.state.activeTab?'single-click active':'single-click'}>{e.content}</span>)
        });
		const { getFieldProps, getFieldError } = this.props.form;
        getFieldProps('status', {initialValue: this.state.activeTab || ''});
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(200028/*报价编号*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder="" 
							{...getFieldProps('no',{
								validateFirst: true,
								rules: [{required:true,}],
								initialValue:''
							})} />
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(200005/*询盘编号*/)}</label>
                        <input type="text" className={'text-input-filter-header'} placeholder=""
                               {...getFieldProps('enquiryNo',{
                                   initialValue:''
                               })} />
					</div>
					<div className={'filter-header-key'}>
						<span className="search"  onClick={this.props.searchCustomer}><i className="foddingicon fooding-search_icon"/></span>
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
ReceivedQuotationFilterHeader = createForm()(ReceivedQuotationFilterHeader);
export default ReceivedQuotationFilterHeader;
