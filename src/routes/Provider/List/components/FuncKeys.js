import React,{Component,PorpTypes} from "react"

//引入按钮键
import  Confirm from  '../../../../components/button/confirm'

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {addClick,partyClick,mergeClick,distinctClick,deleteClick,copyClick}=this.props;
		let  iconArray = [{type:'add',onClick:addClick,permissions:'provider.add'},{type:'party',onClick:partyClick,permissions:'provider.inPlatform'},{type:'merge',onClick:mergeClick,permissions:'provider.merge'},{type:'distinct',onClick:distinctClick,permissions:'provider.removal'},{type:'delete',onClick:deleteClick,permissions:'provider.del'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

