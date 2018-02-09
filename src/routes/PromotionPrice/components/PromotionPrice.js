import i18n from '../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
// import FunctionKeys from "./FuncKeys";

import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../services/apiCall";
import ServiceTips from '../../../components/ServiceTips';
class SalesOrderList extends Component{
	constructor(props){
		super(props);
		let that = this;

		// init state
		this.state = {
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:[],
			MeunState:true,
			currentPage:1,
			pageSize:20
		}

		this.columns = [{
			title : i18n.t(100312/*供应商*/),
			dataIndex : 'ccName',
			key : "ccName",
			width : '13%',
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100297/*起运港*/),
			dataIndex : "sStatnName",
			key : "sStatnName",
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100298/*目的港*/),
			dataIndex : "eStatnName",
			key : "eStatnName",
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(200861/*产品代码*/),
			dataIndex : 'mtlCode',
			key : "mtlCode",
			width : "5%",
			render(data,row ,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100379/*产品*/),
			dataIndex : "mtlName",
			key : "mtlName",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100382/*产品规格*/),
			dataIndex : 'basSpeci',
			key : 'basSpeci',
			width : "6%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(600049/*FOB价*/),
			dataIndex : 'fobPrc',
			key : "fobPrc",
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data ? data.toFixed(6) : 0}{' '}{row['cnyName']}</div>);
			}
		},{
			title : 'CIF'+i18n.t(200065/*价格*/),
			dataIndex : 'cifPrc',
			key : "cifPrc",
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data ? data.toFixed(6) : 0}{' '}{row['cnyName']}</div>);
			}
		},{
			title : i18n.t(100287/*失效日期*/),
			dataIndex : "eDate",
			key : "eDate",
			width : "5%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		}];

	}


	// ajax list
	getPage = (search={})=>{
		    let that = this;

			apiGet(API_FOODING_ERP,'/promoteprice/getCustomerOffers',Object.assign({},search),
				(response)=>{
					that.setState({
						data: response.data,
						// totalPages: response.data.totalPages,
						// currentPage: response.data.currentPage,
						// totalRecords:response.data.totalRecords
					});
				},(errors)=>{
			});


	}

	handleResize = (e, height)=> {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 190 - this.filterHeight;
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

	// 销售单号 查看详情
	numDetailHandle = (num)=>{
		
	}

	render(){
		let {data} = this.state;
		let that = this;


		return(<div>
			<FilterHeader
			id={this.props.id||this.props.businessNo||this.props.offerId}
			getPage = {this.getPage} normalRef={no => this.normalRef = no}
			expandFilter={this.handleResize}
			/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						{/*<FunctionKeys businessNo={this.props.businessNo} offerId ={this.props.offerId} addClick={this.addClick} deleteClick={this.deleteClick}/>*/}
						 {/*<Page totalPages={this.state.totalPages}
                                      currentPage={this.state.currentPage}
                                      totalRecords={this.state.totalRecords}
                                      currentSize={this.state.size}
                                      pageSizeChange={(value) => {
                                          if (this.state.size == value) {
                                              return;
                                          }
                                          this.getPage(this.state.currentPage, value);
                                      }} backClick={(v) => {
                                    if (this.state.currentPage == v) {
                                        return;
                                    }
                                    this.getPage(v);
                                }} nextClick={(v) => {
                                    if (this.state.currentPage == v) {
                                        return;
                                    }
                                    this.getPage(v);
                                }}
                                      goChange={(v) => {
                                          if (this.state.currentPage == v) {
                                              return;
                                          }
                                          this.getPage(v);
                                      }}
                                />*/}
					</div>
					<Table
						singleSelect ={true}
						columns={this.columns} 
						ref = "mainTab"
						data={data}
						checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						//onRowClick={this.onRowClick}
						//onRowDoubleClick={this.onRowDoubleClick}
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
export default NavConnect(SalesOrderList);