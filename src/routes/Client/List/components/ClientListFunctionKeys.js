import React, {Component, PorpTypes} from "react"
//引入按钮键
import Confirm from '../../../../components/button/confirm'

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {addClick,clientClick,partyClick,deleteClick,mergeClick,allotClick,distinctClick,priceClick,qunfaClick, calendarClick}=this.props;
		let  iconArray = [{type:'add',onClick:addClick,permissions:'clien.add'},
			{type:'party',onClick:partyClick,permissions:'clien.inPlatform'},
			{type:'delete',onClick:deleteClick,permissions:'clien.del'},
			{type:'merge',onClick:mergeClick,permissions:'clien.merge'},
			{type:'allot',onClick:allotClick,permissions:'clien.assigned'},
			{type:'distinct',onClick:distinctClick,permissions:'clien.removal'},
			{type:'price',onClick:priceClick,permissions:'clien.offer'},
			{type:'qunfa',onClick:qunfaClick},
			{type:'commonClient',onClick:clientClick,permissions:'clien.toPublicCustomer'},
			{type:'calendar', onClick:calendarClick, permissions:"clien.calendar"}
		];
		return (
					<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

