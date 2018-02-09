import React,{Component,PorpTypes} from "react"
//引入按钮键
import  Confirm from  '../../../../components/button/confirm'
class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {addClick,partyClick,deleteClick,mergeClick,distinctClick,copyClick,startClick}=this.props;
		let  iconArray = [
			{type:'add',onClick:addClick,permissions:'forwarder.add'},
			//{type:'party',onClick:partyClick,permissions:'clien.inPlatform'},
			{type:'party',onClick:partyClick,permissions:'forwarder.inPlatform'},
			{type:'delete',onClick:deleteClick,permissions:'forwarder.del'},
			{type:'merge',onClick:mergeClick,permissions:'forwarder.merge'},
			{type:'distinct',onClick:distinctClick,permissions:'forwarder.removal'},{type:'start',onClick:startClick}
			]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

