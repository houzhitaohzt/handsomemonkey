import React,{Component,PorpTypes} from "react"
//引入按钮键
import  Confirm from  '../../../../components/button/confirm'
class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {addClick,daochuClick,daoruClick,fabuClick,allfabuClick,zuofeiClick}=this.props;
		let  iconArray = [{type:'add',onClick:addClick,permissions:'forwcostagc.add'},
		{type:'daochu',onClick:daochuClick,permissions:'forwcostagc.export'},
		{type:'daoru',onClick:daoruClick,permissions:'forwcostagc.import'},
		{type:'fabu',onClick:fabuClick,permissions:'forwcostagc.publish'},
		{type:'allfabu',onClick:allfabuClick,permissions:'forwcostagc.allpublish'},
		{type:'zuofei',onClick:zuofeiClick,permissions:'forwcostagc.void'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys


