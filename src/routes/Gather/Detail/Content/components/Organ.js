import i18n from './../../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../../components/Radio";
import Select, {Option } from 'rc-select';
import  SelectChange from "../../../../../components/SelectChange";
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../../services/apiCall';
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
		let data = this.props.data;
		const {radioAddress, radioState} = this.state;
		return(
			<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(100140/*组织*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3 col-xs-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100243/*集团*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["cluster"+language]?data["cluster"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3 col-xs-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100486/*公司*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["cc"+language]?data["cc"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3 col-xs-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200119/*销售组织*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["sor"+language]?data["sor"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3 col-xs-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400011/*销售员*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["saleStaff"+language]?data["saleStaff"+language]:''}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default Addnormal;
