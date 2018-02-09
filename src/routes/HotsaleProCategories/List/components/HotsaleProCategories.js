import React, {Component, PropTypes} from 'react';
//引入提示
import Tooltip from 'antd/lib/tooltip';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层

import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";

import SpecTextCard from "../../../Product/List/SpecText/SpecText";
import MailCard from "../../../Client/List/MailCard/MailCard";

// ajax
import {
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_ERP,
    API_FOODING_DS,
    language,
    pageSize,
    sizeList
} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import {I18n} from '../../../../lib/i18n';

class HotsaleProCategories extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.state = this.initState();

        this.addClick = this.addClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);

        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.getPage = this.getPage.bind(this);	// 刷新页面
        this.columnSort = {column: 'code', order: 'asc'};
        let that = this;
        this.columns = [{
            title: I18n.t(100000/*代码*/),
            dataIndex: 'code',
            key: "code",
            width: '40%',
            render(data, row, index) {
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        }, {
            title: I18n.t(100001/*名称*/),
            dataIndex: "localName",
            key: "localName",
            width: "55%",
            sort: 'name',
            render(data, row, index) {
                return data;
            }
        }];
    }

    initState() {
        return {
            scrollHeight: 0,
            filter: null,
            selectArr: [],
            checkedRows: [],
            choised: false,
            currentPage: 1, // 当前页
            pageSize: pageSize, // 每页 多少条
            data: [],
            filter: {}
        }
    }

    addClick() {
        let content = require('./ProductPrice').default;
        let element = React.createElement(content, {onSaveAndClose: this.onSaveAndClose, onCancel: this.onCancel});
        this.setState({
            showDilaog: true,
            title: I18n.t(100392/*新增*/),
            dialogContent: element

        })
    }

    deleteClick() {
        let numArr = this.refs.hotsaleprocategories.getSelectArr();
        let tempString = "", id = [];
        if (numArr.length == 0) {
            ServiceTips({text: I18n.t(100394/*请选择数据！*/), type: 'error'});
            return false;
        } else if (numArr.length == 1) {
            tempString = I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
        } else {
            tempString = I18n.t(100395/*已选中*/) + numArr.length + I18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
        }
        for (let j = 0, len = numArr.length; j < len; j++) {
            id.push(numArr[j].id)
        }
        Confirm(tempString, {
            done: () => {
                this.deletedFunc(id);
            },
            close: () => {
                console.log('no, close')
            }
        });
    }

    onSaveAndClose() {
        this.setState({
            showDilaog: !this.state.showDilaog
        },this.getPage())
    }

    onCancel() {
        this.setState({
            showDilaog: false
        })
    }

    handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let sch = document.body.offsetHeight - this.filterHeight - 92;
        let scroll = sch - 90;
        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }

    //请求列表  list
    getPage(currentPage, order) {
        this.columnSort = order = order || this.columnSort;
        let that = this;
        var sID = sID || '';
        let currentP = currentPage || 1;
        let object = Object.assign({}, {
            pageSize: this.state.pageSize,
            currentPage: currentP
        }, that.normalRef.getForm(), order);
        apiGet(API_FOODING_DS, '/hotProductClassify/getPage', object,
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

    // 调用删除 ajax  传进来的id必须为一个数组
    deletedFunc(ID) {
        let that = this;
        apiForm(API_FOODING_DS, '/hotProductClassify/delete', {id: ID},
            (response) => {
                ServiceTips({text: response.message, type: 'success'});
                that.getPage();
            }, (errors) => {
                ServiceTips({text: errors.message, type: 'error'});
            });
    }

    componentDidMount() {
        this.handleResize()
        window.addEventListener('resize', this.handleResize);
        this.getPage();
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    render() {
        let that = this;
        let {page, currentPage} = this.state;
        return (<div>
            <FilterHeader getPage={this.getPage} expandFilter={this.handleResize}
                          normalRef={no => this.normalRef = no}/>
            <div className={'client-body'} style={{height: this.state.scrollHeight}}>
                <div className={'client-body-single'}>
                    <div className='action-buttons'>
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
                            ref="hotsaleprocategories"
                            columns={this.columns}
                            data={this.state.data}
                            checkboxConfig={{
                                show: true,
                                checkedAll: this.state.choised,
                                checkedRows: this.state.checkedRows,
                                position: 'first'
                            }}
                            colorFilterConfig={{show: false}}
                            followConfig={{show: false}}
                            scroll={{x: true, y: this.state.scroll}}
                            onRowDoubleClick={this.onRowDoubleClick}
                            onHeaderSortClick={this.getPage.bind(this, null)}
                        />
                        <Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
                            {this.state.dialogContent}
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default NavConnect(HotsaleProCategories);
