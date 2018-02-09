import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
import xt from '../../../../common/xt';
import Select, { Option ,ConstMiniSelect ,ConstVirtualSelect} from '../../../../components/Select/';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList,commonAjax} from '../../../../services/apiCall';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import Calendar from  '../../../../components/Calendar/Calendar';
import Input from '../../../../components/FormValidating/FormValidating';
import Checkbox from "../../../../components/CheckBox";
import AddMoreLanguage from "../../../../components/AddMoreLanguage";
import {I18n} from "../../../../lib/i18n";
export class MyAttendancePlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.state ={
			info:{},
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
    renderConcatItem = (item, index)=> {
	    if( !item) return <div className='AttendanceResultsquery-calender-a2' key={index}/>;
        if(new Date(item.scheduleDate).getDay()==6||new Date(item.scheduleDate).getDay()==0)
            return (
                <div className='AttendanceResultsquery-calender-a2' key={index} style={{backgroundColor:'#F2F8FE'}}>
                    <div>{new Date(item.scheduleDate).Format('yyyy-MM-dd')}</div>
                    <span>{item.remark}</span>
                </div>
            )
        return (
           <div className='AttendanceResultsquery-calender-a2' key={index}>
                <div>{new Date(item.scheduleDate).Format('yyyy-MM-dd')}</div>
                <span>{item.remark}</span>
            </div>
        )
    };
	render(){
		let that = this;
        let { readerType } = this.state;
		const { getFieldProps, getFieldError } = this.props.form;
		let {checkedData,item, visible} = this.props;

		let content = <div></div>, moneyAry = [];
		if (checkedData && checkedData.length){
            moneyAry = Array((new Date(checkedData[0].scheduleDate)).getDay()).fill(null).concat(checkedData);
        }
		if(this.props.DialogContent==5){
			content = (
				<div className={'girdlayout scroll'} style={{overflow:'auto'}}>
                    {/*表格*/}
                    <div className="row">
                        <div className="form-group col-xs-5 col-md-5">
                            <div className="form-group col-md-4 squery-head">星期日</div>
                            <div className="form-group col-md-4 squery-head">星期一</div>
                            <div className="form-group col-md-4 squery-head">星期二</div>

                        </div>
                        <div className="form-group col-xs-7 col-md-7">
                            <div className="form-group col-md-3 squery-head">星期三</div>
                            <div className="form-group col-md-3 squery-head">星期四</div>
                            <div className="form-group col-md-3 squery-head">星期五</div>
                            <div className="form-group col-md-3 squery-head">星期六</div>
                        </div>
                    </div>
                    <div className="AttendanceResultsquery-calender-a1">
                        {moneyAry.map(this.renderConcatItem)}
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
const ProductForm =createForm()(MyAttendancePlug);
export default ProductForm;
