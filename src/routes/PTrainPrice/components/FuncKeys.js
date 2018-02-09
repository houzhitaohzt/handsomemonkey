import React,{Component,PorpTypes} from "react"

//引入按钮键
import  Confirm from  '../../../components/button/confirm'

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {allshoucangClick,shoucangClick}=this.props;
		let  iconArray = [{type:'shoucang',onClick:shoucangClick,permissions:'pttrainPrice.collect'},{type:'allshoucang',onClick:allshoucangClick,permissions:'pttrainPrice.allcollect'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys
