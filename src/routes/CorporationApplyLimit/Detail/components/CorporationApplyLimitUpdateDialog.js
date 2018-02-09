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
			dataInit: {}, // 初始化数据

		}
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}
	componentDidMount(){
		this.getInit();
	}
	onSaveAndClose(){
        let that = this;
        const {form, getPage} = that.props;
        form.validateFields((errors, value) => {
            if(errors){
            }else{
                apiPost(API_FOODING_ERP,'/creditinslimit/updateStatus',Object.assign(that.props.getOneData,value),
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

	// init 
	getInit = ()=>{
		let that = this;
		apiGet(API_FOODING_ERP,'/creditinslimit/getOne',{billId: that.props.getOneData.billId},
			(response)=>{   				
				that.setState({dataInit: response['data']});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	render(){
		let {dataInit} = this.state;
		const {form,data,getOneData} = this.props;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		
        // 保存 参数 
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
				<div className={'scroll girdlayout'} style={{height:"260px",overflow:'auto'}}>
						<div className={'row'}>
							<div className="form-group col-md-12">
								<label className={'col-md-3'}>{i18n.t(200484/*信保额度申请*/)}</label>
								<Select
									{...getNFieldProps('status',{
										initialValue: String(dataInit['status'])
									})}
									placeholder=''
									optionLabelProp="children"
									optionFilterProp="children"
									className ={'currency-btn select-from-currency col-md-8'}
								>
									<Option key={0} value={'1'} title={i18n.t(300039/*草稿*/)}>{i18n.t(300039/*草稿*/)}</Option>
									<Option key={1} value={'5'} title={i18n.t(200485/*处理中*/)}>{i18n.t(200485/*处理中*/)}</Option>
									<Option key={2} value={'10'} title={i18n.t(400053/*已审批*/)}>{i18n.t(400053/*已审批*/)}</Option>
									<Option key={3} value={'15'} title={i18n.t(200486/*不予审批*/)}>{i18n.t(200486/*不予审批*/)}</Option>
									<Option key={4} value={'20'} title={i18n.t(200487/*已撤销*/)}>{i18n.t(200487/*已撤销*/)}</Option>
									<Option key={5} value={'25'} title={i18n.t(500040/*撤单*/)}>{i18n.t(500040/*撤单*/)}</Option>
								
								</Select>	
							</div>							
						</div>
						<div className={'row'}>
							<div className="form-group col-md-12">
								<label className={'col-md-3'}>{i18n.t(200488/*资信报告*/)}</label>
								<Select
									{...getNFieldProps('creReportStatus',{
										initialValue: String(dataInit['creReportStatus'] || '0')
									})}
									placeholder=''
									optionLabelProp="children"
									optionFilterProp="children"
									className ={'currency-btn select-from-currency col-md-8'}
								>
									<Option key={0} value={'0'} title={i18n.t(400051/*不限*/)}>{i18n.t(400051/*不限*/)}</Option>
									<Option key={1} value={'1'} title={i18n.t(200489/*已做资信*/)}>{i18n.t(200489/*已做资信*/)}</Option>
									<Option key={2} value={'5'} title={i18n.t(200490/*已批资信*/)}>{i18n.t(200490/*已批资信*/)}</Option>
								</Select>	
							</div>							
						</div>
						<div className={'row'}>
							<div className="form-group col-md-12">
								<label className={'col-md-3'}>{i18n.t(200491/*申请日期*/)}</label>
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
										value={dataInit['billDate'] || ''}
									/>
								</div>
							</div>							
						</div>
						<div className={'row'}>
							<div className="form-group col-md-12">
								<label className={'col-md-3'}>{i18n.t(200492/*已批复限额*/)}</label>
								<input type="text" 
									{...getFieldProps('replyAmt',{
                                        rules: [{required:true,}],
										initialValue: dataInit['replyAmt']?dataInit['replyAmt']:''
									})} 
									className ={getFieldError('replyAmt')?'col-md-4 text-input-nowidth error-border':'col-md-4 text-input-nowidth'}
								/>
							</div>							
						</div>
						<div className={'row'}>
							<div className="form-group col-md-12">
								<label className={'col-md-3'}>{i18n.t(200525/*信保余额*/)}</label>
								<input type="text" 
									{...getFieldProps('creditBal',{
                                        rules: [{required:true,}],
										initialValue: dataInit['creditBal']?dataInit['creditBal']:''
									})} 
									className ={getFieldError('creditBal')?'col-md-4 text-input-nowidth error-border':'col-md-4 text-input-nowidth'}
								/>
							</div>							
						</div>
						<div className={'row'}>
							<div className="form-group col-md-12">
								<label className={'col-md-3'}>{i18n.t(200493/*已批复天数*/)}</label>
								<input type="text" 
									{...getFieldProps('appCreTerm',{
										initialValue: dataInit['appCreTerm']?dataInit['appCreTerm']:''
									})} 

									className ={'col-md-8 text-input-nowidth'}
								/>
							</div>							
						</div>
						<div className={'row'}>
							<div className="form-group col-md-12">
								<label className={'col-md-3'}>LCSWIFT</label>
								<input type="text" 
									{...getFieldProps('lcswift',{  
										initialValue: dataInit['lcswift']?dataInit['lcswift']:''
									})} 
									placeholder=""
									className ={'col-md-8 text-input-nowidth'}
								/>
							</div>								
						</div>
					<div className={'row'}>
						<div className="form-group col-md-12">
							<label className={'col-md-3'}>{i18n.t(500207/*赔付比例*/)}</label>
							<input type="text"
                                   {...getFieldProps('compenScale',{
                                       initialValue: dataInit['compenScale']?dataInit['compenScale']:''
                                   })}
								   placeholder=""
								   className ={'col-md-8 text-input-nowidth'}
							/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-12">
							<label className={'col-md-3'}>{i18n.t(100336/*备注*/)}</label>
							<input type="text"
                                   {...getFieldProps('remark',{
                                       initialValue: dataInit['remark']?dataInit['remark']:''
                                   })}
								   placeholder=""
								   className ={'col-md-8 text-input-nowidth'}
							/>
						</div>
					</div>
					
				</div>
			</FormWrapper>);
	}
}

const CorporationApplyLimitUpdate = createForm()(CommonForm);

export default CorporationApplyLimitUpdate;

