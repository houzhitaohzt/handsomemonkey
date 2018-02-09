import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
import xt from '../../../common/xt';
import Select, { Option ,ConstMiniSelect ,ConstVirtualSelect} from '../../../components/Select/';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,API_FOODING_OA,API_FOODING_HR,getUser,language,pageSize,sizeList,commonAjax} from '../../../services/apiCall';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';
import Checkbox from "../../../components/CheckBox";
import AddMoreLanguage from "../../../components/AddMoreLanguage";
import i18n from './../../../lib/i18n';
import {I18n} from "../../../lib/i18n";
import Dialog from '../../../components/Dialog/Dialog';//弹层
export class ComplaintManagementPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.state ={
			info:{},
            fileList:[], //文件列表
            no:props.checkedData.no || ""
		}
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(this.props.DialogContent == 1){
					let params = this.props.form.getFieldsValue();
					delete params['optlock'];
					delete params['nameValues'];
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				}this.props.form.resetFields();
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
    /**
     * 拉取上传文件列表
     * */
    getFileRadioList = () => {
        let that = this;
        apiGet(API_FOODING_OA, '/fastdfs/getList', {businessId: this.state.no, businessType: "card-file-oa"}, response => {
            let fileList = response.data.data || [];
            that.setState({fileList})
        }, error => ServiceTips({text: error.message, type: 'error'}))
    };

    renderFileDown = () => {
        return (<div className="file-down">
            {
                this.state.fileList.map((e, i) => {
                    return (
                        <div className="file-down-own" key={i}>
                            <div className="word">
                                <h4>{e.fileName}</h4>
                                <h5>{e.length || "0KB"}</h5>
                            </div>
                            <a href={API_FOODING_OA + "/fastdfs/download?fileName=" + e.fileName + "&fullPath=" + e.fullPath}><i
                                className='foddingicon fooding-download2'></i></a>
                        </div>
                    )
                })
            }
        </div>)
    };
    componentDidMount(){
        this.getFileRadioList();
    };
	render(){

		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {checkedData} = this.props;
		let content = <div></div>;
		if(this.props.DialogContent==5){
			content = (
				<div className={'girdlayout scroll'} style={{overflow:'auto'}}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(400256/*申述类型*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
                                <p>{checkedData.explainTypeName || ""}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(400257/*班次信息*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.schduleName || ""}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(400258/*打卡信息*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.newDate || ""}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>申诉原因</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.remark || ""}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-4 col-md-4'}>申诉人</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>{checkedData.applyLcName || ""}</p>
								</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>申诉日期</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.scheduleDate || ""}</p>
							</div>
						</div>
					</div>
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-4 col-md-4'}>处理结果</label>
                            <div className={'col-xs-8 col-md-8'}>
                                <p>{checkedData.statusName || ""}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-4 col-md-4'}>附件</label>
                            <div className={'col-xs-8 col-md-8'}>
                                <div>{this.renderFileDown()}</div>
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
					onSaveAndClose={this.onSaveAndClose}
					onCancel={this.onCancel}
					onSaveAdd={this.onSaveAdd}
					showSaveAdd={this.props.showSaveAdd}
					showSaveClose={this.props.showSaveClose}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(ComplaintManagementPlug);
export default ProductForm;
