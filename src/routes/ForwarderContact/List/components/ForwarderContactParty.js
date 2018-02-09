import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入select插件
import Select, { Option } from 'rc-select';
//引入table
const {Table} = require("../../../../components/Table");
//引入分页
import Page from "../../../../components/Page";

class ForwarderParty extends Component{
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
			{ name : "DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name :"DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name : "DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name :"DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name : "DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name :"DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name : "DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name :"DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name : "DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name :"DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name : "DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name :"DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name : "DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name :"DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name : "DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name :"DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name : "DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name :"DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name : "DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)},
			{name :"DAD International Industrial", forwarderCompany : i18n.t(200464/*曼恩岛*/),email : i18n.t(200464/*曼恩岛*/)}
			],
		}
	}

	static defaultProps={
		data:{main:{
				
			},
		},
		columns_party:[{
			title : i18n.t(100001/*名称*/),
			dataIndex : 'name',
			key : "name",
			width : '40%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(100299/*货代公司*/),
			dataIndex : "forwarderCompany",
			key : "forwarderCompany",
			width : "20%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100229/*邮箱*/),
			dataIndex : "email",
			key : "email",
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
								<label className="party-label">{i18n.t(100299/*货代公司*/)}</label>
								<input type="text" placeholder="" className="text-input" {...getFieldProps('forwarderCompany',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
										})} style={{width:"130px"}}/>
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

ForwarderParty = createForm()(ForwarderParty);

export default ForwarderParty;


