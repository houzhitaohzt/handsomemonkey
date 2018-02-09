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
		const {addClick,partyClick,deleteClick,priceClick,copyClick}=this.props;
		let  iconArray = [{type:'add',onClick:addClick,permissions:'business.add'},{type:'delete',onClick:deleteClick}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

