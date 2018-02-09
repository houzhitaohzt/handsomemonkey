import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option,ConstMiniSelect ,ConstVirtualSelect} from '../../../../components/Select';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import DataTime from  '../../../../components/Calendar/Calendar';
import Input from '../../../../components/FormValidating/FormValidating';
import Checkbox from "../../../../components/CheckBox";
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_HR} from '../../../../services/apiCall';
import Loading from "../../../../components/Loading";//加载动画
import ServiceTips from "../../../../components/ServiceTips";//提示框
import AddMoreLanguage from "../../../../components/AddMoreLanguage";
import {I18n} from "../../../../lib/i18n";
import xt from '../../../../common/xt';
import NameCheck from "../../../../components/InputBoxCheck/NameCheck";
import WebData from "../../../../common/WebData";
import Dialog from '../../../../components/Dialog/Dialog';
export class Productplug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
        this.state = {
            dialogContent : <div></div>,
            showDilaogsecond:false
        }

	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose,checkedData} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
                let param = this.props.form.getFieldsValue();
                let params = Object.assign({}, param, value,checkedData);
				if(this.props.DialogContent == 1){
					delete params['id'];
					delete params['optlock'];
					delete params['nameValues'];
				}
				apiPost(API_FOODING_HR,'/vacation/save',params,(response)=>{
						/*this.setState({
							rodalShow:!!isAdd
						})*/
						 ServiceTips({text:response.message,type:'success'});
						 this.props.onSaveAndClose(!!isAdd);
						 this.props.form.resetFields();
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});

				})



			}
		})
	}
	onSaveAdd(){
		this.onSaveAndClose(true);
	}
	onCancel(){
		const {form, onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}
    nativeClick = () => {
        let content=require('../../../MenuSetting/components/MoreLanguageSetDialog').default;
        let element=React.createElement(content,{onSaveAndClose:this.upload,
            menusetView:this.props.checkedData,
            apiHost:API_FOODING_DS,
            object:'vacation',
            onCancel:this.onCancelSecond})
        this.setState({
            showDilaogsecond : true,
            title: I18n.t(100496/*多语言配置*/),
            dialogContent: element
        })
    };

    upload = () => {

    };

    onCancelSecond = () => {
        this.setState({
            showDilaogsecond:false
        })
    }


	render(){
		let that = this;
        let {form} = this.props;
		const { getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;
		let {checkedData} = this.props;
      let ccLocalName = WebData.user.data.staff.company.localName;
        let ccenName  =   WebData.user.data.staff.company.enName;
        let Cid = WebData.user.data.staff.company.id;
        let clusterLocalName = WebData.user.data.staff.cluster.localName;
        let clusterenName  =   WebData.user.data.staff.cluster.enName;
        let clusId = WebData.user.data.staff.clusId;
		let content = <div></div>;

		if(this.props.DialogContent == 1){
           content = (
               /*新增*/
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>集团</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    apiHost={API_FOODING_ES}
                                    apiUri="/party/getLoginClusters"
                                    fieldName="cluster"
                                    initialValue={xt.initSelectValue(true, WebData.user.data.staff.cluster, ['cluster'], 'localName', form, true)}
                                    valueKeys={da => ({
                                        ...da,
                                        s_ignore_label: true
                                    })} disabled={true}
                                />
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>企业</label>
                                <ConstVirtualSelect
                                    apiHost={API_FOODING_ES}
                                    form={this.props.form}
                                    apiUri='/party/getLoginCompanies'
                                    apiParams={{clusId: WebData.user.data.staff.clusId}}
                                    rules={true}
                                    fieldName="company"
                                    initialValue={xt.initSelectValue(true, WebData.user.data.staff.company, ['company'], 'localName', form, true)}
                                    valueKeys={da => ({
                                        ...da,
                                        s_ignore_label: true
                                    })}
                                    disabled={true}

                                />
                            </div>
                        </div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>休假编号</label>
								<input type="text" className ={getFieldError("code") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
										{...getFieldProps('code',{
													initialValue:'',
													validateFirst: true,
													rules: [{required:true}]
										})}
								/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>休假名称</label>
                                <input type="text" className ={getFieldError("name") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getFieldProps('name',{
                                           initialValue:'',
                                           rules: [{required:true}]
                                       })}
                                />
                                <i className={'foddingicon fooding-nation_icon'} style={{position:'absolute',top:'9px',right:'10px',cursor:'pointer'}} onClick={this.nativeClick.bind(this)}></i>
                            </div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>规定天数</label>
                                <input type="text"
                                       {...getFieldProps('days', {
                                           initialValue: '',
                                           rules: [{pattern:xt.pattern.positiveInteger}]

                                       })}
                                       className={getFieldError('days')?'text-input-nowidth error-border col-md-8 col-lg-8':'text-input-nowidth col-md-8 col-lg-8'}
                                />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>备注</label>
                                <input type="text"
                                       className={'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getFieldProps('mark', {
                                           initialValue: ''
                                       })}
                                />
							</div>
							</div>

					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			checkedData = checkedData || {};
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.id:''
			})
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.optlock:''
			})
			getFieldProps('rowSts', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.rowSts:''
			})
			   content = (
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>集团</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    apiHost={API_FOODING_ES}
                                    apiUri="/party/getLoginClusters"
                                    fieldName="cluster"
                                    initialValue={xt.initSelectValue(true, WebData.user.data.staff.cluster, ['cluster'], 'localName', form, true)}
                                    valueKeys={da => ({
                                        ...da,
                                        s_ignore_label: true
                                    })} disabled={true}
                                />
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>企业</label>
                                <ConstVirtualSelect
                                    apiHost={API_FOODING_ES}
                                    form={this.props.form}
                                    apiUri='/party/getLoginCompanies'
                                    apiParams={{clusId: WebData.user.data.staff.clusId}}
                                    rules={true}
                                    fieldName="company"
                                    initialValue={xt.initSelectValue(true, WebData.user.data.staff.company, ['company'], 'localName', form, true)}
                                    valueKeys={da => ({
                                        ...da,
                                        s_ignore_label: true
                                    })}
                                    disabled={true}

                                />
                            </div>
                        </div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>休假编号</label>

								<input type="text"
                                       disabled={true}
                                       className ={getFieldError("code") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
										{...getFieldProps('code',{
													initialValue:checkedData?checkedData.code:'',
                                                    rules: [{required:true}]
										})}

								/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>休假名称</label>
                                <input type="text" className ={getFieldError("name") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getFieldProps('name',{
                                           initialValue:checkedData.name ? checkedData.name :'',
                                           rules: [{required:true}]
                                       })}
                                />
                                <i className={'foddingicon fooding-nation_icon'} style={{position:'absolute',top:'9px',right:'10px',cursor:'pointer'}} onClick={this.nativeClick.bind(this)}></i>

                            </div>

						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>规定天数</label>
                                <input type="text"
                                       {...getFieldProps('days', {
                                           initialValue: String(checkedData.days) || "",
                                           rules: [{pattern:xt.pattern.positiveInteger}]

                                       })}
                                       className={getFieldError('days')?'text-input-nowidth error-border col-md-8 col-lg-8':'text-input-nowidth col-md-8 col-lg-8'}
                                />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>备注</label>
                                <input type="text"
                                       className={'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getFieldProps('mark', {
                                           initialValue: checkedData.mark || ""
                                       })}
                                />
							</div>
							</div>
							<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>预置</label>
                                <Checkbox {...getNFieldProps('preset',{
                                    initialValue:checkedData&&checkedData.preset?checkedData.preset:false
                                })}
                                  checked={this.props.form.getFieldValue("preset")}
                                          disabled={true}
                                />
							</div>
						</div>
					</div>
			</div>
			)
		}else if (this.props.DialogContent == 5) {
            content = (
                <div className={'addnormal'} style={{marginBottom:'10px'}}>
                    <div className={'girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>休假编号</label>
                                <div className="col-md-8 col-md-8">
                                    <p>{checkedData.code || ""}</p>
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>休假名称</label>
                                <div className="col-md-8 col-md-8">
                                    <p>{checkedData.name || ""}</p>
                                </div>
                            </div>

                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>规定天数</label>
                                <div className="col-md-8 col-md-8">
                                    <p>{checkedData.days || ""}</p>
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>备注</label>
                                <div className="col-md-8 col-md-8">
                                    <p>{checkedData.mark || ""}</p>
                                </div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>预置</label>
                                <p>{checkedData.preset ? '是': '否'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
		return (
			<div className="package-action-buttons">
					<FormWrapper
					showFooter={true}
					buttonLeft = {this.props.buttonLeft}
					showSaveAdd={this.props.showSaveAdd}
					onSaveAndClose={this.onSaveAndClose}
					onCancel={this.onCancel}
					onSaveAdd={this.onSaveAdd}
					showSaveClose={this.props.DialogContent == 5 ? false : this.props.showSaveClose}
					>
						{content}
                        <Dialog width={976} visible={this.state.showDilaogsecond} title={this.state.title}>
                            {this.state.dialogContent}
                        </Dialog>
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(Productplug);
export default ProductForm;

