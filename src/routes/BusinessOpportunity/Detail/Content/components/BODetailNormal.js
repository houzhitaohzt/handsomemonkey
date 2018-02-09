import i18n from './../../../../../lib/i18n';
import React, {Component} from "react";

class BODetailNormal extends Component{
	constructor(props){
		super(props)
		this.state=this.initState()
	}
	initState(){
		return {
		}
	}	
	render(){
	    let {businessOne} = this.props;
		return(
			<div className={'businessdetailnormal'}>
				<div className={'businessdetailnormal-title'}>
					<span>{i18n.t(100138/*常规*/)}</span>
				</div>
				<div className={'businessdetailnormal-content girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200222/*购买流程*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{businessOne.buyPsTypeName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200223/*商机等级*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{businessOne.levTypeName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200224/*可能截止日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>
									{new Date(businessOne.mbEDate).Format('yyyy-MM-dd')}
								</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200252/*实际截止日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>
									{new Date(businessOne.actEDate).Format('yyyy-MM-dd')}
								</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200226/*最终用户*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{businessOne.lastBeLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200227/*最终联系人*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{businessOne.lastLinkLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200228/*需求级别*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{businessOne.custLevelName}</p>
							</div>
						</div>
						 <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200159/*客户地区*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{businessOne.beAreaLcName}</p>
							</div>
                        </div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
                           <label className={'col-md-4 col-lg-4'}>{i18n.t(100096/*美国制裁*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{businessOne.sacInUsMark ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/)}</p>
							</div>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-3 col-lg-3'}>{i18n.t(200160/*风险分类*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{businessOne.riskTyLcName}</p>
							</div>
                        </div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500084/*关闭原因*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{businessOne.closeCauseLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200229/*关闭说明*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{businessOne.closeInstruct}</p>
							</div>
						</div>
					</div>
					
				</div>
			</div>
		)
	}
}

export default BODetailNormal;
