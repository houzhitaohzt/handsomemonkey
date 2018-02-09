import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";

//引入select插件
import {createForm,FormWrapper} from "../../../../components/Form";

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
						<label>{i18n.t(200472/*竞争对手名称*/)}</label>
						<input type="text" className={'text-input-filter-header'} 
							placeholder=""
							{...getFieldProps('name',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
                                if(e.keyCode == 13){this.searchFunc()}
                            }}
						/>
					</div>
					{/*<div className={'filter-header-information-pre'}
						 style={{width:'300px'}}>
						<label>{i18n.t(100350*//*关注产品*//*)}</label>
						<div style ={{float:'right',width:'200px'}}>
							<ProductName
								ref ="productSelect"
								form={this.props.form}
								width={'379%'}
								fieldName ='mtlTyId'
								className={'currency-btn select-from-currency text-input-nowidth'}
								titleClass={"col-md-12 col-lg-12"}
								apiUri='/mtlType/search'
							/>
						</div>
					</div>*/}
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100087/*国家*/)}</label>
						<ConstVirtualSelect
                            form={form}
                            style={{width: 200}}
                            apiType={apiPost}
                            fieldName="cntryId"
                            labelKey='localName'
                            apiParams="com.fooding.fc.ds.entity.Country"
                            clearable
                        />
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(201171/*邮箱地址*/)}</label>
						<input type="text" className={'text-input-filter-header'} 
						placeholder=""
						{...getFieldProps('email',{
							initialValue: ''
						})}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.searchFunc()}
                               }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100371/*网站*/)}</label>
						<input type="text" className={'text-input-filter-header'} 
						placeholder=""
						{...getFieldProps('web',{
							initialValue: ''
						})}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.searchFunc()}
                               }}
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

