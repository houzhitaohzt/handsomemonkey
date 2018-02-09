import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../../components/Form";
import { Router, Route, IndexRoute, hashHistory ,Link} from 'react-router';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
//引入select插件
import Select, { Option } from '../../../../../components/Select';
import {addUpdateRecord,addUpdateJson} from '../../../../../services/client/call';
import {I18n} from '../../../../../lib/i18n';

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES ,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';

const RouteArr = {
	/*
		405:付款申请，
		222：入库通知单，
		223：出库通知单
	*/
	"405":{pathname:"/paymentApplication/detail",title:I18n.t(400040/*付款申请*/) + I18n.t(100097/*详情*/)},
	"222":{pathname:"/stockin/detail",title:I18n.t(400041/*入库通知单*/) + I18n.t(100097/*详情*/)},
	"223":{pathname:"/stockout/detail",title:I18n.t(400042/*出库通知单*/) + I18n.t(100097/*详情*/)},
	"338":{pathname:"/purstock",title:"采购锁库"}
}

class AdjustDialog extends Component{
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
			onSaveCloseBoolean:true //如果有有入库通知单和出库通知单时，保存按钮不能点击的
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
	};
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		onSaveAndClose && onSaveAndClose();
	}

	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	LinkClick = (billType,billId,no) => {
        let { navAddTab, navRemoveTab } = this.props;
		if(billType == 338){
            navRemoveTab({name:RouteArr[billType].title,component:RouteArr[billType].title,url:RouteArr[billType].pathname});
            navAddTab({name:'RouteArr[billType].title',component:RouteArr[billType].title,url:RouteArr[billType].pathname});
            this.props.router.push({pathname:RouteArr[billType].pathname,query:{searchField:"no=" + no}, state: {refresh: true}});
		}else{
            navRemoveTab({name:RouteArr[billType].title,component:RouteArr[billType].title,url:RouteArr[billType].pathname});
            navAddTab({name:'RouteArr[billType].title',component:RouteArr[billType].title,url:RouteArr[billType].pathname});
            this.props.router.push({pathname:RouteArr[billType].pathname,query:{id:billId}, state: {refresh: true}});
		}
	};
	componentDidMount(){
		let billId = this.props.purId;
		if(!billId) return;
		this.initObj(billId);
}
	componentWillReceiveProps(nextProps){
		if(this.props.purId && this.props.purId !== nextProps.purId){
			this.setState({valueone:[]},() =>this.initObj(nextProps.purId));
		}
  	}

  	//点击刷新按钮时候，进行刷新
  	onFreshClick = () =>　{
  		let billId = this.props.purId;
		if(!billId) return;
		this.initObj(billId);
  	};
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
		const {form} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let valueone = this.state.valueone;
		let isonSaveCloseBoolean = this.isBoolean();
		let singleDom = this.state.valueone.map((e,i) => {
			return (<div key = {i} className={'row'}>
					<div className="form-group col-md-3 col-lg-3">
						<label className={'col-md-4 col-lg-4'}>{I18n.t(400047/*单据类型*/)}</label>	
                       	<div className={'col-md-8 col-lg-8'}>
                       		<p className={'paragraph shengyue'}>{e.billTypeName || ""}</p>
                       	</div>			                            
					</div>
					<div className="form-group col-md-3 col-lg-3">
						<label className={'col-md-4 col-lg-4'}>{I18n.t(400048/*单据编号*/)}</label>
						<div className={'col-md-8 col-lg-8'}>
                       		<p className={'paragraph shengyue'}>{e.no || ""}</p>
                       	</div>		                            
					</div>
					<div className="form-group col-md-3 col-lg-3">
						<label className={'col-md-4 col-lg-4'}>{I18n.t(400049/*业务状态*/)}</label>
						<div className={'col-md-8 col-lg-8'}>
                       		<p className={'paragraph shengyue'}>{e.statusName || ""}</p>
                       	</div>		                            
					</div>
					<div className="form-group col-md-3 col-lg-3">
						<label><a href="javascript:;" onClick={this.LinkClick.bind(this,e.billType,e.billId,e.no)} className={'link-route'}>{I18n.t(400044/*进入页面*/)}</a></label>
					</div>
				</div>)
		})
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} onSaveCloseBoolean={isonSaveCloseBoolean}>
					<div className={'  girdlayout scoll'} style={{height:"334px"}}>
						<div className={'row'}>
							<div className="form-group col-md-9 col-lg-9">	
		                       	<div className={'col-md-12 col-lg-12'}>
									   <p className={'paragraph'}>{I18n.t(400043/*请点击下面*/)}<span style={{fontWeight:"bold",color:"blue"}}>&nbsp;&nbsp;{I18n.t(400044/*进入页面*/)}&nbsp;&nbsp;</span>{I18n.t(400045/*链接,进入页面进行数据调整,再返回页面进行*/)}{I18n.t(400046/*刷新*/)}</p>
		                       	</div>			                            
							</div>
							<div className="form-group col-md-1 col-lg-1">	
								   <label onClick={this.onFreshClick} style={{cursor:"pointer"}}><i className={"foddingicon fooding-update"} title={I18n.t(400046/*刷新*/)}></i>&nbsp;&nbsp;{I18n.t(400046/*刷新*/)}&nbsp;&nbsp;</label>			                            
							</div>
						</div>
						{singleDom}
					</div>						
			</FormWrapper>);
	}
}

AdjustDialog = createForm()(AdjustDialog);

export default NavConnect(AdjustDialog);

