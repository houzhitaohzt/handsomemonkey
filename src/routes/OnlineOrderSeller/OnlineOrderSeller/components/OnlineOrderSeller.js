import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import Checkbox from '../../../../components/CheckBox';
import OnlineOrderClose from './onlineOrderClose'// 关闭
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
import {permissionsBtn,apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS, language} from '../../../../services/apiCall';
import xt from '../../../../common/xt';
import {I18n } from '../../../../lib/i18n';
class OnlineOrderSeller extends Component{
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
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCloseBusinessCancel = this.onCloseBusinessCancel.bind(this);
        this.onCloseBusinessSave = this.onCloseBusinessSave.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.viewClick=this.viewClick.bind(this);
		this.onTabClick=this.onTabClick.bind(this);
		this.closeClick=this.closeClick.bind(this);
		this.confirmClick=this.confirmClick.bind(this);
		this.reveserClick=this.reveserClick.bind(this);
	}
	onSaveAndClose(){
	}
	onCancel(that){
		this.setState({
			showDilaog:false
		})
	}
	//查看详情
	viewClick(dataItem, event){
		event.stopPropagation();
        event.preventDefault();
		let {navAddTab} =this.props;
		navAddTab({id:3,name:I18n.t(500105/*卖家订单详情*/),component:I18n.t(500105/*卖家订单详情*/),url:'/onlineOrderSeller/detail'});
		this.props.router.push({pathname: '/onlineOrderSeller/detail', query: {id: dataItem.id}});
	}
	confirmClick = (e)=>{
        Confirm(I18n.t(500108/*确认接受订单吗？*/), {
            done: () => {
                ///nooorder/confirm replace /inquiryorder/confirm
                apiForm(API_FOODING_ERP, '/inquiryorder/confirm', {
                    id: e.id
                }, response => {
                    successTips(response.message);
                    this.getPages();
                }, error => {
                    errorTips(error.message);
                })
            }
        });
    };
	closeClick(e,item){
		 this.setState({
                showDilaog: true,
                title:I18n.t(500109/*关闭订单*/),
                dialogContent: <OnlineOrderClose onSaveAndClose={this.onCloseBusinessSave} onCancel={this.onCloseBusinessCancel} otherData={e}/>
        })
	}
	reveserClick(){

	}
	onCloseBusinessSave(){
        this.getPages();
        this.setState({
            showDilaog: false
        })
    }
    onCloseBusinessCancel() {
        this.setState({
            showDilaog: false
        })
    }
	onTabClick(activeTab){
		this.setState({
			currentContentId:activeTab
		})
	}
	getOneList = (record, reload = false) => {
	    let billId = record.id;
        let productData = {...this.state.productData};

	    if(!billId || (!reload && productData[billId] && productData[billId].length)) return;
        productData[billId] = null;
        this.setState({productData});
        // /nooorder/mtl/getList replace /inquiryorder/mtl/getList
        apiGet(API_FOODING_ERP, '/inquiryorder/mtl/getList', {billId}
	   , response => {
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
        let params = Object.assign({}, {currentPage: currentPage, pageSize: size, isPlatform:true, isBuyer:false}, filter, order, this.filterData);
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
	handleResize(height){
		let sch=document.body.offsetHeight-290;
		let scroll=sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(100));
		this.getPages();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(100));
	}
	searchCustomer = () => {
        this.getPages();
    };
	render(){
		 const {page, record, productData, selectArr} = this.state;
		return(<div>
			<FilterHeader searchCustomer={ this.searchCustomer} formCall={form => this.searchForm = form}/>
			<div className={'clientcontact-list-body'} style={{height:this.state.scrollHeight}}>
				<div className={'clientcontact-list-body-single'}>
					<div className={'keys-page'}>
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
								<span style={{flex:4}}>
									<span style={{color:'#888',margin:'0px 10px'}}>{I18n.t(100224/*运输方式*/)}</span>
									<span style={{color:'#000033'}}>{dataItem["trans"+language]}</span>
								</span>
								<span style={{flex:4}}>
									<span style={{color:'#888',margin:'0px 10px'}}>{I18n.t(100297/*起运港*/)}</span>
									<span style={{color:'#5594ea'}}>{dataItem["sStatn"+language]}</span>
								</span>
								<span style={{flex:5}}>
									<span style={{color:'#888',margin:'0px 10px'}}>{I18n.t(100298/*目的港*/)}</span>
									<span style={{color:'#000033'}}>{dataItem["eStatn"+language]}</span>
								</span>
								

								{ permissionsBtn('onlineorderseller.detail') ? 
									<span style={{flex:1,color:'#5594ea',cursor:'pointer'}} onClick={this.viewClick.bind(this, dataItem)}>{I18n.t(100097/*详情*/)}</span>
									:
									''
								}								
								{
									xt.conditionComponents(dataItem, [
											{
												condition: {key: 'status', value: 10, exp: '=='},
												content: <span key='1' style={{flex:1,color:'#000033',cursor:'pointer'}} >
													<i className={'foddingicon fooding-confirm'} onClick={this.confirmClick.bind(this,dataItem)} title={I18n.t(500021/*卖方确认*/)}></i></span>
											},
											{
												condition: {key: 'status', value: 10, exp: '=='},
												content: <span key='2' style={{flex:1,color:'#000033',cursor:'pointer'}} >
													<i className={'foddingicon fooding-close-two'} onClick={this.closeClick.bind(this,dataItem)} title={I18n.t(100432/*关闭*/)}></i></span>
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
					<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
                            {this.state.dialogContent}
                    </Dialog>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(OnlineOrderSeller);

