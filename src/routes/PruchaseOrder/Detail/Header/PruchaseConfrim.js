import i18n from './../../../../lib/i18n';
/*
	付款申请的弹层
*/
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
export class  PruchaseConfrim extends Component{
    constructor(props){
        super(props);

    }
    render(){
        let that = this;
        let data = this.props.data || [];
        console.log(data);
        return(<FormWrapper showFooter={true} onSaveAndClose={this.props.onSaveAndClose} buttonLeft ={i18n.t(100460/*确认*/)} onCancel={this.props.onCancel} width={976}>
            <div className="girdlayout">
                {
                  data.map((e,i)=>{
                      return(
                      <div key={i}>
                          <div className="row">
                              <div className="form-group col-xs-4 col-md-4">
                                  <label className={'col-xs-4 col-md-4'}>{i18n.t(201105/*订单号*/)}</label>
                                  <p className="col-xs-8 col-md-8">{e.saleNo}</p>
                              </div>
                              <div className="form-group col-xs-4 col-md-4">
                                  <label className={'col-xs-4 col-md-4'}>{i18n.t(100133/*支付条款*/)}</label>
                                  <p className="col-xs-8 col-md-8">{e.payTrmName}</p>
                              </div>
                              <div className="form-group col-xs-4 col-md-4">
                                  <label className={'col-xs-4 col-md-4'}>{i18n.t(200628/*应收金额*/)}</label>
                                  <p className="col-xs-8 col-md-8">{e.billAmt?e.billAmt+' '+e.cnyName:0+' '+(e.cnyName?e.cnyName:'')}</p>
                              </div>
                          </div>
                          <div className="row">
                              <div className="form-group col-xs-4 col-md-4">
                                  <label className={'col-xs-4 col-md-4'}>{i18n.t(200629/*已收金额*/)}</label>
                                  <p className="col-xs-8 col-md-8">{e.receAmt?e.receAmt+' '+e.cnyName:0+' '+(e.cnyName?e.cnyName:'')}</p>
                              </div>
                              <div className="form-group col-xs-4 col-md-4">
                                  <label className={'col-xs-4 col-md-4'}>{i18n.t(500216/*未收金额*/)}</label>
                                  <p className="col-xs-8 col-md-8">{e.leftAmt?e.leftAmt+' '+e.cnyName:0+' '+(e.cnyName?e.cnyName:'')}</p>
                              </div>
                              <div className="form-group col-xs-4 col-md-4">
                                  <label className={'col-xs-4 col-md-4'}>{i18n.t(500213/*信用证*/)}</label>
                                  <p className="col-xs-8 col-md-8">{e.presentMsg}</p>
                              </div>
                          </div>
                      </div>)
                  })
                }

                <div className="row">
                    <p className="col-xs-12 col-md-12 text-center" style={{fontSize:14,marginLeft:0}}>{i18n.t(300082/*订单未收齐预收款，是否确认继续？*/)}</p>
                </div>
            </div>
        </FormWrapper>);
    }
}
const PaymentRequestForm =PruchaseConfrim;
export default PaymentRequestForm;
