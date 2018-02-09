import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";

import Select, {Option} from './../../../../components/Select';
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import Page from '../../../../components/Page';
const {Table} = require("../../../../components/Table");
import ServiceTips, {errorTips, successTips} from '../../../../components/ServiceTips';
import {Translate, Localize, I18n} from '../../../../lib/i18n';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from '../../../../services/apiCall';

class MenuSetting extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.filterData = {};
        this.state = {
            gData: [],
            scroll: 0,
            scrollHeight: 0,
            showDilaog: false,//控制弹出层是否出来
            content: '',
            dialogContent: '<div></div>',
            visible: false,
            menuId: null,
            initData: {},
            showLoading: true,
            showTip: false,
            nodeParent: '',
            tableData: [],
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0}

        };

        this.columns = [{
            title: i18n.t(201216/*用户账号*/),
            dataIndex: 'username',
            key: "username",
            width: '30%',
            render(data, row, index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        }, {
            title: i18n.t(201217/*用户类型*/),
            dataIndex: "userType",
            key: "userType",
            width: "20%",
            render(data, row, index){
                return data && data.name;
            }
        }, {
            title: i18n.t(201218/*用户姓名*/),
            dataIndex: "staffName",
            key: "staffName",
            width: "50%",
            render(data, row, index){
                return data;
            }
        }];

    }

    getPages(currentPage, size, filter, order) {
        filter = filter || {};
        order = order || {column: 'id', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || page.currentPage;
        size = size || page.size;
        let params = Object.assign({partyId: this.props.partyId}, {currentPage: currentPage, pageSize: size}, filter, order);

        apiGet(API_FOODING_ES, "/userParty/getPageForUnselectedUser", params,
            (response) => {
                let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
                this.setState({
                    tableData: data,
                    page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
                });
            }, (message) => {
                errorTips(message.message);
            });
    }

    onSaveAndClose() {
        const {form, onSaveAndClose, record} = this.props;
        let userAry = this.mainTable.getSelectArr();
        if(userAry.length){
            apiForm(API_FOODING_ES, '/userParty/save', {
                partyId: this.props.partyId,
                id: userAry.map(o => o.id)
            }, response => {
                successTips("关联成功!");
                onSaveAndClose && onSaveAndClose();
                this.getPages(0);
            }, ({message}) => errorTips(message));            
            // Confirm("确认关联所选用户?", {
            //     done: () => {

            //     }
            // });
        } else {
            errorTips("请先选择关联用户!");
        }
    }

    onCancel() {
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel();
        }
    }

    handleResize(height) {
        let sch = document.body.offsetHeight - 100;
        let scroll = sch - 20;
        this.setState({scrollHeight: sch + 'px', scroll: scroll + 'px'});
    }

    componentWillReceiveProps(props) {
        if(props.partyId !== this.props.partyId) {
            this.getPages(0);
        }
    }

    componentDidMount() {
        this.handleResize();
        this.getPages(0);
        window.addEventListener('resize', this.handleResize);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    searchCustomer = ()=>{
        let {form} = this.props;
        let {page} = this.state;
        let param = form.getFieldsValue();
        this.getPages(page.currentPage, page.size, param);
    };

    render() {
        const {form, data} = this.props;
        const { tableData, page} = this.state;
        const {userStatuses = [], userTypes = []} = this.props.initData;
        const {getFieldProps, getFieldError} = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        return (<FormWrapper showFooter={true} onCancel={this.onCancel} onSaveAndClose={this.onSaveAndClose}>
            <div className="common-distinct">
                <div className="row" >
                    <div className="col-xs-4">
                        <label className={'col-xs-3 col-md-3'} style={{textAlign:'center'}}>{i18n.t(201216/*用户账号*/)}</label>
                        <input type="text" className={'col-xs-9 col-md-9 text-input-nowidth'} placeholder=""
                               {...getFieldProps('username', {initialValue: ''})} />
                    </div>
                    <div className="col-xs-4">
                        <label className={'col-xs-3 col-md-3'} style={{textAlign:'center'}}>{i18n.t(201233/*用户名称*/)}</label>
                        <input type="text" className={'col-xs-9 col-md-9 text-input-nowidth'} placeholder=""
                               {...getFieldProps('staffName', {initialValue: ''})} />
                    </div>
                    <div className="filter-header-key">
                        <span className="search" onClick={this.searchCustomer} style={{textAlign:'center'}} title={I18n.t(100477/*请搜索*/)}><i className="foddingicon fooding-search_icon"/></span>
                    </div>
                </div>
                <div className="common-distinct-table">
                    <Table ref={table=>this.mainTable=table}
                        columns={this.columns}
                        data={tableData}
                        checkboxConfig={{ show: true,  position: 'first' }}
                        colorFilterConfig={{show: false}}
                        followConfig={{show: false}}
                        prefixCls={"rc-confirm-table"}
                        scroll={{x: false, y: 200}}
                    />
                </div>
                <div className="common-distinct-page">
                    <Page totalPages={page.totalPages}
                          currentPage={page.currentPage}
                          totalRecords={page.totalRecords}
                          sizeList={[20, 50, 200]}
                          currentSize={page.size}
                          pageSizeChange={(value) => {
                              let {page} = this.state;
                              if (page.size == value) {
                                  return;
                              }
                              this.getPages(page.currentPage, value);
                          }} backClick={(v) => {
                        let {page} = this.state;
                        if (page.currentPage == v) {
                            return;
                        }
                        this.getPages(v);
                    }} nextClick={(v) => {
                        let {page} = this.state;
                        if (page.currentPage == v) {
                            return;
                        }
                        this.getPages(v);
                    }}
                          goChange={(v) => {
                              let {page} = this.state;
                              if (page.currentPage == v) {
                                  return;
                              }
                              this.getPages(v);
                          }}
                    />
                </div>
            </div>
        </FormWrapper>)
    }
}
MenuSetting = createForm()(MenuSetting);

export default MenuSetting;
