import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import ProductHead from '../../routes/Forwarder/Detail/Header/FWetailsHead'
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../services/apiCall";
import ServiceTips from '../../components/ServiceTips';
import DetailCommon from  '../../common/DetailCommon';

import Detail from  '../../routes/Forwarder/Detail/Content/components/ProviderDetail';
import LinkMan from  '../../routes/Forwarder/Linkman/components/Linkman';
import Shiporder from  '../../routes/Forwarder/Shiporder/components/Shiporder';
import Enterprise from  '../../routes/Forwarder/Enterprise/components/Enterprise';
import Email from  '../../routes/Forwarder/Email/components/Email';
import Activity from  '../../routes/Forwarder/Activity/components/ForwarderActivity';
import Date  from  '../../routes/Forwarder/Date/components/ForwarderDate';
import Contact  from  '../../routes/Forwarder/Contact/components/ForwarderContact';
import Accessory from  '../../routes/Forwarder/Accessory/components/Accessory';
import Organizational from  '../../routes/Forwarder/Organizational/components/Organizational';
import Annotation from  '../../routes/Forwarder/Annotation/components/Annotation';
export class ForwarderLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
			id:this.props.location.query.id,
			country:{},
			agnShipBeVo:{
			    code:"",
			    colorType:"",
			    contactTime:'',
			    country:"",
			    createDate:'',
			    createUserName:'',
			    description:"",
			    enName:'',
			    entprisContactor:"",
			    estabDate:'',
			    followMark:false,
			    id:"",
			    leglpsn:'',
			    localName:"",
			    name:"",
			    optlock:'',
			    regCapital:'',
			    rowSts:'',
			    updateDate:'',
			    updateUserName:"",
			    web:"",
			    defaultWeb:"",
			    defaultEmail:""
			},
			//addressList:[], //地址列表
			//bankacctList:[], //银行账号
			//bizExtNameList:[], //客户别名
			//contactList:[], //联系方式列表
			//cstmCrsetkt:[], //结算币种
			//functnList:[], //功能地址列表
			//tradrulePaytermList:[], //支付条款
            curentId:DetailCommon.forwarder[this.props.location.query.id]|| this.props.location.query.index || 'detail',
			value:{},
			regCapitalCurren:{}
		};
		this.getDetailData=this.getDetailData.bind(this);
		this.handleResize=this.handleResize.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
    }

    //获取单条产品数据 （包括常规数据，组织数据，以及所有的table列表等等） 
	getDetailData(obj){
		apiGet(API_FOODING_DS,'/agnShipBe/getDetail',{id:this.state.id},(response)=>{
			let {agnShipBeVo,regCapitalCurren,country} = response.data;
			this.setState({
				agnShipBeVo:agnShipBeVo,
				// addressList:addressList,
				// bankacctList:bankacctList,
				// bizExtNameList:bizExtNameList,
				// contactList:contactList,
				// cstmCrsetkt:cstmCrsetkt,
				// functnList:functnList,
				// tradrulePaytermList:tradrulePaytermList,
				value:response.data,
				country:country,
				regCapitalCurren:regCapitalCurren
			},()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            })
		},(error)=>{
			// ServiceTips({text:'服务器错误！',type:'error'});
		})
	}
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){
            this.detail.getPage();
            this.setState({
                isDetail:true
            });
        }else if(obj.id == 'linkman' && !obj.isLoading){
            this.linkman.getPage();
        }else if(obj.id == 'shiporder' && !obj.isLoading){
            this.shiporder.getPage();
        }else if(obj.id == 'enterprise' && !obj.isLoading){
            this.enterprise.getPage();
        }else if(obj.id == 'email' && !obj.isLoading){
            this.email.getPage();
        }else if(obj.id == 'activity' && !obj.isLoading){
            this.activity.getPages();
        }else if(obj.id == 'date' && !obj.isLoading){
            this.date.getPages();
        }else if(obj.id == 'contact' && !obj.isLoading){
            this.contact.getPages();
        }else if(obj.id == 'accessory' && !obj.isLoading){
            this.accessory.getPages();
        }else if(obj.id == 'annotation' && !obj.isLoading){
            this.annotation.getPages();
        }else if(obj.id == 'organizational' && !obj.isLoading){
            this.organizational.getChild();
        }
        DetailCommon.forwarder[this.props.location.query.id] = obj.id;
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
		// window.addEventListener('resize', this.handleResize);
    };
	componentWillUnmount() {
    	// window.removeEventListener('resize', this.handleResize);
  	};
	render(){
		let {agnShipBeVo,regCapitalCurren,country} = this.state;
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{paddingTop:this.state.paddingTop,
				agnShipBeVo:agnShipBeVo,
				country:country,
				// addressList:addressList,
				// bankacctList:bankacctList,
				// bizExtNameList:bizExtNameList,
				// contactList:contactList,
				// cstmCrsetkt:cstmCrsetkt,
				// functnList:functnList,
				// tradrulePaytermList:tradrulePaytermList,
				getDetailData:this.getDetailData,
				value:this.state.value,
				regCapitalCurren:regCapitalCurren
			});
		children.props=newProps;
		console.log(this.state.curentId);
		return (
			<div className='container-body'>
				<ProductHead  getDetailData={this.getDetailData} value={this.state.agnShipBeVo}
							  curentId ={this.state.curentId}
							  id={this.state.id}  onClickLink ={this.onClickLink}
				/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						<div className={this.state.curentId == 'detail' ?"":"none"}>
							<Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
						</div>
						<div className={this.state.curentId == 'linkman' ?"":"none"}>
							<LinkMan {...newProps} linkman ={no => this.linkman = no}  />
						</div>
						<div className={this.state.curentId == 'shiporder' ?"":"none"}>
							<Shiporder {...newProps} shiporder ={no => this.shiporder = no}  />
						</div>
						<div className={this.state.curentId == 'enterprise' ?"":"none"}>
							<Enterprise {...newProps} enterprise ={no => this.enterprise = no}  />
						</div>
						<div className={this.state.curentId == 'email' ?"":"none"}>
							<Email {...newProps} email ={no => this.email = no}  />
						</div>
						<div className={this.state.curentId == 'activity' ?"":"none"}>
							<Activity {...newProps} activity ={no => this.activity = no}  />
						</div>
						<div className={this.state.curentId == 'date' ?"":"none"}>
							<Date {...newProps} date ={no => this.date = no}  />
						</div>
						<div className={this.state.curentId == 'contact' ?"":"none"}>
							<Contact {...newProps} contact ={no => this.contact = no}  />
						</div>
						<div className={this.state.curentId == 'accessory' ?"":"none"}>
							<Accessory {...newProps} accessory ={no => this.accessory = no}  />
						</div>
						<div className={this.state.curentId == 'organizational' ?"":"none"}>
                            {/*<IFrame {...newProps} src={decodeURIComponent('/organizational?id='+this.state.id)} />*/}
							<Organizational {...newProps} organizational ={no => this.organizational = no} param={{dataTyId:80}} />
						</div>
						<div className={this.state.curentId == 'annotation' ?"":"none"}>
							<Annotation {...newProps} annotation ={no => this.annotation = no}  />
						</div>
					</div>
			    </div>
			</div>
			);
	}
}
ForwarderLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default ForwarderLayout

