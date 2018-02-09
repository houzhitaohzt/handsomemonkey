import React, {Component, PorpTypes} from "react"
//引入按钮键
import Confirm from '../../../../components/button/confirm'

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {addClick,partyClick,deleteClick,mergeClick,allotClick,distinctClick,priceClick,qunfaClick}=this.props;
		let  iconArray = [
			// {type:'add',onClick:addClick,permissions:'clien.add'},
			{type:'party',onClick:partyClick,permissions:'hclien.inPlatform'},
			{type:'delete',onClick:deleteClick,permissions:'hclien.del'},
			// {type:'merge',onClick:mergeClick,permissions:'clien.merge'},
			// {type:'allot',onClick:allotClick,permissions:'clien.assigned'},
			// {type:'distinct',onClick:distinctClick,permissions:'clien.removal'},
			// {type:'price',onClick:priceClick,permissions:'clien.offer'},
			{type:'qunfa',onClick:qunfaClick}];
		return (
					<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

