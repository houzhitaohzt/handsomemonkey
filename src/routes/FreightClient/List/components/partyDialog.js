import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
//引入弹层
//引入滚动条
import FreeScrollBar from "./FreeScrollBar"
//引入select插件
import Select from '../../../../components/Select'

//引入table
const {Table} = require("../../../../components/Table");

class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.searchParty=this.searchParty.bind(this);
		this.state=this.initState();
	}
	
	
	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func,
		columns_party:PropTypes.array,
		searchParty:PropTypes.func
	}
	initState(){
		return {
			tableSources:[
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/)}
			],
		}
	}

	static defaultProps={
		data:{main:{
				bizEntprisCode:"CUS001608150056",
				bizEntprisName:'DaD',
				bizEntprisCntryId:i18n.t(200465/*还原胶*/),
				country:i18n.t(200464/*曼恩岛*/)
			},
		},
		columns_party:[{
			title : i18n.t(100354/*客户代码*/),
			dataIndex : "code",
			key : "code",
			width : "40%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : i18n.t(100355/*客户名称*/),
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
					onSaveAndClose(form.getFieldsValue());
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
	searchParty(){
		//用于查询
	}
	render(){
		const {form,data} = this.props;
		const {main}=data;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		const inputStar=(<span className={''}>*</span>);
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
					<div className="common-party">
						<div className="row">
							<div className={'col-xs-3'}>
								<label className="party-label">{i18n.t(100354/*客户代码*/)}</label>
								<input type="text" placeholder="" className="text-input" {...getFieldProps('bizEntprisCode',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:main.bizEntprisCode
										})}  />
							</div>
							<div className={'col-xs-3'}>
								<label className="party-label">{i18n.t(100355/*客户名称*/)}</label>
								<input type="text" placeholder="" className="text-input" {...getFieldProps('bizEntprisName',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:main.bizEntprisName
										})} />
							</div>
							<div className={'col-xs-2'}>
								<label className="party-label">{i18n.t(100087/*国家*/)}</label>
								<Select 
									placeholder=""
									style={{width:90}}
									className ='currency-btn select-from-currency'
									{...getFieldProps('country',{
										validateFirst: true,
										rules: [{required:true,}],
										valuedateTrigger:"onBlur",
										initialValue:main.country
									})}
									>
								</Select>
							</div>
							<div className={'col-xs-2'}>
								<label className="party-label">{i18n.t(100379/*产品*/)}</label>
								<Select 
									placeholder=""
									style={{width:90}}
									name="bizEntpris.cntryId"
									className ='currency-btn select-from-currency'
									{...getFieldProps('bizEntprisCntryId',{
										validateFirst: true,
										rules: [{required:true,}],
										valuedateTrigger:"onBlur",
										initialValue:main.bizEntprisCntryId
									})}
									>
								</Select>
							</div>
							<button type="button" className={'col-xs-1'} onClick={this.searchParty}>{i18n.t(100406/*查询*/)}</button>
						</div>
						<div className="client-party-table">
							<FreeScrollBar style={{height:"284px"}} className="scroll-style">
								<Table 
									columns={this.props.columns_party}
									data={this.state.tableSources}
									checkboxConfig={{show:false}}
									colorFilterConfig={{show:false}}
									followConfig={{show:false}}
									prefixCls={"rc-confirm-table"}
									scroll={{x:false, y:250}}
								/>
							</FreeScrollBar>
						</div>
					</div>
			</FormWrapper>);
	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;


