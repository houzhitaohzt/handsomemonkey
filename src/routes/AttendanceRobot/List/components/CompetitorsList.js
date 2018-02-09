import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Table from "../../../../components/Table";//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FunctionsKeys";


import {apiGet,apiPost,apiForm,API_FOODING_HR,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList} from '../../../../services/apiCall';
import Loading from "../../../../components/Loading";//加载动画
import ServiceTips from "../../../../components/ServiceTips";//提示框
import {I18n} from "../../../../lib/i18n";

class StafferList extends Component{
	constructor(props){
		super(props);
		var that = this;

		this.state = {
			scrollHeight:0,
			data : [],
			pageSize:pageSize,
			currentPage:1
		}

		this.columns = [{
			title: I18n.t(600250/*职员工号*/),
			dataIndex : 'empId',
			key : "empId",
			width : '15%',
			render(data,row,index){
				return (<div className="text-ellipsis">{row['emp'] ? row.emp['code']:''}</div>);
			}
		},{
			title : I18n.t(600251/*职员名称*/),
			dataIndex : "empName",
			key : "empName",
			width : "15%",
			render(data,row,index){
				return (<div className="text-ellipsis">{row['emp'] ? row.emp['localName']:''}</div>);
			}
		},{
			title: I18n.t(600252/*考勤卡号*/),
			dataIndex : "attendCard",
			key : "attendCard",
			width : "15%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);								
			}
		},{
			title: I18n.t(600253/*工作日*/),
			dataIndex : "scheduleDate",
			key : "scheduleDate",
			width : "10%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title: I18n.t(600254/*实际上班时间*/),
			dataIndex : "officeTime",
			key : "officeTime",
			width : "10%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title: I18n.t(600255/*实际下班时间*/),
			dataIndex : "closingTime",
			key : "closingTime",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);								
				//return new Date(data).Format('yyyy-MM-dd');
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

	handleResize = (e, height)=> {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 190 - this.filterHeight;
       let scrollHeight = scroll + 90;
       this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }


	deleteClick = (data)=> {

		let that = this;
        let IDs = this.refs.frexrat.getSelectArr().map(o => o.id);

        if (!IDs.length) {
			ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'error'});
			return;
		}
	
		
		Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			done: () => {
				apiForm(API_FOODING_HR,'/schedule/delete',{ids:IDs},(response)=>{
					ServiceTips({text:response.message,type:'success'});
					that.getPage();					
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
				});
			},
			close:() => {
			}
		});



	}

	// 计算价格 
	priceClick = ()=> {

		let that = this;

		Confirm(I18n.t(200062/*计算价格*/)+'?', {
			done: () => {
				apiForm(API_FOODING_HR,'/record/process',{},
					(response)=>{							
						ServiceTips({text:response.message,type:'sucess'});
						that.getPage();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});	

	}

	onSaveAndClose = (value,data,isAdd)=> {
		var that = this;
		this.getPage();
		this.onCancel();
	}

	onCancel = (that)=> {
		this.setState({
			rodalShow:false
		})
	}






	//请求列表  list
	getPage = (currentPage,order)=> {
		let that = this;	

		let currentP = currentPage || 1;
		let object=Object.assign({},{pageSize:this.state.pageSize,currentPage:currentP},that.normalRef.getForm());
		apiGet(API_FOODING_HR,'/record/getPage',object,
			(response)=>{
				that.setState({
					data: response.data,
					totalPages: response.totalPages,
					totalRecords:response.totalRecords,
					currentPage: response.currentPage
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}


	render(){
		let that = this;
		let {active,page,currentPage,scroll} =this.state;
		
		return(<div>
			<FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage}  expandFilter= {this.handleResize} info={this.state.info}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys 
							that={this} 
							getPage={this.getPage} 
							deleteClick={this.deleteClick} 
							priceClick={this.priceClick}
						/>						 
						<Page
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages}
							totalRecords={this.state.totalRecords}
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								this.setState({ pageSize: Number.parseInt(num) },()=>this.getPage(1,num));
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
						ref ="frexrat"
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show:false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						//onRowDoubleClick={this.onRowDoubleClick}
						//onHeaderSortClick={this.getPage.bind(this, null)}

					/>

				</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(StafferList);

