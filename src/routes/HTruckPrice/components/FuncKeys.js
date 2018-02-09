import React,{Component,PorpTypes} from "react"

//引入按钮键
import  Confirm from  '../../../components/button/confirm'

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {addClick,daochuClick,daoruClick,fabuClick,allfabuClick,zuofeiClick}=this.props;
		let  iconArray = [{type:'add',onClick:addClick,permissions:'forwtruckPrice.add'},
		{type:'daochu',onClick:daochuClick,permissions:'forwtruckPrice.export'},
		{type:'daoru',onClick:daoruClick,permissions:'forwtruckPrice.import'},
		{type:'fabu',onClick:fabuClick,permissions:'forwtruckPrice.publish'},
		{type:'allfabu',onClick:allfabuClick,permissions:'forwtruckPrice.allpublish'},
		{type:'zuofei',onClick:zuofeiClick,permissions:'forwtruckPrice.void'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys


