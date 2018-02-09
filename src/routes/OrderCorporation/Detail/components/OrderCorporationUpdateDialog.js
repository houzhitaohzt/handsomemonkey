import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层


import {I18n} from '../../../../lib/i18n';


// common
import Select, { Option } from '../../../../components/Select'; // 下拉
import Calendar from  '../../../../components/Calendar/Calendar';


// ajax
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,commonAjax} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';



class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
	}

	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func,
		initData:PropTypes.object
	}

	initState(){
		return {
			initData:{},
		}
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}
	componentDidMount(){

	}
	onSaveAndClose(){
        let that = this;
        const {form, getPage} = that.props;
        form.validateFields((errors, value) => {
            if(errors){
            }else{
                apiForm(API_FOODING_ERP,'/ordercredit/updateStatus',Object.assign({billId:that.props.getOneData.billId},value),
                    (response)=>{
                        ServiceTips({text:response.message,type:'success'});
						that.props.onSaveAndClose();
                    },(errors)=>{
                        ServiceTips({text:errors.message,type:'error'});
                });
            }
        });
	}

	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	render(){
		const {form,data,getOneData} = this.props;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();

        // 保存 参数



		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
				<div className={'girdlayout'} style={{height:"105px"}}>
					<div className={'row'}>
						<div className="form-group col-md-12">
							<label className={'col-md-3'}><span>*</span>{i18n.t(200518/*信保状态*/)}</label>
							<Select
								{...getNFieldProps('finStatus',{
								    initialValue: String(getOneData['finStatus'])
								})}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								className ={'currency-btn select-from-currency col-md-8'}
							>
								<Option key={0} value={'10'} title={i18n.t(200494/*未投*/)}>{i18n.t(200494/*未投*/)}</Option>
								<Option key={1} value={'15'} title={i18n.t(200799/*已投*/)}>{i18n.t(200799/*已投*/)}</Option>
								<Option key={2} value={'20'} title={i18n.t(200800/*报损*/)}>{i18n.t(200800/*报损*/)}</Option>
								<Option key={3} value={'25'} title={i18n.t(200801/*理赔*/)}>{i18n.t(200801/*理赔*/)}</Option>
								<Option key={4} value={'30'} title={i18n.t(200619/*已处理*/)}>{i18n.t(200619/*已处理*/)}</Option>
								<Option key={5} value={'35'} title={i18n.t(500322/*已收汇*/)}>{i18n.t(500322/*已收汇*/)}</Option>
							</Select>
						</div>
						{/*<div className="form-group col-md-12">
							<label className={'col-md-3'}>{i18n.t(200488*//*资信报告*//*)}</label>
							<Select
								{...getNFieldProps('creReportfinStatus',{
								    initialValue: '1'
								})}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								className ={'currency-btn select-from-currency col-md-8'}
							>
								<Option key={0} value={'1'} title={i18n.t(200489*//*已做资信*//*)}>{i18n.t(200489*//*已做资信*//*)}</Option>
								<Option key={1} value={'5'} title={i18n.t(200490*//*已批资信*//*)}>{i18n.t(200490*//*已批资信*//*)}</Option>
							</Select>
						</div>
						<div className="form-group col-md-12">
							<label className={'col-md-3'}>{i18n.t(200491*//*申请日期*//*)}</label>
							<div className={'col-md-8'}>
								<Calendar
									width={'100%'}
									showTime = {false}
									isShowIcon={true}
									form={this.props.form}
									validate={false}
									className ={'col-md-8'}
									name={'billDate'}
									onChangeTime={this.changeStartTime}
								/>
							</div>
						</div>

						<div className="form-group col-md-12">
							<label className={'col-md-3'}>{i18n.t(200492*//*已批复限额*//*)}</label>
							<input type="text"
								{...getFieldProps('replyAmt',{
									initialValue: ''
								})}
								placeholder=""
								className ={'col-md-8 text-input-nowidth'}
							/>
						</div>
						<div className="form-group col-md-12">
							<label className={'col-md-3'}>{i18n.t(200493*//*已批复天数*//*)}</label>
							<input type="text"
								{...getFieldProps('appCreTerm',{
									initialValue: ''
								})}
								placeholder=""
								className ={'col-md-8 text-input-nowidth'}
							/>
						</div>
						<div className="form-group col-md-12">
							<label className={'col-md-3'}>LCSWIFT</label>
							<input type="text"
								{...getFieldProps('LCSWIFT',{
									initialValue: ''
								})}
								placeholder=""
								className ={'col-md-8 text-input-nowidth'}
							/>
						</div>												*/}
					</div>
				</div>
			</FormWrapper>);
	}
}

const OrderCorporationUpdate = createForm()(CommonForm);

export default OrderCorporationUpdate;
