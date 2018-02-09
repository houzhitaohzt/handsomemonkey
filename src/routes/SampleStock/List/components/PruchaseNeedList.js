import i18n from '../../../../lib/i18n';
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

import TabSwitch from "../../../../components/TabSwitch";
import SamChuKu from './SamChuku';
import SamCaiGou from './SamCaiGou';

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
			title : I18n.t(600216/*样品单号*/),
			dataIndex : "no",
			key : "no",
			width : "3%",
			sort:'sourceNo',
			render(data,row,index){
				return <div className="text-ellipsis">{data}</div>
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
			title : I18n.t(500061/*产品名称*/),
			dataIndex : "mtl"+language,
			key : "mtl"+language,
			width : "7%",
			sort:'mtlId',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : I18n.t(100382/*产品规格*/),
			dataIndex : "basSpeci",
			key : "basSpeci",
			width : "10%",
			//sort:'mtlId',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
				// return <div onClick={that.onClickLink.bind(that,row)} className='link-color'>{data}</div>;
			}
		},{
			title :I18n.t(201083/*数量*/),
			dataIndex : "sendQty",
			key : "sendQty",
			width : "2%",
			// sort:'salQty',
			render(data,row,index){
				return <div className={'text-ellipsis'} title={data+' '+row['uom'+language]}>{data}&nbsp;&nbsp;{row['uom'+language]}</div>;
			}
		},{
			title : I18n.t(100230/*状态*/),
			dataIndex : "specOptStatusName",
			key : "specOptStatusName",
			width : "2%",
			sort:'status',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : I18n.t(500339/*合格*/),
			dataIndex : "isQualified",
			key : "isQualified",
			width : "2%",
			sort:'status',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data ? i18n.t(100141/*是*/) :i18n.t(100142/*否*/) }</div>);
			}
		},{
			title : I18n.t(100336/*备注*/),
			dataIndex : "remark",
			key : "remark",
			width : "3%",
			// sort:'status',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : I18n.t(200098/*操作*/),
			dataIndex : "sourceId",
			key : "sourceId",
			width : "2%",
			sort:'sourceId',
			render(data,row,index){
				return <div>
					{ row['specOptStatus'] == 1 ?
						<i onClick={that.kucunClick.bind(that,row)} className="foddingicon fooding-outinformation" title={I18n.t(600217/*出库信息*/)}></i>					
						:
						<i onClick={that.handleClick.bind(that,row)} className="foddingicon fooding-out" title={I18n.t(500167/*出库*/)}></i>
					}
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
		apiGet(API_FOODING_ERP,'/specimen/getStockOut',params,(response)=>{
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

	// 样品单出库 
	handleClick = (data,e)=> {
		let that = this;

        apiGet(API_FOODING_ERP, '/specimen/getStock',{id: data.billDtlId},
            response => {

				let dialogProps = {
					onSaveAndClose:that.onSaveAndClose,
					onCancel:that.onCancel,
					productData:data,
					businessOne:{ccId:response.data.specimen['ccId']},
					stockData:response['data']
				};

				let caiGouProps = Object.assign({}, dialogProps);
				let chuKuProps = Object.assign({}, dialogProps);

				let tabSwitchArray = [
				    {title:i18n.t(200180/*库存*/),content:<SamChuKu {...chuKuProps}/>},
					{title:i18n.t(100417/*采购*/),content:<SamCaiGou {...caiGouProps}/>}
				];

				this.setState({
					showDilaog : true,
				    title: i18n.t(200181/*样品单出库*/),
				    dialogContent: <TabSwitch TabSwitchArray={tabSwitchArray}/>
				});




				// let content=require('./SamChuku').default;
				// let element=React.createElement(content,{
				// 	onSaveAndClose:that.onSaveAndClose,
				// 	onCancel:that.onCancel,
				// 	productData:data,
				// 	businessOne:{ccId:response.data.specimen['ccId']},
				// 	stockData:response['data']
				// });

				// that.setState({
				// 	showDilaog : true,
				// 	dialogContent: element,
				// 	title: i18n.t(200181/*样品单出库*/),
				// });                
            }, error => {
                ServiceTips({text: error.message,type:'error'});
		})


	}

	//查看库存
	kucunClick = (data,e)=> {

		let content=require('./kucun').default;
        let element=React.createElement(content,{onCancel:this.onCancel,data:data});
        this.setState({
            showDilaog : true,
            dialogContent: element,
            title: i18n.t(600217/*出库信息*/),
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
						//onHeaderSortClick={this.getPages.bind(this, null)}
						scroll={{x:true,y:this.state.scroll}}
					/>
					<Dialog width={1300} visible={this.state.showDilaog} title={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
					</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(PruchaseNeedList);
