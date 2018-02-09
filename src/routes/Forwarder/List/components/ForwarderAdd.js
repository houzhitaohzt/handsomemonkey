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
import NameCheck from "../../../../components/InputBoxCheck/NameCheck";

class CommonForm extends Component{
	constructor(props){
		super(props)

		this.searchClick=this.searchClick.bind(this);
		this.state=this.initState();

		// even func
		this.countryClick = this.countryClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
	}

	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func,
		columns_add:PropTypes.array,
		initData:PropTypes.object
	}

	initState(){
		return {
			customerRechecking : "add-label-default",
			cntryId:'',
			staffIds:[],
			initData:{},
			data : {},
			tableSource:[{'code':'weriujdsf','name':i18n.t(100311/*客户*/),'country':i18n.t(200569/*美国*/)},{'code':'weriujdsf','name':i18n.t(100311/*客户*/),'country':i18n.t(200569/*美国*/)},{'code':'weriujdsf','name':i18n.t(100311/*客户*/),'country':i18n.t(200569/*美国*/)},{'code':'weriujdsf','name':i18n.t(100311/*客户*/),'country':i18n.t(200569/*美国*/)},{'code':'weriujdsf','name':i18n.t(100311/*客户*/),'country':i18n.t(200569/*美国*/)},{'code':'weriujdsf','name':i18n.t(100311/*客户*/),'country':i18n.t(200569/*美国*/)},{'code':'weriujdsf','name':i18n.t(100311/*客户*/),'country':i18n.t(200569/*美国*/)},{'code':'weriujdsf','name':i18n.t(100311/*客户*/),'country':i18n.t(200569/*美国*/)},{'code':'weriujdsf','name':i18n.t(100311/*客户*/),'country':i18n.t(200569/*美国*/)}],
			columns_add:[{
					title : i18n.t(400158/*货代代码*/),
					dataIndex : "code",
					key : "code",
					width : "40%",
					render(data,row,index){
						return (<div className="text-ellipsis" title={data}>{data}</div>);
						}
					},{
						title : i18n.t(200570/*货代名称*/),
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

			country: [{id:1,name:''}], // 国家

		}
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}
	componentDidMount(){

	}

	searchClick(){
		let className;
		if(this.state.customerRechecking=="add-label-default") return false;
		 className = "add-label-active-table-show";
		 //点击之后更新数据，让数据去渲染Table
		 this.setState({
		 	customerRechecking : className
		 })
	}
	nameChange(e){
		let tempV;
		tempV=e.target.value;
		if(tempV.length != 0) tempV="add-label-active";
		if(tempV.length == 0) tempV="add-label-default";
			this.setState({
				customerRechecking:tempV
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

	// 保存
	onSaveAndClose(){

		const {form, onSaveAndClose} = this.props;
		let that = this;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_DS,'/agnShipBe/save',value,
					(response)=>{							
						that.props.form.resetFields(); // 清除表单
						that.props.onSaveAndClose(); // 关闭弹框
						that.props.getPage();	// 刷新页面
						ServiceTips({text: response.message,type:'success'});	

						// 跳转至 详情
						setTimeout(()=>{
        					window.navTabs.open(i18n.t(200571/*货代详情*/),`/forwarder/detail?id=${response.data}`);
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
	render(){
		const {form, checkedData} = this.props;
		const {data} = this.state;
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

		let common =<div></div>
		let dom = (<div className={'addnormal'} style={{marginBottom:'10px'}}>
		      			<div className="  girdlayout">
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{i18n.t(400158/*货代代码*/)}</label>
							<input type="text"  
								className="col-md-9 col-lg-9 text-input-nowidth"
								placeholder={i18n.t(400158/*货代代码*/)}
								disabled
								{...getFieldProps('code',{
									initialValue: checkedData.code ? checkedData.code : ''
								})}
							/>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{inputStar}{i18n.t(200562/*货代国家*/)}</label>
							<Select
								animation='slide-up'
								placeholder={I18n.t(100087/*国家*/)}
								className ={getFieldError('cntryId')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}							
								choiceTransitionName="rc-select-selection__choice-zoom"
          						optionLabelProp="children"
								{...getNFieldProps('cntryId',{
									rules: [{required:true}],
									initialValue: checkedData.country ? {s_label: checkedData.country.localName, cntryId: checkedData.country.id } : ''
								})}
								onClick={this.countryClick}	
								>
								{this.state.country.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.localName}</Option>)}
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
							{common}
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100226/*英文名称*/)}</label>
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
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100002/*描述*/)}</label>
							<input type="text" name="description " placeholder="" className="col-md-9 col-lg-9 text-input-nowidth"
								{...getFieldProps('description',{
									initialValue: checkedData.description ? checkedData.description : ''
								})}
							/>
						</div>
					</div>
					{/*<AddRepeats columns={this.state.columns_add} data={this.state.tableSource} searchClick={this.searchClick} customerRechecking={this.state.customerRechecking} labelWord={i18n.t(200572*//*货代查重*//*)}/>*/}
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

