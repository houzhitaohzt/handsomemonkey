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
		//props.normalRef && props.normalRef(this);
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
        getOneData = getOneData || {};
        getOneData.users = getOneData.users || [];
        getOneData.vehicleType = getOneData.vehicleType || {};
        getOneData.evectionTypeName = getOneData.evectionTypeName || {};
        getFieldProps('accompanyPeople', {
            initialValue: '',
        });
		return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span></span>
					<span onClick={this.props.backClick}><i className={'foddingicon fooding-back'}></i></span>
					<span onClick={this.props.onSaveClick}><i className={'foddingicon fooding-save'}></i></span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400048/*单据编号*/)}</label>
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
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(100244/*企业*/)}</label>
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
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(100238/*部门*/)}</label>
                            <ConstVirtualSelect
                                placeholder=""
                                form={this.props.form}
                                fieldName='depmntId'
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
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(500358/*登记人*/)}</label>
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
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-2 col-lg-2'}>{I18n.t(500369/*随行人员*/)}</label>
                            <ConstVirtualSelect
                                className={'col-md-8'}
                                form={this.props.form}
                                apiType={apiGet}
                                apiUri='/staff/getListByCcId'
                                apiParams={{ccid:Cid}}
                                apiHost={API_FOODING_ES}
                                fieldName='staffIds'
                                initialValue={(getOneData.users).map(o=>(getOneData.users && o?o.refId:''))}
                                initValueOptions={(getOneData.users).map(o=>(getOneData.users && o?{name:o['staffLocalName'],id:o['refId'], localName:  o['staffLocalName'] ,s_label: o['staffLocalName']}:''))}
                                pageSize={5}
                                multi={true}
                            />
                        </div>


					</div>
					<div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500419/*目的地*/)}</label>
                            <input type="text"
                                   {...getNFieldProps('destination',{
                                       initialValue: getOneData['destination'] || '',
                                       rules: [{required:true}]
                                   })}
                                   className={getFieldError('destination')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
                            />
						</div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4'}><span>*</span>{I18n.t(500420/*出差类型*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 pbj='com.fooding.fc.enumeration.EvectionType'
                                                 fieldName="evectionType"
                                                 optionValue={da => <Option key={da.id} objValue={{
                                                     evectionType: da.id,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>}
                                                 reles={true}
                                                 initialValue={xt.initSelectValue(getOneData.evectionTypeName,{evectionType:getOneData.evectionTypeName.id,localName:getOneData.evectionTypeName.name, name:getOneData.evectionTypeName.name, s_label:getOneData.evectionTypeName.name},['evectionType'],'s_label',this.props.form)}
                                                 className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}


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
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-2 col-lg-2'}>{I18n.t(500360/*事由*/)}</label>
                            <input type="text"
                                   {...getNFieldProps('reason',{
                                       initialValue: getOneData['reason'] || ''

                                   })}
                                   className={'col-md-10 col-lg-10 text-input-nowidth '}
                            />

                        </div>
                        <div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-md-4'}>{I18n.t(500370/*交通工具*/)}</label>
							<ConstMiniSelect form={this.props.form}
											 pbj='com.fooding.fc.enumeration.VehicleType'
											 fieldName="vehicle"
											 optionValue={da => <Option key={da.id} objValue={{
                                                 vehicle: da.id,
												 s_label: da.name
											 }}>{da.name}</Option>}
                                             initialValue={xt.initSelectValue(getOneData.vehicleType,{vehicle:getOneData.vehicleType.id,s_label:getOneData.vehicleType.name, localName: getOneData.vehicleType.name, name:getOneData.vehicleType.name},['vehicle'],'s_label',this.props.form)}
                                             initValueOptions={getOneData.vehicleType ? [{vehicle:getOneData.vehicleType.vehicle, localName:getOneData.vehicleType.name,name:getOneData.vehicleType.name }] : []}
											 className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}


							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100284/*币种*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                             pbj='com.fooding.fc.ds.entity.Curren'
                                             fieldName="currencyId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 currencyId: da.id,
                                                 currencyEnName:da.enName,
                                                 currencyLcName:da.localName,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             reles={true}
                                             initialValue={xt.initSelectValue(getOneData.currencyId, getOneData, ['currencyId', 'currencyEnName', 'currencyLcName'], 'currencyLcName', this.props.form)}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}


                            />
						</div>						
					</div>
					<div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(100326/*总金额*/)}</label>
                            <input type="text"
                                   {...getNFieldProps('totalAmt',{
                                       initialValue: toDecimal(getOneData.totalAmt) || '',
                                   })}
                                   disabled
                                   className={'col-md-8 col-lg-8 text-input-nowidth'}
                            />
                        </div>
					</div>
				</div>
			</div>
		)
	}
}
export default Addnormal;
