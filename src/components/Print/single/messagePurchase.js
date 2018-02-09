/**
 *  订单信息确认表-采购
 */
import React, {PropTypes, Component} from "react";

import i18n from '../../../lib/i18n';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../services/apiCall';
import Confirm from '../../../components/Dialog/Confirm';
import ServiceTips from '../../../components/ServiceTips';
export default class MessagePurchase extends Component {
    render() {
        let {getOneData} = this.props;
        let common ;
        if(getOneData.id == null){
                        common = (
                                <div className="btn-group" style={{top:'90px'}}></div>
                                )
                }else{
                         common = (
                                    <div className="btn-group" style={{top:'90px'}}>
                                        <button type="button" className="btn btn-info" title={i18n.t(200083/*下载*/)}>
                                            <a href={API_FOODING_ERP +'/orderaffirmpurorder/export?billId='+this.props.getOneData.billId} style={{color:"#fff"}}>
                                               {i18n.t(200083/*下载*/)}
                                            </a>
                                        </button>
                                    </div>
                                )
                }
        return (
            <div className="print-template">
                {/*<!-- 隐藏域 begin -->*/}
                <input readOnly type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input readOnly type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input readOnly type="hidden" name="optlock" defaultValue={getOneData['optlock']}/>
                {/*<!-- 隐藏域 over -->*/}

                <h2 className="text-center">{i18n.t(700026/*订单信息确认表-采购*/)}</h2>
                   {common}
                <br/><br/>
                <h3>销售单号：{getOneData['saleNo'] || ''}</h3><br/><br/>
                <h3>{i18n.t(700058/*详细信息*/)}</h3><br/>
                <table cellSpacing="0">
                    <thead>
                        <tr>
                            <th style={{width:'30px'}}></th>
                            <th>{i18n.t(201322/*英文品名*/)}</th>
                            <th>{i18n.t(201321/*中文品名*/)}</th>
                            <th>{i18n.t(700027/*详细规格*/)}</th>
                            <th>{i18n.t(201083/*数量*/)}</th>
                            <th>{i18n.t(200923/*包装要求*/)}</th>
                            <th>{i18n.t(700028/*打托要求*/)}</th>
                            <th>{i18n.t(700029/*销售单价*/)}</th>
                            <th>{i18n.t(700030/*合计金额*/)}</th>                            
                        </tr>
                    </thead>
                    <tbody>
                        {getOneData['mtls'].map((o, i) =>
                            <tr key={i}>
                                <td>
                                    {/*<!-- 隐藏域 begin -->*/}
                                    <input readOnly type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                    <input readOnly type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                    <input readOnly type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                    {/*<!-- 隐藏域 over -->*/}
                                    <input readOnly className="text-center" defaultValue={i+1} />
                                </td>
                                <td><input readOnly className="text-center" name={"mtls[" + i + "].mtlEnName"} defaultValue={o['mtlEnName'] || ''}/></td>
                                <td><input readOnly className="text-center" name={"mtls[" + i + "].mtlLcName"} defaultValue={o['mtlLcName'] || ''}/></td>
                                <td><input readOnly className="text-center" name={"mtls[" + i + "].basSpeci"} defaultValue={o['basSpeci'] || ''}/></td>
                                <td><input readOnly className="text-center" name={"mtls[" + i + "].salQty"} defaultValue={o['salQty'] || ''}/></td>
                                <td><input readOnly className="text-center" name={"mtls[" + i + "].packagLcName"} defaultValue={o['packagLcName'] || ''}/></td>
                                <td><input readOnly className="text-center" name={"mtls[" + i + "].salvrLcName"} defaultValue={o['salvrLcName'] || ''}/></td>
                                <td><input readOnly className="text-center" name={"mtls[" + i + "].salTaxPrc"} defaultValue={o['salTaxPrc'] || ''}/></td>
                                <td><input readOnly className="text-center" name={"mtls[" + i + "].setTaxAgg"} defaultValue={o['setTaxAgg'] || ''}/></td>
                            </tr>
                        )
                        }
                    </tbody>
                </table>
                <br/>
                <div className="row">
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">贸易条款:</b>
                        <input readOnly type="text" className="col-md-8" name="incotmLcName" defaultValue={getOneData['incotmLcName'] || ''}/>
                    </div>
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">客户付款方式:</b>
                        <input readOnly type="text" className="col-md-8" name="payTrmLcName" defaultValue={getOneData['payTrmLcName'] || ''}/>
                    </div>
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">运输方式:</b>
                        <input readOnly type="text" className="col-md-8" name="transLcName" defaultValue={getOneData['transLcName'] || ''}/>
                    </div>                                      
                </div>
                <br/>                                                           
                <div className="row">
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">起运港:</b>
                        <input readOnly type="text" className="col-md-8" name="sStatnLcName" defaultValue={getOneData['sStatnLcName'] || ''}/>
                    </div>
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">目的港:</b>
                        <input readOnly type="text" className="col-md-8" name="eStatnLcName" defaultValue={getOneData['eStatnLcName'] || ''}/>
                    </div>
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">装箱信息:</b>
                        <input readOnly type="text" className="col-md-8" name="packagLcName" defaultValue={getOneData['packagLcName'] || ''}/>
                    </div>                                      
                </div> 
                <br/>                                                             
                <div className="row">
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">最晚交货期:</b>
                        <input readOnly type="text" className="col-md-8" name="delDate" defaultValue={getOneData['delDate'] || ''}/>
                    </div>
                    <div className="col-md-4">
                        <b className="col-md-4 text-right">唛头:</b>
                        <input readOnly type="text" className="col-md-8" name="marks" defaultValue={getOneData['marks'] || ''}/>
                    </div>                                     
                </div>
                <br/>                                                            
                <div className="row">
                    <div className="col-md-8">
                        <b className="col-md-2 text-right">发货方式:</b>
                        <input readOnly type="text" className="col-md-10" name="shipType" defaultValue={getOneData['shipType'] || ''}/>
                    </div>                                   
                </div>
                <br/>                                                           
                <div className="row">
                    <div className="col-md-8">
                        <b className="col-md-2 text-right">拍照要求:</b>
                        <textarea readOnly  className="col-md-10" name="photoReq" style={{height: "90px"}} defaultValue={getOneData['photoReq'] || ''}></textarea>
                    </div>                                   
                </div>  
                <br/>                                                                                         
                <div className="row">
                    <div className="col-md-8">
                        <b className="col-md-2 text-right">仓储装箱要求:</b>
                        <textarea readOnly  className="col-md-10" name="stPackReq" style={{height: "90px"}} defaultValue={getOneData['stPackReq'] || ''}></textarea>
                    </div>                                   
                </div> 
                <br/>                                                           
                <div className="row">
                    <div className="col-md-8">
                        <b className="col-md-2 text-right">备注:</b>
                        <textarea readOnly  className="col-md-10" name="note" style={{height: "90px"}} defaultValue={getOneData['note'] || ''}></textarea>
                    </div>                                   
                </div>
                <br/>                                                           
                <div className="row">
                    <div className="col-md-8">
                        <b className="col-md-2 text-right">单据要求:</b>
                        <textarea readOnly  className="col-md-10" name="billReqir" style={{height: "90px"}} defaultValue={getOneData['billReqir'] || ''}></textarea>
                    </div>                                   
                </div>
                <br/>                                           
            </div>
        );       
    }
}