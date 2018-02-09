import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import ProductHead from '../../routes/Product/Detail/Header/PDetailsHead'
import DetailCommon from  '../../common/DetailCommon';
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../services/apiCall";

import Detail from  '../../routes/Product/Detail/Content/components/ProductDetail';
import Traderules from  '../../routes/Product/Traderules/List/components/Traderules';
import Strategy from  '../../routes/Product/Strategy/components/Strategy';
import Package from  '../../routes/Product/Package/components/Package';
import Chenpsort from  '../../routes/Product/Chenpsort/components/Chenpsort';
import Groupe from  '../../routes/Product/Groupe/components/Groupe';
import Businesspro  from  '../../routes/Product/Businesspro/List/components/BusinessList';
import Accessory from  '../../routes/Product/Accessory/components/Accessory';
import Annotation from  '../../routes/Product/Annotation/components/Annotation';
import Supplie from  '../../routes/Product/Supplie/components/Supplie';
import Customer from  '../../routes/Product/Customer/components/Customer';
import ProPicture  from  '../../routes/Product/Picture/components/ProPicture';
import Purchase  from  '../../routes/Product/Purchase/List/components/PurchaseList';
import Inventory  from  '../../routes/Product/Inventory/List/components/InventoryList';




export class ProductLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
			id:this.props.location.query.id,
			material:{
				basModel:'', //基本型号
				optlock:'',//版本号
				enName:'',//英文名称
				specTxt:'',//产品规格
				dataDiv:'',//产品等级
				hsCode:'',//海关编码
				pPStd:'',//生产标准
				staffs:[],//分管人
				nuNumber:'',
				eNumber:'',
				ecNumber:'',
				casNumber:'',
				colorType:'',//颜色
				followMark:'',//追随
				rptMtl:'',//"申报要素
				pProces:'',//产品工艺
				 inspcMark:'',//商检
				 profit:'',//利润率
				 selfProduced:'',//自产
				 forSale:'',//销售
				 forPurchase:'',//采购
				 mtlType:'',//"产品类型
				 cluster:'',//集团
				 company:'',//公司
				 id:'',
				 code:'',//代码
				 name:'',//名称
				 localName:'',//本地名称
				 rowSts:'',
				 createUserName:'',//创建人
				 updateUserName:'',//修改人
				 createDate:'',//创建时间
				 updateDate:'',//更新时间
				 description:'',//描述
				 contnrType:'' ,//默认箱型
			},
            curentId:DetailCommon.product[this.props.location.query.id] || this.props.location.query.index || 'detail',
            isDetail: false
					
		};		
		this.getDetailData=this.getDetailData.bind(this);
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
        }else if(obj.id == 'traderules' && !obj.isLoading){
            this.traderules.getPage();
        }else if(obj.id == 'strategy' && !obj.isLoading){
            this.strategy.getPage();
        }else if(obj.id == 'package' && !obj.isLoading){
            this.package.getPage();
        }else if(obj.id == 'chenpsort' && !obj.isLoading){
            this.chenpsort.getInitData();
        }else if(obj.id == 'groupe' && !obj.isLoading){
            this.groupe.getInitData();
        }else if(obj.id == 'businesspro' && !obj.isLoading){
            this.businesspro.getPages();
        }else if(obj.id == 'accessory' && !obj.isLoading){
            this.accessory.getPages();
        }else if(obj.id == 'annotation' && !obj.isLoading){
            this.annotation.getPage();
        }else if(obj.id == 'supplie' && !obj.isLoading){
            this.supplie.getPage();
        }else if(obj.id == 'customer' && !obj.isLoading){
            this.customer.getPage();
        }else if(obj.id == 'picture' && !obj.isLoading){
            this.proPicture.initList();
        }else if(obj.id == 'purchase' && !obj.isLoading){
            this.purchase.getPages(); 
        }else if(obj.id == 'inventory' && !obj.isLoading){
            this.inventory.getPages(); 
        }


        DetailCommon.product[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
	}
	 //进入详情初始化数据
    getDetailData(obj){
        apiGet(API_FOODING_DS,"/material/getDetail",{id:this.state.id}, (response) => {
            let {material}  = response.data; 
            this.setState({
                material:material
            },()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            })
        },(error) => {
            console.log(error.message)
        })
    };
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
		let {material}  = this.state;
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{paddingTop:this.state.paddingTop,material:material,getDetailData:this.getDetailData});
		children.props=newProps;
		return (
			<div className='container-body'>
				<ProductHead  getDetailData={this.getDetailData} value={material} curentId ={this.state.curentId}
							  onClickLink ={this.onClickLink}/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						<div className={this.state.curentId == 'detail' ?"":"none"}>
							<Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
						</div>
						<div className={this.state.curentId == 'traderules' ?"":"none"}>
							<Traderules {...newProps} traderules ={no => this.traderules = no} isDetail ={true} />
						</div>					
						<div className={this.state.curentId == 'strategy' ?"":"none"}>
							<Strategy {...newProps} strategy ={no => this.strategy = no} isDetail ={true} />
						</div>						
						<div className={this.state.curentId == 'package' ?"":"none"}>
							<Package {...newProps} package ={no => this.package = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'chenpsort' ? "":"none"}>
							<Chenpsort {...newProps} chenpsort ={no => this.chenpsort = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'groupe' ?"":"none"}>
							<Groupe {...newProps} groupe ={no => this.groupe = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'businesspro' ?"":"none"}>
							<Businesspro {...newProps} businesspro ={no => this.businesspro = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'accessory' ?"":"none"}>
							<Accessory {...newProps} accessory ={no => this.accessory = no} />
						</div>
						<div className={this.state.curentId == 'annotation' ?"":"none"}>
							<Annotation {...newProps} annotation ={no => this.annotation = no} />
						</div>
						<div className={this.state.curentId == 'supplie' ?"":"none"}>
							<Supplie {...newProps} supplie ={no => this.supplie = no}  isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'customer' ?"":"none"}>
							<Customer {...newProps} customer ={no => this.customer = no}  isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'picture' ? "":"none"}>
						{/*<div className={this.state.curentId == 10?"picture":"none"}>*/}
							<ProPicture {...newProps} proPicture ={no => this.proPicture = no}  isDetail ={true} />
						</div>

						<div className={this.state.curentId == 'purchase' ?"":"none"}>
							<Purchase {...newProps} businesspro ={no => this.purchase = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'inventory' ?"":"none"}>
							<Inventory {...newProps} businesspro ={no => this.inventory = no} isDetail ={true} />
						</div>						
																		
					</div>
			    </div>
			</div>
			);
	}
}
ProductLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default ProductLayout

