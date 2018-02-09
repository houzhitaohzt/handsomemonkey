import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Tree, {TreeNode} from '../../../../components/Tree';
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import Dialog from '../../../../components/Dialog/Dialog';
import Page from '../../../../components/Page';
const {Table} = require("../../../../components/Table");
import Loading from '../../../../components/Loading';
import ServiceTips, {errorTips, successTips} from '../../../../components/ServiceTips';
import FunctionKeys from "./FuncKeys";
import FilterHeader from "./FilterHeader";
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from '../../../../services/apiCall';

class MenuSetting extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.onSelect = this.onSelect.bind(this);
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
            record: [],
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
        filter = filter || (this.searchForm && this.searchForm.getFieldsValue()) || {};
        order = order || {column: 'id', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || 0;
        size = size || page.size;
        let params = Object.assign({}, {currentPage: currentPage, pageSize: size}, filter, order, this.filterData);
        apiGet(API_FOODING_ES, "/userParty/getUserPageByPartyId", params,
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

    initPages (){
        apiGet(API_FOODING_ES, "/user/getInit", {},
            ({data}) => {
                this.setState({initData: data});
            }, error => console.log(error));
    }

    deleteClick = () => {
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
    };

    _deleteUser (ids){
        apiForm(API_FOODING_ES, '/userParty/deleteUserPartys', {
            id: ids,
            partyId: this.filterData.partyId
        }, response => {
            successTips("删除成功!");
            this.getPages(0);
        }, error => {
            errorTips(error.message);
        })
    }

    addClick = () =>{
        let content = require('./UserSecAddDialog').default;
        let element = React.createElement(content, {onSaveAndClose: this.onSaveAndClose, onCancel: this.onCancel, initData: this.state.initData, partyId: this.state.menuId});
        this.setState({
            showDilaog: true,
            title: i18n.t(201232/*关联用户*/),
            dialogContent: element
        })
    };

    onSaveAndClose(value, data) {
        this.getPages(0);
        this.setState({
            showDilaog: !this.state.showDilaog
        })
    }

    onCancel() {
        this.setState({
            showDilaog: false
        })
    }

    onSelect(key, obj) {
        //因为可以在选中时有值，而没选中时没有，所以不能用来判断length长度
        if(key.length){
            this.setState({visible: true, menuId: key[0]});
            this.filterData['partyId'] = key[0];
            this.getPages(0);
        }
    }

    handleResize(height) {
        let sch = document.body.offsetHeight - 100 - 86;
        let scroll = sch - 20;
        this.setState({scrollHeight: sch, scroll: scroll});
    }

    getTree() {
        let that = this;
        apiGet(API_FOODING_ES, '/party/getPartySyncTreeByLoginUser', null, (response) => {
            let array = [];
            that.setState({
                gData: response.data || []
            });
        }, (message) => {
            console.log(message);
        });
    }

    componentDidMount() {
        this.handleResize();
        // this.initPages();
        this.getTree();
        window.addEventListener('resize', this.handleResize);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    searchCustomer = ()=>{
        this.getPages(0);
    };

    render() {
        const {record, page} = this.state;

        return (<div className={'menuset-content'}>
            <div className={'menuset-content-all'} style={{height: this.state.scrollHeight}}>
                <div className={'menuset-content-all-tree scroll'} style={{height: this.state.scroll}}>
                    <Tree
                        onSelect={this.onSelect}
                        defaultSelectedKeys={['0']}
                        showIcon={false}
                        selectable={true}
                        checkable={false}
                        defaultExpandedKeys={['menu']}
                        gData={this.state.gData}
                    />
                </div>
                <div className={this.state.visible ? 'menuset-content-all-show scroll' : 'none'} style={{overflow: 'hidden'}}>
                    <FilterHeader expandFilter={this.handleResize} searchCustomer={this.searchCustomer} formCall={form=>this.searchForm=form}/>
                    <div className={'system-user-content'}>
                        <div className={'system-user-content-main'} style={{height: this.state.scrollHeight - 100}}>
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
                                   scroll={{x: true, y: this.state.scroll - 150}}
                                   contextMenuConfig={{ enable: false, }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
                {this.state.dialogContent}
            </Dialog>
        </div>)
    }
}
export default MenuSetting;
