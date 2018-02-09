import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option ,ConstMiniSelect } from '../../../../components/Select';
import DataTime from '../../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import  SelectChange from "../../../../components/SelectChange";
import xt from '../../../../common/xt'; // 下拉
class Addnormal extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.productClick=this.productClick.bind(this);
		this.bizhongClick=this.bizhongClick.bind(this);
		this.pinpaiClick=this.pinpaiClick.bind(this);
		this.gongyingshangClick=this.gongyingshangClick.bind(this);
		this.wuliaoClick=this.wuliaoClick.bind(this);
		this.state=this.initState();
		this.btnClick =this.btnClick.bind(this);
	}
	btnClick(){
		this.props.btnClick(this.props.form.getFieldsValue());
	}
	initState(){
		return {
			radioState:'',
			radioAddress:'',
			data:{},
			info:[],
			cangkuArray:[],
			productArray:[],
			bizhongArray:[],
			pinpaiArray:[],
			gongyingshangArray:[],
			wuliaoArray:[],
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
	productClick(e){
		var that = this;
		apiGet(API_FOODING_DS,'/material/search',{keyword:''},
			(response)=>{
				that.setState({
					productArray:response.data
				})
		},(error)=>{

		});
	}
	bizhongClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Curren'},
		(response)=>{
				that.setState({
					bizhongArray:response.data
				})
		},(error)=>{

		});
	}
	pinpaiClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Brand'},
		(response)=>{
				that.setState({
					pinpaiArray:response.data
				})
		},(error)=>{

		});
	}
	gongyingshangClick(mtlId,item){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Vendor'},
		(response)=>{
				that.setState({
					gongyingshangArray:response.data
				})
		},(error)=>{

		});

	}
	wuliaoClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.MaterialStatus'},
		(response)=>{
				that.setState({
					wuliaoArray:response.data
				})
		},(error)=>{

		});
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
	render(){
		const {radioAddress, radioState,data} = this.state;
		let {getNFieldProps,getFieldProps,getFieldError,getFieldValue }= this.props.form;
		let {getOne} = this.props;
		let title = {title_1:i18n.t(100315/*约会目的*/),title_2:i18n.t(400005/*约会地址*/)}
		return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span>{i18n.t(100138/*常规*/)}</span>
					<span onClick={this.saveClick.bind(this,null)}><i className={'foddingicon fooding-save'}></i></span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400048/*单据编号*/)}</label>
							<input 
											    type="text"
												{...getFieldProps('no',{
												validateFirst: true,
												rules: [{required:true}],
												initialValue: String(getOne.no || '')})}
												className={'col-xs-8 col-md-8 text-input-nowidth'} 
												disabled = {true}
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime 
									isShowIcon={true}
									showTime={false}
									width={'100%'}
									name={'billDate'}
									value={getOne.billDate}
									form={this.props.form} 
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400049/*业务状态*/)}</label>
							<Select
								{...getNFieldProps('status',{
										                    rules: [{required:true}],
										                    initialValue:getOne.status?{s_label:getOne.statusName,status:getOne.status}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
										                disabled={true}							
							>	
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500143/*集团组织*/)}</label>
							<Select 
									{...getNFieldProps('clusterId',{
										rules: [{required:true}],
										initialValue:getOne["cluster"+language]?{s_label:getOne["cluster"+language], clusterId:getOne.clusterId, clusterLcName:getOne.clusterLcName, clusterEnName:getOne.clusterEnName}:undefined
									 })}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
									disabled
								>	
							</Select>
						</div>						
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue("clusterId", {}).clusterId)}
                                                 refreshMark={getFieldValue("clusterId", {}).ccId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_ES, uri: '/party/getLoginCompanies',
                                                     params: {clusId: getFieldValue("clusterId", {}).clusterId}
                                                 }} fieldName="ccId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne["cc"+language], getOne, ['ccId', 'ccLcName', 'ccEnName'], 'cc'+language, this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     ccId: da.id,
                                                     ccLcName: da.localName,
                                                     ccEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500144/*营运组织*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean(  getFieldValue("ccId", {}).ccId)}
                                                 refreshMark={ getFieldValue("ccId", {}).ccId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_ES, uri: '/party/getPartysByType',
                                                     params: {partyId:getFieldValue("ccId", {}).ccId,typeAttributeIds:["43"]}
                                                 }} fieldName="plantId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne["plant"+language], getOne, ['plantId', 'plantLcName', 'plantEnName'], 'plant'+language, this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     plantId: da.id,
                                                     plantLcName: da.localName,
                                                     plantEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400145/*职员*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue("plantId", {}).plantId)}
                                                 refreshMark={getFieldValue("plantId", {}).plantId}
                                                 pbj={{
                                                      apiType: apiGet, host: API_FOODING_ES, uri: '/user/getListForPermissionsInParty',
                                                     params: {partyId: getFieldValue("plantId", {}).plantId,typeAttributeIds:609}
                                                 }} fieldName="staffId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne['staff'+language] && getOne.plantId === getFieldValue('plantId', {}).plantId, getOne, ['staffId', 'staffLcName', 'staffEnName'], 'staff'+language, this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     staffId: da.refId,
                                                     staffLcName: da.staffLocalName,
                                                     staffEnName: da.staffEnName,
                                                     s_label: da["staffLocalName"]
                                                 }}>{da.staffLocalName}</Option>}
                                                 reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />
						</div>						
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400025/*仓库*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue("plantId", {}).plantId)}
                                                 refreshMark={getFieldValue("plantId", {}).plantId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.StorLocatn',
		                                                     queryParams:[{
		                                                     				attr:'plntId',
		                                                     				expression:'=',
		                                                     				value:getFieldValue("plantId", {}).plantId
		                                                     			}]
                                                	 }
                                                 }} fieldName="slId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne["sl"+language], getOne, ['slId', 'slLcName','slEnName'], 'sl'+language, this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     slId: da.id,
                                                     slLcName: da.localName,
                                                     slEnName: da.name,
                                                     s_label: da["localName"]
                                                 }}>{da.localName}</Option>} 
                                                 reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400026/*库区*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue("slId", {}).slId)}
                                                 refreshMark={getFieldValue("slId", {}).slId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.StorArea',
		                                                     queryParams:[{
		                                                     				attr:'slid',
		                                                     				expression:'=',
		                                                     				value:getFieldValue("slId", {}).slId
		                                                     			}]
                                                	 }
                                                 }} fieldName="stId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne["st"+language], getOne, ['stId', 'stLcName', 'stEnName'], 'st'+language, this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     stId: da.id,
                                                     stLcName: da.localName,
                                                     stEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8 '}	
                                                 allowClear						
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400027/*储位*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue("stId", {}).stId)}
                                                 refreshMark={getFieldValue("stId", {}).stId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.SlBin',
		                                                     queryParams:[{
		                                                     				attr:'slAid',
		                                                     				expression:'=',
		                                                     				value:getFieldValue("stId", {}).stId
		                                                     			}]
                                                	 }
                                                 }} fieldName="slspId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne["st"+language], getOne, ['slspId','slspLcName','slspEnName'], 'slsp'+language, this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     slspId: da.id,
                                                     slspLcName: da.localName,
                                                     slspEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8 '}
                                                 allowClear							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100379/*产品*/)}</label>
							<Select
														animation='slide-up'
														placeholder=''
														className ={ 'col-md-8 col-lg-8 currency-btn select-from-currency '}
														choiceTransitionName="rc-select-selection__choice-zoom"
														optionLabelProp="children"
														allowClear
														onClick={this.productClick}
														{...getNFieldProps('mtlId',{
															initialValue:getOne["mtl"+language]?{s_label:getOne["mtl"+language], mtlId:getOne.uomId, mtlLcName:getOne.mtlLcName, mtlEnName:getOne.uomEnName}:undefined,

														})}
														>
														{this.state.productArray.map((o,i)=><Option key={i} objValue={{
																s_label:o.localName,
																 mtlId: o.id, 
																 mtlLcName:o.localName, 
																 mtlEnName:o.enName
															}} title={o.name}>{o.localName}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500125/*货币*/)}</label>
							<Select
														animation='slide-up'
														placeholder=''
														className ={'col-md-8 col-lg-8 currency-btn select-from-currency '}
														choiceTransitionName="rc-select-selection__choice-zoom"
														optionLabelProp="children"
														onClick={this.bizhongClick}
														allowClear
														{...getNFieldProps('purCnyId',{
															initialValue:getOne["purCny"+language]?{s_label:getOne["purCny"+language], purCnyId:getOne.purCnyId, purCnyLcName:getOne.purCnyLcName, purCnyEnName:getOne.purCnyEnName}:undefined,

														})}
														>
														{this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{
															s_label:o.localName, 
															purCnyId:o.id, 
															purCnyLcName:o.localName, 
															purCnyEnName:o.name
														}} title={o.name}>{o.localName}</Option>)}
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400012/*品牌*/)}</label>
							<Select
														animation='slide-up'
														placeholder=''
														className ={'col-md-8 col-lg-8 currency-btn select-from-currency '}
														choiceTransitionName="rc-select-selection__choice-zoom"
														optionLabelProp="children"
														allowClear
														onClick={this.pinpaiClick}
														{...getNFieldProps('brandId',{
															initialValue:getOne["brand"+language]?{s_label:getOne["brand"+language], brandId:getOne.brandId, brandLcName:getOne.brandLcName, brandEnName:getOne.brandEnName}:undefined,

														})}
														>
														{this.state.pinpaiArray.map((o,i)=><Option key={i} objValue={{
															s_label:o.localName,
															 brandId:o.id, 
															 brandLcName:o.localName,
															  brandEnName:o.name
														}} title={o.name}>{o.localName}</Option>)}
													</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400028/*原供应商*/)}</label>
							<Select
														animation='slide-up'
														placeholder=''
														className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
														choiceTransitionName="rc-select-selection__choice-zoom"
														optionLabelProp="children"
														allowClear
														onClick={this.gongyingshangClick}
														{...getNFieldProps('vndBeId',{
															initialValue:getOne["vnd"+language]?{s_label:getOne["vnd"+language], vndBeId:getOne.vndBeId, vndBeLcName:getOne.vndBeLcName, vndBeEnName:getOne.vndBeEnName}:undefined,

														})}
														>
														{this.state.gongyingshangArray.map((o,i)=><Option key={i} objValue={{
															s_label:o.localName,
															vndBeId:o.id,
															vndBeLcName:o.localName,
															vndBeEnName:o.name
														}} title={o.name}>{o.localName}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400030/*物料状态*/)}</label>
							<Select
														animation='slide-up'
														placeholder=''
														className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
														choiceTransitionName="rc-select-selection__choice-zoom"
														optionLabelProp="children"
														allowClear
														onClick={this.wuliaoClick}
														{...getNFieldProps('mStatsId',{
															initialValue:getOne["vnd"+language]?{s_label:getOne["vnd"+language], mStatsId:getOne.mStatsId, mStatsLcName:getOne.mStatsLcName, mStatsEnName:getOne.mStatsEnName}:undefined,

														})}
														>
														{this.state.wuliaoArray.map((o,i)=><Option key={i} objValue={{
															s_label:o.localName,
														 	mStatsId:o.id,
														 	mStatsLcName:o.localName,
														 	mStatsEnName:o.name
														 }} title={o.name}>{o.localName}</Option>)}
							</Select>
						</div>
					</div>
					<button onClick = {this.btnClick} style={{borderRadius:'4px',width:'77px',height:'28px',textAlign:'center',border:'1px solid #7bb0e5',background:'#ffffff',color:'#7bb0e5'}}>{i18n.t(200412/*查看库存*/)}</button>
				</div>
			</div>
		)
	}
}

export default Addnormal;
