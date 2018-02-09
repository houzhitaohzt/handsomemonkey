import i18n, {I18n} from '../../../../../lib/i18n';
import React, {Component} from 'react';
import {createForm, FormWrapper} from "../../../../../components/Form";
//引入弹层
// common
import ServiceTips from '../../../../../components/ServiceTips'; // 提示
import {ConstMiniSelect, Option, ConstVirtualSelect} from '../../../../../components/Select'; // 下拉
import xt from '../../../../../common/xt'; // 下拉
import {API_FOODING_DS, API_FOODING_ERP, apiGet, apiPost,} from '../../../../../services/apiCall';

class CommonForm extends Component {
    constructor(props) {
        super(props)
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = this.initState();
        this.addClick = this.addClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.state = {
            nianxianArray: [{}],
            deleteArray: []
        };
    }

    deleteClick(i) {
        let {deleteArray, nianxianArray} = this.state;
        let delObjc = nianxianArray[i];
        delObjc.id && !~deleteArray.indexOf(delObjc.id) && deleteArray.push(delObjc.id);
        nianxianArray.splice(i, 1, null);
        this.setState({
            nianxianArray,
            deleteArray,
        });
    }

    initState() {
        return {
            productArray: [],
            billDtlId: null,
            productData: {},
            priceArray: []
        }
    }

    addClick() {
        this.props.form.validateFields((error, value) => {
            if (error) {
                console.log(error, value);
            } else {
                let that = this;
                let array = this.state.nianxianArray;
                array.push({});
                this.setState({
                    nianxianArray: array
                })
            }

        })
    }

    componentWillReceiveProps(props) {
        let {data} = props;
        let {billDtlId} = this.state;
        let record = data.number === 1 ? null : data.record;
        if (record && record.billDtlId !== billDtlId) {
            this.getEditOne(record.billDtlId);
        }
    }

    componentDidMount() {
        let that = this;
        apiGet(API_FOODING_DS, '/tradruleForbidStatn/getList',
            {sourceId: this.props.otherData}, (response) => {
                this.setState({
                    nianxianArray: response.data.length > 0 ? response.data : [{}]
                });
            }, (error) => {

            });
    }


    onSaveAndClose(isAdd) {
        let {data, initData} = this.props;
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {

            } else {
                value = Object.assign({delIdList: this.state.deleteArray}, value);
                this.props.onSaveAndClose(value, value);
                this.props.form.resetFields();
            }
        })
    }

    onCancel() {
        this.props.form.resetFields();
        this.setState({...this.initState()}, this.props.onCancel);
    }

    render() {
        let that = this;
        let {data, initData} = this.props;
        let otherData = this.props.otherData
        const {countrys, statnTypes, countryId} = initData;
        const {getNFieldProps, getFieldProps, getFieldError, getFieldValue} = this.props.form;
        let content = <div></div>
        let common = <div></div>;
        let nianxianArray = this.state.nianxianArray;
        let lastIndex = -1;
        // 编辑 参数
        common = nianxianArray.map((e, i) => {
            if (e == null) return e;

            let comp = (<div className='row' key={i}>
                {
                    data.number === 1 ? <i>
                            <i {...getFieldProps('beanList[' + i + '].dataTyId', {
                                initialValue: 30,
                            })}/>
                            <i {...getFieldProps('beanList[' + i + '].id', {
                                validateFirst: true,
                                initialValue: e.id || ''
                            })}/>
                            <i {...getFieldProps('beanList[' + i + '].beId', {
                                validateFirst: true,
                                initialValue: this.props.otherData
                            })}  />
                            <i {...getFieldProps('beanList[' + i + '].optlock', {
                                validateFirst: true,
                                initialValue: e.id?e.optlock:null
                            })}  />
                        </i> :
                        <i>
                            <i {...getFieldProps('beanList[' + i + '].dataTyId', {
                                initialValue: e.dataTyId || 30,
                            })} />
                            <i {...getFieldProps('beanList[' + i + '].optlock', {
                                validateFirst: true,
                                initialValue: e.optlock
                            })}/>
                            <i {...getFieldProps('beanList[' + i + '].id', {
                                validateFirst: true,
                                initialValue: e.id
                            })} />
                            <i {...getFieldProps('beanList[' + i + '].beId', {
                                validateFirst: true,
                                initialValue: e.beId || otherData
                            })} />
                        </i>
                }
                <div className="form-group col-md-12 col-lg-12">
                    <div className="form-group col-xs-3 col-md-3">
                        <ConstVirtualSelect
                            form={this.props.form}
                            isRequest={false}
                            fieldName={'beanList[' + i + '].cntryId'}
                            rules
                            initialValue={e.cntryId}
                            className="col-md-8 col-lg-8"
                            initValueOptions={countrys}

                        />
                    </div>
                    <div className="form-group col-xs-3 col-md-3">
                        <ConstVirtualSelect
                            form={this.props.form}
                            isRequest={false}
                            fieldName={'beanList[' + i + '].statnTyId'}
                            rules
                            initValueOptions={statnTypes}
                            initialValue={e.statnTyId}
                            className="col-md-8 col-lg-8"
                        />
                    </div>
                    <div className="form-group col-xs-3 col-md-3">
                        <ConstVirtualSelect
                            form={this.props.form}
                            initialValue={e.statnId}
                            initValueOptions={e.statn && [e.statn] || e.statn}
                            isRequest={Boolean(getFieldValue('beanList[' + i + '].statnTyId', e.statnTyId)) && Boolean(getFieldValue('beanList[' + i + '].cntryId',e.cntryId))}
                            refreshMark={getFieldValue('beanList[' + i + '].statnTyId',e.statnTyId) + "" + getFieldValue('beanList[' + i + '].cntryId',e.statnTyId)}
                            fieldName={'beanList[' + i + '].statnId'}
                            apiUri="/statn/getByStCn"
                            rules
                            apiParams={{
                                statnTyId: getFieldValue('beanList[' + i + '].statnTyId', e.statnTyId),
                                cntryId: getFieldValue('beanList[' + i + '].cntryId', e.cntryId)
                            }}


                        />
                    </div>
                    <div className="form-group col-xs-3 col-md-3">
                        <i className='foddingicon fooding-add-icon3'
                           style={{paddingLeft: '20px'}}
                           onClick={this.addClick.bind(this, i)}></i>
                        {i == 0 ? '' :
                            <i className='foddingicon fooding-delete-icon4'
                               style={{paddingLeft: '20px'}} onClick={this.deleteClick.bind(this, i)}></i>
                        }
                    </div>
                </div>
            </div>)
            lastIndex = i;
            return comp;
        })
        //订单产品
        if (data.number == 0 || data.number == 1) {
            content = (
                <div className={'girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-xs-3 col-md-3">
                            <label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100087/*国家*/)}</label>
                        </div>
                        <div className="form-group col-xs-3 col-md-3">
                            <label className={'col-xs-5 col-md-5'}><span>*</span>{I18n.t(100224/*运输方式*/)}</label>
                        </div>
                        <div className="form-group col-xs-3 col-md-3">
                            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100155/*港口*/)}</label>
                        </div>
                    </div>
                    {common}

                </div>)
        }
        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
            {content}
        </FormWrapper>);
    }
}

CommonForm = createForm()(CommonForm);

export default CommonForm;
