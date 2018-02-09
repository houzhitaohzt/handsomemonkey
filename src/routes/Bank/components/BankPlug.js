import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option } from '../../../components/Select';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import DataTime from  '../../../components/Calendar/Calendar';
export class Productplug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
	}
	getData(value,that){
		this.addSelect = that;
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {checkedData} = this.props;
		getFieldProps('normal', {
		      initialValue: '0',
		 });
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(100000/*代码*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
								<input type='text' className={'col-md-9 col-lg-9 text-input-nowidth'} />
							</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100001/*名称*/)}</label>
								<input type='text' className={'col-md-9 col-lg-9 text-input-nowidth'} />
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{i18n.t(100087/*国家*/)}</label>
									<Select 
										placeholder=""
										className ='currency-btn select-from-currency col-md-9 col-lg-9'>
										<Option value={i18n.t(200284/*赢单关闭*/)}>{i18n.t(200284/*赢单关闭*/)}</Option>
									</Select>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>CNAPSCODE</label>
									<input type='text' className={'col-md-9 col-lg-9 text-input-nowidth'} />
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>SWIFTCODE</label>
								<input type='text' className={'col-md-9 col-lg-9 text-input-nowidth'} />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100508/*银行地址*/)}</label>
								<input type='text' className={'col-md-9 col-lg-9 text-input-nowidth'} />
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(100002/*描述*/)}</label>
								<input type='text' className={'col-md-9 col-lg-9 text-input-nowidth'} />
							</div>
						</div>
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			   content = (
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(100000/*代码*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>Alimaju international M Snd Bnd</p>
							</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100001/*名称*/)}</label>
								<Select 
									placeholder=""
									className ='currency-btn select-from-currency col-md-9 col-lg-9'
								>
									<Option value={i18n.t(200284/*赢单关闭*/)}>{i18n.t(200284/*赢单关闭*/)}</Option>
								</Select>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{i18n.t(100087/*国家*/)}</label>
									<Select 
										placeholder=""
										className ='currency-btn select-from-currency col-md-9 col-lg-9'>
										<Option value={i18n.t(200284/*赢单关闭*/)}>{i18n.t(200284/*赢单关闭*/)}</Option>
									</Select>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>CNAPSCODE</label>
									<input type='text' className={'col-md-9 col-lg-9 text-input-nowidth'} />
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>SWIFTCODE</label>
								<input type='text' className={'col-md-9 col-lg-9 text-input-nowidth'} />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100508/*银行地址*/)}</label>
								<input type='text' className={'col-md-9 col-lg-9 text-input-nowidth'} />
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(100002/*描述*/)}</label>
								<input type='text' className={'col-md-9 col-lg-9 text-input-nowidth'} />
							</div>
						</div>
					</div>
			</div>
			)
		}else if(this.props.DialogContent==4){
			content = (
				<div className='scroll lose'>
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
				</div>
			)
		}else if(this.props.DialogContent==5){
			content = (
				<div className={'girdlayout scroll'} style={{overflow:'auto'}}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100000/*代码*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>BANK0000029</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100001/*名称*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>{i18n.t(200304/*中国银行股份有限公司南通城南支行*/)}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100087/*国家*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>{i18n.t(200293/*中国*/)}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>CNAPSCODE</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>CHASUS33</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>SWIFTCODE</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}></p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100508/*银行地址*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>{i18n.t(200309/*中国江苏南通市青年中路15号*/)}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100002/*描述*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}></p>
							</div>
						</div>
						
					</div>
				</div>
			)
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} 
					showSaveAdd={this.props.showSaveAdd}
					showSaveClose={this.props.showSaveClose}
					onSaveAndClose={this.props.onSaveAndClose} onCancel={this.props.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(Productplug);
export default ProductForm;
