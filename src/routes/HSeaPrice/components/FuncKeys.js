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
		let  iconArray = [{type:'add',onClick:addClick,permissions:'forwseaPrice.add'},{type:'daochu',onClick:daochuClick,permissions:'forwseaPrice.export'},{type:'daoru',onClick:daoruClick,permissions:'forwseaPrice.import'},{type:'fabu',onClick:fabuClick,permissions:'forwseaPrice.publish'},{type:'allfabu',onClick:allfabuClick,permissions:'forwseaPrice.allpublish'},{type:'zuofei',onClick:zuofeiClick,permissions:'forwseaPrice.void'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys
