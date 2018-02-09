
import {emitter} from './EventEmitter';
import {getQueryString} from '../services/apiCall'
emitter.on("NavigateTabsItemRemove", (tabs) => {
    DetailCommon.client[getQueryString("id")] =null;
    DetailCommon.product[getQueryString("id")] =null;
    DetailCommon.provider[getQueryString("id")] =null;
    DetailCommon.forwarder[getQueryString("id")] =null;
    DetailCommon.servbe[getQueryString("id")] =null;
    DetailCommon.competitors[getQueryString("id")] =null;
    DetailCommon.platformProduct[getQueryString("id")] =null;
    DetailCommon.clientContact[getQueryString("id")] =null;
    DetailCommon.providerContact[getQueryString("id")] =null;
    DetailCommon.forwarderContact[getQueryString("id")] =null;
    DetailCommon.severcon[getQueryString("id")] =null;
    DetailCommon.enterprisePlatProduct[getQueryString("id")] =null;
    DetailCommon.countryInformation[getQueryString("id")] =null;
    DetailCommon.booking[getQueryString("id")] =null;
    DetailCommon.businessOpportunity[getQueryString("id")] =null;
    DetailCommon.expenseaccount[getQueryString("id")] =null;
    DetailCommon.marke[getQueryString("id")] =null;
    DetailCommon.platCustomer[getQueryString("id")] =null;
    DetailCommon.pruchaseOrder[getQueryString("id")] =null;
    DetailCommon.quotation[getQueryString("id")] =null;
    DetailCommon.receivedInquiry[getQueryString("id")] =null;
    DetailCommon.ReceivedQuot[getQueryString("id")] =null;
    DetailCommon.staff[getQueryString("id")] =null;
    DetailCommon.saleOrder[getQueryString("id")] =null;
});
export default class DetailCommon {
    static  client = {}; //客户详情
    static  product = {};//产品详情
    static  provider = {};//供应商详情
    static  forwarder ={};//货代详情
    static  servbe ={}; //服务机构详情
    static  competitors ={}; //竞争对手详情
    static  platformProduct ={};//平台产品详情
    static  clientContact ={}; //客户联系人
    static  providerContact ={}; //供应商联系人
    static  forwarderContact ={};//货代联系人
    static  severcon ={};//服务机构联系人详情
    static  enterprisePlatProduct ={};//平台产品库详情
    static  countryInformation ={};//国建信息详情
    static  booking ={}; //物流订单
    static  businessOpportunity ={};//商机详情
    static  expenseaccount = {};//报销单详情
    static  marke = {}; //市场活动
    static  platCustomer ={};//平台客户
    static  pruchaseOrder  = {};//采购订单
    static  quotation ={}; //销售报价
    static  receivedInquiry ={};//收到的询盘
    static  ReceivedQuot ={};//收到的报价
    static  staff ={};//职员
    static  saleOrder ={};//销售订单
}