import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入select插件
import Select, {Option, ConstMiniSelect } from '../../../../components/Select';
import Radio from "../../../../components/Radio";
import {I18n} from '../../../../lib/i18n';
//引入table
const {Table} = require("../../../../components/Table");
import xt from '../../../../common/xt';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES ,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
		let that = this;
		this.columns_party = [{
			title : I18n.t(400025/*仓库*/),
			dataIndex : "slLcName",
			key : "slLcName",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : I18n.t(400026/*库区*/),
			dataIndex : 'stLcName',
			key : "stLcName",
			width : '12%',
			render(data,row,index){
				return (<div className="text-ellipsis" >{data}</div>)
			}
		},{
			title : I18n.t(400027/*储位*/),
			dataIndex : "slspLcName",
			key : "slspLcName",
			width : "12%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(400012/*品牌*/),
			dataIndex : "brandLcName",
			key : "brandLcName",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis" >{data}</div>)
			}
		},{
			title : I18n.t(400028/*原供应商*/),
			dataIndex : "vndBeLcName",
			key : "vndBeLcName",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis" style={{width:'80px'}}>{data}</div>)
			}
		},{
			title : I18n.t(400029/*过期日期*/),
			dataIndex : "shelfEdate",
			key : "shelfEdate",
			width : "14%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : I18n.t(400030/*物料状态*/),
			dataIndex : "mStatsLcName",
			key : "mStatsLcName",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(400031/*库存数量*/),
			dataIndex : "baseQty",
			key : "baseQty",
			width : "12%",
			render(data,row,index){
				return (<div>{data}</div>);
			}
		},{
			title : I18n.t(400032/*出存数量*/),
			dataIndex : "outstock",
			key : "outstock",
			width : "12%",
			ignore_equals: true,
			render(data,row,index){
				return data;
			}
		}];
	}

	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func
	}
	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}
	initState(){
		return {
			initData:{},
			lockData:[],
			eqBasnum:1
		}
	}
	componentDidMount(){
		let {initData} = this.props;
		let eqBasnum = initData.eqBasnum || 1;
		this.setState({eqBasnum})
	}
	componentWillReceiveProps(nextProps){
		let eqBasnum = nextProps.initData && nextProps.initData.eqBasnum;
		if(!eqBasnum) return false;
		if(this.props.initData.eqBasnum != eqBasnum){
			this.setState({eqBasnum})
		}
	}
	//仓库的点击事件 拉取列表数据
	onStorLocatnClick = (data) => {
		let that = this;
		let slId = data && data.receSlId || undefined;
		if(!slId){
			that.setState({lockData:[]});
			return false;
		}
		const {initData} = that.props;
		apiGet(API_FOODING_ERP,"/stock/getPage",{slId:slId,mtlId:initData.mtlId,current:1,pageSize:1,inventory:1,isPagable:false,lockingNo:-1},response => {
			that.setState({lockData:response.data.data})
		},error => {
			ServiceTips({text:error.message,type:'error'})
		})
	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose,initData} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				let stockoptout = value.outstock,stockoptoutCount = 0,stockoptoutF = [];
				let reg = new RegExp(/^\d+(\.\d+)?$/);
				//判断stockoptout 数组是不是有数据
				let call = obj => {
					stockoptoutF.push(obj);
				}
				for(var i = 0; i < stockoptout.length; i++){
					if(!!stockoptout[i].nums && reg.test(Number(stockoptout[i].nums))){
						call(stockoptout[i])
					}
					stockoptoutCount += Number(stockoptout[i].nums || 0);
				}
				//所有数据加在一起，必须要小于产品数量
				if(stockoptoutCount > initData.purQty){
					ServiceTips({text:I18n.t(400033/*出库数量总和不能大于产品数量*/),type:'error'})
					return false;
				}
				let valueone = Object.assign({},initData,value,{lockQty:stockoptoutCount,outstock:stockoptoutF});
				apiPost(API_FOODING_ERP,"/purorder/lock",valueone,response => {
					ServiceTips({text:response.message,type:"success"});
					onSaveAndClose();
				},error => ServiceTips({text:error.message,type:"error"}))
			}
		})
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	render(){
		const {form,initData} = this.props;
		const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let array = [];
		getFieldProps('eqBasnum', {
							            	validateFirst: true,
						                    initialValue:initData?initData.eqBasnum:''
			})
			// for(var i= 0 ;i< this.state.lockData.length;i++){
			// 	//let obj = Object.assign({},this.state.lockData[i]);
			// 	//obj.baseQty = obj.baseQty;
			// 	getFieldProps('outstock['+i+'].id', {
			// 			                    initialValue: this.state.lockData[i].id,
			// 	})
			// 	let obj = Object.assign({},this.state.lockData[i],{outstock:
			// 	<input type="text" style={{width:'100%'}} className={getFieldError('outstock[' + i + '].nums')?"error-border":''}
			// 		{...getFieldProps('outstock['+i+'].nums',{
			// 			 rules: [{required: false}, validate],
			// 													initialValue:''
			// 		})}
			// 		/>});
			// 	array.push(obj);
			// }
			let chukuarray = this.state.lockData;
			for (let i = 0; i < chukuarray.length; i++) {
	            let obj = Object.assign({}, chukuarray[i]);
	            //^([0-3](\.\d+)?|4)$
	            //验证0 - 4 的数字 [0.0, 4.0] 包含销售
	            obj.baseQty = obj.baseQty / initData.eqBasnum;

	            let validate = (rule, value, callback) => {
	            	if(value.trim() === '') return callback([])
	                if(parseFloat(value) <= obj.baseQty && obj.baseQty > 0){
	                    callback([]);
	                } else callback([I18n.t(400102/*数量不能大于*/) + obj.baseQty]);
	            };
	            obj.outstock = <div key={i}>
	                <span hidden {... getNFieldProps('outstock[' + i + '].id', { initialValue: obj.id,  })} />
	                <input style={{width: 60}} className={getFieldError('outstock[' + i + '].nums')?"error-border":''}
	                       {...getFieldProps('outstock[' + i + '].nums', {
	                           validateFirst: true,
	                           rules: [{required: false}, validate],
	                           initialValue: '',
                               key: obj.id
	                       })}
	                />
	            </div>;
	            array.push(obj);
	        }
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
				<div className={'girdlayout'} style={{height:"344px"}}>
					<div className={'row'}>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100379/*产品*/)}</label>
	                        <ConstMiniSelect form={this.props.form}
	                        	disabled={true}
	        					 pbj={{
									apiType:apiGet,
									 host:API_FOODING_DS,
									 uri: '/beMtl/getList',
									 params:{}
								}}
								 fieldName={'mtlId'}
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                     mtlId: da.id,
		                                 mtlLcName: da.localName,
		                                 mtlEnName: da.name,
		                                 s_label: da.localName
	                                }}>{da.localName}</Option>} reles={true}
	                             initialValue={xt.initSelectValue(initData.mtlId, initData, ['mtlId', 'mtlLcName', 'mtlEnName'], 'mtlLcName', this.props.form)}
	                             className ={getFieldError('uomId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(400034/*产品数量*/)}</label>
							<input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
								placeholder=""  disabled
								{...getNFieldProps('purQty',{
									initialValue:initData.purQty?initData.purQty:""
								})} />
						</div>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(400035/*产品单位*/)}</label>
							<ConstMiniSelect form={this.props.form} disabled={true}
	        					 pbj={{
									apiType:apiGet,
									 host:API_FOODING_DS,
									 uri: '/measum/getList',
									 params:{sourceId:getFieldValue("mtlId",{}).mtlId}
								}}
								 fieldName={'uomId'}
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                  uomId: da.unitofmea?da.unitofmea.id:'',
	                                 uomLcName: da.unitofmea?da.unitofmea.localName:'',
	                                 uomEnName: da.unitofmea?da.unitofmea.name:'',
	                                 s_label: da.unitofmea?da.unitofmea.localName:'',
	                             }}>{da.unitofmea?da.unitofmea.localName:''}</Option>} reles={true}
	                             initialValue={xt.initSelectValue(initData.uomId, initData, ['uomId', 'uomLcName', 'uomEnName'], 'uomLcName', this.props.form)}
	                             className ={getFieldError('uomId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(400036/*采购组织*/)}</label>
	                        <ConstMiniSelect form={this.props.form}
								 pbj={{
									apiType:apiGet,
									 host:API_FOODING_ES,
									 uri: '/party/getPartysByType',
									 params:{typeAttributeIds:["42"],partyId: initData && initData.ccId?initData.ccId:''}
								}} fieldName="porId"
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                 porId: da.id,
	                                 porLcName: da.localName,
	                                 porEnName: da.name,
	                                 s_label: da.localName
	                             }}>{da.localName}</Option>} reles={true}
	                             initialValue={undefined}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(400037/*采购员*/)}</label>
							<ConstMiniSelect form={this.props.form}
								isRequest={Boolean(getFieldValue("porId", {initData}).porId)}
								refreshMark={getFieldValue("porId", {initData}).porId}
								 pbj={{
									apiType:apiGet,
									 host:API_FOODING_ES,
									 uri: '/user/getListForPermissionsInParty',
									 params:{typeAttributeIds:605,partyId:getFieldValue("porId", initData).porId}
								}} fieldName="purStaffId"
		                             initValueOptions={[]}
		                             optionValue={da => <Option key={da.refId} objValue={{
		                                 purStaffId: da.refId,
		                                 purStaffLcName: da.staffLocalName,
		                                 purStaffEnName: da.staffEnName,
		                                 s_label: da.staffLocalName
		                             }}>{da.staffLocalName}</Option>} reles={true}
		                             initialValue={undefined}
		                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(400038/*送达仓库*/)}</label>
							<ConstMiniSelect form={this.props.form}
            					pbj='com.fooding.fc.ds.entity.StorLocatn'
								 fieldName="receSlId"
	                             initValueOptions={[]}
	                             onChange = {this.onStorLocatnClick}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                  receSlId: da.id,
	                                 receSlLcName: da.localName,
	                                 receSlEnName: da.name,
	                                 s_label: da.localName
	                             }} >{da.localName}</Option>} reles={true}
	                             initialValue={{undefined}}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
					</div>
					<Table
						columns={this.columns_party}
						data={array}
						checkboxConfig={{show:false}}
						colorFilterConfig={{show:false}}
						followConfig={{show:false}}
						// prefixCls={"rc-confirm-table"}
						scroll={{x:false, y:210}}
					/>
				</div>
			</FormWrapper>);
	}
}

const LockLibrary = createForm()(CommonForm);

export default LockLibrary;

