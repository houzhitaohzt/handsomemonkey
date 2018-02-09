import React,{Component,PorpTypes} from "react"

//引入按钮键
import  Confirm from  '../../../../components/button/confirm'

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;

		// permissions:'seaPrice.add'
		let  iconArray = [
			// {type:'delete',onClick:deleteClick}
		];
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
	
}

export default FunctionKeys

