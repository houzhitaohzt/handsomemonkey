import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";

//引入提示
import Tooltip from 'antd/lib/tooltip';

// ajax
import {
    webInit,
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_DS,
    API_FOODING_TPM,
    language,
    pageSize,
    sizeList
} from '../../../../services/apiCall'; // ajax
import ServiceTips from '../../../../components/ServiceTips'; // 提示框


class FormworkSettingList extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.state = this.initState();
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.addClick = this.addClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.columnSort = {column: 'code', order: 'asc'};
        let that = this;
        this.columns = [{
                title: i18n.t(400203/*模板名称*/),
                dataIndex: 'templateName',
                key: "templateName",
                width: '14%',
                render(data, row, index) {
                    return (<div className="text-ellipsis">{data}</div>)
                }
            }, {
                title: i18n.t(400204/*模板标识*/),
                dataIndex: "identity",
                key: "identity",
                width: "15%",
                render(data, row, index) {
                    return data || "";
                }
            }, {
                title: i18n.t(400205/*模板类型*/),
                dataIndex: "templaterType",
                key: "templaterType",
                width: "10%",
                render(data, row, index) {
                    return data && data.name?data.name:"";
                }
            }, {
                title: i18n.t(400206/*语种*/),
                dataIndex: "languageName",
                key: "languageName",
                width: "10%",
                render(data, row, index) {
                    return data && data.name?data.name:"";
                }
            }, {
                title: i18n.t(100143/*创建人*/),
                dataIndex: 'createUserName',
                key: "createUserName",
                width: "12%",
                render(data, row, index) {
                    return data;
                }
            },
            {
                title: i18n.t(100145/*创建时间*/),
                dataIndex: "createDate",
                key: "createDate",
                width: "12%",
                render(data, row, index) {
                    if (data) {
                        return new Date(data).Format("yyyy-MM-dd hh:mm:ss");
                    }
                    return null;
                }
            },
            {
                title: i18n.t(100144/*修改人*/),
                dataIndex: "updateUserName",
                key: "updateUserName",
                width: "10%",
                render(data, row, index) {
                    return data ;
                }
            }, {
                title: i18n.t(100146/*修改时间*/),
                dataIndex: "updateDate",
                key: "updateDate",
                width: "12%",
                render(data, row, index) {
                    if (data) {
                        return new Date(data).Format("yyyy-MM-dd hh:mm:ss");
                    }
                    return null;
                }
            }];


        // ajax func
        this.getPage = this.getPage.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    initState() {
        return {
            scrollHeight: 0,
            selectArr: [],
            checkedRows: [],
            choised: false,
            data: [],

            totalPages: 1, // 总页数
            currentPage: 1, // 当前页
            pageSize: pageSize, // 每页 多少条
        }
    }

    componentDidMount() {
        this.getPage();
        window.addEventListener('resize', this.handleResize);
        this.handleResize(null,40)
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    addClick() {
        let content = require('./FormworkAddDialog').default;
        let element = React.createElement(content, {
            onSaveAdd:this.onSaveAdd,
            onSaveAndClose: this.onSaveAndClose,
            onCancel: this.onCancel,
        });
        this.setState({
            showDilaog: true,
            title: i18n.t(400207/*模板*/),
            dialogContent: element
        })
    }


    deleteClick() {
        let numArr = this.refs.formwordsetting.getSelectArr();
        let tempString = "",id=[];
        if(numArr.length==0){
            ServiceTips({text:i18n.t(100394/*请选择数据！*/),type:'error'});
            return false;
        }else if(numArr.length==1){
            tempString=i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
        }else{
            tempString=i18n.t(100395/*已选中*/) + numArr.length + i18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
        }
        for(let j=0,len= numArr.length; j<len; j++){
            id.push(numArr[j].id)
        }
        Confirm(tempString, {
            done: () => {
                this.deletedFunc(id);
            },
            close:() => {
                console.log('no, close')
            }
        });
    }

    // 调用删除 ajax  传进来的id必须为一个数组
    deletedFunc(ID){
        let that = this;
        apiForm(API_FOODING_TPM,'/template/delete',{ids: ID},
            (response)=>{
                ServiceTips({text:response.message,type:'sucess'});
                that.getPage();
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
            });
    }

    //保存并新增
    onSaveAdd = () => {
        this.getPage();
    }

    //保存并关闭
    onSaveAndClose = () => {
        this.setState({showDilaog: false},() => this.getPage())
    }

    //取消
    onCancel = () => {
        this.setState({showDilaog: false })
    }

    //双击进详情
    onRowDoubleClick(record, index, checked) {
        // let {navAddTab} = this.props;
        // navAddTab({
        //     id: 'formworksetting-detail',
        //     name: i18n.t(200571/*货代详情*/),
        //     component: i18n.t(200571/*货代详情*/),
        //     url: '/formworksetting/detail'
        // });
        // this.props.router.push({
        //     pathname: '/formworksetting/detail',
        //     query: {id: record.id, index: 'detail'},
        //     state: {refresh: true}
        // });
    }

    //右键方法
    handleClick(e, data) {
        if(data.type == 2){//删除
            this.deleteClick();
        }else if(data.type == 1){//编辑
            let content = require('./FormworkEditDialog').default;
            let element = React.createElement(content, {
                onSaveAdd:this.onSaveAdd,
                onSaveAndClose: this.onSaveAndClose,
                onCancel: this.onCancel,
                id:data.record.id
            });
            this.setState({
                showDilaog: true,
                title: i18n.t(400207/*模板*/),
                dialogContent: element
            })
        }
    }



    //请求列表  list
    getPage(currentPage,order){
        this.columnSort = order = order || this.columnSort;
        let that = this;
        let currentP = currentPage || this.state.currentPage;
        let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm(),order);
        apiGet(API_FOODING_TPM,'/template/getPage',object,
            (response)=>{
                that.setState({
                    data: response.data.data || [],
                    totalPages: response.data.totalPages || 0,
                    totalRecords:response.data.totalRecords || 0,
                    currentPage: response.data.currentPage || 1
                });
            },(errors)=>{});
    }

    handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 180 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll, scrollHeight: scrollHeight});
    }

    render() {
        let that = this;
        return (<div>
            <FilterHeader  getPage ={this.getPage} expandFilter= {this.handleResize}  normalRef={no => this.normalRef = no} />
            <div className={'client-body'} style={{height: this.state.scrollHeight}}>
                <div className={'client-body-single'}>
                    <div className='action-buttons'>
                        <div className={'key-page'}>
                            <FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick} />
                            <Page
                                currentPage={this.state.currentPage}
                                totalPages={this.state.totalPages}
                                totalRecords={this.state.totalRecords}
                                sizeList={sizeList}
                                currentSize={this.state.pageSize}
                                pageSizeChange={(num) => {
                                    that.setState({
                                        pageSize: Number.parseInt(num),
                                        currentPage: 1
                                    }, () => that.getPage());
                                }}
                                backClick={(num) => {
                                    that.setState({currentPage: Number.parseInt(num)}, () => that.getPage());
                                }}
                                nextClick={(num) => {
                                    that.setState({currentPage: Number.parseInt(num)}, () => that.getPage());
                                }}
                                goChange={(num) => {
                                    that.setState({currentPage: Number.parseInt(num)}, () => that.getPage());
                                }}
                            />
                        </div>
                        <Table
                            ref="formwordsetting"
                            columns={this.columns}
                            data={this.state.data || []}
                            checkboxConfig={{
                                show: true,
                                position: 'first'
                            }}
                            colorFilterConfig={{
                                show: false,
                                dataIndex: 'colorType',
                            }}
                            followConfig={{
                                show: false,
                                dataIndex: 'followMark',
                            }}
                            scroll={{x: true, y: this.state.scroll}}
                            onRowDoubleClick={this.onRowDoubleClick}
                            onHeaderSortClick={this.getPage.bind(this, null)}
                            contextMenuConfig={{
                                enable: true,
                                contextMenuId: 'SIMPLE_TABLE_MENU',
                                menuItems: [
                                    {
                                        permissions:'forwarder.edit',
                                        onClick:this.handleClick,
                                        content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
                                        data:{action:i18n.t(100439/*编辑*/),type:1}
                                    },
                                    {
                                        permissions: 'forwarder.del',
                                        onClick: this.handleClick,
                                        content: <div><i
                                            className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}
                                        </div>,
                                        data: {action: i18n.t(100437/*删除*/),type:2}
                                    }]
                            }}
                        />
                        <Dialog width={1000} visible={this.state.showDilaog} title={this.state.title}>
                            {this.state.dialogContent}
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default NavConnect(FormworkSettingList);
