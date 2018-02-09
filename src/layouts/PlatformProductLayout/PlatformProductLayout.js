import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import ProductHead from '../../routes/PlatFormProduct/Detail/Header/PDetailsHead'
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../services/apiCall";
import DetailCommon from  '../../common/DetailCommon';

import Detail from  '../../routes/PlatFormProduct/Detail/Content/components/ProductDetail';
import Traderules from  '../../routes/PlatFormProduct/Traderules/List/components/Traderules';
import Chenpsort  from  '../../routes/PlatFormProduct/Chenpsort/components/Chenpsort';
import Groupe   from  '../../routes/PlatFormProduct/Groupe/components/Groupe';
import Supplie  from  '../../routes/PlatFormProduct/Supplie/components/Supplie';
import Customer from  '../../routes/PlatFormProduct/Customer/components/Customer';
import Accessory from  '../../routes/PlatFormProduct/Accessory/components/Accessory';
import Annotation from '../../routes/PlatFormProduct/Annotation/components/Annotation';
import Picture    from  '../../routes/PlatFormProduct/Picture/components/PlatProPicture';
class PlatformProductLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
			id:this.props.location.query.id,
			material:{},
            curentId:DetailCommon.platformProduct[this.props.location.query.id] || this.props.location.query.index || 'detail'
		};		
		this.getDetailData=this.getDetailData.bind(this);
		this.handleResize=this.handleResize.bind(this);
		this.onClickLink = this.onClickLink.bind(this);
    }
	 //进入详情初始化数据
    getDetailData(obj){
        apiGet(API_FOODING_DS,"/platformMaterial/getDetail",{id:this.state.id}, (response) => {
            let {material}  = response.data;
            this.setState({
                material: material
            },()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            })
        },(error) => {
            console.log(error.message)

        })
    };
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){
            this.detail.getPage();
            this.setState({
                isDetail:true
            });
        }else if(obj.id == 'traderules' && !obj.isLoading){
            this.traderules.getPage();
        }else if(obj.id == 'chenpsort' && !obj.isLoading){
            this.chenpsort.getInitData();
        }else if(obj.id == 'groupe' && !obj.isLoading){
            this.groupe.getInitData();
        }else if(obj.id == 'supplie' && !obj.isLoading){
            this.supplie.getPages();
        }else if(obj.id == 'customer' && !obj.isLoading){
            this.customer.getPages();
        }else if(obj.id == 'accessory' && !obj.isLoading){
            this.accessory.getPage();
        }else if(obj.id == 'annotation' && !obj.isLoading){
            this.annotation.getPage();
        }else if(obj.id == 'picture' && !obj.isLoading){
            this.picture.getPage();
        }
        DetailCommon.platformProduct[this.props.location.query.id] = obj.id;
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
  	};
	setGeOne = one => {
	    this.setState({material: one});
    };
	render(){
		let {material}  = this.state;
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{paddingTop:this.state.paddingTop,material:material,getDetailData:this.getDetailData, setGeOne: this.setGeOne});
		children.props=newProps;
		return (
			<div className='container-body'>
				<ProductHead  getDetailData={this.getDetailData} material={material}
							  curentId ={this.state.curentId}
							  id={this.state.id}  onClickLink ={this.onClickLink}
				/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						<div className={this.state.curentId == 'detail' ?"":"none"}>
							<Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
						</div>
						<div className={this.state.curentId == 'traderules' ?"":"none"}>
							<Traderules {...newProps} traderules ={no => this.traderules = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'chenpsort' ?"":"none"}>
							<Chenpsort {...newProps} chenpsort ={no => this.chenpsort = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'groupe' ?"":"none"}>
							<Groupe {...newProps} groupe ={no => this.groupe = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'supplie' ?"":"none"}>
							<Supplie {...newProps} supplie ={no => this.supplie = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'customer' ?"":"none"}>
							<Customer {...newProps} customer ={no => this.customer = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'accessory' ?"":"none"}>
							<Accessory {...newProps} accessory ={no => this.accessory = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'annotation' ?"":"none"}>
							<Annotation {...newProps} annotation ={no => this.annotation = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'picture' ?"":"none"}>
							<Picture {...newProps} picture ={no => this.picture = no} isDetail ={true} />
						</div>
					</div>
			    </div>
			</div>
			);
	}
}
PlatformProductLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default PlatformProductLayout

