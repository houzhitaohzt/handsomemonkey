import React,{Component,PorpTypes} from "react"

//引入按钮键
import  Confirm from  '../../../../components/button/confirm'

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {addClick,partyClick,deleteClick}=this.props;
		let  iconArray = [{type:'add',onClick:addClick,permissions:'expenseaccount.add'},{type:'delete',onClick:deleteClick,permissions:'expenseaccount.del'}]
		return (
				<Confirm iconArray ={iconArray} that={that} />
		)
	}
}

export default FunctionKeys

