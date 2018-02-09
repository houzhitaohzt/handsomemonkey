import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";

//引入弹层
import Dialog from '../../../../components/Dialog/Dialog'
const {Table} = require("../../../../components/Table");

import Page from '../../../../components/Page';
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层

import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import ServiceTips, {errorTips, successTips} from '../../../../components/ServiceTips';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from '../../../../services/apiCall';

class User extends Component {
    constructor(props) {
        super(props)
        this.state = this.initState();
        this.handleResize = this.handleResize.bind(this);
        this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.addClick = this.addClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.filterData = {};
        this.searchForm = null;
        this.columns = [{
            title: i18n.t(201216/*用户账号*/),
            dataIndex: 'username',
            key: "username",
            width: '18%',
            render(data, row, index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        }, {
            title: i18n.t(201217/*用户类型*/),
            dataIndex: "userType",
            key: "userType",
            width: "15%",
            render(data, row, index){
                return data && data.name;
            }
        }, {
            title: i18n.t(100001/*名称*/),
            dataIndex: "staffName",
            key: "staffName",
            width: "12%",
            render(data, row, index){
                return data;
            }
         }, {
            title: i18n.t(100229/*邮箱*/),
            dataIndex: "defaultEmail",
            key: "defaultEmail",
            width: "12%",
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(100286/*生效日期*/),
            dataIndex: "startDate",
            key: "startDate",
            width: "15%",
            render(data, row, index){
                if (data) {
                    return new Date(data).Format("yyyy-MM-dd");
                }
                return null;
            }
        }, {
            title: i18n.t(100287/*失效日期*/),
            dataIndex: 'endDate',
            key: "endDate",
            width: "15%",
            render(data, row, index){
                if (data) {
                    return new Date(data).Format("yyyy-MM-dd");
                }
                return null;
            }
        }, {
            title: i18n.t(201215/*用户状态*/),
            dataIndex: 'userStatus',
            key: "userStatus",
            width: "8%",
            render(data, row, index){
                return data && data.name;
            }
        }];
    }

    initState() {
        return {
            scrollHeight: 0,
            record: [],
            initData: { },
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0}
        }
    }

    getPages(currentPage, size, filter, order) {
        filter = filter || (this.searchForm && this.searchForm.getFieldsValue()) || {};
        order = order || {column: 'id', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || 0;
        size = size || page.size;
        let params = Object.assign({}, {currentPage: currentPage, pageSize: size}, filter, order, this.filterData);
        apiGet(API_FOODING_ES, "/user/getPage", params,
            (response) => {
                let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
                this.setState({
                    record: data,
                    page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
                });
            }, (message) => {
                console.log(message);
            });
    }

    searchCustomer = ()=> {
        this.getPages(0);
    };

    onSaveAndClose() {
        this.setState({showDilaog: !this.state.showDilaog });
    }

    onEditSaveAndClose = () => {
        this.setState({showDilaog: !this.state.showDilaog });
        this.getPages();
    };

    onCancel() {
        this.setState({
            showDilaog: false
        })
    }

    addClick() {
        let content = require('./SystemsetUserAddandEdit').default;
        let element = React.createElement(content, {onSaveAndClose: this.onEditSaveAndClose, onCancel: this.onCancel, initData: this.state.initData, record: {}});
        this.setState({
            showDilaog: true,
            title: i18n.t(201229/*新增用户信息*/),
            dialogContent: element
        })
    }

    deleteClick() {
        let numArr = this.formTable.getSelectArr();
        let tempString = "";
        if (numArr.length == 0) {
            errorTips("请选择一条数据进行删除!");
            return false;
        } else if (numArr.length == 1) {
            tempString = "删除后将无法恢复，您确定删除吗？";
        } else {
            tempString = i18n.t(100395/*已选中*/) + numArr.length + "条数据, 删除后将无法恢复，您确定删除吗？";
        }
        Confirm(tempString, {
            done: () => {
                this._deleteUser(numArr.map(ar => ar.id));
            },
            close: () => {
                console.log('no, close')
            }
        });
    }

    _deleteUser (ids) {
        apiForm(API_FOODING_ES, '/user/delete', {id: ids}, response => {
            ServiceTips({text: "操作成功!"});
            this.getPages();
        }, error =>  ServiceTips({text: "删除失败!", type: 'error'}))
    }

    handleClick(e, {action, record}) {
        if (action == i18n.t(100439/*编辑*/)) {
            let content = require('./SystemsetUserAddandEdit').default;
            let element = React.createElement(content, {onSaveAndClose: this.onEditSaveAndClose, onCancel: this.onCancel, initData: this.state.initData, record: record});
            this.setState({
                showDilaog: true,
                title: i18n.t(201230/*编辑用户信息*/),
                dialogContent: element
            })

        } else if (action == i18n.t(100437/*删除*/)) {
            Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    this._deleteUser([record.id]);
                },
                close: () => {
                    console.log('no, close')
                }
            });
        }
    }

    onRowDoubleClick(record, index, checked) {

        apiGet(API_FOODING_ES, '/user/getOne', {id: record.id}, ({data}) => {
            let content = require('./SystemsetUserView').default;
            let element = React.createElement(content, {onSaveAndClose: this.onSaveAndClose, onCancel: this.onCancel, record: data.user, initData: this.state.initData});
            this.setState({
                showDilaog: true,
                title: i18n.t(201231/*查看用户信息*/),
                dialogContent: element
            })
        }, error => errorTips(error.message));
    }

    handleResize() {
        let sch = document.body.offsetHeight - 150 - 86;
        let scroll = sch - 80;
        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        this.getPages(0);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    render() {
        let {record, initData, page} = this.state;
        return (<div className={'system-user'}>
            <FilterHeader initData={initData} expandFilter={this.handleResize} searchCustomer={this.searchCustomer} formCall={form=>this.searchForm=form}/>
            <div className='content-margin'/>
            <div className={'system-user-content'}>
                <div className={'system-user-content-main'} style={{height: this.state.scrollHeight}}>
                    <div className={'keys-pages'}>
                        <FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}/>
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
                    <Table ref={table=>this.formTable=table}
                        columns={this.columns}
                        data={record}
                        checkboxConfig={{ show: true,  position: 'first' }}
                        colorFilterConfig={{show: false}}
                        followConfig={{show: false}}
                        scroll={{x: true, y: this.state.scroll}}
                        onRowDoubleClick={this.onRowDoubleClick}
                        contextMenuConfig={{
                            enable: true,
                            contextMenuId: 'SIMPLE_TABLE_MENU',
                            menuItems: [{
                                permissions:'user.edit',
                                onClick: this.handleClick,
                                content: <div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
                                data: {action: i18n.t(100439/*编辑*/)}
                            }, {
                                permissions:'user.del',
                                onClick: this.handleClick,
                                content: <div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
                                data: {action: i18n.t(100437/*删除*/)}
                            }]
                        }}
                    />
                    <Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
                        {this.state.dialogContent}
                    </Dialog>
                </div>
            </div>
        </div>)
    }
}
export default User;
