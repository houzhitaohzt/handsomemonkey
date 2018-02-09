import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
import Radio from '../../../../../components/Radio';
import AddSelect from '../../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../../components/Dialog/Confirm';
import Calendar from  '../../../../../components/Calendar/Calendar';
import {toForm} from  '../../../../../common/toForm';
// common 
import ServiceTips from '../../../../../components/ServiceTips'; // 提示
import Select, {Option ,ConstVirtualSelect } from '../../../../../components/Select';
import xt from '../../../../../common/xt'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,toDecimal} from '../../../../../services/apiCall';
import Input from '../../../../../components/FormValidating/FormValidating';
import {I18n} from '../../../../../lib/i18n';
export class SploadcostPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this); // 保存
		this.onCancel = this.onCancel.bind(this)
		this.wuliaoClick =this.wuliaoClick.bind(this)  //物料状态
		this.cangkuClick= this.cangkuClick.bind(this); //仓库
		var that = this;
		this.state=this.initState();
		this.onSelect=this.onSelect.bind(this);
	}
	initState(){
		return {
			datas:{},
			info:[],
			wuliaoArray:[],
			cangkuArray:[],
			time:undefined
		}
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSelect(slId,item){
		var that = this;
		//let getOne = this.props.getOne;
		let datas = this.props.datas;
		apiGet(API_FOODING_DS, '/storLocatn/getOne', {id: item.props.objValue.receSlId}, response => {
			let thirdMark = response.data.stroTyId == 20?true:false;
        datas = Object.assign({},datas,{thirdMark:thirdMark});
        	this.props.qiehuan(thirdMark);
           that.props.setGetOne(datas);
        }, error => {
        })

	}
	cangkuClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.StorLocatn'},
		
			(response)=>{
				that.setState({
					cangkuArray:response.data
				})
		},(error)=>{

		});
	}
	//选择生产日期
	datachang = data => {
	
		if(!data) return;
		let info = this.props.info || {}
		if(!info.mtl.vndBeId) return;
		apiForm(API_FOODING_DS,"/beMtl/countExpirationDate",{createDate:data,mtlId:info.mtl.mtlId,sourceId:info.mtl.vndBeId},response => {
			this.setState({ 
				time:response.data || undefined
			})
		// 	//this.props.form.setFieldsValue({"wtUomId":{wtUomId:getOne.weight&&getOne.weight.id || "",s_label:getOne.weight&&getOne.weight.name || ""},volUomId:{volUomId:getOne.volume && getOne.volume.id ||'',s_label:getOne.volume && getOne.volume.name ||''},netWtNum:getOne.lodWtNum || "",grosWtNum:parseInt(getOne.netWtNum + getOne.lodWtNum) ||'',volNum:getOne.volNum ||'',wrapgWtnum:getOne.netWtNum || ''});
		},error => ServiceTips({text:error.message,type:error}))
	}
	// 保存
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_ERP,'/noticestock/inStock',value,
					(response)=>{							
						ServiceTips({text:response.message,type:'success'});
						that.props.form.resetFields(); // 清除表单
						that.props.onSaveAndClose(); // 关闭弹框
						this.props.getList(); // 刷新列表
						this.props.getInit(); // 刷新getOne
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})
		
	}
	// 取消
	onCancel(){
		this.props.form.resetFields(); // 清除表单
		this.props.onSaveAndClose(); // 关闭弹框
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
	render(){
		let that = this;
		let {getNFieldProps,getFieldProps,getFieldError,getFieldValue }= this.props.form;
		let {checkedData} = this.props;
		let info = this.props.info || {}
		let datas = this.props.datas;
		let time= this.state.time;
		let content = <div></div>;
		let a =  getFieldValue("receSlId", {}).receSlId || datas.slId;
		getFieldProps('billId', {
							            	validateFirst: true,
						                    initialValue:info.mtl?info.mtl.billId:''
			})
			getFieldProps('billDtlId', {
							            	validateFirst: true,
						                    initialValue:info.mtl?info.mtl.billDtlId:''
			})
			getFieldProps('billType', {
							            	validateFirst: true,
						                    initialValue:info.mtl?info.billType:''
			})
			getFieldProps('mtlId', {
							            	validateFirst: true,
						                    initialValue:info.mtl?info.mtl.mtlId:''
			})
			getFieldProps('uomId', {
							            	validateFirst: true,
						                    initialValue:info.mtl?info.mtl.uomId:''
			})
			getFieldProps('eqBasnum', {
							            	validateFirst: true,
						                    initialValue:info.mtl?info.eqBasnum:''
			})	

			let abc = getNFieldProps('instock[0].abc',{
						rules: [{required:true}],
						initialValue:'',

					});
		let common ;
		if(datas.thirdMark==false){
						common = (
								<div className={'row'}>
									<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-4 col-lg-4'}>{I18n.t(400026/*库区*/)}</label>
													<ConstVirtualSelect form={this.props.form}
																		isRequest={ Boolean(a)}
						                                                 refreshMark={a}
						                                                 apiType={apiPost}
												                         apiParams={{
												                            obj:'com.fooding.fc.ds.entity.StorArea',
								                                             queryParams:[{
							                                                     				attr:'slid',
							                                                     				expression:'=',
							                                                     				value:a
								                                                     	}]
												                         }}
						                                                 fieldName="instock[0].stId"
						                                                 initialValue={xt.initSelectValue(info['st'+language], info, ['stId', 'stLcName', 'stEnName'], 'st'+language, this.props.form)}
						                                                 valueKeys = {da => ({
						                                                 	stId: da.id,
						                                                     stLcName: da.localName,
						                                                     stEnName: da.name,
						                                                     s_label: da.localName
						                                                 })}
						                                                 rules={true}
						                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}						
						                                />
								    </div>
								    <div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{I18n.t(400027/*储位*/)}</label>
										<ConstVirtualSelect form={this.props.form}
															isRequest={getFieldValue("instock[0].stId", {}).stId}
			                                                 refreshMark={getFieldValue("instock[0].stId", {}).stId}
			                                                 apiType={apiPost}
			                                                 apiHost={API_FOODING_DS}
									                         apiUri='/object/getMiniList'
									                         apiParams={{
									                            obj:'com.fooding.fc.ds.entity.SlBin',
					                                            queryParams:[{
					                                                     				attr:'slAid',
					                                                     				expression:'=',
					                                                     				value:getFieldValue("instock[0].stId", {}).stId
					                                                     	}]
									                           
									                         }}
			                                                 fieldName="instock[0].slspId"
			                                                 initValueOptions={[]}
			                                                 initialValue={xt.initSelectValue(info['slsp'+language], info, ['slspId','slspLcName','slspEnName'], 'slsp'+language, this.props.form)}
			                                                 valueKeys = {da => ({
			                                                     slspId: da.id,
			                                                     slspLcName: da.localName,
			                                                     slspEnName: da.name,
			                                                     s_label: da.localName
			                                                 })}
			                                                 rules={true}
			                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}						
			                                />
									</div>
								</div>
								)
				}
		if(this.props.DialogContent == 1){
           content = (
           <div className={'  girdlayout'} style={{height:"344px",overflow:'hidden'}}>
						  	<div className={'row'}>
									<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(400025/*仓库*/)}</label>
													<Select 
														{...getNFieldProps('receSlId',{
																                    rules: [{required:true}],
																                    initialValue:datas["sl"+language]?{s_label:datas["sl"+language], receSlId:datas.slId, receSlLcName:datas.slLcName, receSlEnName:datas.slEnName}:undefined
																                })}
																                placeholder=''
																                optionLabelProp="children"							
																                className ={getFieldError('slId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
																                onClick={this.cangkuClick}
																                onSelect={this.onSelect}
																                allowClear={false}
														>	
																                {this.state.cangkuArray.map((o,i)=>
																                	<Option key={i} 
																                	objValue={{
																                		s_label:o.localName, 
																                		receSlId: o.id, 
																                		receSlLcName :o.localName, 
																                		receSlEnName: o.name
																                	}} title={o.name}>{o.localName}</Option>)}
													</Select>
													
									</div>
									<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(500150/*操作数量*/)}</label>
													<Input form={this.props.form} obj={{name:'instock[0].nums',type:'text',
														initialValue:'',
														classn:'col-md-8 col-lg-8 text-input-nowidth'}}
													/>
								</div>
							</div>
							{common}
							<div className={'row'}>
								                
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(500151/*批次号*/)}</label>
													<Input form={this.props.form} obj={{name:'instock[0].batchNo',type:'text',
														initialValue:'',
														classn:'col-md-8 col-lg-8 text-input-nowidth'}}
													/>
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(500152/*生产日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar 
															isShowIcon={true}
															showTime={true}
															width={'100%'}
															name={'instock[0].cdate'}
															form={this.props.form}
															validate={true}
															onChangeTime={this.datachang}

														/>
													</div>
												</div>		
							</div>
							<div className={'row'}>
								                
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(400029/*过期日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar 
															isShowIcon={true}
															showTime={false}
															width={'100%'}
															name={'instock[0].shelfEdate'}
															form={this.props.form}
															validate={true}
															value={time?time:undefined}
														/>
													</div>
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(400030/*物料状态*/)}</label>
													<Select
														animation='slide-up'
														placeholder=''
														className ={getFieldError("instock[0].abc") ?'currency-btn select-from-currency col-md-8 col-lg-8  error-border':'currency-btn select-from-currency col-md-8 col-lg-8 '}
														choiceTransitionName="rc-select-selection__choice-zoom"
														optionLabelProp="children"
														onClick={this.wuliaoClick}
														onChange={abc.onChange}
														value={abc.value}
														allowClear={false}
														>
														{this.state.wuliaoArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, mStatsId:o.id, mStatsLcName:o.localName, mStatsEnName:o.name}} title={o.name}>{o.name}</Option>)}
													</Select>
												</div>
							</div>
						</div>
           	);
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						<div className={'  girdlayout'} style={{height:"344px",overflow:'hidden'}}>
							<div className={'row'}>
								                <div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-4 col-md-4'}>{I18n.t(100379/*产品*/)}</label>
													<p className={'col-xs-8 col-md-8'}>{info.mtl?info.mtl['mtl'+language]:''}</p>
														
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-4 col-md-4'}>{I18n.t(500154/*入库数量/已操作数量*/)}</label>
													<p className={'col-xs-8 col-md-8'}>{info.mtl?info.mtl.qty:''}/{info.mtl?info.mtl.hasBeenQty:''}</p>
							
												</div>
							</div>
							<div className={'row'}>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-4 col-md-4'}>{I18n.t(400035/*产品单位*/)}</label>
													<p className={'col-xs-8 col-md-8'}>{info.mtl?info.mtl['uom'+language]:''}</p>
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-4 col-md-4'}>{I18n.t(500141/*采购单价*/)}</label>
													<p className={'col-xs-8 col-md-8'}>{info.mtl?toDecimal(info.mtl.purTaxPrc):''} {info.mtl?info.mtl['purCny'+language]:''}</p>
												</div>
												


							</div>
							
						{content}
						</div>
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(SploadcostPlug);
export default ProductForm;
