import i18n from './../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";


//引入弹层
import Dialog from '../../../components/Dialog/Dialog';
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
//引入select插件
import Select, { Option } from 'rc-select';
//引入table
import Page from "../../../components/Page"; 
import Table from "../../../components/Table";



// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';




class Record extends Component{
	constructor(props){
		super(props)
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
		this.reveserClick=this.reveserClick.bind(this);


		this.getPage = this.getPage.bind(this);

		var that = this;
	}

	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onCancel: PropTypes.func,
		columns_party:PropTypes.array,
		searchParty:PropTypes.func
	}
	initState(){
		var that = this;
		return {

		initData: [], // 初始化 数据
		currentPage:1, // 当前页
		totalPages: 1, // 总页数
		pageSize: pageSize, // 每页 多少条
		billId: '',	
		ccId: '',
		sData:{},



		columns_party:[{
			title : i18n.t(201105/*订单号*/),
			dataIndex : 'orderNo',
			key : "orderNo",
			width : '10%',
			render(data,row,index){
				return <div title={data} className={'text-ellipsis'}>{data}</div>;
			}
		},{
			title : i18n.t(100311/*客户*/),
			dataIndex : "salBe"+language,
			key : "salBe"+language,
			width : "10%",
			render(data,row,index){
				return <div title={data} className={'text-ellipsis'}>{data}</div>;
			}
		},{
			title : i18n.t(500038/*订单金额*/),
			dataIndex : "orderAmt",
			key : "orderAmt",
			width : "10%",
			render(data,row,index){
				return <div>{data?(toDecimal(data) + ' ' + row['cny'+language]):''}</div>;
			}
		},{
			title : i18n.t(200608/*核销金额*/),
			dataIndex : "verifiAmt",
			key : "verifiAmt",
			width : "10%",
			render(data,row,index){
				return <div>{data?(toDecimal(data)+ ' ' + row['cny'+language]):''}</div>;
			}
		},{
			title : i18n.t(201244/*汇率*/),
			dataIndex : "exchgRate",
			key : "exchgRate",
			width : "10%",
			render(data,row,index){
				return <div>{data}</div>;
			}
		},{
			title : i18n.t(200593/*核销人*/),
			dataIndex : "saleStaff"+language,
			key : "saleStaff"+language,
			width : "10%",
			render(data,row,index){
				return <div title={data} className={'text-ellipsis'}>{data}</div>;
			}
		},{
			title : i18n.t(200594/*核销日期*/),
			dataIndex : "updateDate",
			key : "updateDate",
			width : "10%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "10%",
			render(data,row,index){
				return (row['valid'] && permissionsBtn('sinkrecord.cwriterecord')) ? (<div><i className='foddingicon fooding-reveser-cancal' onClick={that.reveserClick.bind(this,data,row)} title={i18n.t(200595/*反核销*/)}></i></div>) : '';
			}
		}],
		
		tableSources:[],
		}
	}

	componentDidMount(){
		this.getPage();		
    };
	componentWillUnmount() {
	}

	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}

	// 反核销 操作 
	reveserClick(e,Record){

		let that = this;
		Confirm(i18n.t(300028/*是否确定反核销？*/), {
			done: () => {
				apiForm(API_FOODING_ERP,'/foreexchange/reverifi',{billId:Record['billId']},
					(response)=>{				
						ServiceTips({text:response.message,type:'success'});
						that.getPage();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});				
			}
		});
	}


	// 页面 刷新
	getPage(){

		let that = this;
		apiGet(API_FOODING_ERP,'/foreexchange/getVerifiList',Object.assign({billId:that.props.getOne['billId']}),
			(response)=>{				
				that.setState({	
					tableSources: response.data || [],	
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	render(){

		let that = this;
		const {form,data} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		const inputStar=(<span className={''}>*</span>);
		
		return (<FormWrapper showFooter={true} showSaveClose={false} onCancel={this.onCancel} >
					<div className="common-party" style={{height:'320px'}}>
						<div className="common-party-table">
							<div className={'keys-page'}>
								{/*<Page 
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
								/>*/}
							</div>							
							<Table
								columns={this.state.columns_party}
								data={this.state.tableSources}
								checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
								colorFilterConfig={{show : false,dataIndex:'colorType'}}
								followConfig={{show:false}}
								scroll={{x:true, y:230}}
							/>
						</div>
					</div>
			</FormWrapper>);
	}
}

Record = createForm()(Record);

export default Record;


