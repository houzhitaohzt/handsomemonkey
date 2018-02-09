/*
*用户服务
*/
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ES} from '../apiCall';
import WebData from '../../common/WebData';
export const API_HOST_ADDRESS=API_FOODING_ES;
export const USER_LOGIN_METHOD='/fc/doLogin2';
export const LOGIN_OUT = '/logout';

export function isAuthorized(){
	return false;
}

export function getAuthorizeUser(){
	return {
		// id:1,
		// name:'name'
	}
}

export default function authorize(name,pwd,resolve,reject){
	if(isAuthorized()){
		return resolve(getAuthorizeUser());
	}
	return login(name,pwd,resolve,fault);
}

export function login(params,resolve,reject)
{
	apiForm(API_HOST_ADDRESS,USER_LOGIN_METHOD,params,resolve,reject);
}
export function loginout (params,resolve,reject) {
	// body...
	apiForm(API_HOST_ADDRESS,USER_LOGIN_METHOD,params,resolve,reject);
}
export function getUser(){
    return WebData.user;
}

export function  clientList(start,length,resolve,reject){
	return apiGet('fooding-ds/fc/customer/getPage');
}
//export default authorize;
