import i18n from './../../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../../components/Radio";
import Select, {Option } from '../../../../../components/Select';
import DataTime from '../../../../../components/Calendar/Calendar';
import  SelectChange from "../../../../../components/SelectChange";
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
		let {getOneData} = this.props;
		return(
			<div className={'addnormal'} style={{marginLeft:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(100194/*系统信息*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6 col-xs-6">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100143/*创建人*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOneData['createStaffName']}</p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6 col-xs-6">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100144/*修改人*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOneData['updateStaffName']}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100145/*创建时间*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOneData['createDate']).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100146/*修改时间*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOneData['updateDate']).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default Addnormal;
