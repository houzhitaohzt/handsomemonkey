import React,{Component,PorpTypes} from "react"
import {I18n} from '../../../../lib/i18n';


import {permissionsBtn} from '../../../../services/apiCall'; // ajax


class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {deleteClick,quoteClick}=this.props;
		// let  iconArray = [
		// 	// {type:'delete',onClick:deleteClick,permissions:'toQuote.del'},

		// ];

		return (<div className="oprate-btn">
			
				{ permissionsBtn('toQuote.del') ? 
					<a className='btn-group' title={I18n.t(100437/*删除*/)}>
						<i className = {'foddingicon fooding-delete-icon4'} onClick={deleteClick}></i>
					</a>
					: ''
				}

				{ permissionsBtn('toQuote.send') ? 
					<a className='btn-group' title={I18n.t(100454/*发送报价*/)}>
						<i className = {'foddingicon fooding-release'} onClick={quoteClick}></i>
					</a>				
					: ''
				}
		</div>)
	}
}

export default FunctionKeys

