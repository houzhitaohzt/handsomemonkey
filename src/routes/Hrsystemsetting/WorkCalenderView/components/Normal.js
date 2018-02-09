import React, {Component,PropTypes} from "react";
import i18n, { I18n } from '../../../../lib/i18n';
import WebData from '../../../../common/WebData';

class Addnormal extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const { getOne = {} } = this.props;
        return(
            <div className={'girdlayout'}>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(100243/*集团*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{getOne.cluster && getOne.cluster.localName ? getOne.cluster.localName : ""}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(100244/*企业*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{getOne.company && getOne.company.localName ? getOne.company.localName : ""}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(400231/*日历类型*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{getOne.calendarType && getOne.calendarType.name ? getOne.calendarType.name : ""}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(400209/*日历编号*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{getOne.code || ""}</p>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(400230/*日历名称*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{getOne.name || ""}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(400232/*年度*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{getOne.calendarYear || ""}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(400233/*开始日期*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{getOne.dateBegin ? new Date(getOne.dateBegin).Format('yyyy-MM-dd') : "" }</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(400234/*结束日期*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{getOne.dateEnd ? new Date(getOne.dateEnd).Format('yyyy-MM-dd') : "" }</p>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(100087/*国家*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{getOne.country && getOne.country.localName ? getOne.country.localName : ""}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-2 col-lg-2'}>{i18n.t(100002/*描述*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{getOne.remark || ""}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(100300/*创建日期*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{getOne.createDate ? new Date(getOne.createDate).Format('yyyy-MM-dd') : "" }</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Addnormal;
