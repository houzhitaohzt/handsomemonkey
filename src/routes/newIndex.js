import React from 'react';
import Home from './Home';
// import Login from './Login';
import NewLogin from "./LoginNew";
import LoginList from "./LoginList";
import LoginDetail from  "./LoginDetail";
import LoginTwoStep from "./LoginTwoStep";
import LoginOneStep from "./LoginOneStep"
import AboutRoute from './About';
import WebData from './../common/WebData';
import CoreLayout from '../layouts/CoreLayout/CoreLayout';
import LoginLayout from '../layouts/LoginLayout/LoginLayout';
import CDetailsLayout from '../layouts/CDetailsLayout/CDetailsLayout';
import ProductLayout from '../layouts/ProductLayout/ProductLayout';
import PlatformProductLayout from '../layouts/PlatformProductLayout/PlatformProductLayout';
import EnterprisePlatProLayout from "../layouts/EnterprisePlatProLayout/EnterprisePlatProLayout";
import PlatProviderLayout from "../layouts/PlatProviderLayout/PlatProviderLayout";
import PlatCustomerLayout from "../layouts/PlatCustomerLayout/PlatCustomerLayout";
import BODetailLayout from '../layouts/BusinessOpportunityDetailLayout/BODetailLayout';
import ProviderLayout from '../layouts/ProviderLayout/ProviderLayout';
import ForwarderLayout from '../layouts/ForwarderLayout/ForwarderLayout';
import ServbeLayout from '../layouts/ServbeLayout/ServbeLayout';
import CCDetailLayout from '../layouts/CCDetailLayout/CCDetailLayout';
import PCDetailLayout from '../layouts/PCDetailLayout/PCDetailLayout';
import FWDetailLayout from '../layouts/FWDetailLayout/FWDetailLayout';
import SVCDetailLayout from '../layouts/SVCDetailLayout/SVCDetailLayout';
import CIDetailLayout from '../layouts/CIDetailLayout/CIDetailLayout';
import SFDetailLayout from '../layouts/SFDetailLayout/SFDetailLayout';
import SystemSetLayout from "../layouts/SystemSetLayout";
import HrsystemsetLayout from "../layouts/HrsystemsetLayout";
import SODetailLayout from "../layouts/SODetailLayout/SODetailLayout";
import PODetailLayout from "../layouts/PODetailLayout/PODetailLayout";
import QUDetailLayout from "../layouts/QUDetailLayout/QUDetailLayout";
import BKDetailLayout from "../layouts/BKDetailLayout/BKDetailLayout";
import SendQuotDetailLayout from "../layouts/SendQuotDetailLayout/SendQuotDetailLayout";
import SendInquiryDetailLayout from "../layouts/SendInquiryLayout/SendInquiryDetailLayout";
import ReceivedQuotDetailLayout from "../layouts/ReceivedQuotDetailLayout/ReceivedQuotDetailLayout";
import ReceivedInquiryDetailLayout from "../layouts/ReceivedInquiryDetailLayout/ReceivedInquiryDetailLayout";
import OOBuyerDetailLayout from "../layouts/OOBuyerLayout/OOBuyerLayout";
import OOSellerDetailLayout from "../layouts/OOSellerLayout/OOSellerLayout";
import CompetitorsLayout from "../layouts/CompetitorsLayout/CompetitorsLayout";
import MarkeLayout from "../layouts/MarkeLayout/MarkeLayout";
import ExpenseaccountLayout from '../layouts/ExpenseaccountLayout/ExpenseaccountLayout';
import OvertimeregisterDetailLayout from "../layouts/OvertimeregisterDetailLayout/OvertimeregisterDetailLayout";
import VacationsingleDetailLayout from "../layouts/VacationsingleDetailLayout/VacationsingleDetailLayout";
import BusinessregistrationDetailLayout from "../layouts/BusinessregistrationDetailLayout/BusinessregistrationDetailLayout";
import Error from './Error';

import MailCenterLayout from "../layouts/MailCenterLayout";
import PaymentApplicationLayout from '../layouts/PaymentApplicationLayout/PaymentApplicationLayout';
import ContractorLayout from '../layouts/ContractorLayout/ContractorLayout';

import FreightCompetitorsLayout from "../layouts/FreightCompetitorsLayout/CompetitorsLayout";
import FreightProviderLayout from '../layouts/FreightProviderLayout/ProviderLayout';
import FreightClientLayout from '../layouts/FreightClientLayout/ClientLayout';

// 税小类
import TaxSimpleRoute from "./TaxSimple";

// 考勤周期
import AttendancePeriodRoute from "./AttendancePeriod";

// 考勤封存
import AttendanceSheetRoute from "./AttendanceSheet/List";

// 机器考勤
import AttendanceRobotRoute from "./AttendanceRobot/List";

// 考勤数据
import AttendanceDataRoute from "./AttendanceData/List";

// 考勤班次
import HrsystemsettingShiftRoute from "./Hrsystemsetting/Shift";

// 销售区域
import MarketRegionRoute from "./MarketRegion";

// 公共客户
import ClientCommonRoute from "./ClientCommon";

// 待报价列表
import ToQuoteRoute from "./ToQuote/List";

// 对象属性
import ObjectAttributeRoute from "./ObjectAttribute/List";
import ObjectAttributeAddRoute from "./ObjectAttribute/AddCharge";
import ObjectAttributeDetailRoute from "./ObjectAttribute/Detail/Content";

// 预采购
import AdvanceProcurementRoute from "./AdvanceProcurement/List";

// 预订舱
import AdvanceBookingRoute from "./AdvanceBooking/List";

// 样品单出库
import SampleStockRoute from "./SampleStock/List";

// 承运人
import ContractorListRoute from "./Contractor/List";
import ContractorDetailRoute from './Contractor/Detail/Content';

// // 货代公司 客户
import FreightClientListRoute from "./FreightClient/List";
import FreightClientDetailRoute from './FreightClient/Detail/Content';

// 货代公司 供应商
import FreightProviderListRoute from "./FreightProvider/List";
import FreightProviderDetailRoute from './FreightProvider/Detail/Content';

// 货代公司 竞争对手
import FreightCompetitorsListRoute from "./FreightCompetitors/List";
import FreightCompetitorsDetailRoute from "./FreightCompetitors/Detail/Content";

// 海关数据
import CustomsListRoute from "./Customs/List";

// 邮件中心
// import MailCenterServer from "./MailCenter/Server";
import MailCenterSend from "./MailCenter/Send";
// 审核信息
import MessageAuditListRoute from "./MessageAudit/List";
import MessageAuditDetailRoute from "./MessageAudit/Detail";
// 注册信息
import MessageRegisterRoute from "./MessageRegister";

import EmailRoute from './Email/Home';
import EmailWriteRoute from './Email/Write';

// new email
// import NewEmailRoute from "./Mail/Home";

// 打印模板 单个页面
import PrintSingleRoute from "./Print/Single";

// 约会
import ConferListRoute from "./Confer/List";
import AddConferRoute from "./Confer/Add";
import DetailConferRoute from "./Confer/Detail";

import {Route as IFrameRoute} from '../components/IFrame';
// // 商机列表
import BusinessOppertunityRoute from './BusinessOpportunity/List';
// // 商机详情
import BusinessOppertunityDetailRoute from './BusinessOpportunity/Detail/Content';
// 商机编辑
import BusinessOppertunityEditRoute from './BusinessOpportunity/Edit/Content';
// // 商机样品
import BusinessOppertunityDetailSampleRoute from './BusinessOpportunity/Sample';
// // 商机报价
import BusinessOppertunityDetailPriceRoute from './BusinessOpportunity/Price';
// // 商机销售订单
import BusinessOppertunityDetailSalesOrderRoute from './BusinessOpportunity/SalesOrder';
// // 商机附件
import BusinessOppertunityDetailAttachmentRoute from './BusinessOpportunity/Attachment';
// // 商机注释
import BusinessOppertunityDetailAnnotationRoute from './BusinessOpportunity/Annotation';
// // 商机约会
import BusinessOppertunityDetailDateRoute from './BusinessOpportunity/Date';
// // 商机联络
import BusinessOppertunityDetailConnectRoute from './BusinessOpportunity/Connect';
import BusinessOppertunityEmailRoute from './BusinessOpportunity/Email';
// //客户列表
import ClientListRoute from "./Client/List";
// // //客户详情
import CDetailsRoute from './Client/Detail/Content';
import Organizational from  "./Client/Organizational";
// 公共市场活动响应
import ActivityDetailRoute from "./Activity/Detail";
import ActivityAddEdit from "./Activity/AddEdit";

//客户来源
import ClientsrcRoute from "./Clientsrc";
//客户等级
import ClientlevelRoute from "./Clientlevel";
//客户类型
import ClienttypeRoute from "./Clienttype";
//供应商来源
import ProvidersrcRoute from "./Providersrc";
//供应商等级
import ProviderlevelRoute from "./Providerlevel";
//供应商类型
import ProvidertypeRoute from "./Providertype";
//热销产品
import HotsaleProductRoute from "./HotsaleProduct/List";
//热销分类
import HotsaleProCategoriesRoute from "./HotsaleProCategories/List";
//产品
import ProductListRoute from "./Product/List";
import ProductDetailRoute from './Product/Detail/Content';
import TraderulesRoute from './Product/Traderules/List';
import TraderulesDetailRoute from './Product/Traderules/Detail';
//箱型
import SolidifyRoute from "./Solidify";
//平台产品
import PlatformProductListRoute from "./PlatFormProduct/List";
import PlatformProductDetailRoute from './PlatFormProduct/Detail/Content';
import PlatformAddProductRoute from "./PlatFormProduct/AddProduct";
import PlatformTraderulesDetailRoute from './PlatFormProduct/Traderules/Detail';

//产品新增
import AddProductRoute from "./Product/AddProduct";
//供应商
import ProviderListRoute from "./Provider/List";
import ProviderDetailRoute from './Provider/Detail/Content';
import ProductsdetailRoute from './Provider/Product/Detail';

//服务机构
import servBeListRoute from "./servBe/List";
import servBeDetailRoute from './servBe/Detail/Content';
//货代
import ForwarderListRoute from "./Forwarder/List";
import ForwarderDetailRoute from './Forwarder/Detail/Content';
//客户联系人
import ClientContactRoute from "./ClientContact/List";
import ClientContactDetailRoute from "./ClientContact/Detail/Content";
//供应商联系人
import ProviderContactListRoute from "./ProviderContact/List";
import ProviderContactDetailRoute from "./ProviderContact/Detail/Content";
//货代联系人
import ForwarderContactListRoute from "./ForwarderContact/List";
import ForwarderContactDetailRoute from "./ForwarderContact/Detail/Content";
//服务机构联系人
import ServConListRoute from "./ServCon/List";
import ServConDetailRoute from "./ServCon/Detail/Content";
//国家信息
import CountryInformationListRoute from "./CountryInformation/List";
import CountryInformationDetailRoute from "./CountryInformation/Detail/Content";
//职员
import StafferListRoute from "./Staffer/List";
import StafferDetailRoute from "./Staffer/Detail/Content";
//系统设置
import SystemSettingOrganization from "./SystemSetting/Organization";
import SystemSettingAuthority from "./SystemSetting/Authority";
import SystemSettingUserSec from "./SystemSetting/user_sec";
import SystemSettingUser from "./SystemSetting/User";
import SystemSettingMailserver from "./SystemSetting/Mailserver";
import SystemSettingMailbox from "./SystemSetting/MailBox";
import SystemNumberRule from './SystemSetting/NumberRule';
import SystemPriceParameters from "./SystemSetting/PriceParameters";
import SystemSettingAppAuthority from "./SystemSetting/AppAuthority";

//产品测试
import ProductTestRoute from "./ProductTest";
//监装费用
import SploadcostRoute from "./Sploadcost";
//拼箱预估港杂
import FardgoodsRoute from "./Fardgoods";
//拼货预估港杂
import LtclRoute from "./Ltcl";
//整箱预估港杂
import FclRoute from "./Fcl";
//企业托盘费用
import CostTrayRoute from "./CostTray";
//平台托盘费用
import PCostTrayRoute from "./PCostTray";
//货代托盘费用
import HCostTrayRoute from "./HCostTray";

import CorporationApplyLayout from  '../layouts/CorporationApplyLayout/CorporationApplyLayout';
//信保费率
import CreditinsurrateRoute from "./Creditinsurrate";
//运输保险
import TransinsuranceRoute from "./Transinsurance";
//证书费
import CertCostRoute from "./CertCost";
//证书费
import DiplomafeeRoute from "./Diplomafee";
//运价维护
//海运运价
import SeaPriceRoute from "./SeaPrice";
//空运运价
import AirPriceRoute from "./AirPrice";
//铁路运价
import TrainPriceRoute from "./TrainPrice";
//汽运运价
import TruckPriceRoute from "./TruckPrice";
//平台运价
//海运运价
import pSeaPriceRoute from "./PSeaPrice";
//空运运价
import pAirPriceRoute from "./PAirPrice";
//铁路运价
import pTrainPriceRoute from "./PTrainPrice";
//汽运运价
import pTruckPriceRoute from "./PTruckPrice";
//货代报价
//海运运价
import hSeaPriceRoute from "./HSeaPrice";
//空运运价
import hAirPriceRoute from "./HAirPrice";
//铁路运价
import hTrainPriceRoute from "./HTrainPrice";
//汽运运价
import hTruckPriceRoute from "./HTruckPrice";
//菜单设置
import MenuSettingRoute from "./MenuSetting";
//App菜单设置
import AppMenuRouter from "./AppMenu";
//销售订单
import SalesOrderListRoute from "./SalesOrder/List";
import AddSalesOrderRoute from "./SalesOrder/AddSalesOrder";
import SalesOrderDetailRoute from "./SalesOrder/Detail/Content";
//销售报价单
import QuotationListRoute from "./Quotation/List";
import AddQuotationRoute from "./Quotation/AddQuotation";
import QuotationDetailRoute from "./Quotation/Detail/Content";
//销售样品单
import SamPorderListRoute from "./SamPorder/List";
import AddSamPorderRoute from "./SamPorder/AddSamPorder";
import SamPorderDetailRoute from "./SamPorder/Detail/Content";
//找回密码
import RetrievePasswordRoute from "./RetrievePassword";
//用户注册
import RegisterRoute from "./Register";
//采购订单
import PruchaseOrderListRoute from "./PruchaseOrder/List";
import PruchaseOrderDetailRoute from "./PruchaseOrder/Detail/Content";
import AddPruchaseOrderRoute from "./PruchaseOrder/AddPruchaseOrder";
import PruchaseOrderAdjustRoute from "./PruchaseOrder/PruchaseOrderAdjust/Edit";
import PruchaseOrderAdjustDetailRoute from "./PruchaseOrder/PruchaseOrderAdjust/Detail";
//单位换算
import UomcovsRoute from "./Uomcovs";
//到港收货
import GoodsToPortRoute from "./GoodsToPort";
//推广报价
import PromotionPriceRoute from "./PromotionPrice";
//推广报价记录
import PromotequotationRoute from "./Promotequotation";
//限制推广名单
import LimitpromotionRoute from "./Limitpromotion";
//发出的报价
import SendQuotationRoute from "./SendQuotation/SendQuotation";
import SendQuotationDetailRoute from "./SendQuotation/SendQuotationDetail/Content";
import FeedbackInformationRoute from "./SendQuotation/FeedbackInformation";
import SendQuotationEditRoute from "./SendQuotation/SendQuotationEdit";
//费用单
import ChargeListRoute from "./Charge/List";
import AddChargeRoute from "./Charge/AddCharge";
import ChargeDetailRoute from "./Charge/Detail/Content";
//货代费用归集
import HchargecollectListRoute from "./Hchargecollect/List";
import AddHchargecollectRoute from "./Hchargecollect/AddCharge";
import HchargecollectDetailRoute from "./Hchargecollect/Detail/Content";
//费用归集
import chargecollectListRoute from "./Chargecollect/List";
import chargecollectDetailRoute from "./Chargecollect/Detail/Content";
//报销单
import ExpenseAccountListRoute from "./ExpenseAccount/List";
import AddExpenseAccountRoute from "./ExpenseAccount/AddExpenseAccount";
import ExpenseAccountDetailRoute from "./ExpenseAccount/Detail/Content";
import ExpenseAccountPrintRoute from "./ExpenseAccount/Print";

//库存调整单
import stockAdjustListRoute from "./stockAdjust/List";
import stockAdjustDetailRoute from "./stockAdjust/Detail/Content";
//出库通知单
import StockOutListRoute from "./StockOut/List";
import AddStockOutRoute from "./StockOut/AddStockOut";
import StockOutDetailRoute from "./StockOut/Detail/Content";
//入库通知单
import StockInListRoute from "./StockIn/List";
import AddStockInRoute from "./StockIn/AddStockIn";
import StockInDetailRoute from "./StockIn/Detail/Content";
//盘点单
import CheckListRoute from "./Check/List";
import AddCheckRoute from "./Check/AddCheck";
import CheckDetailRoute from "./Check/Detail/Content";
import PanDetailRoute from "./Check/Detail/Pandian";
//订舱单
import BookingListRoute from "./Booking/List";
import BKDetailRoute from './Booking/Detail/Content';

import EditBookingRoute from "./Booking/EditBooking";
//订舱需求
import BookNeedRoute from "./BookNeed";
//交单记录
import LogRoute from "./Log";
//收款单
import GatherListRoute from "./Gather/List";
import GatherDetailRoute from './Gather/Detail/Content';
//付款单
import PayListRoute from "./Pay/List";
import PayDetailRoute from './Pay/Detail/Content';
//收汇记录
import SinkRecordRoute from "./SinkRecord";
//供应商报价
import PurchasequoteListRoute from "./Purchasequote/List";
import AddPurchasequoteRoute from "./Purchasequote/AddPurchasequote";
import PurchasequoteDetailRoute from "./Purchasequote/Detail/Content";
//发出的询盘
import SendInquiryRoute from "./SendInquiry/SendInquiry";
import SendInquiryDetailRoute from "./SendInquiry/SendInquiryDetail/Content";
import SendInquiryEditRoute from "./SendInquiry/SendInquiryEdit";
import SendInquiryReceivedQuot from "./SendInquiry/ReceivedQuot";
//收到的报价
import ReceivedQuotationRoute from "./ReceivedQuotation/ReceivedQuotation";
import ReceivedQuotationDetailRoute from "./ReceivedQuotation/ReceivedQuotationDetail/Content";
import ReceivedQuotationFeedbackInformation from "./ReceivedQuotation/FeedbackInformation";
//收到的询盘
import ReceivedInquiryRoute from "./ReceivedInquiry/ReceivedInquiry";
import ReceivedInquiryDetailRoute from "./ReceivedInquiry/ReceivedInquiryDetail/Content";
import ReceivedInquirySendQuot from "./ReceivedInquiry/SendQuot";
//买家网上订单
import OnlineOrderBuyerRoute from "./OnlineOrderBuyer/OnlineOrderBuyer";
import OnlineOrderBuyerDetailRoute from "./OnlineOrderBuyer/OnlineOrderBuyerDetail/Content";
import OnlineOrderBuyerEditRoute from "./OnlineOrderBuyer/OnlineOrderBuyerEdit";
//卖家网上订单
import OnlineOrderSellerRoute from "./OnlineOrderSeller/OnlineOrderSeller";
import OnlineOrderSellerDetailRoute from "./OnlineOrderSeller/OnlineOrderSellerDetail/Content";
import OnlineOrderSellerEditRoute from "./OnlineOrderSeller/OnlineOrderSellerEdit";
//资金费率
import FundRateListRoute from './FundRate';
//订单信保
import OrderCorporationListRoute from "./OrderCorporation/List";
import OrderCorporationDetailRoute from "./OrderCorporation/Detail";
import OrderCorporationAddRoute from "./OrderCorporation/Add";
//信保限额申请
import CorporationApplyLimitListRoute from "./CorporationApplyLimit/List";
import CorporationApplyLimitDetailRoute from "./CorporationApplyLimit/Detail";
import CorporationApplyLimitAddRoute from "./CorporationApplyLimit/Add";
import CorporationApplyLimitAccessory from  './CorporationApplyLimit/Accessory';
//采购需求
import PruchaseNeedListRoute from "./PruchaseNeed/List";
//包装
import PackagingRoute from "./Packaging";
//仓储事务类型
import StorageTransactTypeRoute from "./StorageTransactType";
//费用名称
import CostNameRoute from "./CostName";
//港口
import PortRoute from "./Port";
//交易条款
import TermsOfTradeRoute from "./TermsOfTrade";
//税小号
import TaxSmallClassRoute from "./TaxSmallClass";
//运输保险
import TransportationInsuranceRoute from "./TransportationInsurance";
//库存价格调整单
import PriceAdjustListRoute from "./PriceAdjust/List";
import PriceAdjustDetailRoute from "./PriceAdjust/Detail/Content";
//竞争对手
import CompetitorsListRoute from "./Competitors/List";
import CompetitorsDetailRoute from "./Competitors/Detail/Content";
import CometitorsFocusProductRoute from "./Competitors/FocusProduct";
import CometitorsAccessoryRoute from "./Competitors/Accessory";
import CometitorsAnnotationRoute from "./Competitors/Annotation";
//任务
import ActiveTaskRoute from "./ActiveTask";
import ActiveTaskTreatRoute from './ActiveTask/components/ActiveTaskTreat';
//证书类型
import CertificateRoute from "./Certificate";
//产品分类
import ProductCategoryRoute from "./ProductCategory";
//库存表
import StockRoute from "./Stock";
//支付条款
import PayTrmListRoute from "./PayTrm/List";
import PayTrmDetailRoute from "./PayTrm/Detail/Content";
import EditPayTrmDetailRoute from "./PayTrm/EditPayTrmDetail";
//货运港杂
import CostTspListRoute from "./CostTsp/List";
//企业货代港杂
import CostAgcListRoute from "./CostAgc/List";
//货代货代港杂
import HCostAgcListRoute from "./HCostAgc/List";
//平台货代港杂
import PCostAgcListRoute from "./PCostAgc/List";
//采购锁库
import PurStockRoute from "./PurStock";
//费用小类
import CostlvtRoute from "./Costlvt";
//航线
import TransroutRoute from "./Transrout";
//托盘
import SalvrtypeRoute from "./Salvrtype";
//外汇汇率
import FrExRatRoute from "./FrExRat";
//固定汇率
import fixrateRoute from "./Fixrate";
//实时汇率
import exrateRoute from "./Exrate";
//成品分类
import FinishedCategoryRoute from "./FinishedCategory";
//省州市
import ProvinceCityRoute from "./ProvinceCity";
//仓库
import WarehouseRoute from "./Warehouse";
//包装
import PackagesRoute from "./Package";
//规格名称
import QaitemRoute from "./Qaitem";
//计量单位、
import UnitofmeaRoute from "./Unitofmea";
//测试项目
import TestItemRoute from "./TestItem";
//测试方法
import TestMethRoute from "./TestMeth";
//生产工艺
import PProcesRoute from "./PProces";
//生产标准
import SProStandRoute from "./SProStand";
//申报要素
import RptMtlRoute from "./RptMtl";
//材质
import TexturRoute from "./Textur";
//产品等级
import DataDivIdRoute from "./DataDivId";
//产品名称
import MtlTypeRoute from "./MtlType";
//危险等级
import DangLvRoute from "./DangLv";
//职称
import TitleRoute from "./Title";
//学历
import EduDegrRoute from "./EduDegr";
//币种
import CurrenRoute from "./Curren";
//税类别
import TaxTypeRoute from "./TaxType";
//付款方式
import PayTrmTypeRoute from "./PayTrmType";
//货架类型
import ShelftypeRoute from "./Shelftype";
//产品状态
import ProductstateRoute from "./Productstate";
//运输要求
import SpecialtypeRoute from "./Specialtype";
//国家语种
import LocaleRoute from "./Locale";
//唛头项目
import ItemRoute from "./Item";
//款项类型
import FundtypeRoute from "./Fundtype";
//品牌
import BrandRoute from "./Brand";
//单证要求
import BillrequRoute from "./Billrequ";
//地区
import BeAreaidRoute from "./BeAreaid";
//合伙功能
import PrtntypeRoute from "./Prtntype";
//托盘型式
import TraytypeRoute from "./Traytype";
//证书类型
import CcardtypeRoute from "./Ccardtype";
//编号对象
import NumberSRoute from "./NumberS";
//平台系统管理
//对象
import PlatformSMObject from './PlatformSystemManager/Object';
//对象属性
import PlatformSMObjectAttr from './PlatformSystemManager/ObjectAttr';
//表单管理
import PlatformSMFormManager from './PlatformSystemManager/FormManager';
//消息
import MessageListRoute from './Message/list';
//客户关注产品详情
import ClientProductDetailRoute from "./Product/ClientProductDetail";
//证书费用
import CertifiFeeRoute from './CertifiFee';
//检测费用
import JianCeRoute from './JianCe';
import FrameLayout from '../layouts/FrameLayout';
//市场活动
import MarkeSealeList from './MarkeSeale/List';
import AddMaketOrderRoute from "./MarkeSeale/AddSalesOrder";
import MaketDetailRoute from "./MarkeSeale/Detail/Content";
import MaketContactRoute from "./MarkeSeale/Contact";
import MaketDateRoute from "./MarkeSeale/Date";
//付款申请
import PaymentApplicationRoute from './PaymentApplication/List';
import paymentApplicationDetail from './PaymentApplication/Detail/Content';
import paymentApplicationPrint from './PaymentApplication/Print';
import AddPaymentApplication from './PaymentApplication/AddPaymentApplication';
//产品价格
import SaleOrderPrice from './SaleOrderPrice/List';
//销售订单调整单
import TiaoZhengRoute from './SalesOrder/TiaoZheng/Edit';
import TiaoZhengDetailRoute from './SalesOrder/TiaoZheng/Detail';
//Ds子表联络
import DsCommonContactAddEditRoute from "./DsCommonContact/AddEdit";
import DsComonContactDetailRoute from "./DsCommonContact/Detail";
//Ds子表约会
import DsCommonDateAddEditRoute from "./DsCommonDate/AddEdit";
import DsCommonDateDetailRoute from "./DsCommonDate/Detail";
//Erp子表联络
import ErpCommonContactAddEditRoute from "./ErpCommonContact/AddEdit";
import ErpCommonContactDateDetailRoute from "./ErpCommonContact/Detail";
//Erp子表约会
//日程
import ScheduleRoute from './Schedule';

import ErpCommonDateAddEditRoute from "./ErpCommonDate/AddEdit";
import ErpCommonDateDetailRoute from "./ErpCommonDate/Detail";
//企业版平台产品
import EnterprisePlatProductEnterRouter from "./EnterprisePlatProduct/Enter";
import EnterprisePlatProductListRouter from "./EnterprisePlatProduct/List";
import EnterprisePlatProductDetailRouter from "./EnterprisePlatProduct/Detail/Content";
import EnterprisePlatProductCustomerRouter from "./EnterprisePlatProduct/Customer";
import EnterprisePlatProductannotationRouter from "./EnterprisePlatProduct/Annotation";
//销售退货列表
import SalelistRoute from './SaleList/List';
import SaleDetailRoute from './SaleList/Detail';
//国内销售订单
import SalesNOrderListRoute from './SalesNOrder/List';
import SalesNOrderDetailRoute from './SalesNOrder/Detail/Content';
import SalesNOrderAddRoute from './SalesNOrder/AddSalesOrder';
//平台供应商
import PlatProviderDetailRouter from "./PlatFormProvider/Detail/Content";
import PlatProviderSignInfoRouter from "./PlatFormProvider/SignInfo";
//平台客户
import PlatCustomerDetailRouter from "./PlatFormCustomer/Detail/Content";
import PlatCustomerSignInfoRouter from "./PlatFormCustomer/SignInfo";
//采购退货
import PurchaseReturnListRouter from "./PruchaseReturn/List";
import PurchaseReturnDetailRouter from "./PruchaseReturn/Detail";
//采购发票
import PruchaseInvoiceListRouter from "./PruchaseInvoice/List";
import PruchaseInvoiceDetailRouter from "./PruchaseInvoice/Detail";
//产品定价
import ProductPriceListRouter from "./ProductPrice/List";
import ProductPriceDetailRouter from "./ProductPrice/Detail/Content";
import ProductPriceAddRouter from "./ProductPrice/AddSalesOrder";
//销售发票
import SaleInvoiceListRouter from "./SaleInvoice/List";
import SaleInvoiceDetailRouter from "./SaleInvoice/Detail";
//职务
import PositnRoute from "./Positn";
//部门
import DepmntRoute from "./Depmnt";
//订单结算
import SalesSettlementListRouter from "./SalesSettlement/List";
//
import  BanliTaskRouter from "./BanliTask";
//写邮件
import WirteRouter from  "./Mail/Write";
import SuccessRouter  from "./Mail/Success";
import FWriteRouter from  "./Mail/FWirte";
// new email
import NewEmailRoute from "./Mail/Home";
import MailDetailRouter from './Mail/Detail';
import SystemMailTemplate from "./SystemSetting/MailTemplate";
import MassWriteRouter from './Mail/MassWrite';
//模板设置
import FormworkSettingRoute from "./FormworkSetting/List"

//报表工具
import ReportTools from './ReportTools';
//打印模板
import ReportTemplate from './ReportTemplate';
//HR
//工作日历
import HrsystemsettingWorkCalender from "./Hrsystemsetting/WorkCalender";
//工作日历编辑
import HrsystemsettingWorkCalenderAddEditRoute from "./Hrsystemsetting/WorkCalenderAddEdit";
//工作日历查看
import HrsystemsettingWorkCalenderViewRoute from "./Hrsystemsetting/WorkCalenderView";
//国家节假日1
import HrsystemsettingNationalHolidaysp from "./NationalHolidays";
//休假项目
import HrsystemsettingVacationProject from "./Hrsystemsetting/VacationProject";
//排班规则
import ArrangeRulesListRoute from "./Hrsystemsetting/ArrangeRules/List";
//年假规则
import HrsystemsettingAnnualleaverules from "./Hrsystemsetting/Annualleaverules";
//调休使用设置
import HrsystemsettingUsetheSetOff from "./Hrsystemsetting/UsetheSetOff";

//加班登记
import OvertimeregisterListRoute from "./Overtimeregister/List";
import AddOvertimeregisterRoute from "./Overtimeregister/AddOvertimeregister";
import OvertimeregisterDetailRoute from "./Overtimeregister/Detail/Content";
//考勤发卡
import AttendanceCardListRoute from "./AttendanceCard/List";
import AddAttendanceCardRoute from "./AttendanceCard/AddAttendanceCard";
//销假单
import PinfakesingleListRoute from "./Pinfakesingle/List";
import AddPinfakesingleRoute from "./Pinfakesingle/AddPinfakesingle";
import PinfakesingleDetailRoute from "./Pinfakesingle/Detail/Content";
//休假登记
import VacationsingleListRoute from "./Vacationsingle/List";
import AddVacationsingleRoute from "./Vacationsingle/AddVacationsingle";
import VacationsingleDetailRoute from "./Vacationsingle/Detail/Content";
//出差单
import BusinessregistrationListRoute from "./Businessregistration/List";
import AddBusinessregistrationRoute from "./Businessregistration/AddBusinessregistration";
import BusinessregistrationDetailRoute from "./Businessregistration/Detail/Content";
//排班设置
import AddShiftsettingsRoute from "./Shiftsettings/Addshiftsettings";
import ShiftsettingsDetailRoute from "./Shiftsettings/Detail/Content";
import ShiftsettingsListRoute from "./Shiftsettings/List";

//我的考勤
import MyAttendanceRoute from "./MyAttendance/List";
//我的考勤列表详情
import MyAttendanceDetailRoute from "./MyAttendance/Detail";
//考勤排班结果查询
import AttendanceResultsQueryRoute from "./AttendanceResultsQuery/";
//申诉管理
import ComplaintManagementRoute from "./ComplaintManagement/";
//汇报类型
import ReportTypeRoute from "./ReportType";

const routes = function (store) {
    return {
        path: '/',
        childRoutes: [
            {
                component: LoginLayout,
                childRoutes: [
                    RetrievePasswordRoute(store),
                    RegisterRoute(store),
                    NewLogin(store),
                    LoginList(store),
                    LoginDetail(store),
                    LoginTwoStep(store),
                    LoginOneStep(store),
                    Organizational(store),
                ]
            },
            {
                component: FrameLayout,
                indexRoute: Home(store),
                onEnter: (nextState, replace)=>{
                    if ( !WebData.user) replace("/user/login");
                },
                childRoutes: [
                    {
                        component: CoreLayout,
                        childRoutes: [
                            TaxSimpleRoute(store),
                            AttendancePeriodRoute(store),
                            ClientCommonRoute(store),
                            MarketRegionRoute(store),
                            AttendanceDataRoute(store),
                            AttendanceRobotRoute(store),
                            AttendanceSheetRoute(store),
                            ToQuoteRoute(store),
                            ObjectAttributeRoute(store),
                            ObjectAttributeAddRoute(store),
                            ObjectAttributeDetailRoute(store),
                            SampleStockRoute(store),
                            AdvanceProcurementRoute(store),
                            AdvanceBookingRoute(store),
                            ContractorListRoute(store),
                            CustomsListRoute(store),
                            FreightClientListRoute(store),
                            FreightProviderListRoute(store),
                            FreightCompetitorsListRoute(store),
                            WirteRouter(store),
                            MessageAuditListRoute(store),
                            MessageAuditDetailRoute(store),
                            MessageRegisterRoute(store),
                            ClientProductDetailRoute(store),
                            AboutRoute(store),
                            ClientListRoute(store),
                            ActivityDetailRoute(store),
                            PanDetailRoute(store),
                            UomcovsRoute(store),
                            BanliTaskRouter(store),
                            // ContactDetailRoute(store),
                            DiplomafeeRoute(store),
                            TraderulesDetailRoute(store),
                            ProductListRoute(store),
                            AddProductRoute(store),
                            PlatformProductListRoute(store),
                            PlatformAddProductRoute(store),
                            ProviderListRoute(store),
                            ForwarderListRoute(store),
                            ProductsdetailRoute(store),
                            PositnRoute(store),
                            PurchasequoteListRoute(store),
                            AddCheckRoute(store),
                            DepmntRoute(store),
                            AddPurchasequoteRoute(store),
                            PurchasequoteDetailRoute(store),
                            ClientContactRoute(store),
                            CountryInformationListRoute(store),
                            ProviderContactListRoute(store),
                            ForwarderContactListRoute(store),
                            StafferListRoute(store),
                            BusinessOppertunityRoute(store),
                            BusinessOppertunityEditRoute(store),
                            ProductTestRoute(store),
                            SploadcostRoute(store),
                            FardgoodsRoute(store),
                            LtclRoute(store),
                            FclRoute(store),
                            SolidifyRoute(store),
                            CostTrayRoute(store),
                            PCostTrayRoute(store),
                            HCostTrayRoute(store),
                            CreditinsurrateRoute(store),
                            TransinsuranceRoute(store),
                            CertCostRoute(store),
                            SeaPriceRoute(store),
                            AirPriceRoute(store),
                            TrainPriceRoute(store),
                            TruckPriceRoute(store),
                            pAirPriceRoute(store),
                            pSeaPriceRoute(store),
                            pTrainPriceRoute(store),
                            pTruckPriceRoute(store),
                            hSeaPriceRoute(store),
                            hAirPriceRoute(store),
                            hTruckPriceRoute(store),
                            hTrainPriceRoute(store),
                            MenuSettingRoute(store),
                            SalesOrderListRoute(store),
                            AddSalesOrderRoute(store),
                            PruchaseOrderListRoute(store),
                            AddPruchaseOrderRoute(store),
                            QuotationListRoute(store),
                            AddQuotationRoute(store),
                            SamPorderListRoute(store),
                            AddSamPorderRoute(store),
                            SamPorderDetailRoute(store),
                            GoodsToPortRoute(store),
                            PromotionPriceRoute(store),
                            PromotequotationRoute(store),
                            LimitpromotionRoute(store),
                            SendQuotationRoute(store),
                            ExpenseAccountListRoute(store),
                            AddExpenseAccountRoute(store),
                            ChargeListRoute(store),
                            AddChargeRoute(store),
                            ChargeDetailRoute(store),
                            HchargecollectListRoute(store),
                            chargecollectListRoute(store),
                            chargecollectDetailRoute(store),
                            AddHchargecollectRoute(store),
                            HchargecollectDetailRoute(store),
                            stockAdjustListRoute(store),
                            stockAdjustDetailRoute(store),
                            StockOutListRoute(store),
                            AddStockOutRoute(store),
                            StockOutDetailRoute(store),
                            StockInListRoute(store),
                            AddStockInRoute(store),
                            StockInDetailRoute(store),
                            CheckListRoute(store),
                            AddCheckRoute(store),
                            CheckDetailRoute(store),
                            BookingListRoute(store),
                            SendQuotationEditRoute(store),
                            EditBookingRoute(store),
                            BookNeedRoute(store),
                            LogRoute(store),
                            GatherListRoute(store),
                            SendInquiryRoute(store),
                            SendInquiryEditRoute(store),
                            ReceivedQuotationRoute(store),
                            ReceivedInquiryRoute(store),
                            OnlineOrderBuyerRoute(store),
                            OnlineOrderBuyerEditRoute(store),
                            OnlineOrderSellerRoute(store),
                            OnlineOrderSellerEditRoute(store),
                            FundRateListRoute(store),
                            OrderCorporationListRoute(store),
                            OrderCorporationDetailRoute(store),
                            OrderCorporationAddRoute(store),
                            CorporationApplyLimitListRoute(store),
                            CorporationApplyLimitAddRoute(store),
                            PruchaseNeedListRoute(store),
                            GatherDetailRoute(store),
                            PayListRoute(store),
                            PayDetailRoute(store),
                            SinkRecordRoute(store),
                            PackagingRoute(store),
                            StorageTransactTypeRoute(store),
                            CostNameRoute(store),
                            PortRoute(store),
                            TermsOfTradeRoute(store),
                            TaxSmallClassRoute(store),
                            TransportationInsuranceRoute(store),
                            SinkRecordRoute(store),
                            PriceAdjustListRoute(store),
                            PriceAdjustDetailRoute(store),
                            CompetitorsListRoute(store),
                            ActiveTaskRoute(store),
                            ActiveTaskTreatRoute(store),
                            CertificateRoute(store),
                            ProductCategoryRoute(store),
                            StockRoute(store),
                            servBeListRoute(store),
                            ServConListRoute(store),
                            PayTrmListRoute(store),
                            PayTrmDetailRoute(store),
                            EditPayTrmDetailRoute(store),
                            CostTspListRoute(store),
                           	CostAgcListRoute(store),
                            HCostAgcListRoute(store),
                            PCostAgcListRoute(store),
                            PurStockRoute(store),
                            CostlvtRoute(store),
                            TransroutRoute(store),
                            SalvrtypeRoute(store),
                            FrExRatRoute(store),
                            fixrateRoute(store),
                            exrateRoute(store),
                            FinishedCategoryRoute(store),
                            ProvinceCityRoute(store),
                            WarehouseRoute(store),
                            ClientsrcRoute(store),
                            ClientlevelRoute(store),
                            ClienttypeRoute(store),
                            ProviderlevelRoute(store),
                            ProvidersrcRoute(store),
                            ProvidertypeRoute(store),
                            PackagesRoute(store),
                            QaitemRoute(store),
                            UnitofmeaRoute(store),
                            TestItemRoute(store),
                            TestMethRoute(store),
                            PProcesRoute(store),
                            SProStandRoute(store),
                            RptMtlRoute(store),
                            TexturRoute(store),
                            DataDivIdRoute(store),
                            MtlTypeRoute(store),
                            DangLvRoute(store),
                            TitleRoute(store),
                            EduDegrRoute(store),
                            CurrenRoute(store),
                            TaxTypeRoute(store),
                            PayTrmTypeRoute(store),
                            ShelftypeRoute(store),
                            ProductstateRoute(store),
                            SpecialtypeRoute(store),
                            LocaleRoute(store),
                            ItemRoute(store),
                            FundtypeRoute(store),
                            BrandRoute(store),
                            BillrequRoute(store),
                            BeAreaidRoute(store),
                            PrtntypeRoute(store),
                            TraytypeRoute(store),
                            CcardtypeRoute(store),
                            NumberSRoute(store),
                            MessageListRoute(store),
                            // MessageWirteRoute(store),
                            // MessageShouRoute(store),
                            // SendRoute(store),
                            // SystemRoute(store),
                            PlatformSMObject(store),
                            PlatformSMObjectAttr(store),
                            PlatformSMFormManager(store),
                            CertifiFeeRoute(store),
                            MarkeSealeList(store),
                            AddMaketOrderRoute(store),
                            JianCeRoute(store),
                            PaymentApplicationRoute(store),
                            AddPaymentApplication(store),
                            ActivityAddEdit(store),
                            SaleOrderPrice(store),
                            TiaoZhengRoute(store),
                            TiaoZhengDetailRoute(store),
                            DsCommonContactAddEditRoute(store),
                            DsComonContactDetailRoute(store),
                            ErpCommonContactAddEditRoute(store),
                            ErpCommonContactDateDetailRoute(store),
                            PruchaseOrderAdjustRoute(store),
                            PruchaseOrderAdjustDetailRoute(store),
                            PlatformTraderulesDetailRoute(store),
                            EmailRoute(store),
                            EmailWriteRoute(store),
                            // NewEmailRoute(store),
                            PrintSingleRoute(store),
                            DsCommonDateAddEditRoute(store),
                            DsCommonDateDetailRoute(store),
                            ErpCommonDateAddEditRoute(store),
                            ErpCommonDateDetailRoute(store),
                            ScheduleRoute(store),
                            EnterprisePlatProductEnterRouter(store),
                            EnterprisePlatProductListRouter(store),
                            IFrameRoute(store),
                            SalelistRoute(store),
                            SaleDetailRoute(store),
                            SalesNOrderListRoute(store),
                            SalesNOrderDetailRoute(store),
                            SalesNOrderAddRoute(store),
                            PurchaseReturnListRouter(store),
                            PurchaseReturnDetailRouter(store),
                            PruchaseInvoiceListRouter(store),
                            PruchaseInvoiceDetailRouter(store),
                            ProductPriceListRouter(store),
                            ProductPriceDetailRouter(store),
                            ProductPriceAddRouter(store),
                            SaleInvoiceListRouter(store),
                            SaleInvoiceDetailRouter(store),
                            SalesSettlementListRouter(store),
                            SuccessRouter(store),
                            MailDetailRouter(store),
                            MassWriteRouter(store),
                            NewEmailRoute(store),
                            HotsaleProductRoute(store),
                            HotsaleProCategoriesRoute(store),
                            FWriteRouter(store),
                            ConferListRoute(store),
                            AddConferRoute(store),
                            DetailConferRoute(store),
                            AppMenuRouter(store),
                            FormworkSettingRoute(store),
                            ReportTools(store),
                            OvertimeregisterListRoute(store),
                            AddOvertimeregisterRoute(store),
                            PinfakesingleListRoute(store),
                            AddPinfakesingleRoute(store),
                            PinfakesingleDetailRoute(store),
                            AttendanceCardListRoute(store),
                            AddAttendanceCardRoute(store),
                            VacationsingleListRoute(store),
                            AddVacationsingleRoute(store),
                            BusinessregistrationListRoute(store),
                            AddBusinessregistrationRoute(store),
                            HrsystemsettingWorkCalenderAddEditRoute(store),
                            HrsystemsettingWorkCalenderViewRoute(store),
                            ShiftsettingsListRoute(store),
                            AddShiftsettingsRoute(store),
                            ShiftsettingsDetailRoute(store),
                            MyAttendanceRoute(store),
                            ReportTypeRoute(store),
                            MyAttendanceDetailRoute(store),
                            AttendanceResultsQueryRoute(store),
                            ComplaintManagementRoute(store),
                            ReportTemplate(store),
                            HrsystemsettingNationalHolidaysp(store),
                        ]
                    },
                    {
                        path: 'corporationapplylimit',
                        component: CorporationApplyLayout,
                        childRoutes: [
                            CorporationApplyLimitAccessory(store),
                            CorporationApplyLimitDetailRoute(store)
                        ]
                    },
                    {
                        path: 'BusinessOpportunity',
                        component: BODetailLayout,
                        childRoutes: [
                            BusinessOppertunityDetailRoute(store),
                        ]
                    },
                    {
                        path: 'client',
                        component: CDetailsLayout,
                        childRoutes: [
                            CDetailsRoute(store)
                        ]
                    },
                    {
                        path: 'freightClient',
                        component: FreightClientLayout,
                        childRoutes: [
                            FreightClientDetailRoute(store),
                        ]
                    },
                    {
                        path: 'paymentApplication',
                        component: PaymentApplicationLayout,
                        childRoutes: [
                            paymentApplicationDetail(store),
                            paymentApplicationPrint(store),
                        ]
                    },
                    {
                        path: 'expenseaccount',
                        component: ExpenseaccountLayout,
                        childRoutes: [
                            ExpenseAccountDetailRoute(store),
                            ExpenseAccountPrintRoute(store),
                        ]
                    },
                    {
                        path: '/platform/customer',
                        component: PlatCustomerLayout,
                        childRoutes: [
                            PlatCustomerDetailRouter(store),
                            PlatCustomerSignInfoRouter(store)
                        ]
                    },
                    {
                        path: 'product',
                        component: ProductLayout,
                        childRoutes: [
                            ProductDetailRoute(store)
                        ]
                    },
                    {
                        path: 'mailCenter',
                        component: MailCenterLayout,
                        childRoutes: [
                            // MailCenterServer(store),
                            MailCenterSend(store),

                        ]
                    },
                    {
                        path: 'platform/product',
                        component: PlatformProductLayout,
                        childRoutes: [
                            PlatformProductDetailRoute(store)
                        ]
                    },
                    {
                        path: 'contractor',
                        component: ContractorLayout,
                        childRoutes: [
                             ContractorDetailRoute(store),
                        ]
                    },
                    {
                        path: 'enterprise/platproduct',
                        component: EnterprisePlatProLayout,
                        childRoutes: [
                            EnterprisePlatProductDetailRouter(store),
                            EnterprisePlatProductCustomerRouter(store),
                            EnterprisePlatProductannotationRouter(store)
                        ]
                    },
                    {
                        path: 'provider',
                        component: ProviderLayout,
                        childRoutes: [
                            ProviderDetailRoute(store)
                        ]
                    },
                    {
                        path: 'freightProvider',
                        component: FreightProviderLayout,
                        childRoutes: [
                            FreightProviderDetailRoute(store)
                        ]
                    },
                    {
                        path: 'platform/provider',
                        component: PlatProviderLayout,
                        childRoutes: [
                            PlatProviderDetailRouter(store),
                            PlatProviderSignInfoRouter(store)
                        ]
                    },
                    {
                        path: 'forwarder',
                        component: ForwarderLayout,
                        childRoutes: [
                            ForwarderDetailRoute(store)
                        ]
                    },
                    {
                        path: 'servbe',
                        component: ServbeLayout,
                        childRoutes: [
                            servBeDetailRoute(store)
                        ]
                    },
                    {
                        path: 'clientcontact',
                        component: CCDetailLayout,
                        childRoutes: [
                            ClientContactDetailRoute(store)
                        ]
                    },
                    {
                        path: 'providercontact',
                        component: PCDetailLayout,
                        childRoutes: [
                            ProviderContactDetailRoute(store)
                        ]
                    },
                    {
                        path: 'forwardercontact',
                        component: FWDetailLayout,
                        childRoutes: [
                            ForwarderContactDetailRoute(store),
                        ]
                    },
                    {
                        path: 'servcon',
                        component: SVCDetailLayout,
                        childRoutes: [
                            ServConDetailRoute(store)
                        ]
                    },
                    {
                        path: 'countryinformation',
                        component: CIDetailLayout,
                        childRoutes: [
                            CountryInformationDetailRoute(store)
                        ]
                    },
                    {
                        path: 'staffer',
                        component: SFDetailLayout,
                        childRoutes: [
                            StafferDetailRoute(store)
                        ]
                    },
                    {
                        path: 'system',
                        component: SystemSetLayout,
                        childRoutes: [
                            SystemSettingOrganization(store),
                            SystemSettingUserSec(store),
                            SystemSettingUser(store),
                            SystemSettingMailserver(store),
                            SystemSettingMailbox(store),
                            SystemSettingAuthority(store),
                            SystemNumberRule(store),
                            SystemPriceParameters(store),
                            SystemMailTemplate(store),
                            SystemSettingAppAuthority(store)
                        ]
                    },
                    {
                        path: 'hrsystem',
                        component: HrsystemsetLayout,
                        childRoutes: [
                            HrsystemsettingWorkCalender(store),
                            HrsystemsettingVacationProject(store),
                            ArrangeRulesListRoute(store),
                            HrsystemsettingUsetheSetOff(store),
                            HrsystemsettingAnnualleaverules(store),
                            HrsystemsettingShiftRoute(store),
                        ]
                    },
                    {
                        path: 'salesorder',
                        component: SODetailLayout,
                        childRoutes: [
                            SalesOrderDetailRoute(store),

                        ]
                    }, {
                        path: 'pruchaseorder',
                        component: PODetailLayout,
                        childRoutes: [
                            PruchaseOrderDetailRoute(store)
                        ]
                    },
                    {
                        path: 'quotation',
                        component: QUDetailLayout,
                        childRoutes: [
                            QuotationDetailRoute(store),
                        ]
                    },
                    {
                        path: 'sendquotation',
                        component: SendQuotDetailLayout,
                        childRoutes: [
                            SendQuotationDetailRoute(store),
                            FeedbackInformationRoute(store)
                        ]
                    },
                    {
                        path: 'sendinquiry',
                        component: SendInquiryDetailLayout,
                        childRoutes: [
                            SendInquiryDetailRoute(store),
                            SendInquiryReceivedQuot(store)
                        ]
                    },
                    {
                        path: 'receivedquotation',
                        component: ReceivedQuotDetailLayout,
                        childRoutes: [
                            ReceivedQuotationDetailRoute(store),
                            ReceivedQuotationFeedbackInformation(store)
                        ]
                    },
                    {
                        path: 'receivedinquiry',
                        component: ReceivedInquiryDetailLayout,
                        childRoutes: [
                            ReceivedInquiryDetailRoute(store),
                            ReceivedInquirySendQuot(store)
                        ]
                    },
                    {
                        path: 'onlineorderbuyer',
                        component: OOBuyerDetailLayout,
                        childRoutes: [
                            OnlineOrderBuyerDetailRoute(store)
                        ]
                    },
                    {
                        path: 'onlineorderseller',
                        component: OOSellerDetailLayout,
                        childRoutes: [
                            OnlineOrderSellerDetailRoute(store)
                        ]
                    },
                    {
                        path: 'booking',
                        component: BKDetailLayout,
                        childRoutes: [
                            BKDetailRoute(store)
                        ]
                    }, {
                        path: 'competitors',
                        component: CompetitorsLayout,
                        childRoutes: [
                            CompetitorsDetailRoute(store),
                            CometitorsFocusProductRoute(store),
                            CometitorsAccessoryRoute(store),
                            CometitorsAnnotationRoute(store)

                        ]
                    },
                    {
                        path: 'freightCompetitors',
                        component: FreightCompetitorsLayout,
                        childRoutes: [
                            FreightCompetitorsDetailRoute(store),
                        ]
                    },
                    {
                        path: 'marke',
                        component: MarkeLayout,
                        childRoutes: [
                            MaketDetailRoute(store),
                            MaketContactRoute(store),
                            MaketDateRoute(store),
                        ]
                    },
                    {
                        path: 'Overtimeregister',
                        component: OvertimeregisterDetailLayout,
                        childRoutes: [
                            OvertimeregisterDetailRoute(store),

                        ]
                    },
                    {
                        path: 'Vacationsingle',
                        component: VacationsingleDetailLayout,
                        childRoutes: [
                            VacationsingleDetailRoute(store),

                        ]
                    },
                    {
                        path: 'Businessregistration',
                        component: BusinessregistrationDetailLayout,
                        childRoutes: [
                            BusinessregistrationDetailRoute(store),

                        ]
                    },
                    Error(store)
                ]
            }
        ]
    };

};

export default routes;
