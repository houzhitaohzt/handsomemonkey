import React,{Component,PorpTypes} from "react"
//引入按钮键
import  Confirm from  '../../../../components/button/confirm'
class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {deleteClick,submitClick}=this.props;
		let  iconArray = [{type:'delete',onClick:deleteClick,permissions:'pinfakesingle.del'},{type:'submit',onClick:submitClick,permissions:'pinfakesingle.submit'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

