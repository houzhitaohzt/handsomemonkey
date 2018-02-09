import React,{Component,PorpTypes} from "react"
//引入按钮键
import  Confirm from  '../../../components/button/confirm'
class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {addClick,deleteClick}=this.props;
		let  iconArray = [{type:'add',onClick:addClick,permissions:'providLevel.add'},{type:'delete',onClick:deleteClick,permissions:'providLevel.del'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

