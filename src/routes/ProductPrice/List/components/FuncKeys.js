import React,{Component,PorpTypes} from "react"

//引入按钮键
import  Confirm from  '../../../../components/button/confirm'

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {addClick,partyClick,deleteClick}=this.props;
		let  iconArray=[];
		if(this.props.businessNo){
			iconArray = [{type:'delete',onClick:deleteClick}]
		}else{
			iconArray = [{permissions:'productpricing.add',type:'add',onClick:addClick},
			{permissions:'productpricing.del',type:'delete',onClick:deleteClick}]
		}
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

