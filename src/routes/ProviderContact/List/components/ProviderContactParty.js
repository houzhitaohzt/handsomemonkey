import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入select插件
import Select, { Option } from 'rc-select';
//引入table
import Table from "../../../../components/Table";
//引入分页
import Page from "../../../../components/Page";

class ProviderParty extends Component{
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
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)},
			{code : 'CUS001608150056', name :"DAD International Industrial", country : i18n.t(200464/*曼恩岛*/),level : i18n.t(200464/*曼恩岛*/)}
			],
		}
	}

	static defaultProps={
		data:{main:{
				
			},
		},
		columns_party:[{
			title : i18n.t(200467/*供应商名称*/),
			dataIndex : 'name',
			key : "name",
			width : '40%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(100341/*所属国家*/),
			dataIndex : "country",
			key : "country",
			width : "20%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200468/*供应商等级*/),
			dataIndex : "level",
			key : "level",
			width : "30%",
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
		//用于查询(查到产品后，下面列表中的单条数据就变字体颜色就变成#bec2c7)
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
							<div className={'col-xs-4'}>
								<label className="party-label">{i18n.t(100001/*名称*/)}</label>
								<input type="text" placeholder="" className="text-input" {...getFieldProps('name',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:''
										})} style={{width:"220px"}}/>
							</div>
							<div className={'col-xs-3'}>
								<label className="party-label">{i18n.t(100312/*供应商*/)}</label>
								<input type="text" placeholder="" className="text-input" {...getFieldProps('provider',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:''
										})} style={{width:"150px"}}/>
							</div>
							<div className={'col-xs-3'}>
								<label className="party-label">{i18n.t(100229/*邮箱*/)}</label>
								<input type="text" placeholder="" className="text-input" {...getFieldProps('email',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:''
										})} style={{width:"160px"}}/>
							</div>
							<button type="button" className={'col-xs-1'} onClick={this.searchParty}>{i18n.t(100406/*查询*/)}</button>
						</div>
						<div className="common-party-table">
							<Table
								columns={this.props.columns_party}
								data={this.state.tableSources}
								checkboxConfig={{show:true}}
								colorFilterConfig={{show:false}}
								followConfig={{show:false}}
								prefixCls={"rc-confirm-table"}
								scroll={{x:false, y:210}}
							/>
						</div>
						<div className="common-party-page">
							<Page totalPages={10} />
						</div>
					</div>
			</FormWrapper>);
	}
}

ProviderParty = createForm()(ProviderParty);

export default ProviderParty;


