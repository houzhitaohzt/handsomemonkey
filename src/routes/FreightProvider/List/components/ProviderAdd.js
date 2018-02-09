import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入滚动条
import FreeScrollBar from "../../../Client/List/components/FreeScrollBar";
import AddRepeats from '../../../Client/List/components/AddRepeats';
import {addUpdateRecord,addUpdateJson} from '../../../../services/client/call';
import {I18n} from '../../../../lib/i18n';



// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language} from '../../../../services/apiCall';
import AddMoreLanguage from "../../../../components/AddMoreLanguage"; 
import NameCheck from "../../../../components/InputBoxCheck/NameCheck";


class CommonForm extends Component{

	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.searchClick=this.searchClick.bind(this);
		this.onChange = this.onChange.bind(this);

		// init onclick
		this.countryClick = this.countryClick.bind(this); // 国家 click
		this.supplierSourceClick = this.supplierSourceClick.bind(this);	 // 供应商来源
		this.supplierGradeClick = this.supplierGradeClick.bind(this);	 // 供应商等级
		this.supplierTypeClick = this.supplierTypeClick.bind(this);	 // 供应商类型


		// init state
		this.state=this.initState();
		

	}

	initState(initData){
		return {
			customerRechecking : "add-label",
			cntryId:'',
			staffIds:[],
			options:[],

			country: [{id:1,name:''}], // 国家
			supplierSource: [{id:1,name:''}], // 供应商来源
			supplierGrade: [{id:1,name:''}],  // 供应商等级	
			supplierType: [{id:1,name:''}],   // 供应商类型		
					
		}
	}

	static defaultProps={
		data:{},
		columns_add:[{
					title : I18n.t(100354/*客户代码*/),
					dataIndex : "code",
					key : "code",
					width : "40%",
					render(data,row,index){
						return (<div className="text-ellipsis" title={data}>{data}</div>);
						}
					},{
						title : I18n.t(100355/*客户名称*/),
						dataIndex : 'name',
						key : "name",
						width : '40%',
						render(data,row,index){
							return (<div className="text-ellipsis" title={data}>{data}</div>)
						}
					},{
					title : i18n.t(100087/*国家*/),
					dataIndex : "country",
					key : "country",
					width : "20%",
					render(data,row,index){
						return data;
					}
				}],
		onSaveAndClose(){},
		onCancel(){}
	}

	componentDidMount(){
	}

	onChange(value) {
		var that = this;
	    console.log('onChange', value);
	    let options = [];
	    if (value) {
			apiGet(API_FOODING_DS,'/vendor/repeat/getPage',{pageSize:10,currentPage:0},(response)=>{
					options = response.data.data.map((domain) => {
						return <Option key={domain}>{domain}</Option>;
					});
					this.setState({
					options,
				});
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});				
			})
		}
	}

	// 保存
	onSaveAndClose(){

		const {form, onSaveAndClose} = this.props;
		let that = this;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_DS,'/vendor/save',value,
					(response)=>{							
						that.props.form.resetFields(); // 清除表单
						that.props.onSaveAndClose(); // 关闭弹框
						that.props.getPage();	// 刷新页面
						ServiceTips({text: response.message,type:'success'});	

						// 跳转至 详情
						setTimeout(()=>{
        					window.navTabs.open(i18n.t(200935/*供应商详情*/),`/provider/detail`,{id:response.data},{refresh: true});
						},500);


					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}	
		});	
	}

	// 取消
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
			this.props.form.resetFields();
		}
	}

	// 查找	
	searchClick(){
		let className;
		 className = "add-label rechecking";
		 //点击之后更新数据，让数据去渲染Table
		 this.setState({
		 	customerRechecking : className
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

	// 供应商来源 click
	supplierSourceClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.CstmCrsekt'},
			(response)=>{							
				this.setState({	supplierSource: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 供应商等级 click
	supplierGradeClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.CstmLevel'},
			(response)=>{							
				this.setState({	supplierGrade: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 供应商类型 click
	supplierTypeClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.CstmType'},
			(response)=>{							
				this.setState({	supplierType: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}
	render(){
		const {form,data,initData,checkedData} = this.props;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let {staffIds}=this.state;
		staffIds=staffIds||[];
		
		const inputStar=(<span className={''}>*</span>);

		// 参数 
		getNFieldProps('id', {
			initialValue: checkedData ? checkedData['id'] : '',
		});

		getNFieldProps('optlock', {
			initialValue: checkedData ? checkedData['optlock'] : '',
		});
		let common = <div></div>
		if(checkedData && checkedData.localName){
			common = <AddMoreLanguage 
								    menusetView={checkedData}
								    object = {'vendor'}
								    upload={this.props.getPage}
								    onCancel ={this.onCancel}
							/>
		}
		let dom = (<div className={'addnormal'} style={{marginBottom:'10px'}}>
		      			<div className="  girdlayout">
						<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
							<input type="text"  
								className="col-md-9 col-lg-9 text-input-nowidth"
								placeholder={I18n.t(100378/*自动生成*/)} 
								disabled
								{...getFieldProps('code',{
									initialValue: checkedData.code ? checkedData.code : ''
								})}
							/>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100087/*国家*/)}</label>
							<Select
								animation='slide-up'
								placeholder={I18n.t(100087/*国家*/)}
								className ={getFieldError('cntryId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}							
								choiceTransitionName="rc-select-selection__choice-zoom"
          						optionLabelProp="children"
								{...getNFieldProps('cntryId',{
									rules: [{required:true}],
									initialValue: checkedData.country ? {s_label: checkedData.country.name, cntryId: checkedData.country.id } : ''
								})}
								onClick={this.countryClick}	
								>
								{this.state.country.map((o,i)=><Option key={i} value={o.id} title={o.localName}>{o.localName}</Option>)}
							</Select>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100001/*名称*/)}</label>
							<NameCheck
								form={this.props.form}
								fieldName='name'
								rules={true}
								initialValue={checkedData.name ? checkedData.name : ''}
								className={'col-md-9 col-lg-9'}
							/>							
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100226/*英文名称*/)}</label>
							<NameCheck
								form={this.props.form}
								fieldName='enName'
								rules={true}
								isEnName={true}
								initialValue={checkedData.enName ? checkedData.enName : ''}
								className={'col-md-9 col-lg-9'}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200966/*供应商类型*/)}</label>
							<Select
								animation='slide-up'
								placeholder={I18n.t(100087/*国家*/)}
								className ={getFieldError('cstmTypeId') ? 'col-md-9 col-lg-9 currency-btn select-from-currency error-border' : 'currency-btn select-from-currency col-md-9 col-lg-9'}															
								choiceTransitionName="rc-select-selection__choice-zoom"
          						optionLabelProp="children"
								{...getNFieldProps('cstmTypeId',{
									//rules: [{required:true}],
									initialValue: checkedData.cstmType ? {s_label: checkedData.cstmType.name, cstmTypeId: checkedData.cstmType.id } : ''
								})}
								onClick={this.supplierTypeClick}	
								>
								{this.state.supplierType.map((o,i)=><Option key={i} value={o.id} title={o.localName}>{o.localName}</Option>)}
							</Select>							
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200468/*供应商等级*/)}</label>
							<Select
								placeholder={i18n.t(200468/*供应商等级*/)}
								animation='slide-up'
								className ='currency-btn select-from-currency'
								choiceTransitionName="rc-select-selection__choice-zoom"
          						optionLabelProp="children"
								className ='col-md-9 col-lg-9 currency-btn select-from-currency'
								{...getNFieldProps('cstmLevelId',{ 
									initialValue: checkedData.cstmLevel ? {s_label: checkedData.cstmLevel.name, cstmLevelId: checkedData.cstmLevel.id } : ''
								})}
								onClick={this.supplierGradeClick}														
								>
								{this.state.supplierGrade.map((o,i)=><Option key={i} value={o.id} title={o.localName}>{o.localName}</Option>)}
							</Select>							
						</div>
					</div>
					<div className="row">
					<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200967/*供应商来源*/)}</label>
							<Select
								placeholder={i18n.t(200967/*供应商来源*/)}
								animation='slide-up'
								className ='currency-btn select-from-currency col-md-9 col-lg-9'
								choiceTransitionName="rc-select-selection__choice-zoom"
          						optionLabelProp="children"
								{...getNFieldProps('cstmCrsektId',{ 
									initialValue: checkedData.cstmCrsekt ? {s_label: checkedData.cstmCrsekt.name, cstmCrsektId: checkedData.cstmCrsekt.id } : ''
								})}
								onClick={this.supplierSourceClick}														
								>
								{this.state.supplierSource.map((o,i)=><Option key={i} value={o.id} title={o.localName}>{o.localName}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100002/*描述*/)}</label>
							<input type="text" placeholder={i18n.t(200574/*请输入名称*/)} className="text-input-nowidth col-md-9 col-lg-9"
								{...getFieldProps('description',{
									initialValue: checkedData.description ? checkedData.description : ''
								})}
							/>
						</div>
					</div>
					<AddRepeats columns={this.columns_add} data={this.state.data} searchClick={this.searchClick} customerRechecking={this.state.customerRechecking}/>
				</div>
				</div>)
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
					<FreeScrollBar style={{height:"344px"}} className="scroll_style">
						{dom}
					</FreeScrollBar>
			</FormWrapper>);
	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;

