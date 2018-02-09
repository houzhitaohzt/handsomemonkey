import React,{Component,PorpTypes} from "react"

//引入按钮键
import  Confirm from  '../../../../components/button/confirm'

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {addClick,partyClick,deleteClick,priceClick,copyClick}=this.props;
		let  iconArray = [{type:'add',onClick:addClick,permissions:'platform.mtl.add'},{type:'delete',onClick:deleteClick,permissions:'platform.mtl.del'},{type:'copy',onClick:copyClick}];
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

