import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import '../../../../styles/collapse.css';
import Collapse, { Panel } from 'rc-collapse';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FunctionsKeys";
import Checkbox from '../../../../components/CheckBox';
import {I18n} from '../../../../lib/i18n';
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
import {permissionsBtn,apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS, language} from '../../../../services/apiCall';
import xt from '../../../../common/xt';
class OnlineOrderBuyer extends Component{
	constructor(props){
		super(props);
		this.columns = [];
		this.state = {
			showDilaog:false,
			scrollHeight:0,
			data : [],
			showHeader:true,
			record: [],
            activeKey: [],
            productData: {},
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
		}
		this.filterData = {};
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.handleClick=this.handleClick.bind(this);
	}
	onActiveKeyChange = activeKey =>{
        let actives = activeKey.filter(da => !~this.state.activeKey.indexOf(da));
        actives.length && this.getOneList(this.state.record.find(da => da.id === actives[0]));
        this.setState({activeKey});
    };
	addClick(){
		let {navAddTab, navRemoveTab} = this.props;
		navRemoveTab({name:I18n.t(500024/*编辑买家订单*/),component:I18n.t(500024/*编辑买家订单*/),url:'/onlineorderbuyer/edit'});
		navAddTab({id:3,name:I18n.t(500025/*买家订单新增*/),component:I18n.t(500025/*买家订单新增*/),url:'/onlineorderbuyer/edit'});
		this.props.router.push('/onlineorderbuyer/edit');
	}
	deleteClick(e,item){
    	Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done: () => {
                ///nooorder/delete replace  /inquiryorder/delete
                apiForm(API_FOODING_ERP, ' /inquiryorder/delete', {
                    id:e.id
                }, response => {
                    successTips({text:response.message,type:'success'});
                    this.getPages();
                }, error => {
                    errorTips({text:error.message,type:'error'});
                })
            }
        });
	}
	inquiryClick = (record, event) =>{
	    event.stopPropagation();
	    event.preventDefault();
	    let activeKey = [...this.state.activeKey];
	    let ix;
	    if( (ix = activeKey.indexOf(record.id)) === -1){
	        activeKey.push(String(record.id));
            this.getOneList(record, true);
        } else {
	        activeKey.splice(ix, 1);
        }
        this.setState({activeKey});
    };
	viewClick(dataItem, event){//查看详情
		event.stopPropagation();
        event.preventDefault();
		let {navAddTab} =this.props;
		navAddTab({id:3,name:I18n.t(500026/*买家订单详情*/),component:I18n.t(500026/*买家订单详情*/),url:'/onlineorderbuyer/detail'});
		this.props.router.push({pathname: '/onlineorderbuyer/detail', query: {id: dataItem.id}});
	}
	onSaveAndClose(){
	}
	onCancel(that){
		this.setState({
			showDilaog:false
		})
	}
	getOneList = (record, reload = false) => {
	    let billId = record.id;
        let productData = {...this.state.productData};

	    if(!billId || (!reload && productData[billId] && productData[billId].length)) return;
        productData[billId] = null;
        this.setState({productData});
        // /nooorder/mtl/getList replace /inquiryorder/mtl/getList
        apiGet(API_FOODING_ERP, '/inquiryorder/mtl/getList', {billId},
				response => {
            productData[billId] = response.data || [];
            this.setState({productData});
        }, error => {
	        errorTips(error.message);
        })
    };
    checkChange (record, event){//checkbox框选中事件
        event.stopPropagation();
        event.preventDefault();
		this.setState({selectArr: [record]});
	}
    getPages(currentPage, size, filter, order) {
        filter = filter || (this.searchForm && this.searchForm.getFieldsValue()) || {};
        order = order || {column: 'billId', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || this.state.currentPage;
        size = size || page.size;
        let params = Object.assign({}, {currentPage: currentPage, pageSize: size, isPlatform:true, isBuyer:true}, filter, order, this.filterData);
        // /nooorder/getPage replace /inquiryorder/getPage
        apiGet(API_FOODING_ERP, '/inquiryorder/getPage', params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
            this.setState({
                productData: {},
                record: data || [],
                page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            });
        }, error => {
            errorTips(error.message)
        });
    }
	handleClick(e,data){
	}
	onplaceClick = (e) => {
		if(!e.amt){
			//return false;
			Confirm(I18n.t(500027/*产品信息不全,请检查产品信息!*/), {
				close:() => {
					console.log('no, close')
				}
			});

		}else if(!e.receBankAccountLcName && !e.receBankAccountEnName && e.receBankAccountId ==null){
			//return false;
			Confirm(I18n.t(500028/*缺少卖家的收款账号,请编辑,完善一下信息!*/), {
				close:() => {
					console.log('no, close')
				}
			});
			
		}else{
			Confirm(I18n.t(500029/*您确定要下订单吗*/), {
			  done: () => {
                  // /nooorder/doOrder replace /inquiryorder/booking
				    apiForm(API_FOODING_ERP,"/inquiryorder/booking",{id:e.id},response => {
				    	ServiceTips({text:response.message,type:"success"})
				    	this.getPages()
				    },error => {
				    	ServiceTips({text:error.message,type:'error'})
				    })
				},
				close:() => {
					console.log('no, close')
				}
			});
    	}
    }
shallClick = (e) => {
    		Confirm(I18n.t(500030/*您确定要撤单吗*/), {
			  done: () => {
			  	///nooorder/cancleOrder replace /inquiryorder/cancel
				    apiForm(API_FOODING_ERP,"/inquiryorder/cancel",{id:e.id},response => {
				    	ServiceTips({text:response.message,type:"success"})
				    	this.getPages()
				    },error => {
				    	ServiceTips({text:error.message,type:'error'})
				    })
				},
				close:() => {
					console.log('no, close')
				}
			});
    	}
	handleResize = () =>{
		let sch=document.body.offsetHeight-290;
		let scroll=sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	};
	componentDidMount(){
	    this.handleResize();
		window.addEventListener('resize', this.handleResize);
		this.getPages();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}
	 searchCustomer = () => {
        this.getPages();
    };
	render(){
		 const {page, record, productData, selectArr} = this.state;
		 
		return(<div>
			 <FilterHeader searchCustomer={ this.searchCustomer} formCall={form => this.searchForm = form}/>
			<div className={'clientcontact-list-body'}>
				<div className={'clientcontact-list-body-single'}>
					<div className={'keys-page'}>
						<FunctionKeys addClick={this.addClick} />
						<Page totalPages={page.totalPages}
                              currentPage={page.currentPage}
                              totalRecords={page.totalRecords}
                              sizeList={[20, 50, 200]}
                              currentSize={page.size}
                              pageSizeChange={(value) => {
                                  let {page} = this.state;
                                  if (page.size == value) {
                                      return;
                                  }
                                  this.getPages(page.currentPage, value);
                              }} backClick={(v) => {
                            let {page} = this.state;
                            if (page.currentPage == v) {
                                return;
                            }
                            this.getPages(v);
                        }} nextClick={(v) => {
                            let {page} = this.state;
                            if (page.currentPage == v) {
                                return;
                            }
                            this.getPages(v);
                        }}
                              goChange={(v) => {
                                  let {page} = this.state;
                                  if (page.currentPage == v) {
                                      return;
                                  }
                                  this.getPages(v);
                              }}
                        />
					</div>
					<div className="line"></div>
					<div className="train-action-buttons scroll"  style={{height:this.state.scrollHeight}} >
						{
							this.state.record.map((dataItem,i)=>{
								return(
								<div className="train" key={i}>
									<div className="top">
										 <Checkbox  style={{marginLeft:'20px'}} onItemClick={this.checkChange.bind(this, dataItem)} className='check-class'/>
								<span style={{flex:4}}>
									<span style={{color:'#888',margin:'0px 10px'}}>{I18n.t(100325/*订单编号*/)}</span>
									<span style={{color:'#000033'}}>{dataItem.no}</span>
								</span>
								<span style={{flex:3}}>
									<span style={{color:'#888',margin:'0px 10px'}}>{I18n.t(500023/*订单日期*/)}</span>
									<span style={{color:'#000033'}}>{dataItem.billDate}</span>
								</span>
								<span style={{flex:3}}>
									<span style={{color:'#888',margin:'0px 10px'}}>{I18n.t(100224/*运输方式*/)}</span>
									<span style={{color:'#000033'}}>{dataItem["trans"+language]}</span>
								</span>
								<span style={{flex:3}}>
									<span style={{color:'#888',margin:'0px 10px'}}>{I18n.t(100297/*起运港*/)}</span>
									<span style={{color:'#5594ea'}}>{dataItem["sStatn"+language]}</span>
								</span>
								<span style={{flex:4}}>
									<span style={{color:'#888',margin:'0px 10px'}}>{I18n.t(100298/*目的港*/)}</span>
									<span style={{color:'#000033'}}>{dataItem["eStatn"+language]}</span>
								</span>

								{ permissionsBtn('onlineorderbuyer.detail') ? 
									<span style={{flex:1,color:'#5594ea',cursor:'pointer'}} onClick={this.viewClick.bind(this, dataItem)}>{i18n.t(100097/*详情*/)}</span>
									:
									''
								}								
								{
									xt.conditionComponents(dataItem, [
											{
												condition: {key: 'status', value: 1, exp: '=='},
												content: <span key="1" style={{flex:1,color:'#000033',cursor:'pointer'}} >
															{ permissionsBtn('onlineorderbuyer.del') ? 
																<i className={'foddingicon fooding-delete-icon3'} onClick={this.deleteClick.bind(this,dataItem)}  title={I18n.t(100437/*删除*/)}></i>
																:
																''
															}
														</span>
											},
											{
												condition: {key: 'status', value: 1, exp: '=='},
												content: <span key='2' style={{flex:1,color:'#000033',cursor:'pointer'}}>
															{ permissionsBtn('onlineorderbuyer.done') ? 
																<i className={'foddingicon fooding-place'} onClick={this.onplaceClick.bind(this,dataItem)} title={I18n.t(100457/*下单*/)}></i>
																:
																''
															}													
													</span>
											},
											{
												condition: {key: 'status', value: 10, exp: '=='},
												content: <span key='3' style={{flex:1,color:'#000033',cursor:'pointer'}} >
															{ permissionsBtn('onlineorderbuyer.cancel') ? 
																<i className={'foddingicon fooding-shall'} onClick={this.shallClick.bind(this,dataItem)} title={I18n.t(500040/*撤单*/)}></i>
																:
																''
															}													
														</span>
											},

										])
								}
								
								</div>
								<div className="bottom">
									<span style={{flex:3}}>
									<span style={{color:'#888',margin:'0px 10px'}}>{I18n.t(500035/*买方企业*/)}</span>
									<span style={{color:'#5594ea'}}>{dataItem["salBe"+language]}</span>
									
								</span>
								<span style={{flex:3}}>
									<span style={{color:'#888',margin:'0px 10px'}}>{I18n.t(500036/*卖方企业*/)}</span>
									<span style={{color:'#f33535'}}>{dataItem["cc"+language]}</span>
								</span>
								<span style={{flex:2}}>
									<span style={{color:'#888',margin:'0px 10px'}}>{I18n.t(100376/*交易条款*/)}</span>
									<span style={{color:'#000033'}}>{dataItem["incotm"+language]}</span>
								</span>
								<span style={{flex:2}}>
									<span style={{color:'#888',margin:'0px 10px'}}>{I18n.t(500038/*订单金额*/)}</span>
									<span style={{color:'#000033'}}>{dataItem.amt?(dataItem.amt+' '+dataItem["cny"+language]):''}</span>
								</span>
								<span style={{flex:2}}>
									<span style={{color:'#888',margin:'0px 10px'}}>{I18n.t(400049/*业务状态*/)}</span>
									<span style={{color:'#000033'}}>{dataItem.statusName}</span>
								</span>
									</div>
								</div>
									)
							})
						}
					</div>
				</div>
			</div>
			</div>
	)
	}
}
export default NavConnect(OnlineOrderBuyer);

