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
		// init func
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onBack = this.onBack.bind(this);
        this.monthSelectData = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,24,25,26,27,28,29,30,31];



		// init state
		this.state=this.initState();		
		


	}
	initState(){
		return {
			radioState:'',
			radioAddress:'',
			chuangArray:[],
			qiyunArray:[],
			info:[],
            id:this.props.location.query.id,
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

		let that = this;
		const {location,router,navReplaceTab,form, onSaveAndClose,getOneData} = that.props;
	
		form.validateFields((errors, value) => {
			if(errors){
			}else{

				apiPost(API_FOODING_HR,'/scheduleSet/save',Object.assign({},getOneData,value),
					(response)=>{	
						that.setState({ billId: response.data },function(){
							callBack(response);

							// 页面跳转
							if( type == 'object' ) {
								Confirm(i18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5,done:()=>{
									navReplaceTab({id:13,name:i18n.t(500404/*排班设置详情*/),component:i18n.t(500404/*排班设置详情*/),url:'/shiftsettings/detail'});
									router.push({ pathname: '/shiftsettings/detail',query:{id:that.state.id || that.state.billId}});
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
			this.props.navReplaceTab({name:i18n.t(500404/*排班设置详情*/),component:i18n.t(500404/*排班设置详情*/),url:'/shiftsettings/detail'});
			this.props.router.push({pathname: '/shiftsettings/detail', query: {id: billId}});
		} else {
			this.props.navReplaceTab({name:I18n.t(500429/*时长*/),component:I18n.t(500429/*时长*/),url:'/shiftsettings'});
			this.props.router.push({pathname: '/shiftsettings'});
		}
	}

	render(){
		let that = this;
		let {getNFieldProps,getFieldProps,getFieldError,getFieldValue} = this.props.form;
		let {getOneData} = this.props;
		let ccLocalName = WebData.user.data.staff.company.localName;
		let ccenName  =   WebData.user.data.staff.company.enName;
		let Cid = WebData.user.data.staff.company.id;
        let clusterLocalName = WebData.user.data.staff.cluster.localName;
        let clusterenName  =   WebData.user.data.staff.cluster.enName;
        let clusId = WebData.user.data.staff.clusId;
        let {form} = this.props;
        getOneData = getOneData || {};
        getOneData.depments = getOneData.depments || [];
        getOneData.staffs = getOneData.staffs || [];
        console.log(getOneData)
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
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100243/*集团*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                apiHost={API_FOODING_ES}
                                apiUri="/party/getLoginClusters"
                                fieldName="cluster"
                                initialValue={xt.initSelectValue(true, WebData.user.data.staff.cluster, ['cluster'], 'localName', form, true)}
                                valueKeys={da => ({
                                    ...da,
                                    s_ignore_label: true
                                })} disabled
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                apiUri="/party/getLoginCompanies"
                                apiHost={API_FOODING_ES}
                                apiParams={{clusId: WebData.user.data.staff.clusId}}
                                fieldName="company"
                                initialValue={xt.initSelectValue(getOneData.company && getOneData.company.id || WebData.user.data.staff.company , getOneData.company || WebData.user.data.staff.company, ['company'], 'localName', form, true)}
                                valueKeys={da => ({
                                    ...da,
                                    s_ignore_label: true
                                })} rules
                            />
                        </div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500395/*排班编号*/)}</label>
							<input type="text"
                                   {...getNFieldProps('code',{
                                       initialValue: getOneData['code'] || '',
                                       rules: [{required:true}]
                                   })}
                                   className={getFieldError("code") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
							/>
						</div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500396/*排班名称*/)}</label>
                            <input type="text"
                                   {...getNFieldProps('name',{
                                       initialValue: getOneData['name'] || '',
                                       rules: [{required:true}]
                                   })} className={getFieldError("name") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
                            />
                        </div>

					</div>
					<div className={'row'}>

                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-2 col-lg-2'}>{i18n.t(100238/*部门*/)}</label>
                            <ConstVirtualSelect
                                className={'col-md-10 col-lg-10'}
                                form={this.props.form}
                                apiType={apiGet}
                                apiUri='/party/getPartysByType'
                                apiParams={{partyId:Cid,typeAttributeIds:["41","42","43","44"]}}
                                apiHost={API_FOODING_ES}
                                fieldName='depment'
                                initialValue={(getOneData.depments).map(o=>(getOneData.depments && o?o.id:''))}
                                initValueOptions={(getOneData.depments).map(o=>(getOneData.depments && o?{name:o['localName'],id:o['id'], localName:  o['localName'] ,s_label: o['localName']}:''))}
                                pageSize={5}
                                multi={true}
                            />
                        </div>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-2 col-lg-2'}>{i18n.t(400145/*职员*/)}</label>
                            <ConstVirtualSelect
                                className={'col-md-10 col-lg-10'}
                                form={this.props.form}
                                apiType={apiGet}
                                apiUri='/staff/getListByCcId'
                                apiParams={{ccid:Cid}}
                                apiHost={API_FOODING_ES}
                                fieldName='staff'
                                initialValue={(getOneData.staffs).map(o=>(getOneData.staffs && o?o.id:''))}
                                initValueOptions={(getOneData.staffs).map(o=>(getOneData.staffs && o?{name:o['localName'],id:o['id'], localName:  o['localName'] ,s_label: o['localName']}:''))}
                                pageSize={5}
                                multi={true}
                            />
                        </div>

					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4'}><span>*</span>{I18n.t(400239/*工作日历*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                apiUri="/calendar/getList"
                                apiHost={API_FOODING_HR}
                                apiParams={{clusterId: WebData.user.data.staff.clusId,companyId:getFieldValue('company',WebData.user.data.staff.company).id}}
                                fieldName="workingCalendar"
                                initialValue={xt.initSelectValue(getOneData.workingCalendar && getOneData.workingCalendar , getOneData.workingCalendar, ['workingCalendar'], 'localName', form, true)}
                                valueKeys={da => ({
                                    ...da,
                                    s_ignore_label: true
                                })} rules
                            />
						</div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4'}><span>*</span>{I18n.t(500354/*排班规则*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                apiType={apiForm}
                                apiUri="/schedulerule/getList"
                                apiHost={API_FOODING_HR}
                                apiParams={{clusterId: WebData.user.data.staff.clusId,companyId:getFieldValue('company',WebData.user.data.staff.company).id}}
                                fieldName="scheduleRule"
                                initialValue={xt.initSelectValue(getOneData.scheduleRule && getOneData.scheduleRule , getOneData.scheduleRule, ['scheduleRule'], 'name', form, true)}
                                labelKey="name"
                                valueKeys={da => ({
                                    ...da,
                                    s_ignore_label: true
                                })} rules
                            />

                        </div>

                        <div className='form-group col-md-3 col-md-3'>
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500399/*日期长度*/)}</label>

                            <ConstVirtualSelect
                                form={this.props.form}
                                fieldName="dateLengthId"
                                apiType={apiPost}
                                pageSize={4}
                                apiParams={'com.fooding.fc.enumeration.DateLength'}
								initRequest
                                initialValue={getOneData.dateLengthId}
                                labelKey="name"
                                rules={true}
                                className="col-md-7 col-lg-7"
                            />
							天

                        </div>
                        <div className='form-group col-md-3 col-md-3'>
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500400/*考勤开始日*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    isRequest = {false}
                                    fieldName="dayBegin"
                                    initValueOptions={that.monthSelectData}
                                    initialValue={getOneData.dayBegin}
                                    valueKeys={da => String(da)}
                                    pageSize={4}
									rules={true}
                                    className ={'col-xs-7 col-md-7'}
                                />
                            日
                            </div>
                        </div>
					<div className={'row'}>
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
                                    name={'scheduleDate'}
                                    value={new Date() || getOneData.scheduleDate}
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(500360/*事由*/)}</label>
                            <input type="text"
                                   {...getNFieldProps('remark',{
                                       initialValue: getOneData['remark'] || '',
                                   })}
                                   className={'col-md-8 col-lg-8 text-input-nowidth'}
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
