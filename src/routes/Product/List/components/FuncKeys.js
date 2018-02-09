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
		const {addClick,partyClick,deleteClick,priceClick,copyClick,allotClick}=this.props;
		let  iconArray = [{type:'add',onClick:addClick,permissions:'mtl.add'},{type:'party',onClick:partyClick,permissions:'mtl.inPlatform'},{type:'delete',onClick:deleteClick,permissions:'mtl.del'},{type:'autoprice',onClick:priceClick,permissions:'mtl.offer'},{type:'copy',onClick:copyClick},{type:'allot',onClick:allotClick,permissions:'mtl.assigned',title:i18n.t(200932/*产品分配*/)}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

