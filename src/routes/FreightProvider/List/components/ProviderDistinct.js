import i18n from './../../../../lib/i18n';
import React, {PropTypes, Component} from 'react'
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog'
//引入Table
import Table from "../../../../components/Table";
import Page from "../../../../components/Page";



// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall'; // ajax
import ServiceTips from '../../../../components/ServiceTips'; // 提示框


class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);


		// init func
		this.getPage = this.getPage.bind(this);		
		this.searchFunc = this.searchFunc.bind(this);


		// init state
		this.state = {
			data: [], // tabal
			totalPages: 1, // 总页数			
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条 

			searchVal:{}, // 去重查询
		}

	}

	componentDidMount(){
		this.getPage();
    }
	
	componentWillUnmount() {

	}

	static PropTypes={
		data:PropTypes.object,
		form:PropTypes.object,
		onSaveAndClose:PropTypes.func,
		onCancel:PropTypes.func
	}

	static defaultProps = {
		data : {
			main : {
				name : 'DAD',
				email : '123@163.com',
				net : 'www.baidu.com'
			},
			tableSources : [{code : "CUS001608150056", name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/), net : "www.sdjfajl.com", taxNumber : "12345678" },{code : "CUS001608150056", name : "DAD International Industrial", country : i18n.t(200464/*曼恩岛*/), net : "www.sdjfajl.com", taxNumber : "12345678" }],
		},
		columns_distinct : [{
			title : i18n.t(200964/*供应商代码*/),
			dataIndex : "code",
			key : "code",
			width : "30%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : i18n.t(200467/*供应商名称*/),
			dataIndex : 'name',
			key : "name",
			width : '30%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(100087/*国家*/),
			dataIndex : "country",
			key : "country",
			width : "30%",
			render(data,row,index){
				return data;
			}
		}],
		onSaveAndClose(){},
		onCancel(){}
	}
	compoentDidMount(){

	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(null == errors){
				if(onSaveAndClose){
					onSaveAndClose(form.getFieldsValue());
				}
			}
		})
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel()
		}
	}

	// 查找
	searchFunc(){

		const {form} = this.props;
		let sID = form.getFieldsValue();	
		
		this.setState({searchVal: sID},function(){
			this.getPage(sID);	// 刷新 列表
		});
		
	}

	// 刷新页面
	getPage(search={}){

		let that = this;
		let page = {pageSize: this.state.pageSize,currentPage: this.state.currentPage};
		let value = Object.assign(page, this.state.searchVal, search);

		apiGet(API_FOODING_DS,'/vendor/repeat/getPage',value,
			(response)=>{
				that.setState({
					data: response.data.data,
					totalPages: response.data.totalPages,
					currentPage: response.data.currentPage 	
				});
			},(errors)=>{
		});		
	}

	render(){
		const {form, data } = this.props;
		const {main, tableSources} = data;
		const {getFieldProps, getFieldError} = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let that = this;
		return(<FormWrapper showFooter={true} showSaveClose={false} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
				<div className="common-distinct">
					<div className="row">
						<div className="col-xs-3">
							<label className="distinct-label">{i18n.t(200467/*供应商名称*/)}</label>
							<input type="text" placeholder="" className="text-input" 
								{...getFieldProps('name',{
									initialValue:''
								})}
								style={{width:'120px'}}
							/>
						</div>
						<div className="col-xs-3">
							<label className="distinct-label">{i18n.t(100229/*邮箱*/)}</label>
							<input type="text" placeholder="" className="text-input" 
								{...getFieldProps('email',{
									initialValue:''
								})}
							/>
						</div>
						<div className="col-xs-3">
							<label className="distinct-label">{i18n.t(200444/*网址*/)}</label>
							<input type="text" placeholder="" className="text-input" 
								{...getFieldProps('net',{
									initialValue:''
								})}
							/>
						</div>
						<span onClick={this.searchFunc} className="client-distinct-search"><i className="foddingicon fooding-search_icon"></i></span>
					</div>
					<div className="common-distinct-table">
						<Table 
							columns={this.props.columns_distinct}
							data={this.state.data}
							checkboxConfig={{show:false}}
							colorFilterConfig={{show:false}}
							followConfig={{show:false}}
							prefixCls={"rc-confirm-table"}
							scroll={{x:false, y:200}}
						/>
					</div>
					<div className="common-distinct-page">
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
		</FormWrapper>)
	}
}

CommonForm = createForm()(CommonForm)

export default CommonForm;
