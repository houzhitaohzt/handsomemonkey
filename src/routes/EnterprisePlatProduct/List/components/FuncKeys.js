import i18n from './../../../../lib/i18n';
import React,{Component,PorpTypes} from "react"

//引入按钮键
import  Confirm from  '../../../../components/button/confirm'

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {inputClick}=this.props;
		let  iconArray = [{type:'suoku',onClick:inputClick,title:i18n.t(200549/*加入产品库*/)}];
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

