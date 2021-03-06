import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option, ConstMiniSelect } from '../../../../components/Select';
import DataTime from '../../../../components/Calendar/Calendar';
import {createForm,FormWrapper} from "../../../../components/Form";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_OA,API_FOODING_ES,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import xt from '../../../../common/xt';

import {I18n} from "../../../../lib/i18n";
class Addnormal extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
	}
	initState(){
		return {
			stateBol:0, //状态 0计划， 1代表已完成
			radioAddress:10, //0 我方 1他方
			addrBol:0, // 0 我公司， 1 客户公司， 2 其他
			clientSelectData:[],
		}
	}
	//计划的状态改变
	stateChange = e => {
		let {setFieldsValue,getFieldValue} =this.props.form;
		if(e.target.value == 0){
			setFieldsValue({starts:'',ends:''});
		}else{
			setFieldsValue({expectedStartTime:'',expectedEndTime:'',reminderTime:''});
		}
		this.setState({
			stateBol:e.target.value
		})
	}
	//方向
	addressChange = e => {
		this.setState({
			radioAddress:e.target.value
		})
	}
	//约会地址
	addrStateChange = e => {
		this.setState({
			addrBol:e.target.value
		}) 
	}	
	//客户选择
	onClientChange = data => {
        if (data.trim() === '') return;
        apiGet(API_FOODING_DS, '/customer/search', {keyword: data}, response => {
            this.props.form.resetFields(['salBeId']);
            this.setState({clientSelectData: response.data || []});
        }, error => {
            errorTips(error.message);
        })
    };
    //客户选择某一个值
    clientSelect = data => {
    	this.props.clientSelect(data);
    }
    componentWillReceiveProps(nextProps){
  		if(nextProps.commonData.directyp == 10 || nextProps.commonData.directyp == 20){
  			//判断方向
  			if(this.props.commonData.directyp !== nextProps.commonData.directyp){
	  			this.setState({radioAddress:nextProps.commonData.directyp});
	  		}
  		}
  		if(nextProps.commonData.state == 0 ||  nextProps.commonData.state == 1){
  			//判断状态
  			if(this.props.commonData.state !== nextProps.commonData.state){
	  			this.setState({stateBol:nextProps.commonData.state});
	  		}
  		} 
  		if(nextProps.commonData.addrState == 0 || nextProps.commonData.addrState == 1 || nextProps.commonData.addrState == 2){
  			//判断地址
  			if(this.props.commonData.addrState !== nextProps.commonData.addrState){
	  			this.setState({addrBol:nextProps.commonData.addrState});
	  		}
  		}		
  	}
	render(){
		let {commonData ={} } = this.props;
		const { getNFieldProps, getFieldError, getFieldProps, getFieldValue } = this.props.form;
		let dom,DateTimeDom;
		 //isDt 用来判断 客户是否市可以选择的
        if(this.props.isDt === "false"){
	        dom = (<div className={'col-md-8 col-lg-8'}>
            	<p className = {'paragraph'} 
            		{...getNFieldProps('salBeId', {
				            initialValue: this.props.salBeId ? {
				                s_label: this.props.salBeLcName,
				                salBeId: this.props.salBeId,
				                salBeLcName: this.props.salBeLcName,
				                salBeEnName: this.props.salBeEnName
				            } : undefined
				        })}
            	>{this.props.salBeLcName}</p>
            </div>)
        }else{
        	dom = (<Select
				 		disabled={this.props.isEdit}
                        animation='slide-up'
                        className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                        prefixCls="rc-select-filter-header"
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        optionFilterProp='children'
                        allowClear
                        onSearch={this.onClientChange}
                        onSelect = {this.clientSelect}
                        {...getNFieldProps('salBeId', {
				            validateFirst: true,
				            rules: [{required:true,}],
				            initialValue: commonData.salBeId ? {
				                s_label: commonData.salBeLcName,
				                salBeId: commonData.salBeId,
				                salBeLcName: commonData.salBeLcName,
				                salBeEnName: commonData.salBeEnName
				            } : undefined
				        })}
                    >
                        {this.state.clientSelectData.map(
                            da => <Option key={da.id} objValue={{
                                s_label: da.localName,
                                salBeId: da.id,
                                salBeLcName: da.localName,
                                salBeEnName: da.name
                            }}>{da.localName}</Option>
                        )}
                    </Select>)
        }
		if(this.state.stateBol == 0){
			DateTimeDom = (<div className={'row'}>
					<input type='hidden' {...getNFieldProps('starts',{
									initialValue:""
						})}/>
						<input type='hidden' {...getNFieldProps('ends',{
									initialValue:""
						})}/>
					<div className="form-group col-md-3 col-lg-3">
						<label className={'col-md-4 col-lg-4'}>{I18n.t(100307/*预计开始时间*/)}</label>
						<div className={'col-md-8 col-lg-8 datetime'}>
							<DataTime 
								range={true}
								type="start"
								startName="expectedStartTime"
								name="expectedStartTime"
								endName="expectedEndTime"
								disabled={this.state.stateBol == 1}
								showTime={true}
								isShowIcon={true}
								width={'100%'}
								form={this.props.form}
								value={commonData && commonData.expectedStartTime?[new Date(commonData && commonData.expectedStartTime || "").Format('yyyy-MM-dd hh:mm:ss'),new Date(commonData && commonData.expectedEndTime || "").Format('yyyy-MM-dd hh:mm:ss')]:[undefined,undefined]}
								validate={true}
							/>
						</div>
					</div>
					<div className="form-group col-md-3 col-lg-3">
						<label className={'col-md-4 col-lg-4'}>{I18n.t(100308/*预计结束时间*/)}</label>
						<div className={'col-md-8 col-lg-8 datetime'}>
							<DataTime 
								range={true}
								type="end"
								startName="expectedStartTime"
								name='expectedEndTime'
								endName="expectedEndTime"
								disabled={this.state.stateBol == 1}
								showTime={true}
								isShowIcon={true}
								width={'100%'}
								form={this.props.form}
								value={commonData && commonData.expectedStartTime?[new Date(commonData && commonData.expectedStartTime || "").Format('yyyy-MM-dd hh:mm:ss'),new Date(commonData && commonData.expectedEndTime || "").Format('yyyy-MM-dd hh:mm:ss')]:[undefined,undefined]}
								validate={true}
							/>
						</div>
					</div>
					<div className="form-group col-md-3 col-lg-3">
						<label className={'col-md-4 col-lg-4'}>{I18n.t(100309/*提醒时间*/)}</label>
						<div className={'col-md-8 col-lg-8 datetime'}>
							<DataTime
								showTime={true}
								isShowIcon={true}
								width={'100%'}
								form={this.props.form}
								name={'reminderTime'}
								value={new Date(commonData && commonData.reminderTime || "").Format('yyyy-MM-dd hh:mm:ss')}
							/>
						</div>
					</div>
				</div>)
		}else if(this.state.stateBol == 1){
			DateTimeDom = (<div className={'row'}>
						<input type='hidden' {...getNFieldProps('expectedStartTime',{
									initialValue:""
						})}/>
						<input type='hidden' {...getNFieldProps('expectedEndTime',{
									initialValue:""
						})}/>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100305/*开始时间*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									range={true}
									type="start"
									startName="starts"
									name="starts"
									endName="ends"
									disabled={this.state.stateBol == 0}
									showTime={true}
									width={'100%'}
									isShowIcon={true}
									form={this.props.form}
									value={commonData && commonData.starts?[new Date(commonData && commonData.starts || "").Format('yyyy-MM-dd hh:mm:ss'),new Date(commonData && commonData.ends || "").Format('yyyy-MM-dd hh:mm:ss')]:[undefined,undefined]}
									validate={true}
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100306/*结束时间*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									range={true}
									type="end"
									startName="starts"
									name="ends"
									endName="ends"
									disabled={this.state.stateBol == 0}
									showTime={true}
									width={'100%'}
									isShowIcon={true}
									form={this.props.form}
									value={commonData && commonData.ends?[new Date(commonData && commonData.ends || "").Format('yyyy-MM-dd hh:mm:ss'),new Date(commonData && commonData.ends || "").Format('yyyy-MM-dd hh:mm:ss')]:[undefined,undefined]}
									validate={true}
								/>
							</div>
						</div>
					</div>)
		}
        let activityDom =(<div className={'row'}>
				<div className="form-group col-md-3 col-lg-3" style={{height:"30px"}}>
					<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400005/*约会地址*/)}</label>
					<div className={'col-md-8 col-lg-8'} style={{height:"30px"}}>
						<Radio
							checked = {0 == this.state.addrBol }
							name = {"addrState"}
							{...getNFieldProps('addrState',{
								initialValue:0 == this.state.addrBol ? 0: (this.state.addrBol == 1?1:2),
								onChange:this.addrStateChange,
								checked:0 == this.state.addrBol
							})}
							value={0}
						/>
						<span className={'radio-text'} style={{marginRight:'5px'}}>{I18n.t(400006/*我公司*/)}</span>
						<Radio 
							checked = {1 == this.state.addrBol }
							name = {"addrState"}
							{...getNFieldProps('addrState',{
								initialValue:0 == this.state.addrBol ? 0: (this.state.addrBol == 1?1:2),
								onChange:this.addrStateChange,
								checked:1 == this.state.addrBol
							})}
							value={1}
						/>
						<span className={'radio-text'} style={{marginRight:'5px'}}>{I18n.t(400007/*客户公司*/)}</span>
						<Radio 
							checked = {2 == this.state.addrBol }
							name = {"addrState"}
							{...getNFieldProps('addrState',{
								initialValue:0 == this.state.addrBol ? 0: (this.state.addrBol == 1?1:2),
								onChange:this.addrStateChange,
								checked:2 == this.state.addrBol
							})}
							value={2}
						/>
						<span className={'radio-text'} style={{marginRight:'5px'}}>{I18n.t(100488/*其他*/)}</span>
					</div>
				</div>
				<div className="form-group col-md-3 col-lg-3">
					<label className={'col-md-4 col-lg-4'}>{I18n.t(100087/*国家*/)}</label>
					<ConstMiniSelect form={this.props.form}
						disabled={this.state.addrBol != 2}
						pbj="com.fooding.fc.ds.entity.Country" fieldName="cntryId"
							initValueOptions={[]}
							optionValue={da => <Option key={da.id} objValue={{
								cntryId: da.id,
								cntryEnName: da.name,
								cntryLcName:da.localName,
								s_label: da.localName
							}}>{da.localName}</Option>}
							initialValue={xt.initSelectValue(commonData.cntryId && this.state.addrBol == 2, commonData, ['cntryId', 'cntryLcName', 'cntryEnName'], 'cntryLcName', this.props.form)}
							className ={'col-md-8 col-lg-8'}
					/>
				</div>
				<div className="form-group col-md-3 col-lg-3">
					<label className={'col-md-4 col-lg-4'}>{I18n.t(100535/*省/州*/)}</label>
					<ConstMiniSelect form={this.props.form}
						disabled={this.state.addrBol != 2}
						isRequest={Boolean(getFieldValue("cntryId",{}).cntryId)}
						refreshMark={getFieldValue("cntryId",{}).cntryId} 
						pbj={{
						params:{"obj":'com.fooding.fc.ds.entity.Area',
							"queryParams":[{"attr":"parentId","expression":"=","value":getFieldValue('cntryId',commonData).cntryId}]}
						}} fieldName="provinceId"
							initValueOptions={[]}
							optionValue={da => <Option key={da.id} objValue={{
								provinceId: da.id,
								provinceEnName: da.name,
								provinceLcName:da.localName,
								s_label: da.localName
							}}>{da.localName}</Option>}
							initialValue={xt.initSelectValue(commonData.provinceId && commonData.cntryId === getFieldValue('cntryId',{}).cntryId, commonData, ['provinceId', 'provinceLcName', 'provinceEnName'], 'provinceLcName', this.props.form)}
							className ={'col-md-8 col-lg-8'}
					/>
				</div>
				<div className="form-group col-md-3 col-lg-3">
					<label className={'col-md-4 col-lg-4'}>{I18n.t(100248/*市*/)}</label>
					<ConstMiniSelect form={this.props.form}
						disabled={this.state.addrBol != 2}
						isRequest={Boolean(getFieldValue("provinceId",{}).provinceId)}
						refreshMark={getFieldValue("provinceId",{}).provinceId} 
						pbj={{
						params:{"obj":'com.fooding.fc.ds.entity.Area',
							"queryParams":[{"attr":"parentId","expression":"=","value":getFieldValue('provinceId',{}).provinceId}]}
						}} fieldName="cityId"
							initValueOptions={[]}
							optionValue={da => <Option key={da.id} objValue={{
								cityId: da.id,
								cityLcName:da.localName,
								cityEnName:da.name,
								s_label: da.localName
							}}>{da.localName}</Option>}
							initialValue={xt.initSelectValue(commonData.cityId && commonData.provinceId === getFieldValue('provinceId',{}).provinceId, commonData, ['cityId', 'cityEnName', 'cityLcName'], 'cityLcName', this.props.form)}
							className ={'col-md-8 col-lg-8'}
					/>
				</div>
				<div className="form-group col-md-6 col-lg-6">
					<label className={'col-md-2 col-lg-2'}><span>*</span>{I18n.t(100333/*与会人员*/)}</label>
					<ConstMiniSelect form={this.props.form} 
						isRequest={Boolean(getFieldValue("salBeId",{}).salBeId)}
						refreshMark={getFieldValue("salBeId",{}).salBeId} 
							pbj={{
							apiType:apiGet,
								host:API_FOODING_DS,
								uri: '/entContact/getByBeIdDataTyId',
								params:{beId:getFieldValue("salBeId",commonData).salBeId,dataTyId:this.props.dataTypeId}
						}} fieldName="customerParticipantIds"
							props={{tags: true}}
								initValueOptions={commonData&&commonData.customerParticipantIds?commonData.customerParticipantIds.split(",").map(e => ({id:e.split(".")[0],name:e.split(".")[1],localName:e.split(".")[1]})):[]}
								reles={true}
								optionValue={(da, di) => <Option key={di} value={(da.id + "."  + da.localName)}>{da.localName}</Option>}
								initialValue={commonData&&commonData.customerParticipantIds?commonData.customerParticipantIds.split(","): []}
								className ={'col-md-10 col-lg-10'}
					/>
				</div>
				<div className="form-group col-md-6 col-lg-6">
					<label className={'col-md-2 col-lg-2'}>{I18n.t(100250/*详细地址*/)}</label>
					<input type='text' className={'col-md-10 col-lg-10 text-input-nowidth'} {...getNFieldProps('address',{
							initialValue:commonData && commonData.address? commonData.address:'',
						})}  />
				</div>
			</div>)
		return(
			<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span>{I18n.t(100138/*常规*/)}</span>
					<span onClick={this.props.saveClick}><i className={'foddingicon fooding-save'}></i></span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100304/*主题*/)}</label>
							<input type='text' className ={getFieldError('title')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
								{...getNFieldProps('title',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:commonData && commonData.title? commonData.title:'',
								})} 
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{this.props.Label}</label>
							 {dom} 
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100301/*方向*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<Radio
									checked = {10 == this.state.radioAddress }
									name = {"directyp"}
									{...getNFieldProps('directyp',{
                                        initialValue:10 ==  this.state.radioAddress?10:20,
                                        onChange:this.addressChange,
                                        checked:10 == this.state.radioAddress
                                    })}
                                    value={10}
								/>
								<span className={'radio-text'}>{I18n.t(100302/*我方*/)}</span>
								<Radio
									checked = {20 == this.state.radioAddress }
									name = {"directyp"}
									{...getNFieldProps('directyp',{
                                        initialValue:20 ==  this.state.radioAddress?20:10,
                                        onChange:this.addressChange,
                                        checked:20 == this.state.radioAddress
                                    })}
                                    value={20}
								/>
								<span className={'radio-text'}>{I18n.t(100303/*对方*/)}</span>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100230/*状态*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<Radio
									checked = {0 == this.state.stateBol }
									name = {"state"}
									{...getNFieldProps('state',{
                                        initialValue:0 ==  this.state.stateBol?0:1,
                                        onChange:this.stateChange,
                                        checked:0 == this.state.stateBol
                                    })}
                                    value={0}
								/>
								<span className={'radio-text'}>{I18n.t(100329/*计划*/)}</span>
								<Radio 
									checked = {1 == this.state.stateBol }
									name = {"state"}
									{...getNFieldProps('state',{
                                        initialValue:1 ==  this.state.stateBol?1:0,
                                        onChange:this.stateChange,
                                        checked:1 == this.state.stateBol
                                    })}
                                    value={1}
								/>
								<span className={'radio-text'}>{this.props.activityType==10?I18n.t(100330/*已响应*/):I18n.t(400000/*已联络*/)}</span>
							</div>
						</div>
					</div>
					{activityDom}
					{DateTimeDom}
					<div className={'row'}>
						<div className={'form-group col-md-12 col-lg-12'}>
							<label className={'col-md-1 col-lg-1'}>{I18n.t(400002/*联络内容*/)}</label>
							<textArea className={'col-md-11 col-lg-11 textarea'} {...getNFieldProps('respondRecord',{
									initialValue:commonData && commonData.respondRecord? commonData.respondRecord:""
								})}></textArea>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{I18n.t(100334/*礼品准备*/)}</label>
	                        <input type='text' className={'col-md-10 col-lg-10 text-input-nowidth'} {...getNFieldProps('gift',{
									initialValue:commonData && commonData.gift? commonData.gift:""
								})}/>
						</div>
						<div className="form-group col-md-2 col-lg-2">
							<label className={'col-md-6 col-lg-6'}>{I18n.t(100335/*后续跟踪方式*/)}</label>
							<ConstMiniSelect form={this.props.form}
							 pbj='com.fooding.fc.enumeration.ActivityType' fieldName="trackingModeId"
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.id} objValue={{
		                                 trackingModeId: da.id,
		                                 trackingModeLcName :da.name,
		                                 trackingModeEcName :da.name,
		                                 s_label: da.name
		                             }}>{da.name}</Option>}
	                             initialValue={xt.initSelectValue(commonData.trackingModeId, commonData, ['trackingModeId', 'trackingModeLcName', 'trackingModeEcName'], 'trackingModeLcName', this.props.form)}
	                             className ={'col-md-6 col-lg-6'}
	                        />
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-2 col-lg-2'}>{I18n.t(100336/*备注*/)}</label>
							<input type='text' className={'col-md-10 col-lg-10 text-input-nowidth'} {...getNFieldProps('remark',{
									initialValue:commonData && commonData.remark? commonData.remark:""
								})}/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100337/*后续提醒时间*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime 
									showTime={true}
									isShowIcon={true}
									width={'100%'}
									form={this.props.form}
									name={'nextReminderTime'}
									value={new Date(commonData && commonData.nextReminderTime || "").Format('yyyy-MM-dd hh:mm:ss')}
								/>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3">
							<label className={'col-md-2 col-lg-2'}>{I18n.t(100338/*我方参与人员*/)}</label>
							<ConstMiniSelect form={this.props.form}
											 isRequest={Boolean(getFieldValue("ccId", {ccId:commonData.ccid}).ccId)}
											 refreshMark={getFieldValue("ccId", {ccId:commonData.ccid}).ccId }
											 refreshChangeName={"ccId"}
											 pbj={{
                                                 apiType: apiGet,
                                                 host: API_FOODING_ES,
                                                 uri: '/user/getListForPermissionsInParty',
                                                 params: {partyId: getFieldValue("clusterId", commonData).clusterId}
                                             }} fieldName="participantIds"
											 props={{tags: true}}
											 initValueOptions={commonData && commonData.participantIds ? commonData.participantIds.split(",").map(e => ({
                                                 id: e.split(".")[0],
                                                 name: e.split(".")[1],
                                                 localName: e.split(".")[1],
                                                 staffLocalName: e.split(".")[1]
                                             })) : []}
											 optionValue={(da, di) => <Option key={di}
																			  value={da.id + "." + da.staffLocalName}>{da.staffLocalName}</Option>}
											 initialValue={commonData && commonData.participantIds ? commonData.participantIds.split(",") : []}
											 className={'currency-btn select-from-currency col-md-10 col-lg-10'}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

// export default createForm()(Addnormal);
export default Addnormal;

