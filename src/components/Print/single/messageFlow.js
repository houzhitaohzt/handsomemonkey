/**
 *  订单信息确认表-物流
 */
import React, {PropTypes, Component} from "react";
import {createForm,FormWrapper} from '../../../components/Form';

import i18n from '../../../lib/i18n';
import Dialog from '../../../components/Dialog/Dialog';//弹层

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../services/apiCall';
import Confirm from '../../../components/Dialog/Confirm';
import ServiceTips from '../../../components/ServiceTips';



class MessageFlow extends Component {

	constructor(props){
		super(props);
		this.columns = [];

		// this state 
		this.state = {
            showDilaog:false, 
		}
	}



    // 保存 
    confirmHandle = ()=> {
        let that = this;
        let {getOneData} = this.props;

		this.props.form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiForm(API_FOODING_ERP,'/orderaffirmshipping/back',Object.assign({},value,{billId:getOneData['billId']}),
					(response)=>{	
                        ServiceTips({text:response.message,type:'success'});
                        that.cancelHandle(false);
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});
    }

    // 弹框 打开|取消
    cancelHandle = (action)=> {
        this.setState({showDilaog: action});        
    }

    render() {
        let {showDilaog} = this.state;
        let {getOneData} = this.props;
		let that = this;
		const { getFieldProps, getNFieldProps, getFieldError} = this.props.form;        
                
        return (
            <div className="print-template">
                {/*<!-- 隐藏域 begin -->*/}
                <input readOnly type="hidden" name="billId" defaultValue={getOneData['billId']}/>
                <input readOnly type="hidden" name="id" defaultValue={getOneData['id']}/>
                <input readOnly type="hidden" name="optlock" defaultValue={getOneData['optlock']}/>
                {/*<!-- 隐藏域 over -->*/}
                <h2 className="text-center">{i18n.t(700031/*订单信息确认表-物流订单*/)}</h2>
                
                <div className="btn-group" style={{top:'90px'}}>
                    { getOneData.id ? <button type="button" className="btn btn-info" title={i18n.t(200083/*下载*/)}><a href={API_FOODING_ERP +'/orderaffirmshipping/export?billId='+this.props.getOneData.billId} style={{color:"#fff"}}>{i18n.t(200083/*下载*/)}</a></button> :'' }
                    { getOneData.id ? <button onClick={this.cancelHandle.bind(this,true)} type="button" className="btn btn-info" title={i18n.t(600211/*退回*/)}>{i18n.t(600211/*退回*/)}</button> :'' }
                </div>

                <Dialog width={1000} visible={showDilaog} title={i18n.t(600211/*退回*/)}>
					<div className={'row'}>
						<div className={'form-group col-md-12'}>
							<label style={{textAlign:'right'}} className={'col-md-3'}><span style={{color:'red'}}>*</span>{i18n.t(200910/*原因*/)}</label>
							<textArea 
                                style={{border:'none'}} 
                                className ={getFieldError('cause')?'col-md-8 textarea error-border':'col-md-8 textarea'}
                                {...getNFieldProps('cause',{
                                    rules: [{required:true}],
									initialValue:''
								})}>
                            </textArea>
						</div>
					</div>

                    <br/>
                    <div style={{textAlign:'center'}}>
                        <button type="button" onClick={this.confirmHandle} className="btn btn-primary btn-sm" style={{marginRight:'13px'}}>{i18n.t(100429/*保存并关闭*/)}</button>
                        <button type="button" onClick={this.cancelHandle.bind(this,false)} className="btn btn-default btn-sm">{i18n.t(100461/*取消*/)}</button>
                    </div>
                </Dialog>


                <br/><br/>
                <table cellSpacing="0">
                    <tbody>
                        <tr>
                            <td>{i18n.t(700032/*订单业务员*/)}</td>
                            <td colSpan="9"><input readOnly name="saleStaffLcName" defaultValue={getOneData['saleStaffLcName'] || ''}/></td>
                        </tr>
                        <tr>
                            <td>{i18n.t(100229/*邮箱*/)}</td>
                            <td colSpan="4" style={{textAlign:'left'}}><input readOnly name="email" defaultValue={getOneData['email'] || ''}/></td>
                            <td>{i18n.t(700033/*电话分机号*/)}</td>
                            <td colSpan="4" style={{textAlign:'left'}}><input readOnly name="tel_number" defaultValue={getOneData['tel_number'] || ''}/></td>
                        </tr>                        
                    </tbody>
                </table>   
                <br/>          
                <table cellSpacing="0">
                    <tbody>
                    <tr>
                        <td>{i18n.t(201105/*订单号*/)}</td>
                        <td colSpan="9"><input readOnly name="saleNo" defaultValue={getOneData['saleNo'] || ''}/></td>
                    </tr>
                    <tr>
                        <td colSpan="10">
                            <textarea readOnly placeholder={i18n.t(700060/*如果此订单为FOB货，请在此填写指定货代信息*/)} style={{height: "90px"}} name="lsbePort" defaultValue={getOneData['lsbePort'] || ''}></textarea>
                        </td>
                    </tr>                    
                    <tr>
                        <td rowSpan="6"><span>{i18n.t(201315/*发货人*/)}</span><br/><span>(Shipper)</span></td>
                        <td colSpan="9" className="text">
                            <span>公司名称: </span>
                            <input readOnly name="sendCompany" defaultValue={getOneData['sendCompany'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>(EXPORTER COMPANY NAME)</span>
                        </td>
                    </tr>                    
                    <tr>
                        <td colSpan="9" className="text">
                            <span>联系地址: </span>
                            <input readOnly name="sendAddress" defaultValue={getOneData['sendAddress'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>(ADDRESS)</span>
                        </td>
                    </tr>                     
                    <tr>
                        <td colSpan="9" className="text">
                            <span>联系方式: </span>
                            <input readOnly name="sendTelAndFax" defaultValue={getOneData['sendTelAndFax'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>(TEL/FAX)</span>
                        </td>
                    </tr>
                    <tr>
                        <td rowSpan="8"><span>{i18n.t(200344/*收货人*/)}</span><br/><span>(Consignee)</span></td>
                        <td colSpan="9" className="text">
                            <span>公司名称: </span>
                            <input readOnly name="revBusinessLcName" defaultValue={getOneData['revBusinessLcName'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>(IMPORTER)</span>
                        </td>
                    </tr>                    
                    <tr>
                        <td colSpan="9" className="text">
                            <span>联系地址: </span>
                            <input readOnly name="recAddress" defaultValue={getOneData['recAddress'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>(ADDRESS)</span>
                        </td>
                    </tr>                     
                    <tr>
                        <td colSpan="9" className="text">
                            <span>联系方式: </span>
                            <input readOnly name="recTelAndFax" defaultValue={getOneData['recTelAndFax'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>(TEL/FAX)</span>
                        </td>
                    </tr> 
                    <tr>
                        <td colSpan="9" className="text">
                            <span>客户税号: </span>
                            <input readOnly name="dutyPara" defaultValue={getOneData['dutyPara'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>(TFN)</span>
                        </td>
                    </tr>                                         
                    <tr>
                        <td rowSpan="6"><span>{i18n.t(200346/*通知人*/)}</span><br/><span>(NOTIFY PARTY)</span></td>
                        <td colSpan="9" className="text">
                            <span>公司名称: </span>
                            <input readOnly name="noticeCompany" defaultValue={getOneData['noticeCompany'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>(EXPORTER COMPANY NAME)</span>
                        </td>
                    </tr>                    
                    <tr>
                        <td colSpan="9" className="text">
                            <span>联系地址: </span>
                            <input readOnly name="noticeAddress" defaultValue={getOneData['noticeAddress'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>(ADDRESS)</span>
                        </td>
                    </tr>                     
                    <tr>
                        <td colSpan="9" className="text">
                            <span>联系方式: </span>
                            <input readOnly name="noticeTelAndFax" defaultValue={getOneData['noticeTelAndFax'] || ''} style={{paddingLeft:'63px'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" style={{textAlign:'left'}}>
                            <span>(TEL/FAX)</span>
                        </td>
                    </tr>   
                    <tr>
                        <td>{i18n.t(700034/*出运方式/箱型箱量*/)}</td>
                        <td colSpan="9" style={{textAlign:'left'}}><input readOnly name="packTypeName" defaultValue={getOneData['packTypeName'] || ''}/></td>
                    </tr>
                    <tr>
                        <td>{i18n.t(700035/*客户付款方式*/)}</td>
                        <td colSpan="9" style={{textAlign:'left'}}><input readOnly name="payTrmTyEnName" defaultValue={getOneData['payTrmTyEnName'] || ''}/></td>
                    </tr>   
                    <tr>
                        <td>{i18n.t(201317/*贸易方式*/)}</td>
                        <td colSpan="9" style={{textAlign:'left'}}><input readOnly name="incotmLcName" defaultValue={getOneData['incotmLcName'] || ''}/></td>
                    </tr>
                    <tr>
                        <td>{i18n.t(201322/*英文品名*/)}</td>
                        <td>{i18n.t(201321/*中文品名*/)}</td>
                        <td>{i18n.t(400037/*采购员*/)}</td>
                        <td>HS CODE</td>
                        <td>{i18n.t(201349/*单价*/)}</td>
                        <td>{i18n.t(200315/*件数*/)}</td>
                        <td>{i18n.t(201083/*数量*/)}</td>
                        <td>{i18n.t(400109/*总价*/)}</td>
                        <td>{i18n.t(700028/*打托要求*/)}</td> 
                        <td>{i18n.t(100112/*特殊要求*/)}</td>                                                                       
                    </tr> 
                    {getOneData['mtls'].map((o, i) =>
                        <tr key={i}>
                            <td>
                                {/*<!-- 隐藏域 begin -->*/}
                                <input readOnly type="hidden" name={"mtls[" + i + "].billId"} defaultValue={o['billId']}/>
                                <input readOnly type="hidden" name={"mtls[" + i + "].id"} defaultValue={o['id']}/>
                                <input readOnly type="hidden" name={"mtls[" + i + "].optlock"} defaultValue={o['optlock']}/>
                                {/*<!-- 隐藏域 over -->*/}
                                <input readOnly className="text-center" name={"mtls[" + i + "].mtlEnName"} defaultValue={o['mtlEnName']}/>
                            </td>
                            <td><input readOnly className="text-center" name={"mtls[" + i + "].mtlLcName"} defaultValue={o['mtlLcName'] || ''}/></td>
                            <td><input readOnly className="text-center" name={"mtls[" + i + "].purStaffLcName"} defaultValue={o['purStaffLcName'] || ''}/></td>
                            <td><input readOnly className="text-center" name={"mtls[" + i + "].hsCode"} defaultValue={o['hsCode'] || ''}/></td>
                            <td><input readOnly className="text-center" name={"mtls[" + i + "].salTaxPrc"} defaultValue={o['salTaxPrc'] || ''}/></td>
                            <td><input readOnly className="text-center" name={"mtls[" + i + "].packQty"} defaultValue={o['packQty'] || ''}/></td>
                            <td><input readOnly className="text-center" name={"mtls[" + i + "].salQty"} defaultValue={o['salQty'] || ''}/></td>
                            <td><input readOnly className="text-center" name={"mtls[" + i + "].setTaxAgg"} defaultValue={o['setTaxAgg'] || ''}/></td>
                            <td><input readOnly className="text-center" name={"mtls[" + i + "].salvr"} defaultValue={o['salvr']=='false' ? i18n.t(100142/*否*/) : o['salvr']}/></td>                        
                            <td><input readOnly className="text-center" name={"mtls[" + i + "].specReq"} defaultValue={o['specReq'] || ''}/></td>                         
                        </tr>
                    ) 
                    }   
                    <tr>
                        <td>{i18n.t(700036/*出运港*/)}</td>
                        <td colSpan="4" style={{textAlign:'left'}}><input readOnly name="sStatnLcName" defaultValue={getOneData['sStatnLcName'] || ''}/></td>
                        <td>{i18n.t(100298/*目的港*/)}</td>
                        <td colSpan="4" style={{textAlign:'left'}}><input readOnly name="eStatnLcName" defaultValue={getOneData['eStatnLcName'] || ''}/></td>
                    </tr>    
                    <tr>
                        <td>{i18n.t(200802/*出运日期*/)}</td>
                        <td colSpan="4" style={{textAlign:'left'}}><input readOnly name="ariveDate" defaultValue={getOneData['ariveDate'] || ''}/></td>
                        <td>{i18n.t(100512/*船公司要求*/)}</td>
                        <td colSpan="4" style={{textAlign:'left'}}><input readOnly name="shipRequire" defaultValue={getOneData['shipRequire'] || ''}/></td>
                    </tr> 
                    <tr>
                        <td >{i18n.t(200349/*免仓期申请*/)}</td>
                        <td colSpan="9">
                            <textarea readOnly placeholder="" style={{height: "90px"}} name="frStorAgeApp" defaultValue={getOneData['frStorAgeApp'] || ''}></textarea>
                        </td>
                    </tr>  
                    <tr>
                        <td >{i18n.t(200363/*仓储装箱要求*/)}</td>
                        <td colSpan="9">
                            <textarea readOnly placeholder="" style={{height: "90px"}} name="stPackReq" defaultValue={getOneData['stPackReq'] || ''}></textarea>
                        </td>
                    </tr> 
                    <tr>
                        <td >{i18n.t(200364/*拍照要求*/)}</td>
                        <td colSpan="9">
                            <textarea readOnly placeholder="" style={{height: "90px"}} name="photoReq" defaultValue={getOneData['photoReq'] || ''}></textarea>
                        </td>
                    </tr> 
                    <tr>
                        <td>{i18n.t(100105/*唛头*/)}</td>
                        <td colSpan="9" style={{textAlign:'left'}}><input readOnly name="marks" defaultValue={getOneData['marks'] || ''}/></td>
                    </tr>
                    <tr>
                        <td>{i18n.t(700037/*其他货运要求*/)}</td>
                        <td colSpan="9" style={{textAlign:'left'}}><input readOnly name="otherReq" defaultValue={getOneData['otherReq'] || ''}/></td>
                    </tr>  
                    <tr>
                        <td>{i18n.t(100128/*单据要求*/)}</td>
                        <td colSpan="9"></td>
                    </tr>  
                    <tr>
                        <td colSpan="10">
                            <textarea readOnly style={{height: "90px"}} name="reqirs" defaultValue={getOneData['reqirs'] || ''}></textarea>
                        </td>
                    </tr>                                                                                                                                                                                                                                                                                           
                    </tbody>
                </table>
            </div>
        );        
    }
}

const MessageFlowFrom =createForm()(MessageFlow);
export default MessageFlowFrom;