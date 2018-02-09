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
		let  iconArray = [{type:'add',onClick:addClick,permissions:'forwairPrice.add'},
		{type:'daochu',onClick:daochuClick,permissions:'forwairPrice.export'},
		{type:'daoru',onClick:daoruClick,permissions:'forwairPrice.import'},
		{type:'fabu',onClick:fabuClick,permissions:'forwairPrice.publish'},
		{type:'allfabu',onClick:allfabuClick,permissions:'forwairPrice.allpublish'},
		{type:'zuofei',onClick:zuofeiClick,permissions:'forwairPrice.void'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys


