import React, {PropTypes, Component} from "react";
import i18n from '../../lib/i18n';

// ajax
import {getQueryString, apiGet, apiPost, apiForm, API_FOODING_ERP, language, pageSize, sizeList} from '../../services/apiCall';
import ServiceTips from '../ServiceTips'; // tip
import Dialog from '../Dialog/Dialog'; //弹层
import Confirm from '../../components/Dialog/Confirm';

// css&png
import './index.less';		// 样式
import LogImage from '../../common/Img/fooding2.png'; // log

// 单个页面 
import SinglePage from './single';


// tpl list 
import CargoMessagePDIV from "./tpl/cargoMessageP.js"; // 货物信息采集表-采购
import CargoMessageLDIV from "./tpl/cargoMessageL.js"; // 货物信息采集表-物流



// 外部 按钮组
class BtnList extends Component {

    // 获取 单条数据
    handleGetOne = (e) => {
        let t = e.target;
        let active = t.getAttribute("name"); // btn name
        let btnList = (t.getAttribute("data-btn") || '').split(',');

        this.props.handleGetOne({active:active,buttonList:btnList});   // refresh
    }

    // 循环的 页面
    handleForPage = (e)=>{
        const active = e.target.getAttribute("name"); // btn name
        this.props.handleGetOne({active: active});   // refresh
    }

    render() {

        let {page} = this.props;

        // 判断 页面
        switch (page) {
            case 'flow' :   // 物流订单
                var BTN = <aside className="btn-group-vertical">
                    <button onClick={this.handleGetOne} name="exportEntrust" data-btn={['save','print','reset','export','entrust']} className="btn btn-default" title={i18n.t(201310/*出口委托书*/)}>{i18n.t(201310/*出口委托书*/)}</button>
                    <button onClick={this.handleGetOne} name="packingList" data-btn={['save','print','reset']} className="btn btn-default" title={i18n.t(600090/*清关箱单*/)}>{i18n.t(600090/*清关箱单*/)}</button>
                    <button onClick={this.handleGetOne} name="commercialInvoice" data-btn={['save','print','reset']} className="btn btn-default" title={i18n.t(201303/*清关发票*/)}>{i18n.t(201303/*清关发票*/)}</button>
                    <button onClick={this.handleGetOne} name="packingList-list" data-btn={['save','print']} className="btn btn-default" title={i18n.t(201304/*报关箱单*/)}>{i18n.t(201304/*报关箱单*/)}</button>
                    <button onClick={this.handleGetOne} name="commercialInvoice-list" data-btn={['save','print']} className="btn btn-default" title={i18n.t(600091/*报关发票*/)}>{i18n.t(600091/*报关发票*/)}</button>
                    <button onClick={this.handleGetOne} name="declaration-list" data-btn={['save','print']} className="btn btn-default" title={i18n.t(600092/*报关单*/)}>{i18n.t(600092/*报关单*/)}</button>
                    <button onClick={this.handleGetOne} name="shippingAdvice" data-btn={['save','print','reset']} className="btn btn-default" title={i18n.t(600093/*Shipping-Advice*/)}>{i18n.t(600093/*Shipping-Advice*/)}</button>
                    <button onClick={this.handleGetOne} name="cargoMessageL" data-btn={['print']} className="btn btn-default" title={i18n.t(700049/*货物信息采集表*/)}>{i18n.t(700049/*货物信息采集表*/)}</button>
                    <br/>
                </aside>
                break;
            case 'procurement' :    // 采购订单
                var BTN = <aside className="btn-group-vertical">
                    <button onClick={this.handleGetOne} name="packingList-list2" data-btn={['save','print','reset']} className="btn btn-default" title={i18n.t(600094/*Packing-List（商检）*/)}>{i18n.t(600094/*Packing-List（商检）*/)}</button>
                    <button onClick={this.handleGetOne} name="invoice-list" data-btn={['save','print','reset']} className="btn btn-default" title="INVOICE">INVOICE</button>
                    <button onClick={this.handleGetOne} name="salesContract-list" data-btn={['save','print','reset']} className="btn btn-default" title="sales-contract">sales-contract</button>
                    <button onClick={this.handleGetOne} name="contract" data-btn={['save','print','reset']} className="btn btn-default" title={i18n.t(201358/*产品购销合同*/)}>{i18n.t(201358/*产品购销合同*/)}</button>
                    <button onClick={this.handleGetOne} name="cargoMessageP" data-btn={['save','print','reset']} className="btn btn-default" title={i18n.t(700049/*货物信息采集表*/)}>{i18n.t(700049/*货物信息采集表*/)}</button>
                    <br/>
                </aside>
                break;
            case 'market' :    // 销售订单
                var BTN = <aside className="btn-group-vertical">
                    
                    <button onClick={this.handleForPage} name="shippingAdvice_list" data-btn={['save','print']} className="btn btn-default" title={i18n.t(600093/*Shipping-Advice*/)}>{i18n.t(600093/*Shipping-Advice*/)}</button>
                    <button onClick={this.handleGetOne} name="proformaInvoice" data-btn={['save','print','reset']} className="btn btn-default" title="Proforma-Invoice">Proforma-Invoice</button>
                    <button onClick={this.handleGetOne} name="salesContract2" data-btn={['save','print','reset']} className="btn btn-default" title="sales-contract">sales-contract</button>
                    <button onClick={this.handleGetOne} name="orderMessageL" data-btn={['save','print','reset']} className="btn btn-default" title={i18n.t(700050/*订单信息确认表-物流*/)}>{i18n.t(700050/*订单信息确认表-物流*/)}</button>
                    <button onClick={this.handleGetOne} name="orderMessageP" data-btn={['save','print','reset']} className="btn btn-default" title={i18n.t(700051/*订单信息确认表-采购*/)}>{i18n.t(700051/*订单信息确认表-采购*/)}</button>                    
                    <br/>
                </aside>
                break;
            case 'payment' :    // 付款申请
                var BTN = <aside className="btn-group-vertical">
                    <button onClick={this.handleGetOne} name="payapplyP" data-btn={['save','print','reset']} className="btn btn-default" title={i18n.t(201359/*付款申请单*/)}>{i18n.t(201359/*付款申请单*/)}</button>
                    <br/>
                </aside>
                break;
            case 'expenseaccount' :    // 报销单
                var BTN = <aside className="btn-group-vertical">
                    <button onClick={this.handleGetOne} name="expenseaccount" data-btn={['save','print','reset']} className="btn btn-default" title={i18n.t(200075/*费用*/)+i18n.t(600079/*报销单*/)}>{i18n.t(200075/*费用*/)+i18n.t(600079/*报销单*/)}</button>
                    <br/>
                </aside>
                break;
            default:
                var BTN = <aside className="btn-group-vertical">
                    <button onClick={this.handleGetOne} name='other' data-btn={['save','print','reset']} className="btn btn-default" title={i18n.t(201305/*其它模板*/)}>{i18n.t(201305/*其它模板*/)}</button>
                    <br/>
                </aside>

        }

        return <div>{BTN}</div>;
    }
}

// 保存 按钮组
class BtnSave extends Component {

    constructor(props) {
        super(props);

        // state init 
        this.state = {
            downHTML: '', // 下载按钮
        }
    }    

    // form 序列化
    Form = () => {
        let Form = this.refs.printForm.previousElementSibling;
        let r = {};

        Array.from(Form).map((o) => {
            r[o.name] = o['value'];
            // let a = o.getAttribute('data-index');
        });

        return r;
    }

    // 保存
    handleSave = (callBack) => {

        let that = this;
        let {active, getOneData} = this.props;
        let formData = this.Form();
        let Data = {};
        let URL = '';

        // 判断 模板
        switch (active) {
            // 物流订单
            case 'exportEntrust' :
                URL = '/exportorder/save';
                break;
            case 'packingList' :
                URL = '/packinginvoice/save';
                break;
            case 'commercialInvoice' :
                URL = '/packinginvoice/save';
                break;
            case 'packingListMore' :
                URL = '/packinginvoice/save';
                break;
            case 'commercialInvoiceMore' :
                URL = '/packinginvoice/save';
                break;
            case 'declaration' :
                URL = '/declaration/save';
                break;
            case 'shippingAdvice' :
                URL = '/shippingadvice/save';
                break;
            case 'cargoMessageL' :
                URL = '/purchasemtlinfo/save';
                break;                

            // 采购订单
            case 'packingList2' :
                URL = '/purchaseinspection/save';
                Data = {type: 1};
                break;
            case 'invoice' :
                URL = '/purchaseinspection/save';
                Data = {type: 2};
                break;
            case 'salesContract' :
                URL = '/purchaseinspection/save';
                Data = {type: 0};
                break;
            case 'contract' :
                URL = '/purchasecontract/save';
                break;
            case 'cargoMessageP' :
                URL = '/purchasemtlinfo/save';
                break;                
                
            // 销售订单
            case 'proformaInvoice' :
                URL = '/proformainvoice/save';
                break;
            case 'salesContract2' :
                URL = '/salescontract/save';
                break;
            case 'orderMessageL' : // 订单信息确认表-物流
                URL = '/orderaffirmshipping/save';
                break;
            case 'orderMessageP' : // 订单信息确认表-采购
                URL = '/orderaffirmpurorder/save';
                break;                                

            // 付款申请
            case 'payapplyP' :
                URL = '/payrequisition/save';
                break;

            // 报销单
            case 'expenseaccount' :
                URL = '/chargeaccount/save';
                break;


            // 其它
            case 'other' :
                URL = 'ewewe';
                break;
                return;
            default:
                ServiceTips({text:i18n.t(700052/*不支持保存*/), type: 'info'});
                return;
        }
        apiForm(API_FOODING_ERP, URL, Object.assign(formData, Data),
            (response) => {
                ServiceTips({text: response.message, type: 'success'});
                that.props.handleGetOne({active: active, ID: response['data'], getOneData: getOneData});   // refresh
                typeof callBack == 'function' ? callBack(response['data']) : '';
            }, (errors) => {
                ServiceTips({text: errors.message, type: 'error'});
        });

    }

    // 重置
    handleReset = () => {

        let that = this;
        let {active, getOneData={}} = this.props;
        let URL = '';
        let Data = {};

        // 判断 模板
        switch (active) {
            // 物流订单
            case 'exportEntrust' :
                URL = '/exportorder/reset';
                break;
            case 'packingList' :
                URL = '/packinginvoice/delete';
                Data = {id: getOneData['id']};
                break;
            case 'commercialInvoice' :
                URL = '/packinginvoice/delete';
                Data = {id: getOneData['id']};
                break;
            case 'shippingAdvice' :
                URL = '/shippingadvice/reset';
                break;
            case 'cargoMessageL' :
                URL = '/purchasemtlinfo/reset';
                break;                


            // 采购订单
            case 'contract' :
                URL = '/purchasecontract/reset';
                break;
            case 'cargoMessageP' :
                URL = '/purchasemtlinfo/reset';
                break;                
                

            // 销售订单
            case 'proformaInvoice' :
                URL = '/proformainvoice/reset';
                break;
            case 'salesContract2' :
                URL = '/salescontract/reset';
                break;
            case 'orderMessageL' : // 订单信息确认表-物流
                URL = '/orderaffirmshipping/reset';
                break;
            case 'orderMessageP' : // 订单信息确认表-采购
                URL = '/orderaffirmpurorder/reset';
                break;                


            // 付款申请
            case 'payapplyP' :
                URL = '/payrequisition/reset';
                break;

            // 报销单
            case 'expenseaccount' :
                URL = '/chargeaccount/reset';
                break;

            case 'other' :
                URL = 'ewewe';
                break;
                return;
            default:
                ServiceTips({text:i18n.t(700053/*不支持重置*/), type: 'info'});
                return;
        }

        // 没有ID 直接 getOne
        if( !getOneData['id'] ){
            that.props.handleGetOne({active: active});   // refresh
            return;
        }

        apiForm(API_FOODING_ERP, URL, Object.assign({billId: getOneData['billId'] || getQueryString('id')}, Data),
            (response) => {
                ServiceTips({text: response.message, type: 'success'});
                that.props.handleGetOne({active: active});   // refresh
            }, (errors) => {
                ServiceTips({text: errors.message, type: 'error'});
            });
    }

    // 打印
    handlePrint = () => {

        let {active} = this.props;
        let URL = '';

        // 判断 模板
        switch (active) {
            // 物流订单
            case 'exportEntrust' : // 出口委托书
                URL = '/%3Apublic%3Afooding-report%3A%E5%87%BA%E5%8F%A3%E5%A7%94%E6%89%98%E4%B9%A6.prpt/viewer';
                break;
            case 'packingList' : // 清关箱单
                URL = '/%3Apublic%3Afooding-report%3APackingList(%E6%B8%85%E5%85%B3).prpt/viewer';
                break;
            case 'commercialInvoice' : // 清关发票
                URL = '/%3Apublic%3Afooding-report%3ACommercialInvoice.prpt/viewer';
                break;
            case 'declaration' : // 报关单
                URL = '/%3Apublic%3Afooding-report%3A%E6%8A%A5%E5%85%B3%E5%8D%95.prpt/viewer';
                break;
            case 'shippingAdvice' : // Shipping-Advice
                URL = '/%3Apublic%3Afooding-report%3AShippingAdvice.prpt/viewer';
                break;


            // 采购订单
            case 'packingList2' : // // 清关箱单(商检)
                URL = '/%3Apublic%3Afooding-report%3APackingList(%E5%95%86%E6%A3%80).prpt/viewer';
                break;
            case 'invoice' : // INVOICE
                URL = '/%3Apublic%3Afooding-report%3AINVOICE.prpt/viewer';
                break;
            case 'salesContract' : // sales-contract
                URL = '/%3Apublic%3Afooding-report%3ASalesContract.prpt/viewer';
                break;
            case 'contract' : // sales-contract
                URL = '/%3Apublic%3Afooding-report%3A%E4%BA%A7%E5%93%81%E8%B4%AD%E9%94%80%E5%90%88%E5%90%8C.prpt/viewer';
                break;


            // 销售订单
            case 'proformaInvoice' : // Proforma-Invoice
                URL = '/%3Apublic%3Afooding-report%3API.prpt/viewer';
                break;
            case 'salesContract2' : // sales-contract
                URL = '/%3Apublic%3Afooding-report%3ASALESCONTRACT(%E5%AE%A2%E6%88%B7).prpt/viewer';
                break;



            // 付款申请
            case 'payapplyP' : // 付款申请
                URL = '/%3Apublic%3Afooding-report%3A%E4%BB%98%E6%AC%BE%E7%94%B3%E8%AF%B7%E5%8D%95.prpt/viewer';
                break;

            // 报销单
            case 'expenseaccount' : // 费用报销单
                URL = '/%3Apublic%3Afooding-report%3A%E8%B4%B9%E7%94%A8%E6%8A%A5%E9%94%80%E5%8D%95.prpt/viewer';
                break;


            case 'other' :
                URL = 'ewewe';
                break;
                return;
            default:
                ServiceTips({text:i18n.t(700054/*不支持打印*/), type: 'info'});
                return;
        }

        this.handleSave(function (ID) {
            let URLW = window.location.origin +'/report/api/repos' + URL + "?id=" + ID;
            window.open( URLW );
        });

    }

    // 托书确认
    affirmHandle = ()=>{
        let that = this;
        let {active, getOneData} = this.props;
        let Data = {};
        let URL = '';

        // 判断 模板
        switch (active) {
            // 物流订单
            case 'exportEntrust' :
                URL = '/shipping/noticeProxy';
                break;

            default:
                ServiceTips({text:i18n.t(700055/*不支持托书确认*/), type: 'info'});
                return;
        }

        Confirm(i18n.t(600095/*您确定要‘托书确认’吗？*/), {
            done: () => {
                apiForm(API_FOODING_ERP,URL,Object.assign({},{billId:getOneData['billId']}),
                    (response) => {
                        ServiceTips({text:response.message,type:'success'});
                    }, (errors) => {
                        ServiceTips({text:errors.message,type:'error'});
                });
            }
        });
    }

    // 下载 导出
    exportHandle = ()=>{
        
        let that = this;
        let {getOneData,active} = this.props;

               
        if(!getOneData['id']) {
            ServiceTips({text:i18n.t(700056/*请先保存*/), type: 'info'}); 
            return;
        }

        // 判断 模板
        switch (active) {
            // 物流订单
            case 'exportEntrust' :
                URL = '/exportorder/export';
                break;
            // case 'cargoMessageL' :
            //     URL = '/purchasemtlinfo/export';
            //     break;
                
            default:
                ServiceTips({text:i18n.t(700055/*不支持托书确认*/), type: 'info'});
                return;
        }


        this.setState({
            downHTML: `${API_FOODING_ERP}${URL}?billId=${getOneData['billId']}`,
        });
        
    }

    render() {
        let {downHTML} = this.state;
        let {getOneData,buttonList,resetShow, active, page} = this.props;


        // 控制按钮 列表 
        let btnSave = buttonList.filter(o=>o=='save')['length']; // 保存按钮
        let btnPrint = buttonList.filter(o=>o=='print')['length']; // 保存按钮
        let btnReset = buttonList.filter(o=>o=='reset')['length']; // 重置按钮
        let btnEntrust = buttonList.filter(o=>o=='entrust')['length']; // 托书确认按钮
        let btnExport = buttonList.filter(o=>o=='export')['length']; // 导出按钮


        // 控制 按钮高度
        switch(page){
            case 'payment' :
                var classStyle = {
                    top:103
                }
            break;
            case 'expenseaccount' :
                var classStyle = {
                    top:103
                }
            break;
            default:
                var classStyle = {}
        }




        return (
            <div ref={'printForm'} className="btn-group" style={classStyle}>
                
                { btnSave ? 
                    <button onClick={this.handleSave} className="btn btn-success" title={i18n.t(100430/*保存*/)}>{i18n.t(100430/*保存*/)}</button>
                    :''
                }
                { btnPrint ?
                    <button onClick={this.handlePrint} className="btn btn-warning" title={i18n.t(201307/*打印*/)}>{i18n.t(201307/*打印*/)}</button>
                    :''
                }
                { btnReset ?
                    <button onClick={this.handleReset} className="btn btn-info" title={i18n.t(201306/*重置*/)}>{i18n.t(201306/*重置*/)}</button>
                    :''
                }
                { btnExport ?
                    <button onClick={this.exportHandle} className="btn btn-primary" title={i18n.t(201308/*导出*/)}>
                        <a href={downHTML || 'javascript:;'} style={{color:"#fff"}}>{i18n.t(201308/*导出*/)}</a>
                    </button>                    
                    :''
                }
                { btnEntrust ?
                    <button onClick={this.affirmHandle} className="btn btn-info" title={i18n.t(201309/*托书确认*/)}>{i18n.t(201309/*托书确认*/)}</button>
                    : ''
                }

            </div>
        );
    }
}

/********************************  模板 begin  ********************************/

// 列表
class List extends Component {

    constructor(props) {
        super(props);

        // init state
        this.state = {
            show: false,
            addList: [], // 新增列表

            slecOne: false, // 选中单条
            slecAll: false, // 选中多条

            getOneData: [],
        };
    }

    componentDidMount() {
        let Data = this.props['getOneData'].map((o) => {
            o['selectedOne'] = false;
            return o;
        });
        this.setState({getOneData: Data});
    }

    // 新增
    handleAdd = () => {

        let {active, getOneData} = this.props;

        // 判断 页面
        let URL = '';
        console.log(active);
        switch (active) {
            case 'packingList-list2' :
                URL = '/purchaseinspection/getList';
                break;
            case 'invoice-list' :
                URL = '/purchaseinspection/getList';
                break;
            case 'salesContract-list' :
                URL = '/purchaseinspection/getList';
                break;                
            default:
                URL = '/packinginvoice/getList';
        }

        apiGet(API_FOODING_ERP, URL, {billId: getQueryString('id')},
            (response) => {
                let Data = response['data'];
                Data.map((o, i) => {
                    o['selectedOne'] = false;   // 添加 选中标识
                    return o;
                });
                this.setState({
                    addList: Data,
                });
            }, (errors) => {
                ServiceTips({text: errors.message, type: 'error'});
            });

        this.setState({show: true});
    }

    // 删除
    handleDel = () => {

        let {active} = this.props;
        let {getOneData} = this.state;
        let ID = getOneData.filter((o) => o['selectedOne']);
        let URL = '';

        // 判断 单条
        if (!ID.length) {
            ServiceTips({text: i18n.t(500115/*请选中一条数据？*/), type: 'info'});
            return;
        }

        // 判断 列表
        switch (active) {
            // 物流订单
            case 'packingList-list' :
                URL = '/packinginvoice/delete';
                break;
            case 'commercialInvoice-list' :
                URL = '/packinginvoice/delete';
                break;
            case 'declaration-list' :
                URL = '/declaration/delete';
                break;

            // 采购订单
            case 'packingList-list2' :
                URL = '/purchaseinspection/delete';
                break;
            case 'invoice-list' :
                URL = '/purchaseinspection/delete';
                break;
            case 'salesContract-list' :
                URL = '/purchaseinspection/delete';
                break;

            default:
                return;
        }

        // 只能 单条操作
        let that = this;
        apiForm(API_FOODING_ERP, URL, {id: ID[0].id},
            (response) => {
                ServiceTips({text: response.message, type: 'success'});
                // 临时 手动删除数据
                that.setState({getOneData: getOneData.filter((o) => o['id'] != ID[0].id)});
            }, (errors) => {
                ServiceTips({text: errors.message, type: 'error'});
            });

    }

    // 确定
    handleConfirm = () => {

        let {active, getOneData} = this.props;
        let Data = this.state['addList'].filter((o) => o['selectedOne'] == true);
        let ID = Data.map((o) => o['billId']);

        if (!ID.length) {
            ServiceTips({text: i18n.t(500115/*请选中一条数据？*/), type: 'info'});
            return;
        }

        // 判断 页面
        let URL = '';
        switch (active) {
            // 物流订单
            case 'packingList-list' :
                URL = '/declarationpacking/getOne';
                break;
            case 'commercialInvoice-list' :
                URL = '/declarationinvoice/getOne';
                break;
            case 'declaration-list' :
                URL = '/declaration/getOne';
                break;

            // 采购订单
            case 'packingList-list2' :
                URL = '/purchasepacking/getOne';
                break;
            case 'invoice-list' :
                URL = '/purchaseinvoice/getOne';
                break;
            case 'salesContract-list' :
                URL = '/purchasesales/getOne';
                break;

            // 其它
            default:
                return;

        }

        let that = this;
        apiGet(API_FOODING_ERP, URL, {billId: getQueryString('id'), pmtlIds: ID},
            (response) => {
                that.props.handleList({
                    active: active,
                    data: response['data'],
                });
            }, (errors) => {
                ServiceTips({text: errors.message, type: 'error'});
            });
    }

    // 取消
    handleCancle = () => {
        this.setState({show: false});
    }

    // 列表 只能选中一条
    handleSlecOnly = (e) => {
        let Key = e.currentTarget.getAttribute('data-key');
        let {getOneData} = this.state;

        let Data = getOneData.map((o) => {
            o['selectedOne'] = false;
            return o;
        });
        Data[Key].selectedOne = !Data[Key].selectedOne;
        this.setState({getOneData: Data});
    }

    // 双击
    handleDouble = (e) => {
        let ID = e.currentTarget.getAttribute('data-id');
        let {active} = this.props;

        // 判断 页面
        let URL = '';
        switch (active) {
            // 物流订单
            case 'packingList-list' :
                URL = '/declarationpacking/getOne';
                break;
            case 'commercialInvoice-list' :
                URL = '/declarationinvoice/getOne';
                break;
            case 'declaration-list' :
                URL = '/declaration/getOne';
                break;

            // 采购订单
            case 'packingList-list2' :
                URL = '/purchasepacking/getOne';
                break;
            case 'invoice-list' :
                URL = '/purchaseinvoice/getOne';
                break;
            case 'salesContract-list' :
                URL = '/purchasesales/getOne';
                break;

            // 其它
            default:
                return;

        }

        let that = this;
        apiGet(API_FOODING_ERP, URL, {billId: getQueryString('id'), id: ID},
            (response) => {
                that.props.handleList({
                    active: active,
                    data: response['data'],
                });
            }, (errors) => {
                ServiceTips({text: errors.message, type: 'error'});
            });

    }

    // 单条 选中
    handleSlecOne = (e) => {
        let Key = e.currentTarget.getAttribute('data-key');
        let {addList} = this.state;

        addList[Key].selectedOne = !addList[Key].selectedOne;
        this.setState({addList: addList});
    }

    // 全选
    handleSlecAll = (e) => {
        let {slecAll, addList} = this.state;

        this.setState({slecAll: !slecAll}, function () {
            let Data = addList.map((o) => {
                o['selectedOne'] = !slecAll;
                return o;
            });
            this.setState({addList: Data});
        });
    }

    render() {
        let {show, addList, slecOne, slecAll} = this.state;
        let {getOneData} = this.state;
        return (
            <div className="print-template print-list">
                <header>
                    <button onClick={this.handleAdd} type="button" className="btn btn-xs btn-info" title={i18n.t(200263/*添加*/)}><i
                        className="foddingicon fooding-add_i_icon"></i></button>&nbsp;&nbsp;&nbsp;
                    <button onClick={this.handleDel} type="button" className="btn btn-xs btn-danger" title={i18n.t(100437/*删除*/)}><i
                        className="foddingicon fooding-delete_icon2"></i></button>
                </header>
                <table className="print">
                    <thead>
                    <tr>
                        {/*<!-- <th className="check"></th> -->*/}
                        <th style={{width: "30px"}}></th>
                        <th>{i18n.t(500061/*产品名称*/)}</th>
                        <th>{i18n.t(100300/*创建日期*/)}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {getOneData.map((o, i) =>
                        <tr key={i} data-key={i} data-id={o.id} className="pointer" className={o['selectedOne'] ? 'selected' : ''}
                            onClick={this.handleSlecOnly} onDoubleClick={this.handleDouble}>
                            <td className="check"></td>
                            <td>{o['invoiceNo'] || o['saleNo'] || o['orderNo'] || o['no']}</td>
                            <td>{new Date(o['createDate']).Format('yyyy-MM-dd')}</td>
                        </tr>
                    )
                    }
                    </tbody>
                </table>
                <Dialog width={923} visible={show} title={i18n.t(100392/*新增*/)} showHeader={true}>
                    <div className="print-template print-list">
                        <table>
                            <thead>
                            <tr className={slecAll ? "selected" : ''}>
                                <th className="check" onClick={this.handleSlecAll}></th>
                                <th>{i18n.t(500061/*产品名称*/)}</th>
                                <th>{i18n.t(100382/*产品规格*/)}</th>
                                <th style={{width: "80px"}}>{i18n.t(400075/*是否商检*/)}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {addList.map((o, i) =>
                                <tr key={i} data-key={i} className={o['selectedOne'] ? 'selected' : ''} onClick={this.handleSlecOne}>
                                    <td className="check"></td>
                                    <td>{o["mtlLcName"]}</td>
                                    <td>{o["basSpeci"]}</td>
                                    <td>{o["inspcMark"] ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/)}</td>
                                </tr>
                            )
                            }
                            </tbody>
                        </table>
                    </div>
                    <div style={{textAlign:'center'}}>
                        <button onClick={this.handleConfirm} type="button" className="btn btn-success" title={i18n.t(200043/*确定*/)}>{i18n.t(200043/*确定*/)}</button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button onClick={this.handleCancle} type="button" className="btn btn-warning" title={i18n.t(100461/*取消*/)}>{i18n.t(100461/*取消*/)}</button>
                    </div>
                </Dialog>
            </div>
        );
    }
}

// 出口委托书
class ExportEntrust extends Component {
    render() {
        let {getOneData} = this.props;
        return (
            <div className="print-template">
                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock']}/>
                {/*<!-- 隐藏域 over -->*/}
                <header>
                    <img src={LogImage}/>
                    <h3><input name="company" defaultValue={getOneData['company']} className="text-right" type="text"/></h3>
                    <p><input name="companyAddr" defaultValue={getOneData['companyAddr']} className="text-right" type="text"/></p>
                    <p>
                        <label>TEL:</label>
                        <span><input name="companyTel" defaultValue={getOneData['companyTel']}  type="text"
                                     style={{width: '108px'}}/></span>
                        <label>FAX:</label>
                        <span><input name="companyFax" defaultValue={getOneData['companyFax']}  type="text"
                                     style={{width: '108px'}}/></span>
                    </p>
                    <p><input name="companyWeb" defaultValue={getOneData['companyWeb']} className="text-right" type="text"/></p>
                </header>
                <table cellSpacing="0">
                    <tbody>
                    <tr>
                        <td colSpan="9" style={{fontSize: '23px'}}>{i18n.t(201310/*出口委托书*/)}</td>
                    </tr>
                    <tr>
                        <td rowSpan="5">{i18n.t(201311/*订舱代理*/)}</td>
                        <td colSpan="4"><input name="agent" defaultValue={getOneData['agent']}/></td>
                        <td>{i18n.t(201312/*发票号码*/)}</td>
                        <td colSpan="3"><input name="saleNo" defaultValue={getOneData['saleNo']}/></td>
                    </tr>
                    <tr>
                        <td colSpan="4"><input name="agentLink" defaultValue={getOneData['agentLink']}/></td>
                        <td>{i18n.t(201093/*船期*/)}</td>
                        <td colSpan="3"><input name="sailingDate" defaultValue={getOneData['sailingDate']}/></td>
                    </tr>
                    <tr>
                        <td colSpan="4" className="text">
                            <span>{i18n.t(100478/*电话*/)}:</span>
                            <input name="agentTel" defaultValue={getOneData['agentTel']}/>
                        </td>
                        <td>{i18n.t(100224/*运输方式*/)}</td>
                        <td colSpan="3"><input name="shippingType" defaultValue={getOneData['shippingType']}/></td>
                    </tr>
                    <tr>
                        <td colSpan="4" className="text">
                            <span>{i18n.t(300009/*手机*/)}:</span>
                            <input name="agentMobile" defaultValue={getOneData['agentMobile']}/>
                        </td>
                        <td>{i18n.t(201313/*出口口岸*/)}</td>
                        <td colSpan="3"><input name="sStatn" defaultValue={getOneData['sStatn']}/></td>
                    </tr>
                    <tr>
                        <td colSpan="4" className="text">
                            <span>{i18n.t(100229/*邮箱*/)}:</span>
                            <input name="agentMail" defaultValue={getOneData['agentMail']}/>
                        </td>
                        <td>{i18n.t(201314/*目的口岸*/)}</td>
                        <td colSpan="3"><input name="eStatn" defaultValue={getOneData['eStatn']}/></td>
                    </tr>
                    <tr>
                        <td rowSpan="4">{i18n.t(201315/*发货人*/)}</td>
                        <td colSpan="4" className="text">
                            <span>{i18n.t(100486/*公司*/)}:</span>
                            <input name="consigner" defaultValue={getOneData['consigner']}/>
                        </td>
                        <td>{i18n.t(500090/*可否转运*/)}</td>
                        <td colSpan="3"><input name="canTransport" defaultValue={getOneData['canTransport']}/></td>
                    </tr>
                    <tr>
                        <td colSpan="4" className="text">
                            <span>{i18n.t(100481/*地址*/)}:</span>
                            <input name="consignerAddr" defaultValue={getOneData['consignerAddr']}/>
                        </td>
                        <td>{i18n.t(201316/*可否分批*/)}</td>
                        <td colSpan="3"><input name="canInstalment" defaultValue={getOneData['canInstalment']}/></td>
                    </tr>
                    <tr>
                        <td colSpan="4" className="text">
                            <span>TEL:</span>
                            <input name="consignerTel" defaultValue={getOneData['consignerTel']}/>
                        </td>
                        <td>{i18n.t(201317/*贸易方式*/)}</td>
                        <td colSpan="3"><input name="tradeMode" defaultValue={getOneData['tradeMode']}/></td>
                    </tr>
                    <tr>
                        <td colSpan="4" className="text">
                            <span>FAX:</span>
                            <input name="consignerFax" defaultValue={getOneData['consignerFax']}/>
                        </td>
                        <td colSpan="4"></td>
                    </tr>
                    <tr>
                        <td rowSpan="4">{i18n.t(200344/*收货人*/)}</td>
                        <td colSpan="4" className="text">
                            <span>{i18n.t(100486/*公司*/)}:</span>
                            <input name="consignee" defaultValue={getOneData['consignee']}/>
                        </td>
                        <td>{i18n.t(500076/*船公司*/)}</td>
                        <td colSpan="3"><input name="transportBe" defaultValue={getOneData['transportBe']}/></td>
                    </tr>
                    <tr>
                        <td colSpan="4" className="text">
                            <span>{i18n.t(100481/*地址*/)}:</span>
                            <input name="consigneeAddr" defaultValue={getOneData['consigneeAddr']}/>
                        </td>
                        <td>{i18n.t(201318/*运费缴付*/)}</td>
                        <td colSpan="3"><input name="freightType" defaultValue={getOneData['freightType']}/></td>
                    </tr>
                    <tr>
                        <td colSpan="4" className="text">
                            <span>TEL:</span>
                            <input name="consigneeTel" defaultValue={getOneData['consigneeTel']}/>
                        </td>
                        <td>{i18n.t(500128/*运价*/)}</td>
                        <td colSpan="3"><input name="freightPrice" defaultValue={getOneData['freightPrice']}/></td>
                    </tr>
                    <tr>
                        <td colSpan="4" className="text">
                            <span>FAX:</span>
                            <input name="consigneeFax" defaultValue={getOneData['consigneeFax']}/>
                        </td>
                        <td colSpan="4"></td>
                    </tr>
                    <tr>
                        <td rowSpan="4">{i18n.t(200346/*通知人*/)}</td>
                        <td colSpan="4" className="text">
                            <span>{i18n.t(100486/*公司*/)}:</span>
                            <input name="notifier" defaultValue={getOneData['notifier']}/>
                        </td>
                        <td>{i18n.t(201319/*免仓期*/)}</td>
                        <td colSpan="3"><input name="frStorAgeApp" defaultValue={getOneData['frStorAgeApp']}/></td>
                    </tr>
                    <tr>
                        <td colSpan="4" className="text">
                            <span>{i18n.t(100481/*地址*/)}:</span>
                            <input name="notifierAddr" defaultValue={getOneData['notifierAddr']}/>
                        </td>
                        <td rowSpan="3" colSpan="4"></td>
                    </tr>
                    <tr>
                        <td colSpan="4" className="text">
                            <span>TEL:</span>
                            <input name="notifierTel" defaultValue={getOneData['notifierTel']}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="4" className="text">
                            <span>FAX:</span>
                            <input name="notifierFax" defaultValue={getOneData['notifierFax']}/>
                        </td>
                    </tr>

                    <tr>
                        <td>{i18n.t(201320/*标记和唛头*/)}</td>
                        <td>HSCODE</td>
                        <td>{i18n.t(201321/*中文品名*/)}</td>
                        <td colSpan="2">{i18n.t(201322/*英文品名*/)}</td>
                        <td>{i18n.t(201323/*包装件数*/)}</td>
                        <td>{i18n.t(600096/*毛重（KGS）*/)}</td>
                        <td>{i18n.t(600097/*净重（KGS）*/)}</td>
                        <td>{i18n.t(600098/*立方（CBM）*/)}</td>
                    </tr>
                    {getOneData['mtls'].map((o, i) =>
                        <tr key={i}>
                            <td>
                                {/*<!-- 隐藏域 begin -->*/}
                                <input type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                <input type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                <input type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                {/*<!-- 隐藏域 over -->*/}
                                <input className="text-center" name={"mtls[" + i + "].marks"} defaultValue={o['marks']}/>
                            </td>
                            <td><input className="text-center" name={"mtls[" + i + "].hsCode"} defaultValue={o['hsCode']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].mtlZh"} defaultValue={o['mtlZh']}/></td>
                            <td colSpan="2"><input className="text-center" name={"mtls[" + i + "].mtlEn"} defaultValue={o['mtlEn']}/></td>
                            <td><input data-add="packing" className="text-center" name={"mtls[" + i + "].packing"} defaultValue={o['packing']}/></td>
                            <td><input data-add="grosWt" className="text-center" name={"mtls[" + i + "].grosWt"} defaultValue={o['grosWt']}/></td>
                            <td><input data-add="netWt" className="text-center" name={"mtls[" + i + "].netWt"} defaultValue={o['netWt']}/></td>
                            <td><input data-add="vol" className="text-center" name={"mtls[" + i + "].vol"} defaultValue={o['vol']}/></td>
                        </tr>
                    )
                    }

                    <tr>
                        <td></td>
                        <td colSpan="4" className="text-right">TOTAL:</td>
                        <td><input data-sum="packing" className="text-center" name="totalPacking" defaultValue={getOneData['totalPacking']}/></td>
                        <td><input data-sum="grosWt" className="text-center" name="totalGrosWt" defaultValue={getOneData['totalGrosWt']}/></td>
                        <td><input data-sum="netWt" className="text-center" name="totalNetWt" defaultValue={getOneData['totalNetWt']}/></td>
                        <td><input data-sum="vol" className="text-center" name="totalVol" defaultValue={getOneData['totalVol']}/></td>
                    </tr>
                    <tr>
                        <td>{i18n.t(201324/*箱型/箱量*/)}</td>
                        <td colSpan="8"><input name="container" defaultValue={getOneData['container']}/></td>
                    </tr>
                    <tr>
                        <td rowSpan="5">{i18n.t(201325/*注意事项*/)}</td>
                        <td colSpan="8"><input name="billLadType" defaultValue={getOneData['billLadType']}/></td>
                    </tr>
                    <tr>
                        <td rowSpan="3" colSpan="8">
                            <textarea style={{height: "150px"}} name="photoReq" defaultValue={getOneData['photoReq']}></textarea>
                        </td>
                    </tr>
                    <tr></tr>
                    <tr></tr>
                    <tr>
                        <td colSpan="8"><input name="stPackReq" defaultValue={getOneData['stPackReq']}/></td>
                    </tr>
                    <tr>
                        <td rowSpan="5">{i18n.t(201326/*操作联系方式*/)}</td>
                        <td>{i18n.t(100370/*联系人*/)}：</td>
                        <td colSpan="7"><input name="staff" defaultValue={getOneData['staff']}/></td>
                    </tr>
                    <tr>
                        <td>{i18n.t(300009/*手机*/)}：</td>
                        <td colSpan="7"><input name="staffMobile" defaultValue={getOneData['staffMobile']}/></td>
                    </tr>
                    <tr>
                        <td>{i18n.t(100478/*电话*/)}：</td>
                        <td colSpan="7"><input name="staffTel" defaultValue={getOneData['staffTel']}/></td>
                    </tr>
                    <tr>
                        <td>{i18n.t(100479/*传真*/)}：</td>
                        <td colSpan="7"><input name="staffFax" defaultValue={getOneData['staffFax']}/></td>
                    </tr>
                    <tr>
                        <td>{i18n.t(100229/*邮箱*/)}：</td>
                        <td colSpan="7"><input name="staffMail" defaultValue={getOneData['staffMail']}/></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

// 清关箱单
class PackingList extends Component {
    render() {
        let {getOneData} = this.props;
        return (
            <div className="print-template commercial-invoice packing-list">
                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock'] || 0}/>
                <input type="hidden" name="isClearance" defaultValue={getOneData['isClearance']}/>
                <input type="hidden" name="isPacking" defaultValue={getOneData['isPacking']}/>
                {/*<!-- 隐藏域 over -->*/}
                <header>
                    <img src={LogImage}/>
                    <h3><input name="company" defaultValue={getOneData['company']} className="text-right" type="text"/></h3>
                    <p><input name="companyAddr" defaultValue={getOneData['companyAddr']} className="text-right" type="text"/></p>
                    <p>
                        <label>TEL:</label>
                        <span><input name="companyTel" defaultValue={getOneData['companyTel']} type="text"
                                     style={{width: '108px'}}/></span>
                        <label>FAX:</label>
                        <span><input name="companyFax" defaultValue={getOneData['companyFax']} type="text"
                                     style={{width: '108px'}}/></span>
                    </p>
                    <p><input name="companyWeb" defaultValue={getOneData['companyWeb']} className="text-right" type="text"/></p>
                </header>
                <section>
                    <h1 className="text-center weight">PACKING LIST</h1>
                    <ul>
                        <li className="textarea">
                            <label className="weight">TO :</label>
                            <input type="" name="buyer" defaultValue={getOneData['buyer']}/>
                            <textarea rows="3" name="buyerAddr" defaultValue={getOneData['buyerAddr']}></textarea>
                        </li>
                        <li>
                            <label className="weight">FROM :</label>
                            <input type="" name="sStatn" defaultValue={getOneData['sStatn']}/>
                        </li>
                        <li>
                            <label className="weight">Payment :</label>
                            <input type="" name="payment" defaultValue={getOneData['payment']}/>
                        </li>
                    </ul>
                    <ol>
                        <li>
                            <label className="weight">Invoice NO. :</label>
                            <input type="" name="invoiceNo" defaultValue={getOneData['invoiceNo']}/>
                        </li>
                        <li>
                            <label className="weight">Date :</label>
                            <input type="" name="date" defaultValue={getOneData['date']}/>
                        </li>
                        <hr/>
                        <li>
                            <label className="weight">To :</label>
                            <input type="" name="eStatn" defaultValue={getOneData['eStatn']}/>
                        </li>
                        <li>
                            <p className="weight">{getOneData['origin']}</p>
                        </li>
                    </ol>
                </section>
                <table cellSpacing="0">
                    <thead>
                    <tr className="title">
                        <th className="weight" colSpan="2" style={{width: "550px"}}>
                            Description & Specification
                        </th>
                        <th className="weight">
                            Packages
                        </th>
                        <th className="weight">
                            Quantity
                        </th>
                        <th className="weight">
                            G.W.(KGS)
                        </th>
                        <th className="weight">
                            N.W.(KGS)
                        </th>
                        <th className="weight">
                            VOL(CBM)
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {getOneData['mtls'].map((o, i) =>
                        <tr key={i}>
                            <td style={{width: "41px"}}>
                                {/*<!-- 隐藏域 begin -->*/}
                                <input type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                <input type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                <input type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                {/*<!-- 隐藏域 over -->*/}
                                <input type="" name={"mtls[" + i + "].serialNo"} defaultValue={o['serialNo'] || (i + 1)}/>
                            </td>
                            <td>
                                <textarea name={"mtls[" + i + "].mtlEn"} defaultValue={o['mtlEn']}></textarea>
                            </td>
                            <td><input data-add="packing" className="text-center" name={"mtls[" + i + "].packing"} defaultValue={o['packing']}/></td>
                            <td><input data-add="qty" className="text-center" name={"mtls[" + i + "].qty"} defaultValue={o['qty']}/></td>
                            <td><input data-add="grosWt" className="text-center" name={"mtls[" + i + "].grosWt"} defaultValue={o['grosWt']}/></td>
                            <td><input data-add="netWt" className="text-center" name={"mtls[" + i + "].netWt"} defaultValue={o['netWt']}/></td>
                            <td><input data-add="vol" className="text-center" name={"mtls[" + i + "].vol"} defaultValue={o['vol']}/></td>
                        </tr>
                    )
                    }
                    <tr>
                        <td className="weight text-center" colSpan="2">
                            <p className="weight text-center title">TOTAL:</p>
                        </td>
                        <td>
                            <input data-sum="packing" className="weight title" type="" name="totalPacking" defaultValue={getOneData['totalPacking']}/>
                        </td>
                        <td>
                            <input data-sum="qty" className="weight title" type="" name="totalQty" defaultValue={getOneData['totalQty']}/>
                        </td>
                        <td>
                            <input data-sum="grosWt" className="weight title" type="" name="totalGrosWt" defaultValue={getOneData['totalGrosWt']}/>
                        </td>
                        <td>
                            <input data-sum="netWt" className="weight title" type="" name="totalNetWt" defaultValue={getOneData['totalNetWt']}/>
                        </td>
                        <td>
                            <input data-sum="vol" className="weight title" type="" name="totalVol" defaultValue={getOneData['totalVol']}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <footer>
                    <textarea rows="5" name="remark" defaultValue={getOneData['remark']}></textarea>
                </footer>
            </div>
        );
    }
}

// 清关发票
class CommercialInvoice extends Component {
    render() {
        let {getOneData} = this.props;
        return (
            <div className="print-template commercial-invoice">
                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock'] || 0}/>
                <input type="hidden" name="isClearance" defaultValue={getOneData['isClearance']}/>
                <input type="hidden" name="isPacking" defaultValue={getOneData['isPacking']}/>
                {/*<!-- 隐藏域 over -->*/}
                <header>
                    <img src={LogImage}/>
                    <h3><input name="company" defaultValue={getOneData['company']} className="text-right" type="text"/></h3>
                    <p><input name="companyAddr" defaultValue={getOneData['companyAddr']} className="text-right" type="text"/></p>
                    <p>
                        <label>TEL:</label>
                        <span><input name="companyTel" defaultValue={getOneData['companyTel']} type="text"
                                     style={{width: '108px'}}/></span>
                        <label>FAX:</label>
                        <span><input name="companyFax" defaultValue={getOneData['companyFax']}  type="text"
                                     style={{width: '108px'}}/></span>
                    </p>
                    <p><input name="companyWeb" defaultValue={getOneData['companyWeb']} className="text-right" type="text"/></p>
                </header>
                <section>
                    <h1 className="text-center weight">COMMERCIAL INVOICE</h1>
                    <ul>
                        <li className="textarea">
                            <label className="weight">BUYER :</label>
                            <input type="" name="buyer" defaultValue={getOneData['buyer']}/>
                            <textarea rows="3" name="buyerAddr" defaultValue={getOneData['buyerAddr']}></textarea>
                        </li>
                        <li>
                            <label className="weight">FROM :</label>
                            <input type="" name="sStatn" defaultValue={getOneData['sStatn']}/>
                        </li>
                        <li>
                            <label className="weight">PAYMENT :</label>
                            <input type="" name="payment" defaultValue={getOneData['payment']}/>
                        </li>
                    </ul>
                    <ol>
                        <li>
                            <label className="weight">INVOICE NO. :</label>
                            <input type="" name="invoiceNo" defaultValue={getOneData['invoiceNo']}/>
                        </li>
                        <li>
                            <label className="weight">DATE :</label>
                            <input type="" name="date" defaultValue={getOneData['date']}/>
                        </li>
                        <hr/>
                        <li>
                            <label className="weight">TO :</label>
                            <input type="" name="eStatn" defaultValue={getOneData['eStatn']}/>
                        </li>
                        <li>
                            <p className="weight">{getOneData['origin']}</p>
                        </li>
                    </ol>
                    <p>The Seller confirms to sell the under-mentioned goods to the Buyer on the following terms and conditions.</p>
                </section>
                <table cellSpacing="0">
                    <thead>
                    <tr className="title">
                        <th className="weight">
                            Marks & No
                        </th>
                        <th className="weight">
                            Commodity & Spcification
                        </th>
                        <th className="weight">
                            Quantity
                        </th>
                        <th className="weight">
                            Unit Price
                        </th>
                        <th className="weight">
                            Amount
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colSpan="5">
                            <input className="weight text-right title" style={{paddingRight: "177px"}} type="" name="income"
                                   defaultValue={getOneData['income']}/>
                        </td>
                    </tr>
                    {getOneData['mtls'].map((o, i) =>
                        i == 0 ?
                            <tr key={i}>
                                <td rowSpan={getOneData['mtls'].length + 1}>
                                    {/*<!-- 隐藏域 begin -->*/}
                                    <input type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                    <input type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                    <input type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                    {/*<!-- 隐藏域 over -->*/}
                                    <input className="text-center" name={"mtls[" + i + "].marks"} defaultValue={o['marks']}/>
                                </td>
                                <td>
                                    <textarea className="text-center" name={"mtls[" + i + "].mtlEn"} defaultValue={o['mtlEn']}></textarea>
                                </td>
                                <td><input data-addR={'qty'} data-mul={i} className="text-center" name={"mtls[" + i + "].qty"} defaultValue={o['qty']}/></td>
                                <td><input data-mul={i} className="text-center" name={"mtls[" + i + "].unitPrice"} defaultValue={o['unitPrice']}/></td>
                                <td><input data-addR={'amount'} data-mulSum={'sum'+i} className="text-center" name={"mtls[" + i + "].amount"} defaultValue={o['amount']}/></td>
                            </tr>
                            :
                            <tr key={i}>
                                <td>
                                    {/*<!-- 隐藏域 begin -->*/}
                                    <input type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                    <input type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                    <input type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                    {/*<!-- 隐藏域 over -->*/}
                                    <textarea className="text-center" name={"mtls[" + i + "].mtlEn"} defaultValue={o['mtlEn']}></textarea>
                                </td>
                                <td><input data-addR={'qty'} data-mul={i} className="text-center" name={"mtls[" + i + "].qty"} defaultValue={o['qty']}/></td>
                                <td><input data-mul={i} className="text-center" name={"mtls[" + i + "].unitPrice"} defaultValue={o['unitPrice']}/></td>
                                <td><input data-addR={'amount'} data-mulSum={'sum'+i} className="text-center" name={"mtls[" + i + "].amount"} defaultValue={o['amount']}/></td>
                            </tr>
                    )
                    }
                    </tbody>
                </table>
                <footer>
                    <ul>
                        <li className="weight">TOTAL:</li>
                        <li className="weight text-right">
                            <input data-sumR={'qty'} name="totalQty" defaultValue={getOneData['totalQty']}/>
                        </li>
                        <li className="weight text-right">
                            <input data-sumR={'amount'} name="totalAmt" defaultValue={getOneData['totalAmt']}/>
                        </li>
                    </ul>
                    <p className="weight text-right">
                        <input className="text-right" name="capitalAmt" defaultValue={getOneData['capitalAmt']} style={{width: "80%"}}/>
                    </p>
                    <textarea rows="3" name="remark" defaultValue={getOneData['remark']}></textarea>
                </footer>
            </div>
        );
    }
}

// 报关单
class Declaration extends Component {
    render() {
        let {getOneData} = this.props;
        return (
            <div className="print-template customs-declaration">
                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock'] || 0}/>
                {/*<!-- 隐藏域 over -->*/}
                <header className="">
                    <h1 className="text-center" style={{fontSize: "21px"}}>{i18n.t(600099/*中华人民共和国海关出口货物报关单（最新版）*/)}</h1>
                    {/*<!--
                    <ul>
                        <li>
                            <label>预录入编号：</label>
                            <span>674683423424242434</span>
                        </li>
                        <li>
                            <label>海关编号：</label>
                            <span>543643653454354395874859</span>
                        </li>
                    </ul>
                    -->*/}
                </header>
                <table cellSpacing="0">
                    <tbody>
                    <tr>
                        <td colSpan="3">{i18n.t(201327/*收发货人*/)}</td>
                        <td colSpan="3">{i18n.t(201313/*出口口岸*/)}</td>
                        <td colSpan="2">{i18n.t(201328/*出口日期*/)}</td>
                        <td colSpan="2">{i18n.t(201329/*申报日期*/)}</td>
                    </tr>
                    <tr>
                        <td colSpan="3"><input type="" name="consigner" defaultValue={getOneData['consigner']}/></td>
                        <td colSpan="3"><input type="" name="sStatn" defaultValue={getOneData['sStatn']}/></td>
                        <td colSpan="2"><input readOnly type="" name=""/></td>
                        <td colSpan="2"><input readOnly type="" name=""/></td>
                    </tr>
                    <tr>
                        <td colSpan="3">{i18n.t(201330/*生产销售单位*/)}</td>
                        <td colSpan="2">{i18n.t(100224/*运输方式*/)}</td>
                        <td colSpan="3">{i18n.t(201331/*运输工具名称*/)}</td>
                        <td colSpan="2">{i18n.t(201332/*提运单号*/)}</td>
                    </tr>
                    <tr>
                        <td colSpan="3"><input type="" name="company" defaultValue={getOneData['company']}/></td>
                        <td colSpan="2"><input type="" name="shippingType" defaultValue={getOneData['shippingType']}/></td>
                        <td colSpan="3"><input readOnly type="" name=""/></td>
                        <td colSpan="2"><input readOnly type="" name=""/></td>
                    </tr>
                    <tr>
                        <td colSpan="3">{i18n.t(201333/*申报单位*/)}</td>
                        <td colSpan="2">{i18n.t(201334/*监管方式*/)}</td>
                        <td colSpan="3">{i18n.t(201335/*征免性质*/)}</td>
                        <td colSpan="2">{i18n.t(201336/*备案号*/)}</td>
                    </tr>
                    <tr>
                        <td colSpan="3"><input readOnly type="" name=""/></td>
                        <td colSpan="2"><input type="" name="supervision" defaultValue={getOneData['supervision']}/></td>
                        <td colSpan="3"><input type="" name="conscription" defaultValue={getOneData['conscription']}/></td>
                        <td colSpan="2"><input readOnly type="" name=""/></td>
                    </tr>
                    <tr>
                        <td colSpan="2">{i18n.t(600100/*贸易国（地区）*/)}</td>
                        <td colSpan="2">{i18n.t(600101/*运抵国（地区）*/)}</td>
                        <td colSpan="4">{i18n.t(201337/*指运港*/)}</td>
                        <td colSpan="2">{i18n.t(400077/*境内货源地*/)}</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><input type="" name="tradeCountry" defaultValue={getOneData['tradeCountry']}/></td>
                        <td colSpan="2"><input type="" name="shipmentCountry" defaultValue={getOneData['shipmentCountry']}/></td>
                        <td colSpan="4"><input type="" name="eStatn" defaultValue={getOneData['eStatn']}/></td>
                        <td colSpan="2"><input type="" name="domesticSupply" defaultValue={getOneData['domesticSupply']}/></td>
                    </tr>
                    <tr>
                        <td colSpan="2">{i18n.t(201338/*许可证号*/)}</td>
                        <td colSpan="2">{i18n.t(201339/*成交方式*/)}</td>
                        <td colSpan="2">{i18n.t(201088/*运费*/)}</td>
                        <td colSpan="2">{i18n.t(201243/*保费*/)}</td>
                        <td colSpan="2">{i18n.t(201340/*杂费*/)}</td>

                    </tr>
                    <tr>
                        <td colSpan="2"><input readOnly type="" name=""/></td>
                        <td colSpan="2"><input type="" name="income" defaultValue={getOneData['income']}/></td>
                        <td colSpan="2"><input type="" name="freightPrice" defaultValue={getOneData['freightPrice']}/></td>
                        <td colSpan="2"><input type="" name="premium" defaultValue={getOneData['premium']}/></td>
                        <td colSpan="2"><input type="" name="incidentals" defaultValue={getOneData['incidentals']}/></td>
                    </tr>
                    <tr>
                        <td colSpan="2">{i18n.t(201341/*合同协议号*/)}</td>
                        <td colSpan="2">{i18n.t(200315/*件数*/)}</td>
                        <td colSpan="2">{i18n.t(201342/*包装种类*/)}</td>
                        <td colSpan="2">{i18n.t(600102/*毛重（公斤）*/)}</td>
                        <td colSpan="2">{i18n.t(600103/*净重（公斤）*/)}</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><input type="" name="saleNo" defaultValue={getOneData['saleNo']}/></td>
                        <td colSpan="2"><input type="" name="totalPackingNum" defaultValue={getOneData['totalPackingNum']}/></td>
                        <td colSpan="2"><input type="" name="totalPackingName" defaultValue={getOneData['totalPackingName']}/></td>
                        <td colSpan="2"><input type="" name="totalGrosWt" defaultValue={getOneData['totalGrosWt']}/></td>
                        <td colSpan="2"><input type="" name="totalNetWt" defaultValue={getOneData['totalNetWt']}/></td>
                    </tr>
                    <tr>
                        <td colSpan="2">{i18n.t(200351/*集装箱号*/)}</td>
                        <td colSpan="8">{i18n.t(201343/*随附单证*/)}</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><input readOnly type="" name=""/></td>
                        <td colSpan="8"><input readOnly type="" name=""/></td>
                    </tr>
                    <tr>
                        <td colSpan="10">{i18n.t(201344/*标记唛码及备注*/)}</td>
                    </tr>
                    <tr>
                        <td colSpan="10"><textarea readOnly></textarea></td>
                    </tr>
                    <tr>
                        <td className="text-center" style={{width: "41px"}}>{i18n.t(201345/*项号*/)}</td>
                        <td className="text-center">{i18n.t(201346/*商品编号*/)}</td>
                        <td className="text-center">{i18n.t(201347/*商品名称、规格型号*/)}</td>
                        <td className="text-center">{i18n.t(201348/*数量及单位*/)}</td>
                        <td className="text-center">{i18n.t(600104/*最终目的国（地区）*/)}</td>
                        <td className="text-center">{i18n.t(600105/*原产国（地区）*/)}</td>
                        <td className="text-center">{i18n.t(201349/*单价*/)}</td>
                        <td className="text-center">{i18n.t(400109/*总价*/)}</td>
                        <td className="text-center">{i18n.t(201350/*币制*/)}</td>
                        <td className="text-center">{i18n.t(201351/*征免*/)}</td>
                    </tr>
                    {getOneData['mtls'].map((o, i) =>
                        <tr key={i}>
                            <td>
                                {/*<!-- 隐藏域 begin -->*/}
                                <input type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                <input type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                <input type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                {/*<!-- 隐藏域 over -->*/}
                                <input className="text-center" name={"mtls[" + i + "].serialNo"} defaultValue={o['serialNo']}/>
                            </td>
                            <td><input className="text-center" name={"mtls[" + i + "].hsCode"} defaultValue={o['hsCode']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].mtl"} defaultValue={o['mtl']}/></td>
                            <td><input data-mul={i} className="text-center" name={"mtls[" + i + "].netWt"} defaultValue={o['netWt']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].tradeCountry"} defaultValue={o['tradeCountry']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].originCountry"} defaultValue={o['originCountry']}/>
                            </td>
                            <td><input data-mul={i} className="text-center" name={"mtls[" + i + "].unitPrice"} defaultValue={o['unitPrice']}/></td>
                            <td><input data-mulSum={'sum'+i} className="text-center" name={"mtls[" + i + "].amount"} defaultValue={o['amount']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].cny"} defaultValue={o['cny']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].conscription"} defaultValue={o['conscription']}/></td>
                        </tr>
                    )
                    }
                    </tbody>
                </table>

            </div>
        );
    }
}

// shipping-advice
class ShippingAdvice extends Component {
    render() {
        let {getOneData} = this.props;
        return (
            <div className="print-template shipping-advice">
                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock'] || 0}/>
                <input type="hidden" name="isClearance" defaultValue={getOneData['isClearance']}/>
                <input type="hidden" name="isPacking" defaultValue={getOneData['isPacking']}/>
                {/*<!-- 隐藏域 over -->*/}
                <header style={{borderBottomStyle: "ridge"}}>
                    <img src={LogImage}/>
                    <h3><input name="company" defaultValue={getOneData['company']} className="text-right" type="text"/></h3>
                    <p><input name="companyAddr" defaultValue={getOneData['companyAddr']} className="text-right" type="text"/></p>
                    <p>
                        <label>TEL:</label>
                        <span><input name="companyTel" defaultValue={getOneData['companyTel']}  type="text"
                                     style={{width: '108px'}}/></span>
                        <label>FAX:</label>
                        <span><input name="companyFax" defaultValue={getOneData['companyFax']}  type="text"
                                     style={{width: '108px'}}/></span>
                    </p>
                    <p><input name="companyWeb" defaultValue={getOneData['companyWeb']} className="text-right" type="text"/></p>
                </header>
                <section>
                    <h1 className="text-center weight">SHIPPING ADVICE</h1>
                </section>
                <table cellSpacing="0">
                    <tbody>
                    <tr>
                        <td className="weight" style={{width: "200px"}}>INVOICE NO:<br/>&nbsp;</td>
                        <td><input type="" name="invoiceNo" defaultValue={getOneData['invoiceNo']}/></td>
                    </tr>
                    <tr>
                        <td className="weight">SHIPPER:<br/>{i18n.t(201315/*发货人*/)}</td>
                        <td>
                            <input type="" name="consigner" defaultValue={getOneData['consigner']}/>
                            <textarea rows="3" name="consignerAddr" defaultValue={getOneData['consignerAddr']}></textarea>
                            <input type="" name="consignerFax" defaultValue={getOneData['consignerFax']}/>
                            <input type="" name="consignerTel" defaultValue={getOneData['consignerTel']}/>
                        </td>
                    </tr>
                    <tr>
                        <td className="weight">CONSIGNEE:<br/>{i18n.t(200344/*收货人*/)}</td>
                        <td>
                            <input type="" name="consignee" defaultValue={getOneData['consignee']}/>
                            <textarea rows="3" name="consigneeAddr" defaultValue={getOneData['consigneeAddr']}></textarea>
                            <input type="" name="consigneeFax" defaultValue={getOneData['consigneeFax']}/>
                            <input type="" name="consigneeTel" defaultValue={getOneData['consigneeTel']}/>
                        </td>
                    </tr>
                    <tr>
                        <td className="weight">NOTIFY:<br/>{i18n.t(200346/*通知人*/)}</td>
                        <td>
                            <input type="" name="notifier" defaultValue={getOneData['notifier']}/>
                            <textarea rows="3" name="notifierAddr" defaultValue={getOneData['notifierAddr']}></textarea>
                            <input type="" name="notifierFax" defaultValue={getOneData['notifierFax']}/>
                            <input type="" name="notifierTel" defaultValue={getOneData['notifierTel']}/>
                        </td>
                    </tr>
                    <tr>
                        <td className="weight">B/L NO:<br/>{i18n.t(200383/*提单号*/)}</td>
                        <td><input type="" name="bnlNo" defaultValue={getOneData['bnlNo']}/></td>
                    </tr>
                    <tr>
                        <td className="weight">V/V:<br/>{i18n.t(200384/*船名航次*/)}</td>
                        <td><input type="" name="vnv" defaultValue={getOneData['vnv']}/></td>
                    </tr>
                    <tr>
                        <td className="weight">C/N:<br/>{i18n.t(200351/*集装箱号*/)}</td>
                        <td><input type="" name="cnn" defaultValue={getOneData['cnn']}/></td>
                    </tr>
                    <tr>
                        <td className="weight">GOODS:<br/>{i18n.t(201352/*品名*/)}</td>
                        <td><input type="" name="goods" defaultValue={getOneData['goods']}/></td>
                    </tr>
                    <tr>
                        <td className="weight">QUANTITY:<br/>{i18n.t(201353/*件数、毛重、体积*/)}</td>
                        <td><input type="" name="quantity" defaultValue={getOneData['quantity']}/></td>
                    </tr>
                    <tr>
                        <td className="weight">PORT OF LOADING:<br/>{i18n.t(201354/*起运港、国家*/)}</td>
                        <td><input type="" name="sStatn" defaultValue={getOneData['sStatn']}/></td>
                    </tr>
                    <tr>
                        <td className="weight">PORT OF DESTINATION:<br/>{i18n.t(201355/*目的港、国家*/)}</td>
                        <td><input type="" name="eStatn" defaultValue={getOneData['eStatn']}/></td>
                    </tr>
                    <tr>
                        <td className="weight">ETD:<br/>{i18n.t(201356/*实际出运日期*/)}</td>
                        <td><input type="" name="etd" defaultValue={getOneData['etd']}/></td>
                    </tr>
                    <tr>
                        <td className="weight">ETA:<br/>{i18n.t(201357/*预计到港日期*/)}</td>
                        <td><input type="" name="eta" defaultValue={getOneData['eta']}/></td>
                    </tr>
                    <tr>
                        <td className="weight">SHIPPING COMPANY:</td>
                        <td><input type="" name="shippingCompany" defaultValue={getOneData['shippingCompany']}/></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

// 清关箱单 （商检）
class PackingList2 extends Component {
    render() {
        let {getOneData} = this.props;
        return (
            <div className="print-template commercial-invoice invoice">
                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock'] || 0}/>
                <input type="hidden" name="isClearance" defaultValue={getOneData['isClearance']}/>
                <input type="hidden" name="isPacking" defaultValue={getOneData['isPacking']}/>
                {/*<!-- 隐藏域 over -->*/}
                <header>
                    <img src={LogImage}/>
                    <h1><input className="text-center" type="text" name="company" defaultValue={getOneData['company']}/></h1>
                    <p><input className="text-center" type="text" name="companyAddr" defaultValue={getOneData['companyAddr']}/></p>
                    <p>
                        <label>TEL:</label>
                        <span><input type="text" name="companyTel" defaultValue={getOneData['companyTel']} style={{width: "150px"}}/></span>
                        <label>FAX:</label>
                        <span><input type="text" name="companyFax" defaultValue={getOneData['companyFax']} style={{width: "150px"}}/></span>
                    </p>
                </header>
                <section>
                    <h1 className="text-center weight">PACKING LIST</h1>
                    <ul>
                        <li className="textarea">
                            <label className="weight">TO :</label>
                            <input type="" name="buyer" defaultValue={getOneData['buyer']}/>
                            {/*<!-- <textarea rows="3" name="buyerAddr">{{!it.buyerAddr || ''}}</textarea> -->*/}
                        </li>
                        <li>
                            <label className="weight">FROM :</label>
                            <input type="" name="sStatn" defaultValue={getOneData['sStatn']}/>
                        </li>
                        <li>
                            <label className="weight">Payment :</label>
                            <input type="" name="payment" defaultValue={getOneData['payment']}/>
                        </li>
                    </ul>
                    <ol>
                        <li>
                            <label className="weight">Invoice NO. :</label>
                            <input type="" name="orderNo" defaultValue={getOneData['orderNo']}/>
                        </li>
                        <li>
                            <label className="weight">Date :</label>
                            <input type="" name="date" defaultValue={getOneData['date']}/>
                        </li>
                        <hr/>
                        <li>
                            <label className="weight">To :</label>
                            <input type="" name="eStatn" defaultValue={getOneData['eStatn']}/>
                        </li>
                        <li>
                            <p className="weight">{getOneData['origin'] || ' '}</p>
                        </li>
                    </ol>
                </section>
                <table cellSpacing="0">
                    <thead>
                    <tr className="title">
                        <th className="weight" style={{width: "300px"}}>
                            Description & Specification
                        </th>
                        <th className="weight">
                            Packages
                        </th>
                        <th className="weight">
                            Quantity
                        </th>
                        <th className="weight">
                            G.W.(KGS)
                        </th>
                        <th className="weight">
                            N.W.(KGS)
                        </th>
                        <th className="weight">
                            VOL(CBM)
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {getOneData['mtls'].map((o, i) =>
                        <tr key={i}>
                            <td>
                                {/*<!-- 隐藏域 begin -->*/}
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                {/*<!-- 隐藏域 over -->*/}
                                <textarea data-index={i} className="text-center" name={"mtls[" + i + "].mtlEn"}
                                          defaultValue={o['mtlEn']}></textarea>
                            </td>
                            <td>
                                <textarea data-index={i} className="text-center" name={"mtls[" + i + "].packing"}
                                          defaultValue={o['packing']}></textarea>
                            </td>
                            <td><input data-index={i} className="text-center" name={"mtls[" + i + "].qty"} defaultValue={o['qty']}/></td>
                            <td><input data-index={i} className="text-center" name={"mtls[" + i + "].grosWt"} defaultValue={o['grosWt']}/>
                            </td>
                            <td><input data-index={i} className="text-center" name={"mtls[" + i + "].netWt"} defaultValue={o['netWt']}/>
                            </td>
                            <td><input data-index={i} className="text-center" name={"mtls[" + i + "].vol"} defaultValue={o['vol']}/></td>
                        </tr>
                    )
                    }
                    <tr>
                        <td className="weight text-center">
                            <p className="weight text-right title">TOTAL:</p>
                        </td>
                        <td>
                            <textarea className="weight title text-center" name="totalPacking"
                                      defaultValue={getOneData['totalPacking']}></textarea>
                        </td>
                        <td>
                            <input className="weight title" type="" name="totalQty" defaultValue={getOneData['totalQty']}/>
                        </td>
                        <td>
                            <input className="weight title" type="" name="totalGrosWt" defaultValue={getOneData['totalGrosWt']}/>
                        </td>
                        <td>
                            <input className="weight title" type="" name="totalNetWt" defaultValue={getOneData['totalNetWt']}/>
                        </td>
                        <td>
                            <input className="weight title" className="weight" type="" name="totalVol"
                                   defaultValue={getOneData['totalVol']}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

// invoice
class Invoice extends Component {
    render() {
        let {getOneData} = this.props;
        return (
            <div className="print-template commercial-invoice invoice">
                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock'] || 0}/>
                <input type="hidden" name="isClearance" defaultValue={getOneData['isClearance']}/>
                <input type="hidden" name="isPacking" defaultValue={getOneData['isPacking']}/>
                {/*<!-- 隐藏域 over -->*/}
                <header>
                    <img src={LogImage}/>
                    <h1><input className="text-center" type="text" name="company" defaultValue={getOneData['company']}/></h1>
                    <p><input className="text-center" type="text" name="companyAddr" defaultValue={getOneData['companyAddr']}/></p>
                    <p>
                        <label>TEL:</label>
                        <span><input type="text" name="companyTel" defaultValue={getOneData['companyTel']} style={{width: "150px"}}/></span>
                        <label>FAX:</label>
                        <span><input type="text" name="companyFax" defaultValue={getOneData['companyFax']} style={{width: "150px"}}/></span>
                    </p>
                </header>
                <section>
                    <h1 className="text-center weight">INVOICE</h1>
                    <ul>
                        <li className="textarea">
                            <label className="weight">To :</label>
                            <input type="" name="buyer" defaultValue={getOneData['buyer']}/>
                            {/*<!-- <textarea rows="3" name="buyerAddr">{{!it.buyerAddr || ''}}</textarea> -->*/}
                        </li>
                        <li>
                            <label className="weight">From :</label>
                            <input type="" name="sStatn" defaultValue={getOneData['sStatn']}/>
                        </li>
                        <li>
                            <label className="weight">Payment :</label>
                            <input type="" name="payment" defaultValue={getOneData['payment']}/>
                        </li>
                    </ul>
                    <ol>
                        <li>
                            <label className="weight">Invoice No. :</label>
                            <input type="" name="orderNo" defaultValue={getOneData['orderNo']}/>
                        </li>
                        <li>
                            <label className="weight">Date :</label>
                            <input type="" name="date" defaultValue={getOneData['date']}/>
                        </li>
                        <hr/>
                        <li>
                            <label className="weight">To :</label>
                            <input type="" name="eStatn" defaultValue={getOneData['eStatn']}/>
                        </li>
                        <li>
                            <p className="weight">{getOneData['origin'] || ''}</p>
                        </li>
                    </ol>
                </section>
                <table cellSpacing="0">
                    <thead>
                    <tr className="title">
                        <th className="weight">
                            Marks and Numbers
                        </th>
                        <th className="weight">
                            Description & Spcification
                        </th>
                        <th className="weight">
                            Quantity/KG
                        </th>
                        <th className="weight">
                            Unit Price
                        </th>
                        <th className="weight">
                            Amount
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colSpan="5">
                            <input className="weight text-right title" style={{paddingRight: "177px"}} type="" name="income"
                                   defaultValue={getOneData['income']}/>
                        </td>
                    </tr>
                    {getOneData['mtls'].map((o, i) =>
                        <tr key={i}>
                            <td>
                                {/*<!-- 隐藏域 begin -->*/}
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                {/*<!-- 隐藏域 over -->*/}
                                <input data-index={i} name={"mtls[" + i + "].marks"} defaultValue={o['marks']}/>
                            </td>
                            <td>
                                <textarea data-index={i} className="text-center" name={"mtls[" + i + "].mtlEn"}
                                          defaultValue={o['mtlEn']}></textarea>
                            </td>
                            <td><input data-index={i} name={"mtls[" + i + "].qty"} defaultValue={o['qty']}/></td>
                            <td><input data-index={i} name={"mtls[" + i + "].unitPrice"} defaultValue={o['unitPrice']}/></td>
                            <td><input data-index={i} name={"mtls[" + i + "].amount"} defaultValue={o['amount']}/></td>
                        </tr>
                    )
                    }
                    <tr>
                        <td>
                            <span>N/M</span>
                        </td>
                        <td></td>
                        <td>
                            <input readOnly name="totalQty" defaultValue={getOneData['totalQty']}/>
                        </td>
                        <td></td>
                        <td>
                            <input readOnly name="totalAmt" defaultValue={getOneData['totalAmt']}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

// sales-contract
class SalesContract extends Component {
    render() {
        let {getOneData} = this.props;
        return (
            <div className="print-template sales-contract">
                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock'] || 0}/>
                <input type="hidden" name="isClearance" defaultValue={getOneData['isClearance']}/>
                <input type="hidden" name="isPacking" defaultValue={getOneData['isPacking']}/>
                {/*<!-- 隐藏域 over -->*/}
                <header>
                    <img src={LogImage}/>
                    <h1><input className="text-center" type="text" name="company" defaultValue={getOneData['company']}/></h1>
                    <p><input className="text-center" type="text" name="companyAddr" defaultValue={getOneData['companyAddr']}/></p>
                    <p>
                        <label>TEL:</label>
                        <span><input type="text" name="companyTel" defaultValue={getOneData['companyTel']} style={{width: "150px"}}/></span>
                        <label>FAX:</label>
                        <span><input type="text" name="companyFax" defaultValue={getOneData['companyFax']} style={{width: "150px"}}/></span>
                    </p>
                </header>
                <section>
                    <h1 className="text-center weight" style={{fontSize: "23px"}}>SALES CONTRACT</h1>
                    <ul>
                        <li className="textarea">
                            <label className="weight">The Buyers :</label>
                            <input type="" name="buyer" defaultValue={getOneData['buyer']}/>
                            {/*<!-- <textarea rows="3" name="buyerAddr">{{!it.buyerAddr || ''}}</textarea> -->*/}
                        </li>
                    </ul>
                    <ol>
                        <li>
                            <label className="weight">Contract NO. :</label>
                            <input type="" name="orderNo" defaultValue={getOneData['orderNo']}/>
                        </li>
                        <li>
                            <label className="weight">Date :</label>
                            <input type="" name="date" defaultValue={getOneData['date']}/>
                        </li>
                    </ol>
                </section>
                <p>The Undersign Sellers And Buyers Have Agreed To Close The Following Transaction According To The Terms And Condition
                    Stipulated Below.</p>

                <table cellSpacing="0">
                    <thead>
                    <tr className="title">
                        <th className="weight">
                            HS code No
                        </th>
                        <th className="weight">
                            Description & Specification
                        </th>
                        <th className="weight">
                            Quantity/KG
                        </th>
                        <th className="weight">
                            Unit Price
                        </th>
                        <th className="weight">
                            Amount
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colSpan="5">
                            <input className="weight text-right title" style={{paddingRight: "177px"}} type="" name="income"
                                   defaultValue={getOneData['income']}/>
                        </td>
                    </tr>
                    {getOneData['mtls'].map((o, i) =>
                        <tr key={i}>
                            <td>
                                {/*<!-- 隐藏域 begin -->*/}
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                {/*<!-- 隐藏域 over -->*/}
                                <input className="text-center" name={"mtls[" + i + "].hsCode"} defaultValue={o['hsCode']}/>
                            </td>
                            <td>
                                <textarea data-index={i} className="text-center" name={"mtls[" + i + "].mtlEn"}
                                          defaultValue={o['mtlEn']}></textarea>
                            </td>
                            <td><input className="text-center" name={"mtls[" + i + "].qty"} defaultValue={o['qty']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].unitPrice"} defaultValue={o['unitPrice']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].amount"} defaultValue={o['amount']}/></td>
                        </tr>
                    )
                    }
                    <tr>
                        <td className="weight text-center" colSpan="2">
                            <p className="weight text-right title">TOTAL:</p>
                        </td>
                        <td>
                            <input className="weight text-right" name="totalQty" defaultValue={getOneData['totalQty']}/>
                        </td>
                        <td></td>
                        <td>
                            <input className="weight text-right" name="totalAmt" defaultValue={getOneData['totalAmt']}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <br/>
                <footer>
                    <li className="no-drop">
                        <label>(1)Time of Shipment :</label>
                        <span style={{paddingLeft: "20px"}}>Before 21-Jul-2015</span>
                    </li>
                    <li className="no-drop">
                        <label>(2)Loading Port & Destination :</label>
                        <span style={{paddingLeft: "20px"}}>From</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <input className="weight" name="sStatn" defaultValue={getOneData['sStatn']} style={{width: "200px"}}/>
                        <span style={{paddingLeft: "20px"}}>To</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <input className="weight" type="" name="eStatn" defaultValue={getOneData['eStatn']} style={{width: "200px"}}/>
                    </li>
                    <li className="no-drop">
                        <label>(3)Terms of Payment :</label>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="" name="payment" defaultValue={getOneData['payment']}/>
                    </li>
                    <li className="no-drop">
                        <label>(4)Insurance :</label>
                        <span style={{paddingLeft: "20px"}}>Covered by the buyer</span>
                    </li>
                    <li className="no-drop">
                        <label>(5)Shipping Mark :</label>
                    </li>
                    <li className="no-drop">
                        <label>(6)Packing :</label>
                        <span style={{paddingLeft: "20px"}}>25 Kgs Bag</span>
                    </li>
                    <li className="no-drop">
                        <label>(7)USAGE : THIS PRODUCT IS ROR FOODPROCESSING USES</label>
                    </li>
                    <li className="no-drop">
                        <label>Beneficiary :</label>
                        <input type="" name=""/>
                    </li>
                    <p>
                        {getOneData['company']}
                    </p>
                    <p>
                        {getOneData['companyAddr']}
                    </p>
                    <p>
                        <label>Tel :</label>
                        <span>{getOneData['companyTel']}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <label>Fax :</label>
                        <span>{getOneData['companyFax']}</span>
                    </p>
                    <br/>
                    <li>
                        <label>REMARKS :</label>
                    </li>
                    <li className="remarks">
                        <span></span>
                        <span>The Buyers Signature</span>
                        <span></span>
                        <span>The Sellers Signature</span>
                        <span></span>
                    </li>
                </footer>
            </div>
        );
    }
}

// 产品购销合同
class Contract extends Component {
    render() {
        let {getOneData} = this.props;
        return (
            <div className="print-template contract">
                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock'] || 0}/>
                <input type="hidden" name="isClearance" defaultValue={getOneData['isClearance']}/>
                <input type="hidden" name="isPacking" defaultValue={getOneData['isPacking']}/>
                {/*<!-- 隐藏域 over -->*/}
                <header>
                    <h2><input className="text-left" type="text" name="company" defaultValue={getOneData['company']}/></h2>
                    <p><input className="text-left" type="text" name="companyAddr" defaultValue={getOneData['companyAddr']}/></p>
                    <p>
                        <label>TEL:</label>
                        <span><input type="text" name="companyTel" defaultValue={getOneData['companyTel']} style={{width: "150px"}}/></span>
                        &nbsp;&nbsp;&nbsp;
                        <label>FAX:</label>
                        <span><input type="text" name="companyFax" defaultValue={getOneData['companyFax']} style={{width: "150px"}}/></span>
                    </p>
                    <p><input className="text-left" type="text" name="companyWeb" defaultValue={getOneData['companyWeb']}/></p>
                </header>
                <section>
                    <h1 className="text-center" style={{fontSize: '23px'}}>{i18n.t(201358/*产品购销合同*/)}</h1>
                    <ul className="head">
                        <li>
                            <label>{i18n.t(600106/*供方*/)}：</label>
                            <input type="" name="saler" defaultValue={getOneData['saler']}/>
                        </li>
                        <li>
                            <label>{i18n.t(100481/*地址*/)}：</label>
                            <input type="" name="salerAddr" defaultValue={getOneData['salerAddr']}/>
                        </li>
                        <li>
                            <label>{i18n.t(600107/*需方*/)}：</label>
                            <input type="" name="buyer" defaultValue={getOneData['buyer']}/>
                        </li>
                        <li>
                            <label>{i18n.t(100481/*地址*/)}：</label>
                            <input type="" name="buyerAddr" defaultValue={getOneData['buyerAddr']}/>
                        </li>
                    </ul>
                    <ol className="head">
                        <li>
                            <label>{i18n.t(600108/*合同编号*/)}：</label>
                            <input type="" name="orderNo" defaultValue={getOneData['orderNo']}/>
                        </li>
                        <li>
                            <label>{i18n.t(600109/*签订日期*/)}：</label>
                            <input type="" name="signDate" defaultValue={getOneData['signDate']}/>
                        </li>
                        <li>
                            <label>{i18n.t(600110/*签订地点*/)}：</label>
                            <input type="" name="signAddr" defaultValue={getOneData['signAddr']}/>
                        </li>
                    </ol>
                </section>
                <p style={{marginBottom: "5px"}}>{i18n.t(600111/*供需双方本着平等互利，协商一致的原则签订合同，以资共同信守。*/)}</p>
                <textarea rows="1" name="rule1" defaultValue={getOneData['rule1']}></textarea>
                <table cellSpacing="0">
                    <thead>
                    <tr className="title">
                        <th className="weight">
                            {i18n.t(500061/*产品名称*/)}
                        </th>
                        <th className="weight">
                            {i18n.t(600112/*规格/型号/标准*/)}
                        </th>
                        <th className="weight">
                            {i18n.t(100385/*海关编码*/)}
                        </th>
                        <th className="weight">
                            {i18n.t(201083/*数量*/)}
                        </th>
                        <th className="weight">
                            {i18n.t(100169/*单位*/)}
                        </th>
                        <th className="weight">
                            {i18n.t(600113/*单价*/)}
                        </th>
                        <th className="weight">
                            {i18n.t(600114/*总金额*/)}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {getOneData['mtls'].map((o, i) =>
                        <tr key={i}>
                            <td>
                                {/*<!-- 隐藏域 begin -->*/}
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                {/*<!-- 隐藏域 over -->*/}
                                <input className="text-center" name={"mtls[" + i + "].mtl"} defaultValue={o['mtl']}/>
                            </td>
                            <td><input className="text-center" name={"mtls[" + i + "].specify"} defaultValue={o['specify']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].hsCode"} defaultValue={o['hsCode']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].qty"} defaultValue={o['qty']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].unit"} defaultValue={o['unit']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].unitPrice"} defaultValue={o['unitPrice']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].amount"} defaultValue={o['amount']}/></td>
                        </tr>
                    )
                    }
                    <tr>
                        <td className="weight text-right" colSpan="6">TOTAL:</td>
                        <td>
                            <input className="weight text-right" type="" name="totalAmt" defaultValue={getOneData['totalAmt']}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <li><label className="weight">{i18n.t(600115/*总金额 大写*/)}：</label></li>
                &nbsp;&nbsp;&nbsp;
                <input className="weight" name="capitalAmt" defaultValue={getOneData['capitalAmt']} style={{width: "60%"}}/>
                <textarea rows="1" name="rule2" defaultValue={getOneData['rule2']}></textarea>
                <textarea rows="1" name="rule3" defaultValue={getOneData['rule3']}></textarea>
                <textarea rows="1" name="rule4" defaultValue={getOneData['rule4']}></textarea>
                <textarea rows="1" name="rule5" defaultValue={getOneData['rule5']}></textarea>
                <textarea rows="1" name="rule6" defaultValue={getOneData['rule6']}></textarea>
                <textarea rows="3" name="rule7" defaultValue={getOneData['rule7']}></textarea>
                <textarea rows="3" name="rule8" defaultValue={getOneData['rule8']}></textarea>
                <textarea rows="3" name="rule9" defaultValue={getOneData['rule9']}></textarea>
                <textarea rows="3" name="rule10" defaultValue={getOneData['rule10']}></textarea>
                <textarea rows="3" name="rule11" defaultValue={getOneData['rule11']}></textarea>
                <textarea rows="3" name="rule12" defaultValue={getOneData['rule12']}></textarea>
                <textarea rows="3" name="rule13" defaultValue={getOneData['rule13']}></textarea>
                <textarea rows="1" name="rule14" defaultValue={getOneData['rule14']}></textarea>
                <li><label>{i18n.t(600116/*特别说明*/)}：</label></li>
                <textarea rows="6" name="remark" defaultValue={getOneData['remark']}></textarea>
                <footer>
                    <ul className="sign">
                        <li>
                            <label>{i18n.t(600106/*供方*/)}：</label>
                            <input type="" name="" defaultValue={getOneData['saler']}/>
                        </li>
                        <li>
                            <label>{i18n.t(600107/*需方*/)}：</label>
                            <input type="" name="" defaultValue={getOneData['buyer']}/>
                        </li>
                        <li className="no-drop">
                            <label>{i18n.t(600117/*法定代表人*/)}：</label>
                            <span></span>
                        </li>
                        <li className="no-drop">
                            <label>{i18n.t(600117/*法定代表人*/)}：</label>
                            <span></span>
                        </li>
                        <li className="no-drop">
                            <label>{i18n.t(600118/*签约人(签字)*/)}：</label>
                            <span></span>
                        </li>
                        <li className="no-drop">
                            <label>{i18n.t(600118/*签约人(签字)*/)}：</label>
                            <span></span>
                        </li>
                    </ul>
                </footer>
            </div>
        );
    }
}

// proforma-invoice
class ProformaInvoice extends Component {
    render() {
        let {getOneData} = this.props;
        return (
            <div className="print-template proforma-invoice">
                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock'] || 0}/>
                {/*<!-- 隐藏域 over -->*/}
                <header>
                    <img src={LogImage}/>
                    {/*<h2><input className="text-right" type="text" name="companyZh" defaultValue={getOneData['companyZh']}/></h2>*/}
                    <h2><input className="text-right" type="text" name="company" defaultValue={getOneData['company']}/></h2>
                    <p style={{borderBottom: "1px solid #000"}}><input className="text-right" type="text" name="companyAddr"
                                                                       defaultValue={getOneData['companyAddr']}/></p>
                    <p>
                        <label>TEL:</label>
                        <span><input type="text" name="companyTel" defaultValue={getOneData['companyTel']} style={{width: "128px"}}/></span>
                        <label>FAX:</label>
                        <span><input type="text" name="companyFax" defaultValue={getOneData['companyFax']} style={{width: "128px"}}/></span>
                    </p>
                    <p><input className="text-right" type="text" name="companyWeb" defaultValue={getOneData['companyWeb']}/></p>
                </header>
                <section>
                    <h1 className="text-center weight" style={{fontSize: "23px"}}>Proforma Invoice</h1>
                    <ul>
                        <li>
                            <label className="weight">The Buyers :</label>
                            <input type="" name="buyerTitle" defaultValue={getOneData['buyerTitle']}/>
                        </li>
                        <li>
                            <label className="weight">Add :</label>
                            <input type="" name="buyerAdd" defaultValue={getOneData['buyerAdd']}/>
                        </li>
                        <li>
                            <label className="weight">Tel :</label>
                            <input type="" name="buyerMobile" defaultValue={getOneData['buyerMobile']}/>
                        </li>
                        <li>
                            <label className="weight">Fax :</label>
                            <input type="" name="buyerFax" defaultValue={getOneData['buyerFax']}/>
                        </li>
                    </ul>
                    <ol>
                        <li>
                            <label className="weight">Contract NO. :</label>
                            <input type="" name="buyerContractNo" defaultValue={getOneData['buyerContractNo']}/>
                        </li>
                        <li style={{marginTop: "58px"}}>
                            <label className="weight">Date :</label>
                            <input type="" name="buyDate" defaultValue={getOneData['buyDate']}/>
                        </li>
                    </ol>
                </section>
                <p>The Undersign Sellers And Buyers Have Agreed To Close The Following Transaction According To The Terms And Condition
                    Stipulated Below.</p>
                <table cellSpacing="0">
                    <thead>
                    <tr className="title">
                        <th className="weight">
                            Item No
                        </th>
                        <th className="weight">
                            Description & Specification
                        </th>
                        <th className="weight">
                            Quantity
                        </th>
                        <th className="weight">
                            Unit Price
                        </th>
                        <th className="weight">
                            Amount
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="text-right weight" colSpan="5">
                            <input className="text-right" type="" name="income" defaultValue={getOneData['income']}/>
                        </td>
                    </tr>
                    {getOneData['mtls'].map((o, i) =>
                        <tr key={i}>
                            <td>
                                {/*<!-- 隐藏域 begin -->*/}
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                {/*<!-- 隐藏域 over -->*/}
                                <input className="text-center" name={"mtls[" + i + "].serialNo"} defaultValue={o['serialNo']}/>
                            </td>
                            <td><input className="text-center" name={"mtls[" + i + "].desp"} defaultValue={o['desp']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].quantity"} defaultValue={o['quantity']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].unitPrice"} defaultValue={o['unitPrice']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].amount"} defaultValue={o['amount']}/></td>
                        </tr>
                    )
                    }
                    <tr>
                        <td className="text-right weight" colSpan="2">TOTAL:</td>
                        <td><input className="weight" name="totalQuantity" defaultValue={getOneData['totalQuantity']}/></td>
                        <td></td>
                        <td><input className="weight" name="totalAmount" defaultValue={getOneData['totalAmount']}/></td>
                    </tr>
                    <tr>
                        <td colSpan="5"><input className="text-right weight" name="capitalAmt" defaultValue={getOneData['capitalAmt']}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <footer>
                    {/*<!--
                        <li>
                            <label>(1)</label><span>{{!it.sender1 || ''}}</span>
                        </li>
                    -->*/}
                    <li>
                        <label>(1)Time of Shipment :</label>
                        <input type="" name="sender2" defaultValue={getOneData['sender2']}/>
                    </li>
                    <li>
                        <label>(2)Loading Port & Destination :</label>
                        <input type="" name="sender3" defaultValue={getOneData['sender3']}/>
                    </li>
                    <li>
                        <label>(3)Terms of Payment :</label>
                        <input type="" name="sender4" defaultValue={getOneData['sender4']}/>
                    </li>
                    {/*<!--
                        <li>
                            <label>(5)Package :</label>
                            <input type="" name="sender5" value="{{!it.sender5 || ''}}" />
                        </li>
                        <li>
                            <label>(6)Others :</label>
                            <input type="" name="sender6" value="{{!it.sender6 || ''}}" />
                        </li>
                        <li>
                            <label>(7)Validity :</label>
                            <input type="" name="sender7" value="{{!it.sender7 || ''}}" />
                        </li>
                    -->*/}
                    <ul className="list">
                        <label>Bank Info</label><br/>
                        <li><span>Beneficiary :</span><input type="" name="bankSName" defaultValue={getOneData['bankSName']}/></li>
                        <li><span>Beneficiary address :</span><input type="" name="bankSAddr" defaultValue={getOneData['bankSAddr']}/></li>
                        <li><span>Beneficiary's bank :</span><input type="" name="bankInfo" defaultValue={getOneData['bankInfo']}/></li>
                        <li><span>Bank Address :</span><input type="" name="bankAddr" defaultValue={getOneData['bankAddr']}/></li>
                        <li><span>Bank account :</span><input type="" name="bankSAccountNo" defaultValue={getOneData['bankSAccountNo']}/>
                        </li>
                        <li><span>SWIFT CODE :</span><input type="" name="bankCode" defaultValue={getOneData['bankCode']}/></li>
                    </ul>
                    {/*<!--
                        <li><label>Sales Item:</label></li>
                        <ol>
                            <li>
                                <label>1.Retention of title clause:</label>
                                <textarea rows="3" name="sales1">{{!it.sales1 || ''}}</textarea>
                            </li>
                            <li>
                                <label>2.Quality complaint period:</label>
                                <textarea rows="3" name="sales2">{{!it.sales2 || ''}}</textarea>
                            </li>
                            <li>
                                <label>3.Limit of liability:</label>
                                <textarea rows="3" name="sales3">{{!it.sales3 || ''}}</textarea>
                            </li>
                            <li>
                                <label>4.Subject to coverage by Sinosure:</label>
                                <textarea rows="3" name="sales4">{{!it.sales4 || ''}}</textarea>
                            </li>
                            <li>
                                <label>5.No exclusivity - No compensation clause:</label>
                                <textarea rows="3" name="sales5">{{!it.sales5 || ''}}</textarea>
                            </li>
                            <li>
                                <label>6.Agreed unique payment account:</label>
                                <textarea rows="3" name="sales6">{{!it.sales6 || ''}}</textarea>
                            </li>
                            <li>
                                <label>7.Disclaimer:</label>
                                <textarea rows="3" name="sales7">{{!it.sales7 || ''}}</textarea>
                            </li>
                            <li>
                                <label>8.Jurisdiction Clause:</label>
                                <textarea rows="3" name="sales8">{{!it.sales8 || ''}}</textarea>
                            </li>
                            <hr>
                        </ol>
                    -->*/}
                    <li className="remarks">
                        <span></span>
                        <span>The Buyers Signature</span>
                        <span></span>
                        <span>The Sellers Signature</span>
                        <span></span>
                    </li>
                </footer>
            </div>
        );
    }
}

// sales-contract (销售订单)
class SalesContract2 extends Component {
    render() {
        let {getOneData} = this.props;
        return (
            <div className="print-template sales-contract">

                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock'] || 0}/>
                <input type="hidden" name="isClearance" defaultValue={getOneData['isClearance']}/>
                <input type="hidden" name="isPacking" defaultValue={getOneData['isPacking']}/>
                {/*<!-- 隐藏域 over -->*/}
                <header>
                    <img src={LogImage}/>
                    <h1><input className="text-center" type="text" name="company" defaultValue={getOneData['company']}/></h1>
                    <p><input className="text-center" type="text" name="companyAddr" defaultValue={getOneData['companyAddr']}/></p>
                    <p>
                        <label>TEL:</label>
                        <span><input type="text" name="companyTel" defaultValue={getOneData['companyTel']} style={{width: "128px"}}/></span>
                        <label>FAX:</label>
                        <span><input type="text" name="companyFax" defaultValue={getOneData['companyFax']} style={{width: "128px"}}/></span>
                    </p>
                </header>
                <section style={{display: "inline-block"}}>
                    <h1 className="text-center weight" style={{fontSize: "23px"}}>SALES CONTRACT</h1>
                    <ul>
                        <li className="textarea">
                            <label className="weight">The Buyers :</label>
                            <input type="" name="buyerTitle" defaultValue={getOneData['buyerTitle']}/>
                            {/*<!-- <textarea rows="3" name="buyerAddr">{{!it.buyerAddr || ''}}</textarea> -->*/}
                        </li>
                        <li>
                            <label className="weight">Address ：</label>
                            <input type="" name="buyerAdd" defaultValue={getOneData['buyerAdd']}/>
                        </li>
                        <li>
                            <label className="weight">Tel ：</label>
                            <input type="" name="buyerMobile" defaultValue={getOneData['buyerMobile']}/>
                        </li>
                        <li>
                            <label className="weight">Fax ：</label>
                            <input type="" name="buyerFax" defaultValue={getOneData['buyerFax']}/>
                        </li>
                        <li className="">
                            <label className="weight">Consignee ：</label>
                            <input type="" name="consigner" defaultValue={getOneData['consigner']}/>
                            <textarea name="consignerAddr" style={{marginLeft: "100px"}}
                                      defaultValue={getOneData['consignerAddr']}></textarea>
                            <input type="" name="consignerFax" defaultValue={getOneData['consignerFax']} style={{marginLeft: "100px"}}/>
                            <input type="" name="consignerTel" defaultValue={getOneData['consignerTel']} style={{marginLeft: "100px"}}/>
                        </li>
                        <li>

                        </li>
                    </ul>
                    <ol>
                        <li>
                            <label className="weight">Contract NO. :</label>
                            <input type="" name="buyerContractNo" defaultValue={getOneData['buyerContractNo']}/>
                        </li>
                        <li>
                            <label className="weight">Date :</label>
                            <input type="" name="buyDate" defaultValue={getOneData['buyDate']}/>
                        </li>
                    </ol>
                </section>
                <p>The Undersign Sellers And Buyers Have Agreed To Close The Following Transaction According To The Terms And Condition
                    Stipulated Below.</p>
                <table cellSpacing="0">
                    <thead>
                    <tr className="title">
                        <th className="weight">
                            Item No
                        </th>
                        <th className="weight">
                            Description & Specification
                        </th>
                        <th className="weight">
                            Quantity
                        </th>
                        <th className="weight">
                            Unit Price
                        </th>
                        <th className="weight">
                            Amount
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="text-right weight" colSpan="5">
                            <input className="text-right" type="" name="income" defaultValue={getOneData['income']}/>
                        </td>
                    </tr>
                    {getOneData['mtls'].map((o, i) =>
                        <tr key={i}>
                            <td>
                                {/*<!-- 隐藏域 begin -->*/}
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                {/*<!-- 隐藏域 over -->*/}
                                <input className="text-center" name={"mtls[" + i + "].serialNo"} defaultValue={o['serialNo']}/>
                            </td>
                            <td><input className="text-center" name={"mtls[" + i + "].dns"} defaultValue={o['dns']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].quantity"} defaultValue={o['quantity']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].unitPrice"} defaultValue={o['unitPrice']}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].amt"} defaultValue={o['amt']}/></td>
                        </tr>
                    )
                    }
                    <tr>
                        <td className="weight text-center" colSpan="2">
                            <p className="weight text-right title">TOTAL:</p>
                        </td>
                        <td>
                            <input className="text-right weight" name="totalQuantity" defaultValue={getOneData['totalQuantity']}/>
                        </td>
                        <td></td>
                        <td>
                            <input className="text-right weight" name="totalAmount" defaultValue={getOneData['totalAmount']}/>
                        </td>
                    </tr>
                    <tr>
                        <td className="weight text-right" colSpan="5">
                            <input className="weight text-right title" name="capitalAmt" defaultValue={getOneData['capitalAmt']}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <br/>
                <footer>
                    <li>
                        <label>(1)</label>
                        <input type="" name="sender1" defaultValue={getOneData['sender1']}/>
                    </li>
                    <li>
                        <label>(2)Time of Shipment :</label>
                        <input type="" name="sender2" defaultValue={getOneData['sender2']}/>
                    </li>
                    <li>
                        <label>(3)Loading Port & Destination :</label>
                        <input type="" name="sender3" defaultValue={getOneData['sender3']}/>
                    </li>
                    <li>
                        <label>(4)Terms of Payment :</label>
                        <input type="" name="sender4" defaultValue={getOneData['sender4']}/>
                    </li>
                    <li>
                        <label>(5)Insurance :</label>
                        <input type="" name="sender5" defaultValue={getOneData['sender5']}/>
                    </li>
                    <li>
                        <label>Sales Item:</label>
                    </li>
                    <li>
                        <label>1.Retention of title clause:</label>
                    </li>
                    <textarea rows="3" name="sales1" defaultValue={getOneData['sales1']}></textarea>
                    <li>
                        <label>2.Quality complaint period:</label>
                    </li>
                    <textarea rows="3" name="sales2" defaultValue={getOneData['sales2']}></textarea>
                    <li>
                        <label>3.Limit of liability:</label>
                    </li>
                    <textarea rows="3" name="sales3" defaultValue={getOneData['sales3']}></textarea>
                    <li>
                        <label>4.Subject to coverage by Sinosure:</label>
                    </li>
                    <textarea rows="3" name="sales4" defaultValue={getOneData['sales4']}></textarea>
                    <li>
                        <label>5.No exclusivity-No compensation clause:</label>
                    </li>
                    <textarea rows="3" name="sales5" defaultValue={getOneData['sales5']}></textarea>
                    <li>
                        <label>6.Agreed unique payment account:</label>
                    </li>
                    <textarea rows="3" name="sales6" defaultValue={getOneData['sales6']}></textarea>
                    <li>
                        <label>Jurisdiction Clause:</label>
                    </li>
                    <textarea rows="3" name="sales7" defaultValue={getOneData['sales7']}></textarea>
                    <li className="remarks">
                        <span></span>
                        <span>The Buyers Signature</span>
                        <span></span>
                        <span>The Sellers Signature</span>
                        <span></span>
                    </li>
                </footer>
            </div>
        );
    }
}

// 付款申请
class PayapplyP extends Component {
    render() {
        let {getOneData} = this.props;
        return (
            <div className="print-template">
                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock'] || 0}/>
                <input type="hidden" name="payCc" defaultValue={getOneData['payCc']}/>

                {/*<!-- 隐藏域 over -->*/}
                <table cellSpacing="0">
                    <tbody>
                    <tr>
                        <td colSpan="4">
                            <h1 className="weight" style={{display: "block", padding: "6px 0px", fontSize: "16px"}}>{getOneData['payCc'] || i18n.t(200576/*无*/)}</h1>
                            <h1 className="weight" style={{display: "block", padding: "6px 0px", fontSize: "16px"}}>{i18n.t(201359/*付款申请单*/)}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style={{width: "160px"}} className="weight">{i18n.t(400048/*单据编号*/)}：</td>
                        <td><input type="" name="no" defaultValue={getOneData['no']} readOnly/></td>
                        <td style={{width: "160px"}} className="weight">{i18n.t(100323/*业务日期*/)}：</td>
                        <td><input type="" name="billDate" defaultValue={getOneData['billDate']} readOnly/></td>
                    </tr>
                    <tr>
                        <td className="weight">{i18n.t(500146/*源单类型*/)}：</td>
                        <td><input type="" name="sourceType" defaultValue={getOneData['sourceType']} readOnly/></td>
                        <td className="weight">{i18n.t(500129/*源单编号*/)}：</td>
                        <td><input type="" name="sourceNo" defaultValue={getOneData['sourceNo']} readOnly/></td>
                    </tr>
                    <tr>
                        <td className="weight">{i18n.t(400084/*收款单位*/)}：</td>
                        <td><input type="" name="receiptBeName" defaultValue={getOneData['receiptBeName']} readOnly/></td>
                        <td className="weight">{i18n.t(500086/*收款账号*/)}：</td>
                        <td><input type="" name="receBankAccount" defaultValue={getOneData['receBankAccount']} readOnly/></td>
                    </tr>
                    <tr>
                        <td className="weight">{i18n.t(200821/*收款人名称*/)}：</td>
                        <td><input type="" name="receiverName" defaultValue={getOneData['receiverName']} readOnly/></td>
                        <td className="weight">SWIFTCODE：</td>
                        <td><input type="" name="swiftCode" defaultValue={getOneData['swiftCode']} readOnly/></td>
                    </tr>
                    <tr>
                        <td className="weight">{i18n.t(100505/*收款人地址*/)}：</td>
                        <td colSpan="3"><input type="" name="receiverAddress" defaultValue={getOneData['receiverAddress']} readOnly/></td>
                    </tr>
                    <tr>
                        <td className="weight">{i18n.t(200613/*收款银行*/)}：</td>
                        <td colSpan="3"><input type="" name="receBankName" defaultValue={getOneData['receBankName']} readOnly/></td>
                    </tr>
                    <tr>
                        <td className="weight">{i18n.t(600119/*收款行地址*/)}：</td>
                        <td colSpan="3"><input type="" name="bankAddr" defaultValue={getOneData['bankAddr']} readOnly/></td>
                    </tr>
                    <tr>
                        <td className="weight">{i18n.t(200845/*款项用途*/)}：</td>
                        <td><input id="remark" type="" name="remark" defaultValue={getOneData['remark']}/></td>
                        <td className="weight">{i18n.t(100326/*总金额*/)}：</td>
                        <td><input type="" name="orderAmt" defaultValue={getOneData['orderAmt']} readOnly/></td>
                    </tr>
                    <tr>
                        <td className="weight">{i18n.t(400055/*纸质发票号*/)}：</td>
                        <td colSpan="3"><input type="" name="paperNo" defaultValue={getOneData['paperNo']} readOnly/></td>
                    </tr>
                    </tbody>
                </table>
                <p className="weight" style={{padding: "10px 0px"}}>{i18n.t(200596/*收款计划*/)}</p>
                <table cellSpacing="0" style={{fontSize: "14px"}}>
                    <tbody>
                    <tr>
                        <td className="weight" style={{width: "160px"}}>{i18n.t(200622/*期数*/)}</td>
                        <td className="weight" colSpan="2">{i18n.t(200840/*申请付款时间*/)}</td>
                        <td className="weight" colSpan="2">{i18n.t(200841/*申请付款金额*/)}</td>
                    </tr>
                    {getOneData['plans'].map((o, i) =>
                        <tr key={i}>
                            <td>
                                {/*<!-- 隐藏域 begin -->*/}
                                <input data-index={i} type="hidden" name={"plans[" + i + "].billId"} defaultValue={o['billId']}/>
                                <input data-index={i} type="hidden" name={"plans[" + i + "].id"} defaultValue={o['id']}/>
                                <input data-index={i} type="hidden" name={"plans[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                {/*<!-- 隐藏域 over -->*/}
                                <input className="text-center" type="" name={"plans[" + i + "].periodNum"} defaultValue={o['periodNum']}
                                       readOnly/>
                            </td>
                            <td colSpan="2"><input className="text-center" type="" name={"plans[" + i + "].predictPayDate"}
                                                   defaultValue={o['predictPayDate']} readOnly/></td>
                            <td colSpan="2"><input className="text-center" type="" name={"plans[" + i + "].predictPayAmt"}
                                                   defaultValue={o['predictPayAmt']} readOnly/></td>
                        </tr>
                    )
                    }
                    <tr>
                        <td className="text-right weight" rowSpan="3">{i18n.t(600121/*审核*/)}：</td>
                        <td className="weight">{i18n.t(200817/*申请人*/)}：</td>
                        <td><input className="text-center" type="" name="container" defaultValue={getOneData['container']} readOnly/></td>
                        <td className="weight">{i18n.t(600122/*部门经理*/)}：</td>
                        <td className="no-drop">
                            <input className="text-center" type="" name="payLeader" defaultValue={getOneData['payLeader']} readOnly/>
                        </td>
                    </tr>
                    <tr>
                        <td className="weight">{i18n.t(400011/*销售员*/)}：</td>
                        <td className="no-drop">
                            <input className="text-center" type="text" name="saleName" defaultValue={getOneData['saleName']} readOnly/>
                        </td>
                        <td className="weight">{i18n.t(600221/*销售经理*/)}：</td>
                        <td className="no-drop">
                            <input className="text-center" type="text" name="saleLeader" defaultValue={getOneData['saleLeader']} readOnly/>
                        </td>
                    </tr>
                    <tr>
                        <td className="weight">销售主管：</td>
                        <td className="no-drop">
                            <input className="text-center" type="text" name="saleManager" defaultValue={getOneData['saleManager']} readOnly/>
                        </td>
                        <td className="weight">&nbsp;</td>
                        <td className="no-drop">
                            {/*<input className="text-center" type="text" name="saleLeader" defaultValue={getOneData['saleLeader']} readOnly/>*/}
                        </td>
                    </tr>                    
                    </tbody>
                </table>
            </div>
        );
    }
}

// 循环 按钮组
class PageBtnList extends Component {

    handleClick = (i)=>{
        let {active, getOneData} = this.props;
        this.props.handleList({
            active: active,
            data: getOneData[i]
        });
    }

    render() {
        let {getOneData} = this.props;
        let btn = getOneData.map((o,i)=><span key={i} onClick={this.handleClick.bind(this,i)}><span className="label label-info pointer">No.{i+1}</span>&nbsp;</span>);

        return (
            <div>
                {btn}
            </div>
        );
    }
}

// 费用报销单
class ExpensAccountDIV extends Component {
    render() {
        let {getOneData} = this.props;

        return (
            <div className="print-template">
                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock'] || 0}/>
                <input type="hidden" name="payCc" defaultValue={getOneData['payCc']}/>

                {/*<!-- 隐藏域 over -->*/}
                <table cellSpacing="0">
                    <tbody>
                    <tr>
                        <td colSpan="5">
                            <h1 className="weight" style={{display: "block", padding: "6px 0px", fontSize: "16px"}}>{i18n.t(200075/*费用*/)+i18n.t(600079/*报销单*/)}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style={{width: "160px"}} className="weight">{i18n.t(100448/*报销*/)+i18n.t(200756/*日期*/)}：</td>
                        <td><input type="" name="chargeDate" defaultValue={getOneData['chargeDate']} /></td>
                        <td colSpan="3"></td>
                    </tr>
                    <tr>
                        <td>{i18n.t(400008/*销售单号*/)}</td>
                        <td>{i18n.t(500121/*费用名称*/)}</td>
                        <td>{i18n.t(200246/*金额*/)}</td>
                        <td colSpan="2">{i18n.t(100336/*备注*/)}</td>
                    </tr>
                    {getOneData['mtls'].map((o, i) =>
                        <tr key={i}>
                            <td>
                                {/*<!-- 隐藏域 begin -->*/}
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                <input data-index={i} type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                {/*<!-- 隐藏域 over -->*/}
                                <input className="text-center" type="" name={"mtls[" + i + "].saleOrderNo"} defaultValue={o['saleOrderNo']}/>
                            </td>
                            <td ><input className="text-center" type="" name={"mtls[" + i + "].costlvtrLcName"} defaultValue={o['costlvtrLcName']} /></td>
                            <td ><input className="text-center" type="" name={"mtls[" + i + "].actCost"} defaultValue={o['actCost']} /></td>
                            <td colSpan="2"><input className="text-center" type="" name={"mtls[" + i + "].remark"} defaultValue={o['remark']} /></td>
                        </tr>
                    )}
                    <tr>
                        <td></td>
                        <td></td>
                        <td colSpan="3" className="weight"><span style={{position:'relative',top:'2px'}}>合计：</span><input style={{width:'88%'}} type="" name="capitalAmt" defaultValue={getOneData['capitalAmt']} /></td>
                    </tr>
                    <tr>
                        <td className="text-right weight" rowSpan="3">{i18n.t(600121/*审核*/)}：</td>
                        <td className="weight">{i18n.t(200402/*报销人*/)}：</td>
                        <td><input className="text-center" type="" name="payStaff" defaultValue={getOneData['payStaff']} /></td>
                        <td className="weight">{i18n.t(600162/*经办*/)}：</td>
                        <td className="no-drop"><input type="" name="" readOnly/></td>
                    </tr>
                    <tr>
                        <td className="weight">&nbsp;</td>
                        <td className="no-drop"></td>
                        <td className="weight">{'审批人'}：</td>
                        <td><input className="text-center" type="" name="approver" defaultValue={getOneData['approver']} /></td>
                    </tr>
                    </tbody>
                </table>

            </div>
        );
    }
}

// 订单信息确认表-物流
class OrderMessageLDIV extends Component {
    render() {
        let {getOneData} = this.props;
        return (
            <div className="print-template">
                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock']}/>
                {/*<!-- 隐藏域 over -->*/}

                <h2 className="text-center">{i18n.t(700031/*订单信息确认表-物流订单*/)}
                    <span className="label label-success">
                        { getOneData['back'] ? '已退回'
                            : (getOneData['id'] ? i18n.t(700059/*已保存*/):i18n.t(700061/*未保存*/))
                        }    
                    </span>
                    {i18n.t(201358/*产品购销合同*/)}</h2>
                <br/><br/>
                <table cellSpacing="0">
                    <tbody>
                        <tr>
                            <td>{i18n.t(700032/*订单业务员*/)}</td>
                            <td colSpan="9"><input name="saleStaffLcName" defaultValue={getOneData['saleStaffLcName'] || ''}/></td>
                        </tr>
                        <tr>
                            <td>{i18n.t(100229/*邮箱*/)}</td>
                            <td colSpan="4" style={{textAlign:'left'}}><input name="email" defaultValue={getOneData['email'] || ''}/></td>
                            <td>{i18n.t(700033/*电话分机号*/)}</td>
                            <td colSpan="4" style={{textAlign:'left'}}><input name="tel_number" defaultValue={getOneData['tel_number'] || ''}/></td>
                        </tr>                        
                    </tbody>
                </table>   
                <br/>          
                <table cellSpacing="0">
                    <tbody>
                    <tr>
                        <td>{i18n.t(201105/*订单号*/)}</td>
                        <td colSpan="9"><input name="saleNo" defaultValue={getOneData['saleNo'] || ''}/></td>
                    </tr>
                    <tr>
                        <td colSpan="10">
                            <textarea placeholder={i18n.t(700060/*如果此订单为FOB货，请在此填写指定货代信息*/)} style={{height: "90px"}} name="lsbePort" defaultValue={getOneData['lsbePort'] || ''}></textarea>
                        </td>
                    </tr>                    
                    <tr>
                        <td rowSpan="6"><span>{i18n.t(201315/*发货人*/)}</span><br/><span>(Shipper)</span></td>
                        <td colSpan="9" className="text">
                            <span>{i18n.t(100528/*公司名称*/)+":"} </span>
                            <input name="sendCompany" defaultValue={getOneData['sendCompany'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>{i18n.t(700064/*(EXPORTER COMPANY NAME)*/)}</span>
                        </td>
                    </tr>                    
                    <tr>
                        <td colSpan="9" className="text">
                            <span>{i18n.t(700065/*联系地址*/)}</span>
                            <input name="sendAddress" defaultValue={getOneData['sendAddress'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>{i18n.t(700066/*(ADDRESS)*/)}</span>
                        </td>
                    </tr>                     
                    <tr>
                        <td colSpan="9" className="text">
                            <span>{i18n.t(100245/*联系方式*/)}</span>
                            <input name="sendTelAndFax" defaultValue={getOneData['sendTelAndFax'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>{i18n.t(700067/*(TEL/FAX)*/)}</span>
                        </td>
                    </tr>
                    <tr>
                        <td rowSpan="8"><span>{i18n.t(200344/*收货人*/)}</span><br/><span>(Consignee)</span></td>
                        <td colSpan="9" className="text">
                            <span>{i18n.t(100528/*公司名称*/)+';'}</span>
                            <input name="revBusinessLcName" defaultValue={getOneData['revBusinessLcName'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>{i18n.t(700068/*(IMPORTER)*/)}</span>
                        </td>
                    </tr>                    
                    <tr>
                        <td colSpan="9" className="text">
                            <span>{i18n.t(700065/*联系地址*/)}</span>
                            <input name="recAddress" defaultValue={getOneData['recAddress'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>{i18n.t(700066/*(ADDRESS)*/)}</span>
                        </td>
                    </tr>                     
                    <tr>
                        <td colSpan="9" className="text">
                            <span>{i18n.t(100245/*联系方式*/)+':'}</span>
                            <input name="recTelAndFax" defaultValue={getOneData['recTelAndFax'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>{i18n.t(700067/*(TEL/FAX)*/)}</span>
                        </td>
                    </tr> 
                    <tr>
                        <td colSpan="9" className="text">
                            <span>{i18n.t(200503/*客户税号*/)+':'}</span>
                            <input name="dutyPara" defaultValue={getOneData['dutyPara'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>{i18n.t(700069/*(TFN)*/)}</span>
                        </td>
                    </tr>                                         
                    <tr>
                        <td rowSpan="6"><span>{i18n.t(200346/*通知人*/)}</span><br/><span>{i18n.t(700070/*(NOTIFY PARTY)*/)}</span></td>
                        <td colSpan="9" className="text">
                            <span>{i18n.t(100528/*公司名称*/)+':'}</span>
                            <input name="noticeCompany" defaultValue={getOneData['noticeCompany'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>{i18n.t(700064/*(EXPORTER COMPANY NAME)*/)}</span>
                        </td>
                    </tr>                    
                    <tr>
                        <td colSpan="9" className="text">
                            <span>{i18n.t(700065/*联系地址*/)+':'}</span>
                            <input name="noticeAddress" defaultValue={getOneData['noticeAddress'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>{i18n.t(700066/*(ADDRESS)*/)+':'}</span>
                        </td>
                    </tr>                     
                    <tr>
                        <td colSpan="9" className="text">
                            <span>{i18n.t(100245/*联系方式*/)+':'}</span>
                            <input name="noticeTelAndFax" defaultValue={getOneData['noticeTelAndFax'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>{i18n.t(700067/*(TEL/FAX)*/)}</span>
                        </td>
                    </tr>   
                    <tr>
                        <td>{i18n.t(700034/*出运方式/箱型箱量*/)}</td>
                        <td colSpan="9" style={{textAlign:'left'}}><input name="packTypeName" defaultValue={getOneData['packTypeName'] || ''}/></td>
                    </tr>
                    <tr>
                        <td>{i18n.t(700035/*客户付款方式*/)}</td>
                        <td colSpan="9" style={{textAlign:'left'}}><input name="payTrmTyEnName" defaultValue={getOneData['payTrmTyEnName'] || ''}/></td>
                    </tr>   
                    <tr>
                        <td>{i18n.t(201317/*贸易方式*/)}</td>
                        <td colSpan="9" style={{textAlign:'left'}}><input name="incotmLcName" defaultValue={getOneData['incotmLcName'] || ''}/></td>
                    </tr>
                    <tr>
                        <td>{i18n.t(201322/*英文品名*/)}</td>
                        <td>{i18n.t(201321/*中文品名*/)}</td>
                        <td>{i18n.t(400037/*采购员*/)}</td>
                        <td>HS CODE</td>
                        <td>{i18n.t(201349/*单价*/)}</td>
                        <td>{i18n.t(200315/*件数*/)}</td>
                        <td>{i18n.t(201083/*数量*/)}</td>
                        <td>{i18n.t(400109/*总价*/)}</td>
                        <td>{i18n.t(700028/*打托要求*/)}</td> 
                        <td>{i18n.t(100112/*特殊要求*/)}</td>                                                                       
                    </tr> 
                    {getOneData['mtls'].map((o, i) =>
                        <tr key={i}>
                            <td>
                                {/*<!-- 隐藏域 begin -->*/}
                                <input type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                <input type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                <input type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                {/*<!-- 隐藏域 over -->*/}
                                <input className="text-center" name={"mtls[" + i + "].mtlEnName"} defaultValue={o['mtlEnName'] || ''}/>
                            </td>
                            <td><input className="text-center" name={"mtls[" + i + "].mtlLcName"} defaultValue={o['mtlLcName'] || ''}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].purStaffLcName"} defaultValue={o['purStaffLcName'] || ''}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].hsCode"} defaultValue={o['hsCode'] || ''}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].salTaxPrc"} defaultValue={o['salTaxPrc'] || ''}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].packQty"} defaultValue={o['packQty'] || ''}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].salQty"} defaultValue={o['salQty'] || ''}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].setTaxAgg"} defaultValue={o['setTaxAgg'] || ''}/></td>
                            <td><input className="text-center" name={"mtls[" + i + "].salvr"} defaultValue={o['salvr']=='false' ? i18n.t(100142/*否*/) : o['salvr']}/></td>                        
                            <td><input className="text-center" name={"mtls[" + i + "].specReq"} defaultValue={o['specReq'] || ''}/></td>                         
                        </tr>
                    ) 
                    }   
                    <tr>
                        <td>{i18n.t(700036/*出运港*/)}</td>
                        <td colSpan="4" style={{textAlign:'left'}}><input name="sStatnLcName" defaultValue={getOneData['sStatnLcName'] || ''}/></td>
                        <td>{i18n.t(100298/*目的港*/)}</td>
                        <td colSpan="4" style={{textAlign:'left'}}><input name="eStatnLcName" defaultValue={getOneData['eStatnLcName'] || ''}/></td>
                    </tr>    
                    <tr>
                        <td>{i18n.t(200802/*出运日期*/)}</td>
                        <td colSpan="4" style={{textAlign:'left'}}><input name="ariveDate" defaultValue={getOneData['ariveDate'] || ''}/></td>
                        <td>{i18n.t(100512/*船公司要求*/)}</td>
                        <td colSpan="4" style={{textAlign:'left'}}><input name="shipRequire" defaultValue={getOneData['shipRequire'] || ''}/></td>
                    </tr> 
                    <tr>
                        <td >{i18n.t(200349/*免仓期申请*/)}</td>
                        <td colSpan="9">
                            <textarea placeholder="" style={{height: "90px"}} name="frStorAgeApp" defaultValue={getOneData['frStorAgeApp'] || ''}></textarea>
                        </td>
                    </tr>  
                    <tr>
                        <td >{i18n.t(200363/*仓储装箱要求*/)}</td>
                        <td colSpan="9">
                            <textarea placeholder="" style={{height: "90px"}} name="stPackReq" defaultValue={getOneData['stPackReq'] || ''}></textarea>
                        </td>
                    </tr> 
                    <tr>
                        <td >{i18n.t(200364/*拍照要求*/)}</td>
                        <td colSpan="9">
                            <textarea placeholder="" style={{height: "90px"}} name="photoReq" defaultValue={getOneData['photoReq'] || ''}></textarea>
                        </td>
                    </tr> 
                    <tr>
                        <td>{i18n.t(100105/*唛头*/)}</td>
                        <td colSpan="9" style={{textAlign:'left'}}><input name="marks" defaultValue={getOneData['marks'] || ''}/></td>
                    </tr>
                    <tr>
                        <td>{i18n.t(700037/*其他货运要求*/)}</td>
                        <td colSpan="9" style={{textAlign:'left'}}><input name="otherReq" defaultValue={getOneData['otherReq'] || ''}/></td>
                    </tr>  
                    <tr>
                        <td>{i18n.t(100128/*单据要求*/)}</td>
                        <td colSpan="9"></td>
                    </tr>  
                    <tr>
                        <td colSpan="10">
                            <textarea style={{height: "90px"}} name="reqirs" defaultValue={getOneData['reqirs'] || ''}></textarea>
                        </td>
                    </tr>                                                                                                                                                                                                                                                                                           
                    </tbody>
                </table>
            </div>
        );        
    }
}

// 订单信息确认表-采购
class OrderMessagePDIV extends Component {
    render() {
        let {getOneData} = this.props;
        return (
            <div className="print-template">
                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock']}/>
                <input type="hidden" name="saleNo" defaultValue={getOneData['saleNo']}/>
                {/*<!-- 隐藏域 over -->*/}

                <h2 className="text-center">订单信息确认表-采购订单 <span className="label label-success">{getOneData['id'] ? i18n.t(700059/*已保存*/):i18n.t(700061/*未保存*/)}</span></h2><br/><br/>
                <h3>销售单号：{getOneData['saleNo'] || ''}</h3><br/><br/>
                <h3>{i18n.t(700058/*详细信息*/)}</h3><br/>
                <table cellSpacing="0">
                    <thead>
                        <tr>
                            <th style={{width:'30px'}}></th>
                            <th>{i18n.t(201322/*英文品名*/)}</th>
                            <th>{i18n.t(201321/*中文品名*/)}</th>
                            <th>{i18n.t(700027/*详细规格*/)}</th>
                            <th>{i18n.t(201083/*数量*/)}</th>
                            <th>{i18n.t(200923/*包装要求*/)}</th>
                            <th>{i18n.t(700028/*打托要求*/)}</th>
                            <th>{i18n.t(700029/*销售单价*/)}</th>
                            <th>{i18n.t(700030/*合计金额*/)}</th>                            
                        </tr>
                    </thead>
                    <tbody>
                        {getOneData['mtls'].map((o, i) =>
                            <tr key={i}>
                                <td>
                                    {/*<!-- 隐藏域 begin -->*/}
                                    <input type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                    <input type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                    <input type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                    {/*<!-- 隐藏域 over -->*/}
                                    <input className="text-center" defaultValue={i+1} readOnly/>
                                </td>
                                <td><input className="text-center" name={"mtls[" + i + "].mtlEnName"} defaultValue={o['mtlEnName'] || ''}/></td>
                                <td><input className="text-center" name={"mtls[" + i + "].mtlLcName"} defaultValue={o['mtlLcName'] || ''}/></td>
                                <td><input className="text-center" name={"mtls[" + i + "].basSpeci"} defaultValue={o['basSpeci'] || ''}/></td>
                                <td><input className="text-center" name={"mtls[" + i + "].salQty"} defaultValue={o['salQty'] || ''}/></td>
                                <td><input className="text-center" name={"mtls[" + i + "].packagLcName"} defaultValue={o['packagLcName'] || ''}/></td>
                                <td><input className="text-center" name={"mtls[" + i + "].salvrLcName"} defaultValue={o['salvrLcName'] || ''}/></td>
                                <td><input className="text-center" name={"mtls[" + i + "].salTaxPrc"} defaultValue={o['salTaxPrc'] || ''}/></td>
                                <td><input className="text-center" name={"mtls[" + i + "].setTaxAgg"} defaultValue={o['setTaxAgg'] || ''}/></td>
                            </tr>
                        )
                        }
                    </tbody>
                </table>
                <br/>
                <div className="row">
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">贸易条款:</b>
                        <input type="text" className="col-md-8" name="incotmLcName" defaultValue={getOneData['incotmLcName' || '']}/>
                    </div>
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">客户付款方式:</b>
                        <input type="text" className="col-md-8" name="payTrmLcName" defaultValue={getOneData['payTrmLcName' || '']}/>
                    </div>
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">运输方式:</b>
                        <input type="text" className="col-md-8" name="transLcName" defaultValue={getOneData['transLcName' || '']}/>
                    </div>                                      
                </div>
                <br/>                                                           
                <div className="row">
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">起运港:</b>
                        <input type="text" className="col-md-8" name="sStatnLcName" defaultValue={getOneData['sStatnLcName' || '']}/>
                    </div>
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">目的港:</b>
                        <input type="text" className="col-md-8" name="eStatnLcName" defaultValue={getOneData['eStatnLcName' || '']}/>
                    </div>
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">装箱信息:</b>
                        <input type="text" className="col-md-8" name="packagLcName" defaultValue={getOneData['packagLcName' || '']}/>
                    </div>                                      
                </div> 
                <br/>                                                             
                <div className="row">
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">最晚交货期:</b>
                        <input type="text" className="col-md-8" name="delDate" defaultValue={getOneData['delDate' || '']}/>
                    </div>
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">唛头:</b>
                        <input type="text" className="col-md-8" name="marks" defaultValue={getOneData['marks' || '']}/>
                    </div>                                     
                </div>
                <br/>                                                            
                <div className="row">
                    <div className="col-md-8">
                        <b className="col-md-2 text-right">发货方式:</b>
                        <input type="text" className="col-md-10" name="shipType" defaultValue={getOneData['shipType' || '']}/>
                    </div>                                   
                </div>
                <br/>                                                           
                <div className="row">
                    <div className="col-md-8">
                        <b className="col-md-2 text-right">拍照要求:</b>
                        <textarea  className="col-md-10" name="photoReq" style={{height: "90px"}} defaultValue={getOneData['photoReq'] || ''}></textarea>
                    </div>                                   
                </div>  
                <br/>                                                                                         
                <div className="row">
                    <div className="col-md-8">
                        <b className="col-md-2 text-right">仓储装箱要求:</b>
                        <textarea  className="col-md-10" name="stPackReq" style={{height: "90px"}} defaultValue={getOneData['stPackReq'] || ''}></textarea>
                    </div>                                   
                </div> 
                <br/>                                                           
                <div className="row">
                    <div className="col-md-8">
                        <b className="col-md-2 text-right">备注:</b>
                        <textarea  className="col-md-10" name="note" style={{height: "90px"}} defaultValue={getOneData['note'] || ''}></textarea>
                    </div>                                   
                </div>
                <br/>                                                           
                <div className="row">
                    <div className="col-md-8">
                        <b className="col-md-2 text-right">单据要求:</b>
                        <textarea  className="col-md-10" name="billReqir" style={{height: "90px"}} defaultValue={getOneData['billReqir'] || ''}></textarea>
                    </div>                                   
                </div>
                <br/>                                           
            </div>
        );        
    }
}

// 其它模板
class Other extends Component {

    render() {
        return (
            <div>
                <h2>{i18n.t(600020/*正在建设中...*/)}</h2>
            </div>
        );
    }
}

/********************************  模板 over  ********************************/

/**************************************   页面 输出   ************************************/

export class Print extends Component {

    constructor(props) {
        super(props);

        // init state
        this.state = {
            resetShow: true, // 控制重置 按钮
            active: '',    // 切换 页面
            getOneData: {}, // 单条数据
            buttonList:[], // 按钮组
        };
    }

    componentDidUpdate(){
        this.sumHandle(); // 求和
        this.mulSumHandle(); // 求乘 再求和        
    }

    // 求乘 再求和 
    mulSumHandle = ()=> {
        let dom = this.refs.print;
        let input = Array.from(dom.querySelectorAll('input[data-mul]')); // input
            
        if(!input['length']) return;

        // 求和
        let addFunc = ()=> {
            // export add 
            let inputAdd = Array.from(dom.querySelectorAll('input[data-addR]'));


            if( !inputAdd['length'] ) return;

            let attrArr = [... new Set(inputAdd.map(o=>o.getAttribute('data-addR')))]; // input
            attrArr.map(attr=>{
                let sum = Array.from(dom.querySelectorAll(`input[data-addR=${attr}]`)).map(o=>Number((o.value.match(/[0-9|/.|-]+/g) || [0]).reduce((a,b)=>a+b))).reduce((a,b)=>a+b); 
                let unit = (dom.querySelectorAll(`input[data-addR=${attr}]`)[0].value.match(/[a-zA-Z]+/g) || ['']).reduce((a,b)=>a+b);            

                // export sum
                let obj = dom.querySelectorAll(`input[data-sumR=${attr}]`)[0]; 
                if(obj) obj.value = sum + ' ' + unit;
            });
        }

        // 求乘 按键事件 
        input.map(o => o.onkeyup = (e)=> {
            let attr = e.target.getAttribute('data-mul');            
            let unit = (e.target.value.match(/[a-zA-Z]+/g) || ['']).reduce((a,b)=>a+b);
            let sum = input.map(o => (o.getAttribute('data-mul') == attr) ? Number((o.value.match(/[0-9|/.|-]+/g) || [0]).reduce((a,b)=>a+b)) : 1 ).reduce((a,b)=>a*b);
            
            // export mul
            let obj = dom.querySelectorAll(`input[data-mulSum=sum${attr}]`)[0]; 
            if(obj) obj.value = sum + ' ' + unit;
            
            // 求和 
            addFunc();   
        })        
    }

    // 求和 
    sumHandle = ()=> {
        let dom = this.refs.print;
        let input = Array.from(dom.querySelectorAll('input[data-add]')); // input

        if(!input['length']) return;

        // 按键事件
        input.map(o => o.onkeyup = (e)=> {
            let attr = e.target.getAttribute('data-add');
            let unit = (e.target.value.match(/[a-zA-Z]+/g) || ['']).reduce((a,b)=>a+b);            
            let sum = input.map(o => (o.getAttribute('data-add') == attr) ? Number((o.value.match(/[0-9|/.|-]+/g) || [0]).reduce((a,b)=>a+b)) : 0 ).reduce((a,b)=>a+b);

            // export
            let obj = dom.querySelectorAll(`input[data-sum=${attr}]`)[0]; 
            if(obj) obj.value = sum + ' ' + unit;
        })
    }

    // 列表页面
    handleList = (option = {}) => {


        // 切换到  单页面
        switch (option['active']) {
            // 物流订单
            case 'packingList-list' :
                this.setState({
                    resetShow: false,
                    active: 'packingListMore',
                    getOneData: option['data'],
                });
                break;
            case 'commercialInvoice-list' :
                this.setState({
                    resetShow: false,
                    active: 'commercialInvoiceMore',
                    getOneData: option['data'],
                });
                break;
            case 'declaration-list' :
                this.setState({
                    resetShow: false,
                    active: 'declaration',
                    getOneData: option['data'],
                });
                break;

            // 采购订单
            case 'packingList-list2' :
                this.setState({
                    resetShow: false,
                    active: 'packingList2',
                    getOneData: option['data'],
                });
                break;
            case 'invoice-list' :
                this.setState({
                    resetShow: false,
                    active: 'invoice',
                    getOneData: option['data'],
                });
                break;
            case 'salesContract-list' :
                this.setState({
                    resetShow: false,
                    active: 'salesContract',
                    getOneData: option['data'],
                });
                break;

            // 销售订单
            case 'exportEntrust_list' :
                this.setState({
                    resetShow: false,
                    active: 'exportEntrust',
                    getOneData: option['data'],
                });
                break;
            case 'shippingAdvice_list' :
                this.setState({
                    resetShow: false,
                    active: 'shippingAdvice',
                    getOneData: option['data'],
                });
                break;

            // 其它
            default:
        }
    }

    // 获取 单页面数据
    handleGetOne = (option = {}) => {

        let {buttonList,active,ID,getOneData={}} = option;

        if(buttonList) this.setState({buttonList:buttonList});
        this.setState({resetShow: true});
 
        // 判断 按钮组
        let URL = '';
        let Data = {};

        console.log(active);
        switch (active) {
            // 物流订单
            case 'exportEntrust' :
                URL = '/exportorder/getOne';
                break;
            case 'packingList' :
                // (getOneData['isClearance'] ? ( !getOneData['isClearance'] ? true : false) : false ) ?
                //     URL = '/declarationpacking/getOne'
                //     // URL = '/clearancepacking/getOne'
                //     :
                //     URL = '/clearancepacking/getOne';
                URL = '/clearancepacking/getOne';
                Data = {id: ID || ''};
                break;
            case 'commercialInvoice' :
                // (getOneData['isClearance'] ? ( !getOneData['isClearance'] ? true : false) : false ) ?
                //     URL = '/declarationinvoice/getOne'
                //     // URL = '/clearanceinvoice/getOne'
                //     :
                //     URL = '/clearanceinvoice/getOne';
                URL = '/clearanceinvoice/getOne';
                Data = {id: ID || ''};
                break;
            case 'packingList-list' :
                URL = '/declarationpacking/getList';
                break;
            case 'commercialInvoice-list' :
                URL = '/declarationinvoice/getList';
                break;
            case 'packingListMore' :
                URL = '/declarationpacking/getOne';
                Data = {id: ID || ''};
                break;
            case 'commercialInvoiceMore' :
                URL = '/declarationinvoice/getOne'
                Data = {id: ID || ''};
                break;
            case 'declaration' :
                URL = '/declaration/getOne';
                Data = {id: ID || ''};
                break;
            case 'declaration-list' :
                URL = '/declaration/getList';
                break;
            case 'shippingAdvice' :
                URL = '/shippingadvice/getOne';
                break;
            case 'cargoMessageL' :
                URL = '/purchasemtlinfo/getOne';
                Data = {billId:'',shippId:getOneData['billId'] || getQueryString('id')};
                break;                


            // 采购订单
            case 'packingList-list2' :
                URL = '/purchasepacking/getList';
                break;
            case 'packingList2' :
                URL = '/purchasepacking/getOne';
                Data = {id: ID || ''};
                break;
            case 'invoice-list' :
                URL = '/purchaseinvoice/getList';
                break;
            case 'invoice' :
                URL = '/purchaseinvoice/getOne';
                Data = {id: ID || ''};
                break;
            case 'salesContract-list' :
                URL = '/purchasesales/getList';
                Data = {id: ID || ''};
                break;
            case 'salesContract' :
                URL = '/purchasesales/getOne';
                Data = {id: ID || ''};
                break;
            case 'contract' :
                URL = '/purchasecontract/getOne';
                break;
            case 'cargoMessageP' :
                URL = '/purchasemtlinfo/getOne';
                Data = {billId:'',purId:getOneData['billId'] || getQueryString('id')};
                break;
                
            // 销售订单
            case 'exportEntrust_list' :
                URL = '/exportorder/getList';
                Data = {billId: '',saleNo: getQueryString('saleNo')};
                break;
            case 'shippingAdvice_list' :
                URL = '/shippingadvice/getList';
                Data = {billId: '',saleNo: getQueryString('no')};
                break;
            case 'proformaInvoice' :
                URL = '/proformainvoice/getOne';
                break;
            case 'salesContract2' :
                URL = '/salescontract/getOne';
                break;
            case 'orderMessageL' : // 订单信息确认表-物流
                URL = '/orderaffirmshipping/getOne';
                break;
            case 'orderMessageP' : // 订单信息确认表-采购
                URL = '/orderaffirmpurorder/getOne';
                break;


            // 付款申请 （ 采购 & 物流 ）
            case 'payapplyP' :
                URL = '/payrequisition/getOne';
                break;

            // 报销单
            case 'expenseaccount' :
                URL = '/chargeaccount/getOne';
                break;


            // 其它
            case 'other' :
                URL = '/exportorder/getOne';
                break;
            default:
                return;
        }

        let that = this;
        this.setState({active:''}, function () {
            apiGet(API_FOODING_ERP, URL, Object.assign({billId: getOneData['billId'] || getQueryString('id')}, Data),
                (response) => {
                    that.setState({
                        active: active,
                        getOneData: response['data']
                    });
                }, (errors) => {
                    ServiceTips({text: errors.message, type: 'error'});
                });
        });

    }

    render() {

        let {buttonList,active, getOneData, resetShow} = this.state;
        let {single} = this.props;
        let HTML = '';


        // 判断 是否是 列表
        let ifPageList = active ? active.includes('-list') : true;

        // 判断 页面
        switch (active) {
            // 物流订单
            case 'exportEntrust' :
                HTML = <ExportEntrust getOneData={getOneData}/>;
                break;
            case 'packingList' :
                HTML = <PackingList getOneData={getOneData}/>;
                break;
            case 'commercialInvoice' :
                HTML = <CommercialInvoice getOneData={getOneData}/>;
                break;
            case 'declaration' :
                HTML = <Declaration getOneData={getOneData}/>;
                break;
            case 'packingList-list' :
                HTML = <List getOneData={getOneData} active={active} handleList={this.handleList}/>;
                break;
            case 'commercialInvoice-list' :
                HTML = <List getOneData={getOneData} active={active} handleList={this.handleList}/>;
                break;
            case 'packingListMore' :
                HTML = <PackingList getOneData={getOneData}/>;
                break;
            case 'commercialInvoiceMore' :
                HTML = <CommercialInvoice getOneData={getOneData}/>;
                break;
            case 'declaration-list' :
                HTML = <List getOneData={getOneData} active={active} handleList={this.handleList}/>;
                break;
            case 'shippingAdvice' :
                HTML = <ShippingAdvice getOneData={getOneData}/>;
                break;
            case 'cargoMessageL' :
                HTML = <CargoMessageLDIV getOneData={getOneData}/>;
                break;                


            // 采购订单
            case 'packingList-list2' :
                HTML = <List getOneData={getOneData} active={active} handleList={this.handleList}/>;
                break;
            case 'packingList2' :
                HTML = <PackingList2 getOneData={getOneData}/>;
                break;
            case 'invoice-list' :
                HTML = <List getOneData={getOneData} active={active} handleList={this.handleList}/>;
                break;
            case 'invoice' :
                HTML = <Invoice getOneData={getOneData}/>;
                break;
            case 'salesContract-list' :
                HTML = <List getOneData={getOneData} active={active} handleList={this.handleList}/>;
                break;
            case 'salesContract' :
                HTML = <SalesContract getOneData={getOneData}/>;
                break;
            case 'contract' :
                HTML = <Contract getOneData={getOneData}/>;
                break;
            case 'cargoMessageP' :
                HTML = <CargoMessagePDIV getOneData={getOneData}/>;
                break;

            // 销售订单
            case 'exportEntrust_list' :
                HTML = <PageBtnList active={active} getOneData={getOneData} handleList={this.handleList}/>;
                break;
            case 'shippingAdvice_list' :
                HTML = <PageBtnList active={active} getOneData={getOneData} handleList={this.handleList}/>;
                break;
            case 'proformaInvoice' :
                HTML = <ProformaInvoice getOneData={getOneData}/>;
                break;
            case 'salesContract2' :
                HTML = <SalesContract2 getOneData={getOneData}/>;
                break;
            case 'orderMessageL' : // 订单信息确认表-物流
                HTML = <OrderMessageLDIV active={active} getOneData={getOneData}/>;
                break;
            case 'orderMessageP' : // 订单信息确认表-采购
                HTML = <OrderMessagePDIV active={active} getOneData={getOneData}/>;
                break;


            // 付款申请 （ 采购 & 物流 ）
            case 'payapplyP' :
                HTML = getOneData['status'] == 10 ? <PayapplyP getOneData={getOneData}/> : <p>没有审批不能进行打印！</p>;
                ifPageList = getOneData['status'] != 10 ? true :false; // 影藏按钮
                break;


            // 报销单
            case 'expenseaccount' :
                HTML = <ExpensAccountDIV getOneData={getOneData}/>;;
                break;

            case 'other' :
                HTML = <Other/>;
                break;
            default:
                HTML = <p></p>;
        }


        // 不一样的样式
        switch(active) {
            case 'payapplyP' :
                var classStyle = {
                    height: 160
                }
            break;
            default:
                var classStyle = {
                    height: 226
                }
        }


        return  single ?
            <div className="print-home scroll" style={{background:'#fff',overflowY: 'auto', height: document.body.offsetHeight-90}}>
         
                    <div>
                        <SinglePage />
                    </div>

            </div>
            :
            <div className="print-home scroll" style={{background:'#fff',overflowY: 'auto', height: document.body.offsetHeight - classStyle['height']}}>
                <BtnList handleGetOne={this.handleGetOne} page={this.props.page}/>
                <figure>
                    <div ref="print">
                        <form ref="printForm" action="">
                            {HTML}
                        </form>
                        {!ifPageList ?
                            <BtnSave page={this.props.page} buttonList={buttonList} handleGetOne={this.handleGetOne} getOneData={getOneData} active={active} resetShow={resetShow}/>
                            :
                            ''
                        }
                    </div>
                </figure>
            </div>
        
    }
}

/**************************************   FUnction   ************************************/
