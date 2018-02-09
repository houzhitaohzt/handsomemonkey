import React, {Component, PropTypes} from 'react';

import TimeView from './TimeView';
import PressView from './PressView';
import CenterEmail from './CenterEmail';
import ScheduleView from '../../../components/Schedule/components/ScheduleView';
import {browserHistory, Router, Route, IndexRoute, hashHistory, Link} from 'react-router';
import {getUser} from '../../../services/authorize/authorize';
import NavConnect from "../../../components/NavigateTabs/containers/AddContainer";
import i18n from '../../../lib/i18n';

//引入提示
import ServiceTips, {errorTips, successTips} from "../../../components/ServiceTips"; //提示框
import {
    apiGet, apiPost, apiForm, API_FOODING_ES, hrefFunc, permissionsBtn,
    API_FOODING_ERP, API_FOODING_DS, pageSize, sizeList, toDecimal, language
} from "../../../services/apiCall";

import Dialog from '../../../components/Dialog/Dialog'; //弹层
import Confirm from '../../../components/Dialog/Confirm';//删除弹层

//拖拽
const ReactGridLayout = require('react-grid-layout');
import "../../../../node_modules/react-grid-layout/css/styles.css";
import "../../../../node_modules/react-resizable/css/styles.css";


import DragModle from "../model/DragModel"; //打卡
import MoneyExchangeView from './MoneyExchangeView'; //汇率换算
import ScheduleDragView from '../../../components/Schedule/components/SchduleDragView'; //日程
import TaskView from './TaskView'; //任务
import BusinessModel from "../model/BuinessModel"; //商机列表
import SaleOrderModel from "../model/SaleOrderModel"; //销售订单
import SaleOrderPriceModel from "../model/SaleOrderPriceModel"; //产品价格
import PruchaseNeedModel from "../model/PruchaseNeedModel"; //采购需求
import SeaPriceModel from "../model/SeaPriceModel"; //海运运价
import CorportationApplyLimitModel from "../model/CorporationApplyLimitModel"; //信保限额申请
import SinkRecordModel from "../model/SinkRecordModel"; //收汇记录
import PurchasequoteModel from "../model/PurchasequoteModel"; //供应商报价
import PaymentApplicationModel from "../model/PaymentApplicationModel"; //付款申请
import PruchaseOrderModel from "../model/PruchaseOrderModel"; //采购订单
import LogisticOrderModel from "../model/LogisticOrderModel"; //物流订单


export class HomeView extends Component {
    constructor(props) {
        super(props);
        this.emailClick = this.emailClick.bind(this);
        this.danbaojiaClick = this.danbaojiaClick.bind(this);
        this.state = {
            showDilaog: false,
            showHeader: true,
            dialogContent: <div></div>,
            title: "",
            width: 1200,
            height: 555,
            layout: [],
            rowHeight: 1
        };

        this.title = {
            "time": i18n.t(200643/*打卡*/),
            "transfer": i18n.t(500276/*汇率换算*/),
            "/schedule": i18n.t(400141/*日程*/),
            "/activetask": i18n.t(500277/*任务*/),
            "/businessOpportunity/list": i18n.t(100321/*商机*/),
            "/salesorder/list": i18n.t(200237/*销售订单*/),
            "/saleorderprice": i18n.t(200070/*产品价格*/),
            '/pruchaseneed/list': i18n.t(500278/*采购需求*/),
            '/seaPrice': i18n.t(500279/*海运报价*/),
            '/corporationapplylimit/list': i18n.t(200517/*信保限额申请*/),
            '/sinkrecord': i18n.t(201098/*收汇记录*/),
            '/Purchasequote/list': i18n.t(200022/*供应商报价*/),
            '/paymentApplication/list': i18n.t(400040/*付款申请*/),
            '/pruchaseorder/list': i18n.t(400020/*采购订单*/),
            '/Booking/list': i18n.t(200373/*物流订单*/)
        }
    }

    emailClick() {
        this.props.navAddTab({name: i18n.t(700006/*写邮件*/), component: i18n.t(700006/*写邮件*/), url: '/email/write'});
        this.props.router.push({pathname: '/email/write'});
    }

    componentWillMount() {
        if (!getUser()) {
            browserHistory.push('/user/login')
        }
        ;
    }

    componentDidMount() {
        this.initLayout();
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        let width = document.documentElement.clientWidth || document.body.clientWidth;
        let height = document.documentElement.clientHeight || document.body.clientHeight;
        this.setState({width: width - 20, height});
    };

    componentWillReceiveProps(props) {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    /*
    * 获取模块
    * */
    getComponent = laysingle => {
        let iType = laysingle.i;
        switch (iType) {
            case "time" :
                return <DragModle laysingle={laysingle} onDrageEdit={this.onDrageEdit}
                                  onDrageDelete={this.onDrageDelete} rowHeight={this.state.rowHeight} ref="time"
                                  complaintClick={this.complaintClick} comlaintViewClick={this.comlaintViewClick} />;
                break;
            case "transfer" :
                return <MoneyExchangeView laysingle={laysingle} onDrageEdit={this.onDrageEdit}
                                          onDrageDelete={this.onDrageDelete} rowHeight={this.state.rowHeight}/>;
                break;
            case "/schedule" :
                return <ScheduleDragView router={this.props.router} laysingle={laysingle} onDrageEdit={this.onDrageEdit}
                                         onDrageDelete={this.onDrageDelete} rowHeight={this.state.rowHeight}/>;
                break;
            case "/activetask" :
                return <TaskView router={this.props.router} laysingle={laysingle} onDrageEdit={this.onDrageEdit}
                                 onDrageDelete={this.onDrageDelete} rowHeight={this.state.rowHeight}
                                 handleClick={this.handleClick} ref="risk" pickupClick={this.pickupClick}
                                 onCancel={this.onCancel}/>;
                break;
            case  "/businessOpportunity/list" :
                return <BusinessModel router={this.props.router} laysingle={laysingle} onDrageEdit={this.onDrageEdit}
                                      onDrageDelete={this.onDrageDelete} rowHeight={this.state.rowHeight}/>;
                break;
            case "/salesorder/list" :
                return <SaleOrderModel router={this.props.router} laysingle={laysingle} onDrageEdit={this.onDrageEdit}
                                       onDrageDelete={this.onDrageDelete} numDetailHandle={this.numDetailHandle}
                                       rowHeight={this.state.rowHeight}/>;
                break;
            case "/saleorderprice" :
                return <SaleOrderPriceModel router={this.props.router} laysingle={laysingle}
                                            onDrageEdit={this.onDrageEdit}
                                            onDrageDelete={this.onDrageDelete} danbaojiaClick={this.danbaojiaClick}
                                            ref="saleorderprice" rowHeight={this.state.rowHeight}/>;
                break;
            case "/pruchaseneed/list" :
                return <PruchaseNeedModel router={this.props.router} laysingle={laysingle}
                                          onDrageEdit={this.onDrageEdit}
                                          onDrageDelete={this.onDrageDelete} numDetailHandle={this.numDetailHandle}
                                          rowHeight={this.state.rowHeight}/>;
                break;
            case "/seaPrice" :
                return <SeaPriceModel router={this.props.router} laysingle={laysingle} onDrageEdit={this.onDrageEdit}
                                      onDrageDelete={this.onDrageDelete} rowHeight={this.state.rowHeight}/>;
                break;
            case "/corporationapplylimit/list" :
                return <CorportationApplyLimitModel router={this.props.router} laysingle={laysingle}
                                                    onDrageEdit={this.onDrageEdit}
                                                    onDrageDelete={this.onDrageDelete}
                                                    rowHeight={this.state.rowHeight}/>;
                break;
            case '/sinkrecord' :
                return <SinkRecordModel router={this.props.router} laysingle={laysingle} onDrageEdit={this.onDrageEdit}
                                        onDrageDelete={this.onDrageDelete} rowHeight={this.state.rowHeight}/>;
                break;
            case "/Purchasequote/list" :
                return <PurchasequoteModel router={this.props.router} laysingle={laysingle}
                                           onDrageEdit={this.onDrageEdit}
                                           onDrageDelete={this.onDrageDelete} rowHeight={this.state.rowHeight}/>;
                break;
            case "/paymentApplication/list" :
                return <PaymentApplicationModel router={this.props.router} laysingle={laysingle}
                                                onDrageEdit={this.onDrageEdit}
                                                onDrageDelete={this.onDrageDelete} rowHeight={this.state.rowHeight}/>;
                break;
            case "/pruchaseorder/list" :
                return <PruchaseOrderModel router={this.props.router} laysingle={laysingle}
                                           onDrageEdit={this.onDrageEdit}
                                           onDrageDelete={this.onDrageDelete} rowHeight={this.state.rowHeight}/>;
                break;
            case "/Booking/list" :
                return <LogisticOrderModel router={this.props.router} laysingle={laysingle}
                                           onDrageEdit={this.onDrageEdit}
                                           onDrageDelete={this.onDrageDelete} numDetailHandle={this.numDetailHandle}
                                           rowHeight={this.state.rowHeight}/>;
                break;

            default :
                return <div style={{color: 'red'}}>{i18n.t(500280/*页面错误*/)}</div>
        }
    };

    /*
    * 单个模块里面的弹窗, 必须拉出来才能做展示
    * */

    /**
     * 任务 办理任务
     * */
    handleClick = (data) => {
        let that = this;
        this.setState({
            showDilaog: true,
            title: i18n.t(200099/*办理任务*/),
            showHeader: true,
            dialogContent: React.createElement(require('../../ActiveTask/components/TaskDialog').default, {
                onCancel: this.onCancel,
                onSaveAndClose: this.wcClick,
                buttonLeft: i18n.t(200110/*完成任务*/),
                taskId: data.id
            })
        })
    };
    //点击完成任务
    wcClick = () => {
        this.setState({showDilaog: false}, () => this.refs.risk.wcClick())
    };

    /**
     * 任务 拾取任务
     * */
    pickupClick = (record) => {
        let that = this;
        this.setState({
            showDilaog: true,
            showHeader: false,
            dialogContent: React.createElement(require('../../ActiveTask/components/Wanchen').default, {
                checkedData: {record: record},
                onCancel: this.onCancel,
                onSaveAndClose: this.refs.risk.onSaveAndClose,
                position: {}
            })
        })
    };


    /**
     *  销售单号  查看详情
     * */
    numDetailHandle = (num) => {
        let that = this;
        this.setState({
            showDilaog: true,
            showHeader: true,
            title: i18n.t(400008/*销售单号*/) + i18n.t(500281/*执行情况*/),
            dialogContent: React.createElement(require('../../SalesOrder/List/components/sourceNoDetail').default, {
                onCancel: this.onCancel,
                num: num
            })
        });
    };

    /**
     * 产品价格 单个报价
     * */
    danbaojiaClick = record => {
        let numArr = []; //this.refs.product.getSelectArr();
        numArr.push(record);
        let num = numArr.length;
        this.setState({
            showDilaog: true,
            showHeader: true,
            title: i18n.t(100398/*自动报价*/),
            dialogContent: React.createElement(require('../../SaleOrderPrice/List/components/ProductPrice').default, {
                onSaveAndClose: this.onCancel,
                onCancel: this.onCancel,
                num: num,
                proArr: numArr,
                getPage: this.refs.saleorderprice.getPage
            })
        })
    };

    /**
     * 打卡 申述 编辑
     * */
    complaintClick = (data, attendId) => {
        let that = this;
        this.setState({
            showDilaog: true,
            showHeader: true,
            title: i18n.t(400255/*申述*/),
            dialogContent: React.createElement(require('../Dialog/PunchEditDialog').default, {
                onCancel: this.onCancel,
                onSaveAndClose: this.refs.time.onSaveAndClose,
                data:data,
                attendId:attendId
            })
        });
    };

    /**
     * 打卡 申述详情
     * */
    comlaintViewClick = record => {
        let that = this;
        this.setState({
            showDilaog: true,
            showHeader: true,
            title: "申述详情",
            dialogContent: React.createElement(require('../Dialog/PunchViewDialog').default, {
                onCancel: this.onCancel,
                getOne:record || {}
            })
        });
    };


    //新增模块
    onAddDialog = () => {
        let content = require("../model/AddDialog").default;
        let addDialog = React.createElement(content, {
            onSaveAndClose: this.onSaveAndClose,
            onCancel: this.onCancel,
            layout: this.state.layout
        });
        this.setState({
            showDilaog: true,
            showHeader: true,
            title: i18n.t(500282/*添加模块*/),
            dialogContent: addDialog
        })
    };
    //新增保存
    onSaveAndClose = (data) => {
        this.setState({showDilaog: false}, () => this.reModelLoad(data, 'add'));
    };
    //编辑保存
    onEditSaveAndClose = (data) => {
        this.setState({showDilaog: false}, () => this.reModelLoad(data, 'edit'));
    };
    //取消
    onCancel = () => {
        this.setState({showDilaog: false});
    };

    //编辑模块
    onDrageEdit = (item, e) => {
        let content = require("../model/EditDialog").default;
        let addDialog = React.createElement(content, {
            onSaveAndClose: this.onEditSaveAndClose,
            onCancel: this.onCancel,
            data: item
        });
        this.setState({
            showDilaog: true,
            showHeader: true,
            title: this.title[item.i],
            dialogContent: addDialog
        })
    };

    //删除模块
    onDrageDelete = (item, e) => {
        let title = `你确定要删除${this.title[item.i]}模块吗?`;
        Confirm(title, {
            done: () => {
                this.reModelLoad(item, 'delete');
            }
        });
    };

    //新增或删除之后,刷新模块
    reModelLoad = (data, type) => {
        let {layout} = this.state, w = [], h = [], le = [], hm = [], laynew = {}, newLayout = Array.from(layout);
        if (type === "add") {//新增模块
            if (layout.length == 0) {
                laynew = Object.assign({}, data, {
                    x: 0,
                    y: 0,
                    w: Number(data.w),
                    h: Number(data.h),
                    minW: 3,
                    maxW: 12,
                    minH: 5,
                    maxH: 1000
                })
            } else {
                layout.map(e => h.push(e.y));
                let maxh = Math.max.apply(this, h);
                w = layout.filter(e => e.y === maxh);
                w.map(b => le.push(Number(b.x) + Number(b.w)));
                w.map(b => hm.push(Number(b.y) + Number(b.h)));
                let maxW = Math.max.apply(this, le);
                let minH = Math.min.apply(this, hm);
                if (Number(maxW) + Number(data.w) > 12) {
                    laynew = Object.assign({}, data, {
                        x: 0,
                        y: Number(maxh) + 1,
                        w: Number(data.w),
                        h: Number(data.h),
                        minW: 3,
                        maxW: 12,
                        minH: 5,
                        maxH: 1000
                    })
                } else {
                    laynew = Object.assign({}, data, {
                        x: Number(maxW),
                        y: Number(minH) + 1,
                        w: Number(data.w),
                        h: Number(data.h),
                        minW: 3,
                        maxW: 12,
                        minH: 5,
                        maxH: 1000
                    })
                }
            }
            newLayout.push(laynew);
        } else if (type === "edit") {//编辑模块
            for (let j = 0; j < newLayout.length; j++) {
                if (data.i === newLayout[j].i) {
                    newLayout[j] = Object.assign({}, newLayout[j], {w: Number(data.w), h: Number(data.h)});
                }
            }
        } else if (type === "delete") {//删除模块
            newLayout = layout.filter(e => e.i !== data.i);
        }
        this.setState({layout: newLayout})
    };

    //init 布局
    initLayout = () => {
        let that = this;
        apiGet(API_FOODING_DS, "/homePageCache/getHomePage", {}, response => {
            let layout = response.data && response.data.homePage && response.data.homePage.layout ? response.data.homePage.layout : [];
            this.setState({layout});
        }, error => ServiceTips({text: error.message, type: 'error'}))
    };

    /*
    * onLayoutChange 布局改变
    * */
    onLayoutChange = layout => {
        let that = this;
        apiPost(API_FOODING_DS, "/homePageCache/save", {layout: layout}, response => {
            let layout = response.data && response.data.homePage && response.data.homePage.layout ? response.data.homePage.layout : [];
            that.setState({layout});
        }, error => ServiceTips({text: error.message, type: 'error'}));
    };

    render() {
        if (!getUser()) {
            return <div></div>;
        }
        return (
            <div className='container_01 scroll'
                 style={{paddingTop: '80px', height: this.state.height, backgroundColor: '#f0f4f8'}}>
                <span className={'dragedd'} onClick={this.onAddDialog}><i
                    className={'foddingicon fooding-add-icon3'}></i></span>
                <ReactGridLayout className="layout" layout={this.state.layout} cols={12} width={this.state.width}
                                 rowHeight={this.state.rowHeight}
                                 draggableHandle=".dragehandle"
                                 onLayoutChange={this.onLayoutChange}
                >
                    {
                        this.state.layout.map((e, i) => {
                            return (<div key={e.i}>{this.getComponent(e)}</div>)
                        })
                    }
                </ReactGridLayout>
                <Dialog width={926} visible={this.state.showDilaog} title={this.state.title}
                        showHeader={this.state.showHeader}>
                    {this.state.dialogContent}
                </Dialog>
            </div>
        );
    }
};


export default NavConnect(HomeView);
