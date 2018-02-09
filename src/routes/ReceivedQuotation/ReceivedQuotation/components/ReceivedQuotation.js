import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import Page from "../../../../components/Page"; //分页
import '../../../../styles/collapse.css';
import Collapse, {Panel} from 'rc-collapse';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import Checkbox from '../../../../components/CheckBox';
import {errorTips} from "../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiGet, getUser, permissionsBtn} from '../../../../services/apiCall';

/**
 * 收到的报价
 */
class ReceivedQuotation extends Component {
    constructor(props) {
        super(props);
        this.columns = [];

        this.state = {
            showDilaog: false,
            scrollHeight: 0,
            selectArr: [],
            data: [],
            showHeader: true,
            record: [],
            activeKey: [],
            productData: {},
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
        };
        this.filterData = {};
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    onActiveKeyChange = activeKey => {
        let actives = activeKey.filter(da => !~this.state.activeKey.indexOf(da));
        actives.length && this.getOneList(this.state.record.find(da => da.billId === parseInt(actives[0])));
        this.setState({activeKey});
    };

    onReClick = (dataItem, event) => {
        event.stopPropagation();
        event.preventDefault();

        let {navAddTab} = this.props;
        navAddTab({
            id: 9,
            name: i18n.t(200025/*收到的报价详情*/),
            component: i18n.t(200025/*收到的报价详情*/),
            url: '/receivedquotation/feedback'
        });
        this.props.router.push({pathname: '/receivedquotation/feedback', query: {id: dataItem.billId}});
    };

    onSaveAndClose() {
    }

    onCancel(that) {
        this.setState({
            showDilaog: false
        })
    }

    getOneList = (record, reload = false) => {
        let billId = record.billId;
        let productData = {...this.state.productData};

        if (!billId || (!reload && productData[billId] && productData[billId].length)) return;
        productData[billId] = null;
        this.setState({productData});

        apiGet(API_FOODING_ERP, '/nooquotation/mtl/getList', {
            billId: record.billId
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
        let params = Object.assign({
            clientId: getUser().staff.ccid,
            isPlatform: true,
            queryStatus: 1
        }, {currentPage: currentPage, pageSize: size}, filter, order, this.filterData);
        apiGet(API_FOODING_ERP, '/nooquotation/getPage', params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
            this.setState({
                productData: {},
                record: data || [],
                activeKey: [],
                page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            });
        }, error => {
            errorTips(error.message)
        });
    }

    searchCustomer = () => {
        this.getPages();
    };

    checkChange(record, event) {//checkbox框选中事件
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
        if (this.state.selectArr.indexOf(record) === -1) {
            selectArr.push(record);
        }
        this.setState({selectArr});
    }

    viewClick(dataItem, event) {//查看详情
        event.stopPropagation();
        event.preventDefault();

        let {navAddTab} = this.props;
        navAddTab({
            id: 9,
            name: i18n.t(200025/*收到的报价详情*/),
            component: i18n.t(200025/*收到的报价详情*/),
            url: '/receivedquotation/detail'
        });
        this.props.router.push({pathname: '/receivedquotation/detail', query: {id: dataItem.billId}});
    }

    handleClick(e, data) {
    }

    handleResize(height) {
        let sch = document.body.offsetHeight - height - 118;
        let scroll = sch - 30;
        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize(100));
        this.getPages();
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(100));
    }

    render() {
        const {page, record, productData, selectArr} = this.state;
        return (<div>
                <FilterHeader searchCustomer={this.searchCustomer} formCall={form => this.searchForm = form}/>
                <div className={'clientcontact-list-body'} style={{height: this.state.scrollHeight}}>
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
                            <Collapse className="train-action-buttons scroll" style={{height: this.state.scroll}}
                                      onChange={this.onActiveKeyChange} activeKey={this.state.activeKey}>
                                {
                                    this.state.record.map((dataItem, i) => {
                                        return (
                                            <Panel className="train" key={`${dataItem.billId}`}
                                                   style={{height: 'initial'}}
                                                   onItemClick={this.getOneList.bind(this, dataItem)} showArrow={false}
                                                   header={
                                                       <div className="top"
                                                            style={{textIndent: 'initial', paddingRight: 0}}>

                                                           <Checkbox checked={selectArr.indexOf(dataItem) !== -1}
                                                                     style={{marginLeft: '0px'}}
                                                                     onItemClick={this.checkChange.bind(this, dataItem)}
                                                                     className='check-class'/>

                                                           <span style={{flex: 2}}>
                                            <span style={{
                                                color: '#888',
                                                margin: '0px 10px'
                                            }}>{i18n.t(100312/*供应商*/)}</span>
                                            <span style={{color: '#5594ea'}}>{dataItem.vndBeLcName}</span>
                                        </span>
                                                           <span>
                                            <span style={{
                                                color: '#888',
                                                margin: '0px 10px'
                                            }}>{i18n.t(200005/*询盘编号*/)}</span>
                                            <span style={{color: '#5594ea'}}>{dataItem.enquiryNo}</span>
                                        </span>
                                                           <span>
                                            <span style={{
                                                color: '#888',
                                                margin: '0px 10px'
                                            }}>{i18n.t(200028/*报价编号*/)}</span>
                                            <span style={{color: '#5594ea'}}>{dataItem.no}</span>
                                        </span>
                                                           <span>
                                            <span style={{
                                                color: '#888',
                                                margin: '0px 10px'
                                            }}>{i18n.t(200008/*有效期*/)}</span>
                                            <span
                                                style={{color: '#5594ea'}}>{new Date(dataItem.validityDate).Format('yyyy-MM-dd')}</span>
                                        </span>
                                                           <span>
                                            <span style={{
                                                color: '#888',
                                                margin: '0px 10px'
                                            }}>{i18n.t(100230/*状态*/)}</span>
                                            <span style={{width: 90, color: '#5594ea'}}>{dataItem.statusName}</span>
                                        </span>
                                                           {permissionsBtn('receivedquotation.detail') ? <span
                                                               style={{color: '#5594ea', cursor: 'pointer', width: 40}}
                                                               onClick={this.viewClick.bind(this, dataItem)}>{i18n.t(100097/*详情*/)}</span> : ''}
                                                           {permissionsBtn('receivedquotation.feedback') ? <span
                                                               style={{color: '#5594ea', cursor: 'pointer', width: 70}}
                                                               onClick={this.onReClick.bind(this, dataItem)}>{i18n.t(200030/*反馈历史*/)}</span> : ''}
                                                       </div>
                                                   }
                                            >
                                                {
                                                    productData[dataItem.billId] ?
                                                        (
                                                            productData[dataItem.billId].length ?
                                                                productData[dataItem.billId].map((item, ix) =>
                                                                    <div className="bottom"
                                                                         key={`panel_${dataItem.billId}_context_${item.billDtlId}`}
                                                                         style={{paddingLeft: 0}}>
                                                                        <div style={{flex: 3}}>
                                                                            <span style={{
                                                                                color: '#888',
                                                                                margin: '0px 10px',
                                                                                width: 56
                                                                            }}>{ix === 0 ? i18n.t(500061/*产品名称*/) : ''}</span>
                                                                            <span
                                                                                style={{color: '#5594ea'}}>{item.mtlLcName}</span>
                                                                        </div>
                                                                        <div style={{flex: 2}}>
                                                                            <span style={{
                                                                                color: '#888',
                                                                                margin: '0px 10px',
                                                                                width: 45
                                                                            }}>{ix === 0 ? i18n.t(200009/*目标价*/) : ''}</span>
                                                                            <span
                                                                                style={{color: '#f33535'}}>{item.aimPrc}{dataItem.cnyLcName}/{item.uomLcName}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span style={{
                                                                                color: '#888',
                                                                                margin: '0px 10px',
                                                                                width: 70
                                                                            }}>{ix === 0 ? i18n.t(200022/*供应商报价*/) : ''}</span>
                                                                            <span
                                                                                style={{color: '#f33535'}}>{item.calPrc}{dataItem.cnyLcName}/{item.uomLcName}</span>
                                                                        </div>
                                                                        <div style={{flex: 2}}>
                                                                            <span style={{
                                                                                color: '#888',
                                                                                margin: '0px 10px',
                                                                                width: 45
                                                                            }}>{ix === 0 ? i18n.t(200010/*需求量*/) : ''}</span>
                                                                            <span
                                                                                style={{color: '#000033'}}>{item.requireQty}{item.uomLcName}</span>
                                                                        </div>
                                                                        <div style={{flex: 2}}>
                                                                            <span style={{
                                                                                color: '#888',
                                                                                margin: '0px 10px',
                                                                                width: 30
                                                                            }}>{ix === 0 ? i18n.t(500067/*包装*/) : ''}</span>
                                                                            <span
                                                                                style={{color: '#000033'}}>{item.packagLcName}</span>
                                                                        </div>
                                                                    </div>
                                                                ) : <div className="bottom text-center"
                                                                         style={{display: 'block'}}
                                                                         key='panel_0_context_0'><span>No Data!</span>
                                                                </div>
                                                        ) :
                                                        <div className="bottom text-center" style={{display: 'block'}}
                                                             key='panel_0_context_1'><span>Loading...</span></div>
                                                }
                                            </Panel>
                                        )
                                    })
                                }
                            </Collapse>
                            : <div className="bottom text-center" style={{display: 'block'}} key='panel_0_context_2'>
                                <span>No Data!</span></div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default NavConnect(ReceivedQuotation);

