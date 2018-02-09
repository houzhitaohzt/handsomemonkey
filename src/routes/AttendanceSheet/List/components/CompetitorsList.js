import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table from "../../../../components/Table";//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionsKeys from "./FunctionsKeys";


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
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			MeunState:true,
			rodalShow:false,
			showSaveAdd:false,
			showSaveClose:true,
			buttonLeft:I18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:{},
			data : [],
			filter:{},
			pageSize:pageSize,
			currentPage:1
		}

		this.columns = [{
			title: I18n.t(100244/*企业*/),
			dataIndex : 'id',
			key : "id",
			width : '40%',
			render(data,row,index){
				return (<div className="text-ellipsis">{row.company ? row.company['localName']:''}</div>);
			}
		},{
			title : I18n.t(400232/*年度*/),
			dataIndex : "year",
			key : "year",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(600244/*考勤周期*/),
			dataIndex : "name",
			key : "name",
			width : "30%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);								
			}
		},{
			title: I18n.t(600247/*是否封存*/),
			dataIndex : "cycleStates",
			key : "cycleStates",
			width : "20%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data ? data['name'] : ''}</div>);
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


	// 封存
	sealClick = ()=> {

		let select = this.refs.provider.getSelectArr();
		let IDAll = select.map( (o)=>o.id );
		let that = this;

		// 至少一条 
		if( select.length == 0 ){
			Confirm(I18n.t(100434/*请选择一条数据！*/));
			return;
		} 

		// 不支持批量
		if( select.length > 1 ){
			Confirm(I18n.t(500220/*不支持批量操作!*/));
			return;
		}

		Confirm(<div>
			<p style={{textAlign:'left',paddingLeft:'160px'}}>{I18n.t(600321/*以下业务未处理完成*/)}:</p>
			<p>{I18n.t(600322/*加班单审批*/)}、{I18n.t(600323/*休假单审批*/)}、{I18n.t(600324/*申述处理*/)}</p>
			<hr/>
			<br/>
			<p>{I18n.t(600325/*封存后不可撤回，是否确认封存?*/)}</p>
		</div>,{
			confirmLabel:I18n.t(100141/*是*/),
			abortLabel:I18n.t(100142/*否*/),
			done: () => {
				apiForm(API_FOODING_HR,'/attendanceCycleDetail/modifyattendanceCycleDetail',{id: IDAll[0]},
					(response)=>{							
						ServiceTips({text:response.message,type:'sucess'});
						that.getPage();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});	

	}


	//请求列表  list
	getPage = (currentPage,order)=> {
		let that = this;	

		let currentP = currentPage || 1;
		let object=Object.assign({},{pageSize:this.state.pageSize,currentPage:currentP},that.normalRef.getForm());
		apiGet(API_FOODING_HR,'/attendanceCycleDetail/getPage',object,
			(response)=>{
				that.setState({
					data: response.data.data || [],
					totalPages: response.data.totalPages,
					totalRecords:response.data.totalRecords,
					currentPage: response.data.currentPage
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}


	render(){
		let that = this;
		let {data,currentPage,scroll} =this.state;
		return(<div>
			<FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage}  expandFilter= {this.handleResize} info={this.state.info}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionsKeys getPage={this.getPage} sealClick={this.sealClick}/>
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
						ref = "provider"
						columns={this.columns}
						data={data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						//onRowDoubleClick={this.onRowDoubleClick}
					/>

				</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(StafferList);

