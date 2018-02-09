import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import ProductHead from '../../routes/servBe/Detail/Header/FWetailsHead';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../services/apiCall";

import DetailCommon from  '../../common/DetailCommon';
import Detail from  '../../routes/servBe/Detail/Content/components/ServBeDetail';
import LinkMan from  '../../routes/servBe/Linkman/components/Linkman';
import Email from  '../../routes/servBe/Email/components/Email';
import Date  from  '../../routes/servBe/Date/components/ServbeDate';
import Contact from  '../../routes/servBe/Contact/components/ServbeContact';
import Accessory from  '../../routes/servBe/Accessory/components/Accessory';
import Annotation from  '../../routes/servBe/Annotation/components/Annotation';
export class ServbeLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
            country:{},
			servBeVo:{
                id:'', //ID,
                code:'', //代码,
                name:'', //服务机构名称,
                enName:'', //英文名称,
                taxIdenSN:'', //税号,
                leglpsn:'', // 法人,
                regCapital:'', // 注册资本,
                estabDate:'' , //成立时间,
                cluster:'', // 集团,
                company:'', // 公司,
                country:'', // 国家,
                createDate:'', // 创建时间,
                updateDate:'', // 更新时间,
                rowSts: '', // 状态
                description:'',//描述
                beDataMulDivIdsMap:[],
                web:'',
                entContact:'',//主要联系人
                email:'' //邮箱

            },
            id:this.props.location.query.id,
            value:{},
            regCapitalCurren:{},
            isDetail:false,
            curentId: DetailCommon.servbe[this.props.location.query.id] || this.props.location.query.index || 'detail',

		};
		this.getDetailData =this.getDetailData.bind(this);
		this.handleResize=this.handleResize.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
    }

    getDetailData(obj){
  		let {servBeVo,tradrulePaytermList,regCapitalCurren}  = this.state;
        apiGet(API_FOODING_DS,"/servBe/getDetail",{id:this.state.id}, (response) => {
            let {servBeVo,regCapitalCurren,country}  = response.data; 
            this.setState({
                value:response.data,
                servBeVo:servBeVo,
                country:country,
                //addressList:addressList,
                //bankacctList:bankacctList,
                //contactList:contactList,
                //dataExtDivsnList:dataExtDivsnList,
                //functnList:functnList,
                //partnerList:partnerList,
                //tradrulePaytermList:tradrulePaytermList,
                regCapitalCurren:regCapitalCurren
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
        }else if(obj.id == 'linkman' && !obj.isLoading){
            this.linkman.getPage();
        }else if(obj.id == 'email' && !obj.isLoading){
            this.email.getPage();
        }else if(obj.id == 'date' && !obj.isLoading){
            this.date.getPage();
        }else if(obj.id == 'contact' && !obj.isLoading){
            this.contact.getPage();
        }else if(obj.id == 'accessory' && !obj.isLoading){
            this.accessory.getPage();
        }else if(obj.id == 'annotation' && !obj.isLoading){
            this.annotation.getPage();
        }
        DetailCommon.servbe[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
    }
	handleResize(){
		let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
	};
	componentDidMount(){
        let sch=document.body.offsetHeight-this.state.paddingTop;
        this.getDetailData(true);
		this.setState({scrollHeight:sch+'px'});
		// window.addEventListener('resize', this.handleResize);
    };
	componentWillUnmount() {
    	// window.removeEventListener('resize', this.handleResize);
  	};
	render(){
        let {servBeVo,regCapitalCurren,country} = this.state;
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{
            paddingTop:this.state.paddingTop,
            getDetailData:this.getDetailData,
            servBeVo:servBeVo,
            country:country,
            //tradrulePaytermList:tradrulePaytermList,
            value:this.state.value,
            regCapitalCurren:regCapitalCurren
            });
		children.props=newProps;
		return (

			<div className='container-body'>
				<ProductHead value={servBeVo}  curentId ={this.state.curentId}
                             id={this.state.id}  onClickLink ={this.onClickLink}/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
                        <div className={this.state.curentId == 'detail' ?"":"none"}>
                            <Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
                        </div>
                        <div className={this.state.curentId == 'linkman' ?"":"none"}>
                            <LinkMan {...newProps} linkman ={no => this.linkman = no} isDetail ={true} />
                        </div>
                        <div className={this.state.curentId == 'email' ?"":"none"}>
                            <Email {...newProps} email ={no => this.email = no} isDetail ={true} />
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
					</div>
			    </div>
			</div>
			);
	}
}
ServbeLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default ServbeLayout

