import React,{Component,PorpTypes} from "react"
//引入按钮键
import  Confirm from  '../../../../components/button/confirm'
class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {addClick,informClick,affirmIClick,affirmIIClick,affirmIIIClick,tuihuiClick}=this.props;
		let  iconArray = [
			// {type:'confirm',onClick:addClick},
			{type:'lead',onClick:informClick,permissions:'sorder.noticesuperior'},
			{type:'affirmI',onClick:affirmIClick,permissions:'sorder.salesconfirmation'},
			{type:'affirmII',onClick:affirmIIClick,permissions:'sorder.mangerconfirmation'},
			{type:'affirmIII',onClick:affirmIIIClick,permissions:'sorder.executiveconfirmation'},
			{type:'tuihui',onClick:tuihuiClick,permissions:'sorder.feeback'}
			
			// {type:'allot',onClick:allotClick,permissions:'sorder.assigned'}			
		]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

