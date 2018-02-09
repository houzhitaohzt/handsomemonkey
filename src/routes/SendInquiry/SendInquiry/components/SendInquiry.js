import React, {Component} from 'react';
import Page from "../../../../components/Page"; //分页
import Confirm from '../../../../components/Dialog/Confirm'; //删除弹层
import '../../../../styles/collapse.css';
import Collapse, {Panel} from 'rc-collapse';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionsKeys from "./FunctionsKeys";
import Checkbox from '../../../../components/CheckBox';
import i18n from '../../../../lib/i18n';

import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiForm, apiGet, permissionsBtn} from '../../../../services/apiCall';

class SendInquiry extends Component{
	constructor(props){
		super(props);
		this.columns = [];

		this.state = {
			showDilaog:false,
			scrollHeight:0,
            selectArr: [],
			data : [],
			showHeader:true,
            record: [],
            activeKey: [],
            productData: {},
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
		};
		this.filterData = {};
		this.addClick=this.addClick.bind(this);
		this.releseClick=this.releseClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.ConfrimClick=this.ConfrimClick.bind(this);
		this.SendPClick=this.SendPClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.handleClick=this.handleClick.bind(this);
		this.onActiveKeyChange=this.onActiveKeyChange.bind(this);
	}

    onActiveKeyChange = activeKey =>{
        let actives = activeKey.filter(da => !~this.state.activeKey.indexOf(da));
        actives.length && this.getOneList(this.state.record.find(da => da.id === actives[0]));
        this.setState({activeKey});
    };

	addClick(){
        let {navAddTab, navRemoveTab} = this.props;
        let name = i18n.t(200000/*新增发出的询盘*/);
        navAddTab({ name: name, component: name, url: '/sendinquiry/edit/add'});
        this.props.router.push({pathname: '/sendinquiry/edit/add'});
	}

	deleteClick(){
        let numArr = this.state.selectArr;
        if( !numArr.length) return Confirm(i18n.t(100434/*请选择一条数据！*/));
        if( parseInt(numArr[0].status) !== 1) return Confirm(i18n.t(200001/*当前状态的询盘数据不可删除!*/));

        Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done: () => {
                ///sendenquiry/delete replace /inquiry/delete
                apiForm(API_FOODING_ERP, '/inquiry/delete', {
                    billId: numArr[0].id
                }, response => {
                    successTips(response.message);
                    this.getPages();
                }, error => {
                    errorTips(error.message);
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

	ConfrimClick(){
		console.log(i18n.t(100460/*确认*/))
	}
	releseClick(){
        let temArr = this.state.selectArr;
        if( !temArr.length) return Confirm(i18n.t(100434/*请选择一条数据！*/));
        if(parseInt(temArr[0].status) === 5) return Confirm(i18n.t(200002/*所选的询盘数据已发布!*/));

        Confirm(i18n.t(200003/*发布后无法撤回, 你确定要发布此询盘吗 ？*/), {
            done: () => {
                // /sendenquiry/release replace /inquiry/release
                apiForm(API_FOODING_ERP, '/inquiry/release', {
                    billId: temArr[0].id
                }, response => {
                    successTips(response.message);
                    this.getPages();
                }, error => {
                    errorTips(error.message);
                })
            }
        });
	}
	SendPClick(){

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
        ///enquiry/mtl/getList replace /inquiry/mtl/getList
	    apiGet(API_FOODING_ERP, '/inquiry/mtl/getList', {
            billId: billId
        }, response => {
            productData[billId] = response.data || [];
            this.setState({productData});
        }, error => {
	        errorTips(error.message);
        })
    };

    getPages(currentPage, size, filter, order) {
        filter = filter || (this.searchForm && this.searchForm.getFieldsValue()) || {};
        order = order || {column: 'billId', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || 0;
        size = size || page.size;
        let params = Object.assign({}, {currentPage: currentPage, pageSize: size}, filter, order, this.filterData);
        // /sendenquiry/getPage replace /inquiry/send/getPage
        apiGet(API_FOODING_ERP, '/inquiry/send/getPage', params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
            this.setState({
                productData: {},
                record: data || [],
                activeKey: (data || []).filter(da => (da.mtls || []).length).map(da => da.id),
                page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            });
        }, error => {
            errorTips(error.message)
        });
    }

    searchCustomer = () => {
        this.getPages();
    };

	checkChange (record, event){//checkbox框选中事件
        event.stopPropagation();
        event.preventDefault();

        // 下面是多条
        // let temArr = this.state.selectArr;
        // let ix;
        // if( (ix = temArr.indexOf(record)) === -1){
			// temArr.push(record)
        // }else{
			// temArr.splice(ix, 1);
        // }
        //erp 只选择一条
        let selectArr = [];
        if(this.state.selectArr.indexOf(record) === -1){
            selectArr.push(record);
        }
		this.setState({selectArr});
	}

	viewClick(dataItem, event){//查看详情
        event.stopPropagation();
        event.preventDefault();

        let {navAddTab} =this.props;
        let name = i18n.t(200004/*发出的询盘*/) + '(' + dataItem.no + ")";
        navAddTab({name,component: name,url:'/sendinquiry/detail/' + dataItem.id});
        this.props.router.push({pathname: '/sendinquiry/detail/' + dataItem.id, query: {id: dataItem.id}});
	}

	handleClick(e,data){
	}

	handleResize(height){
		let sch=document.body.offsetHeight-height-118;
		let scroll=sch-30;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(100));
        this.getPages();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(100));
	}

	render(){
	    const {page, record, productData, selectArr} = this.state;
		return(<div>
            <FilterHeader searchCustomer={ this.searchCustomer} formCall={form => this.searchForm = form}/>
			<div className={'clientcontact-list-body'} style={{height:this.state.scrollHeight}}>
				<div className={'clientcontact-list-body-single'}>
					<div className={'keys-page'}>
						<FunctionsKeys addClick={this.addClick} deleteClick={this.deleteClick} releseClick={this.releseClick}/>
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
					<div className="line"/>
                    {this.state.record.length ?
					<Collapse className="train-action-buttons scroll" style={{height:this.state.scroll}} activeKey={this.state.activeKey}>
					{
						this.state.record.map((dataItem,i)=>{
							return(
							<Panel className="train" key={`${dataItem.id}`} style={{height: 'initial'}}
                                   onItemClick={this.getOneList.bind(this, dataItem)} showArrow={false}
                                   header={
                                    <div className="top" style={{textIndent:'initial', paddingRight: 0}}>

                                        <Checkbox checked={selectArr.indexOf(dataItem) !== -1} style={{marginLeft:'0px'}} onItemClick={this.checkChange.bind(this, dataItem)} className='check-class'/>

                                        <span style={{flex:2}}>
                                            <span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(200005/*询盘编号*/)}</span>
                                            <span style={{color:'#000033'}}>{dataItem.no}</span>
                                        </span>
                                        <span style={{flex:1}}>
                                            <span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(200007/*收到报价*/)}</span>
                                            <span style={{color:'#5594ea'}}>{dataItem.receivedQuoNum || 0}</span>
                                        </span>
                                        <span style={{flex:2}}>
                                            <span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(200008/*有效期*/)}</span>
                                            <span style={{color:'#000033'}}>{new Date(dataItem.validityDate).Format('yyyy-MM-dd')}</span>
                                        </span>
                                        <span style={{flex:2}}>
                                            <span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(100230/*状态*/)}</span>
                                            <span style={{color:'#000033'}}>{dataItem.statusName}</span>
                                        </span>
                                        { permissionsBtn('sendinquiry.detail') ?
                                            <span style={{width: 50,color:'#5594ea',cursor:'pointer'}} onClick={this.viewClick.bind(this, dataItem)}>{i18n.t(100097/*详情*/)}</span>
                                            :
                                            ''
                                        }
                                    </div>
							    }
                            >
                                {
                                    // productData[dataItem.id] ?
                                    //     (
                                        //     productData[dataItem.id].length ?
                                        //     productData[dataItem.id].map((item, ix) =>
                                        //         <div className="bottom" key={`panel_${dataItem.id}_context_${item.billDtlId}`} style={{paddingLeft: 0}}>
                                        //             <span style={{flex:3}}>
                                        //                 <span style={{color:'#888',margin:'0px 10px', width: 65}}>{ix === 0? i18n.t(500061/*产品名称*/): ''}</span>
                                        //                 <span style={{color:'#5594ea'}}>{item.mtlLcName}</span>
                                        //             </span>
                                        //                 <span style={{flex:2}}>
                                        //                 <span style={{color:'#888',margin:'0px 10px', width: 45}}>{ix === 0? i18n.t(200009/*目标价*/): ''}</span>
                                        //                 <span style={{color:'#f33535'}}>{item.aimPrc}{dataItem.cnyLcName}/{item.uomLcName}</span>
                                        //             </span>
                                        //                 <span style={{flex:2}}>
                                        //                 <span style={{color:'#888',margin:'0px 10px', width: 45}}>{ix === 0? i18n.t(200010/*需求量*/): ''}</span>
                                        //                 <span style={{color:'#000033'}}>{item.requireQty}{item.uomLcName}</span>
                                        //             </span>
                                        //                 <span style={{flex:2}}>
                                        //                 <span style={{color:'#888',margin:'0px 10px', width: 30}}>{ix === 0? i18n.t(500067/*包装*/): ''}</span>
                                        //                 <span style={{color:'#000033'}}>{item.packagLcName}</span>
                                        //             </span>
                                        //                 <span style={{flex:2}}>
                                        //                 <span style={{color:'#888',margin:'0px 10px', width: 30}}>{ix === 0? i18n.t(400012/*品牌*/): ''}</span>
                                        //                 <span style={{color:'#000033'}}>{item.brandLcName}</span>
                                        //             </span>
                                        //         </div>
                                        //     ) :  <div className="bottom text-center" style={{display:'block'}} key='panel_0_context_0'><span>No Data!</span> </div>
                                        // ) : <div className="bottom text-center" style={{display:'block'}} key='panel_0_context_1'><span>Loading...</span> </div>

                                        dataItem.mtls ?
                                                (
                                                    dataItem.mtls.length ?
                                                        dataItem.mtls.map((item, ix) =>
                                                                <div className="bottom" key={`panel_${dataItem.id}_context_${item.billDtlId}`} style={{paddingLeft: 0}}>
                                                    <span style={{flex:3}}>
                                                        <span style={{color:'#888',margin:'0px 10px', width: 65}}>{ix === 0? i18n.t(500061/*产品名称*/): ''}</span>
                                                        <span style={{color:'#5594ea'}}>{item.mtlLcName}</span>
                                                    </span>
                                                                    <span style={{flex:2}}>
                                                        <span style={{color:'#888',margin:'0px 10px', width: 45}}>{ix === 0? i18n.t(200009/*目标价*/): ''}</span>
                                                        <span style={{color:'#f33535'}}>{item.aimPrc}{dataItem.cnyLcName}/{item.uomLcName}</span>
                                                    </span>
                                                                    <span style={{flex:2}}>
                                                        <span style={{color:'#888',margin:'0px 10px', width: 45}}>{ix === 0? i18n.t(200010/*需求量*/): ''}</span>
                                                        <span style={{color:'#000033'}}>{item.requireQty}{item.uomLcName}</span>
                                                    </span>
                                                                    <span style={{flex:2}}>
                                                        <span style={{color:'#888',margin:'0px 10px', width: 30}}>{ix === 0? i18n.t(500067/*包装*/): ''}</span>
                                                        <span style={{color:'#000033'}}>{item.packagLcName}</span>
                                                    </span>
                                                                    <span style={{flex:2}}>
                                                        <span style={{color:'#888',margin:'0px 10px', width: 30}}>{ix === 0? i18n.t(400012/*品牌*/): ''}</span>
                                                        <span style={{color:'#000033'}}>{item.brandLcName}</span>
                                                    </span>
                                                                </div>
                                                        ) :  <div className="bottom text-center" style={{display:'block'}} key='panel_0_context_0'><span>No Data!</span> </div>
                                                ) : <div className="bottom text-center" style={{display:'block'}} key='panel_0_context_1'><span>Loading...</span> </div>
                                }
							</Panel>
								)
						})
					}
				</Collapse>
                    : <div className="bottom text-center" style={{display: 'block'}} key='panel_0_context_2'><span>No Data!</span></div>
                    }
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(SendInquiry);

