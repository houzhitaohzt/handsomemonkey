import i18n from './../../../../../lib/i18n';
import React, {Component} from 'react';
import {permissionsBtn,toDecimal} from '../../../../../services/apiCall';

export class DetailNormal extends Component {
    constructor(props) {
        super(props)
    }

    renderButton = () => {
        const {businessOne = {}} = this.props;
        let buttons = [];
        let status = parseInt(businessOne.status);
        if (status === 1) {//草稿
            buttons.push(
                permissionsBtn('sample.del')?<span key="delClick" onClick={this.props.delClick}><i className={'foddingicon fooding-delete-icon4'} title={i18n.t(100437/*删除*/)}/></span> : '',
                permissionsBtn('sample.edit')?<span key="editClick" onClick={this.props.editClick}><i className={'foddingicon fooding-Edit'} title={i18n.t(100439/*编辑*/)}/></span> : '',



        );
            if (businessOne.saleTaxAmt && parseInt(businessOne.saleTaxAmt) > 0) {
                buttons.push(
                    permissionsBtn('sample.submit') ? <span key='submitClick' onClick={this.props.submitClick} title={i18n.t(100472/*提交*/)}><i
                        className={'foddingicon fooding-submit'}/></span> : '',

                );
            }

        } else if (status === 10) {//已审核
            if (businessOne.saleTaxAmt && parseInt(businessOne.saleTaxAmt) > 0 && !businessOne.receiptStatus) {
                buttons.push(
                    permissionsBtn('sample.collect') ? <span key="receiptClick" onClick={this.props.receiptClick} title={i18n.t(200176/*收款*/)}><i
                        className={'foddingicon fooding-gathering'}/></span>:'',
                );
            }
            buttons.push(
                permissionsBtn('sample.toout') ? <span key="stockOutClick" onClick={this.props.stockOutClick} title={i18n.t(500167/*出库*/)}><i
                    className={'foddingicon fooding-stock'}/></span> : '',
                permissionsBtn('sample.void') ? <span key="stockDropClick" onClick={this.props.stockDropClick} title={i18n.t(100471/*作废*/)}><i
                    className={'foddingicon fooding-cancal'}/></span> : '',
                permissionsBtn('sample.feedback') ? <span key="fankuiClick" onClick={this.props.fankuiClick}><i
                    className={'foddingicon fooding-Feedback'} title={i18n.t(500337/*反馈信息*/)}/></span> : ''
            );
        }

        return buttons;
    };

    render() {
        const {businessOne = {}} = this.props;

        return (<div className={'addnormal'} style={{marginBottom: '10px'}}>
            <div className={'addnormal-title'}>
                <span style={{width: '85px'}}>{i18n.t(100138/*常规*/)}</span>
                {this.renderButton()}
            </div>
            <div className={'  girdlayout'}>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(400048/*单据编号*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{String(businessOne.no || '')}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(100323/*业务日期*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{new Date(businessOne.billDate).Format('yyyy-MM-dd')}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(400049/*业务状态*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{businessOne.statusName}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(400011/*销售员*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{businessOne.saleStaffLcName}</p>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(100311/*客户*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{businessOne.salBeLcName}</p>
                        </div>
                    </div>


                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(200162/*客户业务员*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{businessOne.cusLinkLcName || ''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(500044/*联系电话*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{businessOne.cusLinkTel || ''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(500083/*收款企业*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{businessOne.revBusinessLcName || ''}</p>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(500050/*付款企业*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{businessOne.payBusinessLcName || ''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(500046/*收货联系人*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{businessOne.reclinkLcName || ''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(200163/*收货人电话*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{businessOne.recTel || ''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(200164/*收货人传真*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{businessOne.recFax || ''}</p>
                        </div>
                    </div>
                </div>
                <div className={'row'}>

                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(200165/*销售总额*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{Number.isFinite(businessOne.saleTaxAmt) ? toDecimal(String(businessOne.saleTaxAmt)) : ''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(500125/*货币*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{businessOne.cnyLcName || ''}</p>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(200166/*收货人地址*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{businessOne.recAddress}</p>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(100336/*备注*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{businessOne.note}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default DetailNormal;
//<div className="form-group col-md-3 col-lg-3">
    //<label className={'col-md-4 col-lg-4'}>{i18n.t(200161/*客户汇款国别*/)}</label>
    //<div className={'col-md-8 col-lg-8'}>
        //<p className={'paragraph'}>{businessOne.remittanceCountryLcName || ''}</p>
    //</div>
//</div>