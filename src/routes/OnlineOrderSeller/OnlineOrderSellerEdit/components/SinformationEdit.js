import React, {Component} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
import Select, {Option, ConstMiniSelect} from '../../../../components/Select';
import Radio from "../../../../components/Radio";
import xt from './../../../../common/xt';
 import {I18n} from '../../../../lib/i18n';
import {apiGet, apiPost, apiForm, language, API_FOODING_ERP, API_FOODING_DS, API_FOODING_ES} from '../../../../services/apiCall';

export default class NormlEdit extends Component {
    constructor(props){
        super(props)
        this.clientSelect = this.clientSelect.bind(this);
        this.state=this.initState();
    }
    initState(){
        return {
            radioState:'',
            radioAddress:'',
            partyArray:[]
        }
    }
    clientSelect(e,item){
        let that = this;
        let businessOne = this.props.businessOne;
        businessOne = Object.assign({},businessOne,e);
        that.props.setGetOne(businessOne);
    }
    componentDidMount(){
        apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.es.entity.Party',
            queryParams:[{attr:"typeId",expression:"=", value:30}]},
            (response)=>{
                this.setState({
                    partyArray:response.data
                })
            },(error)=>{

            });
    }
    render() {
        const {backClick, releseClick, confirmClick, saveClick, form} = this.props;
        const {getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;
        const {businessOne} = this.props;

        return (<div className={'addnormal'} style={{marginBottom: '10px'}}>
            <div className={'addnormal-title'}>
                <span>{I18n.t(500081/*卖方信息*/)}</span>
                <span onClick={backClick} title={I18n.t(100431/*返回*/)}><i className={'foddingicon fooding-back'}/></span>
                <span onClick={saveClick} title={I18n.t(100430/*保存*/)}><i className={'foddingicon fooding-save'}/></span>
            </div>
            <div className={'  girdlayout'}>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500036/*卖方企业*/)}</label>
                        <Select 
                                    {...getNFieldProps('ccId',{
                                        rules: [{required:true}],
                                        initialValue:businessOne["cc"+language]?{s_label:businessOne["cc"+language],ccId:businessOne.ccId,ccLcName:businessOne.ccLcName,ccEnName:businessOne.ccEnName}:undefined
                                     })}
                                    animation='slide-up'
                                    placeholder=''
                                    optionLabelProp="children"
                                    optionFilterProp="children"                     
                                    className ={getFieldError('ccId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}                          
                                >   
                                    {this.state.partyArray.map((o,i)=>
                                        <Option key={i} 
                                            objValue={{
                                                s_label:o.localName, 
                                                ccId:o.id, 
                                                ccLcName:o.localName, 
                                                ccEnName:o.name,
                                        }}title={o.name}>{o.name}</Option>)}
                                       
                            </Select>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{I18n.t(500082/*卖方部门*/)}</label>
                        <ConstMiniSelect form={this.props.form}
                                        isRequest={ Boolean(getFieldValue('ccId', {}).ccId)}
                                         refreshMark={getFieldValue('ccId', {}).ccId }
                                         pbj={{
                                             apiType: apiGet, host: API_FOODING_ES, uri: '/party/getPartysByType',
                                             params: {partyId: getFieldValue('ccId', {}).ccId,typeAttributeIds:["44"]}
                                            
                                         }} fieldName="salePorId"
                                         initialValue={xt.initSelectValue(businessOne.salePorId, businessOne ,
                                             ['salePorId', 'salePorLcName', 'salePorEnName'], 'salePor'+language, form)}
                                         optionValue={(da, di) => <Option key={di} objValue={{
                                             salePorId: da.id,
                                             salePorLcName: da.localName,
                                             salePorEnName: da.name,
                                             s_label: da.localName
                                         }}>{da.localName}</Option>}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{I18n.t(500085/*卖方联系人*/)}</label>
                       <ConstMiniSelect form={this.props.form}
                                        isRequest={ Boolean(getFieldValue('ccId', {}).ccId)}
                                         refreshMark={getFieldValue('ccId', {}).ccId }
                                         pbj={{
                                             apiType: apiGet, host: API_FOODING_ES, uri: '/user/getListForPermissionsInParty',
                                             params: {partyId:getFieldValue('ccId', {}).ccId}
                                            
                                         }} fieldName="saleLinkId"
                                         initialValue={xt.initSelectValue(businessOne.saleLinkLcName, businessOne ,
                                             ['saleLinkId', 'saleLinkLcName', 'saleLinkEnName'], 'saleLink'+language, form)}
                                         optionValue={(da, di) => <Option key={di} objValue={{
                                             saleLinkId: da.id,
                                             saleLinkLcName: da.staffLocalName,
                                             saleLinkEnName: da.staffName,
                                             s_label: da.staffName,

                                         }}>{da.staffLocalName}</Option>}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{I18n.t(500044/*联系电话*/)}</label>
                        <input  type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                               {...getFieldProps('saleLinkTel', {
                                  initialValue: String(businessOne.saleLinkTel || ''),
                               })}
                        />
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500083/*收款企业*/)}</label>
                        <ConstMiniSelect form={this.props.form}
                                                 isRequest={ Boolean(getFieldValue('ccId', businessOne).ccId)}
                                                 refreshMark={getFieldValue('ccId', businessOne).ccId }
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/partner/getListBySourceId',
                                                     params: {sourceId:getFieldValue('ccId', {}).ccId,dataTyId:[60],isAddSelf:true}
                                                 }} fieldName="receiptCcId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(businessOne.receiptCcLcName&& getFieldValue("ccId",businessOne).ccId== businessOne.ccId, businessOne, ['receiptCcId', 'receiptCcLcName', 'receiptCcEnName'], "receiptCc"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     receiptCcId:  da.enterpriseId,
                                                     receiptCcLcName:da.enterpriseLcName,
                                                     receiptCcEnName: da.enterpriseEnName,
                                                     s_label: da.enterpriseLcName
                                                 }}>{da.enterpriseLcName}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                           
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500086/*收款账号*/)}</label>
                       <ConstMiniSelect form={this.props.form}
                                                 isRequest={Boolean(getFieldValue('receiptCcId', businessOne).receiptCcId && getFieldValue('ccId', businessOne).ccId)}
                                                 refreshMark={getFieldValue('receiptCcId', businessOne).receiptCcId + getFieldValue('ccId', businessOne).ccId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/bankacct/getList',
                                                     params: {sourceId:getFieldValue('receiptCcId', {}).receiptCcId,}
                                                 }} fieldName="receBankAccountId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(businessOne["receBankAccount"+language] && getFieldValue("receiptCcId",businessOne).receiptCcId== businessOne.receiptCcId && getFieldValue("ccId",businessOne).ccId== businessOne.ccId, businessOne, ['receBankAccountId', 'receBankAccountLcName', 'receBankAccountEnName'], "receBankAccount"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     receBankAccountId: da.id,
                                                     receBankAccountLcName: da.bacctCode,
                                                     receBankAccountEnName: da.bacctCode,
                                                     receBankLcName:da.bankName,
                                                     receBankEnName :da.bankName,
                                                     s_label: da.bacctCode
                                                 }}>{da.bacctCode}</Option>}
                                                 reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                           
                            />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(500084/*关闭原因*/)}</label>
                            <input  type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                                   {...getFieldProps('closeInstruct', {
                                      initialValue: String(businessOne.closeInstruct || ''),
                                   })}
                            />
                     </div>
                     <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(100336/*备注*/)}</label>
                            <input  type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                                   {...getFieldProps('salerNote', {
                                      initialValue: String(businessOne.salerNote || ''),
                                   })}
                            />
                     </div>
                </div>
            </div>
        </div>)
    }
}
