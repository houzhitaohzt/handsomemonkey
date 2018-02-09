import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入滚动条
import FreeScrollBar from "../../../Client/List/components/FreeScrollBar";
//引入select插件
import Select, { Option } from 'rc-select';
import {addUpdateRecord,addUpdateJson} from '../../../../services/client/call';
import {I18n} from '../../../../lib/i18n';
import NameCheck from "../../../../components/InputBoxCheck/NameCheck";

class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
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
			}]
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
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(null==errors){
				if(onSaveAndClose){
					let record= form.getFieldsValue();
					addUpdateRecord
					/*addUpdateJson*/(record,(value)=>{
						onSaveAndClose(value);
					},(msg)=>{
						console.log(msg);
					});
				}
			}
		})
	}

	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	render(){
		const {form} = this.props;
		const {data} = this.state;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let {staffIds}=this.state;
		staffIds=staffIds||[];
		const inputStar=(<span className={''}>*</span>);
		let dom = ( <div className={'addnormal'} style={{marginBottom:'10px'}}>
		      			<div className="  girdlayout">
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{i18n.t(400158/*货代代码*/)}</label>
							<input type="text"  className="col-md-9 col-lg-9 text-input-nowidth"  disabled
								{...getFieldProps('code',{
									validateFirst: true,
									initialValue:data?data.code:''
								})}
							/>
						</div>

						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200562/*货代国家*/)}</label>
							<Select
								animation='slide-up'
								placeholder={i18n.t(200573/*请输入国家*/)}
								style={{width:320}}
								className ='currency-btn select-from-currency col-xs-9 col-md-9'
          						optionLabelProp="children"
								{...getFieldProps('cntryId',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:data&&('country' in data)?data.country:''
								})}
								>
									<Option  value={i18n.t(200293/*中国*/)} title={i18n.t(200293/*中国*/)}>{i18n.t(200293/*中国*/)}</Option>
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
								initialValue={data&&('name' in data)?data.name:''}
								className={'col-md-9 col-lg-9'}
							/>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100226/*英文名称*/)}</label>
							<NameCheck
								form={this.props.form}
								fieldName='enName'
								rules={true}
								isEnName={true}
								initialValue={data&&data.enName?data.enName:''}
								className={'col-md-9 col-lg-9'}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100002/*描述*/)}</label>
							<input type="text" placeholder={i18n.t(200574/*请输入名称*/)} className="col-md-3 col-lg-3 text-input-nowidth"
								{...getFieldProps('name',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:data&&('name' in data)?data.name:''
								})}
							/>
						</div>
					</div>
				</div>
			</div>
				)
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
					<FreeScrollBar style={{height:"344px"}} className="scroll_style">
						{dom}
					</FreeScrollBar>
			</FormWrapper>);
	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;

