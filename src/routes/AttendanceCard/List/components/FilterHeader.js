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
        let {getOneData,form} = this.props;
        let {getNFieldProps,getFieldValue,getFieldProps}= this.props.form;
        let ccLocalName = WebData.user.data.staff.company.localName;
        let Cid = WebData.user.data.staff.ccid;
        getOneData = getOneData || {};
        getOneData.depments = getOneData.depments || [];
        getOneData.staffs = getOneData.staffs || [];
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
                    <div className={'filter-header-information-pre'}>
                        <label>所属部门</label>
                        <ConstMiniSelect form={this.props.form}
                                         pbj={{apiType: apiGet, host: API_FOODING_ES, uri: '/party/getLoginDepartments',
                                             params: {ccId:WebData.user.data.staff.ccid}
                                         }}
                                         fieldName="deptmentId"
                                         optionValue={da => <Option key={da.id} objValue={{
                                             deptmentId: da.id,
                                             s_label: da.localName
                                         }}>{da.localName}</Option>}

                                         className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                         allowClear

                        />
                    </div>
                    <div className={'filter-header-information-pre'}>
                        <label>{I18n.t(600300/*职工工号*/)}</label>
                        <input type="text"
                               {...getFieldProps('employeeId', {
                                   initialValue:''
                               })}
                               className={'text-input-filter-header'}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
                        />
                    </div>

					<div className={'filter-header-information-pre'}>
						<label>职员名称</label>
                        <input type="text"
                               {...getFieldProps('employeeName', {
                                   initialValue:''
                               })}
                               className={'text-input-filter-header'}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
                        />
					</div>
                    <div className={'filter-header-information-pre'}>
                        <label>考勤卡号</label>
                        <input type="text"
                               {...getFieldProps('cardNo', {
                                   initialValue:''
                               })}
                               className={'text-input-filter-header'}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
                        />
                    </div>
					<div className={'filter-header-key'}>
						<span className="search"><i className="foddingicon fooding-search_icon" onClick={this.search}></i></span>
						<span className="clean"><i className="foddingicon fooding-clean_icon" onClick={this.clean}></i></span>
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
