import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import Calendar  from '../../../../components/Calendar/Calendar';
import {createForm,FormWrapper} from '../../../../components/Form';
export class FilterHead extends Component{
	render(){
		return ( 
			    	<div style={{backgroundColor:'#fff',marginBottom:'10px'}} className='footer-header'>
			    		<label>{i18n.t(200754/*发信人*/)}</label>
			    		<input type = 'text' className='text-input'/>
			    		<label>{i18n.t(200755/*标题*/)}</label>
			    		<input type = 'text' className='text-input'/>
			    		<label>{i18n.t(200756/*日期*/)}</label>
			    		<Calendar name={'start'} form={this.props.form} />
			    		<label style={{width:'25px'}}>{i18n.t(500103/*至*/)}</label>
			    		<Calendar name={'start'} form={this.props.form} />
						<span className="search"><i  style={{paddingLeft: '20px',fontSize: '18px',color: '#cccccc'}}
						className="foddingicon fooding-search_icon"></i></span>
						<span className="clean"><i  style={{paddingLeft: '20px',fontSize: '18px',color: '#cccccc'}} className="foddingicon fooding-clean_icon"></i></span>
			    	</div>
			  )
	}
}
export default createForm()(FilterHead)