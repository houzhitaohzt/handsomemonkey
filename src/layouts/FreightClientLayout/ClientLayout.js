import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import Header from '../../components/Header'
import CDetailsHead from '../../routes/FreightClient/Detail/Head/CDetailsHead'
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../services/apiCall";
import ServiceTips from '../../components/ServiceTips';
import xt from '../../common/xt';
import Detail from  '../../routes/FreightClient/Detail/Content/components/CDetailsContent';
import ProductClient from  '../../routes/Product/ClientProduct/components/Product';
import Prices from  '../../routes/FreightClient/Prices/List/components/PriceList';
import LinkMan from  '../../routes/FreightClient/Linkman/components/Linkman';
import Enterprise from  '../../routes/FreightClient/Enterprise/components/Enterprise';
import Business from  '../../routes/FreightClient/Business/List/components/BusinessList';
import SampleList from  '../../routes/FreightClient/SampleList/components/SampleList';
import SalePrices from  '../../routes/Price/components/Price';
import OrderList from  '../../routes/FreightClient/Order/components/Order';
import Activity  from  '../../routes/FreightClient/ActivityMarket/components/ClientActivity';
import Email from  '../../routes/FreightClient/Email/components/Email';
import MassEmail from  '../../routes/FreightClient/MassEmail/components/MassEmail';
import Date from  '../../routes/FreightClient/Date/components/ClientDate';
import Contact from  '../../routes/FreightClient/Contact/components/ClientContact';
import Accessory from '../../routes/FreightClient/Accessory/components/Accessory';
import Annotation from  '../../routes/FreightClient/Annotation/components/Annotation';
import Client from '../../routes/FreightClient/client/components/Client';
import Contender from '../../routes/FreightClient/contender/components/Contender';
import Organizational from  '../../routes/FreightClient/Organizational/components/Organizational';
import DetailCommon from  '../../common/DetailCommon';
export class CDetailsLayout extends Component{
	constructor(props) {
		super(props);
		this.state= {
            paddingTop: 226,
            id: this.props.location.query.id,
            customer: {},
            regCapitalCurren: {},
			isDetail:false,
            curentId:DetailCommon.client[this.props.location.query.id]|| this.props.location.query.index || 'detail'
        }

		this.handleResize=this.handleResize.bind(this);
		this.getDetailData=this.getDetailData.bind(this);
		this.onClickLink = this.onClickLink.bind(this);
    }

    //获取单条产品数据 （包括常规数据，组织数据，以及所有的table列表等等） 
	getDetailData(obj){
		let that = this;
		apiGet(API_FOODING_DS,'/customer/getDetail',{id:this.state.id},(response)=>{
			let {customer,regCapitalCurren} = response.data;
			that.setState({
				customer:customer,
				regCapitalCurren:regCapitalCurren,
				data:response.data
			},()=>{
				if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
				}
			})
		},(error)=>{
			 ServiceTips({text:'服务器错误！',type:'error'});
		})
	}
    onClickLink(obj){
		let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){
            this.detail.getPage();
            this.setState({
				isDetail:true
			});
        }else if(obj.id == 'product' && !obj.isLoading){
			this.product.getPage();
		}else if(obj.id == 'prices' && !obj.isLoading){
			this.prices.getPage();
		}else if(obj.id == 'linkman' && !obj.isLoading){
            this.linkman.getPage();
        }else if(obj.id == 'enterprise' && !obj.isLoading){
            this.enterprise.getPages();
        }else if(obj.id == 'business' && !obj.isLoading){
            this.business.getPages();
        }else if(obj.id == 'sampleList' && !obj.isLoading){
        	this.sampleList.getPages();
		}else if(obj.id == 'salePrices' && !obj.isLoading){
            this.salePrices.getPage();
        }else if(obj.id == 'order' && !obj.isLoading){
            this.order.getPage();
        }else if(obj.id == 'activity' && !obj.isLoading){
            this.activity.getPage();
        }else if(obj.id == 'email' && !obj.isLoading){
            this.email.getPage();
        }else if(obj.id == 'massEmail' && !obj.isLoading){
            this.massEmail.getPages();
        }else if(obj.id == 'date' && !obj.isLoading){
            this.date.getPage();
        }else if(obj.id == 'contact' && !obj.isLoading){
            this.contact.getPage();
        }else if(obj.id == 'accessory' && !obj.isLoading){
            this.accessory.getPage();
        }else if(obj.id == 'annotation' && !obj.isLoading){
            this.annotation.getPage();
        }else if(obj.id == 'client' && !obj.isLoading){
            this.client.getPage();
        }else if(obj.id == 'contender' && !obj.isLoading){
            this.contender.getPage();
        }else if(obj.id == 'organizational' && !obj.isLoading){
            this.organizational.getChild();
        }
        DetailCommon.client[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
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
  	}
	render(){
		let {customer,regCapitalCurren} = this.state;
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{paddingTop:this.state.paddingTop,
				id:this.state.id,
				value:this.state.data,
				customer:customer,
                curentId:this.state.curentId,
				regCapitalCurren:regCapitalCurren,
				getDetailData:this.getDetailData});
		children.props=newProps;
		return (
			<div className='container-body'>
				<CDetailsHead  getDetailData={this.getDetailData} value={this.state.customer} curentId ={this.state.curentId}
							   id={this.state.id}  onClickLink ={this.onClickLink}
				/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						<div className={this.state.curentId == 'detail' ?"":"none"}>
							<Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
						</div>
						<div className={this.state.curentId == 'product' ?"":"none"}>
							<ProductClient {...newProps} product={no => this.product = no}/>
						</div>
						<div className={this.state.curentId == 'prices' ?"":"none"}>
							<Prices {...newProps} prices={no => this.prices = no}/>
						</div>
						<div className={this.state.curentId == 'linkman' ?"":"none"}>
							<LinkMan {...newProps} linkman={no => this.linkman = no} dataTyId ={100}/>
						</div>
						<div className={this.state.curentId == 'enterprise' ?"":"none"}>
							<Enterprise {...newProps} enterprise={no => this.enterprise = no} />
						</div>
						<div className={this.state.curentId == 'business' ?"":"none"}>
							<Business {...newProps} business={no => this.business = no} />
						</div>
						<div className={this.state.curentId == 'sampleList' ?"":"none"}>
							<SampleList {...newProps} sampleList={no => this.sampleList = no} />
						</div>
						<div className={this.state.curentId == 'salePrices' ?"":"none"}>
							<SalePrices {...newProps} salePrices ={no => this.salePrices = no} />
						</div>
						<div className={this.state.curentId == 'order' ?"":"none"}>
							<OrderList {...newProps} order ={no => this.order = no} />
						</div>
						<div className={this.state.curentId == 'activity' ?"":"none"}>
							<Activity {...newProps} activity ={no => this.activity = no} />
						</div>
						<div className={this.state.curentId == 'email' ?"":"none"}>
							<Email {...newProps} email ={no => this.email = no} />
						</div>
						<div className={this.state.curentId == 'massEmail' ?"":"none"}>
							<MassEmail {...newProps} massEmail ={no => this.massEmail = no} value={this.state.data} />
						</div>
						<div className={this.state.curentId == 'date' ?"":"none"}>
							<Date {...newProps} date ={no => this.date = no} />
						</div>
						<div className={this.state.curentId == 'contact' ?"":"none"}>
							<Contact {...newProps} contact ={no => this.contact = no} />
						</div>
						<div className={this.state.curentId == 'accessory' ?"":"none"}>
							<Accessory {...newProps} accessory ={no => this.accessory = no} />
						</div>
						<div className={this.state.curentId == 'annotation' ?"":"none"}>
							<Annotation {...newProps} annotation ={no => this.annotation = no} />
						</div>
						<div className={this.state.curentId == 'client' ?"":"none"}>
							<Client {...newProps} client ={no => this.client = no} />
						</div>
						<div className={this.state.curentId == 'contender' ?"":"none"}>
							<Contender {...newProps} contender ={no => this.contender = no} />
						</div>
						<div className={this.state.curentId == 'organizational' ?"":"none"}>
							<Organizational {...newProps} organizational ={no => this.organizational = no} />
						</div>
					</div>
			    </div>
			</div>
			);
	}
}
CDetailsLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CDetailsLayout

