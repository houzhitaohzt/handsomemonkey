/**
 *  货物信息采集表-采购
 */
import React, {PropTypes, Component} from "react";
import i18n from '../../../lib/i18n';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../services/apiCall';
import Confirm from '../../../components/Dialog/Confirm';
import ServiceTips from '../../../components/ServiceTips';


export default class Page extends Component {
    render() {
        let {getOneData} = this.props;
        let data = getOneData['mtls'] || [];
        let len = data['length'];

        return (
            <div className="print-template" style={{overflowY:'auto'}}>
                {/*<!-- 隐藏域 begin -->*/}
                <input type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input type="hidden" name="optlock" defaultValue={getOneData['optlock']}/>
                {/*<!-- 隐藏域 over -->*/}

                <h2 className="text-center">{i18n.t(700057/*货物信息采集表-采购*/)}</h2>
                <br/><br/>
                {data.map((o, i) =>
                    <i key={i}>
                        {/*<!-- 隐藏域 begin -->*/}
                        <input type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                        <input type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                        <input type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                        {/*<!-- 隐藏域 over -->*/}
                    </i>
                )}                  
                <table cellSpacing="0">
                    <tbody>
                        <tr>
                            <td style={{textAlign:'left'}} width='200'>{i18n.t(700039/*合同号*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].sourceNo"} defaultValue={o['sourceNo'] || ''}/></td> )} 
                        </tr>
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(100297/*起运港*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].statnLcName"} defaultValue={o['statnLcName'] || ''}/></td> )} 
                        </tr> 
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(700040/*货物品名*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].mtlLcName"} defaultValue={o['mtlLcName'] || ''}/></td> )} 
                        </tr>  
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(700041/*可以到货日期*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].delDate"} defaultValue={o['delDate'] || ''}/></td> )} 
                        </tr> 
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(700042/*净重*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].totalNetWt"} defaultValue={o['totalNetWt'] || ''}/></td> )} 
                        </tr>  
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(200314/*毛重*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].totalGrosWt"} defaultValue={o['totalGrosWt'] || ''}/></td> )} 
                        </tr>
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(200315/*件数*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].packQty"} defaultValue={o['packQty'] || ''}/></td> )} 
                        </tr>
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(100040/*重量单位*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].uomLcName"} defaultValue={o['uomLcName'] || ''}/></td> )} 
                        </tr>
                        <tr>
                            <td style={{textAlign:'left',whiteSpace:'pre'}}>包装单位 (CARTONS BAGS DRUMS)</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].packagEnName"} defaultValue={o['packagEnName'] || ''}/></td> )} 
                        </tr>  
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(200313/*体积*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].vol"} defaultValue={o['vol'] || ''}/></td> )} 
                        </tr>   
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(400077/*境内货源地*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].domcSupply"} defaultValue={o['domcSupply'] || ''}/></td> )} 
                        </tr>  
                        <tr>
                            <td style={{textAlign:'left'}}>HS CODE</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].hsCode"} defaultValue={o['hsCode'] || ''}/></td> )} 
                        </tr> 
                        <tr style={{color:'red'}}>
                            <td style={{textAlign:'left',whiteSpace:'pre'}}>{`RMB采购单价/kg \n(退税为0%的产品需填写此项)`}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].cnyAmt"} defaultValue={o['cnyAmt'] || ''}/></td> )} 
                        </tr>
                        <tr style={{color:'red'}}>
                            <td style={{textAlign:'left'}}>{i18n.t(700043/*发票总价*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].purTaxAmt"} defaultValue={o['purTaxAmt'] || ''}/></td> )} 
                        </tr>  
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(700044/*进仓费是否承担*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].inStoreFee"} defaultValue={o['inStoreFee'] || ''}/></td> )} 
                        </tr>   
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(700045/*港杂费是否承担*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].portFee"} defaultValue={o['portFee'] || ''}/></td> )} 
                        </tr>
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(700046/*送货还是背箱*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].shipType"} defaultValue={o['shipType'] || ''}/></td> )} 
                        </tr> 
                        <tr>
                            <td style={{textAlign:'left'}}>成交方式 (USD/RMB)</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].cnyLcName"} defaultValue={o['cnyLcName'] || ''}/></td> )} 
                        </tr>  
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(700047/*是否商检；商检完成日期*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].inspcDate"} defaultValue={o['inspcDate'] || ''}/></td> )} 
                        </tr>  
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(400073/*报关方式*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].cleaType"} defaultValue={o['cleaType'] || ''}/></td> )} 
                        </tr> 
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(200467/*供应商名称*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].sVndBeLcName"} defaultValue={o['sVndBeLcName'] || ''}/></td> )} 
                        </tr> 
                        <tr>
                            <td style={{textAlign:'left'}}>{i18n.t(700048/*联系人电话*/)}</td>
                            {data.map((o, i) => <td key={i}><input style={{width:'160px'}} className="text-center" name={"mtls[" + i + "].saleTel"} defaultValue={o['saleTel'] || ''}/></td> )} 
                        </tr>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                    </tbody>
                </table>   

            </div>
        );       
    }
}