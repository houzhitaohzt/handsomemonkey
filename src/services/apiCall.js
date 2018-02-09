import request,{urlencodeRequest} from '../lib/request';
import WebData from '../common/WebData';
import xt from '../common/xt';
import ServiceTips from '../components/ServiceTips';
import Confirm from '../components/Dialog/Confirm';//删除弹层
import i18n from './../lib/i18n';


// 网站 格式化
function webInit(s=''){
    if (!s) s='';
    return `http://${s.replace(/http:\/\/|https:\/\//g,'')}`;
}

// 页面跳转
function hrefFunc(title,url,e){
    e.stopPropagation();
    e.preventDefault();

    window.navTabs.open(title,url,{},{refresh: true});
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function buildFormData(values){
    let formData=new FormData();
    for(let item in values){
        formData.append(item,values[item]);
    }
    return formData;
}


function buildUrl(url, method){
    // let host = WebData.foodingHostName;
    let uris = WebData.foodingHostURI;
    let rpUi = WebData.foodingHostRpRUI;
    // let protocol = WebData.foodingProtocol;
    //
    if(uris && rpUi)  url = url.replace(uris, rpUi);
    // url = host ? url.replace(WebData.foodingHostName, host) : url;
    // url = url.replace(WebData.foodingProtocol, protocol);
    return url + method;
}



function saveToken (token){
    if(token) WebData.token = token;
}

//排除出现加载动画的URL
const exLoadRegExp = /^.*?\/(getMiniList).*?$/;
function getLoading (url){
    if( exLoadRegExp.test(url)) return;
    return WebData.currentFrame && WebData.currentFrame.getLoading();
}

function resolvePromise(url, promise,resolve,reject, args = {}){
    let {isLoading = true} = args;
    let loading = isLoading? getLoading(url): undefined;
    loading && loading.show();
    promise.then((response, a)=>{
        saveToken(response.headers['x-auth-token']);
        let data =response.body;
        if('status' in data && data.status=='success'){
            // if('data' in data){
            resolve(data);
            // }else{
            // 	reject(data);
            // }
        }else{
            reject(data);
        }
        if(data.status==null){
            resolve(data);
        }
        loading && loading.hide();
    },(error)=>{
        if('message' in error){
            if(error.status == 501){
                WebData.logout();
                // browserHistory.push('/user/login');
                // alert("登录已失效, 请重新登录!");
                location.href = '/user/login';
                // WebData.user = null;
                // reject(error.response.body);
            }else if(error.status == 403){
                reject(error.response.body);
            }else {
                reject(error);
            }
        }else{
            reject(error);
        }
        loading && loading.hide();
    });
    /*
    if(typeof resolve=='function'&& typeof reject=='function'){
        return promise.then(resolve,reject);
    }
    if(typeof resolve=='function'){
        return promise.then(resolve,(error)=>{console.log(error)});
    }

    if(typeof resolve=='undefined'){
        return promise;
    }
    return promise;
    */
}

function parseParam (params){
    let np = {};
    params = params || {};
    for(let [k, v] of Object.entries(params)){
        if(xt.isString(v)){
            v = v.trim();
        } else if(xt.isArray(v)){
            let nv = [];
            v.forEach(da => {
                if(xt.isObject(da)){
                    da = parseParam(da);
                } else if(xt.isString(da)){
                    da = da.trim();
                }
                nv.push(da);
            });
        } else if(xt.isObject(v)){
            v = parseParam(v);
        }
        np[k] = v;
    }
    return np;
}

function getTokenRequest(request){
    let user = getUser() || {};
    request.set('x-auth-token', WebData.token || user.token);
    return request;
}

/**
 * 离线分页查数据
 * @param {Object} offData 离线数据临时存储
 * @param {string} url
 * @param remoteMethod
 * @param params
 * @param resolve
 * @param reject
 * @param args
 * @returns {*}
 */
function apiGetOffline (offData = {}, url, remoteMethod, params, resolve, reject, args){
    let currentPage = params.currentPage || 1;
    let pageSize = parseInt(params.pageSize) || 20;

    if(Object.keys(offData).length){
        let totalRecords = offData.data.data.length;
        offData.data = {
            pageSize,
            currentPage,
            totalPages: Math.ceil(totalRecords / pageSize),
            totalRecords,
            data:offData.data.data
        };
        resolve({
            ...offData,
            data: {
                ...offData.data,
                data: offData.data.data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
            }
        });
    } else {
        apiGet(url, remoteMethod, params, (response) => {
            offData.message = response.message;
            offData.status = response.status;

            let totalRecords = (response.data || []).length;
            offData.data = {
                data:  response.data,
                currentPage: 1,
                totalPages: Math.ceil(totalRecords / pageSize),
                pageSize,
                totalRecords ,
            };
            resolve({
                ...offData,
                data: {
                    ...offData.data,
                    data: (response.data || []).slice((currentPage - 1) * pageSize, currentPage * pageSize)
                }
            });
        }, reject, args);
    }
}

function apiGet(url,remoteMethod,params,resolve,reject, args){
    let address=buildUrl(url,remoteMethod);
    params = parseParam(params);
    let promise = getTokenRequest(request).get(address).query(params).end();
    resolvePromise(address, promise, resolve, reject, args);
}
function apiPost(url,remoteMethod,params,resolve,reject, args){
    let address=buildUrl(url,remoteMethod);
    //params=buildFormData(params);
    params=JSON.stringify(parseParam(params));
    let promise = getTokenRequest(request).post(address).send(params).end();
    resolvePromise(address, promise, resolve, reject, args);
}
function apiForm(url,remoteMethod,params,resolve,reject, args){
    let address=buildUrl(url,remoteMethod);
    //params=buildFormData(params);
    params = parseParam(params);
    let promise = getTokenRequest(urlencodeRequest).post(address).send(params).end();
    resolvePromise(address, promise, resolve, reject, args);
}

function getUser(){
    return WebData.user? WebData.user.data : null;
}
// 按钮权限
function permissionsBtn(ident){
    let user = getUser();
    return user && user['permissions'].indexOf(ident) !== -1;
    //return true;
}
/**
 复制功能 erp
 url copy的路径
 billId copy数据的id
 initFuction 成功后的回调方法
 */
function copy(url,billId,initFuction,params){
    let that = this;
    if(params){
        Confirm("您确定要复制这条数据吗？", {
            done: () => {
                apiGet(module.exports.API_FOODING_ERP,url,params,
                    (response)=>{
                        ServiceTips({text:response.message,type:'success'});
                        initFuction(response.data);
                    },(errors)=>{
                        ServiceTips({text:errors.message,type:'error'});
                    });
            },
            close:() => {
                console.log('no, close')
            }
        });
        return false;
    }
    if(billId){
        Confirm("您确定要复制这条数据吗？", {
            done: () => {
                apiGet(module.exports.API_FOODING_ERP,url,{billId:billId},
                    (response)=>{
                        ServiceTips({text:response.message,type:'success'});
                        initFuction(response.data);
                    },(errors)=>{
                        ServiceTips({text:errors.message,type:'error'});
                    });
            },
            close:() => {
                console.log('no, close')
            }
        });

    }else {
        ServiceTips({text:"请选择一条数据进行操作",type:'error'});
    }
}
/**
 根据源单编号查询路由
 默认保留俩位
 3位1000
 4位10000以此类推
 */
function toDecimal(x, rank = 2) {
    // var f = parseFloat(x);
    // if (isNaN(f)) {
    //     return x;
    // }
    // f = Math.floor(x*100)/100;
    // return f;
    //return xt.signFigures(x, 2);

    var f = parseFloat(x), number;
    if (isNaN(f)) {
        return x
    }
    if (x.toString().indexOf('.') === -1) return x;
    let s = x.toString().split('.');
    number = s[0] + "." + (s[1].length < rank ? s[1] : s[1].substr(0, rank));
    return parseFloat(number);
}

function sourceRouter(sourceType,params){
    if(sourceType == 500){
        return {url:'/charge/detail',name:'费用单详情'};
    }else if(sourceType == 338){
        return {url:'/pruchaseorder/detail',name:'采购订单详情'}
    }else if(sourceType == 449){
        return {url:'/expenseaccount/detail',name:'报销单详情'};
    }
}

/***
 * 金额数字保留几位小数根据系统可以自定义设置
 * @type {{language, API_HOST, API_PROTOCOL, API_FOODING_ES, API_FOODING_DS, API_FOODING_ERP, API_FOODING_OA, API_FOODING_MESSAGE, API_FOODING_WORK, API_FOODING_MAIL_SERVER: fremote, API_FOODING_MAIL, permissionsBtn: permissionsBtn, hrefFunc: hrefFunc, pageSize: number, getUser: getUser, apiForm: apiForm, apiPost: apiPost, apiGet: apiGet, getTokenRequest: getTokenRequest, sizeList: [number,number,number], getQueryString: getQueryString, buildFormData: buildFormData, sourceRouter: sourceRouter, copy: copy, buildUrl: buildUrl, commonAjax: {sex: {obj: string}, marriage: {obj: string}, jobState: {obj: string}, client: {obj: string}, supplier: {obj: string}, manageGroup: {obj: string}, bloc: {obj: string}, enterprise: {obj: string}, country: {obj: string}, currency: {obj: string}, certificate: {obj: string}, costName: {obj: string}, freightCompany: {obj: string}, exhibitionSponsor: {obj: string, queryParams: [null]}, transportationCompany: {obj: string, queryParams: [null]}, insuranceAgainst: {obj: string, queryParams: [null]}, corporationCompany: {obj: string, queryParams: [null]}, corporationType: {obj: string}, riskType: {obj: string}, portType: {obj: string}, takeMode: {obj: string}, warehouse: {obj: string}, reservoir: {obj: string}, waterLevel: {obj: string}, product: {obj: string}, brand: {obj: string}, supplierSource: {obj: string}, materialStatus: {obj: string}, adjustType: {obj: string}, activityType: {obj: string}, payList: {obj: string}, creditType: {obj: string}}}}
 */
module.exports = {
    get language (){
        if(i18n.getLang() === 'en'){
            return 'EnName';
        }else{
            return 'LcName';
        }
    },
    get API_FOODING_ES (){
        return WebData.foodingProtocol + WebData.foodingProxyName + '/fooding-es' || '';
    },
    get API_FOODING_DS (){
        return WebData.foodingProtocol + WebData.foodingProxyName + "/fooding-ds" || '';
    },
    get API_FOODING_ERP (){
        return WebData.foodingProtocol + WebData.foodingProxyName + "/fooding-erp"|| '';
    },
    get API_FOODING_OA (){
        return WebData.foodingProtocol + WebData.foodingProxyName + "/fooding_oa"|| '';
    },
    get API_NOOHLE_OA (){
        return WebData.foodingProtocol + WebData.foodingProxyName + "/noohle-fastdfs"|| '';
    },
    get API_FOODING_MESSAGE (){
        return WebData.foodingProtocol + WebData.foodingProxyName + "/noohle-message"|| '';
    },
    get API_FOODING_WORK (){
        return WebData.foodingProtocol + WebData.foodingProxyName + "/fooding-workflow"|| '';
    },
    get API_FOODING_MAIL_SERVER (){
        return WebData.foodingProtocol + WebData.foodingProxyName + "/noohle-mail-server"|| ''; //fremote
    },
    get API_FOODING_MassMailServer (){
        return WebData.foodingProtocol + WebData.foodingProxyName + "/noohle-massmail-server"|| ''; //fremote
    },
    get API_FOODING_MAIL (){
        return WebData.foodingProtocol + WebData.foodingProxyName + "/noohle-mail"|| '';
    },
    get API_FOODING_TPM (){
        return WebData.foodingProtocol + WebData.foodingProxyName + "/noohle-tpm"|| '';
    },
    get API_FOODING_HR (){
        return WebData.foodingProtocol + WebData.foodingProxyName + "/noohle-hrm"|| '';
    },
    get API_NOOHLE_PTPM (){
        return WebData.foodingProtocol + WebData.foodingProxyName + "/noohle-ptpm" || "";
    },
    permissionsBtn: permissionsBtn,
    hrefFunc: hrefFunc,
    pageSize: 20,
    getUser: getUser,
    apiForm: apiForm,
    apiPost: apiPost,
    apiGet: apiGet,
    apiGetOffline: apiGetOffline,
    getTokenRequest: getTokenRequest,
    sizeList: [20,50,100],
    getQueryString: getQueryString,
    buildFormData: buildFormData,
    sourceRouter: sourceRouter,
    copy: copy,
    buildUrl: buildUrl,
    toDecimal:toDecimal,
    webInit: webInit,
    commonAjax: {

        sex: {"obj":"com.fooding.fc.enumeration.Sex"}, // 性别
        marriage: {"obj":"com.fooding.fc.enumeration.MaryType"}, // 婚姻
        jobState: {"obj":"com.fooding.fc.enumeration.WorkingState"}, // 在职状态
        client: {"obj":"com.fooding.fc.ds.entity.Customer"}, // 客户
        supplier: {"obj":"com.fooding.fc.ds.entity.Vendor"}, // 供应商

        manageGroup: {"obj":"com.fooding.fc.ds.entity.Vendor"}, // 管理组
        bloc: {"obj":"com.fooding.fc.ds.entity.Vendor"}, // 集团
        enterprise: {"obj":"com.fooding.fc.ds.entity.Vendor"}, // 企业

        country: {"obj":"com.fooding.fc.ds.entity.Country"}, // 国家
        currency: {"obj":"com.fooding.fc.ds.entity.Curren"}, // 币种
        certificate: {"obj":"com.fooding.fc.ds.entity.Certfct"}, // 证书名称
        costName: {"obj":"com.fooding.fc.ds.entity.Costlvtr"}, // 费用名称


        freightCompany: {"obj":"com.fooding.fc.ds.entity.AgnShipBe"}, // 货代公司

        exhibitionSponsor: {"obj":"com.fooding.fc.ds.entity.ServBe", // 主办单位
            "queryParams":
                [{
                    "attr":"beDataMulDivIds",
                    "expression":"oin",
                    "value":80
                }]
        },
        transportationCompany: {
            "obj":"com.fooding.fc.ds.entity.Carrier",
            "prettyMark":true
        },
        insuranceAgainst: {"obj":"com.fooding.fc.ds.entity.ServBe", // 保险公司
            "queryParams":
                [{
                    "attr":"beDataMulDivIds",
                    "expression":"oin",
                    "value":50
                }]
        },
        corporationCompany: {"obj":"com.fooding.fc.ds.entity.ServBe", // 信保公司
            "queryParams":
                [{
                    "attr":"beDataMulDivIds",
                    "expression":"oin",
                    "value":60
                }]
        },
        corporationType: {"obj":"com.fooding.fc.enumeration.CorpType"}, // 信保分类
        riskType: {"obj":"com.fooding.fc.enumeration.RiskType"}, // 风险分类
        portType: {"obj":"com.fooding.fc.enumeration.TransportType"}, // 港口类型
        takeMode: {"obj":"com.fooding.fc.ds.entity.PayTrmType"}, // 收汇方式

        warehouse: {"obj":"com.fooding.fc.ds.entity.StorLocatn"}, // 仓库
        reservoir: {"obj":"com.fooding.fc.ds.entity.StorArea"}, // 库区
        waterLevel: {"obj":"com.fooding.fc.ds.entity.SlBin"}, // 储位
        product: {"obj":"com.fooding.fc.ds.entity.Material"}, // 产品
        brand: {"obj":"com.fooding.fc.ds.entity.Brand"}, // 品牌
        supplierSource: {"obj":"com.fooding.fc.ds.entity.Vendor"}, // 原供应商
        materialStatus: {"obj":"com.fooding.fc.ds.entity.MaterialStatus"}, // 物料状态|产品状态

        adjustType: {"obj":"com.fooding.fc.enumeration.AdjustType"}, // 调整类型

        activityType: {"obj":"com.fooding.fc.enumeration.ActivityType"}, // 活动类型
        payList: {"obj":"com.fooding.fc.ds.entity.PayTrm"}, // 支付条款分组
        creditType: {"obj":"com.fooding.fc.enumeration.CorpType"}, // 信保分类
    }
}
