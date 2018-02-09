import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';

import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table from "../../../../components/Table";//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层

import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";

// ajax
import {hrefFunc,permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import { I18n } from '../../../../lib/i18n';

class PruchaseNeedList extends Component{

	constructor(props){
		super(props);
		let that = this;
		this.handleResize = this.handleResize.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);

		this.state = {
			scrollHeight:0,
			MeunState:true,
			choised:false,
			checkedRows:[],
			choised:false,
			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
			data:[],
			filter:null,
			sourceNo:this.props.location.query.sourceNo
		};


		this.columns = [{
			title : I18n.t(400008/*销售单号*/),
			dataIndex : "no",
			key : "no",
			width : "5%",
			sort:'sourceNo',
			render(data,row,index){
				return <div className="text-ellipsis">{data}</div>
				// if(row && row.saleAdjustOrderNo){
				// 	return (<div onClick={that.numDetailHandle.bind(this,data)} className="text-ellipsis" style={{color:"red"}}>{data}</div>);
				// }
				// return <div onClick={that.numDetailHandle.bind(this,data)} className="text-ellipsis mail-hover">{data}</div>;
			}
		},{
			title : I18n.t(400011/*销售员*/),
			dataIndex : "saleStaff"+language,
			key : "saleStaff"+language,
			width : "3%",
			sort:'needStaffId',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : I18n.t(100297/*起运港*/),
			dataIndex : "sStatn"+language,
			key : "sStatn"+language,
			width : "5%",
			sort:'sStatnId',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		}
		,{
			title : I18n.t(100298/*目的港*/),
			dataIndex : "eStatn"+language,
			key : "eStatn"+language,
			width : "5%",
			sort:'eStatnId',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : I18n.t(100376/*交易条款*/),
			dataIndex : "incotm"+language,
			key : "incotm"+language,
			width : "4%",
			sort:'incotmId',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : I18n.t(100133/*支付条款*/),
			dataIndex : "payTrm"+language,
			key : "payTrm"+language,
			width : "5%",
			sort:'salePayTrmId',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : I18n.t(100224/*运输方式*/),
			dataIndex : "trans"+language,
			key : "trans"+language,
			width : "3%",
			sort:'transId',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : I18n.t(100379/*产品*/),
			dataIndex : "mtl"+language,
			key : "mtl"+language,
			width : "6%",
			sort:'mtlId',
			render(data,row,index){
				return <div onClick={that.onClickLink.bind(that,row)} className='link-color'>{data}</div>;
			}
		},{
			title :I18n.t(500065/*需求数量*/),
			dataIndex : "salQty",
			key : "salQty",
			width : "4%",
			sort:'salQty',
			className:'text-right',
			render(data,row,index){
				return <div className={'text-ellipsis'} title={data+' '+row['uom'+language]}>{data}&nbsp;&nbsp;{row['uom'+language]}</div>;
			}
		},{
			title :I18n.t(200313/*体积*/)+"(CBM)",
			dataIndex : "vol",
			key : "vol",
			width : "4%",
			sort:'vol',
			className:'text-right',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title :I18n.t(200314/*毛重*/)+"(KGS)",
			dataIndex : "grosWt",
			key : "grosWt",
			width : "4%",
			sort:'grosWt',
			className:'text-right',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title :I18n.t(200315/*件数*/),
			dataIndex : "packQty",
			key : "packQty",
			width : "3%",
			sort:'packQty',
			className:'text-right',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : I18n.t(400013/*需求装运日*/),
			dataIndex : 'ariveDate',
			key : 'ariveDate',
			width : "5%",
			sort:'ariveDate',
			className:'text-center',
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : I18n.t(100230/*状态*/),
			dataIndex : "statusName",
			key : "statusName",
			width : "3%",
			sort:'status',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : I18n.t(600164/*出运信息*/),
			dataIndex : "sourceId",
			key : "sourceId",
			width : "4%",
			sort:'sourceId',
			render(data,row,index){
				return <div onClick={hrefFunc.bind(that,I18n.t(600164/*出运信息*/),`/print/single?single=messageFlow&billId=${row['billId']}`)} style={{textAlign:'center'}} className={'text-ellipsis'} title={I18n.t(600164/*出运信息*/)}>
					<i className="foddingicon fooding-transport-message"></i>
				</div>
			}
		}];
	}

	componentDidMount(){
		this.handleResize()
		window.addEventListener('resize', this.handleResize);
		this.getPages();
    }

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}
		
	handleResize(e,height){
		this.filterHeight = height || this.filterHeight || 50;
		 let sch = document.body.offsetHeight - this.filterHeight - 92;
         let scroll = sch - 90;
		 this.setState({scrollHeight:sch+'px',scroll:scroll});
	}

	//列表初始化
	getPages = (currentPage,order) => {
		let that = this;
		this.columnSort = order = order || this.columnSort;
		let currentP = currentPage||1;

		let params=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm(),order)
		apiGet(API_FOODING_ERP,'/saleorder/getPreShipping',params,(response)=>{
			this.setState({
				data:response.data.data,
				totalPages:response.data.totalPages,
				currentPage:response.data.currentPage,
				totalRecords:response.data.totalRecords
			})
		},(error)=>{
			ServiceTips({text: error.message,type:'error'});
		});
	}

	onClickLink(row){
		let {navAddTab} =this.props;
 		navAddTab({id:7,name:i18n.t(100402/*产品详情*/),component:i18n.t(100402/*产品详情*/),url:'/product/detail'});
  		this.props.router.push({pathname:'/product/detail',query:{id:row.mtlId}});
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


	// 销售单号 查看详情
	numDetailHandle = (num)=>{
		let that = this;
		this.setState({
			showDilaog: true,
			title: I18n.t(400008/*销售单号*/) + i18n.t(500281/*执行情况*/),
			dialogContent: React.createElement(require('../../../BookNeed/components/sourceNoDetail').default,{onCancel:that.onCancel,num:num})
		});
	}

	render(){
		let that = this;
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader   getPages = {this.getPages}
			expandFilter={this.handleResize} normalRef={no => this.normalRef = no}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						{/*<FunctionKeys spearteClick={this.spearteClick} separteClick={this.separteClick} placeClick={this.placeClick} suokuClick={this.suokuClick} tiaozhengClick={this.tiaozhengClick} />*/}
						<Page 
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages} 
							totalRecords={this.state.totalRecords}
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								this.setState({ pageSize: Number.parseInt(num) },()=>this.getPages(currentPage, num));
							}} 
							backClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPages(num));
							}} 
							nextClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPages(num));										
							}}
							goChange={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPages(num));																				
							}}								
						/>
					</div>
					
					<Table
						ref="pruchaseneed"
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						onHeaderSortClick={this.getPages.bind(this, null)}
						scroll={{x:true,y:this.state.scroll}}
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
export default NavConnect(PruchaseNeedList);
