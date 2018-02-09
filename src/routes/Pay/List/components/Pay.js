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
import PayPlug from "./PayPlug";
import Templ from './Templ';
import Chakan from './Chakan';
import Select, {Option,ConstMiniSelect} from '../../../../components/Select';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips'; // 提示
class Gather extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.delayClick=this.delayClick.bind(this);
		this.paymentClick=this.paymentClick.bind(this);
		this.chakanClick = this.chakanClick.bind(this);
		var that = this;
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.columns = [{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : 'billDate',
			key : "billDate",
			width : '8%',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{new Date(data).Format('yyyy-MM-dd')}</div>)
			}
		},{
			title : i18n.t(400048/*单据编号*/),
			dataIndex : "no",
			key : "no",
			width : "8%",
			render(data,row,index){

				return <div onClick={that.chakanClick.bind(that,row)}>{data}</div>;
			}
		},{
			title : i18n.t(500129/*源单编号*/),
			dataIndex : "sourceNo",
			key : "sourceNo",
			width : "8%",
			render(data,row,index){
				return data;

			}
		},{
			title : i18n.t(500050/*付款企业*/),
			dataIndex : "payCc"+language,
			key : "payCc"+language,
			width : "10%",
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : i18n.t(400084/*收款单位*/),
			dataIndex : "receiptBe" + language,
			key : "receiptBe" + language,
			width : "15%",
			render(data,row,index){
				return <div>{data}</div>;
			}
		},{
			title : i18n.t(200840/*申请付款时间*/),
			dataIndex : "applyPayDate",
			key : "applyPayDate",
			width : "10%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(200841/*申请付款金额*/),
			dataIndex : "applyAmt",
			key : "applyAmt",
			width : "7%",
			render(data,row,index){
			    	return <div>{data?toDecimal(data)+' '+row["cny"+language]:0+' '+row["cny"+language]}</div>;
			}
		},{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : "statusName",
			key : "statusName",
			width : "5%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200819/*已付金额*/),
			dataIndex : "payAmt",
			key : "payAmt",
			width : "5%",
			render(data,row,index){
				return <div>{data?toDecimal(data)+' '+row["cny"+language]:0+' '+row["cny"+language]}</div>;
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "9%",
			render(data,row,index){
				return (
					<div>
						<i className={row.status==10?'visibility':'foddingicon fooding-payment-last'} onClick={that.paymentClick.bind(that,row)}></i>
						<i className={row.status==10?'visibility':'foddingicon fooding-delay-quote'} onClick={that.countClick.bind(that,row)} style={{marginLeft:row.status==10?'34px':'20px'}}></i>
					</div>
					);
			}
		}];
		this.getPage = this.getPage.bind(this);
		this.countClick = this.countClick.bind(this);
		this.paySave = this.paySave.bind(this);
	}
	countClick(row,e){
		let selectArr = this.state.selectArr;
		let selectData = this.state.selectData;
		let yinfuNum = this.state.yinfuNum;
		let yifuNum = this.state.yifuNum;
		if(selectArr.indexOf(row.billId)>-1){
			selectArr.remove(row.billId);
			for(var i=0;i<selectData.length;i++){
				if(selectData[i].billId == row.billId){
					selectData.splice(i,1);
					yinfuNum -=row.applyAmt;
					yifuNum -=row.payAmt;
				}
			}
		}else {
			if(selectData.length >0){
				if(selectData[0].cnyId == row.cnyId&&selectData[0].payCcId==row.payCcId){
					selectArr.push(row.billId);
					selectData.push(row);
			        yinfuNum +=row.applyAmt;
			        yifuNum +=(row.payAmt?row.payAmt:0);
				}else{
					ServiceTips({text:i18n.t(200830/*付款企业或者币种不一致不能合并付款*/),type:'error'});
				}
			}else {
				selectArr.push(row.billId);
				selectData.push(row);
		        yinfuNum +=row.applyAmt;
		        yifuNum +=(row.payAmt?row.payAmt:0);
			}
		}
		console.log(yifuNum);
		this.setState({
			selectArr:selectArr,
			selectData:selectData,
			yifuNum:yifuNum,
			yinfuNum:yinfuNum
		});
	}
	chakanClick(record,e){
		let content=require('./PayPlug').default;
            let element=React.createElement(content,{onCancel:this.onCancel,DialogContent:1,data:record});
            this.setState({
            	showDilaog:true,
            	onSaveAndClose:false,
                dialogContent:element,
                data:record || {}
            });
	}
	initState(){
		return{
			scrollHeight:0,
			filter:null,
			selectArr:[],
			selectData:[],
			checkedRows:[],
			choised:false,
			data:null,
			MeunState:true,
			record: [],
			pageSize:pageSize,
			currentPage:1,
			yinfuNum:0,
			yifuNum:0,
			getOne:{},
			daifu:0
		}
	}
	// getPage(current,pageS){
	// 	    let that = this;
	// 	    let currentPage = current || 1;
	// 		let pageSize = pageS || this.state.pageSize;
	// 		let object=Object.assign({},{pageSize: pageSize, currentPage: currentPage},
	// 		this.normalRef.getForm());
	// 		apiGet(API_FOODING_ERP,'/payment/getPage',object,
	// 			(response)=>{
	// 				that.setState({
	// 					record: response.data.data,
	// 					totalPages: response.data.totalPages,
	// 					totalRecords:response.data.totalRecords,
	// 					currentPage: response.data.currentPage
	// 				});
	// 			},(errors)=>{
	// 		});


	// }
	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/payment/getPage',object,
				(response)=>{	
					that.setState({	
						record: response.data.data,
						totalPages: response.data.totalPages,
						totalRecords:response.data.totalRecords,
						currentPage: response.data.currentPage 	
					});
				},(errors)=>{
		});
	}
	onSaveAndClose(value){
		let that = this;
		value = Object.assign({},value,{paymentIdList:this.state.selectArr});
		apiPost(API_FOODING_ERP,'/payment/pay',value,(response)=>{
			ServiceTips({text:response.message,type:'sucess'});
			this.setState({
				showDilaog:false,
				selectArr:[],
				selectData:[],
				yinfuNum:0,
				yifuNum:0
			})
			that.getPage();
		},(error)=>{
			ServiceTips({text:error.error,type:'error'});
		})
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	paySave(value){
        //付款保存
         value = Object.assign({},value,{sourceId:this.state.getOne.billId});
         apiPost(API_FOODING_ERP,'/payment/pay',value,(response)=>{
            this.setState({
				showDilaog:false,
				selectArr:[],
				selectData:[],
				yinfuNum:0,
				yifuNum:0
			})
            this.getPage();
            ServiceTips({text:response.message,type:'sucess'});
         },(error)=>{
            ServiceTips({text:error.message,type:'error'});
         })
    }
	paymentClick(record,e){
		 apiGet(API_FOODING_ERP,'/payment/getOne',{billId:record.billId},(response)=>{
		 	let content=require('./PayPlug').default;
            let element=React.createElement(content,{onCancel:this.onCancel,DialogContent:2,getOne:response.data||{},onSaveAndClose:this.paySave});
            this.setState({
                dialogContent:element,
                title:i18n.t(200831/*付款情况*/),
                getOne:response.data||{}
            });
        },(error)=>{

        })
            this.setState({
                showDilaog : true,
                daifu:0,
                title: i18n.t(100132/*付款*/),
                dialogContent: <div></div>,
       		})
	}
	delayClick(row,e){
		if(this.state.selectArr.length>0){
			apiGet(API_FOODING_ERP,'/payment/getPay',{billId:this.state.selectArr.join(',')},(response)=>{
	    	this.setState({
	    		daifu:1,
	    		data:response.data||{}
	    	})
			},(error)=>{

			})
	    	this.setState({
	    		showDilaog : true,
	    		title: i18n.t(100463/*待付*/),
	    		dialogContent: <div></div>,
	    	})
		}else{
			Confirm(i18n.t(200832/*请选择1条数据进行操作*/));
		}

	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({name:i18n.t(200824/*付款单详情*/),component:i18n.t(200824/*付款单详情*/),url:'/pay/detail'});
		this.props.router.push({pathname:'/pay/detail',query:{id:record.billId}});
	}
	handleResize(e, height) {
		 this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 150 - this.filterHeight;
         let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
      
	}
	componentDidMount(){
		this.getPage();
		window.addEventListener('resize', this.handleResize(47));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	render(){
		let {record,daifu,data,page,currentPage} = this.state;
		let com;
		let that = this;
	    if(daifu==1){
	    	com = <Templ onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}
				getOne={data}
				yifuNum={this.state.yifuNum}
				yinfuNum={this.state.yinfuNum}
				deleteClick={this.countClick}
				selectData={this.state.selectData}
				selectArr={this.state.selectArr} />
	    }else{
	    	com = this.state.dialogContent;
	    }
		let count = this.state.selectArr.length;
		return(<div>
			<FilterHeader getPage = {this.getPage}
			normalRef={no => this.normalRef = no}
			expandFilter={this.handleResize}
			/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				<div className="action-buttons">
					<div className={'key-page'}>
						<div className={'oprate-btn'} onClick={this.delayClick}>
							<span className={'btn-group'} style={{fontSize:'20px'}}>
								<label style={{position: 'absolute', top: 0,fontSize: '12px',backgroundColor: 'red',padding: '1px',
    							color:' #fff',borderRadius: '10px',right: 0}} className={count>0?'':'none'}>{count}</label>
								<i className={'foddingicon   fooding-delay-quote'}></i>
							</span>
						</div>
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
						columns={this.columns}
						data={record}
						checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onRowDoubleClick={this.onRowDoubleClick}
					/>
					<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
						{com}
					</Dialog>
				</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(Gather);
