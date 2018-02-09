import i18n from './../../../lib/i18n';
export const  USER_LOGIN_SIGN = 'USER_LOGIN_SIGN'
export const  USER_LOGIN_RESET = 'USER_LOGIN_RESET'
export const  USER_LOGIN_CURRENT='USER_LOGIN_CURRENT'

import WebData from '../../../common/WebData'
export function userLoginSign(user){
	return {
		type:USER_LOGIN_SIGN,
		user
	}
}

export function currentUserInfo(user){
	return {
		type:USER_LOGIN_CURRENT,
		user
	}
}

export function userLoginReset(){
	return{
		type:USER_LOGIN_RESET,
		user:{'name':'','password':''}
	}
}

const initialState ={
	name:'',
	password:''
};
const ACTION_HANDLERS = {
    ['@@redux/INIT'] : function (state, action){
        let user = WebData.getLastLoginUser();
        return user ? {name: user.name, password: user.pwd}: state;
    },

	[USER_LOGIN_SIGN]:function(state,action){
		//用户名密码的正则判断，远程访问，远程访问失败成功返回不同的信息
		return  {...state,
			msg:i18n.t(200675/*成功*/)
		}
	},
	[USER_LOGIN_RESET]:function(state,action){
		return  {...state,
			name:'',
			password:''
		}
	},
	[USER_LOGIN_CURRENT]:function(state,action){
		let {name, password}=action.user;
        let user = WebData.findUserAgent(name);
        return user ? {name: user.name, password: user.pwd}: state;
	},
	['LOCATION_CHANGE']: function(state, action){
        let user = WebData.getLastLoginUser();
        return user ? {name: user.name, password: user.pwd}: state;
    }
};

export default function userLoginReducer( state= initialState,action){

  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state

}
