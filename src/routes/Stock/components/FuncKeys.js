import React,{Component,PorpTypes} from "react"
//引入按钮键
import  Confirm from  '../../../components/button/confirm'
class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {addClick,updatePriceClick}=this.props;
		let  iconArray = [{type:'inventoryAdj',onClick:addClick},{type:'salesPriceAdj',onClick:updatePriceClick}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

