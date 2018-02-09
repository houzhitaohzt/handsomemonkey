import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import ProductHead from '../../routes/PaymentApplication/Detail/Header/PVetailsHead'
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../services/apiCall";
import ServiceTips from '../../components/ServiceTips';

export class ProviderLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:115,
			id:this.props.location.query.id,
			vendor:{
				 cluster:"",
			    code:"",
			    colorType:'',
			    company:"",
			    contactTime:null,
			    country:"",
			    createDate:'',
			    createUserName:"",
			    cstmLevel:'', //客户等级
			    cstmType:'', //客户类型
			    defaultContact:"",
			    defaultWeb:"",
			    description:null,
			    enName:"",
			    estabDate:null,
			    followMark:false,
			    id:"",
			    incotm:"",
			    leglpsn:"",
			    localName:"",
			    name:"",
			    optlock:'',
			    regCapital:"",
			    rowSts:'',
			    source:"",
			    staff:[],
			    taxIdenSN:"",
			    updateDate:'',
			    updateUserName:"",
			    web:''
			},
			addressList:[], //地址列表
			bankacctList:[], //银行账号
			bizExtNameList:[], //供应商别名
			contactList:[], //联系方式列表
			functnList:[], //功能地址列表
			tradrulePaytermList:[], //支付条款
			beStatnList:[], //交货港
			tradruleCertfctList:[], //可提供证书
			value:{}

		};
		this.getDetailData =this.getDetailData.bind(this);
		this.handleResize=this.handleResize.bind(this);
    }

     //获取单条产品数据 （包括常规数据，组织数据，以及所有的table列表等等）
	getDetailData(){
		return;
		apiGet(API_FOODING_DS,'/vendor/getDetail',{id:this.state.id},(response)=>{
			let {vendor,addressList,bankacctList,bizExtNameList,contactList,functnList,tradrulePaytermList,beStatnList,tradruleCertfctList} = response.data;
			this.setState({
				value:response.data,
				vendor:vendor,
				addressList:addressList,
				bankacctList:bankacctList,
				bizExtNameList:bizExtNameList,
				contactList:contactList,
				functnList:functnList,
				tradrulePaytermList:tradrulePaytermList,
				beStatnList:beStatnList,
				tradruleCertfctList:tradruleCertfctList
			})
		},(errors)=>{
			ServiceTips({text:errors.message,type:'error'}); 
		})
	}
	handleResize(){
		let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
	};
	componentDidMount(){
		this.getDetailData()
        let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
		window.addEventListener('resize', this.handleResize);
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize);
  	};
	render(){
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{paddingTop:this.state.paddingTop,vendor:this.state.vendor,
				addressList:this.state.addressList,
				bankacctList:this.state.bankacctList,
				bizExtNameList:this.state.bizExtNameList,
				contactList:this.state.contactList,
				functnList:this.state.functnList,
				tradrulePaytermList:this.state.tradrulePaytermList,
				beStatnList:this.state.beStatnList,
				tradruleCertfctList:this.state.tradruleCertfctList,
				getDetailData:this.getDetailData,
				value:this.state.value
			});
		children.props=newProps;
		return (

			<div className='container-body'>
				<ProductHead  getDetailData={this.getDetailData} value = {this.state.vendor}/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						{children}
					</div>
			    </div>
			</div>
			);
	}
}
ProviderLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default ProviderLayout

