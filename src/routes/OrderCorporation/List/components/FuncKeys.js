import React,{Component,PorpTypes} from "react"

//引入按钮键
import  Confirm from  '../../../../components/button/confirm'

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {editClick,deleteClick}=this.props;
		let  iconArray = [{type:'edit',onClick:editClick,permissions:'order_credit_insurance.edit'},{type:'delete',onClick:deleteClick,permissions:'order_credit_insurance.del'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

