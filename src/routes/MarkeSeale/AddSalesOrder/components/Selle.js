import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option } from 'rc-select';
import  SelectChange from "../../../../components/SelectChange";
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
		return(
			<div className={'addnormal'} style={{marginTop:'10px',marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(200715/*销售费用*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3 col-xs-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200716/*港杂费*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>6950 CNY</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3 col-xs-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200717/*资金费*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>6950 CNY</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3 col-xs-3">
							<label className={'col-md-3 col-lg-3'}><i style={{color:'red'}}>*</i>{i18n.t(200718/*到港费*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>6950 CNY</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3 col-xs-3">
							<label className={'col-md-3 col-lg-3'}><i style={{color:'red'}}>*</i>{i18n.t(200719/*运输费*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>6950 CNY</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200720/*信保费*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>6950 CNY</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200721/*海运保险费*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>6950 CNY</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}><i style={{color:'red'}}>*</i>{i18n.t(200722/*监装费*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>6950 CNY</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}><i style={{color:'red'}}>*</i>{i18n.t(200723/*产品检验费*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>6950 CNY</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200724/*托盘费*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>6950Y</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default Addnormal;
