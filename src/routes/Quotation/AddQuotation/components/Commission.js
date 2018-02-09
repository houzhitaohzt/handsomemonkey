import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "rc-select";
import Select, {Option,ConstMiniSelect } from '../../../../components/Select';
import  SelectChange from "../../../../components/SelectChange";
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP,toDecimal} from '../../../../services/apiCall';
import xt from '../../../../common/xt'; // 下拉
class Addnormal extends Component{
	constructor(props){
		super(props);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState();
		this.yongjinType = this.yongjinType.bind(this);
		this.onChange = this.onChange.bind(this);
		this.yjbizhong = this.yjbizhong.bind(this);
	}
	onChange(e){
		if(!e){
			this.props.form.setFieldsValue({ibcomsnNums:''})
		}
	}
	initState(){
		return {
			radioState:'',
			radioAddress:'',
			yongjinTypeArray:[],
			yongjinbzArray:[],
			yongjinrArray:[]
		}
	}
	yjbizhong(){
		let that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:"com.fooding.fc.ds.entity.Curren"},(response)=>{
			that.setState({
				yongjinbzArray:response.data
			});
		},(error)=>{

		});
	}
	yongjinType(){
		let that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:"com.fooding.fc.enumeration.ExeNumType"},(response)=>{
			that.setState({
				yongjinTypeArray:response.data
			});
		},(error)=>{

		});
	}
	componentDidMount(){
		
	}
	AddressChange(e){
		let addres;
		addres = e.target.value;
		this.setState({
			radioAddress:addres
		})
	}
	render(){
		const {radioAddress, radioState} = this.state;
		let {getOne} =this.props;
		let {getNFieldProps,getFieldError,getFieldProps,getFieldValue} = this.props.form;
		let beFieldValue = this.props.form.getFieldValue("salBeId")||{};
		return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span style={{width:45}}>{i18n.t(200701/*佣金*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200702/*佣金类型*/)}</label>
							<Select 
									{...getNFieldProps('ibcomsnType',{
										initialValue:getOne["ibcomsnTypeName"]?{s_label:getOne["ibcomsnTypeName"],ibcomsnType:getOne.ibcomsnType}:undefined,
										onChange:this.onChange
									 })}
									allowClear
									animation='slide-up'
									all
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"	
									onClick={this.yongjinType}						
									className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
								>
								{this.state.yongjinTypeArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}	
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200703/*佣金数值*/)}</label>
							<input type='text' 
								className={'col-md-8 col-lg-8 text-input-nowidth'}
								{...getNFieldProps('ibcomsnNums',{
										initialValue:getOne["ibcomsnNums"]?getOne.ibcomsnNums:''
								})}
								disabled={!this.props.form.getFieldValue("ibcomsnType")}
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200704/*佣金人*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( beFieldValue.salBeId)}
                                                 refreshMark={getFieldValue('ibcomsnType',{}).ibcomsnType}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/entContact/getByBeIdDataTyId',
                                                     params: {beId:beFieldValue.salBeId,dataTyId:100}
                                                 }} fieldName="ibcomsnPersonId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["ibcomsnPerson"+language] && getFieldValue('ibcomsnType',{}).ibcomsnType, getOne, 
                                                 		['ibcomsnPersonId', 'ibcomsnPersonLcName', 'ibcomsnPersonEnName'], "ibcomsnPerson"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     ibcomsnPersonId: da.id,
                                                     ibcomsnPersonLcName: da.localName,
                                                     ibcomsnPersonEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} 
                                                 disabled={!this.props.form.getFieldValue("ibcomsnType")}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
				
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200705/*佣金币种*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                          refreshMark={getFieldValue('ibcomsnType',{}).ibcomsnType}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Curren'}
                                                 }} fieldName="ibcomsnCnyId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["ibcomsnCny"+language] && getFieldValue('ibcomsnType',{}).ibcomsnType == getOne.ibcomsnType, getOne, 
                                                 		['ibcomsnCnyId', 'ibcomsnCnyLcName', 'ibcomsnCnyEnName'], "ibcomsnCny"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     ibcomsnCnyId: da.id,
                                                     ibcomsnCnyLcName: da.localName,
                                                     ibcomsnCnyEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} 
                                                 disabled={!this.props.form.getFieldValue("ibcomsnType")}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                             />
			
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Addnormal;
