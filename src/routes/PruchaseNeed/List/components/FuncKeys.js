import React,{Component,PorpTypes} from "react"

//引入按钮键
import  Confirm from  '../../../../components/button/confirm'

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {spearteClick,separteClick,placeClick,suokuClick,tiaozhengClick}=this.props;
		let  iconArray = [{type:'spearte',onClick:spearteClick,permissions:'pruchaseneed.merge'},{type:'separte',onClick:separteClick,permissions:'pruchaseneed.split'},{type:'place',onClick:placeClick,permissions:'pruchaseneed.torder'},{type:'suoku',onClick:suokuClick,permissions:'pruchaseneed.lock'},{type:'tiaozheng',onClick:tiaozhengClick,permissions:'pruchaseneed.adjustment'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys
