import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import CIDetailsHead from '../../routes/CountryInformation/Detail/Header/CIDetailsHead'
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../services/apiCall";
import ServiceTips from '../../components/ServiceTips';

import DetailCommon from  '../../common/DetailCommon';

import Detail from  '../../routes/CountryInformation/Detail/Content/components/ProviderDetail';
import Certificate from '../../routes/CountryInformation/Certificate/components/Certificate';
import Inspection  from '../../routes/CountryInformation/Inspection/components/Inspection';
import Shipmark  from  '../../routes/CountryInformation/Shipmark/components/Shipmark';
import Specialrequire from  '../../routes/CountryInformation/Specialrequire/components/Specialrequire';
import Trayrequire  from  '../../routes/CountryInformation/Trayrequire/components/Trayrequire';
import Documentrequire from  '../../routes/CountryInformation/Documentrequire/components/Documentrequire';
import Payment from  '../../routes/CountryInformation/Payment/components/Payment';
import Accessory from  '../../routes/CountryInformation/Accessory/components/Accessory';
import Annotation from  '../../routes/CountryInformation/Annotation/components/Annotation';
export class CIDetailLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
			id:this.props.location.query.id,
			data:{
			    beArea:"",
				cntrycode:"",
				code:'',
				createDate:'',
				createUserName:'',
				description:'',
				localName:'',
				locale:'',
				name:'',
				optlock:'',
				riskType:'',
				rowSts:'',
				sacInUsMark:'',
				stThWord:'',
				timZon:'',
				updateDate:'',
				updateUserName:''
			},
            curentId:DetailCommon.countryInformation[this.props.location.query.id] || this.props.location.query.index || 'detail'
		};
		this.getDetailData =this.getDetailData.bind(this);
		this.handleResize=this.handleResize.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
    }
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){

        }else if(obj.id == 'certificate' && !obj.isLoading){
            this.certificate.getPage();
        }else if(obj.id == 'inspection' && !obj.isLoading){
            this.inspection.getPage();
        }else if(obj.id == 'shipmark' && !obj.isLoading){
            this.shipmark.getPage();
        }else if(obj.id == 'specialrequire' && !obj.isLoading){
            this.specialrequire.getPage();
        }else if(obj.id == 'trayrequire' && !obj.isLoading){
            this.trayrequire.getPage();
        }else if(obj.id == 'documentrequire' && !obj.isLoading){
            this.documentrequire.getPage();
        }else if(obj.id == 'payment' && !obj.isLoading){
            this.payment.getPage();
        }else if(obj.id == 'accessory' && !obj.isLoading){
            this.accessory.getPage();
        }else if(obj.id == 'annotation' && !obj.isLoading){
            this.annotation.getPage();
        }
        DetailCommon.countryInformation[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
    }
    //获取单条产品数据 （包括常规数据，组织数据，以及所有的table列表等等） 
	getDetailData(obj){
		apiGet(API_FOODING_DS,'/country/getDetail',{id:this.state.id},(response)=>{
			let data = response.data;
			data = Object.assign({},data);
			this.setState({
				data:data
			},()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            })
		},(error)=>{
			ServiceTips({text:'服务器错误！',type:'error'});
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
		// window.addEventListener('resize', this.handleResize);
    };
	componentWillUnmount() {
    	// window.removeEventListener('resize', this.handleResize);
  	};
	render(){
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{paddingTop:this.state.paddingTop,data:this.state.data,getDetailData:this.getDetailData});
		children.props=newProps;
		return (

			<div className='container-body'>
				<CIDetailsHead  getDetailData={this.getDetailData} value={this.state.data}
								curentId ={this.state.curentId}
								id={this.state.id}  onClickLink ={this.onClickLink}
				/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						<div className={this.state.curentId == 'detail' ?"":"none"}>
							<Detail {...newProps} />
						</div>
						<div className={this.state.curentId == 'certificate' ?"":"none"}>
							<Certificate {...newProps} certificate={no => this.certificate = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'inspection' ?"":"none"}>
							<Inspection {...newProps} inspection={no => this.inspection = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'shipmark' ?"":"none"}>
							<Shipmark {...newProps} shipmark={no => this.shipmark = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'specialrequire' ?"":"none"}>
							<Specialrequire {...newProps} specialrequire={no => this.specialrequire = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'trayrequire' ?"":"none"}>
							<Trayrequire {...newProps} trayrequire={no => this.trayrequire = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'documentrequire' ?"":"none"}>
							<Documentrequire {...newProps} documentrequire={no => this.documentrequire = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'payment' ?"":"none"}>
							<Payment {...newProps} payment={no => this.payment = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'accessory' ?"":"none"}>
							<Accessory {...newProps} accessory={no => this.accessory = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'annotation' ?"":"none"}>
							<Annotation {...newProps} annotation={no => this.annotation = no} isDetail ={true} />
						</div>
					</div>
			    </div>
			</div>
			);
	}
}
CIDetailLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CIDetailLayout

