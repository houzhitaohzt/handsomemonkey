import i18n from './../../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Page from "../../../../../components/Page";//分页
import Dialog from '../../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../../components/Table");//Table表格
import Confirm from '../../../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import {
    apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, pageSize, sizeList,
    API_FOODING_ERP, API_FOODING_HR
} from '../../../../../services/apiCall';
import ServiceTips from "../../../../../components/ServiceTips";//提示框
import {I18n} from "../../../../../lib/i18n";

class ArrangeRuleslist extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
        this.addClick = this.addClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        var that = this;
        this.getPage = this.getPage.bind(this);
        this.columns = [{
            title: i18n.t(400240/*规则编号*/),
            dataIndex: 'code',
            key: "code",
            width: '14%',
            render(data, row, index) {
                return data;
            }
        }, {
            title: i18n.t(400241/*规则名称*/),
            dataIndex: "name",
            key: "name",
            width: "16%",
            render(data, row, index) {
                return data;
            }
        }, {
            title: i18n.t(400242/*规则类型*/),
            dataIndex: "typeName",
            key: "typeName",
            width: "10%",
            render(data, row, index) {
                return data;
            }
        }, {
            title: i18n.t(100002/*描述*/),
            dataIndex: "memo",
            key: "memo",
            render(data, row, index) {
                return data;
            }
        }, {
            title: i18n.t(700074/*状态*/),
            dataIndex: "irowSts",
            key: "irowSts",
            width: "12%",
            render(data, row, index) {
                return data && data.name ? data.name :"" ;
            }
        }];
        this.state = {
            scrollHeight: 0,
            rodalShow: false,
            dialogContent: <div></div>,
            checkedData: '',
            data: [],
            pageSize: pageSize,
            currentPage: 1
        }

    }

    //新增
    addClick() {
        this.popupDialog();
    }

    //编辑
    edit = id => {
      let that = this;
      apiGet(API_FOODING_HR, "/schedulerule/getOne", {id}, response => {
          that.popupDialog(response.data || {}, i18n.t(400244/*编辑排班规则*/))
      }, error => {})
    };

    /**
     * 出现弹窗
     * @param obj
     * */
    popupDialog = (data = {}, title = i18n.t(400243/*排班规则新增*/)) => {
        let content = React.createElement(require("./ArrangeRuleAddDialog").default, {
            onSaveAndClose: this.onSaveAndClose,
            onCancel: this.onCancel,
            getOne: data
        });
        this.setState({
            rodalShow: true,
            title: title,
            dialogContent: content
        })
    };

    onSaveAndClose = () => {
        this.setState({rodalShow: false }, ()=> this.getPage())
    };

    onCancel = () => {
        this.setState({rodalShow: false})
    };

    //列表删除
    deleteClick() {
        let numArr = this.refs.frexrat.getSelectArr();
        var that = this;
        if (numArr.length > 0) {
            for (var i = 0; i < numArr.length; i++) {
                if(numArr[i].state != 5)
                    return ServiceTips({text:i18n.t(400245/*请选择草稿状态删除*/), type:"error"});
            }
            let value = numArr.map( e => e.id);
            Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    apiForm(API_FOODING_HR, '/schedulerule/delete', {ids: value}, (response) => {
                        ServiceTips({text: response.message, type: 'success'});
                        that.getPage();
                    }, (errors) => {
                        ServiceTips({text: errors.message, type: 'error'});
                    });
                },
                close: () => {}
            });
        } else {
            ServiceTips({text: I18n.t(100434/*请选择一条数据！*/), type: 'error'});
        }
    }

    handleClick(e, data) {
        //右键处理
        if (data.type == 1) {
            this.deleteClick();
        } else if (data.type == 2) {
            this.edit(data.record.id);
        } else if (data.type == 3) {//激活
            apiForm(API_FOODING_HR, '/schedulerule/invalid', {ids: [data.record.id]}, (response) => {
                ServiceTips({text: response.message, type: 'success'});
                this.getPage();
            }, (error) => {

            })
        } else if (data.type == 4) {//失效
            Confirm(I18n.t(100435/*是否对该条数据失效？*/), {
                done: () => {
                    //表示是失效
                    apiForm(API_FOODING_HR, '/schedulerule/disInvalid', {ids: [data.record.id]}, (response) => {
                        ServiceTips({text: response.message, type: 'success'});
                        this.getPage();
                    }, (error) => {
                        ServiceTips({text: error.message, type: 'error'})
                    })
                },
                close: () => {}
            });
        }
    }

    onRowDoubleClick(record, index, checked) {
        let that = this;
        apiGet(API_FOODING_HR, "/schedulerule/getOne", {id:record.id}, response => {
            let content = React.createElement(require("./ArrangeRuleViewDialog").default, {
                onCancel: this.onCancel,
                getOne: response.data || {}
            });
            that.setState({
                rodalShow: true,
                title: i18n.t(400246/*查看排班规则*/),
                dialogContent: content
            })
        }, error => {})
    }

    //请求列表  list
    getPage(currentPage, objValue) {
        let that = this;
        var sID = sID || '';
        let currentP = !isNaN(currentPage) ? currentPage : this.state.currentPage;
        let object = Object.assign({}, {
            pageSize: this.state.pageSize,
            currentPage: currentP
        }, that.normalRef.getForm());
        apiGet(API_FOODING_HR, '/schedulerule/getPage', object,
            (response) => {
                that.setState({
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                    totalRecords: response.data.totalRecords,
                    currentPage: response.data.currentPage
                });
            }, (errors) => {
            });
    }

    handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll, scrollHeight: scrollHeight});
    }

    componentDidMount() {
        this.getPage();
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    render() {
        let {page, currentPage} = this.state;
        return (<div>
            <FilterHeader normalRef={no => this.normalRef = no} getPage={this.getPage} info={this.state.info}
                          expandFilter={this.handleResize}/>
            <div className={'client-body'} style={{height: this.state.scrollHeight}}>
                <div className={'client-body-single'}>
                    <div className="action-buttons">
                        <div className={'key-page'}>
                            <FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}/>
                            <Page
                                currentPage={this.state.currentPage}
                                totalPages={this.state.totalPages}
                                totalRecords={this.state.totalRecords}
                                sizeList={sizeList}
                                currentSize={this.state.pageSize}
                                pageSizeChange={(num) => {
                                    this.setState({pageSize: Number.parseInt(num)}, () => this.getPage(currentPage, num));
                                }}
                                backClick={(num) => {
                                    this.setState({currentPage: Number.parseInt(num)}, () => this.getPage(num));
                                }}
                                nextClick={(num) => {
                                    this.setState({currentPage: Number.parseInt(num)}, () => this.getPage(num));
                                }}
                                goChange={(num) => {
                                    this.setState({currentPage: Number.parseInt(num)}, () => this.getPage(num));
                                }}
                            />
                        </div>
                        <Table
                            ref="frexrat"
                            columns={this.columns}
                            data={this.state.data || []}
                            checkboxConfig={{
                                show: true,
                                checkedAll: this.state.choised,
                                checkedRows: this.state.checkedRows,
                                position: 'first'
                            }}
                            colorFilterConfig={{show: false, dataIndex: 'colorType'}}
                            followConfig={{show: false}}
                            scroll={{x: true, y: this.state.scroll}}
                            onHeaderCellClick={this.onHeaderCellClick}
                            onRowClick={this.onRowClick}
                            onRowDoubleClick={this.onRowDoubleClick}
                            singleSelect={true}
                            contextMenuConfig={{
                                enable: true,
                                contextMenuId: 'SIMPLE_TABLE_MENU',
                                menuItems: [{
                                    permissions:'workcalender.del',
                                    onClick: this.handleClick,
                                    condition: [{key: 'irowSts.id', value: 5, exp: '==='}],
                                    content: <div><i className={'foddingicon fooding-delete-icon4'}></i>{I18n.t(100437/*删除*/)}</div>,
                                    data: {type: 1, title: I18n.t(100437/*删除*/)}
                                }, {
                                    permissions:'workcalender.edit',
                                    onClick: this.handleClick,
                                    content: <div><i
                                        className={'foddingicon fooding-alter_icon2'}></i>{I18n.t(100439/*编辑*/)}</div>,
                                    data: {type: 2, title: I18n.t(100439/*编辑*/)}
                                }, {
                                    permissions:'workcalender.activation',
                                    onClick: this.handleClick,
                                    condition: [{key: 'irowSts.id', value: [5, 20], exp: '==='}],
                                    content: <div><i
                                        className={'foddingicon fooding-jh-icon2'}/><span>{i18n.t(100442/*激活*/)}</span>
                                    </div>,
                                    data: {action: i18n.t(100442/*激活*/), type: 3}
                                }, {
                                    permissions:'workcalender.Invalid',
                                    onClick: this.handleClick,
                                    condition: [{key: 'irowSts.id', value: 10, exp: '==='}],
                                    content: <div><i
                                        className={'foddingicon fooding-sx-icon2'}/><span>{i18n.t(100441/*失效*/)}</span>
                                    </div>,
                                    data: {action: i18n.t(100441/*失效*/), type: 4}
                                }]
                            }}

                        />
                        <Dialog width={926} visible={this.state.rodalShow} title={this.state.title}>
                            {this.state.dialogContent}
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default NavConnect(ArrangeRuleslist);
