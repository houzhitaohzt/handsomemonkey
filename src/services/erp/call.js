import {apiGet,apiPost,apiForm} from '../apiCall';
import {API_HOST_ADDRESS ,GET_CAPITALMONTHRATE_PAGE,POST_CAPITALMONTHRATE_SAVE,POST_CAPITALMONTHRATE_DELETE,
GET_CAPITALMONTHRATE_EDIT} from './constant';

export function getCapitalmonthratePage(params,resolve,reject){
  apiGet(API_HOST_ADDRESS,GET_CAPITALMONTHRATE_PAGE,params,resolve,reject);
}
export function  postCapitalmonthrateAdd(params,resolve,reject) {
	// body... 
	apiPost(API_HOST_ADDRESS,POST_CAPITALMONTHRATE_SAVE,params,resolve,reject);
}
export function  postCapitalmonthrateDelete(params,resolve,reject) {
	// body... 
	apiForm(API_HOST_ADDRESS,POST_CAPITALMONTHRATE_DELETE,params,resolve,reject);
}
export function  getCapitalmonthrateEdit(params,resolve,reject) {
	// body... 
	apiGet(API_HOST_ADDRESS,GET_CAPITALMONTHRATE_EDIT,params,resolve,reject);
}
