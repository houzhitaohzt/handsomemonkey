import i18n from './../../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, {Option} from '../../../../../components/Select';

import AddSelect from '../../../../../components/AddRadio/components/AddSelect';

export class  NewSalesTeam extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onSaveAndAdd=this.onSaveAndAdd.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.getData = this.getData.bind(this);
        this.addRadio;
        this.state={
        	checked:false
        };
	}
	getData(value,that){
		this.addRadio = that;
	}
	onSaveAndClose(){
		this.props.onSaveAndClose();
	}
	onCancel(){
		const {form,onSaveAndClose}=this.props;
		this.props.onCancel();
		form.resetFields();  
	}
	onChangeCheck(){

	}

	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {data} = this.props;
		getFieldProps('normal', {
		      initialValue: '0',
		 });
		let content;
        // 编辑
		if(data.number == 0){
            content =(
                <div className="contact-bianji scroll">
                    <label>
                        <span style={{paddingRight:5}}>*</span>
                        {i18n.t(400011/*销售员*/)}
                        <input
                            {...getFieldProps('clientname',{
                            validateFirst: true,
                            rules: [{required:true,}],
                            valuedateTrigger:"onBlur",
                            initialValue:data.record.account
                            })}
                            type ='text'
                            style={{width:300,marginLeft:10,marginRight:10}}
                            className ='text-input'
                            value = {data.record.saleMan}
                        />     
                    </label>	

                    <label><span>*</span>{i18n.t(200221/*是否主力*/)}</label>
                    <input
                        style={{paddingLeft: 10}}
                        type="radio"
                        {...getFieldProps('normal.0', {
                            exclusive: true,
                            getValueFromEvent(e) {
                            return e.target.checked ? '0' : '';
                            },
                            getValueProps(value) {
                            return {
                                checked: value === '0',
                            };
                            },
                        })}
                    />
                    <span style={{paddingLeft: 10, color: "#1E1E1E"}}>{i18n.t(100141/*是*/)}</span>
                    <input
                        style={{marginLeft: 10}}
                        type="radio"
                        {...getFieldProps('normal.1', {
                            exclusive: true,
                            getValueFromEvent(e) {
                            return e.target.checked ? '1' : '';
                            },
                            getValueProps(value) {
                            return {
                                checked: value === '1',
                            };
                            },
                        })}
                    />
                    <span style={{paddingLeft: 10, color: "#1E1E1E"}}>{i18n.t(100142/*否*/)}</span>
                </div>
            );
          
		}else if(data.number == 1){
            // 添加
            content = (
            <div className="contact-add scroll">
                <AddSelect 
                    getData={this.getData}
                    dataArray={[{title:i18n.t(400011/*销售员*/),isMus:true,radio:{type:i18n.t(200397/*马良*/),checked:true},select:"USB"}]}
                    addobj = {{title:i18n.t(400011/*销售员*/),isMus:true,radio:{type:i18n.t(200397/*马良*/),checked:false},select:"USB"}}
                    isShowMus ={true} width={320}
                />
                </div>
            );
            if(this.addRadio){
                this.addRadio.state.array =[{title:data.name.title,isMus:true,radio:{type:"USB",checked:false},select:"USB"}];
            }

			
		}else if(data.number  == 3){
			 content = (<div style={{paddingTop:10,paddingLeft:20,overflow:'auto',height:'300px'}} className='scroll lose'>
							<span>
								<i>*</i>
								失效原因
							</span>
							<Select
								placeholder={''}
								style={{width: 450}}
								getPopupContainer={this.getPopupContainer}
						    >
							   	<Option value={'111111'}>11</Option>
							</Select>
			</div>);
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} showSaveAdd={true} onSaveAndAdd={this.onSaveAndAdd} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
						{content}
				</FormWrapper> 
			</div>
			);
	}
	onSaveAndAdd(){

	}
	onCancel(){
		const {onCancel}=this.props;
        if(onCancel){
            onCancel();
        }
	}
}
NewSalesTeam.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
NewSalesTeam.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const DialogFrom =createForm()(NewSalesTeam);
export default DialogFrom;
