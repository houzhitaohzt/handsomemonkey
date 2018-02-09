import i18n from './../../../../../lib/i18n';
import React, {Component} from "react";

class Addnormal extends Component {
    constructor(props) {
        super(props)
        this.state = this.initState()
    }

    initState() {
        return {}
    }

    render() {
        const { businessOne = {}} = this.props;
        return (
            <div className={'addnormal'} style={{marginTop: '10px'}}>
                <div className={'addnormal-title'}>
                    <span style={{width: 45}}>{i18n.t(200167/*财务*/)}</span>
                </div>
                <div className={'  girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(500083/*收款企业*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={'paragraph shengyue'}>{businessOne.receiptCcLcName}</p>
                            </div>

                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200168/*收款银行账号*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={'paragraph shengyue'}>{businessOne.receBankAccountLcName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Addnormal;
