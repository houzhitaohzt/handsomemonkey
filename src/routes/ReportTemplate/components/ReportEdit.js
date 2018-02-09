import i18n from './../../../lib/i18n';
import React from 'react';
import {observer} from 'mobx-react';
import {createForm, FormWrapper} from '../../../components/Form';
//引入select插件
import {ConstVirtualSelect} from './../../../components/Select';
import {ReportEditStore} from '../stores/ReportEditStore';
import Dialog from '../../../components/Dialog/Dialog'
import {apiPost, API_FOODING_DS} from '../../../services/apiCall';
import xt from '../../../common/xt';

@observer
export class ReportEdit extends React.Component {
    constructor(props) {
        super(props);
        props.store.setForm(props.form);
    }

    renderContext = () => {
        let that = this;
        let store = that.props.store;
        const {getFieldProps, getFieldErrorStyle, getFieldValue} = that.props.form;
        let oneData = store.oneData;
        return (
            <FormWrapper showFooter={true} onSaveAndClose={store.onSaveAndClose} onCancel={store.close}>
                <div className="girdlayout">
                    <div className={'row'}>
                        <label className={'col-xs-3 col-md-3'}>业务表单</label>
                        {
                            oneData ?
                                <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'} value={xt.getItemValue(oneData, 'formObject.localName', '')} readOnly={true}/>
                                : <ConstVirtualSelect
                                    disabled={!!oneData}
                                    form={that.props.form}
                                    fieldName='formObjectId'
                                    apiHost={API_FOODING_DS}
                                    rules
                                    apiUri="/formObject/formObjectType/getList"
                                    apiParams={{formObjectTypeId: 1}}
                                />
                        }
                    </div>
                </div>
                <div className="girdlayout">
                    <div className={'row'}>
                        <label className={'col-xs-3 col-md-3'}>模板名称</label>
                        <input type='text'
                               className={getFieldErrorStyle('username', 'error-border', 'col-xs-8 col-md-8 text-input-nowidth')}
                               {...getFieldProps('localName', {
                                   validateFirst: true,
                                   rules: [{required: true,}],
                                   valuedateTrigger: 'onBlur',
                                   initialValue: xt.getItemValue(oneData, 'localName', '')
                               })} />
                    </div>
                </div>
            </FormWrapper>
        )
    };

    render() {
        let that = this;
        let store = that.props.store;
        return (
            <Dialog width={500} visible={store.editVisible} title={store.editTitle}>
                {store.editVisible ? that.renderContext() : null}
            </Dialog>
        );
    }

}

export default createForm()(ReportEdit);
