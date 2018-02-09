import i18n from './../../../../lib/i18n';
import React, {Component, PorpTypes} from "react"
//引入按钮键
import Confirm from '../../../../components/button/confirm'

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let that = this;
		const {addClick,deleteClick,releseClick}=this.props;
		let  iconArray = [{type:'add',onClick:addClick},{type:'delete',onClick:deleteClick,permissions:'sendinquiry.del'},{type:'relese',onClick:releseClick,permissions:'sendinquiry.release'}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

