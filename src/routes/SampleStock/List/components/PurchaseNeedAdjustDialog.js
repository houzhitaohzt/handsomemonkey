import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
import { Router, Route, IndexRoute, hashHistory ,Link} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
//引入select插件
import Select, { Option } from '../../../../components/Select';
import {I18n} from '../../../../lib/i18n';

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES ,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

const RouteArr = {
	/*
		405:付款申请，
		222：入库通知单，
		223：出库通知单
	*/
	"405":{pathname:"/paymentApplication/detail",title:I18n.t(400040/*付款申请*/) + I18n.t(100097/*详情*/)},
	"222":{pathname:"/stockin/detail",title:I18n.t(400041/*入库通知单*/) + I18n.t(100097/*详情*/)},
	"223":{pathname:"/stockout/detail",titlel:I18n.t(400042/*出库通知单*/) + I18n.t(100097/*详情*/)}
}

class PurchaseNeedAdjustDialog extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
	}

	static propTypes={
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func
	}

	initState(){
		return {
			valueone:[],
			onSaveCloseBoolean:true, //如果有有入库通知单和出库通知单时，保存按钮不能点击的
			billId:""
		}
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}
	//初始化数据
	initObj = billId => {
		if(!billId) return;
		apiGet(API_FOODING_ERP,'/purorder/getReferBills',{billId:billId},response => {
			let valueone = response.data;
			this.setState({valueone})
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	//选择单据编号时，进行请求
	onNoClick = data => {
		if(data.trim() == ""){
			this.setState({valueone:[],billId:""});
		}else{
			this.setState({billId:data},() =>this.initObj(data));
		}
	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		onSaveAndClose && onSaveAndClose(this.state.billId);
	}

	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	LinkClick = (billType,billId) => {
		console.log(RouteArr[billType].pathname);
		let { navAddTab, navRemoveTab } = this.props;
		navRemoveTab({name:RouteArr[billType].title,component:RouteArr[billType].title,url:RouteArr[billType].pathname});
		navAddTab({name:'RouteArr[billType].title',component:RouteArr[billType].title,url:RouteArr[billType].pathname});
		this.props.router.push({pathname:RouteArr[billType].pathname,query:{id:billId}, state: {refresh: true}});
	}
	componentDidMount(){
		/*let billId = this.props.billId;*/
	}
	componentWillReceiveProps(nextProps){
		if(this.props.billId && this.props.billId !== nextProps.billId){
			this.setState({valueone:[],billId:""})
		}
  	}

  	//点击刷新按钮时候，进行刷新
  	onFreshClick = () =>　{
  		let billId = this.state.billId;
		if(!billId) return;
		this.initObj(billId);
  	}
  	isBoolean = () => {
  		let bol = false,valueone = this.state.valueone;
  		for(let i = 0; i< valueone.length; i++){
  			if(valueone[i] && valueone[i].billType == 222 || valueone[i].billType == 223 ){
  				bol = true;
  				break;
  			}
  		}
  		return bol;
  	}
	render(){
		const {form,obj,billId,dataArr} = this.props;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let valueone = this.state.valueone;
		let isonSaveCloseBoolean = this.isBoolean();
		let tipDom = <span></span>;
		if(this.state.valueone.length){
			tipDom = (<div className={'row'}>
							<div className="form-group col-md-9 col-lg-9">
							<label className={'col-md-1 col-lg-1'}></label>
		                       	<div className={'col-md-11 col-lg-11'}>
									   <p className={'paragraph'}>{I18n.t(400043/*请点击下面*/)}<span style={{fontWeight:"bold",color:"blue"}}>&nbsp;&nbsp;{I18n.t(400044/*进入页面*/)}&nbsp;&nbsp;</span>{I18n.t(400045/*链接,进入页面进行数据调整,再返回页面进行*/)}{I18n.t(400046/*刷新*/)}</p>
		                       	</div>
							</div>
							<div className="form-group col-md-1 col-lg-1">
								   <label onClick={this.onFreshClick} style={{cursor:"pointer"}}><i className={"foddingicon fooding-update"} title={I18n.t(400046/*刷新*/)}></i>&nbsp;&nbsp;{I18n.t(400046/*刷新*/)}&nbsp;&nbsp;</label>
							</div>
						</div>)
		}
		let singleDom = this.state.valueone.map((e,i) => {
			return (<div key = {i} className={'row'}>
					<div className="form-group col-md-3 col-lg-3">
						<label className={'col-md-4 col-lg-4'}>{I18n.t(400047/*单据类型*/)}</label>
                       	<div className={'col-md-8 col-lg-8'}>
                       		<p  >{e.billTypeName || ""}</p>
                       	</div>
					</div>
					<div className="form-group col-md-3 col-lg-3">
						<label className={'col-md-4 col-lg-4'}>{I18n.t(400048/*单据编号*/)}</label>
						<div className={'col-md-8 col-lg-8'}>
                       		<p  >{e.no || ""}</p>
                       	</div>
					</div>
					<div className="form-group col-md-3 col-lg-3">
						<label className={'col-md-4 col-lg-4'}>{I18n.t(400048/*单据编号*/)}</label>
						<div className={'col-md-8 col-lg-8'}>
                       		<p  >{e.statusName || ""}</p>
                       	</div>
					</div>
					<div className="form-group col-md-3 col-lg-3">
						<label><a href="javascript:;" onClick={this.LinkClick.bind(this,e.billType,e.billId)} className={'link-route'}>{i18n.t(400044/*进入页面*/)}</a></label>
					</div>
				</div>)
		})
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} onSaveCloseBoolean={isonSaveCloseBoolean}>
					<div className={'  girdlayout scoll'} style={{height:"334px"}}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(400008/*销售单号*/)}</label>
		                       	<div className={'col-md-8 col-lg-8'}>
		                       		<p  >{obj.sourceNo || ""}</p>
		                       	</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100379/*产品*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
		                       		<p >{obj.mtlLcName || ""}</p>
		                       	</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(400050/*调整数量*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
		                       		<p  >{obj.purQty || ""} {obj.uomEnName || ""}</p>
		                       	</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(400048/*单据编号*/)}</label>
								<Select
									animation='slide-up'
									placeholder={''}
									className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
									{...getNFieldProps('billId',{
										initialValue:""
									})}
									onSelect={this.onNoClick}
								>
									<Option key={0} value={""} title={""}>{""}</Option>
								{
									dataArr.map((e,i) => {
										return <Option key={e.billId} objValue={{id:String(e.billId),orderTypeName:e.orderTypeName,s_label:e.no}} title={e.no}>{e.no}</Option>
									})
								}
								</Select>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500097/*订单类型*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
		                       		<p  >{form.getFieldValue('billId',{}).orderTypeName || ""}</p>
		                       	</div>
							</div>
						</div>
						{tipDom}
						{singleDom}
					</div>
			</FormWrapper>);
	}
}

PurchaseNeedAdjustDialog = createForm()(PurchaseNeedAdjustDialog);

export default NavConnect(PurchaseNeedAdjustDialog);
