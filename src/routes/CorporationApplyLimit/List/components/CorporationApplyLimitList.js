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
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';



class CorporationApplyLimitList extends Component{
	constructor(props){
		super(props)
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.onRowClick=this.onRowClick.bind(this);
		this.onHeaderCellClick=this.onHeaderCellClick.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);

		// init Func 
		this.getPage=this.getPage.bind(this);
		
		
		


		this.columns = [{
			title : i18n.t(100354/*客户代码*/),
			dataIndex : 'salBeCode',
			key : "salBeCode",
			width : '7%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(100355/*客户名称*/),
			dataIndex : "salBe"+language,
			key : "salBe"+language,
			width : "20%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(200491/*申请日期*/),
			dataIndex : "billDate",
			key : "billDate",
            sort : "billDate",
			width : "9%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{new Date(data).Format('yyyy-MM-dd')}</div>)
			}
		},{
			title : i18n.t(100230/*状态*/),
			dataIndex : "statusName",
			key : "statusName",
            sort : "status",
			width : "7%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
            title : i18n.t(500207/*赔付比例*/),
            dataIndex : "compenScale",
            key : "compenScale",
            width : "7%",
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        },{
            title : i18n.t(200505/*合同支付方式*/),
            dataIndex : "payTrmCorpTyLcName",
            key : "payTrmCorpTyLcName",
            width : "9%",
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        },{
            title : i18n.t(200506/*信用期限*/),
            dataIndex : "creTerm",
            key : "creTerm",
            width : "9%",
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{(data?data:0)+' '+i18n.t(200519/*天*/)}</div>)
            }
        },{
            title : i18n.t(200492/*已批复限额*/),
            dataIndex : "replyAmt",
            key : "replyAmt",
            width : "9%",
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data?toDecimal(data)+' '+row['cny'+language]:0 +' '+(row['cny'+language]?row['cny'+language]:'')}</div>)
            }
        },{
			title : i18n.t(200525/*信保余额*/),
			dataIndex : 'creditBal',
			key : "creditBal",
			width : "8%",
			render(data,row ,index){
				return (toDecimal(data) || 0) + ' ' + (row['cny'+language]?row['cny'+language]:'');
			}
		},{
            title : i18n.t(100336/*备注*/),
            dataIndex : "remark",
            key : "remark",
            width : "15%",
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
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
			record:[], // table

			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
			billId: '',	
			sData:{},
			getOne:{}, // 单条数据
		}
	}
	addClick(){

		let that = this;
		let {navAddTab} = this.props;
		navAddTab({id:'corporationapplylimit-add',name:i18n.t(200526/*信保限额申请新增*/),component:i18n.t(200526/*信保限额申请新增*/),url:'/corporationapplylimit/add'});
		this.props.router.push({
			pathname:'/corporationapplylimit/add',
			query:{id: ''},
		});

	}

	deleteClick(react,row){
		let that = this;
		let select = this.refs.product.getSelectArr();


		// 删除 条件判断
		if(react){
			if( select.length == 0 ){
				ServiceTips({text:i18n.t(500115/*请选中一条数据？*/),type:'error'});
			} else if( select.length > 1 ){
				ServiceTips({text:i18n.t(500220/*不支持批量操作!*/),type:'error'});
			} else{
				this.deleteAjax(select[0].billId); // 删除 请求
			}
		} else{
			this.deleteAjax(row.billId); // 右键
		}
	}

	// 删除 请求
	deleteAjax(ID){
		let that = this;
		Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			done: () => {
				apiForm(API_FOODING_ERP,'/creditinslimit/delete',{billId: ID},
					(response)=>{	
						ServiceTips({text:response.message,type:'success'});
						that.getPage();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});	
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
			//checkedRows= this.state.data.map((value,index)=>index);
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
		this.setState({billId:record['billId']},function(){
			navAddTab({id:7,name:i18n.t(200516/*信保限额申请详情*/),component:i18n.t(200516/*信保限额申请详情*/),url:'/corporationapplylimit/detail'});
			this.props.router.push({
				pathname:'/corporationapplylimit/detail',
				query:{id:that.state['billId']},
			});
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
	getPage(sData=null,order){

		let that = this;
        this.columnSort = order = order || this.columnSort;
		if(sData){
			this.setState({sData:sData,currentPage:1},function(){
				ajax();
			});
		} else{
			ajax();		
		}
	
		// 保存 请求
		function ajax(){
			apiGet(API_FOODING_ERP,'/creditinslimit/getPage',Object.assign({pageSize: that.state.pageSize,currentPage: that.state.currentPage},that.state.sData,order),
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
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick} />
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
						singleSelect ={true}
						columns={this.columns}
						onHeaderSortClick={this.getPage.bind(this, null)}
						data={record}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
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
export default NavConnect(CorporationApplyLimitList);
