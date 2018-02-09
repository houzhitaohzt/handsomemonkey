import i18n from './../../../../../lib/i18n';
import React, {Component} from "react";

class Addnormal extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState()
	}
	initState(){
		return {
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
        const { businessOne = {}} = this.props;

		return(
			<div className={'addnormal'} style={{marginTop:'10px'}}>
				<div className={'addnormal-title'}>
					<span style={{width:45}}>{i18n.t(100140/*组织*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(100243/*集团*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={'paragraph shengyue'}>{businessOne.clusterLcName}</p>
                            </div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100244/*企业*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={'paragraph shengyue'}>{businessOne.ccLcName}</p>
                            </div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200119/*销售组织*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={'paragraph shengyue'}>{businessOne.sorLcName}</p>
                            </div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Addnormal;
