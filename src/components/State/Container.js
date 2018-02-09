import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {save} from './module';
const mapStateToProps= function(state) {
 	return {
	 	stateMaps:state.stateMaps
 	}
 }
const mapDispatchToProps = {
	 saveState:function(key,data){
	    return (dispatch,getState)=>{
	      dispatch(save(key,data));
	    }
	 }
}
export default connect(mapStateToProps,mapDispatchToProps);

