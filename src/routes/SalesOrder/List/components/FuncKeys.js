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
		if(this.props.businessNo||this.props.offerId){
			
		}else{
			iconArray = [{permissions:'sorder.add',type:'add',onClick:addClick},{permissions:'sorder.del',type:'delete',onClick:deleteClick}]
		}
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

