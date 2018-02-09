import React,{Component,PorpTypes} from "react"
//引入按钮键
import  Confirm from  '../../../components/button/confirm'
class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}
//{ permissionsBtn('shipping.topayrequest') && (getOne.status==10 || getOne.status == 30)? <i className="foddingicon fooding-payment-apply" style={{fontSize:'16px',marginRight:'20px'}} title ={'付款申请'} onClick={this.fuKuan}></i> : ''}
	render(){
		let that = this;
		const {addClick,deleteClick,fkapplayClick}=this.props;
		let  iconArray = [{type:'add',permissions:'sinkrecord.add',onClick:addClick},{type:'delete',permissions:'sinkrecord.del',onClick:deleteClick},{type:'fkapplay',onClick:fkapplayClick}]
		return (
				<Confirm iconArray ={iconArray} that={that}/>
		)
	}
}

export default FunctionKeys

