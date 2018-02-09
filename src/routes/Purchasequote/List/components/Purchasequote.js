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
import UpdatePlug from './UpdatePlug';
import ToQuote from './ToQuote';



// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
class Check extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.addClick=this.addClick.bind(this);
		this.cancalClick=this.cancalClick.bind(this);
		this.updateClick=this.updateClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.getPage = this.getPage.bind(this);
		var that = this;
		this.columns = [{
			title : i18n.t(400048/*单据编号*/),
			dataIndex : "no",
			key : "no",
			width : "8%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100379/*产品*/),
			dataIndex : 'mtl'+language,
			key : "mtl"+language,
			width : "8%",
			render(data,row,index){
				return <a onClick={that.onClickLink.bind(that,row)} className='link-color'>{data}</a>;
			}
		},{
			title : i18n.t(100382/*产品规格*/),
			dataIndex : 'basSpeci',
			key : 'basSpeci',
			width : "22%",
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : i18n.t(100312/*供应商*/),
			dataIndex : 'vndBe'+language,
			key : "vndBe"+language,
			width : "11%",
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
			width : "7%",
			className:'text-right',
			tooltip:'topRight',
			render(data,row,index){
				return (<div>{data?toDecimal(data)+' '+row["cny"+language]:''}</div>)
			}
		},{
            title : i18n.t(600049/*FOB价*/),
            dataIndex : 'fobPrice',
            key : "fobPrice",
            width : "7%",
            className:'text-right',
            tooltip:'topRight',
            render(data,row,index){
                return (<div>{data?toDecimal(data)+' '+'USD':''}</div>)
            }
        },{
            title : i18n.t(100169/*单位*/),
            dataIndex : 'uom'+language,
            key : 'uom'+language,
            width : "7%",
            className:'text-right',
            tooltip:'topRight',
            render(data,row,index){
                return (<div>{data}</div>)
            }
        },{
			title : i18n.t(400037/*采购员*/),
			dataIndex : 'purStaff'+language,
			key : "purStaff"+language,
			width : "7%",
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
				return new Date(data).Format('yy/MM/dd')+' ~ '+new Date(row.eDate).Format('MM/dd');
			}
		},{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : 'statusName',
			key : "statusName",
			width : '7%',
			className:'text-center',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : "status",
			key : "status",
			width : "3%",
			render(data,row,index){
				return ((data == 35) && !row['quoteStatus']) ?
					<div onClick={that.toQuote.bind(that,row)}><i className='foddingicon fooding-delay-quote' title={i18n.t(201056/*待报价*/)}></i></div>
					:'';
			}
		}];
	}

	initState(){
		return {
			active:'', // 弹框类型
			scrollHeight:0,
			rodalShow:false,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:[],
			obj:{},
			pageSize:pageSize,
			currentPage:1,
            dialogContent:<div></div>
		}
	}
	addClick(){
		let {navAddTab} =this.props;
		navAddTab({id:7,name:i18n.t(200778/*供应商报价新增*/),component:i18n.t(200778/*供应商报价新增*/),url:'/purchasequote/add'});
		this.props.router.push('/purchasequote/add');
	}
	onClickLink(row){
		let {navAddTab} =this.props;
 		navAddTab({id:7,name:i18n.t(100402/*产品详情*/),component:i18n.t(100402/*产品详情*/),url:'/product/detail'});
  		this.props.router.push({pathname:'/product/detail',query:{id:row.mtlId}});
	}
	//作废
	cancalClick(react,row){
		let that = this;
		let select = this.refs.product.getSelectArr();

		// 删除 条件判断
		if(react){
			if( select.length == 0 ){
				ServiceTips({text:i18n.t(500115/*请选中一条数据？*/),type:'error'});
			} else if( select.length > 1 ){
				ServiceTips({text:i18n.t(500220/*不支持批量操作!*/),type:'error'});
			} else{
				this.cancalAjax(select[0].billId);  // 作废请求
			}
		} else{
			this.cancalAjax(row.billId);  // 右键
		}
	}
	cancalAjax(ID){
		let that = this;
		Confirm(i18n.t(500178/*你确定执行作废操作吗?*/), {
			done: () => {
				apiForm(API_FOODING_ERP,'/purquotation/drop',{billId: ID},
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
				apiForm(API_FOODING_ERP,'/purquotation/delete',{billId: ID},
					(response)=>{
						ServiceTips({text:'成功！',type:'sucess'});
						that.getPage();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});
	}

	// 自动报价  
	toQuote =(row)=> {
		let that = this;
		let content = React.createElement(require('./ToQuote').default, {
            checkedData : row,
			onSaveAndClose : this.onSaveAndClose,
			onCancel : this.onCancel,
			getPage : this.getPage
		})
		this.setState({
			active:'toQuote',
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			showSaveAdd:false,
			showSaveClose:true,
			title:i18n.t(100398/*自动报价*/),
			dialogContent: content
		})
	    
    }

	// 跟新价格
	updateClick(react,row){
		let that = this;
		let select = this.refs.product.getSelectArr(), effectiveArr = [];
		// 删除 条件判断
		if(react){
			if(select.length == 0 ) return ServiceTips({text:"请至少选择一条数据",type:'error'});

            for( let j = 0; j < select.length; j++){
                if(select[j].status == 35 && Boolean(!select[j].batchNumber)){
                	effectiveArr.push(select[j]);
				}
			}
            if(!effectiveArr.length ) return ServiceTips({text:"没有可更新的数据",type:'error'});
			let content = React.createElement(require('./UpdatePlug').default, {
				checkedDataArr : effectiveArr,
				onSaveAndClose : this.onSaveAndClose,
				onCancel : this.onCancel,
				getPage : this.getPage,
				buttonLeft: this.state.buttonLeft
			});
				this.setState({
					active:'update',
					rodalShow : true,
					showHeader:true,
					DialogContent:1,
					showSaveAdd:false,
					showSaveClose:true,
					title:i18n.t(100450/*更新价格*/),
					dialogContent:content
				})
			}
    }

    // 发布
    releseClick = () => {
		let that = this;
		let selectArr = this.refs.product.getSelectArr();
		if(!selectArr.length) return ServiceTips({text:"请至少选择一条数据",type:'error'});
        for(let i = 0; i < selectArr.length; i++){
            if(selectArr[i].status != 10){
                ServiceTips({text:"请选择已审批进行发布",type:'error'});
                return;
            }
        }
        apiForm(API_FOODING_ERP, "/purquotation/release",{billIds:selectArr.map( e => e.billId)}, response => {
        	let arr = response.data || [];
        	that.releaseView(arr);
		}, error => ServiceTips({text:error.message, type:'error'}));
	};

	/**
	 * 发布成功 和 失败
	 * */
    releaseView = arr => {
    	let temp = "";
    	if(arr.length == 0){
    		temp = <h1 style={{padding:"15px 0px", fontWeight:"normal", fontSize:"30px"}}>发布成功!</h1>
		}else{
    		temp = (<ul style={{color:"#000033", fontSize:"14px", listStyle:"none",paddingBottom: "5px"}}>
				<h2 style={{padding:"10px 0px 15px", fontSize:"26px", fontWeight:"normal"}}>发布失败!</h2>
				{arr.map( (e, i) => {
					return (<li key={i}>报价编号&nbsp;&nbsp;<span style={{color:"#999"}}>{e}</span></li>)
				})}
			</ul>);
		}
        Confirm(temp, {
            showConfirmClose:true,
            showFooter:false,
            confirmLabel:true,
			width:320,
			onClose:this.onClose
        });
	};

	onSaveAndClose(){
		this.setState({
			rodalShow:!this.state.rodalShow
		},this.getPage())
	}
	onCancel(){
		this.setState({
			rodalShow:false
		})
	}
	handleClick(e,data){
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:6,name:i18n.t(201010/*供应商报价详情*/),component:i18n.t(201010/*供应商报价详情*/),url:'/purchasequote/detail'});
		this.props.router.push({ pathname: '/purchasequote/detail',query:{id:record.billId}});
	}
	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let isManageObj = {};
		let currentP = !isNaN(currentPage)?currentPage:1;
		isManageObj = permissionsBtn('purquotation.isManager')?Object.assign({},isManageObj,{isManager:1}):{};
		let object=Object.assign({},{isPlatform:true,pageSize: this.state.pageSize,  currentPage: currentP},that.normalRef.getForm(),isManageObj);
		apiGet(API_FOODING_ERP,'/purquotation/getPage',object,
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

    onClose = () => {
		this.getPage();
	};

	handleResize(e, height) {
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

	render(){
		const data = this.state.data || [];
		let {active,page,currentPage} =this.state;


		return(<div>
			<FilterHeader getPage ={this.getPage}  expandFilter= {this.handleResize} normalRef={no => this.normalRef = no} />
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<div className="oprate-btn">
							{[{
                                type: 'foddingicon fooding-add-icon3',
                                func: this.addClick,
                                permissions: 'purquotation.add',
                                title:i18n.t(100392/*新增*/)
                            }, {
                                type: 'foddingicon fooding-delete-icon4',
                                func: this.deleteClick,
                                permissions: 'purquotation.del',
                                title:i18n.t(100437/*删除*/)
                            }, {
                                type: 'foddingicon fooding-cancal',
                                func: this.cancalClick,
                                permissions: 'purquotation.tovoid',
								title:i18n.t(100471/*作废*/)
                            }, {
                                permissions: 'purquotation.updateprice',
                                type: 'foddingicon fooding-update-date',
                                func: this.updateClick,
                                title: i18n.t(100450/*更新价格*/)
                            },{
                                permissions: 'purquotation.release',
                                type: 'foddingicon fooding-relese',
                                func: this.releseClick,
								title:i18n.t(500257/*发布*/)
                            }].map( (da, i) => {
                            	if(permissionsBtn(da.permissions)){
                                    return (<a className='btn-group'  title={da.title} key={i}>
										<i onClick={da.func} className={da.type}></i>
									</a>)
								}
							})}
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
						ref = "product"
						columns={this.columns}
						data={data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onRowDoubleClick={this.onRowDoubleClick}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
				</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(Check);

{/*<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick} cancalClick={this.cancalClick} updateClick={this.updateClick}/>*/}
