import i18n from './../../../../lib/i18n';
import React, {Component} from "react";
import DataTime from "../../../../components/Calendar/Calendar";
import {ConstVirtualSelect} from "../../../../components/Select";
import {API_FOODING_DS, API_FOODING_ES, apiGet, apiPost, language} from "../../../../services/apiCall";
import {errorTips} from "../../../../components/ServiceTips"; //提示框
import xt from "./../../../../common/xt";
import {emitter} from "./../../../../common/EventEmitter";

class Addnormal extends Component {
    constructor(props) {
        super(props);
        this.state = this.initState()
    }

    initState() {
        return {
            businessOne: this.props.businessOne,
        }
    }

    componentDidMount() {
        emitter.on("ConstFormEvent.sorId", this.forceUpdate.bind(this));

        if(this.props.location.query&&this.props.location.query.cid){
            let value ={salBeId:this.props.location.query.cid};
            this.clientChange(value);
        }
    }

    componentWillUnmount() {
        emitter.off("ConstFormEvent.sorId");
    }

    componentWillReceiveProps(props) {
        if (props.businessOne.no !== this.props.businessOne.no) {
            // console.log(props.businessOne);
            this.setState({businessOne: props.businessOne});
        }
    }

    clientChange = value => {
        if (value.salBeId === '') return;
        let that = this;
        apiGet(API_FOODING_DS, '/customer/getCustInfoForErp', {id: value.salBeId}, response => {
            this.setState({businessOne: Object.assign({}, this.state.businessOne, response.data)});
        }, error => {
            errorTips(error.message)
        })
    };

    render() {

        const {form} = this.props;
        const {getFieldProps, getFieldErrorStyle, getFieldValue, getNFieldProps, getNFieldValue} = form;
        const {businessOne} = this.state;
        let salBeFeild = xt.initSelectValue(businessOne.salBeId, businessOne, [
            'salBeId', 'salBeLcName', 'salBeEnName'
        ], 'salBeLcName', form);
        let revBusiness = xt.initSelectValue(
            businessOne.revBusinessId, businessOne,
            ['revBusinessId', 'revBusinessLcName', 'revBusinessEnName',
                's_reclinkId', 's_reclinkLcName', 's_reclinkEnName', 's_recTel', 's_recFax', 's_recAddress'],
            'revBusinessLcName', form
        );
        let salBeValue = getFieldValue("salBeId") || {};
        return (
            <div className={'addnormal'}>
                <div className={'addnormal-title'}>
                    <span>{i18n.t(100138/*常规*/)}</span>
                    <span onClick={this.props.backClick}><i className={'foddingicon fooding-back'}/></span>
                    <span onClick={this.props.saveClick}><i className={'foddingicon fooding-save'}/></span>
                </div>
                <div className={'  girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400048/*单据编号*/)}</label>
                            <input disabled type="text" className={'col-md-8 col-lg-8 text-input-nowidth'} placeholder=""
                                   {...getFieldProps('no', {
                                       validateFirst: true,
                                       rules: [{required: true,}],
                                       initialValue: String(businessOne.no || ''),
                                   })}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(100323/*业务日期*/)}</label>
                            <div className={'col-md-8 col-lg-8 datetime'}>
                                <DataTime
                                    showTime={false}
                                    isShowIcon={true}
                                    width={'100%'}
                                    form={this.props.form}
                                    name={'billDate'}
                                    value={businessOne.billDate}
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400049/*业务状态*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={'paragraph shengyue'}>{businessOne.statusName}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400011/*销售员*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form} disabled={!Boolean(getFieldValue('sorId', {}).sorId)}
                                refreshMark={getFieldValue('sorId', {}).sorId}
                                apiUri="/user/getListForPermissionsInParty"
                                apiHost={API_FOODING_ES}
                                apiParams={{partyId: getFieldValue('sorId', {}).sorId}}
                                fieldName="saleStaffId"
                                initialValue={xt.initSelectValue(
                                    businessOne.saleStaffId && businessOne.sorId === (getFieldValue('sorId', {}).sorId),
                                    businessOne, ['saleStaffId', 'saleStaffLcName', 'saleStaffEnName'], 'saleStaffLcName'
                                )}
                                valueKeys={da => ({
                                    saleStaffId: da.refId,
                                    saleStaffLcName: da.staffLocalName,
                                    saleStaffEnName: da.staffName,
                                    s_label: da.staffLocalName
                                })} rules
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100311/*客户*/)}</label>
                            <ConstVirtualSelect
                                disabled={Boolean(businessOne.salBeId) && !Boolean(this.props.location.query.cid)}
                                form={this.props.form}
                                fieldName='salBeId'
                                apiUri='/customer/search'
                                async rules
                                apiParams='keyword'
                                onChange={this.clientChange}
                                initialValue={salBeFeild}
                                valueKeys={ da => ({
                                    salBeId: da.id,
                                    salBeLcName: da.localName,
                                    salBeEnName: da.name,
                                    s_label: da.localName
                                })}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200158/*客户国家*/)}</label>
                            <input disabled type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                                   {...getNFieldProps('beCntryId', {
                                       initialValue: xt.initLabelValue(businessOne.beCntryId && salBeValue.salBeId, businessOne, ['beCntryId', 'beCntryLcName', 'beCntryEnName'], 'beCntryLcName', form),
                                   })}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200159/*客户地区*/)}</label>
                            <input disabled type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                                   {...getNFieldProps('beAreaId', {
                                       initialValue: xt.initLabelValue(businessOne.beAreaId && salBeValue.salBeId, businessOne, ['beAreaId', 'beAreaLcName', 'beAreaEnName'], 'beAreaLcName', form),
                                   })}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(100096/*美国制裁*/)}</label>
                            <input disabled type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                                   {...getNFieldProps('sacInUsMark', {
                                       initialValue: {s_label: businessOne.sacInUsMark ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/), sacInUsMark: businessOne.sacInUsMark}
                                   })}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200160/*风险分类*/)}</label>
                            <input disabled type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                                   {...getNFieldProps('riskTyLcName', {
                                       initialValue: String(salBeValue.salBeId ? businessOne.riskTyLcName || '' : '')
                                   })}
                            />
                        </div>

                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200162/*客户业务员*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form} disabled={!salBeValue.salBeId} refreshMark={salBeValue.salBeId}
                                apiUri="/entContact/getByBeIdDataTyId"
                                apiParams={{beId: salBeValue.salBeId, dataTyId: 100}}
                                fieldName="cusLinkId"
                                initialValue={xt.initSelectValue(true, businessOne, ['cusLinkId', 'cusLinkLcName', 'cusLinkEnName'], 'cusLinkLcName', form)}
                                valueKeys={da => ({
                                    cusLinkId: da.id,
                                    cusLinkLcName: da.localName,
                                    cusLinkEnName: da.name,
                                    s_label: da.localName
                                })} rules
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(500044/*联系电话*/)}</label>
                            <input type='text' className={'col-md-8 col-lg-8 text-input-nowidth'}
                                   {...getFieldProps('cusLinkTel', {
                                       rules: [{required: false}],
                                       initialValue: String(salBeValue.salBeId ? businessOne.cusLinkTel || '' : '')
                                   })}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500045/*收货企业*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                disabled={ !salBeValue.salBeId}
                                refreshMark={salBeValue.salBeId}
                                apiParams={{sourceId: salBeValue.salBeId, dataTyId: 30, isAddSelf: true}}
                                apiUri="/partner/getListBySourceId"
                                fieldName="revBusinessId"
                                initialValue={ revBusiness}
                                valueKeys={da => ({
                                    revBusinessId: da.enterpriseId,
                                    revBusinessLcName: da.enterpriseLcName,
                                    revBusinessEnName: da.enterpriseEnName,
                                    s_label: da.enterpriseLcName,
                                    s_reclinkId: da.entContactorId,
                                    s_reclinkLcName: da.entContactorLcName,
                                    s_reclinkEnName: da.entContactorEnName,
                                    s_recTel: da.phone,
                                    s_recFax: da.fax,
                                    s_recAddress: da.address,
                                    s_phoneList: da.phoneList,
                                    s_addressList: da.addressList,
                                })} rules
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500050/*付款企业*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                disabled={!salBeValue.salBeId}
                                refreshMark={salBeValue.salBeId}
                                apiUri="/partner/getListBySourceId"
                                apiParams={{sourceId: salBeValue.salBeId, dataTyId: 30, isAddSelf: true}}
                                fieldName="payBusinessId"
                                initialValue={xt.initSelectValue(businessOne["payBusiness" + language], businessOne, ['payBusinessId', 'payBusinessLcName', 'payBusinessEnName'], 'payBusinessLcName', form)}
                                valueKeys={da => ({
                                    payBusinessId: da.enterpriseId,
                                    payBusinessLcName: da.enterpriseLcName,
                                    payBusinessEnName: da.enterpriseEnNa,
                                    s_label: da.enterpriseLcName
                                })} rules
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(500046/*收货联系人*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                disabled={ !(getFieldValue('revBusinessId', {}).revBusinessId && salBeValue.salBeId)}
                                refreshMark={getFieldValue('revBusinessId', {}).revBusinessId }
                                apiUri="/entContact/getByBeIdDataTyId"
                                apiParams={{beId: getFieldValue('revBusinessId', {}).revBusinessId, dataTyId: 100}}
                                fieldName="reclinkId"
                                initValueOptions={[]}
                                initialValue={xt.initSelectValue(businessOne.reclinkId, getNFieldValue('revBusinessId'),
                                    ['reclinkId', 'reclinkLcName', 'reclinkEnName'], 'reclinkLcName', form)}
                                valueKeys={da => ({
                                    reclinkId: da.id,
                                    reclinkLcName: da.localName,
                                    reclinkEnName: da.name,
                                    s_label: da.localName
                                })}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200163/*收货人电话*/)}</label>
                            <ConstVirtualSelect
                                refreshMark={getFieldValue('revBusinessId', {}).revBusinessId }
                                className="col-xs-8 col-md-8"
                                form={this.props.form}
                                fieldName='recTel'
                                autoComplete
                                isRequest={false}
                                initValueOptions={Array.from(new Set(getFieldValue('revBusinessId', {}, false).s_phoneList || (businessOne.recTel ? [businessOne.recTel] : [])))}
                                onChange={this.onProductChange}
                                initialValue={getFieldValue('revBusinessId', {}, false).s_recTel || ''}
                                rules={true}
                                valueKeys={da => String(da)}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200164/*收货人传真*/)}</label>
                            <input type="text" className={'col-md-8 col-lg-8 text-input-nowidth'} placeholder=""
                                   {...getNFieldProps('recFax', {
                                       initialValue: String(getFieldValue('revBusinessId', {}, false).s_recFax || '')
                                   })}
                            />
                        </div>
                    </div>
                    <div className={'row'}>

                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200165/*销售总额*/)}</label>
                            <input type="text"
                                   className={getFieldErrorStyle('saleTaxAmt', 'error-border', 'col-md-8 col-lg-8 text-input-nowidth')}
                                   placeholder=""
                                   {...getNFieldProps('saleTaxAmt', {
                                       validateFirst: true,
                                       rules: [{required: true, pattern: xt.pattern.positiveNonZero}],
                                       initialValue: Number.isFinite(businessOne.saleTaxAmt) ? String(businessOne.saleTaxAmt) : ''
                                   })}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(500125/*货币*/)}</label>
                            <ConstVirtualSelect
                                clearable
                                apiType={apiPost}
                                form={this.props.form}
                                apiParams='com.fooding.fc.ds.entity.Curren' fieldName="cnyId"
                                initValueOptions={[]}
                                valueKeys={da => ({
                                    cnyId: da.id,
                                    cnyLcName: da.localName,
                                    cnyEnName: da.name,
                                    s_label: da.localName
                                })}
                                initialValue={xt.initSelectValue(businessOne.cnyId, businessOne, ['cnyId', 'cnyLcName', 'cnyEnName'], 'cnyLcName', form)}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12 col-lg-12">
                            <label className={'col-md-1 col-lg-1'}><span>*</span>{i18n.t(200166/*收货人地址*/)}</label>
                            <ConstVirtualSelect
                                refreshMark={getFieldValue('revBusinessId', {}).revBusinessId }
                                className="col-xs-11 col-md-11"
                                form={this.props.form}
                                fieldName='recAddress'
                                autoComplete
                                isRequest={false}
                                initValueOptions={Array.from(new Set(getFieldValue('revBusinessId', {}, false).s_addressList || (businessOne.recAddress ? [businessOne.recAddress] : [])))}
                                onChange={this.onProductChange}
                                initialValue={getFieldValue('revBusinessId', {}, false).s_recAddress || ''}
                                rules={true}
                                valueKeys={da => String(da)}
                            />
                        </div>
                    </div>
                     <div className={'row'}>
                        <div className="form-group col-md-12 col-lg-12">
                            <label className={'col-md-1 col-lg-1'}>{i18n.t(100336/*备注*/)}</label>
                            <input type='text' className={'col-md-11 col-lg-11 text-input-nowidth'} {
                                ...getFieldProps('note', {
                                    initialValue: String(businessOne.note || '')
                                })
                            }/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Addnormal;
// <div className="form-group col-md-3 col-lg-3">
//     <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200161/*客户汇款国别*/)}</label>
//     <ConstVirtualSelect
//         form={this.props.form}
//         apiType={apiPost}
//         apiParams='com.fooding.fc.ds.entity.Country'
//         fieldName="remittanceCountryId"
//         valueKeys={da => ({
//             remittanceCountryId: da.id,
//             remittanceCountryLcName: da.localName,
//             remittanceCountryEnName: da.name,
//             s_label: da.localName
//         })} rules
//         initialValue={xt.initSelectValue(businessOne.cnyId, businessOne, ['remittanceCountryId', 'remittanceCountryLcName', 'remittanceCountryEnName'], 'remittanceCountryLcName', form)}
//     />
// </div>