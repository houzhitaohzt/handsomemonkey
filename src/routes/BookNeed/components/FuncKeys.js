import React,{Component,PorpTypes} from "react"
//引入按钮键
import  Confirm from  '../../../components/button/confirm'
class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {spearteClick,separteClick,placeClick,assignClick,anmoutClick}=this.props;
		let  iconArray = [
		{type:'spearte',onClick:spearteClick,permissions:'shippingneed.merge'},
		// {type:'separte',onClick:separteClick},
		{type:'place',onClick:placeClick,permissions:'shippingneed.torder'},
		{type:'assign',onClick:assignClick,permissions:'shippingneed.distribution'},
		{type:'anmout',onClick:anmoutClick,permissions:'shippingneed.adjustment'}
		]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

