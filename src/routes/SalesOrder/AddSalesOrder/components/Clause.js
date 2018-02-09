import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option, ConstMiniSelect, ConstVirtualSelect} from '../../../../components/Select';
import SelectChange from "../../../../components/SelectChange";
import Checkbox from '../../../../components/CheckBox';
import {
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_DS,
    language,
    pageSize,
    sizeList,
    API_FOODING_ERP,
    API_FOODING_ES
} from '../../../../services/apiCall';
import xt from '../../../../common/xt'; // 下拉
class Clause extends Component {
    constructor(props) {
        super(props)
        this.StateChange = this.StateChange.bind(this);
        this.AddressChange = this.AddressChange.bind(this);
        this.state = this.initState();
        this.clientClick = this.clientClick.bind(this);
        this.clientSelect = this.clientSelect.bind(this);
        this.LinkClick = this.LinkClick.bind(this);
        this.fLinkClick = this.fLinkClick.bind(this);
        this.shouhuoqyChange = this.shouhuoqyChange.bind(this);
        this.onWosiClick = this.onWosiClick.bind(this);
        this.updataSalBe = this.updataSalBe.bind(this);
    }

    initState() {
        return {
            radioState: '',
            radioAddress: '',
            clientArray: [],
            LinkArray: [],
            contrnyArray: [],
            fLinkArray: [],
            TzLinkArray: []
        }
    }

    onWosiClick() {
        let that = this;
        let object = {
            sendBeId: '',
            sendBeLcName: '',
            sendBeEnName: '',
        }
        let getOne = this.props.getOne;
        getOne = Object.assign({}, getOne, object);
        that.props.setGetOne(getOne);
    }

    shouhuoqyChange(e) {
        let that = this;
        let getOne = this.props.getOne;
        getOne = Object.assign({}, getOne, e);
        that.props.setGetOne(getOne);
    }

    TzLinkClick() {
        if (this.props.form.getFieldValue("noticeBusinessId") && this.props.form.getFieldValue("noticeBusinessId").noticeBusinessId) {
            apiGet(API_FOODING_DS, '/entContact/getByBeIdDataTyId', {
                beId: this.props.form.getFieldValue("noticeBusinessId").noticeBusinessId,
                dataTyId: 100
            }, response => {
                this.setState({TzLinkArray: response.data || []});
            }, error => {
            })
        }
    }

    fLinkClick() {
        if (this.props.form.getFieldValue("payBusinessId") && this.props.form.getFieldValue("payBusinessId").payBusinessId) {
            apiGet(API_FOODING_DS, '/entContact/getByBeIdDataTyId', {
                beId: this.props.form.getFieldValue("payBusinessId").payBusinessId,
                dataTyId: 100
            }, response => {
                this.setState({fLinkArray: response.data || []});
            }, error => {
            })
        }
    }

    LinkClick() {
        if (this.props.form.getFieldValue("receiptCcId") && this.props.form.getFieldValue("receiptCcId").receiptCcId) {
            apiGet(API_FOODING_DS, '/entContact/getByBeIdDataTyId', {
                beId: this.props.form.getFieldValue("receiptCcId").receiptCcId,
                dataTyId: 100
            }, response => {
                this.setState({LinkArray: response.data || []});
            }, error => {
            })
        }

    }

    clientClick(data) {
        if (data.trim() === '') return;
        apiGet(API_FOODING_DS, '/customer/search', {keyword: data}, response => {
            this.props.form.resetFields(['salBeId']);
            this.setState({clientArray: response.data || []});
        }, error => {
        })
    }

    updataSalBe() {
        let that = this;
        let getOne = this.props.getOne;
        apiPost(API_FOODING_DS, '/object/getMiniOne', {
            "obj": "com.fooding.fc.ds.entity.Customer",
            "queryParams": [{
                "attr": "id",
                "expression": "=",
                "value": getOne.salBeId
            }]
        }, (response) => {
            if (response.data) {
                let obj = Object.assign({}, getOne, {
                    salBeLcName: response.data.localName,
                    salBeEnName: response.data.name
                });
                that.props.setGetOne(obj);
            }
        }, (error) => {

        })
    }

    clientSelect(e, item) {
        if (e.salBeId === '') return;
        let that = this;
        let getOne = this.props.getOne;
        apiGet(API_FOODING_DS, '/customer/getCustInfoForErp', {id: e.salBeId}, response => {
            getOne = Object.assign({}, getOne, response.data);
            that.props.setGetOne(getOne, () => {
                let billDate = new Date(getOne.billDate).Format('yyyy-MM-dd');
                let payTrmId = getOne.payTrmId;
                let insBeId = getOne.insBeId;
                let corpTypeId = getOne.corpTypeId;
                let riskTyId = getOne.riskTyId;
                let ccId = getOne.ccId;
                if (billDate && payTrmId && insBeId &&
                    corpTypeId && riskTyId && ccId) {
                    apiGet(API_FOODING_ERP, '/termscreditrate/getRate', {
                        billDate: billDate, payTrmId: payTrmId, insBeId: insBeId,
                        corpTypeId: corpTypeId, riskTyId: riskTyId, ccId: ccId
                    }, (response) => {
                        let corTs = that.props.getOne;
                        corTs = Object.assign({}, getOne, {corpRate: response.data});
                        that.props.setGetOne(corTs);
                    }, (error) => {

                    })
                }
            });
        }, error => {
        })
    }

    StateChange(e) {
        let tex;
        tex = e.target.value;
        this.setState({
            radioState: tex
        })
    }

    componentDidMount() {
        apiPost(API_FOODING_DS, '/object/getMiniList', {obj: 'com.fooding.fc.ds.entity.Country'},
            (response) => {
                this.setState({
                    contrnyArray: response.data
                })
            }, (error) => {

            });
    }

    AddressChange(e) {
        let addres;
        addres = e.target.value;
        this.setState({
            radioAddress: addres
        })
    }

    render() {
        let {getOne} = this.props;
        let {getNFieldProps, getFieldError, getFieldProps, getFieldValue} = this.props.form;
        // let beField = getNFieldProps('salBeId',{
        // 								rules: [{required:true}],
        // 								initialValue:getOne["salBe"+language]?{s_label:getOne["salBe"+language], salBeId:getOne.salBeId, salBeLcName:getOne.salBeLcName, salBeEnName:getOne.salBeEnName}:undefined
        // 							 });
        // let beFieldValue = getFieldValue("salBeId") || {};
        let common;
        let isCcMark = getFieldProps('isCcMark', {
            initialValue: getOne.isCcMark ? getOne.isCcMark : false
        });
        let clusterId = getFieldValue("clusterId") || {};
        // let revBusinessId = getNFieldProps('revBusinessId',{
        // 								rules: [{required:true}],
        // 								initialValue:getOne["revBusiness"+language]?{s_label:getOne["revBusiness"+language], revBusinessId:getOne.revBusinessId, revBusinessLcName:getOne.revBusinessLcName, revBusinessEnName:getOne.revBusinessEnName}:undefined
        // 							 });
        // let revBusinessIdValue = getFieldValue("revBusinessId") || {};
        // let payBusinessId = getNFieldProps('payBusinessId',{
        // 								rules: [{required:true}],
        // 								initialValue:getOne["payBusiness"+language]?{s_label:getOne["payBusiness"+language], payBusinessId:getOne.payBusinessId, payBusinessLcName:getOne.payBusinessLcName, payBusinessEnName:getOne.payBusinessEnName}:undefined
        // 							 });
        // let payBusinessIdValue = getFieldValue("payBusinessId") || {};

        //通知企业
        // let noticeBusinessId = getNFieldProps('noticeBusinessId',{
        // 								rules: [{required:true}],
        // 								initialValue:getOne["noticeBusiness"+language]?{s_label:getOne["noticeBusiness"+language], noticeBusinessId:getOne.noticeBusinessId, noticeBusinessLcName:getOne.noticeBusinessLcName, noticeBusinessEnName:getOne.noticeBusinessEnName}:undefined
        // 							 });
        // let noticeBusinessIdValue = getFieldValue("remittanceCountryEnName") ||{}
        // let remittanceCountryEnName = getNFieldProps('remittanceCountryId',{
        // 								rules: [{required:true}],
        // 								initialValue:getOne["remittanceCountry"+language]?{s_label:getOne["remittanceCountry"+language], remittanceCountryId:getOne.remittanceCountryId, remittanceCountryLcName:getOne.remittanceCountryLcName, remittanceCountryEnName:getOne.remittanceCountryEnName}:undefined
        // 							 });
        // let remittanceCountryEnNamevalue = getFieldValue("remittanceCountryId") ||{}

        //客户地区
        let beAreaId = getNFieldProps('beAreaId', {
            initialValue: getOne["beArea" + language] ? {
                s_label: getOne["beArea" + language],
                beAreaId: getOne.beAreaId,
                beAreaLcName: getOne.beAreaLcName,
                beAreaEnName: getOne.beAreaEnName
            } : undefined
        });

        //客户汇款国
        let remittanceCountryId = getNFieldProps('remittanceCountryId', {
            initialValue: getOne["remittanceCountry" + language] ? {
                s_label: getOne["remittanceCountry" + language],
                remittanceCountryId: getOne.remittanceCountryId,
                remittanceCountryLcName: getOne.remittanceCountryLcName,
                remittanceCountryEnName: getOne.remittanceCountryEnName
            } : undefined
        });

        //美国制裁
        let sacInUsMark = getNFieldProps('sacInUsMark', {
            initialValue: getOne.sacInUsMark ? {
                s_label: getOne.sacInUsMark ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/),
                sacInUsMark: getOne.sacInUsMark
            } : {s_label: i18n.t(100142/*否*/), sacInUsMark: getOne.sacInUsMark}
        });

        //风险分类
        let riskTyId = getNFieldProps('riskTyId', {
            initialValue: getOne["riskTy" + language] ? {
                s_label: getOne["riskTy" + language],
                riskTyId: getOne.riskTyId,
                riskTyLcName: getOne.riskTyLcName,
                riskTyEnName: getOne.riskTyEnName
            } : undefined
        });



        let adress = this.props.getOne.addressList || [];
        let phone = this.props.getOne.phoneList || [];
        if (getFieldValue("isCcMark")) {
            common = <ConstMiniSelect form={this.props.form}
                                      isRequest={Boolean(clusterId.clusterId)}
                                      refreshMark={getFieldValue('clusterId', {}).clusterId}
                                      pbj={{
                                          apiType: apiGet, host: API_FOODING_ES, uri: '/party/getLoginCompanies',
                                          params: {clusId: clusterId.clusterId}
                                      }} fieldName="sendBeId"
                                      initValueOptions={[]}
                                      initialValue={
                                          xt.initSelectValue(getOne["sendBe" + language] && getFieldValue('clusterId', {}).clusterId === getOne.clusterId, getOne, ['sendBeId', 'sendBeLcName', 'sendBeEnName'], "sendBe" + language, this.props.form)
                                      }
                                      optionValue={(da, di) => <Option key={di} objValue={{
                                          sendBeId: da.id,
                                          sendBeLcName: da.localName,
                                          sendBeEnName: da.enName,
                                          s_label: da.localName
                                      }}>{da.localName}</Option>} reles={true}
                                      className={'currency-btn select-from-currency col-md-8 col-lg-8'}
            />;
        } else {
            common = <ConstMiniSelect form={this.props.form}
                                      isRequest={Boolean(getFieldValue("salBeId", getOne).salBeId)}
                                      refreshMark={getFieldValue('salBeId', {}).salBeId}
                                      pbj={{
                                          apiType: apiGet, host: API_FOODING_DS, uri: '/partner/getListBySourceId',
                                          params: {
                                              sourceId: getFieldValue("salBeId", getOne).salBeId,
                                              dataTyId: 30,
                                              isAddSelf: true
                                          }
                                      }} fieldName="sendBeId"
                                      initValueOptions={[]}
                                      initialValue={
                                          xt.initSelectValue(getOne["sendBe" + language] && getFieldValue('salBeId', {}).salBeId === getOne.salBeId, getOne, ['sendBeId', 'cnyLcName', 'sendBeEnName'], "sendBe" + language, this.props.form)
                                      }
                                      optionValue={(da, di) => <Option key={di} objValue={{
                                          sendBeId: da.enterpriseId,
                                          sendBeLcName: da.enterpriseLcName,
                                          sendBeEnName: da.enterpriseEnName,
                                          s_label: da["enterprise" + language]
                                      }}>{da["enterprise" + language]}</Option>} reles={true}
                                      className={'currency-btn select-from-currency col-md-8 col-lg-8'}
            />;
        }
        return (
            <div className={'addnormal'} style={{marginTop: '10px'}}>
                <div className={'addnormal-title'}>
                    <span>{i18n.t(500057/*商务条款*/)}</span>
                </div>
                <div className={'  girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100311/*客户*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                fieldName='salBeId'
                                apiUri='/customer/search'
                                onChange={this.clientSelect}
                                async={true}
                                apiParams='keyword'
                                initialValue={
                                    getOne["salBe" + language] ? {
                                        s_label: getOne["salBe" + language],
                                        salBeId: getOne.salBeId, salBeLcName: getOne.salBeLcName,
                                        salBeEnName: getOne.salBeEnName
                                    } : undefined
                                }
                                valueKeys={da => ({
                                    salBeId: da.id,
                                    salBeLcName: da.localName,
                                    salBeEnName: da.name,
                                    s_label: da.localName
                                })} rules={true}
                                disabled={getOne.salBeId ? true : false}
                            />
                            <i className={getOne.salBeId ? 'foddingicon fooding-update' : 'none'} style={{
                                position: 'absolute', fontSize: '18px',
                                color: '#333', right: '0px', paddingTop: '5px'
                            }} title={i18n.t(300065/*更新客户名称*/)} onClick={this.updataSalBe}></i>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(600243/*投保企业*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                             isRequest={Boolean(getFieldValue("salBeId", getOne).salBeId)}
                                             refreshMark={getFieldValue('salBeId', {}).salBeId}
                                             pbj={{
                                                 apiType: apiGet,
                                                 host: API_FOODING_DS,
                                                 uri: '/partner/getListBySourceId',
                                                 params: {
                                                     sourceId: getFieldValue("salBeId", getOne).salBeId,
                                                     dataTyId: 30,
                                                     isAddSelf: true
                                                 }
                                             }} fieldName="payBusinessId"
                                             initValueOptions={[]}
                                             initialValue={
                                                 xt.initSelectValue(getOne["payBusiness" + language], getOne, ['payBusinessId', 'payBusinessLcName', 'payBusinessEnName'], "payBusiness" + language, this.props.form)
                                             }
                                             optionValue={(da, di) => <Option key={di} objValue={{
                                                 payBusinessId: da.enterpriseId,
                                                 payBusinessLcName: da.enterpriseLcName,
                                                 payBusinessEnName: da.enterpriseEnName,
                                                 s_label: da.enterpriseLcName
                                             }}>{da.enterpriseLcName}</Option>} reles={true}
                                             className={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(500045/*收货企业*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                             isRequest={Boolean(getFieldValue("salBeId", getOne).salBeId)}
                                             refreshMark={getFieldValue('salBeId', {}).salBeId}
                                             pbj={{
                                                 apiType: apiGet,
                                                 host: API_FOODING_DS,
                                                 uri: '/partner/getListBySourceId',
                                                 params: {
                                                     sourceId: getFieldValue("salBeId", getOne).salBeId,
                                                     dataTyId: 30,
                                                     isAddSelf: true
                                                 }
                                             }} fieldName="revBusinessId"
                                             initValueOptions={[]}
                                             initialValue={
                                                 xt.initSelectValue(getOne["revBusiness" + language], getOne, ['revBusinessId', 'revBusinessLcName', 'revBusinessEnName'], "revBusiness" + language, this.props.form)
                                             }
                                             optionValue={(da, di) => <Option key={di} objValue={{
                                                 revBusinessId: da.enterpriseId,
                                                 revBusinessLcName: da.enterpriseLcName,
                                                 revBusinessEnName: da.enterpriseEnName,
                                                 s_label: da.enterpriseLcName,
                                                 reclinkId: da.entContactorId,
                                                 reclinkLcName: da.entContactorLcName,
                                                 reclinkEnName: da.entContactorEnName,
                                                 recTel: da.phone,
                                                 recFax: da.fax,
                                                 recAddress: da.address,
                                                 recAddressList: da.addressList,
                                                 reclinkList: da.phoneList
                                             }}>{da.enterpriseLcName}</Option>}
                                             onChange={this.shouhuoqyChange}
                                             className={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(500046/*收货联系人*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                             isRequest={Boolean(getFieldValue("revBusinessId", getOne).revBusinessId)}
                                             refreshMark={getFieldValue("revBusinessId", getOne).revBusinessId}
                                             pbj={{
                                                 apiType: apiGet,
                                                 host: API_FOODING_DS,
                                                 uri: '/entContact/getByBeIdDataTyId',
                                                 params: {
                                                     beId: getFieldValue("revBusinessId", getOne).revBusinessId,
                                                     dataTyId: 100
                                                 }
                                             }} fieldName="reclinkId"
                                             initValueOptions={[]}
                                             initialValue={
                                                 xt.initSelectValue(getOne["reclink" + language], getOne, ['reclinkId', 'reclinkLcName', 'reclinkEnName'], "reclink" + language, this.props.form)
                                             }
                                             optionValue={(da, di) => <Option key={di} objValue={{
                                                 reclinkId: da.id,
                                                 reclinkLcName: da.localName,
                                                 reclinkEnName: da.name,
                                                 s_label: da.localName,

                                             }}>{da.localName}</Option>}
                                             className={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200158/*客户国家*/)}</label>
                            <Select
                                {...getNFieldProps('beCntryId', {
                                    initialValue: getOne["beCntry" + language] ? {
                                        s_label: getOne["beCntry" + language],
                                        beCntryId: getOne.beCntryId, beCntryLcName: getOne.beCntryLcName,
                                        beCntryEnName: getOne.beCntryEnName
                                    } : undefined
                                })}
                                animation='slide-up'
                                placeholder=''
                                optionLabelProp="children"
                                optionFilterProp="children"
                                className={getFieldError('beCntryId') ? 'currency-btn select-from-currency col-md-8 col-lg-8 error-border' : 'currency-btn select-from-currency col-md-8 col-lg-8'}
                                disabled
                            >
                            </Select>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200163/*收货人电话*/)}</label>
                            <Select
                                {...getFieldProps('recTel', {
                                    initialValue: getOne["recTel"] ? getOne["recTel"] : undefined
                                })}
                                combobox
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                notFoundContent=""
                                filterOption={false}
                                className={'col-md-8 col-lg-8 text-input-nowidth'}
                            >
                                {phone.map((e, i) => {
                                    return <Option key={i} value={e}>{e}</Option>
                                })}
                            </Select>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200164/*收货人传真*/)}</label>
                            <input
                                type="text" {...getFieldProps('recFax', {
                                initialValue: getOne["recFax"] ? getOne["recFax"] : ''
                            })}
                                className={'col-md-8 col-lg-8 text-input-nowidth'}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200707/*付款联系人*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                             isRequest={Boolean(getFieldValue("payBusinessId", getOne).payBusinessId)}
                                             refreshMark={getFieldValue('payBusinessId', {}).payBusinessId}
                                             pbj={{
                                                 apiType: apiGet,
                                                 host: API_FOODING_DS,
                                                 uri: '/entContact/getByBeIdDataTyId',
                                                 params: {
                                                     beId: getFieldValue("payBusinessId", getOne).payBusinessId,
                                                     dataTyId: 100
                                                 }
                                             }} fieldName="payLinkId"
                                             initValueOptions={[]}
                                             initialValue={
                                                 xt.initSelectValue(getOne["payLink" + language], getOne, ['payLinkId', 'payLinkLcName', 'payLinkEnName'], "payLink" + language, this.props.form)
                                             }
                                             optionValue={(da, di) => <Option key={di} objValue={{
                                                 payLinkId: da.id,
                                                 payLinkLcName: da.localName,
                                                 payLinkEnName: da.name,
                                                 s_label: da.localName,

                                             }}>{da.localName}</Option>} reles={true}
                                             className={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-2 col-lg-2'}>{i18n.t(200166/*收货人地址*/)}</label>
                            <Select
                                {...getFieldProps('recAddress', {
                                    initialValue: getOne["recAddress"] ? getOne["recAddress"] : undefined
                                })}
                                combobox
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                notFoundContent=""
                                filterOption={false}
                                className={'col-md-10 col-lg-10 text-input-nowidth'}
                            >
                                {adress.map((e, i) => {
                                    return <Option key={i} value={e}>{e}</Option>
                                })}
                            </Select>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200708/*客户采购员*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                             isRequest={Boolean(getFieldValue("salBeId", getOne).salBeId)}
                                             refreshMark={getFieldValue('salBeId', {}).salBeId}
                                             pbj={{
                                                 apiType: apiGet,
                                                 host: API_FOODING_DS,
                                                 uri: '/entContact/getByBeIdDataTyId',
                                                 params: {beId: getFieldValue("salBeId", getOne).salBeId, dataTyId: 100}
                                             }} fieldName="cusLinkId"
                                             initValueOptions={[]}
                                             initialValue={
                                                 xt.initSelectValue(getOne["cusLink" + language], getOne, ['cusLinkId', 'cusLinkLcName', 'cusLinkEnName'], "cusLink" + language, this.props.form)
                                             }
                                             optionValue={(da, di) => <Option key={di} objValue={{
                                                 cusLinkId: da.id,
                                                 cusLinkLcName: da.localName,
                                                 cusLinkEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>} reles={true}
                                             className={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(500095/*通知企业*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                             isRequest={Boolean(getFieldValue("salBeId", getOne).salBeId)}
                                             refreshMark={getFieldValue('salBeId', {}).salBeId}
                                             pbj={{
                                                 apiType: apiGet,
                                                 host: API_FOODING_DS,
                                                 uri: '/partner/getListBySourceId',
                                                 params: {
                                                     sourceId: getFieldValue("salBeId", getOne).salBeId,
                                                     dataTyId: 30,
                                                     isAddSelf: true
                                                 }
                                             }} fieldName="noticeBusinessId"
                                             initValueOptions={[]}
                                             initialValue={
                                                 xt.initSelectValue(getOne["noticeBusiness" + language], getOne, ['noticeBusinessId', 'noticeBusinessLcName', 'noticeBusinessEnName'], "noticeBusiness" + language, this.props.form)
                                             }
                                             optionValue={(da, di) => <Option key={di} objValue={{
                                                 noticeBusinessId: da.enterpriseId,
                                                 noticeBusinessLcName: da.enterpriseLcName,
                                                 noticeBusinessEnName: da.enterpriseEnName,
                                                 s_label: da.enterpriseLcName,
                                                 noticeLinkId: da.entContactorId,
                                                 noticeLinkLcName: da.entContactorLcName,
                                                 noticeLinkEnName: da.entContactorEnName,
                                                 noticeTel: da.phone,
                                                 noticeFax: da.fax,
                                                 noticeAddress: da.address,
                                                 noticeAddressList: da.addressList,
                                                 noticeLinkList: da.phoneList
                                             }}>{da.enterpriseLcName}</Option>}
                                             onChange={this.shouhuoqyChange}
                                             className={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(500054/*通知联系人*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                             isRequest={Boolean(getFieldValue("remittanceCountryEnName", getOne).noticeBusinessId)}
                                             refreshMark={getFieldValue("remittanceCountryEnName", getOne).noticeBusinessId}
                                             pbj={{
                                                 apiType: apiGet,
                                                 host: API_FOODING_DS,
                                                 uri: '/entContact/getByBeIdDataTyId',
                                                 params: {
                                                     beId: getFieldValue("remittanceCountryEnName", getOne).noticeBusinessId,
                                                     dataTyId: 100
                                                 }
                                             }} fieldName="noticeLinkId"
                                             initValueOptions={[]}
                                             initialValue={
                                                 xt.initSelectValue(getOne["noticeLinkLcName"] && getFieldValue('noticeBusinessId', {}).noticeBusinessId == getOne.noticeBusinessId, getOne, ['noticeLinkId', 'noticeLinkLcName', 'noticeBusinessEnName'], "noticeLink" + language, this.props.form)
                                             }
                                             optionValue={(da, di) => <Option key={di} objValue={{
                                                 s_label: da.localName,
                                                 noticeLinkId: da.id,
                                                 noticeLinkLcName: da.localName,
                                                 noticeLinkEnName: da.name

                                             }}>{da.localName}</Option>}
                                             onChange={this.shouhuoqyChange}
                                             className={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200709/*客户操作员*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                             isRequest={Boolean(getFieldValue("salBeId", getOne).salBeId)}
                                             refreshMark={getFieldValue("salBeId", getOne).salBeId}
                                             pbj={{
                                                 apiType: apiGet,
                                                 host: API_FOODING_DS,
                                                 uri: '/entContact/getByBeIdDataTyId',
                                                 params: {beId: getFieldValue("salBeId", getOne).salBeId, dataTyId: 100}
                                             }} fieldName="cusOLinkId"
                                             initValueOptions={[]}
                                             initialValue={getOne["cusOLink" + language] && getFieldValue('salBeId', {}).salBeId === getOne.salBeId ? {
                                                 s_label: getOne["cusOLink" + language],
                                                 cusOLinkId: getOne.cusOLinkId,
                                                 cusOLinkLcName: getOne.cusOLinkLcName,
                                                 cusOLinkEnName: getOne.cusOLinkEnName
                                             } : undefined}
                                             optionValue={(da, di) => <Option key={di} objValue={{
                                                 cusOLinkId: da.id,
                                                 cusOLinkLcName: da.localName,
                                                 cusOLinkEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             className={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200347/*通知人电话*/)}</label>
                            <Select
                                {...getFieldProps('noticeTel', {
                                    initialValue: getOne["noticeTel"] ? getOne["noticeTel"] : undefined
                                })}
                                combobox
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                notFoundContent=""
                                filterOption={false}
                                className={'col-md-8 col-lg-8 text-input-nowidth'}
                            >
                                {phone.map((e, i) => {
                                    return <Option key={i} value={e}>{e}</Option>
                                })}
                            </Select>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200348/*通知人传真*/)}</label>
                            <input type="text" {...getFieldProps('noticeFax', {
                                initialValue: getOne.noticeFax ? getOne.noticeFax : ''
                            })}
                                   className={'col-md-8 col-lg-8 text-input-nowidth'}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200710/*我司发运*/)}</label>
                            <label style={{marginTop: '5px'}}>
                                <Checkbox
                                    {...getFieldProps('isCcMark', {
                                        initialValue: getOne.isCcMark ? getOne.isCcMark : false
                                    })}
                                    checked={this.props.form.getFieldValue("isCcMark")}
                                    onClick={this.onWosiClick}
                                />
                            </label>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200711/*提单发货方*/)}</label>
                            {common}
                        </div>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-2 col-lg-2'}>{i18n.t(200350/*通知人地址*/)}</label>
                            <Select
                                {...getFieldProps('noticeAddress', {
                                    initialValue: getOne["noticeAddress"] ? getOne["noticeAddress"] : undefined
                                })}
                                combobox
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                notFoundContent=""
                                filterOption={false}
                                className={'col-md-10 col-lg-10 text-input-nowidth'}
                            >
                                {adress.map((e, i) => {
                                    return <Option key={i} value={e}>{e}</Option>
                                })}
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Clause;
