import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';

import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table from "../../../../components/Table";//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层

import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";

// ajax
import {
    hrefFunc,
    permissionsBtn,
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_ERP,
    API_FOODING_DS,
    language,
    pageSize,
    sizeList
} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import {I18n} from '../../../../lib/i18n';
import xt from "../../../../common/xt";

class PruchaseNeedList extends Component {
    constructor(props) {
        super(props);
        let that = this;
        this.handleResize = this.handleResize.bind(this);
        this.state = this.initState();
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.searchField = xt.getQuerySearch();
        this.onCancel = this.onCancel.bind(this);
        this.columns = [{
            title: I18n.t(400009/*下单日期*/),
            dataIndex: 'billDate',
            key: "billDate",
            width: '5%',
            sort: 'billDate',
            render(data, row, index) {
                if (data) {
                    return new Date(data).Format('yyyy-MM-dd');
                }
                return '------';
            }
        }, {
            title: I18n.t(400008/*销售单号*/),
            dataIndex: "sourceNo",
            key: "sourceNo",
            width: "6%",
            sort: 'sourceNo',
            render(data, row, index) {
                if (row && row.saleAdjustOrderNo) {
                    return (<div onClick={that.numDetailHandle.bind(this, data)} className="text-ellipsis"
                                 style={{color: "red"}}>{data}</div>);
                }
                return <div onClick={that.numDetailHandle.bind(this, data)}
                            className="text-ellipsis mail-hover">{data}</div>;
            }
        }, {
            title: I18n.t(100133/*支付条款*/),
            dataIndex: "salePayTrm" + language,
            key: "salePayTrm" + language,
            width: "8%",
            sort: 'salePayTrmId',
            render(data, row, index) {
                return (<div className={'text-ellipsis'} title={data}>{data}</div>);
            }
        }, {
            title: I18n.t(400011/*销售员*/),
            dataIndex: "needStaff" + language,
            key: "needStaff" + language,
            width: "3%",
            sort: 'needStaffId',
            render(data, row, index) {
                return data;
            }
        }, {
            title: I18n.t(100379/*产品*/),
            dataIndex: "mtl" + language,
            key: "mtl" + language,
            width: "8%",
            sort: 'mtlId',
            render(data, row, index) {
                return <div onClick={that.onClickLink.bind(that, row)} className='link-color'>{data}</div>;
            }
        }, {
            title: I18n.t(100382/*产品规格*/),
            dataIndex: "basSpeci",
            key: "basSpeci",
            width: "8%",
            sort: 'basSpeci',
            render(data, row, index) {
                return (<div className={'text-ellipsis'} title={data}>{data}</div>);
            }
        }, {
            title: I18n.t(400012/*品牌*/),
            dataIndex: "brand" + language,
            key: "brand" + language,
            width: "3%",
            sort: 'brandId',
            render(data, row, index) {
                return data;
            }
        }, {
            title: I18n.t(100319/*采购数量*/),
            dataIndex: "purQty",
            key: "purQty",
            width: "4%",
            sort: 'purQty',
            className: 'text-right',
            render(data, row, index) {
                return <div>{data}&nbsp;&nbsp;{row.uomEnName}</div>;
            }
        }, {
            title: I18n.t(400013/*需求装运日*/),
            dataIndex: 'ariveDate',
            key: 'ariveDate',
            width: "5%",
            sort: 'ariveDate',
            className: 'text-center',
            render(data, row, index) {
                return new Date(data).Format('yyyy-MM-dd');
            }
        }, {
            title: I18n.t(400014/*送达港口*/),
            dataIndex: "statn" + language,
            key: "statn" + language,
            width: "7%",
            sort: 'statnId',
            render(data, row, index) {
                return data;
            }
        }, {
            title: I18n.t(100298/*目的港*/),
            dataIndex: "eStatn" + language,
            key: "eStatn" + language,
            width: "7%",
            sort: 'eStatnId',
            render(data, row, index) {
                return data || "";
            }
        }, {
            title: I18n.t(600164/*出运信息*/),
            dataIndex: "sourceId",
            key: "sourceId",
            width: "4%",
            sort: 'sourceId',
            render(data, row, index) {
                return (row.sourceType == 318 ? <div
                    onClick={hrefFunc.bind(that, I18n.t(600164/*出运信息*/), `/print/single?single=messagePurchase&billId=${row['sourceId']}`)}
                    style={{textAlign: 'center'}} className={'text-ellipsis'} title={I18n.t(600164/*出运信息*/)}>
                    <i className="foddingicon fooding-transport-message"></i>
                </div> : '')
            }
        }];
    }

    initState() {
        return {
            scrollHeight: 0,
            MeunState: true,
            choised: false,
            checkedRows: [],
            choised: false,
            currentPage: 1, // 当前页
            totalPages: 1, // 总页数
            pageSize: pageSize, // 每页 多少条
            data: [],
            filter: null,
            sourceNo: this.props.location.query.sourceNo
        }
    }

    //列表初始化
    getPages = (currentPage, order) => {
        let that = this;
        //filter=filter||this.state.filter;
        //order=order||{column:'billId',order:'desc'};
        this.columnSort = order = order || this.columnSort;
        var sID = sID || '';
        let currentP = currentPage || 1;
        let isManageObj = {};
        isManageObj = permissionsBtn('pruchaseneed.isManager') ? Object.assign({}, isManageObj, {isManager: 1}) : {};
        let params = Object.assign({}, {
            pageSize: this.state.pageSize,
            currentPage: currentP,
            orderType: 10,
            sourceNo: that.state.sourceNo
        }, isManageObj, that.normalRef.getForm(), order, that.searchField)
        apiGet(API_FOODING_ERP, '/purorder/getPage', params, (response) => {
            this.setState({
                data: response.data.data,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                totalRecords: response.data.totalRecords
            })
        }, (error) => {
            ServiceTips({text: error.message, type: 'error'});
        });
    }
    searchCustomer = () => {
        this.searchField = null;
        this.getPages();

    };

    onClickLink(row) {
        let {navAddTab} = this.props;
        navAddTab({id: 7, name: i18n.t(100402/*产品详情*/), component: i18n.t(100402/*产品详情*/), url: '/product/detail'});
        this.props.router.push({pathname: '/product/detail', query: {id: row.mtlId}});
    }

    //合单操作
    spearteClick = () => {
        let that = this;
        let numArr = that.refs.pruchaseneed.getSelectArr();
        if (numArr.length < 2) {
            ServiceTips({text: I18n.t(400015/*请选择至少两条及以上数据！*/), type: 'error'})
            return false;
        }
        Confirm(I18n.t(400016/*您确定要执行合单操作？*/), {
            done: () => {
                apiForm(API_FOODING_ERP, '/purorder/compound', {billIds: numArr.map(e => e.billId)}, response => {
                    ServiceTips({text: response.message, type: "success"});
                    that.getPages();
                }, error => ServiceTips({text: error.message, type: "error"}))
            },
            close: () => {

            }
        })
    }
    //拆单
    separteClick = () => {
        let numArr = this.refs.pruchaseneed.getSelectArr();
        //拆单数量,billId;
        let separteCount = Number(numArr[0] && numArr[0].purQty) || 0;
        if (numArr.length !== 1) {
            ServiceTips({text: I18n.t(100434/*请选择一条数据！*/), type: "error"});
            return false;
        } else if (separteCount <= 0) {
            ServiceTips({text: I18n.t(400017/*数据不大于零，不能进行拆单操作*/), type: "error"});
            return false;
        }
        let content = require('./PurchaseSplitDialog').default;
        let element = React.createElement(content, {
            onSaveAndClose: this.separteSaveAndClose,
            onCancel: this.onCancel,
            numArr: numArr,
            separteCount: separteCount
        });
        this.setState({
            showDilaog: true,
            title: I18n.t(400018/*采购拆单*/),
            dialogContent: element
        })
    }
    //拆单的保存并关闭
    separteSaveAndClose = () => {
        this.setState({
            showDilaog: !this.state.showDilaog
        }, () => this.getPages())
    }
    //下单
    placeClick = () => {
        let that = this;
        //未完成
        let numArr = that.refs.pruchaseneed.getSelectArr();
        if (!numArr.length) {
            ServiceTips({text: I18n.t(400019/*请选择数据进行操作！*/), type: "error"});
        } else if (numArr.length == 1) {
            let {navReplaceTab, PurOrder, navRemoveTab, navAddTab} = this.props;
            navRemoveTab({
                name: I18n.t(100439/*编辑*/) + I18n.t(400020/*采购订单*/),
                component: I18n.t(100439/*编辑*/) + I18n.t(400020/*采购订单*/),
                url: '/pruchaseorder/add'
            });
            navAddTab({
                name: I18n.t(100439/*编辑*/) + I18n.t(400020/*采购订单*/),
                component: I18n.t(100439/*编辑*/) + I18n.t(400020/*采购订单*/),
                url: '/pruchaseorder/add'
            });
            this.props.router.push({pathname: '/pruchaseorder/add', query: {id: numArr[0].billId}})
        } else {
            let billIds = numArr.map(e => e.billId);
            apiGet(API_FOODING_ERP, "/purorder/getBooking", {billIds: billIds}, response => {
                let initData = response.data;
                let content = require('./PlaceDialog').default;
                let element = React.createElement(content, {
                    onSaveAndClose: that.placeSaveAndClose,
                    onCancel: that.onCancel,
                    initData: initData,
                    billIds: billIds
                });
                that.setState({
                    showDilaog: true,
                    title: I18n.t(400042/*出库通知单*/),
                    dialogContent: element
                })
            }, error => ServiceTips({text: error.message, type: "error"}))
        }
    }
    //下单保存并关闭
    placeSaveAndClose = value => {
        let that = this;
        let {navReplaceTab, PurOrder, navRemoveTab, navAddTab} = that.props;
        let numArr = that.refs.pruchaseneed.getSelectArr();
        let valueone = Object.assign({}, value, {billIds: numArr.map(e => e.billId)})
        apiForm(API_FOODING_ERP, "/purorder/booking", valueone, response => {
            that.setState({showDilaog: false}, () => that.getPages());
            navRemoveTab({
                name: I18n.t(100439/*编辑*/) + I18n.t(400020/*采购订单*/),
                component: I18n.t(100439/*编辑*/) + I18n.t(400020/*采购订单*/),
                url: '/pruchaseorder/add'
            });
            navAddTab({
                name: I18n.t(100439/*编辑*/) + I18n.t(400020/*采购订单*/),
                component: I18n.t(100439/*编辑*/) + I18n.t(400020/*采购订单*/),
                url: '/pruchaseorder/add'
            });
            that.props.router.push({pathname: '/pruchaseorder/add', query: {id: response.data}})
        }, error => ServiceTips({text: error.message, type: "error"}))
    }

    //锁库
    suokuClick = () => {
        let numArr = this.refs.pruchaseneed.getSelectArr();
        if (numArr.length !== 1) {
            ServiceTips({text: I18n.t(100434/*请选择一条数据！*/)});
            return false;
        }
        apiGet(API_FOODING_ERP, "/purorder/getLock", {billId: numArr[0].billId}, response => {
            let initData = response.data;
            let content = require('./LockLibraryDialog').default;
            let element = React.createElement(content, {
                getPage: this.getPages,
                onSaveAndClose: this.separteSaveAndClose,
                onCancel: this.onCancel,
                initData: initData
            });
            this.setState({
                showDilaog: true,
                title: I18n.t(400022/*锁库列表*/),
                dialogContent: element
            })
        }, error => ServiceTips({text: error.message, type: 'error'}))
    }
    //调整单
    tiaozhengClick = () => {
        let numArr = this.refs.pruchaseneed.getSelectArr();
        if (numArr.length !== 1) {
            ServiceTips({text: I18n.t(100434/*请选择一条数据！*/), type: 'info'});
            return false;
        }
        if (!numArr[0].saleAdjustOrderNo) {
            ServiceTips({text: I18n.t(400023/*只有异常单才能进行调整处理*/), type: 'info'});
            return false;
        }
        apiGet(API_FOODING_ERP, "/purorder/getAdjustableList", {billId: numArr[0].billId}, response => {
            let dataArr = response.data || [];
            if (!dataArr.length) {
                ServiceTips({text: I18n.t(400024/*请先对该采购单进行合单操作！*/), type: 'info'});
                return false;
            }
            let content = require('./PurchaseNeedAdjustDialog').default;
            let element = React.createElement(content, {
                onSaveAndClose: this.onTiaoZSaveClose,
                onCancel: this.onCancel,
                dataArr: dataArr,
                router: this.props.router,
                billId: numArr[0].billId,
                obj: numArr[0]
            });
            this.setState({
                showDilaog: true,
                title: I18n.t(100469/*订单调整*/),
                dialogContent: element
            })
        }, error => ServiceTips({text: error.message, type: 'error'}))

    }
    //调整需求订单的保存
    onTiaoZSaveClose = billId => {
        if (billId.trim() == "") return;
        let numArr = this.refs.pruchaseneed.getSelectArr();
        apiForm(API_FOODING_ERP, "/purorder/adjustNeed", {billId: billId, needId: numArr[0].billId}, response => {
            ServiceTips({text: response.message, type: 'success'});
            this.setState({showDilaog: false}, () => this.getPages());
        }, error => ServiceTips({text: error.message, type: 'error'}))
    }

    onSaveAndClose() {
        this.setState({
            showDilaog: !this.state.showDilaog
        })
    }

    onCancel() {
        this.setState({
            showDilaog: false
        })
    }

    handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let sch = document.body.offsetHeight - this.filterHeight - 92;
        let scroll = sch - 90;
        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }

    componentDidMount() {
        this.handleResize()
        window.addEventListener('resize', this.handleResize);
        this.getPages();
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    // 销售单号 查看详情
    numDetailHandle = (num) => {
        let that = this;
        this.setState({
            showDilaog: true,
            title: I18n.t(400008/*销售单号*/) + i18n.t(500281/*执行情况*/),
            dialogContent: React.createElement(require('../../../BookNeed/components/sourceNoDetail').default, {
                onCancel: that.onCancel,
                num: num
            })
        });
    }

    render() {
        let that = this;
        let {page, currentPage} = this.state;
        return (<div>
            <FilterHeader getPages={this.searchCustomer}
                          expandFilter={this.handleResize} normalRef={no => this.normalRef = no}/>
            <div className={'client-body'} style={{height: this.state.scrollHeight}}>
                <div className={'client-body-single'}>
                    <div className="action-buttons">
                        <div className={'key-page'}>
                            <FunctionKeys spearteClick={this.spearteClick} separteClick={this.separteClick}
                                          placeClick={this.placeClick} suokuClick={this.suokuClick}
                                          tiaozhengClick={this.tiaozhengClick}/>
                            <Page
                                currentPage={this.state.currentPage}
                                totalPages={this.state.totalPages}
                                totalRecords={this.state.totalRecords}
                                sizeList={sizeList}
                                currentSize={this.state.pageSize}
                                pageSizeChange={(num) => {
                                    this.setState({pageSize: Number.parseInt(num)}, () => this.getPags(currentPage, num));
                                }}
                                backClick={(num) => {
                                    this.setState({currentPage: Number.parseInt(num)}, () => this.getPages(num));
                                }}
                                nextClick={(num) => {
                                    this.setState({currentPage: Number.parseInt(num)}, () => this.getPages(num));
                                }}
                                goChange={(num) => {
                                    this.setState({currentPage: Number.parseInt(num)}, () => this.getPages(num));
                                }}
                            />
                        </div>

                        <Table
                            ref="pruchaseneed"
                            columns={this.columns}
                            data={this.state.data}
                            checkboxConfig={{
                                show: true,
                                checkedAll: this.state.choised,
                                checkedRows: this.state.checkedRows,
                                position: 'first'
                            }}
                            colorFilterConfig={{show: false, dataIndex: 'colorType'}}
                            followConfig={{show: false}}
                            onHeaderSortClick={this.getPages.bind(this, null)}
                            scroll={{x: true, y: this.state.scroll}}
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

export default NavConnect(PruchaseNeedList);
