import {apiGet, apiPost, apiForm} from '../apiCall';
import * as Constant from './constant';

export function getClientPage(params, resolve, reject) {
    apiGet(Constant.API_HOST_ADDRESS, Constant.GET_CLIENTS_PAGE, params, resolve, reject);
}

export function initPage(params, resolve, reject) {
    apiGet(Constant.API_HOST_ADDRESS, Constant.INIT_PAGE, params, resolve, reject);
}

export function addUpdateRecord(params, resolve, reject) {
    apiForm(Constant.API_HOST_ADDRESS, Constant.ADD_UPDATE_RECORD, params, resolve, reject);

}
export function addUpdateJson(params, resolve, reject) {
    apiPost(Constant.API_HOST_ADDRESS, Constant.ADD_UPDATE_JSON, params, resolve, reject);
}

/**
 * 保存用户喜好
 * @param params
 * @param resolve
 * @param reject
 */
export function saveCustomerPrefers(params, resolve, reject) {
    apiForm(Constant.API_HOST_ADDRESS, Constant.SAVE_PREFERS, params, resolve, reject)
}

/**
 * 根据ID获取客户信息
 * @param params
 * @param resolve
 * @param reject
 */
export function getCustomerOne(params, resolve, reject){
    apiGet(Constant.API_HOST_ADDRESS, Constant.ONE_CUSTOMER, params, resolve, reject)
}

/**
 * 删除多个客户数据
 * @param params
 * @param resolve
 * @param reject
 */
export function deleteCustomer(params, resolve, reject) {
    apiForm(Constant.API_HOST_ADDRESS, Constant.DELETE_CUSTOMERS, params, resolve, reject)
}

/**
 * 获取可合并的所有客户信息列表
 * @param params
 * @param resolve
 * @param reject
 */
export function getMergeCustomer(params, resolve, reject) {
    apiGet(Constant.API_HOST_ADDRESS, Constant.MERGE_CUSTOMER_INIT, params, resolve, reject)
}

/**
 * 获取单个客户详细信息
 * @param id
 * @param resolve
 * @param reject
 */
export function getCustomerDetail(id, resolve, reject) {
    apiGet(Constant.API_HOST_ADDRESS, Constant.CUSTOMER_DETAIL, {id}, resolve, reject)
}

/**
 * 保存客户合并信息
 * @param params
 * @param resolve
 * @param reject
 */
export function saveMergerCustomer(params, resolve, reject) {
    apiPost(Constant.API_HOST_ADDRESS, Constant.SAVE_MERGER, params, resolve, reject);
}

/**
 * 获取客户的分管人的列表
 * @param custIds 客户ids 数组
 * @param resolve
 * @param reject
 */
export function getCustsstaffs(custIds, resolve, reject){
    apiGet(Constant.API_HOST_ADDRESS, Constant.CUSTOMER_CUSTSSTAFFS, {custIds}, resolve, reject);
}

export function getMiniList(entity, reslove, reject){
    apiPost(Constant.API_HOST_ADDRESS, Constant.MINI_LIST, {obj: entity}, reslove, reject)
}

/**
 * 保存客户分配
 * @param params
 * @param resolve
 * @param reject
 */
export function saveStaffs(params, resolve, reject){
    apiForm(Constant.API_HOST_ADDRESS, Constant.SAVE_STAFFS, params, resolve, reject)
}

/**
 * 客户查重数据列表获取
 * @param params
 * @param resolve
 * @param reject
 */
export function getRepeatPage(params, resolve, reject){
    apiGet(Constant.API_HOST_ADDRESS, Constant.REPEAT_PAGE, params, resolve, reject);
}

/**
 * 根据关键字搜索产品
 * @param param
 * @param resolve
 * @param reject
 */
export function searchMaterial(param, resolve, reject){
    apiGet(Constant.API_HOST_ADDRESS, Constant.MATERIAL_SERARCH, param, resolve, reject)
}

/**
 * 保存客自动报价
 * @param params
 * @param resolve
 * @param reject
 */
export function saveOfferRec(params, resolve, reject){
    apiPost(Constant.API_HOST_ADDRESS, Constant.SAVE_OFFER_REC, params, resolve, reject)
}

/**
 * 根据关键字搜索邮件联系人
 * @param keyword
 * @param resolve
 * @param reject
 */
export function searchEmailContacts(keyword, resolve, reject){
    apiGet(Constant.API_HOST_ADDRESS, Constant.SEARCH_EMAIL_CONTACTS, {keyword}, resolve, reject)
}