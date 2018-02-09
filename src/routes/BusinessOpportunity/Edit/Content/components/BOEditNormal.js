import i18n from './../../../../../lib/i18n';
import React, {Component} from "react";
import NavConnect from "../../../../../components/NavigateTabs/containers/AddContainer";
import DataTime from "../../../../../components/Calendar/Calendar";
import {ConstVirtualSelect} from "../../../../../components/Select";
import {API_FOODING_DS, API_FOODING_ERP, apiGet, apiPost} from "../../../../../services/apiCall";
import {CustomerFind} from "../../../../../components/FindGridSelect";
import {errorTips} from "../../../../../components/ServiceTips"; //提示框
import xt from "./../../../../../common/xt";

class BOEditNormal extends Component {
    constructor(props) {
        super(props);
        this.state = this.initState();
    }

    initState() {
        return {
            enableBuyPsType: false,
            cusData: {},
        }
    }

    saveClick = () => {
        this.props.onSaveNormal();
    };

    backClick = () => {
        this.props.backClick();
    };

    onCusChange = value => {
        if (!value || !value.id) return this.setState({cusData: {}});
        apiGet(API_FOODING_DS, '/customer/getCustInfoForErp', {
            id: value.id
        }, ({data}) => {
            let cusData = {
                bizLinkId: data.cusLinkId,
                bizLinkLcName: data.cusLinkLcName,
                bizLinkEnName: data.cusLinkEnName,
                cnyId: data.cnyId,
                cnyLcName: data.cnyLcName,
                cnyEnName: data.cnyEnName,
                beAreaId:data.beAreaId,
                beAreaLcName:data.beAreaLcName,
                beAreaEnName:data.beAreaEnName,
                riskTyEnName:data.riskTyEnName,
                riskTyId:data.riskTyId,
                riskTyLcName:data.riskTyLcName,
                sacInUsMark:data.sacInUsMark
            };
            this.setState({cusData});
        }, (error) => {
            errorTips(error.message);
        })
    };

    onBuyPsTypeChange = value => {
        //别的客户决定
        if (parseInt(value) === 20) {
            this.setState({enableBuyPsType: true});
        } else if (this.state.enableBuyPsType) {
            this.setState({enableBuyPsType: false});
        }
    };

    componentWillReceiveProps(props) {
        if (props.businessOne !== this.props.businessOne) {
            props.businessOne && this.onBuyPsTypeChange(props.businessOne.buyPsType);
        }
    }

    render() {
        const {form, businessOne: one} = this.props;
        // disabled={Boolean(businessOne.salBeId) && !Boolean(this.props.location.query.cid)}
        const businessOne = Object.assign({}, one, this.state.cusData);
        const {getFieldProps, getFieldError, getFieldValue, getNFieldProps, getFieldErrorStyle} = form;
        getFieldProps("status", {initialValue: businessOne.status});
        let salBeFeild = xt.initSelectValue(businessOne.salBeId, businessOne,
            ['salBeId', 'salBeLcName', 'salBeEnName'], 'salBeLcName', form);

        let salBeValue = getFieldValue("salBeId") || {};
        return (
            <div className={'addnormal'}>
                <div className={'addnormal-title'}>
                    <span>{i18n.t(100138/*常规*/)}</span>
                    <span onClick={this.backClick}><i className={'foddingicon fooding-back'}/></span>
                    <span onClick={this.saveClick}><i className={'foddingicon fooding-save'}/></span>
                </div>
                <div className={'  girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(400048/*单据编号*/)}</label>
                            <input readOnly type="text" className={'col-md-8 col-lg-8 text-input-nowidth'} placeholder=""
                                   {...getFieldProps('no', {
                                       validateFirst: true,
                                       rules: [{required: true,}],
                                       initialValue: String(businessOne.no),
                                   })}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100323/*业务日期*/)}</label>
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
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(400049/*业务状态*/)}</label>
                            <input type="text" readOnly className={'col-md-8 col-lg-8 text-input-nowidth'}
                                   value={businessOne.statusName || ''}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200240/*预计收入*/)}</label>
                            <input type="text" readOnly className={'col-md-8 col-lg-8 text-input-nowidth'}
                                   {...getFieldProps('expInAmt', {
                                       initialValue: Number.isFinite(businessOne.expInAmt) ? String(businessOne.expInAmt) : '',
                                   })}
                            />
                        </div>
                    </div>
                    <div className={'row'}>

                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100304/*主题*/)}</label>

                            <input type="text"
                                   className={getFieldErrorStyle('theme', 'error-border', 'col-md-8 col-lg-8 text-input-nowidth')}
                                   placeholder=""
                                   {...getFieldProps('theme', {
                                       validateFirst: true,
                                       rules: [{required: true,}],
                                       initialValue: businessOne.theme || '',
                                   })}
                            />

                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100311/*客户*/)}</label>

                            <CustomerFind
                                form={this.props.form}
                                fieldName='salBeId'
                                apiUri='/customer/search'
                                async
                                apiParams='keyword'
                                rules={true}
                                onChange={this.onCusChange}
                                initialValue={salBeFeild}
                                valueKeys={ da => ({
                                    salBeId: da.id,
                                    salBeLcName: da.localName,
                                    salBeEnName: da.name,
                                    s_label: da.localName
                                })}
                                className={'col-md-8 col-lg-8'}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100370/*联系人*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form} disabled={!salBeValue.salBeId}
                                refreshMark={salBeValue.salBeId}
                                apiParams={{beId: salBeValue.salBeId, dataTyId: 100}}
                                apiUri="/entContact/getByBeIdDataTyId"
                                fieldName="bizLinkId"
                                initialValue={xt.initSelectValue(businessOne.bizLinkId, businessOne,
                                    ['bizLinkId', 'bizLinkLcName', 'bizLinkEnName'], 'bizLinkLcName', form)}
                                valueKeys={da => ({
                                    bizLinkId: da.id,
                                    bizLinkLcName: da.localName,
                                    bizLinkEnName: da.name,
                                    s_label: da.localName
                                })} rules
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500125/*货币*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                apiParams='com.fooding.fc.ds.entity.Curren'
                                fieldName="cnyId"
                                apiType={apiPost}
                                refreshMark={salBeValue.salBeId}

                                valueKeys={da => ({
                                    cnyId: da.id,
                                    cnyLcName: da.localName,
                                    cnyEnName: da.name,
                                    s_label: da.localName
                                })} rules
                                initialValue={xt.initSelectValue(businessOne.cnyId, businessOne, ['cnyId', 'cnyLcName', 'cnyEnName'], 'cnyLcName', form)}
                            />
                        </div>
                    </div>
                    <div className={'row'}>

                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200222/*购买流程*/)}</label>

                            <ConstVirtualSelect
                                form={this.props.form}
                                fieldName='buyPsType'
                                apiType={apiPost}
                                onChange={this.onBuyPsTypeChange}
                                className={'col-md-8 col-lg-8'}
                                clearable
                                initRequest={true}
                                initialValue={String(businessOne.buyPsType || '10')}
                                apiParams="com.fooding.fc.enumeration.BuyPsType"
                            />

                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200226/*最终用户*/)}</label>

                            <ConstVirtualSelect
                                form={this.props.form} disabled={!(this.state.enableBuyPsType && salBeValue.salBeId)}
                                refreshMark={salBeValue.salBeId + "/" + getFieldValue('buyPsType')}
                                apiParams={{sourceId: salBeValue.salBeId, dataTyId: 30, isAddSelf: false}}
                                apiUri="/partner/getListBySourceId"
                                fieldName="lastBeId"
                                initialValue={xt.initSelectValue(
                                    businessOne.lastBeId && this.state.enableBuyPsType, businessOne,
                                    ['lastBeId', 'lastBeLcName', 'lastBeEnName', 'lastLinkId', 'lastLinkLcName', 'lastLinkEnName'],
                                    'lastBeLcName')
                                }
                                valueKeys={da => ({
                                    lastBeId: da.enterpriseId,
                                    lastBeLcName: da.enterpriseLcName,
                                    lastBeEnName: da.enterpriseEnName,
                                    lastLinkId: da.entContactorId,
                                    lastLinkLcName: da.entContactorLcName,
                                    lastLinkEnName: da.enterpriseEnName,
                                    s_label: da.enterpriseLcName
                                })}
                            />

                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200227/*最终联系人*/)}</label>

                            <input type="text" className={'col-md-8 col-lg-8 text-input-nowidth'} disabled
                                   value={this.state.enableBuyPsType ? getFieldValue("lastBeId", {}).lastLinkLcName || businessOne.lastLinkLcName || "" : ''}/>

                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200228/*需求级别*/)}</label>

                            <ConstVirtualSelect
                                form={this.props.form}
                                fieldName='custLevel'
                                apiType={apiPost}
                                clearable
                                initRequest={true}
                                initialValue={String(businessOne.custLevel || '') || undefined}
                                apiParams="com.fooding.fc.enumeration.CustLevel"
                            />

                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200223/*商机等级*/)}</label>

                            <ConstVirtualSelect
                                form={this.props.form}
                                fieldName='levType'
                                apiType={apiPost}
                                clearable
                                initRequest={true}
                                initialValue={String(businessOne.levType || '') || undefined}
                                apiParams="com.fooding.fc.enumeration.LevType"
                            />

                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200243/*活动名称*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                fieldName='sourceId'
                                apiHost={API_FOODING_ERP}
                                responseName="data.data"
                                apiUri="/activity/getPage"
                                apiParams={{isPagable: false}}
                                clearable
                                initRequest={true}
                                valueKeys={da => ({
                                    sourceId: da.billId,
                                    markActvName: da.markActvName,
                                    s_label: da.markActvName
                                })}
                                initialValue={xt.initSelectValue(businessOne.sourceId, businessOne, ['sourceId', 'markActvName'], 'markActvName', form)}
                            />

                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(100148/*注释*/)}</label>

                            <input type="text" className={'col-md-8 col-lg-8 text-input-nowidth'} placeholder=""
                                   {...getFieldProps('instruct', {
                                       initialValue: String(businessOne.instruct || ''),
                                   })}
                            />

                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200224/*可能截止日期*/)}</label>
                            <div className={'col-md-8 col-lg-8 datetime'}>
                                <DataTime
                                    showTime={false}
                                    isShowIcon={true}
                                    width={'100%'}
                                    validate
                                    form={this.props.form}
                                    name={'mbEDate'}
                                    value={businessOne.mbEDate}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200159/*客户地区*/)}</label>
                             <input disabled type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                                   {...getNFieldProps('beAreaId', {
                                       initialValue: xt.initLabelValue(businessOne.beAreaId , businessOne, ['beAreaId', 'beAreaLcName', 'beAreaEnName'], 'beAreaLcName', form),
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
                        <div className="form-group col-md-3 col-lg-3">
                           <label className={'col-md-3 col-lg-3'}>{i18n.t(200160/*风险分类*/)}</label>
                            <input disabled type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                                   {...getNFieldProps('riskTyId', {
                                       initialValue: xt.initLabelValue(businessOne.riskTyId , businessOne, ['riskTyId', 'riskTyEnName', 'riskTyLcName'], 'riskTyLcName', form),

                                   })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NavConnect(BOEditNormal);
