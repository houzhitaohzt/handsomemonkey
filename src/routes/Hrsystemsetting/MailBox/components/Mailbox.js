import i18n from './../../../../lib/i18n';
import React, {Component} from "react";
//引入弹层
import Dialog from "../../../../components/Dialog/Dialog";
import Page from "../../../../components/Page";
import FilterHeader from "./FilterHeader";
import {API_FOODING_DS,API_FOODING_MAIL_SERVER,API_FOODING_MAIL, apiForm, apiGet} from "../../../../services/apiCall";
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
const {Table} = require("../../../../components/Table");

class MailBox extends Component {
    constructor(props) {
        super(props);
        this.state = this.initState();
        this.handleResize = this.handleResize.bind(this);
        this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.addClick = this.addClick.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.columns = [{
            title: i18n.t(200771/*企业名称*/),
            dataIndex: 'staff.company.localName',
            key: "staff.company.localName",
            width: '15%',
            render(data, row, index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        }, {
            title: i18n.t(201170/*员工姓名*/),
            dataIndex: "staff.localName",
            key: "staff.localName",
            width: "10%",
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(100227/*职务*/),
            dataIndex: "staff.positn.localName",
            key: "staff.positn.localName",
            width: "10%",
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(201171/*邮箱地址*/),
            dataIndex: "localName",
            key: "localName",
            width: "25%",
            render(data, row, index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        }, {
            title: i18n.t(201166/*邮件服务器*/),
            dataIndex: 'serverConfig.name',
            key: "serverConfig.name",
            width: "15%",
            render(data, row, index){
                return data;
            }
        }];
        this.filterData = {};
    }

    initState() {
        return {
            scrollHeight: 0,
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
            record: []
        }
    }

    getPages = (currentPage, size, filter, order) => {
        filter = filter || (this.searchForm && this.searchForm.getFieldsValue()) || {};
        order = order || {column: 'billId', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || 0;
        size = size || page.size;
        let params = Object.assign({}, {currentPage: currentPage, pageSize: size}, filter, order, this.filterData);
        apiGet(API_FOODING_DS, '/staff/mail/getPage', params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response;
            this.setState({
                record: data || [],
                page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            });
            this.getMailServer((data || []).map(da => da.localName));
        }, error => {
            errorTips(error.message)
        });
    };

    getMailServer = mails =>{
        if( !mails.length) return;
        apiGet(API_FOODING_MAIL, '/emailconfig/getList', {mails: mails},
            response => {
                let prefer = response.data || [], record = this.state.record;
                let newRecord = [];
                record.forEach( da => {
                    let nPre = prefer.find(pda => pda.email === da.localName) || {};
                    newRecord.push(Object.assign({}, da, {needReview: nPre.needReview, serverConfig: nPre.serverConfig}));
                });
                this.setState({record: newRecord});
            }, error => {
                errorTips(error.message);
            });
    };

    searchCustomer = () => {
        this.getPages();
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
        /*let content=require('./SystemsetMailboxAddandEdit').default;
         let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel})
         this.setState({
         showDilaog : true,
         title: i18n.t(201173*//*添加邮件服务器*//*),
         dialogContent: element
         })
         新增开看不到页面，因此先放在那里，等有页面再来改
         */
    }

    handleClick(e, data) {
        if (data.action == i18n.t(201174/*配置*/)) {
            let content = require('./MailboxConfiguration').default;
            let element = React.createElement(content, {onSaveAndClose: this.onSaveAndClose, onCancel: this.onCancel, otherData: data.record});
            this.setState({
                showDilaog: true,
                title: i18n.t(201174/*配置*/),
                dialogContent: element
            })
        } else if (data.action == i18n.t(201175/*测试链接*/)) {
            /*最后会弹出来测试链接是否成功*/
            apiForm(API_FOODING_MAIL_SERVER, '/connect', {
                    email: data.record.localName
                }, (response) => {
                    response.data !== false ? successTips(response.message): errorTips(response.message);
                }, error => {
                    errorTips(error.message);
                })
        } else if (data.action == i18n.t(201176/*密码重置*/)) {
            let content = require('./SystemsetMailboxSecret').default;
            let element = React.createElement(content, {onSaveAndClose: this.onSaveAndClose, onCancel: this.onCancel, otherData: data.record});
            this.setState({
                showDilaog: true,
                title: i18n.t(201176/*密码重置*/),
                dialogContent: element
            })
        }
    }

    onRowDoubleClick(record, index, checked) {
        /*let content=require('./SystemsetMailboxView').default;
         let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel})
         this.setState({
         showDilaog : true,
         title: i18n.t(201177*//*查看邮件服务器*//*),
         dialogContent: element
         })
         同样没有页面，等有页面再来做
         */
    }

    handleResize() {
        let sch = document.body.offsetHeight - 158 - 86;
        let scroll = sch -80 ;
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
        let {record, page} = this.state;
        return (<div className={'system-mailserver'}>
            <FilterHeader searchCustomer={ this.searchCustomer} formCall={form => this.searchForm = form}/>
            <div className='content-margin'/>
            <div className={'system-mailserver-content'}>
                <div className={'system-mailserver-content-main'} style={{height: this.state.scrollHeight}}>
                    <div className={'keys-pages'}>
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
                    <Table
                        columns={this.columns}
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
                                permissions:'mailbox.set',
                                onClick: this.handleClick,
                                content: <div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(201174/*配置*/)}</div>,
                                data: {action: i18n.t(201174/*配置*/)}
                            }, {
                                permissions:'mailbox.test',
                                onClick: this.handleClick,
                                content: <div><i className={'foddingicon fooding-fj-icon2'}></i>{i18n.t(201175/*测试链接*/)}</div>,
                                data: {action: i18n.t(201175/*测试链接*/)}
                            }, {
                                permissions:'mailbox.rest',
                                onClick: this.handleClick,
                                content: <div><i className={'foddingicon fooding-fill'}></i>{i18n.t(201176/*密码重置*/)}</div>,
                                data: {action: i18n.t(201176/*密码重置*/)}
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
export default MailBox;
