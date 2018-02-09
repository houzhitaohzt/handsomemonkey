import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {navTabUpdate} from '../NavigateTabs/modules/tabs';
const mapStateToProps= function(state) {
 	return {
	 	location:state.location,
    navigate:state.navigate
 	}
 }

  const mapDispatchToProps = {
 	redirect: function(url) {
 		return (dispatch, getState) => {
	 		dispatch(browserHistory.push(url));
 		}
 	},
  updateTab:function(tab){
    return (dispatch,getState)=>{
      dispatch(navTabUpdate(tab));
    }
  }
 }

export default connect(mapStateToProps,mapDispatchToProps);

