import React, { Component } from 'react';
import OnlyreadyRuleTemplate from  '../../../../components/OnlyreadyRuleTemplate';
import DetailNormal from "./DetailNormal";
import ContDateDetailOrganization from "./ContDateDetailOrganization";
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_OA,language,pageSize,sizeList} from '../../../../services/apiCall';

import {I18n} from "../../../../lib/i18n";

let salBeArr = {
	'10': I18n.t(100311/*客户*/),
	'20': I18n.t(100312/*供应商*/),
	'30': I18n.t(100313/*服务机构*/),
	'40':  I18n.t(100311/*客户*/),
	'50': I18n.t(100311/*客户*/),
	'60': I18n.t(100311/*客户*/),
	'70': I18n.t(100312/*供应商*/),
	'80': I18n.t(100299/*货代公司*/),
	'90':  I18n.t(100299/*货代公司*/),
	'100': I18n.t(100312/*供应商*/),
	'110': I18n.t(100313/*服务机构*/),
	'120': I18n.t(100311/*客户*/),
	'130': I18n.t(100299/*货代公司*/),
	'140': I18n.t(100311/*客户*/)
}

export  class  contDateDetail extends Component{
	constructor(props){
		super(props);
		this.state={
			commonData:{}, //对象
			businessMtlList:[], //产品列表
			scheduleId:this.props.location.query.scheduleId || "" 
		}
	}
	editClick = () => {
		let that = this;
		let {navAddTab,navReplaceTab} = that.props;
		let oldQuery = this.props.location.query;
		navReplaceTab({name:I18n.t(100439/*编辑*/) + I18n.t(100587/*约会*/),component:I18n.t(100439/*编辑*/) + I18n.t(100587/*约会*/),url:'/cdateerp/edit'});
		that.props.router.push({pathname:'/cdateerp/edit',query:oldQuery, state: {refresh: true}});
	}
	backClick = () => {
		let that = this;
		let {navAddTab,navReplaceTab} = that.props;
		let oldQuery = this.props.location.query;
		navReplaceTab({name:I18n.t(100439/*编辑*/) + I18n.t(100587/*约会*/),component:I18n.t(100439/*编辑*/) + I18n.t(100587/*约会*/),url:'/cdateerp/edit'});
		that.props.router.push({pathname:'/cdateerp/edit',query:oldQuery, state: {refresh: false}});
	}
	initDetailData = scheduleId =>{
		let that = this;
		let schedule = {};
		schedule.id = scheduleId;
		apiGet(API_FOODING_OA,'/activity/getOne',{id:scheduleId},(response)=>{
			that.setState({
				commonData:response.data
			})
		},(error)=>{
			ServiceTips({text:error.message,type:'error'});
		})

		apiGet(API_FOODING_OA,"/activity/businessMtl/getList",{activityId:scheduleId},response => {
			that.setState({businessMtlList:response.data || [] })
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = 80;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;

		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
		this.initDetailData(this.state.scheduleId)
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));

		if(nextProps.location.query.scheduleId && this.state.scheduleId !== nextProps.location.query.scheduleId){
			this.setState({scheduleId:nextProps.location.query.scheduleId},() => this.initDetailData(nextProps.location.query.scheduleId))
		}
  	}
	render(){
		let typeNumber = this.props.location.query.typeNumber;
		return (
			<div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
				<DetailNormal
					editClick={this.editClick}
					backClick={this.backClick}
					commonData={this.state.commonData}
					Label = {salBeArr[this.props.location.query.typeNumber]}
					activityType={this.props.location.query.activityType}
				 />
				 {
					 (typeNumber == 30 ||typeNumber == 80 || typeNumber == 90 || typeNumber == 110 || typeNumber == 130)?"":
				 
				  <OnlyreadyRuleTemplate  title ={I18n.t(100379/*产品*/)} 
	                id={'client-bussiness-activity'}
	                showHeader ={true}
	                columns ={
                    	[{
							title : I18n.t(100379/*产品*/),
							dataIndex : 'mtl'+language,
							key : "mtl",
							width : '18%',
							render(data,row,index){
								return (<div title={data}>{data}</div>)
							}
						},{
							title : I18n.t(100382/*产品规格*/),
							dataIndex : "basSpeci",
							key : "basSpeci",
							width : "25%",
							render(data,row,index){
								return data;
							}
						},{
							title : I18n.t(100422/*利润类型*/),
							dataIndex : "profType",
							key : "profType",
							width : "15%",
							render(data,row,index){
								if(data == 10){
										return (<div>{row.profTypeName}&nbsp;&nbsp;&nbsp;&nbsp;{row.profRate + "%"}</div>);
									}else if(data == 20){
										return (<div>{row.profTypeName}&nbsp;&nbsp;&nbsp;&nbsp;{row.ehProf}</div>);
									}else {
										return "";
									}
							}
						},{
							title : I18n.t(100319/*采购数量*/),
							dataIndex : "needQty",
							key : "needQty",
							width : "15%",
							render(data,row,index){
								return (<div>{data}&nbsp;&nbsp;{row.uomLcName || ""}</div>)
							}
						},{
							title : I18n.t(100320/*销售指导价*/),
							dataIndex : 'fobSalePrc',
							key : "fobSalePrc",
							width : "15%",
							render(data,row ,index){
								return (<div>{data}&nbsp;&nbsp;{row.cnyLcName || ""}</div>);
							}
						}]
                    }
	                data={this.state.businessMtlList}
	            />}
				 <ContDateDetailOrganization commonData={this.state.commonData} />
			</div>
		);
	}

}

export default NavConnect(contDateDetail);

