import React,{Component,PorpTypes} from "react"

//引入按钮键
import  Confirm from  '../../../../components/button/confirm'
import {i18n} from '../../../../lib/i18n';





class FunctionKeys extends Component{
	constructor(props){
		super(props);
	}

	render(){
		let that = this;
		const {sealClick}=this.props;  
		let  iconArray = [
			{type:'seal',onClick:sealClick,permissions:'sealed.seal'},
			// {type:'unlock',onClick:unlockClick,permissions:'provider.del'}
		]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

