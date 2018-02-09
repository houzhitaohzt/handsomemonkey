import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";

import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层

import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";

// ajax
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,
	API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';


class OrderCorporationList extends Component{
	constructor(props){
		super(props)
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.onRowClick=this.onRowClick.bind(this);
		this.onHeaderCellClick=this.onHeaderCellClick.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.editClick=this.editClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		// init Func
		this.getPage = this.getPage.bind(this);



		this.columns = [{
			title : i18n.t(400008/*销售单号*/),
			dataIndex : 'salesOrderNo',
			key : "salesOrderNo",
			width : '15%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : i18n.t(100355/*客户名称*/),
			dataIndex : "salBe"+language,
			key : "salBe"+language,
			width : "18%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : i18n.t(200522/*买方代码*/),
			dataIndex : "salBeCode",
			key : "salBeCode",
			width : "12%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : i18n.t(200792/*收货人名称*/),
			dataIndex : "revBusinessLcName",
			key : "revBusinessLcName",
			width : "12%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(400011/*销售员*/),
			dataIndex : 'saleStaff'+language,
			key : "saleStaff"+language,
			width : "8%",
			render(data,row ,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : i18n.t(200523/*信保限额状态*/),
			dataIndex : "creditStatusName",
			key : "creditStatusName",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : i18n.t(500038/*订单金额*/),
			dataIndex : "orderAccount",
			key : "orderAccount",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{toDecimal(data)}</div>);
			}
		}, {
            title: i18n.t(200504/*投保金额*/),
            dataIndex: "coverAccount",
            key: "coverAccount",
            width: "8%",
            render(data, row, index) {
                return (<div className="text-ellipsis" title={data}>{toDecimal(data)}</div>);
            }

        },{
            title : i18n.t(100145/*创建时间*/),
            dataIndex : "createDate",
            key : "createDate",
            width : "8%",
            render(data,row,index){
                return new Date(data).Format("yyyy-MM-dd");
            }
		},{
			title : i18n.t(200802/*出运日期*/),
			dataIndex : "sendDate",
			key : "sendDate",
			width : "12%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(200506/*信用期限*/),
			dataIndex : "useLimit",
			key : "useLimit",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={(data || 0)+' '+ i18n.t(200519/*天*/)}>{data || 0}{' '}{i18n.t(200519/*天*/)}</div>);
			}
		},{
			title : i18n.t(200518/*信保状态*/),
			dataIndex : "statusName",
			key : "statusName",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		}];
	}

	initState(){
		return {
			scrollHeight:0,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:null,
			record:[{'salesnumber':'SO343587','clientname':'SCIM CHIMIQUE','buyerlist':'1233453','receivedname':'SCIM CHIBNE','sales':i18n.t(200803/*刘洋*/),'status':i18n.t(400053/*已审批*/),'money':'234535USD','toubaomoney':'385935USD','date':1489371014494,'corporationstatus':i18n.t(200799/*已投*/)},{'salesnumber':'SO343587','clientname':'SCIM CHIMIQUE','buyerlist':'1233453','receivedname':'SCIM CHIBNE','sales':i18n.t(200803/*刘洋*/),'status':i18n.t(400053/*已审批*/),'money':'234535USD','toubaomoney':'385935USD','date':1489371014494,'corporationstatus':i18n.t(200494/*未投*/)},{'salesnumber':'SO343587','clientname':'SCIM CHIMIQUE','buyerlist':'1233453','receivedname':'SCIM CHIBNE','sales':i18n.t(200803/*刘洋*/),'status':i18n.t(400053/*已审批*/),'money':'234535USD','toubaomoney':'385935USD','date':1489371014494,'corporationstatus':i18n.t(200799/*已投*/)}],

			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
			billId: '',
			ccId: '',
			sData:{},
		}
	}
	editClick(){

		let that = this;
		let select = this.refs.product.getSelectArr();

		// 编辑 条件判断
		if( select.length == 0 ){
			Confirm(i18n.t(500115/*请选中一条数据？*/));
		} else if( select.length > 1 ){
			Confirm(i18n.t(500220/*不支持批量操作!*/));
		} else{
			let {navAddTab} =this.props;
			let getOneData = select[0];
			navAddTab({id:7,name:i18n.t(200797/*订单信保修改*/),component:i18n.t(200797/*订单信保修改*/),url:'/ordercorporation/edit'});
			this.props.router.push({
				pathname:'/ordercorporation/edit',
				query:{id: getOneData['billId']},
			});
		}


		// console.log('销售查看列表,当信保状态（未投）状态下，才可以点击修改')
		// let tempArr = this.state.selectArr;
		// if(tempArr.length !== 1){
		// 	alert('只能选中一条数据并且状态为"未投"才能操作');
		// 	return false;
		// }
		// if(tempArr[0].corporationstatus == '未投'){

		// }else{
		// 	return false;
		// }
	}
	deleteClick(){
		let that = this;
		let select = this.refs.product.getSelectArr();

		// 编辑 条件判断
		if(select.length == 0 ){
			ServiceTips({text:i18n.t(200328/*请选择一条数据进行操作*/),type:'error'});
		}else if( select.length > 1 ){
			ServiceTips({text:i18n.t(500220/*不支持批量操作!*/),type:'error'});
		}else{
			Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
					  done: () => {
						    apiForm(API_FOODING_ERP,'/ordercredit/delete',{billId:this.refs.product.getSelectArr()[0].billId},(response)=>{
						    	that.getPage();
						    	ServiceTips({text:response.message,type:'success'});

						    },(errors)=>{
						    	ServiceTips({text:errors.message,type:'error'});
						    });
						},
						close:() => {
						}
			});
		}
		
		

	}
	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	onHeaderCellClick(e,data){
		let {checkedRows, selectArr} = this.state;
		if(data.checkedAll){
			selectArr=selectArr.concat(this.state.data);
			selectArr = Array.from(new Set(selectArr));
			checkedRows= this.state.data.map((value,index)=>index);
		}else{
			selectArr=[];
			checkedRows=[];
		}
		this.setState({
			selectArr:selectArr,
			checkedRows:checkedRows,
			choised:data.checkedAll
		})
	}
	onRowClick(record,index,checked){
		let {checkedRows, selectArr} = this.state;
		if(checked){
			selectArr.push(record);
			if(checkedRows.indexOf(index)<0){
				checkedRows.push(index);
			}
		}else{
			selectArr.slice(index,1);
			checkedRows.remove(index);
		}
		this.setState({
			selectArr:selectArr,
			checkedRows:checkedRows
		})
	}
	onRowDoubleClick(record,index,checked){

		let that = this;
		let {navAddTab} =this.props;
		navAddTab({id:7,name:i18n.t(200790/*订单信保详情*/),component:i18n.t(200790/*订单信保详情*/),url:'/ordercorporation/detail'});
		this.props.router.push({
			pathname:'/ordercorporation/detail',
			query:{id:record['billId']},
		});

	}
	handleResize(height){
		let sch=document.body.offsetHeight-72-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
		console.log(scroll);
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(47));
		this.getPage();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}


	// 页面 刷新
	getPage(sData=null){

		let that = this;
		if(sData){
			this.setState({sData:sData,currentPage:1},function(){
				ajax();
			});
		} else{
			ajax();
		}

		// 保存 请求
		function ajax(){
			apiGet(API_FOODING_ERP,'/ordercredit/getPage',Object.assign({pageSize: that.state.pageSize,currentPage: that.state.currentPage},that.state.sData),
				(response)=>{
					that.setState({
						record: response.data.data || [],
						totalPages: response.data.totalPages,
						currentPage: response.data.currentPage
					});
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});
		}
	}


	render(){

		let that = this;
		const {record} = this.state;
		return(<div>
			<FilterHeader getPage={this.getPage}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				<div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys editClick={this.editClick}  deleteClick={this.deleteClick}/>
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
					<Table
						ref = "product"
						columns={this.columns}
						data={record}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
						onRowClick={this.onRowClick}
						onRowDoubleClick={this.onRowDoubleClick}
					/>
					<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
					
				</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(OrderCorporationList);
