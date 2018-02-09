import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
import Select, { ConstVirtualSelect,Option } from '../../../../components/Select'; // 下拉

const {Table} = require("../../../../components/Table");
import Page from "../../../../components/Page";
import WebData from '../../../../common/WebData';

import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../services/apiCall'; 
import ServiceTips from '../../../../components/ServiceTips'; // 提示框



class forwarderParty extends Component{
	constructor(props){
		super(props)

		this.state = {
			totalPages: 1, // 总页数			
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条 			
			data: [], // table data
		}

		this.columns = [{
			title : i18n.t(400158/*货代代码*/),
			dataIndex : 'code',
			key : "code",
			width : '40%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(100299/*货代公司*/),
			dataIndex : "localName",
			key : "localName",
			width : "35%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100087/*国家*/),
			dataIndex : "country",
			key : "country",
			width : "20%",
			render(data,row,index){
				return data ? data['localName'] : '';
			}
		}];

	}
	
	componentDidMount(){	
	}

	getPage = ()=>{
		let that = this;
		let {pageSize,currentPage} = this.state;
		let data = this.props.form.getFieldsValue();	
		//let Cid = WebData.user.data.staff.company.id;
		console.log(WebData.user.data.staff.ccid)
		// URL 过滤
		let param = [
				{
					"attr":"typeId",
					"expression":"=",
					"value":"30"
				},{
					"attr":"businessId",
					"expression":"=",
					"value":"30"
				}];

		// 条件过滤 
		if( data['name'] ) param.push({"attr":"name","expression":"like","value":data['name']});
		if( data['cntryId'] ) param.push({"attr":"countryId","expression":"=","value":data['cntryId']});	
			

		apiPost(API_FOODING_DS,'/object/getPage',{
			"obj":"com.fooding.fc.es.entity.Party",
			"attrs":["code","name","country.name"],	
			"queryParams": param,
			"pageSize":pageSize,	
			"currentPage":currentPage	
		},(response)=>{
				that.setState({
					data: response.data.data,
					totalPages: response.data.totalPages,
					currentPage: response.data.currentPage 	
				});
			},(errors)=>{
		});
	}

	// save 
	onSaveAndClose =()=>{
		let that = this;
		let data = this.refs.provider.getSelectArr();

		if( !data['length'] ) {
			ServiceTips({text:i18n.t(500115/*请选中一条数据？*/),type:'info'});
			return;
		}
		

		apiForm(API_FOODING_DS,'/agnShipBe/leadIn',{id:data.map((o)=>o.id)},
			(response)=>{
				ServiceTips({text:response.message,type:'success'});
				that.props.onCancel();
				that.props.getPage();
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// cancle
	onCancel =()=> this.props.onCancel();



	render(){
		let that = this;
		let {data} = this.state;
		let {form} = this.props;
		const {getFieldProps, getFieldError } = this.props.form;


		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
			<div className="common-party" style={{height:'300px'}}>
				<div className="row">
					<div className={'col-md-4'}>
						<label className="party-label">{i18n.t(200570/*货代名称*/)}</label>
						<input type="text" placeholder="" className="text-input" {...getFieldProps('name',{
									validateFirst: true,
									valuedateTrigger:"onBlur",
									initialValue:''
								})} style={{width:"200px"}}/>
					</div>
					{/*<div className={'col-md-3'}>
						<label className="party-label">{i18n.t(100299*//*货代公司*//*)}</label>
						<Select
							animation='slide-up'
							placeholder=''
							style={{width:130}}
							className ='currency-btn select-from-currency'
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							{...getFieldProps('country',{
								validateFirst: true,
								rules: [{required:true,}]
							})}>
							<Option value={i18n.t(200293*//*中国*//*)} title={i18n.t(200293*//*中国*//*)}>{中国}</Option>
						</Select>
					</div>*/}
					<div className={'col-md-offset-3 col-md-4'}>
						<label className="party-label">{i18n.t(100341/*所属国家*/)}</label>
						<ConstVirtualSelect
							form={form}
							style={{width: 200}}
							apiType={apiPost}
							fieldName="cntryId"
							apiParams="com.fooding.fc.ds.entity.Country"
							valueKeys={ da => ({
								cntryId: da.id,
								//cntryLocalName: da.localName,
								s_label:da.localName
							})}
						/>
					</div>
					<div className={'col-md-1'} style={{paddingTop:'5px'}}>
						<button type="button" onClick={this.getPage}>{i18n.t(100406/*查询*/)}</button>
					</div>							
				</div>
				<div className="common-party-table">
					<Table
						ref="provider"
						columns={this.columns}
						data={data}
						checkboxConfig={{show:true}}
						colorFilterConfig={{show:false}}
						followConfig={{show:false}}
						prefixCls={"rc-confirm-table"}
						scroll={{x:false, y:190}}
					/>
				</div>
				<div className="common-party-page">
					<Page 
						currentPage={this.state.currentPage}
						totalPages={this.state.totalPages} 
						sizeList={sizeList}
						currentSize={this.state.pageSize}
						pageSizeChange={(num)=>{
							that.setState({ pageSize: Number.parseInt(num),currentPage:1 },()=>that.getPage());
						}} 
						backClick={(num)=>{
							that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());
						}} 
						nextClick={(num)=>{
							that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());										
						}}
						goChange={(num)=>{
							that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());																				
						}}								
					/>
				</div>
			</div>
		</FormWrapper>);
	}
}

forwarderParty = createForm()(forwarderParty);

export default forwarderParty;


