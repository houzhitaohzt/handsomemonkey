import React,{Component,PorpTypes} from "react"

//引入按钮键
import  Confirm from  '../../../../components/button/confirm'

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {forwardClick}=this.props;
		let  iconArray = [{type:'forward',onClick:forwardClick}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}


export default FunctionKeys

