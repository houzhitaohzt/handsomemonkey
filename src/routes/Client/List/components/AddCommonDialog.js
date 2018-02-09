import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
//引入select插件
import {ConstVirtualSelect} from "../../../../components/Select";
import * as ApiCall from "../../../../services/client/call";
import {addUpdateJson} from "../../../../services/client/call";
import {I18n} from "../../../../lib/i18n";
import {errorTips} from "../../../../components/ServiceTips";
import {API_FOODING_ES, apiPost} from "../../../../services/apiCall";
import WebData from "../../../../common/WebData";
import fieldsFormat from '../../../../common/FieldsFormat';

const {Table} = require("../../../../components/Table");
import InputBoxCheck from '../../../../components/InputBoxCheck';

class CommonForm extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.searchClick = this.searchClick.bind(this);
        this.state = this.initState();
        this.distinct_columns = [
            {
                title: i18n.t(100354/*客户代码*/),
                dataIndex: "code",
                key: "code",
                width: "20%",
                render(data, row, index){
                    return (<div className="text-ellipsis" title={data}>{data}</div>);
                }
            }, {
                title: i18n.t(100355/*客户名称*/),
                dataIndex: 'name',
                key: "name",
                width: '30%',
                render(data, row, index){
                    return (<div className="text-ellipsis" title={data}>{data}</div>)
                }
            }, {
                title: i18n.t(100087/*国家*/),
                dataIndex: "country",
                key: "country",
                width: "8%",
                render(data, row, index){
                    return data;
                }
            }
        ];
        this.lastCntryId = null;
        this.lastName = null;
    }

    static propTypes = {
        data: PropTypes.object,
        form: PropTypes.object,
        onSaveAndClose: PropTypes.func,
        onCancel: PropTypes.func,
        columns_add: PropTypes.array,
    };

    initState() {
        return {
            customerRechecking: "add-label-default",
            cntryId: '',
            staffIds: [],
            tableData: [],
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
        }
    }

    static defaultProps = {
        data: {},
        columns_add: [{
            title: I18n.t(100354/*客户代码*/),
            dataIndex: "code",
            key: "code",
            width: "40%",
            render(data, row, index){
                return (<div className="text-ellipsis" title={data}>{data}</div>);
            }
        }, {
            title: I18n.t(100355/*客户名称*/),
            dataIndex: 'name',
            key: "name",
            width: '40%',
            render(data, row, index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        }, {
            title: i18n.t(100087/*国家*/),
            dataIndex: "country",
            key: "country",
            width: "20%",
            render(data, row, index){
                return data;
            }
        }],
        onSaveAndClose(){
        },
        onCancel(){
        }
    };

    componentWillReceiveProps(props) {
        if(props.data !== this.props.data){
            this.props.form.resetFields();
            this.setState(this.initState());
        }
    }

    componentDidMount() {

    }

    queryCustomerList(currentPage, size, filter, callback) {
        let order = {column: 'id', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || page.currentPage;
        size = size || page.size;
        let params = Object.assign({}, {currentPage: currentPage, pageSize: size,isExact:true}, filter, order);

        ApiCall.getRepeatPage(params, response => {
            let {totalRecords, totalPages, currentPage, pageSize, data = []} = response.data;
            // this.setState({
            //     tableData: data|| [],
            //     page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            // });
            if( data && data.length) callback(I18n.t(400183/*已存在相同客户信息*/));
            else callback(null);
        }, ({message}) => callback(message));
    }

    searchCustomer = (callback) => {
        callback = callback || (error => error && errorTips(error));
        let {form} = this.props;
        let {page} = this.state;
        let cntryId = (typeof form.getFieldValue("cntryId") == 'string') ? (form.getFieldValue("cntryId") || '') : (form.getFieldValue("cntryId")['cntryId'] || '');
        let name = form.getFieldValue("name") || "";
        let id = form.getFieldValue('id') || '';

        if (cntryId.trim() !== '' && name.trim() !== '') {
            this.lastCntryId = cntryId;
            this.lastName = name;
            this.queryCustomerList(page.currentPage, page.size, {cntryId, name, id}, callback);
        } else {
            callback(I18n.t(400184/*请选择国家和填写客户名称*/));
        }
    };

    onSaveAndClose() {
        const {form, onSaveAndClose} = this.props;

        form.validateFields((errors, value) => {
            if ( !errors) {
                this.searchCustomer(error => {
                    if( !error){
                        let record = form.getFieldsValue();
                        addUpdateJson(record, (value) => {
                            onSaveAndClose && onSaveAndClose(value.data);
                        }, ({message}) => errorTips(message));
                    } else {
                        errorTips(error);
                    }
                });
            }
        });
    }

    onCancel() {
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel();
        }
        this.props.form.resetFields();
    }

    searchClick() {
        let className;
        className = "add-label-active";
        //点击之后更新数据，让数据去渲染Table
        this.setState({
            customerRechecking: className
        })
    }

    render() {
        const {form, data} = this.props;
        const {getFieldProps, getFieldError, getFieldErrorStyle} = this.props.form;
        const {page} = this.state;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        let {staffIds} = this.state;
        staffIds = staffIds || [];
        const inputStar = (<span className={''}>*</span>);
        let idCtnl = [];
        let initData = {};


        initData.cstmTypes = initData.cstmTypes || [];
        if (data && ('id' in data)) {
            idCtnl.push(<input type='hidden' key='id' {...getFieldProps('id', {
                initialValue: data.id
            })} />);
            idCtnl.push(<input type='hidden' key='optlock' {...getFieldProps('optlock', {
                initialValue: data.optlock
            })} />);
        }
        let staff = WebData.user.data.staff;
        let dom = (<div className="common-add" style={{height: 300}}>
            {idCtnl}
            <div className="row">
                <div className={'col-xs-6'}>
                    <label className={'add-label'}>{inputStar}{I18n.t(100354/*客户代码*/)}</label>
                    <input disabled type="text" className="text-input" placeholder={I18n.t(100354/*客户代码*/)}
                           {...getFieldProps('code', {
                               validateFirst: false,
                               initialValue: data ? data.code : ''
                           })}
                    />
                </div>
                <div className={'col-xs-6'}>
                    <label className={'add-label'}>{inputStar}{I18n.t(100087/*国家*/)}</label>
                    <ConstVirtualSelect
                        form={this.props.form}
                        fieldName="cntryId"
                        apiParams="com.fooding.fc.ds.entity.Country"
                        apiType={apiPost}
                        style={{width: 320}}
                        rules
                        initialValue={data.countryTo ? {cntryId:data.countryTo['id'],s_label:data.countryTo['localName']} : undefined}
                    />
                </div>
            </div>
            <div className="row">
                <div className={'col-xs-6'}>
                    <label className={'add-label'}>{inputStar}{I18n.t(100355/*客户名称*/)}</label>
                    <InputBoxCheck
                        placeholder={i18n.t(201264/*输入后,显示重复客户信息!*/)}
                        form={this.props.form}
                        fieldName='name'
                        apiUri='/customer/searchByNameEnName'
                        apiParams={{column:'name'}}
                        rules={true}
                        initialValue={data && ('name' in data) ? data.name : ''}
                        style={{width: 320}}
                    />
                </div>
                <div className={'col-xs-6'}>
                    <label className={'add-label'}>{inputStar}{I18n.t(100226/*英文名称*/)}</label>
                    <InputBoxCheck
							placeholder={I18n.t(400169/*输入后,显示重复英文名称*/)}
							tips={I18n.t(400170/*以下显示重复英文名称*/)}
							form={this.props.form}
							fieldName='enName'
							apiUri='/customer/searchByNameEnName'
							apiParams={{column:'enName'}}
							rules={true}
							isEnName={true}
							initialValue={data && ('enName' in data) ? data.enName : ''}
							style={{width: 320}}
						/>
                </div>
            </div>
            <div className="row">
                <div className={'col-xs-6'}>
                    <label className={'add-label'}>{i18n.t(100358/*税号*/)}</label>
                    <input type="text" name="taxIdenSN" className="text-input"
                           {...getFieldProps('taxIdenSN', {
                               initialValue: data && ('taxIdenSN' in data) ? data.taxIdenSN : '',
                               normalize: fieldsFormat.taxIdenSN
                           })}
                    />
                </div>
                <div className={'col-xs-6'}>
                    <label className={'add-label'}>{inputStar}{i18n.t(100359/*客户等级*/)}</label>
                    <ConstVirtualSelect
                        form={form}
                        pageSize={6}
                        style={{width: 320}}
                        apiType={apiPost}
                        fieldName="cstmLevelId"
                        apiParams="com.fooding.fc.ds.entity.CstmLevel"
                        rules={true}
                    />
                </div>
            </div>
            <div className="row">
                <div className={'col-xs-6'}>
                    <label className={'add-label'}>{inputStar}{i18n.t(100360/*客户类型*/)}</label>
                    <ConstVirtualSelect
                        form={form}
                        pageSize={6}
                        style={{width: 320}}
                        fieldName="cstmTypeId"
                        apiUri="/cstmType/getList"
                         rules={true}
                    />
                </div>
                <div className={'col-xs-6'}>
                    <label className={'add-label'}>{inputStar}{i18n.t(100362/*客户来源*/)}</label>
                    <ConstVirtualSelect
                        pageSize={6}
                        form={form}
                        style={{width: 320}}
                        apiType={apiPost}
                        fieldName="cstmCrsektId"
                        apiParams="com.fooding.fc.ds.entity.CstmCrsekt"
                        rules={true}
                        initialValue={{cstmCrsektId:data['cstmCrsektId'],s_label:data['cstmCrsektName']}}
                    />
                </div>
            </div>
            <div className="row">
                <div className={'col-xs-12'}>
                    <label className={'add-label'}>{inputStar}{I18n.t(100361/*分管人*/)}</label>
                    <ConstVirtualSelect
                        style={{width: 758}}
                        form={this.props.form}
                       
                        fieldName='staffIds'
                        apiHost={API_FOODING_ES}
                        apiUri='/user/getListForPermissionsInParty'
                        apiParams={{
                            partyId: WebData.user.data.staff.ccid,
                            typeAttributeIds: [601, 602, 603, 604]
                        }}
                        labelKey="staffLocalName"
                        valueKeys='refId'
                        multi={true}
                        initialValue={data && ('staff_bs' in data) ? (data.staff_bs || []).map(o => o.id): [staff.id]}
                        initValueOptions={data && ('staff_bs' in data) ? (data.staff_bs || []).map(o => ({staffLocalName: o.localName, refId: o.id})): [{staffLocalName: staff.localName, refId: staff.id}]}
                        rules={true}
                    />
                </div>
            </div>
        </div>);
        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
            {/*<FreeScrollBar style={{height: "344px"}} className="scroll_style" tracksize={20}>*/}
                {dom}

                {/*<label className={'add-label'} onClick={this.searchCustomer.bind(this, null)}>{i18n.t(200437*//*客户查重*//*)}</label>*/}
                {/*<div className="common-distinct-table">*/}
                    {/*<Table*/}
                        {/*columns={this.distinct_columns}*/}
                        {/*data={this.state.tableData}*/}
                        {/*checkboxConfig={{show: false}}*/}
                        {/*colorFilterConfig={{show: false}}*/}
                        {/*followConfig={{show: false}}*/}
                        {/*prefixCls={"rc-confirm-table"}*/}
                        {/*scroll={{x: false, y: 300}}*/}
                    {/*/>*/}
                {/*</div>*/}
                {/*<div className="common-distinct-page">*/}
                    {/*<Page totalPages={page.totalPages}*/}
                          {/*currentPage={page.currentPage}*/}
                          {/*totalRecords={page.totalRecords}*/}
                          {/*sizeList={[20, 50, 200]}*/}
                          {/*currentSize={page.size}*/}
                          {/*pageSizeChange={(value) => {*/}
                              {/*let {page} = this.state;*/}
                              {/*if (page.size == value) {*/}
                                  {/*return;*/}
                              {/*}*/}
                              {/*this.queryCustomerList(page.currentPage, value);*/}
                          {/*}} backClick={(v) => {*/}
                        {/*let {page} = this.state;*/}
                        {/*if (page.currentPage == v) {*/}
                            {/*return;*/}
                        {/*}*/}
                        {/*this.queryCustomerList(v);*/}
                    {/*}} nextClick={(v) => {*/}
                        {/*let {page} = this.state;*/}
                        {/*if (page.currentPage == v) {*/}
                            {/*return;*/}
                        {/*}*/}
                        {/*this.queryCustomerList(v);*/}
                    {/*}}*/}
                          {/*goChange={(v) => {*/}
                              {/*let {page} = this.state;*/}
                              {/*if (page.currentPage == v) {*/}
                                  {/*return;*/}
                              {/*}*/}
                              {/*this.queryCustomerList(v);*/}
                          {/*}}*/}
                    {/*/>*/}
                {/*</div>*/}
            {/*</FreeScrollBar>*/}
        </FormWrapper>);
    }
}

CommonForm = createForm()(CommonForm);

export default CommonForm;
