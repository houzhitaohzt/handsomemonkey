import i18n from './../../../../../lib/i18n';
import React, {PropTypes, Component} from 'react'
import {createForm, FormWrapper} from "../../../../../components/Form";
//引入弹层
import Dialog from "../../../../../components/Dialog/Dialog";
//引入select插件
import Select, {Option } from 'rc-select';

import AddCompetitor from "../../../../../components/AddCompetitor";

class CommonForm extends Component{
	constructor(props){
		super(props)
		this.state=this.initialState();
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.getData=this.getData.bind(this);
	}

	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func
	}

	static defaultProps={
		data:{

		}
	}
	initialState(){
		return {

		}
	}
	componentDidMount(){

	}
	onSaveAndClose(){
		const {form, onSaveAndClose } = this.props;
		form.validateFields((errors, value) =>{
			if(null==errors){
				if(onSaveAndClose){
					onSaveAndClose(form.getFieldsValue())
				}
			}
		})
 	}

 	onCancel(){
 		const { onCancel } = this.props;
 		if(onCancel){
 			onCancel();
 		}
 	}

 	getData(data,that){
    	this.addradio = that;
    }

 	render(){
 		const {form, data} = this.props;
 		const { getFieldProps, getFieldError } = this.props.form;
 		const disabled = form.isFieldValidating() || form.isSubmitting();
 		let productName = [1,2];
 		let typeDom = productName.map((value,i) => {
 			return (
	 					<div className={'row'} key={i}>
							<div className={'col-sm-6'}>
								<div className={'row'}>
									<label className={'col-sm-2'}>{i18n.t(100379/*产品*/)}</label>
									<p className={'col-sm-10 shengyue'}>山离酸钾【Assay:80%; Loss on drying:10%】</p>
								</div>
							</div>
							<div className={'col-sm-6'}>
								<div className={'row'}>
									<label className={'col-sm-2'}>{i18n.t(500084/*关闭原因*/)}</label>
									<Select
										className ='currency-btn select-from-currency col-sm-10'
									>
					                  	<Option value="5785df87c9a516aed89003d9">{i18n.t(200284/*赢单关闭*/)}</Option>
					                  	<Option value="5785df87c9a516aed89003d9">{i18n.t(200914/*部分赢单关闭*/)}</Option>
					                  	<Option value="5785df87c9a516aed89003d9">{i18n.t(200915/*丢单关闭*/)}</Option>
									</Select>
								</div>
							</div>
							<div className={'col-sm-12'} style={{margin:'10px 0px'}}>
								<label className={'col-sm-1'}>{i18n.t(200229/*关闭说明*/)}</label>
								<input type="text" className={'col-sm-11 text-input-nowidth'}  />
							</div>
							<AddCompetitor getData = {this.getData} num={i} key={i} />
						</div>
 				)})
 		return (
 			<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
				<div className="close-business scroll">
					<div className={'row'}>
						<label className={'col-sm-1'}>{i18n.t(200253/*关闭类型*/)}</label>
						<Select
							className ='currency-btn select-from-currency col-sm-11'
						>
		                  	<Option value={i18n.t(200284/*赢单关闭*/)}>{i18n.t(200284/*赢单关闭*/)}</Option>
		                  	<Option value={i18n.t(200914/*部分赢单关闭*/)}>{i18n.t(200914/*部分赢单关闭*/)}</Option>
		                  	<Option value={i18n.t(200915/*丢单关闭*/)}>{i18n.t(200915/*丢单关闭*/)}</Option>
						</Select>
					</div>
					{typeDom}
				</div>
 			</FormWrapper>
 		)
 	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;

