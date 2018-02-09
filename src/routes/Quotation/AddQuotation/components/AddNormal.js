import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select';
import DataTime from '../../../../components/Calendar/Calendar';
import  SelectChange from "../../../../components/SelectChange";
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../services/apiCall";
import xt from '../../../../common/xt'; // 下拉

class Addnormal extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState();
		this.dataChang = this.dataChang.bind(this);
		this.clientClick = this.clientClick.bind(this);
		this.clientSelect = this.clientSelect.bind(this);
	}
	clientSelect(e,item){
		if (e.salBeId === '') return;
		let that = this;
		let getOne = this.props.getOne;
		apiGet(API_FOODING_DS, '/customer/getCustInfoForErp', {id: e.salBeId}, response => {
           getOne = Object.assign({},getOne,response.data);
           that.props.setGetOne(getOne,()=>{
						 let billDate = new Date(getOne.billDate).Format('yyyy-MM-dd');
 				 		 let payTrmId = getOne.payTrmId;
 				 		 let insBeId = getOne.insBeId;
 				 		 let corpTypeId = getOne.corpTypeId;
 				 		 let riskTyId = getOne.riskTyId;
 				 		 let ccId = getOne.ccId;
 				 		 if(billDate && payTrmId  && insBeId &&
 				 		 corpTypeId && riskTyId&& ccId){
 				 			apiGet(API_FOODING_ERP,'/termscreditrate/getRate',{
 				 				billDate:billDate,payTrmId:payTrmId,insBeId:insBeId,
 				 				corpTypeId:corpTypeId,riskTyId:riskTyId,ccId:ccId
 				 			},(response)=>{
 				 				   let corTs= that.props.getOne;
 				 				    corTs = Object.assign({},getOne,{corpRate:response.data});
 				         		that.props.setGetOne(corTs);
 				 			},(error)=>{

 				 			})
 				 		}
					 });
        }, error => {
        })
	}
	dataChang(value){
		let that = this;
		let {getFieldValue,setFieldsValue}=this.props.form;
		let billDate = value;
		let payTrmId = getFieldValue("payTrmId",{}).payTrmId;
		let insBeId = getFieldValue("insBeId",{}).insBeId;
		let corpTypeId = getFieldValue("corpTypeId",{}).corpTypeId;
		let riskTyId = this.props.getOne.riskTyId;
		let ccId = getFieldValue("ccId",{}).ccId;
		if(billDate && payTrmId  && insBeId &&
		 corpTypeId && riskTyId&& ccId){
			apiGet(API_FOODING_ERP,'/termscreditrate/getRate',{
				billDate:billDate,payTrmId:payTrmId,insBeId:insBeId,
				corpTypeId:corpTypeId,riskTyId:riskTyId,ccId:ccId
			},(response)=>{
				let getOne = this.props.getOne;
				getOne = Object.assign({},getOne,{corpRate:response.data});
        		that.props.setGetOne(getOne);
			},(error)=>{

			})
		}
	}
	clientClick(data){
		if (data.trim() === '') return;
        apiGet(API_FOODING_DS, '/customer/search', {keyword: data}, response => {
            this.props.form.resetFields(['salBeId']);
            this.setState({clientArray: response.data || []});
        }, error => {
        })
	}
	initState(){
		return {
			radioState:'',
			radioAddress:'',
			clientArray:[]
		}
	}
	StateChange(e){
		let tex;
		tex = e.target.value;
		this.setState({
			radioState:tex
		})
	}
	AddressChange(e){
		let addres;
		addres = e.target.value;
		this.setState({
			radioAddress:addres
		})
	}
	componentDidMount(){
	}
	render(){
		const {radioAddress, radioState} = this.state;
		let {getFieldProps,getNFieldProps,getFieldError,getFieldValue} = this.props.form;
		let {getOne} = this.props;
		return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span>{i18n.t(100138/*常规*/)}</span>
					<span onClick={this.props.backClick}><i className={'foddingicon fooding-back'}></i></span>
					<span onClick={this.props.saveClick}><i className={'foddingicon fooding-save'}></i></span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400048/*单据编号*/)}</label>
							<input placeholder=''
								   type="text" {...getFieldProps('no', {
						                initialValue:getOne.no ? getOne.no:''
						            })}
								disabled
								className={'col-md-8 col-lg-8 text-input-nowidth'}
							 />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400049/*业务状态*/)}</label>
							<Select
								placeholder=""
								{...getNFieldProps('status',{
										rules: [{required:true}],
										initialValue:getOne.statusName?{s_label:getOne.statusName,status:getOne.status}:undefined
								 })}
								className ='currency-btn select-from-currency col-md-8 col-lg-8'
								disabled
							>
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									showTime={false}
									isShowIcon={true}
									width={'100%'}
									value = {getOne.billDate}
									form={this.props.form}
									validate={true}
									name={'billDate'}
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(201018/*价格控制日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									showTime={false}
									isShowIcon={true}
									width={'100%'}
									form={this.props.form}
									validate={true}
									value ={getOne.priceControlDate}
									name={'priceControlDate'}
									onChangeTime ={this.dataChang}
								/>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100311/*客户*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								fieldName='salBeId'
									apiUri='/customer/search'
								onChange={this.clientSelect}
									async={true}
											apiParams='keyword'
											initialValue={getOne["salBe"+language]?{s_label:getOne["salBe"+language], salBeId:getOne.salBeId, salBeLcName:getOne.salBeLcName, salBeEnName:getOne.salBeEnName}:undefined}
											valueKeys={ da => ({
												 salBeId: da.id,
												 salBeLcName: da.localName,
												 salBeEnName: da.name,
												 s_label: da.localName
											})} rules={true}
									 disabled={getOne.salBeId?true:false}
								 />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500125/*货币*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Curren'}
                                                 }} fieldName="cnyId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["cny"+language], getOne, ['cnyId', 'cnyLcName', 'cnyEnName'], "cny"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     cnyId: da.id,
                                                     cnyLcName: da.localName,
                                                     cnyEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />

						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200708/*客户采购员*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue("salBeId",getOne).salBeId)}
                                                 refreshMark={getFieldValue('salBeId', {}).salBeId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/entContact/getByBeIdDataTyId',
                                                     params: {beId: getFieldValue("salBeId",getOne).salBeId,dataTyId:100}
                                                 }} fieldName="cusLinkId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["cusLink"+language], getOne, ['cusLinkId', 'cusLinkLcName', 'cusLinkEnName'],"cusLink"+language, this.props.form)
                                                }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     cusLinkId: da.id,
                                                     cusLinkLcName: da.localName,
                                                     cusLinkEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles ={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200709/*客户操作员*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue("salBeId",getOne).salBeId)}
                                                 refreshMark={getFieldValue("salBeId",getOne).salBeId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/entContact/getByBeIdDataTyId',
                                                     params: {beId: getFieldValue("salBeId",getOne).salBeId,dataTyId:100}
                                                 }} fieldName="cusOLinkId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["cusOLink"+language]&&getFieldValue('salBeId', {}).salBeId === getOne.salBeId?{s_label:getOne["cusOLink"+language],cusOLinkId:getOne.cusOLinkId,cusOLinkLcName:getOne.cusOLinkLcName,cusOLinkEnName:getOne.cusOLinkEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     cusOLinkId: da.id,
                                                     cusOLinkLcName: da.localName,
                                                     cusOLinkEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={getFieldError('cusLinkId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const ProductForm =Addnormal;
export default ProductForm;
