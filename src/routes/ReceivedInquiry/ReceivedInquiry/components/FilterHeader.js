import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
//引入select插件
import {createForm} from "../../../../components/Form";
//引入时间插件
import DataTime from '../../../../components/Calendar/Calendar'

class ReceivedQuotationFilterHeader extends Component{
	constructor(props){
		super(props);
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.onTabClick=this.onTabClick.bind(this);
        props.formCall(this.props.form);
	}
	static propTypes={
		expand:PropTypes.bool,
		expandFilter:PropTypes.func,
		initData:PropTypes.object
	};
	static defaultProps={
		expand:false,
		expandFilter(){},
		showFilter:'comb-panel',
		expandClassName:'unfold',
		minor:'filter-header-information-pre hidden'
	};
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

	onTabClick(id){
		if(this.state.activeTab==id) return false;
		this.setState({
			activeTab:id
		})
	}

    cleanForm = () => {
        this.props.form.resetFields();
    };

	render(){
		let domFilter;
		const { getFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100288/*发布日期*/)}</label>
						<DataTime
							showTime={false}
							width={200}
							isShowIcon={true}
							padding={'3px 10px 4px'}
							form={this.props.form} name={'sendsDate'}
							/>
							&nbsp;&nbsp;{i18n.t(500103/*至*/)}&nbsp;&nbsp;
							<DataTime
								showTime={false}
								width={200}
								isShowIcon={true}
								padding={'3px 10px 4px'}
								form={this.props.form} name={'sendeDate'}
							/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(200017/*有效期至*/)}</label>
						<DataTime
							showTime={false}
							width={200}
							isShowIcon={true}
							padding={'3px 10px 4px'}
							form={this.props.form} name={'validityDate'}
						/>
					</div>
					<div className={'filter-header-key'}>
						<span className="search" onClick={this.props.searchCustomer}><i className="foddingicon fooding-search_icon"/></span>
						<span className="clean" onClick={this.cleanForm}><i className="foddingicon fooding-clean_icon"/></span>
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
		return(<div className={'clientcontact-list-header'}>
			{domFilter}
		</div>)
	}
}
ReceivedQuotationFilterHeader = createForm()(ReceivedQuotationFilterHeader);
export default ReceivedQuotationFilterHeader;
