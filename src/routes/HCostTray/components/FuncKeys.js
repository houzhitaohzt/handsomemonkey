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
		let  iconArray = [{type:'add',onClick:addClick,permissions:'hcosttray.add'},
		{type:'daochu',onClick:daochuClick,permissions:'hcosttray.export'},
		{type:'daoru',onClick:daoruClick,permissions:'hcosttray.import'},
		{type:'fabu',onClick:fabuClick,permissions:'hcosttray.publish'},
		{type:'allfabu',onClick:allfabuClick,permissions:'hcosttray.allpublish'},
		{type:'zuofei',onClick:zuofeiClick,permissions:'hcosttray.void'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

