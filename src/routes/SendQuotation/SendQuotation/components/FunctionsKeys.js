import i18n from './../../../../lib/i18n';
import React, {Component, PorpTypes} from "react"
//引入按钮键
import Confirm from '../../../../components/button/confirm'

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {deleteClick,SendPClick}=this.props;
		let  iconArray = [{type:'delete',onClick:deleteClick,permissions:'sendquotation.del'},{type:'sendprice',onClick:SendPClick,permissions:'sendquotation.sendprice'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

