import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";

//引入select插件
import {createForm,FormWrapper} from "../../../../components/Form";
import Calendar from  '../../../../components/Calendar/Calendar';


//引入时间插件
import DataTime from '../../../../components/Calendar/Calendar'
import {I18n} from '../../../../lib/i18n';




// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { Option,ConstVirtualSelect } from '../../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language} from '../../../../services/apiCall';
import ProductSelect, {ProductName} from "../../../../components/FindGridSelect";
class ProviderFilterHeader extends Component{

	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);

		// init onClick
		this.countryClick = this.countryClick.bind(this); // 国家 click
		
		this.searchFunc = this.searchFunc.bind(this);	 // 头部 查询	
		this.resetFunc = this.resetFunc.bind(this);	 // 头部 清空		
			


	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',

			country: [{id:1,name:''}], // 国家
			product: [{id:1,name:''}], // 关注产品
			
			
			

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



	// 国家 click
	countryClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Country'},
			(response)=>{							
				this.setState({	country: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 关注产品 
	handleProduct = (e)=>{
		apiGet(API_FOODING_DS,'/material/search',{keyword: e},
			(response)=>{							
				this.setState({	product:response.data || [] });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}




	// 查找
	searchFunc(){
		let that = this;		
		const {form} = this.props;
		let sID = form.getFieldsValue();	

		// 时间补零
        sID.leaveStartDate = sID.leaveStartDate ? sID.leaveStartDate + ' 00:00:00' : sID.leaveStartDate;
        sID.leaveEndDate = sID.leaveEndDate ? sID.leaveEndDate + ' 23:59:59' : sID.leaveEndDate;
        sID.enterStartDate = sID.enterStartDate ? sID.enterStartDate + ' 00:00:00' : sID.enterStartDate;
        sID.enterEndDate = sID.enterEndDate ? sID.enterEndDate + ' 23:59:59' : sID.enterEndDate;

		this.props.getPage(Object.assign({},sID));	// 刷新 列表
	}

	// 清空 
	resetFunc(){
		let that = this;
        if(this.props.form.getFieldsValue().mtlTyId){
            this.refs.productSelect.clear(this.props.getPage);
            this.props.form.resetFields();
        }else {
            this.props.form.resetFields(); // 清除表单
			this.props.getPage({});	// 刷新 列表
        }
	}


	render(){
		let domFilter;
		let {form} = this.props;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(600194/*采购商*/)}</label>
						<input type="text" className={'text-input-filter-header'} 
							placeholder=""
							{...getFieldProps('purchaser',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
                                if(e.keyCode == 13){this.searchFunc()}
                            }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100312/*供应商*/)}</label>
						<input type="text" className={'text-input-filter-header'} 
							placeholder=""
							{...getFieldProps('vendor',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
                                if(e.keyCode == 13){this.searchFunc()}
                            }}
						/>
					</div>					
					<div className={'filter-header-information-pre'} style={{width:'300px'}}>
						<label>{i18n.t(100379/*产品*/)}</label>
						<div style ={{float:'right',width:'200px'}}>
							<ProductSelect
								form={this.props.form}
								search='/platformMaterial/search' 
								url='/platformMaterial/search'
								titleClass={'col-md-12'}
							/>							
						</div>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100297/*起运港*/)}</label>
						<ConstVirtualSelect
                            form={form}
                            style={{width: 200}}
                            apiType={apiPost}
                            fieldName="portFromId"
                            labelKey='localName'
                            apiParams={{obj:'com.fooding.fc.ds.entity.Statn',queryParams:[{attr:"statnTyId",expression:"=",value:10}]}}
                            clearable
                        />
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(100298/*目的港*/)}</label>
						<ConstVirtualSelect
                            form={form}
                            style={{width: 200}}
                            apiType={apiPost}
                            fieldName="portToId"
                            labelKey='localName'
                            apiParams={{obj:'com.fooding.fc.ds.entity.Statn',queryParams:[{attr:"statnTyId",expression:"=",value:10}]}}
                            clearable
                        />
					</div>										
					<div className={this.state.minor}>
						<label>{i18n.t(600199/*起运国*/)}</label>
						<ConstVirtualSelect
                            form={form}
                            style={{width: 200}}
                            apiType={apiPost}
                            fieldName="countryFromId"
                            labelKey='localName'
                            apiParams="com.fooding.fc.ds.entity.Country"
                            clearable
                        />
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(600200/*目的国*/)}</label>
						<ConstVirtualSelect
                            form={form}
                            style={{width: 200}}
                            apiType={apiPost}
                            fieldName="countryToId"
                            labelKey='localName'
                            apiParams="com.fooding.fc.ds.entity.Country"
                            clearable
                        />
					</div>					
					<div className={this.state.minor}>
						<label>{i18n.t(700074/*状态*/)}</label>
						<ConstVirtualSelect
                            form={form}
                            style={{width: 200}}
                            apiType={apiPost}
                            fieldName="status"
                            labelKey='localName'
                            apiParams={{
								obj:"com.fooding.fc.enumeration.RowSts",
								queryParams:[{
									attr:'id',
									expression:"<>",
									objValues:[90]
								}]
							}}
                            clearable
                        />
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(600202/*出口日期*/)}</label>
						<Calendar 
                            showTime={false}
                            width={200}
                            isShowIcon={true}
                            form={this.props.form}
                            padding={"3px 10px 4px"}
							name={'leaveStartDate'}
						/>						
						&nbsp;&nbsp;至&nbsp;&nbsp;	
						<Calendar 
                            showTime={false}
                            width={200}
                            form={this.props.form}
                            isShowIcon={true}
                            padding={"3px 10px 4px"}
							name={'leaveEndDate'}
						/>
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(600201/*进口日期*/)}</label>
						<Calendar 
                            showTime={false}
                            width={200}
                            isShowIcon={true}
                            form={this.props.form}
                            padding={"3px 10px 4px"}
							name={'enterStartDate'}
						/>						
						&nbsp;&nbsp;至&nbsp;&nbsp;	
						<Calendar 
                            showTime={false}
                            width={200}
                            form={this.props.form}
                            isShowIcon={true}
                            padding={"3px 10px 4px"}
							name={'enterEndDate'}
						/>
					</div>												
					<div className={'filter-header-key'}>
						<span onClick={this.searchFunc} className="search"><i className="foddingicon fooding-search_icon"></i></span>
						<span onClick={this.resetFunc} className="clean"><i className="foddingicon fooding-clean_icon"></i></span>
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
		return(<div className={'clientcontact-list-header'}>{domFilter}</div>)
	}
}
ProviderFilterHeader = createForm()(ProviderFilterHeader);
export default ProviderFilterHeader;

