import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import {createForm,FormWrapper} from '../../../../components/Form';
import Calendar from  '../../../../components/Calendar/Calendar';
import DataTime from  '../../../../components/Calendar/Calendar';
import xt from '../../../../common/xt'; // 下拉
import  SelectChange from "../../../../components/SelectChange";
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { ConstVirtualSelect,Option,ConstMiniSelect } from '../../../../components/Select'; // 下拉
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,toDecimal,API_FOODING_HR} from '../../../../services/apiCall';
import {I18n} from "../../../../lib/i18n";
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {TimePickerN} from "../../../../components/TimePicker/TimePicker.js";
import Checkbox from "../../../../components/CheckBox";
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
            stateBol:this.props.getOneData.selectType || 0,
			radioAddress:'',
			chuangArray:[],
			qiyunArray:[],
			info:[],
			getOneData: {},//this.props.getOneData,
			id:this.props.location.query.id
		}
	}
    //计划的状态改变
    stateChange = e => {
        let {setFieldsValue,getFieldValue} =this.props.form;
        if(e.target.value == 0){
            setFieldsValue({scheduleEnName:'',scheduleId:'',scheduleName:''});
        }else{
            setFieldsValue({startTime:'',endTime:''});
        }
        this.setState({
            stateBol:e.target.value
        })
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

				apiPost(API_FOODING_HR,'/workregister/save',Object.assign({},getOneData,value),
					(response)=>{	
						that.setState({ billId: response.data },function(){
							callBack(response);
							// 页面跳转
							if( type == 'object' ) {
								Confirm(i18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5,done:()=>{
									navReplaceTab({id:13,name:I18n.t(500364/*加班单详情*/),component:I18n.t(500364/*加班单详情*/),url:'/overtimeregister/detail'});
                                        router.push({ pathname: '/overtimeregister/detail',query:{id:that.state.id || that.state.billId }});
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
			this.props.navReplaceTab({name:I18n.t(500364/*加班单详情*/),component:I18n.t(500364/*加班单详情*/),url:'/overtimeregister/detail'});
			this.props.router.push({pathname: '/overtimeregister/detail', query: {id: billId}});
		} else {
			this.props.navReplaceTab({name:I18n.t(500416/*加班单*/),component:I18n.t(500416/*加班单*/),url:'/overtimeregister'});
			this.props.router.push({pathname: '/overtimeregister'});
		}
	}

    componentWillReceiveProps(nextProps) {
		//stateBol:this.props.getOneData.selectType || 0,
        let getOneData = nextProps.getOneData;
        if (getOneData.selectType !== this.props.getOneData.selectType){
        	this.setState({stateBol:getOneData.selectType})
		}
    }


	render(){
		let that = this;
		let {getNFieldProps,getFieldProps,getFieldError,getFieldValue} = this.props.form;
		let {getOneData} = this.props;
		let ccLocalName = WebData.user.data.staff.company.localName;
		let ccenName  =   WebData.user.data.staff.company.enName;
		let Cid = WebData.user.data.staff.company.id;
		let positionName = WebData.user.data.staff.organization.localName;
		let Pid = WebData.user.data.staff.organization.id;
		let stffId = WebData.user.data.staff.id;
		let stffLcname = WebData.user.data.staff.localName;
        let DateTimeDom;
        getOneData = getOneData || {};
        getOneData.compensateType = getOneData.compensateType || {};
        if(this.state.stateBol == 0){
            DateTimeDom = (<div className={'row'}>
                <input type='hidden' {...getNFieldProps('scheduleId',{
                    initialValue:""
                })}/>
                <input type='hidden' {...getNFieldProps('scheduleEnName',{
                    initialValue:""
                })}/>
                <input type='hidden' {...getNFieldProps('scheduleName',{
                    initialValue:""
                })}/>
                <div className="form-group col-md-3 col-lg-3">
                    <label className={'col-md-4'}>{I18n.t(500432/*时间范畴*/)}</label>
                    <TimePickerN
                        form={this.props.form}
                        name={"startTime"}
						rules={true}
                        defaultValue={getOneData['startTime'] || ''}
                    />
                    &nbsp;&nbsp;-&nbsp;&nbsp;
                    <TimePickerN
                        form={this.props.form}
                        name={"endTime"}
						rules={true}
                        defaultValue={getOneData['endTime'] || ''}
                    />
                </div>
            </div>)
        }else if(this.state.stateBol == 1){
            DateTimeDom = (<div className={'row'}>
                <input type='hidden' {...getNFieldProps('startTime',{
                    initialValue:""
                })}/>
                <input type='hidden' {...getNFieldProps('endTime',{
                    initialValue:""
                })}/>
                <div className="form-group col-md-3">
                    <label className={'col-md-4'}>{I18n.t(500352/*考勤班次*/)}</label>
                    <ConstVirtualSelect
                        form={this.props.form}
                        fieldName='scheduleId'
                        apiType={apiGet}
                        apiUri="/schedule/getList"
                        apiHost={API_FOODING_HR}
                        initialValue={xt.initSelectValue(true,
							{scheduleId:getOneData.scheduleId,s_label:getOneData.scheduleName,scheduleEnName:getOneData.scheduleName,scheduleName:getOneData.scheduleName}, ['scheduleId','scheduleName','scheduleEnName'], 's_label', this.props.form)}
                        apiParams={{
                            clusterId: WebData.user.data.staff.cluster.id,
                            companyId: WebData.user.data.staff.company.id
                        }}
                        rules
                        valueKeys={da => ({
                            scheduleEnName: da.localName,
                            scheduleId: da.id,
                            scheduleName: da.localName,
                            s_label: da.localName

                        })}
                        className={'col-md-7 col-lg-7'}
                    />
                </div>
            </div>)
        }
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
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400048/*单据编号*/)}</label>
                            <input type="text"
                                   {...getNFieldProps('no',{
                                       initialValue: getOneData.no?getOneData.no:'',
                                       rules: [{required:true}]
                                   })}
                                   disabled
                                   className={getFieldError('no')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
                            />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(700076/*日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<Calendar 
									width={'100%'}
									showTime = {false}
									isShowIcon={false}
									form={this.props.form}
									validate={true}
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
                                className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500358/*登记人*/)}</label>
                            <ConstVirtualSelect
                                placeholder=""
                                form={this.props.form}
                                fieldName='registerId'
                                apiHost={API_FOODING_ES}
                                apiUri='/party/getLoginCompanies'
                                apiParams={{}}
                                rules={true}
                                initialValue={xt.initSelectValue(stffLcname,{s_label:stffLcname,registerId:stffId,registerLcName:stffLcname},['registerId','registerLcName'], 's_label', this.props.form)}
                                valueKeys={ da => ({

                                    registerId: da.id,
                                    registerLcName: da.localName,
                                    s_label: da.localName
                                })}
                                disabled={true}
                                className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400233/*开始日期*/)}</label>
                            <div className={'col-md-8 datetime'}>
                                <DataTime
                                    range={true}
                                    type="start"
                                    startName="startDate"
                                    name="startDate"
                                    endName="endDate"
                                    showTime={false}
                                    width={'100%'}
                                    isShowIcon={true}
                                    form={this.props.form}
                                    value={getOneData && getOneData.startDate?[new Date(getOneData && getOneData.startDate || "").Format('yyyy-MM-dd'),new Date(getOneData && getOneData.endDate || "").Format('yyyy-MM-dd')]:[undefined,undefined]}
                                    validate={true}
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400234/*结束日期*/)}</label>
                            <div className={'col-md-8 datetime'}>
                                <DataTime
                                    range={true}
                                    type="end"
                                    startName="startDate"
                                    name="endDate"
                                    endName="endDate"
                                    showTime={false}
                                    width={'100%'}
                                    isShowIcon={true}
                                    form={this.props.form}
                                    value={getOneData && getOneData.endDate?[new Date(getOneData && getOneData.startDate || "").Format('yyyy-MM-dd'),new Date(getOneData && getOneData.endDate || "").Format('yyyy-MM-dd')]:[undefined,undefined]}
                                    validate={true}
                                />
                            </div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(600265/*加班时间*/)}</label>
                            <div className={'col-md-8'}>
                                <Radio
                                    checked = {0 == this.state.stateBol }
                                    name = {"selectType"}
                                    {...getNFieldProps('selectType',{
                                        initialValue:0 ==  this.state.stateBol?0:1,
                                        onChange:this.stateChange,
                                        checked:0 == this.state.stateBol
                                    })}
                                    value={0}
                                />
                                <span className={'radio-text'}>{I18n.t(500432/*时间范畴*/)}</span>
                                <Radio
                                    checked = {1 == this.state.stateBol}
                                    name = {"selectType"}
                                    {...getNFieldProps('selectType',{
                                        initialValue:1 ==  this.state.stateBol?1:0,
                                        onChange:this.stateChange,
                                        checked:1 == this.state.stateBol
                                    })}
                                    value={1}
                                />
                                <span className={'radio-text'}>{I18n.t(500352/*考勤班次*/)}</span>
                            </div>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500359/*补偿方式*/)}</label>
							<ConstMiniSelect form={this.props.form}
											 pbj='com.fooding.fc.enumeration.CompensateType'
											 fieldName="compensate"
											 optionValue={da => <Option key={da.id} objValue={{
                                                 compensate: da.id,
												 name:da.name,
												 s_label: da.name
											 }}>{da.name}</Option>}
											 reles={true}
                                             initialValue={xt.initSelectValue(getOneData.compensateType,{compensate:getOneData.compensateType.id,s_label:getOneData.compensateType.name},['compensate'],'s_label',this.props.form)}
											 className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}


							/>
						</div>


                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-2 col-lg-2'}>{I18n.t(500360/*事由*/)}</label>
                            <input type="text"
                                   {...getNFieldProps('reason',{
                                       initialValue: getOneData['reason'] || '',
                                   })}
                                   className={'col-md-10 col-lg-10 text-input-nowidth'}
                            />

                        </div>

					</div>
					<div className={'row'}>
                        {DateTimeDom}
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(500433/*是否考勤*/)}</label>
                            <Checkbox
                                {...getFieldProps('checkAttendance',{
                                    initialValue:getOneData?getOneData.checkAttendance:false,

                                })}
                                checked={this.props.form.getFieldValue("checkAttendance")}
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
