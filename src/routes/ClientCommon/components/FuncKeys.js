import React,{Component,PorpTypes} from "react"
//引入按钮键
import  Confirm from  '../../../components/button/confirm'
class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {getClient,allocationClient}=this.props;
		let  iconArray = [
			//
			{type:'getClient',onClick:getClient,permissions:'PublicCustomer.receive'},
			{type:'allot',onClick:allocationClient,permissions:'PublicCustomer.assigned'}
		];


		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

