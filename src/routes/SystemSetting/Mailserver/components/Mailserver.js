import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog'
const {Table} = require("../../../../components/Table");

import Page from '../../../../components/Page';
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层

import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_MAIL} from '../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";

class Mailserver extends Component {
    constructor(props) {
        super(props)
        this.state = this.initState();
        this.handleResize = this.handleResize.bind(this);
        this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.addClick = this.addClick.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.filterData = {};
    }

    initState() {
        let columns = [{
            title: i18n.t(200771/*企业名称*/),
            dataIndex: 'ccName',
            key: "ccName",
            width: '15%',
            render(data, row, index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        }, {
            title: i18n.t(201184/*邮件服务名*/),
            dataIndex: "name",
            key: "name",
            width: "15%",
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(201185/*收件服务器类型*/),
            dataIndex: "receiveType",
            key: "receiveType",
            width: "12%",
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(201186/*收件服务器地址*/),
            dataIndex: "receiveServer",
            key: "receiveServer",
            width: "15%",
            render(data, row, index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        }, {
            title: i18n.t(201187/*端口*/),
            dataIndex: 'receivePort',
            key: "receivePort",
            width: "5%",
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(201188/*发件服务器地址*/),
            dataIndex: 'sendServer',
            key: "sendServer",
            width: "15%",
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(201187/*端口*/),
            dataIndex: 'sendPort',
            key: "sendPort",
            width: "5%",
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(201189/*是否启用*/),
            dataIndex: 'status',
            key: "status",
            width: "5%",
            render(data, row, index){
                return data ? i18n.t(100141/*是*/): i18n.t(100142/*否*/);
            }
        }];
        return {
            scrollHeight: 0,
            columns: columns,
            record: []
        }
    }

    getPages = (currentPage, size, filter, order) => {
        filter = filter || (this.searchForm && this.searchForm.getFieldsValue()) || {};
        order = order || {column: 'billId', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || 0;
        let params = Object.assign({}, filter, order, this.filterData);
        apiGet(API_FOODING_MAIL, '/serverconfig/getList', params, (response) => {
            this.setState({
                record: response.data || [],
            });
        }, error => {
            errorTips(error.message)
        });
    };

    onSaveAndClose() {
        this.setState({
            showDilaog: !this.state.showDilaog
        });
        this.getPages();
    }

    onCancel() {
        this.setState({
            showDilaog: false
        })
    }

    addClick() {
        let content = require('./SystemsetMailserverAddandEdit').default;
        let element = React.createElement(content, {onSaveAndClose: this.onSaveAndClose, onCancel: this.onCancel});
        this.setState({
            showDilaog: true,
            title: i18n.t(201173/*添加邮件服务器*/),
            dialogContent: element
        })
    }

    handleClick(e, data) {
        if (data.action == i18n.t(200376/*修改*/)) {
            let content = require('./SystemsetMailserverAddandEdit').default;
            let element = React.createElement(content, {onSaveAndClose: this.onSaveAndClose, onCancel: this.onCancel, otherData: data.record})  ;
            this.setState({
                showDilaog: true,
                title: i18n.t(201190/*修改邮件服务器*/),
                dialogContent: element
            })
        } else if (data.action == i18n.t(100437/*删除*/)) {
            Confirm('是否需要删除该邮件服务器的连接？', {
                done: () => {
                    apiForm(API_FOODING_MAIL, '/serverconfig/delete', {id: data.record.id},
                        response=>{
                            successTips('删除成功!');
                            this.getPages();
                        }, error => {
                            errorTips(error.message);
                        })
                }
            });
        } else if (data.action == i18n.t(100453/*启用*/)) {
            Confirm('是否需要启用该邮件服务器的连接？', {
                done: () => {
                    this.onSwitchStatus(data.record.id);
                }
            });
        } else if (data.action == i18n.t(201191/*暂停*/)) {
            Confirm('是否需要暂停该邮件服务器的连接？', {
                done: () => {
                    this.onSwitchStatus(data.record.id);
                }
            });
        }
    }

    onSwitchStatus = id =>{
        apiForm(API_FOODING_MAIL, '/serverconfig/switchStatus', {id},
            response => {
                successTips('修改成功!');
                this.getPages();
            }, error => {
                errorTips(error.message);
            })
    };

    searchCustomer = () => {
        this.getPages();
    };

    onRowDoubleClick(record, index, checked) {
        let content = require('./SystemsetMailserverView').default;
        let element = React.createElement(content, {onSaveAndClose: this.onSaveAndClose, onCancel: this.onCancel, otherData: record}) ;
        this.setState({
            showDilaog: true,
            title: i18n.t(201177/*查看邮件服务器*/),
            dialogContent: element
        })
    }

    handleResize() {
        let sch = document.body.offsetHeight - 158- 86;
        let scroll = sch - 80;
        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        this.getPages();
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    render() {
        let {record} = this.state;
        return (<div className={'system-mailserver'}>
            <FilterHeader searchCustomer={ this.searchCustomer} formCall={form => this.searchForm = form}/>
            <div className='content-margin'/>
            <div className={'system-mailserver-content'}>
                <div className={'system-mailserver-content-main'} style={{height: this.state.scrollHeight}}>
                    <div className={'keys-pages'}>
                        <FunctionKeys addClick={this.addClick}/>
                    </div>
                    <Table
                        columns={this.state.columns}
                        data={record}
                        scroll={{x: true, y: this.state.scroll}}
                        onRowDoubleClick={this.onRowDoubleClick}
                        checkboxConfig={{show: false}}
                        colorFilterConfig={{show: false}}
                        followConfig={{show: false}}
                        contextMenuConfig={{
                            enable: true,
                            contextMenuId: 'SIMPLE_TABLE_MENU',
                            menuItems: [{
                                permissions:'mailserver.edit',
                                onClick: this.handleClick,
                                content: <div><i className={'foddingicon fooding-alter_icon2'}/>{i18n.t(200376/*修改*/)}</div>,
                                data: {action: i18n.t(200376/*修改*/)}
                            }, {
                                permissions:'mailserver.activation',                                
                                condition: {key: 'status', value: false, exp: '==='},
                                onClick: this.handleClick,
                                content: <div><i className={'foddingicon fooding-start'}/>{i18n.t(100453/*启用*/)}</div>,
                                data: {action: i18n.t(100453/*启用*/)}
                            }, {
                                permissions:'mailserver.Invalid',
                                condition: {key: 'status', value: true, exp: '==='},
                                onClick: this.handleClick,
                                content: <div><i className={'foddingicon fooding-cancal-p'}/>{i18n.t(201191/*暂停*/)}</div>,
                                data: {action: i18n.t(201191/*暂停*/)}
                            }, {
                                permissions:'mailserver.del',
                                onClick: this.handleClick,
                                content: <div><i className={'foddingicon fooding-delete-icon3'}/>{i18n.t(100437/*删除*/)}</div>,
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
export default Mailserver;
