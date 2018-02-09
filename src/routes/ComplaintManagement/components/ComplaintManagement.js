import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import ComplaintManagementPlug from './ComplaintManagementPlug';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList,API_FOODING_HR} from '../../../services/apiCall';
import Loading from "../../../components/Loading";//加载动画
import ServiceTips from "../../../components/ServiceTips";//
import {I18n} from "../../../lib/i18n";
class ComplaintManagement extends Component{
	constructor(props){
		super(props)
		this.handleResize = this.handleResize.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		//this.addClick=this.addClick.bind(this);
		//this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		//this.handleClick=this.handleClick.bind(this);
		var that = this;
		this.getPage =this.getPage.bind(this);
		//this.editClick=this.editClick.bind(this);
        this.shenpiClick = this.shenpiClick.bind(this);
		this.columns = [{
			title :'申请人名称',
			dataIndex : "applyLcName",
			key : "applyLcName",
			width : "13%",
            sort:'applyLcName',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title :'类型',
			dataIndex : "explainTypeName",
			key : "explainTypeName",
			width : "13%",
            sort:'explainTypeName',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data?data:''}</div>);
			}
		},{
			title :'申诉内容',
			dataIndex : "remark",
			key : "remark",
			width : "13%",
            sort:'remark',
			render(data,row,index){
				return <div>{data?data:''}</div>;
			}
		},{
			title : '申诉日期',
			dataIndex : "scheduleDate",
			key : "scheduleDate",
            width : "13%",
            sort:'scheduleDate',
			render(data,row,index){
                if(data){
                    return new Date(data).Format('yyyy-MM-dd')
                }
                return null;
			}
		},{
            title :'状态',
            dataIndex : "statusName",
            key : "statusName",
            width : "10%",
            sort:'statusName',
            render(data,row,index){
                return data;
            }
        }];
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
			checkedData:'',
			data : [],
			pageSize:pageSize,
			currentPage:1,
			info:{}
		}
	}


	/*addClick(){
		this.setState({
				rodalShow : true,
				showHeader:true,
				DialogContent:1,
				showSaveAdd:true,
				showSaveClose:true,
				title:I18n.t(100260*//*交易条款新增*//*),

		})
	}*/
    onSaveAndClose(value,data,isAdd){
        var that = this;
        value=Object.assign({},data,value);
        apiPost(API_FOODING_DS,'/incotm/save',value,(response)=>{
            that.setState({
                rodalShow:!!isAdd
            })
            ServiceTips({text:response.message,type:'success'});
            this.getPage();
        },(errors)=>{
            ServiceTips({text:errors.message,type:'error'});
            that.setState({
                rodalShow:!!isAdd
            })
        })
    }
    onRowDoubleClick(record,index,checked){
        apiGet(API_FOODING_HR,'/explainRegister/getOne',{billId:record.billId},(response)=>{
            this.setState({
                rodalShow : true,
                showHeader:true,
                showSaveAdd:false,
                showSaveClose:false,
                DialogContent:5,
                title:'申诉详情',
                checkedData:response.data||{}
            })
        },(error)=>{

        })
    }
/*	editClick(record){
		var that = this;
		apiGet(API_FOODING_DS,'/incotm/getOne',{id:record.record.id},(response)=>{
			this.setState({
				rodalShow : true,
				showHeader:true,
				DialogContent:0,
				title:I18n.t(100261*//*交易条款编辑*//*),
				showSaveAdd:false,
				showSaveClose:true,
				DialogContent:3,
				checkedData:response.data
			})
		},(error)=>{

		})

	}*/

	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}

    onCancel2 = (that) =>{
        this.setState({
            showDilaogseconds:false
        })
    }

	handleClick(e,data){
		//右键处理
		/*if(data.type == 1){
			this.deleteClick(data);
		}else if(data.type ==2){
  			this.editClick(data);
  		}*/
	}

	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{isPlatform:true, pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_HR,'/explainRegister/getPage',object,
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
    shenpiClick = () => {
        //e.stopPropagation && e.stopPropagation();
        let {getOne = {}} = this.state;
        let billId = getOne.billId,billType = getOne.billType;
        let content = require('../../PruchaseOrder/Detail/Content/components/ApprovalDialog').default;
        let element = React.createElement(content, {onCancel: this.onCancel2,billType:1,billId:334});
        this.setState({
            showDilaogseconds: true,
            title: i18n.t(100470/*查看审批*/),
            dialogContents: element,
            showHeader:true
        })
    };
	render(){
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage} expandFilter= {this.handleResize} info = {this.state.info}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						{/*<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}/>*/}
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

						<Table ref="TermsOfTrade"
							columns={this.columns}
							data={this.state.data}
							checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
							colorFilterConfig={{show : false,dataIndex:'colorType'}}
							followConfig={{show:false}}
							scroll={{x:true,y:this.state.scroll}}
                               onRowDoubleClick={this.onRowDoubleClick}
							/*onHeaderCellClick={this.onHeaderCellClick}
							onRowClick={this.onRowClick}

							contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									permissions:'incotm.del',
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{I18n.t(100437*//*删除*//*)}</div>,
									data:{type:1,title:I18n.t(100437*//*删除*//*)}
									},{
										permissions:'incotm.edit',
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{I18n.t(100439*//*编辑*//*)}</div>,
										data:{type:2,title:I18n.t(100439*//*编辑*//*)}
									}]
							}}*/
						/>
						<Dialog width={926}  visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader} titleRight={<i className="foddingicon fooding-approve" style={{cursor:'pointer',color:'#0066cc'}} title ={'查看审批'} onClick={this.shenpiClick}></i>}>
							<ComplaintManagementPlug DialogContent={this.state.DialogContent}
								 checkedData = {this.state.checkedData}
								 info = {this.state.info}
								  showSaveAdd ={this.state.showSaveAdd}
								 showSaveClose={this.state.showSaveClose}
								 buttonLeft = {this.state.buttonLeft}
								 upload ={this.getPage}
								  onSaveAndClose ={this.onSaveAndClose}
								  contentDate = {this.state.contentDate}
								  onCancel = {this.onCancel}
                            />

						</Dialog>
                      <Dialog width={976} visible={this.state.showDilaogseconds} title={this.state.title}>
                          {this.state.dialogContents}
                      </Dialog>
					</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(ComplaintManagement);
