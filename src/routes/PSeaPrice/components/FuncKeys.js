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
		let  iconArray = [{type:'shoucang',onClick:shoucangClick,permissions:'ptseaPrice.collect'},{type:'allshoucang',onClick:allshoucangClick,permissions:'ptseaPrice.allcollect'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys
