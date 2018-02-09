import React,{Component,PorpTypes} from "react"
//引入按钮键
import  Confirm from  '../../../components/button/confirm'
class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {addClick,paymentClick,baoxiaoClick,deleteClick}=this.props;
		let  iconArray = [{type:'add',onClick:addClick,permissions:'diplomafee.add'},{type:'delete',onClick:deleteClick},{type:'payment',onClick:paymentClick,permissions:'diplomafee.tocost'},{type:'baoxiao',onClick:baoxiaoClick,permissions:'diplomafee.toreimbursement'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

