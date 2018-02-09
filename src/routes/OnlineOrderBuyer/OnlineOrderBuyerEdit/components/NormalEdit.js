import React, {Component} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
import Checkbox from  '../../../../components/CheckBox';
import Select, {Option, ConstMiniSelect} from '../../../../components/Select';
import Radio from "../../../../components/Radio";
import DataTime from '../../../../components/Calendar/Calendar';
import xt from './../../../../common/xt';
import {apiGet, apiPost, apiForm, language, API_FOODING_ERP, API_FOODING_DS, API_FOODING_ES} from '../../../../services/apiCall';
import {I18n} from '../../../../lib/i18n';
export default class NormlEdit extends Component {
    constructor(props){
        super(props)
        this.StateChange=this.StateChange.bind(this);
        this.AddressChange=this.AddressChange.bind(this);
        this.state=this.initState();
        this.zhifuSelect = this.zhifuSelect.bind(this);
        this.jiayiSelect = this.jiayiSelect.bind(this);
    }
    initState(){
        return {
            radioState:'',
            radioAddress:'',
            
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
    jiayiSelect(e,item){
        let that = this;
        let businessOne = this.props.businessOne;
        businessOne = Object.assign({},businessOne,{pShipMark:item.props.objValue.pShipMark});
        that.props.setGetOne(businessOne);
    }
    zhifuSelect(e,item){
        let that = this;
        let businessOne = this.props.businessOne;
        businessOne = Object.assign({},businessOne,{corpMark:item.props.objValue.corpMark,corpTypeName:item.props.objValue.corpTypeName,corpType:item.props.objValue.corpType});
        that.props.setGetOne(businessOne);
    }
    render() {
        const {backClick, releseClick, confirmClick, saveClick, form} = this.props;
        const {getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;
        const {businessOne} = this.props;

        return (<div className={'addnormal'} style={{marginBottom: '10px'}}>
            <div className={'addnormal-title'}>
                <span>{I18n.t(100138/*常规*/)}</span>
                <span onClick={backClick} title={I18n.t(100431/*返回*/)}><i className={'foddingicon fooding-back'}/></span>
                <span onClick={saveClick} title={I18n.t(100430/*保存*/)}><i className={'foddingicon fooding-save'}/></span>
            </div>
            <div className={'  girdlayout'}>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{I18n.t(500096/*询单编号*/)}</label>
                        <input disabled type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                               {...getFieldProps('no', {
                                   validateFirst: true,
                                   rules: [{required: true,}],
                                   initialValue: String(businessOne.no || ''),
                               })}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{I18n.t(500097/*订单类型*/)}</label>
                         <input disabled type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                               {...getNFieldProps('billType', {
                                   validateFirst: true,
                                   rules: [{required: true,}],
                                   initialValue: !xt.isEmpty(businessOne.billType)?{billType: businessOne.billType,s_label: businessOne.billTypeName}: '',
                               })}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{I18n.t(500098/*订单状态*/)}</label>
                        <input disabled type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                               {...getNFieldProps('status', {
                                   validateFirst: true,
                                   rules: [{required: true,}],
                                   initialValue:!xt.isEmpty(businessOne.status)?{status:businessOne.status,s_label:businessOne.statusName}: '',
                               })}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{I18n.t(500023/*订单日期*/)}</label>
                        <div className={'col-md-8 col-lg-8 datetime'}>
                                <DataTime 
                                    isShowIcon={true}
                                    showTime={false}
                                    width={'100%'}
                                    name={'billDate'}
                                    value={businessOne.billDate}
                                    form={this.props.form} 
                                />
                            </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(100284/*币种*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Curren'}
                                                 }} fieldName="cnyId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(businessOne["cny"+language], businessOne, ['cnyId', 'cnyLcName', 'cnyEnName'], "cny"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     cnyId: da.id,
                                                     cnyLcName: da.localName,
                                                     cnyEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 allowClear
                                                  reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
                            />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500099/*订单总额*/)}</label>
                        <input type="text" disabled className={'col-md-8 col-lg-8 text-input-nowidth'}
                               {...getFieldProps('amt', {
                                   initialValue:businessOne.amt || '',
                               })}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100376/*交易条款*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Incotm',queryParams:[{
                                                        attr:'incotmTyId',
                                                        expression:'=',
                                                        value:10
                                                     }]}
                                                 }} fieldName="incotmId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(businessOne["incotm"+language], businessOne, ['incotmId', 'incotmLcName', 'incotmEnName'], "incotm"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     incotmId: da.id,
                                                     incotmLcName: da.localName,
                                                     incotmEnName: da.name,
                                                     s_label: da.localName,
                                                     pShipMark:da.pShipMark
                                                 }}
                                                 >{da.localName}</Option>} 
                                                 onSelect = {this.jiayiSelect}
                                                 reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
                                />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(500062/*买保险*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                 <Checkbox
                                        style={{lineHeight:'32px'}}
                                        {...getFieldProps('pShipMark',{
                                            initialValue:businessOne.pShipMark?businessOne.pShipMark:false
                                        })}
                                        checked={this.props.form.getFieldValue("pShipMark")}
                                         disabled
                                />
                            </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100133/*支付条款*/)}</label>
                        <ConstMiniSelect form={this.props.form}
                                               pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getList',
                                                     params: {obj:'com.fooding.fc.ds.entity.PayTrm',queryParams:[{
                                                        attr:'payTagTypeId',
                                                        expression:'=',
                                                        value:10
                                                     }]}
                                                    
                                                 }} fieldName="payTrmId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(businessOne["payTrm"+language], businessOne, ['payTrmId', 'payTrmLcName', 'payTrmEnName'], "payTrm"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     payTrmId: da.id,
                                                     payTrmLcName: da.localName,
                                                     payTrmEnName: da.name,
                                                     s_label:da.localName,
                                                     corpMark:da.crdPrMark,
                                                     corpType:da.corpType.id,
                                                     corpTypeName:da.corpType.name
                                                 }}
                                                 
                                                 >{da.localName}</Option>} 
                                                 onSelect = {this.zhifuSelect}
                                                 reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
                                />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(500059/*买信保*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                 <Checkbox
                                        style={{lineHeight:'32px'}}
                                        {...getFieldProps('corpMark',{
                                            initialValue:businessOne.corpMark?businessOne.corpMark:false
                                        })}
                                        checked={this.props.form.getFieldValue("corpMark")}
                                        disabled
                                        
                                    />
                    </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(100189/*信保分类*/)}</label>
                            <Select 
                                    {...getNFieldProps('corpType',{
                                        initialValue:businessOne["corpTypeName"]?{s_label:businessOne['corpTypeName'],corpType:businessOne.corpType,corpTypeName:businessOne.corpTypeName}:undefined
                                     })}
                                    animation='slide-up'
                                   
                                    optionLabelProp="children"
                                    optionFilterProp="children"                         
                                    className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                    disabled
                                >   
                            </Select>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100224/*运输方式*/)}</label>
                        <ConstMiniSelect form={this.props.form} pbj='com.fooding.fc.enumeration.TransportType' fieldName="transId"
                                         initialValue={
                                             xt.initSelectValue(businessOne.transId, businessOne, ['transId', 'transLcName', 'transEnName'], "trans" + language, form)
                                         }
                                         optionValue={(da, di) => <Option key={di} objValue={{
                                             transId: da.id,
                                             transLcName: da.name,
                                             transEnName: da.name,
                                             s_label: da.name
                                         }}>{da.name}</Option>} reles={true}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100297/*起运港*/)}</label>
                        <ConstMiniSelect form={this.props.form}
                                         isRequest={Boolean( getFieldValue('transId', {}).transId)}
                                         refreshMark={getFieldValue('transId', {}).transId}
                                         pbj={{
                                             params: {
                                                 obj:'com.fooding.fc.ds.entity.Statn',
                                                 queryParams:[{attr:"statnTyId",expression:"=",value: getFieldValue('transId', {}).transId}]
                                             }
                                         }} fieldName="sStatnId"
                                         initialValue={
                                             xt.initSelectValue(businessOne.sStatnId && getFieldValue('transId', {}).transId === businessOne.transId,
                                                 businessOne, ['sStatnId', 'sStatnLcName', 'sStatnEnName'], "sStatn"+language, form)
                                         }
                                         optionValue={(da, di) => <Option key={di} objValue={{
                                             sStatnId: da.id,
                                             sStatnLcName: da.localName,
                                             sStatnEnName: da.name,
                                             s_label: da.localName
                                         }}>{da.localName}</Option>} reles ={true}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500089/*要求装运日*/)}</label>
                        <div className={'col-md-8 col-lg-8 datetime'}>
                            <DataTime
                                showTime={false}
                                isShowIcon={true}
                                width={'100%'}
                                validate={true}
                                form={this.props.form}
                                name={'validityDate'}
                                value={businessOne.validityDate}
                            />
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(100299/*货代公司*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                     pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.AgnShipBe'}
                                          }} fieldName="forwardBeId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(businessOne["forwardBe"+language], businessOne, ['forwardBeId', 'forwardBeLcName', 'forwardBeEnName'], "forwardBe"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                    forwardBeId: da.id,
                                                    forwardBeLcName: da.localName,
                                                    forwardBeEnName: da.name,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                           
                            />
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500088/*装箱类型*/)}</label>
                        <ConstMiniSelect form={this.props.form} pbj='com.fooding.fc.enumeration.PackType' fieldName="packType"
                                         initialValue={
                                             xt.initSelectValue(businessOne.packType, businessOne, ['packType', 'packTypeName'], 'packTypeName', form)}
                                         optionValue={(da, di) => <Option key={di} objValue={{
                                             packType: da.id,
                                             packTypeName: da.name,
                                             s_label: da.name
                                         }}>{da.name}</Option>} reles={true}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100298/*目的港*/)}</label>
                        <ConstMiniSelect form={this.props.form}
                                         isRequest={Boolean( getFieldValue('transId', {}).transId)}
                                         refreshMark={getFieldValue('transId', {}).transId}
                                         pbj={{
                                             params: {
                                                 obj:'com.fooding.fc.ds.entity.Statn',
                                                 queryParams:[{attr:"statnTyId",expression:"=",value: getFieldValue('transId', {}).transId}]
                                             }
                                         }} fieldName="eStatnId"
                                         initialValue={
                                             xt.initSelectValue(businessOne.eStatnId&&getFieldValue('transId', {}).transId === businessOne.transId, businessOne,
                                                 ['eStatnId', 'eStatnLcName','eStatnEnName'],"eStatn"+language, form)
                                         }
                                         optionValue={(da, di) => <Option key={di} objValue={{
                                             eStatnId: da.id,
                                             eStatnLcName: da.localName,
                                             eStatnEnName: da.name,
                                             s_label: da.localName
                                         }}>{da.localName}</Option>}  reles ={true}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(500092/*提单方式*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                     pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.enumeration.BillOfLading'}
                                          }} fieldName="billLadType"
                                                 initialValue={
                                                    xt.initSelectValue(businessOne.billLadType, businessOne, ['billLadType','billLadTypeName'], 'billLadTypeName' , this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     billLadType: da.id,
                                                     billLadTypeName: da.name,
                                                     s_label:da.name
                                                 }}>{da.name}</Option>}
                            allowClear={true}
                                                                           
                            />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(500063/*付款方式*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                     pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.PayTrmType'}
                                          }} fieldName="payTrmTyId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(businessOne["payTrmTy"+language], businessOne, ['payTrmTyId', 'payTrmTyLcName', 'payTrmTyEnName'], "payTrmTy"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     payTrmTyId: da.id,
                                                     payTrmTyLcName: da.localName,
                                                     payTrmTyEnName: da.name,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>}
                                                  allowClear={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                          
                            />
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-2 col-lg-2'}>{I18n.t(100336/*备注*/)}</label>
                                <textarea
                                   
                                    {...getFieldProps('note',{
                                            initialValue:businessOne.note?businessOne.note:''
                                    })}
                                    className={'col-md-10 col-lg-10 text-input-nowidth'}
                                    style={{resize:'none',height:'65px'}}
                                >
                                </textarea>
                    </div>
                </div>
            </div>
        </div>)
    }
}
