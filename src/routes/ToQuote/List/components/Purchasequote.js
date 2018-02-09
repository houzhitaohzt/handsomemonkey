import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import Edit from './Edit';


// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';


class Check extends Component{

	constructor(props){
		super(props);

		let that = this;


		// this state 
		this.state = {
			scrollHeight:0,
			showDilaog :false,
			data:[],
			pageSize:pageSize,
			currentPage:1			
		}

		// this state
		this.columns = [{
			title : i18n.t(400048/*单据编号*/),
			dataIndex : "no",
			key : "no",
			width : "7%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100379/*产品*/),
			dataIndex : 'mtl'+language,
			key : "mtl"+language,
			width : "8%",
			render(data,row,index){
				return <div onClick={that.onClickLink.bind(that,row)} className='link-color'>{data}</div>;
			}
		},{
			title : i18n.t(100382/*产品规格*/),
			dataIndex : 'basSpeci',
			key : 'basSpeci',
			width : "12%",
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : i18n.t(100312/*供应商*/),
			dataIndex : 'vndBe'+language,
			key : "vndBe"+language,
			width : "10%",
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : i18n.t(100297/*起运港*/),
			dataIndex : 'sStatn'+language,
			key : "sStatn"+language,
			width : "7%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(500067/*包装*/),
			dataIndex : 'packag'+language,
			key : "packag"+language,
			width : "10%",
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : i18n.t(200951/*整柜价*/),
			dataIndex : 'fclPrice',
			key : "fclPrice",
			width : "5%",
			className:'text-right',
			tooltip:'topRight',
			render(data,row,index){
				return (<div>{data?toDecimal(data)+' '+row["cny"+language]:''}</div>)
			}
		},{
			title : i18n.t(400037/*采购员*/),
			dataIndex : 'purStaff'+language,
			key : "purStaff"+language,
			width : "6%",
			className:'text-center',
            tooltip:'top',
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100286/*生效日期*/),
			dataIndex : 'sDate',
			key : 'sDate',
			width : "10%",
			className:'text-center',
			render(data,row,index){
				return new Date(data).Format('yy/MM/dd')+' ~ '+new Date(row.eDate).Format('MM/dd');;
			}
		},{
			title : i18n.t(100230/*状态*/),
			dataIndex : 'status',
			key : "status",
			width : '5%',
			className:'text-center',
			render(data,row,index){
				return (<div className="text-ellipsis" title={ data ? i18n.t(700009/*已发送*/) : i18n.t(500344/*未发送*/)}>{ data ? i18n.t(700009/*已发送*/) : i18n.t(500344/*未发送*/)}</div>)
			}
		},{
			title : i18n.t(600240/*报价详情*/),
			dataIndex : 'billId',
			key : "billId",
			width : '5%',
			className:'text-center',
			render(data,row,index){
				return (<div onClick={that.editAjax.bind(that,row,'detail')}><i className='foddingicon fooding-type-mail' title={i18n.t(600240/*报价详情*/)}></i></div>)
			}
		}];
	}

	componentDidMount(){
		var that = this;
		this.getPage();
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
    }
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	handleResize =(e, height)=> {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 190 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }

	// 产品详情 跳转 
	onClickLink =(row)=> {
		let {navAddTab} =this.props;
 		navAddTab({id:7,name:i18n.t(100402/*产品详情*/),component:i18n.t(100402/*产品详情*/),url:'/product/detail'});
  		this.props.router.push({pathname:'/product/detail',query:{id:row.mtlId}});
	}

	// 发送报价
	quoteClick = ()=> {
		let that = this;

		Confirm(i18n.t(600241/*是否确定发送所有报价？*/), {
			done: () => {
				apiForm(API_FOODING_ERP,'/promotequote/send',{},
					(response)=>{
						ServiceTips({text:response.message,type:'sucess'});
						that.getPage();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});
	}


	// 删除
	deleteClick =(react,row)=> {
		let that = this;
		let select = this.refs.product.getSelectArr();

		// 删除 条件判断
		if(react){
			if( select.length == 0 ){
				ServiceTips({text:i18n.t(500115/*请选中一条数据？*/),type:'error'});
			} else if( select.length > 1 ){
				ServiceTips({text:i18n.t(500220/*不支持批量操作!*/),type:'error'});
			} else{
				this.deleteAjax(select[0].id);  // 删除请求
			}
		} else{
			this.deleteAjax(row.id);  // 右键
		}
	}

	// 删除 请求
	deleteAjax(ID){
		let that = this;
		Confirm(i18n.t(500174/*确认删除已选中的数据？*/), {
			done: () => {
				apiForm(API_FOODING_ERP,'/promotequote/delete',{id: ID},
					(response)=>{
						ServiceTips({text:response.message,type:'success'});
						that.getPage();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});
	}

	// 右键
	handleClick =(e,data)=> {

		// 编辑
		if( data.type == 1 ) this.editAjax(data['record'],'edit');

		// 删除
		if( data.type == 2 ) this.deleteClick(data.record);	
		
	}

	// 编辑 
	editAjax = (data,active)=> {
		let that = this;
		
		apiGet(API_FOODING_ERP,'/promotequote/getOne',{id:data.id},
			(response)=>{
				let content=require('./Edit').default;
				let element=React.createElement(content,{
					active:active,
					onSaveAndClose:this.onSaveAndClose,
					onCancel:this.onCancel,
					checkedData:response.data||{},
					getPage:this.getPage
				})
				that.setState({
					showDilaog:true,
					title:i18n.t(100398/*自动报价*/),
					dialogContent:element
				})
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	//请求列表  list
	getPage =(currentPage,objValue)=> {
		let that = this;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
	
		let object=Object.assign({},{isPagable:true,pageSize: this.state.pageSize,  currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/promotequote/getPage',object,
			(response)=>{
				that.setState({
					data: response.data.data,
					totalPages: response.data.totalPages,
					totalRecords:response.data.totalRecords,
					currentPage: response.data.currentPage
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});

	}

	// 保存
	onSaveAndClose =()=> {
		this.setState({
			showDilaog :!this.state.showDilaog 
		})
	}

	// 取消
	onCancel =()=> {
		this.setState({
			showDilaog:false
		})
	}

	render(){
		const data = this.state.data || [];
		let {page,currentPage,dialogContent} =this.state;
		
		return(<div>
			<FilterHeader getPage ={this.getPage}  expandFilter= {this.handleResize} normalRef={no => this.normalRef = no} />
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
					<FunctionKeys deleteClick={this.deleteClick} quoteClick={this.quoteClick} />
						<Page 
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages} 
							totalRecords={this.state.totalRecords}
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
						// onRowDoubleClick={this.onRowDoubleClick}
						contextMenuConfig={{
							enable:true,
							contextMenuId:'SIMPLE_TABLE_MENU',
							menuItems:[{
								permissions:'toQuote.edit',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-alter'}></i><span>{i18n.t(100439/*编辑*/)}</span></div>,
								data:{action:i18n.t(100439/*编辑*/),type:1}
							},{
								permissions:'toQuote.del',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
								data:{action:i18n.t(100437/*删除*/),type:2}
							}]
						}}
					/>
					<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
						{dialogContent}
					</Dialog>
				</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(Check);
