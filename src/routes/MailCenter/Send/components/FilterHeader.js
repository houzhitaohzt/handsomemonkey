import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
//引入select插件
import {ConstVirtualSelect} from "../../../../components/Select";
import {createForm} from "../../../../components/Form";
import {apiGet,API_FOODING_ES, apiPost} from "../../../../services/apiCall";
import Select, { Option } from '../../../../components/Select'; // 下拉
import WebData from '../../../../common/WebData';

class SystemStaffFilterHeader extends Component {
    constructor(props) {
        super(props);
        this.state = this.initState();
        props.formCall(this.props.form);
        this.searchFunc = this.searchFunc.bind(this);
        this.resetFunc = this.resetFunc.bind(this);
        
        
    }

    static propTypes = {
        expand: PropTypes.bool,
        expandFilter: PropTypes.func,
        initData: PropTypes.object
    }
    static defaultProps = {
        expand: false,
        expandFilter(){
        },
        showFilter: 'comb-panel',
        expandClassName: 'unfold',
        minor: 'filter-header-information-pre hidden'
    }

    initState() {
        return {
            expand: false,
            showFilter: 'comb-panel',
            expandClassName: 'unfold',
            minor: 'filter-header-information-pre hidden',
            company: [{id:1,localName:''}], // 收款企业

        }
    }

    show_hide_filter() {
        let classN;
        if (this.state.showFilter === "comb-panel") {
            classN = "comb-panel-floating";
        } else {
            classN = "comb-panel";
        }
        this.setState({
            showFilter: classN
        })
    }

	// 收款企业
	handleCompany = ()=>{

		let userLogin = WebData.user.data;
		let companyID = userLogin.staff.clusId;

		apiGet(API_FOODING_ES,'/party/getPartysByTypeId',{typeId: 30},
			(response)=>{							
				this.setState({	company: response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}    

	// 查找
	searchFunc (){
		let that = this;		
		const {form} = this.props;
		let sID = form.getFieldsValue();
		
        console.log();
		this.props.getPage(Object.assign({},sID));	// 刷新 列表
	}

	// 清空 
	resetFunc (){
		this.props.form.resetFields(); // 清除表单
		this.props.getPage({});	// 刷新 列表
	}    

    render() {
        let domFilter;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;

        if (this.state.showFilter === 'comb-panel') {
            domFilter = (
                <div className={'filter-header'}>
                    <div className={'filter-header-information-pre'}>
                        <label>{i18n.t(100244/*企业*/)}</label>
						<Select
							{...getNFieldProps('ccId',{
								initialValue: undefined
							})} 
							animation='slide-up'
							placeholder=''
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"							
							onClick={this.handleCompany}

						>
							{this.state.company.map((o,i)=><Option key={o.id} objValue={{s_label:o.localName,ccId:o.id}} title={o.localName}>{o.localName}</Option>)}
						</Select>
                    </div>
                    <div className={'filter-header-key'}>
                        <span className="search" onClick={this.searchFunc}><i className="foddingicon fooding-search_icon"></i></span>
                        <span className="clean" onClick={this.resetFunc}><i className="foddingicon fooding-clean_icon"></i></span>
                    </div>
                </div>)
        }
        return (<div className={'system-staff-list-header'}>{domFilter}</div>)
    }
}
SystemStaffFilterHeader = createForm()(SystemStaffFilterHeader);
export default SystemStaffFilterHeader;
