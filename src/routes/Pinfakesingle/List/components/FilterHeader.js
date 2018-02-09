import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
//引入select插件
import Select, { Option,ConstVirtualSelect,ConstMiniSelect } from '../../../../components/Select';
import { Translate, Localize,I18n } from '../../../../lib/i18n';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList} from '../../../../services/apiCall';
import WebData from "../../../../common/WebData";
import DataTime from '../../../../components/Calendar/Calendar';
class ForwarderFilterHeader extends Component{
	constructor(props){
	super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
        this.search_more=this.search_more.bind(this);
		this.search = this.search.bind(this);
		this.clean=this.clean.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
		this.zhifutiaokuanClick = this.zhifutiaokuanClick.bind(this);
		this.ccidClick = this.ccidClick.bind(this);
	}
	static defaultProps={
		expand:false,
		expandFilter(){},
		showFilter:'comb-panel',
		expandClassName:'unfold',
		minor:'filter-header-information-pre hidden'
	}
	search(){
		this.props.getPage();
	}
	getForm(){
		let obj ={};
		obj = Object.assign({},this.props.form.getFieldsValue())
		return obj;
	}
	clean(){
		this.props.form.resetFields()
		this.props.getPage();
	}
	onClick(){

	}
	initState(){
		return{
            expand:false,
            showFilter:'comb-panel',
            expandClassName:'unfold',
            minor:'filter-header-information-pre hidden',
			zhifutiaokuanArray:[],
            ccidArray:[]
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
    ccidClick(){
        var that =this;
        apiGet(API_FOODING_ES,'/party/getLoginCompanies',{},(response)=>{
            that.setState({
                ccidArray:response.data
            });
        },(errors)=>{

        })
    }
	zhifutiaokuanClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.PayTagType'},
		
			(response)=>{
				that.setState({
					zhifutiaokuanArray:response.data
				})
		},(error)=>{

		});
	}
	render(){
		let domFilter;
        let {getNFieldProps,getFieldValue,getFieldProps}= this.props.form;
        let ccLocalName = WebData.user.data.staff.company.localName;
        let Cid = WebData.user.data.staff.ccid;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
                    <div className={'filter-header-information-pre'}>
                        <label>{I18n.t(500374/*销假单号*/)}</label>
                        <input type="text" {...getFieldProps('no', {
                            initialValue:''
                        })} className={'text-input-filter-header'}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
                        />
                    </div>
                    <div className={'filter-header-information-pre'}>
                        <label>{I18n.t(500375/*员工名称*/)}</label>
                        <input type="text" {...getFieldProps('staffName', {
                            initialValue:''
                        })} className={'text-input-filter-header'}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
                        />
                    </div>
                    <div className={'filter-header-information-pre'}>
                        <label>{i18n.t(700074/*状态*/)}</label>
                        <Select
                            placeholder=""
                            style={{width:200}}
                            {...getNFieldProps('status', {
                                initialValue:undefined
                            })}
                            name="region"
                            allowClear
                            className ='currency-btn select-from-currency'
                            prefixCls="rc-select-filter-header"
                        >
                            <Option objValue = {{s_label:i18n.t(100471/*作废*/),status:'0',statusName:i18n.t(100471/*作废*/)}} key={'0'}>{i18n.t(100471/*作废*/)}</Option>
                            <Option objValue = {{s_label:i18n.t(300039/*草稿*/),status:'1',statusName:i18n.t(300039/*草稿*/)}} key={'1'}>{i18n.t(300039/*草稿*/)}</Option>
                            <Option objValue = {{s_label:i18n.t(200258/*已提交*/),status:'5',statusName:i18n.t(200258/*已提交*/)}} key={'5'}>{i18n.t(200258/*已提交*/)}</Option>
                            <Option objValue = {{s_label:i18n.t(400053/*已审批*/),status:'10',statusName:i18n.t(400053/*已审批*/)}} key={'10'}>{i18n.t(400053/*已审批*/)}</Option>
                        </Select>
                    </div>
                    <div className={this.state.minor}>
                        <label>{i18n.t(700076/*日期*/)}</label>
                        <DataTime
                            showTime={false}
                            isShowIcon={true}
                            width={'100%'}
                            form={this.props.form}
                            name={'startDate'}
                        />
                        &nbsp;&nbsp;-&nbsp;&nbsp;
                        <DataTime
                            showTime={false}
                            isShowIcon={true}
                            width={'100%'}
                            form={this.props.form}
                            name={'endDate'}
                        />
                    </div>
					<div className={'filter-header-key'}>
						<span className="search"><i className="foddingicon fooding-search_icon" onClick={this.search}></i></span>
						<span className="clean"><i className="foddingicon fooding-clean_icon" onClick={this.clean}></i></span>
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
		return(<div className={'clientcontact-list-header'}  ref="header">{domFilter}</div>)
	}
}
ForwarderFilterHeader = createForm()(ForwarderFilterHeader);
export default ForwarderFilterHeader;
