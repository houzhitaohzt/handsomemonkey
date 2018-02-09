import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import {createForm,FormWrapper} from '../../../../components/Form';
import Calendar from  '../../../../components/Calendar/Calendar';
import xt from '../../../../common/xt'; // 下拉
import  SelectChange from "../../../../components/SelectChange";
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { ConstVirtualSelect,Option,ConstMiniSelect } from '../../../../components/Select'; // 下拉
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,toDecimal,API_FOODING_HR} from '../../../../services/apiCall';
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

		}
	}


	componentDidMount(){

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
			debugger
		let that = this;
		const {location,router,navReplaceTab,form, onSaveAndClose,getOneData} = that.props;
	
		form.validateFields((errors, value) => {
			if(errors){
			}else{

				apiPost(API_FOODING_HR,'/erasure/save',Object.assign({},getOneData,value),
					(response)=>{	
						that.setState({ billId: response.data.billId},function(){
							callBack(response);

							// 页面跳转
							if( type == 'object' ) {
								Confirm(i18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5,done:()=>{
									navReplaceTab({id:13,name:I18n.t(500407/*销假单详情*/),component:I18n.t(500407/*销假单详情*/),url:'/pinfakesingle/detail'});
									router.push({ pathname: '/pinfakesingle/detail',query:{id:location.query['id'] || that.state['billId']}});
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
			this.props.navReplaceTab({name:I18n.t(500407/*销假单详情*/),component:I18n.t(500407/*销假单详情*/),url:'/pinfakesingle/detail'});
			this.props.router.push({pathname: '/pinfakesingle/detail', query: {id: billId,billType:getOneData['billType']}});
		} else {
			this.props.navReplaceTab({name:I18n.t(500424/*销假单*/),component:I18n.t(500424/*销假单*/),url:'/pinfakesingle'});
			this.props.router.push({pathname: '/pinfakesingle'});
		}
	}

	render(){
		let that = this;
		let {getNFieldProps,getFieldProps,getFieldError,getFieldValue} = this.props.form;
		let {getOneData} = this.props;
        let ccLocalName = WebData.user.data.staff.company.localName;
        let ccenName  =   WebData.user.data.staff.company.enName;
        let Cid = WebData.user.data.staff.company.id;
        let positionName = WebData.user.data.staff.positn.depmntName;
        let Pid = WebData.user.data.staff.positn.depmntId;
        let clusterLocalName = WebData.user.data.staff.cluster.localName;
        let clusterenName  =   WebData.user.data.staff.cluster.enName;
        let clusId = WebData.user.data.staff.clusId;
        let stffId = WebData.user.data.staff.id;
        let stffLcname = WebData.user.data.staff.localName;
        let {form} = this.props;
		return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span></span>
					<span onClick={this.onBack}><i className={'foddingicon fooding-back'}></i></span>
					<span onClick={this.props.onSaveAndClose}><i className={'foddingicon fooding-save'}></i></span>
				</div>
				<div className={'girdlayout'}>
					<div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100243/*集团*/)}</label>
                            <ConstVirtualSelect
                                        form={this.props.form}
                                        apiHost={API_FOODING_ES}
                                        apiUri="/party/getLoginClusters"
                                        fieldName="clusterId"
                                        initialValue={xt.initSelectValue(getOneData.clusterId, {s_label:getOneData.clusterLcName,clusterId:getOneData.clusterId, clusterLcName:getOneData.clusterLcName, clusterEnName:getOneData.clusterEnName}, ['clusterId', 'clusterLcName', 'clusterEnName'], 's_label', this.props.form)}
                                        valueKeys={da => ({
                                            clusterId: da.id,
                                            clusterLcName:da.localName,
                                            clusterEnName:da.name,
                                            s_label: da.localName
                                        })} disabled={true}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                apiUri="/party/getLoginCompanies"
                                apiHost={API_FOODING_ES}
                                apiParams={{clusId:getFieldValue('clusterId',getOneData).clusterId}}
                                fieldName="ccId"
                                initialValue={xt.initSelectValue(getOneData.ccId,{s_label:getOneData.ccLcName,ccId:getOneData.ccId, ccLcName:getOneData.ccLcName, ccEnName:getOneData.ccEnName},['ccId','ccLcName','ccEnName'], 's_label',  this.props.form)}
                                valueKeys={da => ({
                                    ccId: da.id,
                                    ccLcName: da.localName,
                                    ccEnName: da.name,
                                    s_label: da.localName
                                })} rules
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(500374/*销假单号*/)}</label>
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
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500376/*请假单号*/)}</label>
                            <input type="text"
                                   {...getNFieldProps('leaveNo',{
                                       initialValue: getOneData['leaveNo'] || '',
                                       rules: [{required:true}]
                                   })}
                                   disabled={true}
                                   className ={'col-md-8 col-lg-8 text-input-nowidth'}
                            />
                        </div>
					</div>
					<div className={'row'}>
                       <div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}><span>*</span>{i18n.t(500426/*请假日期*/)}</label>
                           <Calendar
                               width={'100%'}
                               disabled={true}
                               showTime = {true}
                               isShowIcon={false}
                               form={this.props.form}
                               validate={true}
                               name={'leaveStartDate'}
                               value={getOneData['leaveStartDate']}
                           />
                           &nbsp;&nbsp;-&nbsp;&nbsp;
                           <Calendar
                               width={'100%'}
                               disabled={true}
                               showTime = {true}
                               isShowIcon={false}
                               form={this.props.form}
                               validate={true}
                               name={'leaveEndDate'}
                               value={getOneData['leaveEndDate']}
                           />
						</div>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-2 col-lg-2'}><span>*</span>{i18n.t(500384/*销假日期*/)}</label>
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
                            &nbsp;&nbsp;-&nbsp;&nbsp;
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
					<div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(500375/*员工名称*/)}</label>
                            <Select
                                {...getNFieldProps('applyId',{
                                    initialValue:getOneData.applyId?{s_label:getOneData.createStaffName,applyId:getOneData.applyId,applyLcName:getOneData.createStaffName}:undefined
                                })}
                                optionLabelProp="children"
                                className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                disabled={true}
                            >

                            </Select>
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
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-2 col-lg-2'}><span>*</span>{I18n.t(500381/*销假原因*/)}</label>
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
