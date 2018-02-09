import i18n form './../../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Table from '../../../../../components/Table';
	export class Product extends Component{
		consturctor(props){
			super(props);
			this.state = this.initState();
		}
		getData(){
			return this.refs.mainTable.getSelectArr();
		}
		componentWillUnmount(){
			window.removeEventListener('resize',this.ha
				ndleResize());

		}
		componentWillReceiveProps(nextProps){
	        this.handleResize(0);
	        window.addEventListener('resize', this.handleResize(0));
	    }
	    render(){
	    	return(

	    		<div>56756</div>
	    	)
	    }
	}