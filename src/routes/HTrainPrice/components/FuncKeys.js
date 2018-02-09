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
		let  iconArray = [{type:'add',onClick:addClick,permissions:'forwtrainPrice.add'},
		{type:'daochu',onClick:daochuClick,permissions:'forwtrainPrice.export'},
		{type:'daoru',onClick:daoruClick,permissions:'forwtrainPrice.import'},
		{type:'fabu',onClick:fabuClick,permissions:'forwtrainPrice.publish'},
		{type:'allfabu',onClick:allfabuClick,permissions:'forwtrainPrice.allpublish'},
		{type:'zuofei',onClick:zuofeiClick,permissions:'forwtrainPrice.void'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys
