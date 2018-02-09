import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";

import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,
	permissionsBtn,sizeList,language,toDecimal} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
class SalesOrderList extends Component{
	constructor(props){
		super(props);
		let that = this;
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.columns = [{
			title : i18n.t(201077/*结算单号*/),
			dataIndex : 'settleNo',
			key : "settleNo",
			width : '7%',
			render(data,row,index){
				return (<div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					title={data}>{data}</div>)
			}
		},{
			title : i18n.t(400011/*销售员*/),
			dataIndex : "saleStaff",
			key : "saleStaff",
			width : "5%",
			render(data,row,index){
				return <div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					title={data}>{data}</div>;
			}
		},{
			title : i18n.t(100133/*支付条款*/),
			dataIndex : "payTrm",
			key : "payTrm",
			width : "12%",
			render(data,row,index){
				return <div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					title={data}>{data}</div>;
			}
		},{
			title : i18n.t(201078/*发运日期*/),
			dataIndex : "shipDate",
			key : "shipDate",
			width : "10%",
			render(data,row,index){
				return <div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					title={data}>{new Date(data).Format('yyyy-MM-dd')}</div>;
			}
		},{
			title : i18n.t(500038/*订单金额*/),
			dataIndex : 'saleAmt',
			key : "saleAmt",
			width : "10%",
			tooltip(data,row,index){
				return <div>
					{
						row.saleAmtDtls.map((value,i)=>{
							return <span key ={i}>{value.costlvtr+':'+toDecimal(value.cost)+' '+value.cny}</span>
						})
					}
				</div>
			},
			render(data,row ,index){
				return <div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					>{data?toDecimal(data):''}</div>;
			}
		},{
			title : i18n.t(200621/*实收金额*/),
			dataIndex : "receAmt",
			key : "receAmt",
			width : "10%",
			tooltip(data,row,index){
				return <div>
					{
						row.receAmtDtls.map((value,i)=>{
							return <span key ={i}>{value.costlvtr+':'+toDecimal(value.cost)+' '+value.cny}</span>
						})
					}
				</div>
			},
			render(data,row,index){
				return (<div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					title={data}>
					{data?toDecimal(data):''}
					</div>)
			}
		},{
			title : i18n.t(100421/*利润额*/),
			dataIndex : 'profitAmt',
			key : 'profitAmt',
			width : "5%",
			tooltip:false,
			render(data,row,index){
				return <div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					>{toDecimal(data)}</div>;
			}
		},{
			title : i18n.t(201082/*采购成本*/),
			tooltip(data,row,index){
				return <Table
						columns={[{
							title : i18n.t(400037/*采购员*/),
							dataIndex : 'purStaff',
							key : "purStaff",
							width : '10%',
							render(data,row,index){
								return <div style={{paddingRight:'20px'}}>{data}</div>;
							}
						},{
							title : i18n.t(100312/*供应商*/),
							dataIndex : 'vndBe',
							key : "vndBe",
							width : '50%',
							render(data,row,index){
								return <div style={{paddingRight:'20px'}}>{data}</div>;
							}
						},{
							title : i18n.t(100379/*产品*/),
							dataIndex : 'mtl',
							key : "mtl",
							width : '7%',
							render(data,row,index){
								return <div style={{paddingRight:'20px'}}>{data}</div>;
							}
						},{
							title : i18n.t(201083/*数量*/),
							dataIndex : 'count',
							key : "count",
							width : '7%',
							render(data,row,index){
								return <div style={{paddingRight:'20px'}}>{data + ' '+row.uom}</div>;
							}
						},{
							title : i18n.t(500325/*采购总额*/),
							dataIndex : 'amt',
							key : "amt",
							width : '7%',
							render(data,row,index){
								return toDecimal(data) + ' '+row.cny;
							}
						}]}
						data={row.purchaseMtls||[]}
						checkboxConfig={{show:false}}
						scroll={{x:false,y:0}}
					/>
			},
			dataIndex : 'purAmt',
			key : 'purAmt',
			width : "5%",
			render(data,row,index){
				return <div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					title={data}>{data?toDecimal(data):''}</div>;
			}
		},{
			title : i18n.t(200720/*信保费*/),
			dataIndex : 'corporationAmt',
			key : 'corporationAmt',
			tooltip(data,row,index){
				return <div>
					{
						row.corporationAmtDtls.map((value,i)=>{
							return <span key ={i}>{value.costlvtr+':'+toDecimal(value.cost)+' '+value.cny}</span>
						})
					}
				</div>
			},
			width : "5%",
			render(data,row,index){
				return <div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					title={data}>{toDecimal(data)}</div>;
			}
		},{
			title : i18n.t(201085/*资金成本*/),
			dataIndex : 'costFunds',
			key : 'costFunds',
			width : "5%",
			tooltip(data,row,index){
				return <div>
					{
						row.costFundsDtls.map((value,i)=>{
							return <span key ={i}>{value.costlvtr+':'+toDecimal(value.cost)+' '+value.cny}</span>
						})
					}
				</div>
			},
			render(data,row,index){
				return <div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					title={data}>{data?toDecimal(data):''}</div>;
			}
		},{
			title : i18n.t(201086/*退税额*/),
			dataIndex : 'taxRefunded',
			key : 'taxRefunded',
			width : "5%",
			render(data,row,index){
				return <div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					title={data}>{toDecimal(data)}</div>;
			}
		},{
			title : i18n.t(201087/*港杂*/),
			dataIndex : 'portCharge',
			key : 'portCharge',
			width : "5%",
			tooltip(data,row,index){
				return <div>
					{
						row.portChargeDtls.map((value,i)=>{
							return <span key ={i}>{value.costlvtr+':'+toDecimal(value.cost)+' '+value.cny}</span>
						})
					}
				</div>
			},
			render(data,row,index){
				return <div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					title={data}>{data?toDecimal(data):''}</div>;
			}
		},{
			title : i18n.t(201088/*运费*/),
			dataIndex : 'freightCharge',
			key : 'freightCharge',
			width : "5%",
			tooltip(data,row,index){
				return <div>
					{
						row.freightChargeDtls.map((value,i)=>{
							return <span key ={i}>{value.costlvtr+':'+toDecimal(value.cost)+' '+value.cny}</span>
						})
					}
				</div>
			},
			render(data,row,index){
				return <div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					title={data}>{data}</div>;
			}
		},{
			title : i18n.t(100488/*其他*/),
			dataIndex : 'otherCharge',
			key : 'otherCharge',
			width : "5%",
			tooltip(data,row,index){
				return <div>
					{
						row.otherChargeDtls.map((value,i)=>{
							return <span key ={i}>{value.costlvtr+':'+toDecimal(value.cost)+' '+value.cny}</span>
						})
					}
				</div>
			},
			render(data,row,index){
				return <div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					title={data}>{toDecimal(data)}</div>;
			}
		},{
			title : i18n.t(100230/*状态*/),
			dataIndex : 'statusName',
			key : 'statusName',
			width : "5%",
			render(data,row,index){
				return <div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					title={data}>{data}</div>;
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : 'saleStaff'+'dd',
			key : 'saleStaff22',
			width : "5%",
			render(data,row,index){
				return <div className={row.modifyDate?"text-ellipsis red":"text-ellipsis"}
					title={data}>
						<i className={(!permissionsBtn('sorder.settlement') || row.status!=5) ?'visibility':'fooding-cop_icon foddingicon'} onClick={that.jiesuanClick.bind(that,row)}>
						</i>
					</div>;
			}
		}];
		this.getPage = this.getPage.bind(this);
		this.jiesuanClick = this.jiesuanClick.bind(this);
		this.exportClick = this.exportClick.bind(this);
	}
	exportClick(){
		let that = this;
		let object;
		let str =API_FOODING_ERP + '/salesettle/export?';
		let pageSize = this.state.pageSize;
		let currentP = this.state.currentPage;
		if(this.normalRef.getForm().salBeId){
		    	object=Object.assign({},{pageSize: pageSize,
		    		currentPage:currentP,sourceNo:this.state.id
		    		},this.normalRef.getForm());
		    }else{
		    	let a = this.normalRef.getForm();
		    	delete a.salBeId;
		    	object=Object.assign({},{pageSize: pageSize,
		    		currentPage:currentP,sourceNo:this.state.id,
		    		},a);
		    }
		for(var key in object){
		   if(object[key]){
			str +=(key+"="+object[key]+"&");
		   }
		}
		console.log(str);
		window.location.href=str;
		// apiGet(API_FOODING_ERP,'/salesettle/export',object,(response)=>{

		// },(error)=>{
		// 	ServiceTips({text:error.message,type:'error'});
		// })
	}
	jiesuanClick(record,e){
		let that = this;
		e.stopPropagation();
		Confirm(i18n.t(201089/*是否确定已结算*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,'/salesettle/finish',{billIds:record.billId},(response)=>{
		    				this.getPage();
		    				ServiceTips({text:response.message,type:'sucess'});
		    		},(error)=>{
		    				ServiceTips({text:error.message,type:'error'});
		    		})
				},
				close:() => {
					console.log('no, close')
				}
		});

	}
	initState(){
		return{
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:[],
			MeunState:true,
			currentPage:1,
			pageSize:20,
			id:this.props.location.query.id
		}
	}
	addClick(){
		let {navAddTab,navRemoveTab} =this.props;
		navRemoveTab({name:i18n.t(200239/*销售订单编辑*/),component:i18n.t(200239/*销售订单编辑*/),url:'/salesorder/addEidt'});
		navAddTab({id:7,name:i18n.t(201054/*销售订单新增*/),component:i18n.t(201054/*销售订单新增*/),url:'/salesorder/addEidt'});
		this.props.router.push({pathname:'/salesorder/addEidt',query:{salBeId:this.props.id}});
	}
	deleteClick(){
		let numArr = this.refs.mainTab.getSelectArr();
        if(numArr.length > 0){
        	Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,'/saleorderreturn/delete',{billID:numArr[0].billId},(response)=>{
		    				this.getPage();
		    				ServiceTips({text:response.message,type:'sucess'});
		    		},(error)=>{
		    				ServiceTips({text:error.message,type:'error'});
		    		})
				},
				close:() => {
					console.log('no, close')
				}
			});
        }
	}
	// ajax list
	getPage(currentPage,value){
		    let that = this;
		    let object;
		    let pageSize = value|| this.state.pageSize;
		    let currentP = !isNaN(currentPage)? currentPage: 1;
		    if(this.normalRef.getForm().salBeId){
		    	object=Object.assign({},{pageSize: pageSize,
		    		currentPage:currentP,sourceNo:this.state.id
		    		},this.normalRef.getForm());
		    }else{
		    	let a = this.normalRef.getForm();
		    	delete a.salBeId;
		    	object=Object.assign({},{pageSize: pageSize,
		    		currentPage:currentP,sourceNo:this.state.id,
		    		},a);
		    }
			apiGet(API_FOODING_ERP,'/salesettle/getPage',object,
				(response)=>{
					that.setState({
						data: response.data.data,
						totalPages: response.data.totalPages,
						currentPage: response.data.currentPage,
						totalRecords:response.data.totalRecords
					});
				},(errors)=>{
			});


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
	onRowDoubleClick(record,index,checked){
		// let {navAddTab} =this.props;
		// navAddTab({id:6,name:'销售退货详情',component:'销售退货详情',url:'/salelist/detail'});
		// this.props.router.push({pathname:'/salelist/detail',query:{id:record.billId}});
	}
	handleResize(e, height) {
		 this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 219 - this.filterHeight;
        this.setState({scroll: scroll});
	}
	componentDidMount(){
		this.getPage();
		window.addEventListener('resize', this.handleResize(47));
    }
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	render(){
		let {data} = this.state;
		let meun;
		let that = this;
		return(<div>
			<FilterHeader id={this.props.id||this.props.businessNo}
			getPage = {this.getPage}
			normalRef={no => this.normalRef = no}
			expandFilter={this.handleResize}
			/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<span style={{display: 'inline-block',lineHeight: '40px',
						 paddingLeft: '50px',color: '#888'}}>{i18n.t(300048/*金额单位*/)+'：CNY'}</span>
						<span style={{fontSize:'16px',paddingLeft:'15px'}} onClick={this.exportClick}>
						<i className='foddingicon fooding-download'></i></span>
						 <Page totalPages={this.state.totalPages}
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
                                />
					</div>
					<Table
						singleSelect ={true}
						columns={this.columns} ref = "mainTab"
						data={data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						onRowDoubleClick={this.onRowDoubleClick}
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
