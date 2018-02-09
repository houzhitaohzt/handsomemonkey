import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
//引入select插件
//引入table
import Table from "../../../../components/Table";
//引入分页
import Page from "../../../../components/Page";
import DataTime from '../../../../components/Calendar/Calendar';
import Select, {Option,ConstMiniSelect} from '../../../../components/Select';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import xt from '../../../../common/xt'; // 下拉
class Record extends Component{
	constructor(props){
		super(props)
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
		var that = this;
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
	}
	onSaveAndClose(){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				this.props.onSaveAndClose(value);
			}

    	});
	}
	deleteClick(record,e){
		let that = this;
		if(this.props.selectData.length == 1){
			ServiceTips({text:i18n.t(200833/*只有一条数据，不能进行删除*/)});
		}else {
			let tempString=i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/);
			Confirm(tempString, {
			  done: () => {
		            that.props.deleteClick(record,e);


				},
				close:() => {
					console.log('no, close')
				}
			});
		}
	}
	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onCancel: PropTypes.func,
		columns_party:PropTypes.array,
		searchParty:PropTypes.func
	}
	initState(){
		var that = this;
		return {

		columns_party:[{
			title : i18n.t(500129/*源单编号*/),
			dataIndex : 'sourceNo',
			key : "sourceNo",
			width : '10%',
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400084/*收款单位*/),
			dataIndex : "receiptBe"+language,
			key : "receiptBe"+language,
			width : "20%",
			render(data,row,index){
				return <div className={'text-ellipsis'}>{data}</div>;
			}
		},{
			title : i18n.t(200841/*申请付款金额*/),
			dataIndex : "applyAmt",
			key : "applyAmt",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200819/*已付金额*/),
			dataIndex : "payAmt",
			key : "payAmt",
			width : "10%",
			render(data,row,index){
				return <div>{data?data:0}</div>;
			}
		},{
			title : i18n.t(200820/*未付金额*/),
			dataIndex : "money",
			key : "money",
			width : "10%",
			render(data,row,index){
				return <div>{row.applyAmt - row.payAmt}</div>;
			}
		},{
			title : i18n.t(100284/*币种*/),
			dataIndex : "cny"+language,
			key : "cny"+language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200817/*申请人*/),
			dataIndex : "payStaff"+language,
			key : "payStaff"+language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "10%",
			render(data,row,index){
				return <div><i className='foddingicon fooding-delete-icon4' onClick={that.deleteClick.bind(that,row)}></i></div>
			}
		}],
		tableSources:[],
		}
	}
	componentDidMount(){

	}

	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	render(){
		const {form,getOne} = this.props;
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let lbeId = that.props.selectData[0]?that.props.selectData[0].payCcId:undefined;
		const inputStar=(<span className={''}>*</span>);
		return (<FormWrapper showFooter={true}  onCancel={this.onCancel} onSaveAndClose={this.onSaveAndClose}>
					<div className=" scroll" style ={{maxHeight:'344px',overflowY:'auto'}}>
						<div className="common-party-table" style={{overflow:'hidden'}}>
							<Table
								columns={this.state.columns_party}
								data={this.props.selectData}
								checkboxConfig={{show:false}}
								colorFilterConfig={{show:false}}
								followConfig={{show:false}}
								prefixCls={"rc-confirm-table"}
								scroll={{x:false, y:210}}
							/>
						</div>
						<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-12 col-lg-12">
							<label className={'col-md-2 col-lg-2'}><span>*</span>{i18n.t(200814/*付款信息*/)}</label>
							<ConstMiniSelect form={this.props.form}
									isRequest={Boolean(getOne.cnyId&&lbeId)}
                                    refreshMark={getOne.cnyId+lbeId}
                                     pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri:'/bankacct/getList',
                                                     params: {sourceId:lbeId,curcyId:getOne.cnyId}
                                          }} fieldName="bankId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne["bank"+language], getOne, ['bankId', 'bankLcName', 'bankEnName','accountId','accountLcName','accountEnName'],()=>{
                                                 	return ''
                                                 }, this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     bankLcName: da.bankName,
                                                     bankEnName : da.bankName,
                                                     accountId :da.bacctCode,
                                                     accountEnName :da.bacctCode,
                                                     accountLcName:da.bacctCode,
                                                     s_label:da.bankName+(da.bacctCode?('+'+da.bacctCode):'')+(da.actStaff?('+'+da.actStaff):'')+(da.actAddres?('+'+da.actAddres):'')+(da.swiftCode?('+'+da.swiftCode):'')
                                                 }}>{da.bankName+(da.bacctCode?('+'+da.bacctCode):'')+(da.actStaff?('+'+da.actStaff):'')+(da.actAddres?('+'+da.actAddres):'')+(da.swiftCode?('+'+da.swiftCode):'')}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-10 col-lg-10'}
                            />
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200835/*开户币种*/)}</label>
								<ConstMiniSelect form={this.props.form}
	                                                 pbj={{
	                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
	                                                     params: {obj:'com.fooding.fc.ds.entity.Curren'}
	                                                 }} fieldName="cnyId"
	                                                 initValueOptions={[]}
	                                                 initialValue={
	                                                 	xt.initSelectValue(getOne["cnyName"], getOne, ['cnyId', 'cnyName'], "cnyName", this.props.form)
	                                                 }
	                                                 optionValue={(da, di) => <Option key={di} objValue={{
	                                                     cnyId: da.id,
	                                                     cnyName: da.localName,
	                                                     s_label: da.localName
	                                                 }}>{da.localName}</Option>} reles={true} disabled
	                                                 className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
	                            />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(200836/*应付金额*/)}</label>
								<input placeholder=''
								   type="text"
							        disabled
							        value={this.props.yinfuNum}
									className={'col-md-9 col-lg-9 text-input-nowidth'}
								 />
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200819/*已付金额*/)}</label>
							<input placeholder=''
								type="text"
								value={this.props.yifuNum}
						        disabled
								className={'col-md-9 col-lg-9 text-input-nowidth'}
							 />
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500063/*付款方式*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                     pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.PayTrmType'}
                                          }} fieldName="payTrmTyId"
                                                 initValueOptions={[]}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     payTrmTyId: da.id,
                                                     payTrmTyLcName: da.localName,
                                                     payTrmTyEnName: da.name,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
                            />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200827/*付款日期*/)}</label>
							<div className={'col-md-9 col-lg-9 datetime'}>
								<DataTime
									form={this.props.form}
									name={'billDate'}
									showTime={false}
									value={new Date()}
									isShowIcon={true}
									width={'100%'}
								/>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200615/*实付金额*/)}</label>
							<input placeholder=''
								   type="text" {...getFieldProps('toPayAmt', {
								   		validateFirst:true,
										rules:[{required:true}],
										valuedateTrigger:'onBlur',
						                initialValue:(this.props.yinfuNum-this.props.yifuNum)?(this.props.yinfuNum-this.props.yifuNum):0
						            })}
						            disabled
									className={getFieldError('toPayAmt')?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'}
							/>
						</div>
					</div>
					</div>
				</div>

					</div>
			</FormWrapper>);
	}
}

Record = createForm()(Record);

export default Record;
