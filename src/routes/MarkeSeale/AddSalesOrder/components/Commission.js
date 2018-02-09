import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "rc-select";
import Select, {Option } from '../../../../components/Select';
import  SelectChange from "../../../../components/SelectChange";
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP} from '../../../../services/apiCall';
class Addnormal extends Component{
	constructor(props){
		super(props);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState();
		this.yongjinType = this.yongjinType.bind(this);
		this.yongjrClick = this.yongjrClick.bind(this);
		this.onChange = this.onChange.bind(this);
	}
	onChange(e){
		if(!e){
			this.props.form.setFieldsValue({ibcomsnNums:'',ibcomsnPersonId:undefined,ibcomsnCnyId:undefined})
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
	yongjrClick(){
		let that = this;
		if(this.props.form.getFieldValue("salBeId")){
			apiGet(API_FOODING_DS,'/entContact/getByBeIdDataTyId',{beId:this.props.form.getFieldValue("salBeId").salBeId,dataTyId:100},
				(response)=>{
					that.setState({
						yongjinrArray:response.data
					});
				},(error)=>{

				});
		}
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
		let {getNFieldProps,getFieldError,getFieldProps} = this.props.form;
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
									{...getFieldProps('ibcomsnType',{
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
							<Select 
									{...getNFieldProps('ibcomsnPersonId',{
										initialValue:getOne["ibcomsnPerson"+language]?{s_label:getOne["ibcomsnPerson"+language],ibcomsnPersonId:getOne.ibcomsnPersonId,ibcomsnPersonLcName:getOne.ibcomsnPersonLcName,ibcomsnPersonEnName:getOne.ibcomsnPersonEnName}:undefined
									 })}
									onClick={this.yongjrClick}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
									disabled={!this.props.form.getFieldValue("ibcomsnType")}
								>	
								{this.state.yongjinrArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, ibcomsnPersonId:o.id, ibcomsnPersonLcName:o.localName, ibcomsnPersonEnName:o.name}} title={o.name}>{o.name}</Option>)}	
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200705/*佣金币种*/)}</label>
							<Select 
									{...getNFieldProps('ibcomsnCnyId',{
										initialValue:getOne["ibcomsnCny"+language]?{s_label:getOne["ibcomsnCny"+language],ibcomsnCnyId:getOne.ibcomsnCnyId,ibcomsnCnyLcName:getOne.ibcomsnCnyLcName,ibcomsnCnyEnName:getOne.ibcomsnCnyEnName}:undefined
									 })}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
									disabled={!this.props.form.getFieldValue("ibcomsnType")}
								>
								{this.state.yongjinbzArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, ibcomsnCnyId:o.id, ibcomsnCnyLcName:o.localName, ibcomsnCnyEnName:o.name}} title={o.name}>{o.name}</Option>)}	
							</Select>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Addnormal;
