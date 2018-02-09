import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
//引入select插件
import Select, {Option} from "../../../../components/Select";
import {API_FOODING_DS, API_FOODING_ES, apiPost, apiGet} from "../../../../services/apiCall";
import {errorTips, successTips} from "../../../../components/ServiceTips";
import xt from '../../../../common/xt';
class CommonForm extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = this.initState();
    }

    static propTypes = {
        data: PropTypes.object,
        form: PropTypes.object,
        onSaveAndClose: PropTypes.func,
        onCancel: PropTypes.func,
        initData: PropTypes.object
    };

    initState() {
        let record = this.props.data.record;
        return {
            initData: {},
            attrValues: [],
            attrTags: record? record.expression === 'in' : false,
        }
    }

    static defaultProps = {
        onSaveAndClose(){
        },
        onCancel(){
        }
    };

    componentDidMount() {
        if(this.props.data.record){
            this.onAttrChange(this.props.data.record);
        }
    }

    onSaveAndClose() {
        const {form, onSaveAndClose, authorityData = []} = this.props;
        let {attrValues} = this.state;
        form.validateFields((errors, value) => {
            if (null == errors) {



                let record = form.getFieldsValue();
                let upRecord = this.props.data.record || {};
                let attrIds = record.attrValues;
                let params = {
                    id: upRecord.id,
                    ...record,
                    attrValues: Array.isArray(attrIds) ? attrIds: [attrIds],
                    partyId: this.props.partyId,
                    menuId: this.props.menuId,
                    attrValueNames: attrValues.filter(da => attrIds.indexOf(da.id) !== -1).map(da => da.name)
                };
                if(authorityData.filter(da => da.id!==params.id && da.attrId === params.attrId && da.expression === params.expression).length ){
                    errorTips("所选属性值对应的表达式已存在!");
                } else {
                    apiPost(API_FOODING_ES, '/objectParty/save', params, (value) => {
                        successTips("保存成功!");
                        onSaveAndClose && onSaveAndClose(value);
                    }, (msg) => {
                        errorTips(msg.message);
                    });
                }

            }
        })
    }

    componentWillReceiveProps(props) {
        if(props.data.record && this.props.data.record !== props.data.record){
            this.onAttrChange(props.data.record);
        }
    }

    onAttrChange = data => {
        let that = this;
        this.setState({attrValues: []});
        this.props.form.resetFields(['attrValues'])
        console.log(this.props.data.record);
        if(data.attrClass === 'com.fooding.fc.es.entity.Staff'){
            apiGet(API_FOODING_ES, '/user/getListForPermissionsInParty', {partyId: this.props.partyId},
                (response) => {
                    let data = response.data.map(da => ({id: da.refId, name: da.staffLocalName}));
                    xt.getItemValue(that.props, 'data.record.attrValues', []).forEach((da, index) => {
                        // data.push({id: da, name: that.props.data.record.attrValueNames[index]});
                    });
                    this.setState({attrValues: data});
                }, (errors) => {
                    errorTips("属性配置有误!");
                });
        } else {
            apiPost(API_FOODING_DS, '/object/getMiniList', {obj: data.attrClass},
                (response) => {
                    //  let data = response.data.map(da => ({id: da.refId, name: da.staffLocalName}));
                    // xt.getItemValue(that.props, 'data.record.attrValues', []).forEach((da, index) => {
                    //     data.findIndex(dx => dx.id !== da) !== -1 && data.push({id: da, name: that.props.data.record.attrValueNames[index]});
                    // });
                    // this.setState({attrValues: data});
                    this.setState({attrValues: response.data});
                }, (errors) => {
                    errorTips("属性配置有误!");
                });
        }

    };

    onExpressionChange = data => {
        let {attrTags} = this.state;
        let nTags = data === 'in';
        if (attrTags !== nTags) {
            this.setState({attrTags: nTags});
            this.props.form.setFieldsValue({attrValues: undefined});
        }
    };

    onCancel() {
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel();
        }
        this.props.form.resetFields();
    }

    render() {
        const {form, initData, data} = this.props;
        let record = data.number === 0 ? null : data.record;
        const {getFieldProps, getNFieldProps, getFieldErrorStyle, getFieldValue} = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        let {attrValues} = this.state;
        let dom = (<div className={'  girdlayout'} style={{height: "88px"}}>
            <div className={'row'}>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200896/*属性*/)}</label>
                    <Select
                        animation='slide-up'
                        placeholder=''
                         allowClear={false}
                        className={getFieldErrorStyle('attr', 'error-border', 'currency-btn select-from-currency col-xs-9 col-md-9')}
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        {...getNFieldProps('attr', {
                            validateFirst: true,
                            rules: [{required: true,}],
                            onChange: this.onAttrChange,
                            initialValue: record ? {
                                objectId: record.objectId,
                                attrClass: record.attrClass,
                                attrId: record.attrId,
                                s_label: record.attributeName
                            } : undefined
                        })}
                    >
                        {initData.objectAttributes.map((da, ix) =>
                            <Option key={ix} objValue={{
                                objectId: da.objectId,
                                attrClass: da.attrClass,
                                attrId: da.id,
                                s_label: da.name
                            }}>{da.name}</Option>
                        )}
                    </Select>
                </div>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(201129/*表达式*/)}</label>
                    <Select
                        animation='slide-up'
                        placeholder=''
                         allowClear={false}
                        className={getFieldErrorStyle('expression', 'error-border', 'currency-btn select-from-currency col-xs-9 col-md-9')}
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        {...getFieldProps('expression', {
                            validateFirst: true,
                            rules: [{required: true,}],
                            initialValue: record ? record.expression : undefined,
                            onChange: this.onExpressionChange
                        })}
                    >
                        {initData.expressions.map((da, ix) => <Option key={ix} value={da.id}>{da.name}</Option>)}
                    </Select>
                </div>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(201130/*属性值*/)}</label>
                    <Select
                        tags={this.state.attrTags}
                        animation='slide-up'
                        placeholder=''
                        className={getFieldErrorStyle('attrValues', 'error-border', 'currency-btn select-from-currency col-xs-9 col-md-9')}
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        allowClear={false}
                        {...getFieldProps('attrValues', {
                            validateFirst: true,
                            rules: [{required: true,}],
                            initialValue: record && record.attrId === getFieldValue('attr', {}).attrId ? record.attrValues.filter(da => attrValues.findIndex(x => x.id ===da) !== -1) : undefined
                        })}
                    >
                        {attrValues.map(da => <Option key={da.id} value={da.id}>{da.name}</Option>)}
                    </Select>
                </div>
            </div>
        </div>);
        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
            {dom}
        </FormWrapper>);
    }
}

CommonForm = createForm()(CommonForm);

export default CommonForm;

