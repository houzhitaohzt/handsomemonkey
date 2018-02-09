import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import ProductHead from '../../routes/FreightProvider/Detail/Header/PVetailsHead'
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../services/apiCall";
import ServiceTips from '../../components/ServiceTips';
import DetailCommon from  '../../common/DetailCommon';


import Detail from  '../../routes/FreightProvider/Detail/Content/components/ProviderDetail';
import Product from  '../../routes/FreightProvider/Product/Detail/components/Productdetail';
import LinkMan from  '../../routes/FreightProvider/Linkman/components/Linkman';
import Enterprise from  '../../routes/FreightProvider/Enterprise/components/Enterprise';
import Purchaseorder from  '../../routes/FreightProvider/Purchaseorder/components/Purchaseorder';
import Email  from  '../../routes/FreightProvider/Email/components/Email';
import Date from  '../../routes/FreightProvider/Date/components/ProviderDate';
import Contact from  '../../routes/FreightProvider/Contact/components/ProviderContact';
import Activity from  '../../routes/FreightProvider/Activity/components/ProviderActivity';
import Accessory from  '../../routes/FreightProvider/Accessory/components/Accessory';
import Annotation from  '../../routes/FreightProvider/Annotation/components/Annotation';
export class ProviderLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
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
			value:{},
			regCapitalCurren:{},
            curentId:DetailCommon.provider[this.props.location.query.id] || this.props.location.query.index || 'detail',

		};
		this.getDetailData =this.getDetailData.bind(this);
		this.handleResize=this.handleResize.bind(this);
		this.onClickLink = this.onClickLink.bind(this);
    }
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){
            this.detail.getPages();
            this.setState({
                isDetail:true
            });
        }else if(obj.id == 'product' && !obj.isLoading){
            this.product.getPages();
        }else if(obj.id == 'linkman' && !obj.isLoading){
            this.linkman.getPage();
        }else if(obj.id == 'enterprise' && !obj.isLoading){
            this.enterprise.getPage();
        }else if(obj.id == 'purchaseorder' && !obj.isLoading){
            this.purchaseorder.getPages();
        }else if(obj.id == 'email' && !obj.isLoading){
            this.email.getPage();
        }else if(obj.id == 'date' && !obj.isLoading){
            this.date.getPages();
        }else if(obj.id == 'contact' && !obj.isLoading){
            this.contact.getPage();
        }else if(obj.id == 'activity' && !obj.isLoading){
            this.activity.getPage();
        }else if(obj.id == 'accessory' && !obj.isLoading){
            this.accessory.getPage();
        }else if(obj.id == 'annotation' && !obj.isLoading){
            this.annotation.getPage();
        }
        DetailCommon.provider[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
    }
     //获取单条产品数据 （包括常规数据，组织数据，以及所有的table列表等等）
	getDetailData(obj){
		apiGet(API_FOODING_DS,'/vendor/getDetail',{id:this.state.id},(response)=>{
			let {vendor,regCapitalCurren} = response.data;
			this.setState({
				value:response.data,
				vendor:vendor,
				regCapitalCurren:regCapitalCurren,
			},()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            })
		},(error)=>{
			ServiceTips({text:error.message,type:'error'});
		})
	}
	handleResize(){
		let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
	};
	componentDidMount(){
		this.getDetailData(true);
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
				getDetailData:this.getDetailData,
				value:this.state.value,
				regCapitalCurren:this.state.regCapitalCurren,
			});
		children.props=newProps;
		return (

			<div className='container-body'>
				<ProductHead  getDetailData={this.getDetailData} value = {this.state.vendor}
							  curentId ={this.state.curentId}
							  onClickLink ={this.onClickLink}/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						<div className={this.state.curentId == 'detail' ?"":"none"}>
							<Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
						</div>
						<div className={this.state.curentId == 'product' ?"":"none"}>
							<Product {...newProps} product ={no => this.product = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'linkman' ?"":"none"}>
							<LinkMan {...newProps} linkman ={no => this.linkman = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'enterprise' ?"":"none"}>
							<Enterprise {...newProps} enterprise ={no => this.enterprise = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'purchaseorder' ?"":"none"}>
							<Purchaseorder {...newProps} purchaseorder ={no => this.purchaseorder = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'email' ?"":"none"}>
							<Email {...newProps} email ={no => this.email = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'date' ?"":"none"}>
							<Date {...newProps} date ={no => this.date = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'contact' ?"":"none"}>
							<Contact {...newProps} contact ={no => this.contact = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'activity' ?"":"none"}>
							<Activity {...newProps} activity ={no => this.activity = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'accessory' ?"":"none"}>
							<Accessory {...newProps} accessory ={no => this.accessory = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'annotation' ?"":"none"}>
							<Annotation {...newProps} annotation ={no => this.annotation = no} isDetail ={true} />
						</div>
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

