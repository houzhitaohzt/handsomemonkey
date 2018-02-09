import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
class Check extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.getPage = this.getPage.bind(this);
		this.columns = [{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : 'statusName',
			key : "statusName",
			width : '5%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "7%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(400048/*单据编号*/),
			dataIndex : "no",
			key : "no",
			width : "8%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400145/*职员*/),
			dataIndex : "staff"+language,
			key : "staff"+language,
			width : "5%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400025/*仓库*/),
			dataIndex : 'sl'+language,
			key : "sl"+language,
			width : "8%",
			render(data,row ,index){
				return <div>{data}</div>
			}
		},{
			title : i18n.t(400026/*库区*/),
			dataIndex : "st"+language,
			key : "st"+language,
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(400027/*储位*/),
			dataIndex : "slsp"+language,
			key : "slsp"+language,
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(100379/*产品*/),
			dataIndex : 'mtl'+language,
			key : "mtl"+language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400012/*品牌*/),
			dataIndex : 'brand'+language,
			key : "brand"+language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400028/*原供应商*/),
			dataIndex : 'vndBe'+language,
			key : "vndBe"+language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400030/*物料状态*/),
			dataIndex : 'mStats'+language,
			key : "mStats"+language,
			width : "5%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(500125/*货币*/),
			dataIndex : 'purCny'+language,
			key : "purCny"+language,
			width : "5%",
			render(data,row,index){
				return data;
			}
		}];
	}

	initState(){
		return {
			scrollHeight:0,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:[],
			obj:{},
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
		}
	}
	addClick(){
		let {navAddTab} =this.props;
		navAddTab({id:7,name:i18n.t(200419/*盘点单新增*/),component:i18n.t(200419/*盘点单新增*/),url:'/check/add'});
		this.props.router.push('/check/add');
	}
	// 删除
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
				this.deleteAjax(select[0].billId);  // 删除请求
			}
		} else{
			this.deleteAjax(row.billId);  // 右键
		}
	}

	// 删除 请求
	deleteAjax(ID){
		let that = this;
		Confirm(i18n.t(500174/*确认删除已选中的数据？*/), {
			done: () => {
				apiForm(API_FOODING_ERP,'/stocking/delete',{billId: ID},
					(response)=>{							
						ServiceTips({text:response.message,type:'sucess'});
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
	handleClick(e,data){
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:6,name:i18n.t(200411/*盘点单详情*/),component:i18n.t(200411/*盘点单详情*/),url:'/check/detail'});
		this.props.router.push({ pathname: '/check/detail',query:{id:record.billId}});
	}
	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{isPlatform:true, pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/stocking/getPage',object,
				(response)=>{	
					that.setState({	
						data: response.data.data,
						totalPages: response.data.totalPages,
						totalRecords:response.data.totalRecords,
						currentPage: response.data.currentPage 	
					});
				},(errors)=>{
		});
	}
	handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }
	componentDidMount(){
		var that = this;
		this.getPage();
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	render(){
			const data = this.state.data || [];
			let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader getPage ={this.getPage} expandFilter= {this.handleResize} normalRef={no => this.normalRef = no} />
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}/>
						<Page 
							currentPage={this.state.currentPage}
							totalRecords={this.state.totalRecords}
							totalPages={this.state.totalPages} 
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								this.setState({ pageSize: Number.parseInt(num) },()=>this.getPage(currentPage, num));
							}} 
							backClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
							}} 
							nextClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));										
							}}
							goChange={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));																				
							}}								
						/>
					</div>
					<Table
						ref = "product"
						columns={this.columns}
						data={data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
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
export default NavConnect(Check);

