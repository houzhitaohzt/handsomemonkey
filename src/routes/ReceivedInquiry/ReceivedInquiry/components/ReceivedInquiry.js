import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import Page from "../../../../components/Page"; //分页
import Dialog from '../../../../components/Dialog/Dialog'; //弹层
import Confirm from '../../../../components/Dialog/Confirm'; //删除弹层
import '../../../../styles/collapse.css';
import Collapse, {Panel} from 'rc-collapse';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import ReceivedAllotEdit from './ReceivedAllotEdit';
import {errorTips} from "../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiForm, apiGet, permissionsBtn} from '../../../../services/apiCall';

class ReceivedInquiry extends Component{
	constructor(props){
		super(props);
		this.columns = [];

		this.state = {
			showDilaog:false,
            dialogTitle: '',
            dilogTelmp: null,
			scrollHeight:0,
			data : [],
            businessOne: {},
			showHeader:true,
			selectArr:[],
            record: [],
            activeKey: [],
            productData: {},
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
		};
        this.filterData = {};
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

	onSaveAndClose(){
	    this.getPages();
	    this.onCancel();
	}
	onCancel(that){
		this.setState({showDilaog:false	})
	}

    releseClick = (dataItem, event)=>{
        event.stopPropagation();
        event.preventDefault();
	    if(dataItem.sendStatus === true)
            return Confirm(i18n.t(201289/*该询盘已产生报价，请查看！*/));
        this.setState({
            showDilaog:true,
            dialogTitle: i18n.t(100446/*分配*/),
            businessOne: dataItem
        });
    };

    onSendClick = (dataItem, event)=>{
        event.stopPropagation();
        event.preventDefault();
        if(dataItem.sendStatus === true)
            return Confirm(i18n.t(201289/*该询盘已产生报价，请查看！*/));
        let {navAddTab, navReplaceTab} =this.props;
        Confirm(i18n.t(201290/*你确定要发送此询盘报价吗 ？*/), {
            done: () => {
                // /receiveenquiry/sendQuotation replace /inquiryquote/send
                apiForm(API_FOODING_ERP, '/inquiryquote/send', {
                    billId: dataItem.id
                }, ({data}) => {
                    this.getPages();
                    navAddTab({name:i18n.t(200032/*编辑发出的报价*/),component:i18n.t(200032/*编辑发出的报价*/),url:'/sendquotation/edit'});
                    this.props.router.push({pathname: '/sendquotation/edit', query: {id: data}});
                }, error => {
                    errorTips(error.message);
                })
            }
        });
    };

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
        ///receiveenquiry/getPage replace /inquiry/receive/getPage
        apiGet(API_FOODING_ERP, '/inquiry/receive/getPage', params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
            this.setState({
                productData: {},
                activeKey: (data || []).filter(da => (da.mtls || []).length).map(da => da.id),
                record: data || [],
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
        //     temArr.push(record)
        // }else{
        //     temArr.splice(ix, 1);
        // }
        //erp 只选择一条
        this.setState({selectArr: [record]});
    }

    viewClick(dataItem, event){//查看详情
        event.stopPropagation();
        event.preventDefault();

        let {navAddTab} =this.props;
        navAddTab({id:9,name:i18n.t(200132/*收到的询盘详情*/),component:i18n.t(200132/*收到的询盘详情*/),url:'/receivedinquiry/detail'});
        this.props.router.push({pathname: '/receivedinquiry/detail', query: {id: dataItem.id}});
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
                        <Collapse className="train-action-buttons scroll" style={{height: this.state.scroll}} activeKey={this.state.activeKey}>
                            {
                                this.state.record.map((dataItem, i) => {
                                    return (
                                        <Panel className="train" key={`${dataItem.id}`} style={{height: 'initial', padding: 0}}
                                               onItemClick={this.getOneList.bind(this, dataItem)} showArrow={false}
                                               header={
                                                   <div className="top" style={{textIndent:'initial', paddingRight: 0}}>
                                                       <span style={{flex: 2}}>
                                                            <span style={{color: '#888', margin: '0px 10px'}}>{i18n.t(100311/*客户*/)}</span>
                                                            <span style={{color: '#5594ea'}}>{dataItem.ccLcName}</span>
                                                        </span>
                                                       <span style={{flex: 1}}>
                                                            <span style={{color: '#888', margin: '0px 10px'}}>{i18n.t(200005/*询盘编号*/)}</span>
                                                            <span style={{color: '#5594ea'}}>{dataItem.no}</span>
                                                        </span>
                                                       <span style={{flex: 1}}>
                                                            <span style={{color: '#888', margin: '0px 10px'}}>{i18n.t(100288/*发布日期*/)}</span>
                                                            <span style={{color: '#5594ea'}}>{new Date(dataItem.sendDate).Format('yyyy-MM-dd')}</span>
                                                        </span>
                                                       <span style={{flex: 1}}>
                                                            <span style={{color: '#888', margin: '0px 10px'}}>{i18n.t(200008/*有效期*/)}</span>
                                                            <span style={{color: '#5594ea'}}>{new Date(dataItem.validityDate).Format('yyyy-MM-dd')}</span>
                                                        </span>
                                                       <span style={{flex:1}}>
                                                            <span style={{color: '#888', margin: '0px 10px'}}>{i18n.t(100224/*运输方式*/)}</span>
                                                            <span style={{color: '#5594ea'}}>{dataItem.transLcName}</span>
                                                        </span>
                                                       <span style={{width: 160}}>
                                                            <span style={{color: '#888', margin: '0px 10px'}}>{i18n.t(400011/*销售员*/)}</span>
                                                            <span style={{color: '#5594ea'}}>{dataItem.saleLcName}</span>
                                                        </span>
                                                       <span style={{width: 160}}>
                                                        <span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(100230/*状态*/)}</span>
                                                        <span style={{color:'#000033'}}>{dataItem.statusName}</span>
                                                    </span>
                                                       { permissionsBtn('receivedinquiry.detail') ?
                                                        <span style={{color: '#5594ea', cursor: 'pointer', margin:'0px 10px'}}
                                                                onClick={this.viewClick.bind(this, dataItem)}>{i18n.t(100097/*详情*/)}</span>
                                                        :
                                                        ''
                                                       }
                                                       {/*<span style={{width: 40, color: '#5594ea', cursor: 'pointer', marginLeft: '10px'}}*/}
                                                             {/*onClick={this.releseClick.bind(this, dataItem)}>*/}
                                                           {/*{*/}
                                                               {/*dataItem.status !== 1 && !dataItem.saleId?*/}
                                                                   {/*<i className="foddingicon fooding-information2" style={{fontSize: '16px'}}*/}
                                                                      {/*title={i18n.t(100446*//*分配*//*)}/>: null*/}
                                                           {/*}*/}
                                                       {/*</span>*/}
                                                       {/*{ permissionsBtn('receivedinquiry.sendprice') ?*/}
                                                            {/*<span style={{width: 40, color: '#5594ea', cursor: 'pointer'}}*/}
                                                                    {/*onClick={this.onSendClick.bind(this, dataItem)}>*/}
                                                                {/*{*/}
                                                                    {/*dataItem.sendStatus !== true?*/}
                                                                        {/*<i className="foddingicon fooding-quote" style={{fontSize: '16px'}}*/}
                                                                           {/*title={i18n.t(200116*//*报价*//*)}/>: ''*/}
                                                                {/*}*/}

                                                            {/*</span>*/}
                                                            {/*:*/}
                                                            {/*''*/}
                                                       {/*}*/}
                                                   </div>
                                               }
                                        >
                                            {
                                                dataItem.mtls ?
                                                    (
                                                        dataItem.mtls.length ?
                                                            dataItem.mtls.map((item, ix) =>
                                                                    <div className="bottom" style={{paddingLeft: 0}}
                                                                         key={`panel_${dataItem.id}_context_${item.billDtlId}`}>
                                                    <div style={{flex: 2}}>
                                                        <span style={{
                                                            color: '#888',
                                                            margin: '0px 10px',
                                                            width: 56
                                                        }}>{ix === 0 ? i18n.t(500061/*产品名称*/) : ''}</span>
                                                        <span style={{color: '#5594ea'}}>{item.mtlLcName}</span>
                                                    </div>
                                                                        <div style={{flex: 1}}>
                                                        <span style={{
                                                            color: '#888',
                                                            margin: '0px 10px',
                                                            width: 45
                                                        }}>{ix === 0 ? i18n.t(200009/*目标价*/) : ' '}</span>
                                                        <span style={{color: '#f33535'}}>{item.aimPrc}{dataItem.cnyLcName}/{item.uomLcName}</span>
                                                    </div>
                                                                        <div style={{flex: 1}}>
                                                        <span style={{
                                                            color: '#888',
                                                            margin: '0px 10px',
                                                            width: 45
                                                        }}>{ix === 0 ? i18n.t(200010/*需求量*/) : ''}</span>
                                                        <span style={{color: '#000033'}}>{item.requireQty}{item.uomLcName}</span>
                                                    </div>
                                                    <div >
                                                        <span style={{
                                                            color: '#888',
                                                            margin: '0px 10px',
                                                            width: 30
                                                        }}>{ix === 0 ? i18n.t(500067/*包装*/) : ''}</span>
                                                        <span style={{color: '#000033'}}>{item.packagLcName}</span>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <span style={{
                                                            color: '#888',
                                                            margin: '0px 10px',
                                                            width: 30
                                                        }}>{ix === 0 ? i18n.t(400012/*品牌*/) : ''}</span>
                                                        <span style={{color: '#000033'}}>{item.brandLcName}</span>
                                                    </div>
                                                    <div >
                                                        <span style={{
                                                            color: '#888',
                                                            margin: '0px 10px',
                                                            width: 45
                                                        }}>{ix === 0 ? i18n.t(100297/*起运港*/) : ''}</span>
                                                        <span style={{color: '#000033'}}>{dataItem.sStatnLcName}</span>
                                                    </div>
                                                    <div >
                                                        <span style={{
                                                            color: '#888',
                                                            margin: '0px 10px',
                                                            width: 45
                                                        }}>{ix === 0 ? i18n.t(100298/*目的港*/) : ''}</span>
                                                        <span style={{color: '#000033'}}>{dataItem.eStatnLcName}</span>
                                                    </div>
                                                                    </div>
                                                            ) : <div className="bottom text-center" style={{display: 'block'}}
                                                                     key='panel_0_context_0'><span>No Data!</span></div>
                                                    ) :
                                                    <div className="bottom text-center" style={{display: 'block'}} key='panel_0_context_1'>
                                                        <span>Loading... </span></div>
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
                <Dialog visible={this.state.showDilaog} title={this.state.dialogTitle} width={926}>
                    <ReceivedAllotEdit businessOne={this.state.businessOne}
                                       onSaveAndClose={this.onSaveAndClose}
                                       onCancel={this.onCancel}/>
                </Dialog>
		</div>
	)
	}
}
export default NavConnect(ReceivedInquiry);

