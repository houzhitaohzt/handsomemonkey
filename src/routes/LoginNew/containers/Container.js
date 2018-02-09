 import {
 	connect
 } from 'react-redux'
import { browserHistory } from 'react-router';
//import Login from '../components/Login';
import Login from '../components/NewLogin';
import {userLoginSign,userLoginReset,currentUserInfo} from '../modules/login';
import ServiceTips from '../../../components/ServiceTips';
const mapDispatchToProps = {
 	loginSign: function(params) {
 		// let {name,password} =that.props;
 		return (dispatch, getState) => {
				
 		}
 	},
 	loginReset: function() {
 		return (dispatch, getState) => {
 			dispatch(userLoginReset());
 		}
 	},
 	currentInfo:function(user){
 		return (dispatch,getState)=>{
 			let current={};
 			for(let obj in user){
 				current[user[obj].name]=user[obj].value;
 			}
 			dispatch(currentUserInfo(current));
 		}
 	}
 }

 const mapStateToProps =function (state){
 	 //tabs:state.navigate.tabs
 	 return {
 	 	name:state.login.name,
 	 	password:state.login.password
 	 }
 }

//let LoginForm=connect( mapStateToProps,mapDispatchToProps)(Login);

 export default connect( mapStateToProps,mapDispatchToProps)(Login);
