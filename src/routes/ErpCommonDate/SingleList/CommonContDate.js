import React, { Component,PropTypes } from 'react';
const {Table} = require("../../../components/Table");
import Page from "../../../components/Page";
//引入按钮键
import  Confirm from  '../../../components/button/confirm';
//引入弹出层
import  DeleteDialog from '../../../components/Dialog/Confirm';
//引入弹层
import Dialog from '../../../components/Dialog/Dialog';
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_OA,language,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import {I18n} from "../../../lib/i18n";
class CommonContDate extends Component{
	constructor(props){
		super(props);
        props.date && props.date(this);
		this.columns = [{
			title : I18n.t(100145/*创建时间*/),
			dataIndex : 'businessDate',
			key : "businessDate",
			width : '15%',
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : I18n.t(100301/*方向*/),
			dataIndex : "directyp",
			key : "directyp",
			width : "8%",
			render(data,row,index){
				return data == 10?I18n.t(100302/*我方*/):I18n.t(100303/*对方*/);
			}
		},{
			title : I18n.t(100304/*主题*/),
			dataIndex : "title",
			key : "title",
			width : "20%",
			render(data,row,index){
				return (<div className={"text-ellipsis"} title={data}>{data}</div>);
			}
		},{
			title : I18n.t(100307/*预计开始时间*/),
			dataIndex : "expectedStartTime",
			key : "expectedStartTime",
			width : "18%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd hh:mm:ss');
			}
		},{
			title : I18n.t(100308/*预计结束时间*/),
			dataIndex : 'expectedEndTime',
			key : "expectedEndTime",
			width : "18%",
			render(data,row ,index){
				return new Date(data).Format('yyyy-MM-dd hh:mm:ss');
			}
		},{
			title : I18n.t(100361/*分管人*/),
			dataIndex : "responsibleOfficerLcName",
			key : "responsibleOfficerLcName",
			width : "13%",
			render(data,row,index){
				return data;
			}
		}];
		this.state = {
			scroll:0,
			paddingTop:0,
			checkedRows:[],
			data : [],
			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
		}
	}
	static PropTypes = {
	}
	static defaultProps = {
	  activityType: 10, //活动类型 activityType (integer, optional): 活动类型,值为:10-约会/20-联络/30-响应/40-日程,
	  originalId:'', //源单编号
	  originalType:"", //源单类型
	  salBeId:"", //客户ID
	  salBeName:"", //客户名称
	  username:"", //用户user
	  fromDate:"", //从
	  toDate:"", //到
	  salBeLcName:'',
	  typeNumber:10, //判断哪一个进入的编辑页面
	  isDt:false //true时，表明不是在某一个详情里面进入的,而是在路由页面点击进入
	}
	addClick = () => {
		let that = this,title;
		let {navAddTab, navRemoveTab,navReplaceTab} = that.props; 
	     navRemoveTab({name:I18n.t(100439/*编辑*/) + I18n.t(100587/*约会*/),component:I18n.t(100439/*编辑*/) + I18n.t(100587/*约会*/),url:'/cdateerp/edit'});
	     navAddTab({ name: I18n.t(100392/*新增*/) + I18n.t(100587/*约会*/), component: I18n.t(100392/*新增*/) + I18n.t(100587/*约会*/), url: '/cdateerp/edit'});
	     that.props.router.push({pathname:'/cdateerp/edit',query:{salBeId:this.props.salBeId,originalId:this.props.originalId,originalType:this.props.originalType,activityType:this.props.activityType,salBeLC:encodeURIComponent(this.props.salBeLcName),salBeEN:encodeURIComponent(this.props.salBeEnName),typeNumber:this.props.typeNumber,isDt:this.props.isDt}});
    }
    onRowDoubleClick = (record,index,checked) => {
		let {navRemoveTab,navAddTab,activityType} =this.props;
		navRemoveTab({name:I18n.t(100587/*约会*/) + I18n.t(100097/*详情*/),component:I18n.t(100587/*约会*/) + I18n.t(100097/*详情*/),url:'/cdateerp/detail'});
	    navAddTab({ name:I18n.t(100587/*约会*/) + I18n.t(100097/*详情*/), component: I18n.t(100587/*约会*/) + I18n.t(100097/*详情*/), url: '/cdateerp/detail'});
        this.props.router.push({pathname: '/cdateerp/detail', query: {scheduleId:record.id,salBeId:this.props.salBeId,originalId:this.props.originalId,originalType:this.props.originalType,activityType:this.props.activityType,salBeLC:encodeURIComponent(this.props.salBeLcName),salBeEN:encodeURIComponent(this.props.salBeEnName),typeNumber:this.props.typeNumber,isDt:this.props.isDt}});
	}
	//删除数据
    deleteClick = () => {
    	let that = this;
    	let num = that.refs['commonContDate'+ this.props.type + this.props.activityType].getSelectArr();
    	let tempString = "", id = [];
    	if(!num.length){
    		ServiceTips({text:I18n.t(100394/*请选择数据！*/),type:'error'});
    		return false;
    	}else if(num.length == 1){
    		 tempString = I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
    	}else{
    		tempString = I18n.t(100395/*已选中*/) +num.length + I18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
    	}
    	id = num.map( e => e.id);
    	DeleteDialog(tempString, {
			done: () => {
			    apiForm(API_FOODING_OA,'/activity/deletes',{id:id},response => {
			    	that.getPages();
			    },error => ServiceTips({text:error.message,type:'error'}))
			}
		  });
    }
    //拉取数据
    getPages = (currentPage,size,filter,order,props = this.props) => {
		if(props.typeNumber != 40 && !props.salBeId) return false;
    	let that = this;
		filter=filter||{};
		order=order||{column:'id',order:'desc'};
		currentPage = currentPage||this.state.currentPage;
		size=size||this.state.pageSize;
		let params=Object.assign({},{currentPage:currentPage,pageSize:size,activityType:props.activityType,
            sourceId:props.originalId,
            sourceType:props.originalType,
			salBeId:props.salBeId/*,
			salBeName:this.props.salBeName,
			fromDate:this.props.fromDate,
			toDate:this.props.toDate*/},filter,order,this.filterData)
		apiGet(API_FOODING_OA,'/activity/getList',params,(response)=>{
			let data = response.data || {};
			this.setState({
				data:data.data || [],
				pageSize:data.pageSize,
				totalPages:data.totalPages,
				currentPage:data.currentPage,
				totalRecords:data.totalRecords
			})
		},error =>{
			ServiceTips({text: error.message,type:'error'});
		});
	}
	handleResize(height){
		let padding = 230;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-100;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
		if(!this.props.isDetail){
            this.getPages();
		}
        this.handleResize(0);
		// window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
    	// window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		// window.addEventListener('resize', this.handleResize(0));
		if(this.props.activityType !== nextProps.activityType || this.props.salBeId !== nextProps.salBeId || this.props.typeNumber !== nextProps.typeNumber || this.props.originalId !== nextProps.originalId){
			if(!this.props.isDetail){
                this.getPages(undefined,undefined,undefined,undefined,nextProps);
			}
		}
  	}
	render(){

		let {pageIdent} = this.props;

		// 权限按钮 
		switch(pageIdent){
			case 'client' :  // 客户
				var iconArray = [{type:'add',onClick:this.addClick,permissions:'clien.dtl.add'},{type:'delete',onClick:this.deleteClick,permissions:'clien.dtl.del'}];
			break;
			default:
				var iconArray = [{type:'add',onClick:this.addClick},{type:'delete',onClick:this.deleteClick}];
				
		}

		return (
			<div className="contact-fluid">
				<div className='content-margin'></div>
				<div className="contact-body" style = {{height:this.state.scrollHeight}}>
					<Confirm iconArray ={iconArray}/>
					<Page 
						currentPage={this.state.currentPage}
						totalPages={this.state.totalPages} 
						sizeList={sizeList}
						currentSize={this.state.pageSize}
						pageSizeChange={(num)=>{
							if(this.state.currentPage == num) return;	
							this.getPages(this.state.currentPage,num);
						}} 
						backClick={(num)=>{
							if(this.state.currentPage == num) return;
							this.getPages(num);
						}} 
						nextClick={(num)=>{
							if(this.state.currentPage == num) return;
							this.getPages(num);									
						}}
						goChange={(num)=>{
							if(this.state.currentPage == num) return;
							this.getPages(num);																				
						}}								
					/>
					<div className="action-contact-buttons">
						<Table
							ref={'commonContDate'+ this.props.type + this.props.activityType}
							columns={this.columns}
							scroll={{x:true,y:this.state.scroll}}
							data={this.state.data || []}
							onRowDoubleClick={this.onRowDoubleClick}
							checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
							colorFilterConfig={{show : false}}
							followConfig={{show:false}}
							style={{width:'100%'}}
						/>
					</div>
				</div>
			</div>
		)
	}
}
export default NavConnect(CommonContDate);
