import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import {createForm,FormWrapper} from '../../../../components/Form';
import Select, {Option } from 'rc-select';
import  SelectChange from "../../../../components/SelectChange";
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
class Addnormal extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState()
	}
	initState(){
		return {
			radioState:'',
			radioAddress:''
		}
	}
	StateChange(e){
		let tex;
		tex = e.target.value;
		this.setState({
			radioState:tex
		})
	}
	AddressChange(e){
		let addres;
		addres = e.target.value;
		this.setState({
			radioAddress:addres
		})
	}
	render(){
		const {radioAddress, radioState} = this.state;
		let title = {title_1:i18n.t(100315/*约会目的*/),title_2:i18n.t(400005/*约会地址*/)}
		return(
			<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span>{i18n.t(100138/*常规*/)}</span>
					<span onClick={this.props.backClick}><i className={'foddingicon fooding-back'}></i></span>
					<span onClick={this.props.saveClick}><i className={'foddingicon fooding-save'}></i></span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{i18n.t(100000/*代码*/)}</label>
							<input type='text' className={'col-md-8 text-input-nowidth'} />
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{i18n.t(100001/*名称*/)}</label>
							<input type='text' className={'col-md-8 text-input-nowidth'} />
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{i18n.t(100193/*支付条款分组*/)}</label>
							<Select
								placeholder=""
								className ='currency-btn select-from-currency col-md-8'
							>
								<Option value={i18n.t(200284/*赢单关闭*/)}>{i18n.t(200284/*赢单关闭*/)}</Option>
							</Select>
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{i18n.t(100190/*信保标识*/)}</label>
							<Select 
								placeholder=""
								className ='currency-btn select-from-currency col-md-8'
							>
								<Option value={i18n.t(200284/*赢单关闭*/)}>{i18n.t(200284/*赢单关闭*/)}</Option>
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{i18n.t(100189/*信保分类*/)}</label>
							<Select 
								placeholder=""
								className ='currency-btn select-from-currency col-md-8'
							>
								<Option value={i18n.t(200284/*赢单关闭*/)}>{i18n.t(200284/*赢单关闭*/)}</Option>
							</Select>
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{i18n.t(100191/*信保天数*/)}</label>
							<input type='text' className={'col-md-8 text-input-nowidth'} />
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}><span>*</span>{i18n.t(100192/*投保比例*/)}</label>
							<input type='text' className={'col-md-8 text-input-nowidth'} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const ProductForm =createForm()(Addnormal);
export default ProductForm;
