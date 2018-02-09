import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, {Option} from 'rc-select';
import Radio from '../../../../../components/Radio';
import AddSelect from '../../../../../components/AddRadio/components/AddSelect';

export class  PaymentDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
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
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {data} = this.props;
		getFieldProps('normal', {
		      initialValue: '0',
		 });
		let content;
		if(data.action == 0){
           content =(
           	<div className="contact-bianji scroll">
							<Radio
								{...getFieldProps('normal', {
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
							<label>
								<span style={{paddingRight:5}}>*</span>
									{data.name.title}
								<Select
									{...getFieldProps('name',{
									validateFirst: true,
									rules: [{required:true,}],
									valuedateTrigger:"onBlur",
									initialValue:data.record.payment
									})}
									style={{width:320,marginLeft:5,marginRight:10}}
									className ={getFieldError('name')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}>>
									<Option value ={'0'}>{'dd'}</Option>
								</Select>
							</label>	
			</div>
           	);
		}else if(data.number == 1){
			content = (
				<div className="contact-add scroll">
					<AddSelect getData={this.getData}
					 dataArray={[{title:data.name.title,isMus:true,radio:{type:"",checked:true},select:""}]}
					 addobj = {{title:data.name.title,isMus:true,radio:{type:"",checked:false},select:""}}
					isShowMus ={true} width={320}/>						
				</div>
			);
			if(this.addRadio){
				this.addRadio.state.array =[{title:data.name.title,isMus:true,radio:{type:"USB",checked:false},select:""}];
			}
		}else if(data.number  == 3){
			 content = (<div  className='scroll lose scroll-style'>
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
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
						{content}
				</FormWrapper>
			</div>
			);
	}
	onSaveAndClose(){

	}
	onCancel(){
		const {onCancel}=this.props;
        if(onCancel){
            onCancel();
        }
	}
}
PaymentDialog.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
PaymentDialog.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const DialogFrom =createForm()(PaymentDialog);
export default DialogFrom;
