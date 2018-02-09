import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import {createForm,FormWrapper} from '../../../../components/Form';
import Calendar from  '../../../../components/Calendar/Calendar';
import xt from '../../../../common/xt'; // 下拉
import  SelectChange from "../../../../components/SelectChange";
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { ConstVirtualSelect,Option,ConstMiniSelect } from '../../../../components/Select'; // 下拉
import {
    apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_ERP, language, commonAjax, toDecimal,
    API_FOODING_HR
} from '../../../../services/apiCall';
import {I18n} from "../../../../lib/i18n";
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import WebData from '../../../../common/WebData';
class Addnormal extends Component{

	constructor(props){
		super(props);
		props.normalRef && props.normalRef(this);
		this.saveClick = this.saveClick.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onBack = this.onBack.bind(this);
		this.state=this.initState();
	}
	initState(){
		return {
			radioState:'',
			radioAddress:'',
			chuangArray:[],
			qiyunArray:[],
			info:[],
			getOneData: {},//this.props.getOneData,
            id:this.props.location.query.id
		}
	}
	saveClick(isclose,initAjax){
		var that = this;
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
	      		if(that.state.data.billId){
	      			value = Object.assign({},this.state.data,value);
	      		}
	      		if(this.props.id){
	      			value=Object.assign({},value,{billId:this.props.id});
	      			that.props.saveClick(value,isclose,initAjax);
	      		}else {
	      			that.props.saveClick(value,isclose,initAjax);
	      		}
			}
	      	
    	});

	}
	// 保存
	onSaveAndClose(callBack,type){
		let that = this;
		const {location,router,navReplaceTab,form, onSaveAndClose,getOneData} = that.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{

				apiPost(API_FOODING_HR,'/leave/save',Object.assign({},getOneData,value),
					(response)=>{	
						that.setState({ billId: response.data.billId},function(){
							callBack(response);

							// 页面跳转
							if( type == 'object' ) {
								Confirm(i18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5,done:()=>{
									navReplaceTab({id:13,name:i18n.t(500368/*休假单详情*/),component:i18n.t(500368/*休假单详情*/),url:'/vacationsingle/detail'});
									router.push({ pathname: '/vacationsingle/detail',query:{id:that.state.id || that.state.billId}});
								}});
							} else{
								ServiceTips({text:response.message,type:'success'});
							}

						});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});		
	}

	// 返回
	onBack() {
	
		let billId = this.props.location.query.id;
		let {getOneData} = this.props;
		if(billId){
			this.props.navReplaceTab({name:i18n.t(500368/*休假单详情*/),component:i18n.t(500368/*休假单详情*/),url:'/vacationsingle/detail'});
			this.props.router.push({pathname: '/vacationsingle/detail', query: {id: billId}});
		} else {
			this.props.navReplaceTab({name:I18n.t(500418/*休假单*/),component:I18n.t(500418/*休假单*/),url:'/vacationsingle'});
			this.props.router.push({pathname: '/vacationsingle'});
		}
	}

	render(){
        let that = this;
        let {getNFieldProps,getFieldProps,getFieldError,getFieldValue} = this.props.form;
        let {getOneData} = this.props;
        let ccLocalName = WebData.user.data.staff.company.localName;
        let ccenName  =   WebData.user.data.staff.company.enName;
        let Cid = WebData.user.data.staff.company.id;
        let clusterId = WebData.user.data.staff.cluster.id;
        let clusterEnName = WebData.user.data.staff.cluster.enName;
        let clusterLcName = WebData.user.data.staff.cluster.localName;
        let positionName = WebData.user.data.staff.organization.localName;
        let Pid = WebData.user.data.staff.organization.id;
        let stffId = WebData.user.data.staff.id;
        let stffLcname = WebData.user.data.staff.localName;
        getOneData = getOneData || {};
        getOneData.compensateType = getOneData.compensateType || {};
        let {form} = this.props;
        getFieldProps('clusterLcName', {
            validateFirst: true,
            initialValue:clusterLcName
        })
        getFieldProps('clusterEnName', {
            validateFirst: true,
            initialValue:clusterEnName
        })
        getFieldProps('clusterId', {
            validateFirst: true,
            initialValue:clusterId
        })
		return(
            <div className={'addnormal'}>
                <div className={'addnormal-title'}>
                    <span></span>
                    <span onClick={this.onBack}><i className={'foddingicon fooding-back'}></i></span>
                    <span onClick={this.props.onSaveAndClose}><i className={'foddingicon fooding-save'}></i></span>
                </div>
                <div className={'  girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(400048/*单据编号*/)}</label>
                            <input type="text"
                                   {...getNFieldProps('no',{
                                       initialValue: getOneData['no'] || '',
                                       rules: [{required:true}]
                                   })}
                                   disabled={true}
                                   className ={'col-md-8 col-lg-8 text-input-nowidth'}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(700076/*日期*/)}</label>
                            <div className={'col-md-8 col-lg-8 datetime'}>
                                <Calendar
                                    width={'100%'}
                                    showSecond={false}
                                    disabled={true}
                                    showTime = {false}
                                    isShowIcon={false}
                                    form={this.props.form}
                                    validate={true}
                                    className ={getFieldError('billDate')?'error-border':''}
                                    name={'billDate'}
                                    value={getOneData['billDate']}
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(700074/*状态*/)}</label>
                            <Select
                                {...getNFieldProps('status',{
                                    rules: [{required:true}],
                                    initialValue:getOneData.status?{s_label:getOneData.statusName,status:getOneData.status}:undefined
                                })}
                                optionLabelProp="children"
                                className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                disabled={true}
                            >

                            </Select>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
                            <ConstVirtualSelect
                                placeholder=""
                                form={this.props.form}
                                fieldName='ccId'
                                apiHost={API_FOODING_ES}
                                apiUri='/party/getLoginCompanies'
                                apiParams={{}}
                                rules={true}
                                initialValue={xt.initSelectValue(ccLocalName,{s_label:ccLocalName,ccId:Cid,ccLcName:ccLocalName,ccEnName:ccenName},['ccId','ccLcName','ccEnName'], 's_label', this.props.form)}
                                valueKeys={ da => ({

                                    ccId: da.id,
                                    ccLcName: da.localName,
                                    ccEnName: da.name,
                                    s_label: da.localName
                                })}
                                disabled={true}
                                className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100238/*部门*/)}</label>
                            <ConstVirtualSelect
                                placeholder=""
                                form={this.props.form}
                                fieldName='receiptCcId'
                                apiHost={API_FOODING_ES}
                                apiUri='/party/getLoginCompanies'
                                apiParams={{}}
                                rules={true}
                                initialValue={xt.initSelectValue(positionName,{s_label:positionName,depmntId:Pid,depmntLcName:positionName},['depmntId','depmntLcName'], 's_label', this.props.form)}
                                valueKeys={ da => ({

                                    depmntId: da.id,
                                    depmntLcName: da.localName,
                                    s_label: da.localName
                                })}
                                disabled={true}
                                reles={true}
                                className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4'}><span>*</span>{I18n.t(500365/*请假项目*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                apiUri='/vacation/getCompany'
                                apiHost={API_FOODING_HR}
                                apiParams={{ccId:Cid}}
                                fieldName="leaveType"
                                labelKey="localName"
                                valueKeys={da => ({
                                    leaveType: da.id,
                                    leaveTypeName: da.localName,
                                    s_label: da.localName
                                })}
                                rules={true}
                                initialValue={xt.initSelectValue(getOneData.leaveType,{leaveType:getOneData.leaveType,s_label:getOneData.leaveTypeName,leaveTypeName:getOneData.leaveTypeName},['leaveType','leaveTypeName'],'s_label',this.props.form)}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4'}><span>*</span>{I18n.t(100305/*开始时间*/)}</label>
                            <div className={'col-md-8 datetime'}>
                                <Calendar
                                    range={true}
                                    type="start"
                                    startName="startDate"
                                    name="startDate"
                                    endName="endDate"
                                    showTime={true}
                                    showSecond={false}
                                    width={'100%'}
                                    isShowIcon={true}
                                    form={this.props.form}
                                    value={getOneData && getOneData.startDate?[new Date(getOneData && getOneData.startDate || "").Format('yyyy-MM-dd hh:mm'),new Date(getOneData && getOneData.endDate || "").Format('yyyy-MM-dd hh:mm')]:[undefined,undefined]}
                                    validate={true}
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4'}><span>*</span>{I18n.t(100306/*结束时间*/)}</label>
                            <div className={'col-md-8 datetime'}>
                                <Calendar
                                    range={true}
                                    showSecond={false}
                                    type="end"
                                    startName="startDate"
                                    name="endDate"
                                    endName="endDate"
                                    showTime={true}
                                    width={'100%'}
                                    isShowIcon={true}
                                    form={this.props.form}
                                    value={getOneData && getOneData.endDate?[new Date(getOneData && getOneData.startDate || "").Format('yyyy-MM-dd hh:mm'),new Date(getOneData && getOneData.endDate || "").Format('yyyy-MM-dd hh:mm')]:[undefined,undefined]}
                                    validate={true}
                                />
                            </div>
                        </div>

                    </div>
                    <div className={'row'}>

                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500417/*请假人*/)}</label>
                            <ConstVirtualSelect
                                placeholder=""
                                form={this.props.form}
                                fieldName='registerId'
                                apiHost={API_FOODING_ES}
                                apiUri='/party/getLoginCompanies'
                                apiParams={{}}
                                initialValue={xt.initSelectValue(stffLcname,{s_label:stffLcname,applyId:stffId,applyLcName:stffLcname},['applyId','applyLcName'], 's_label', this.props.form)}
                                valueKeys={ da => ({

                                    applyId: da.id,
                                    applyLcName: da.localName,
                                    s_label: da.localName
                                })}
                                disabled={true}
                                className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
                        </div>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-2 col-lg-2'}><span>*</span>{I18n.t(500360/*事由*/)}</label>
                            <input type="text"
                                   {...getNFieldProps('reason',{
                                       initialValue: getOneData['reason'] || '',
                                       rules: [{required:true}]
                                   })}
                                   className={getFieldError('reason')?'col-md-10 col-lg-10 text-input-nowidth error-border':'col-md-10 col-lg-10 text-input-nowidth'}
                            />

                        </div>
                    </div>
                </div>
            </div>
		)
	}
}
const ProductForm =createForm()(Addnormal);
export default ProductForm;
