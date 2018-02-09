import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FunctionKeys from "./FuncKeys";
import NumberSPlug from './Edit';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS,pageSize,sizeList} from '../../../../services/apiCall';
import Loading from "../../../../components/Loading";//加载动画
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
import FilterHeader from "./FilterHeader";



class PlatformSMObjectList extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.addClick = this.addClick.bind(this);
        this.editClick = this.editClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.copyClick = this.copyClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getPage = this.getPage.bind(this);
        this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
        this.lose = this.lose.bind(this);
        this.columns = [{
            title: i18n.t(200771/*企业名称*/),
            dataIndex: "company",
            key: "company",
            width: "20%",
            render(data, row, index){
                return (<div className="text-ellipsis">{data ? data['localName'] : ''}</div>);
            }
        },{
            title: i18n.t(100001/*名称*/),
            dataIndex: "billNoTarget.description",
            key: "billNoTarget.description",
            width: "20%",
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(201195/*固定字符*/),
            dataIndex: "bnplPattern",
            key: "bnplPattern",
            width: "10%",
            render(data, row, index){
                return (<div title={data} className={'text-ellipsis'}>{data}</div>)
            }
        },{
            title: i18n.t(201196/*编号预览*/),
            dataIndex: "billNoPreview",
            key: "billNoPreview",
            width: "20%",
            render(data, row, index){
                return (<div title={data} className={'text-ellipsis'}>{data}</div>)
            }
        }];

        this.state = {
            scrollHeight: 0,
            filter: null,
            selectArr: [],
            checkedRows: [],
            choised: false,
            MeunState: true,
            rodalShow: false,
            showSaveClose: true,
            buttonLeft: i18n.t(100429/*保存并关闭*/),
            contentTemplate: <div/>,
            checkedData: '',
            data: [],
            searchData: {}, // 查找
            currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0, pageSize: 20}
        }
    }

    addClick() {
        this.setState({
            rodalShow: true,
            showHeader: true,
            DialogContent: 1,
            showSaveClose: true,
            title: i18n.t(201197/*编号规则新增*/),
            checkedData: {}
        })
    }

    editClick(record) {
        apiGet(API_FOODING_DS, '/billNoPattern/getOne', {id: record.record.id},
            ({data}) => {
                this.setState({
                    rodalShow: true,
                    showHeader: true,
                    DialogContent: 1,
                    showSaveClose: true,
                    title: i18n.t(201198/*编号规则编辑*/),
                    checkedData: data.billNoPattern
                })
            }, error => {
                errorTips(error.message);
            });

    }

    deleteClick(data) {
        let numArr = this.refs.frexrat.getSelectArr();
        let tempString = "";
        let value = [];
        var that = this;

        // 未选择数据
        if(!numArr['length']) {
            ServiceTips({text:i18n.t(100434/*请选择一条数据！*/),type:'info'});
            return;
        }

        if (numArr.length === 0) {
            if (data.record) {
                tempString = i18n.t(201288/*已选择1条数据，您确定删除吗*/);
                value.push(data.record.id);
            } else {
                tempString = "请选择1条数据进行删除";
            }

        } else {
            if (data.record) {
                tempString = i18n.t(201288/*已选择1条数据，您确定删除吗*/);
                value.push(data.record.id);
            } else {
                for (let i = 0; i < numArr.length; i++) {
                    value.push(numArr[i].id);
                }
                tempString = i18n.t(100395/*已选中*/) + numArr.length + i18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
            }

        }


        Confirm(tempString, {
            done: () => {
                apiForm(API_FOODING_DS, '/billNoPattern/delete', {id: value}, (response) => {
                    that.getPage();
                    successTips(response.message)
                }, (errors) => {
                    errorTips(errors.message)
                });
            },
            close: () => {}
        });
    }

    lose(data) {
        //暂时不要失效
        /*Confirm("您确定要失效这条数据吗？", {
            done: () => {
                apiForm(API_FOODING_DS, '/billNoTarget/delete', {id: value}, (response) => {
                    that.getPage();
                    ServiceTips({text: response.message, type: 'success'});

                }, (errors) => {
                    ServiceTips({text: errors.message, type: 'error'});
                });
            },
            close: () => {
            }
        });*/
    }

    copyClick() {
        console.log('copyClick')
    }

    onSaveAndClose(value, data) {
        let that = this;
        value = Object.assign({}, data, value);
        apiPost(API_FOODING_DS, '/billNoPattern/save', value, (response) => {
            successTips(response.message);
            this.onCancel();
            this.getPage();
        }, (errors) => {
            errorTips(errors.message);
        })
    }

    onCancel(that) {
        this.setState({rodalShow: false});
    }

    handleClick(e, data) {
        //右键处理
        if (data.type == 1) {
            this.deleteClick(data);
        } else if (data.type == 2) {
            this.editClick(data);
        } else if (data.type == 3) {
            this.lose(data);
        }
    }

    onRowDoubleClick(record, index, checked) {
        this.setState({
            rodalShow: true,
            showHeader: true,
            showSaveAdd: false,
            showSaveClose: false,
            DialogContent: 5,
            title: i18n.t(201199/*编号规则详情*/),
            checkedData: record
        })
    }

    handleResize() {
        let sch = document.body.offsetHeight-230;
        let scroll = sch - 80;
        this.setState({scrollHeight: sch + 'px', scroll: scroll});
        // console.log(scroll);
    }

    // search data 
    searchHandle = (o)=>{
        let that = this;
        this.setState({searchData:o,currentPage:1},function(){
            that.getPage();
        });
    }

    // get page
    getPage(currentPage, size, filter, order) {
        let that = this;
        filter = filter || {};
        order = order || {column: 'id', order: 'desc'};
        let {page,searchData} = this.state;
       // currentPage = currentPage || page.currentPage - 1;
        //size = size || page.size;
        let params = Object.assign({}, {currentPage: that.state.currentPage, pageSize: that.state.pageSize}, filter, order,searchData);

        apiGet(API_FOODING_DS, '/billNoPattern/getPage', params,
            (response) => {
                //let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
                that.setState({
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage 	
                    //page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
                });
            }, (errors) => {

        });
    }

    componentDidMount() {
        this.handleResize();
        let that = this;
        this.getPage();
        window.addEventListener('resize', this.handleResize);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    render() {
        let that = this;
        let {page} = this.state;

        return (<div>
                <div className={'client-body'} style={{height: this.state.scrollHeight}}>
                    <FilterHeader getPage={this.getPage} searchHandle={this.searchHandle} formCall={form => this.searchForm = form}/>
                    <div className={'client-body-single'}>
                        <div className="action-buttons">
                        <div className={'key-page'}>
                            <FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick} copyClick={this.copyClick}/>
                            <Page 
                                currentPage={this.state.currentPage}
                                totalPages={this.state.totalPages} 
                                sizeList={sizeList}
                                currentSize={this.state.pageSize}
                                pageSizeChange={(num)=>{
                                    that.setState({ pageSize: Number.parseInt(num),currentPage:1 },()=>that.getPage());
                                }} 
                                backClick={(num)=>{
                                    that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());
                                }} 
                                nextClick={(num)=>{
                                    that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());										
                                }}
                                goChange={(num)=>{
                                    that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());																				
                                }}								
                            />

                        </div>
                        
                            <Table
                                ref="frexrat"
                                columns={this.columns}
                                data={this.state.data}
                                checkboxConfig={{
                                    show: true,
                                    position: 'first'
                                }}
                                colorFilterConfig={{show: false}}
                                followConfig={{show: false}}
                                onRowDoubleClick={this.onRowDoubleClick}
                                scroll={{x: true, y: this.state.scroll}}
                                onHeaderCellClick={this.onHeaderCellClick}
                                contextMenuConfig={{
                                    enable: true,
                                    contextMenuId: 'SIMPLE_TABLE_MENU',
                                    menuItems: [{
                                        permissions:'billrule.del',
                                        onClick: this.handleClick,
                                        content: <div><i className={'foddingicon fooding-delete-icon4'}/>{i18n.t(100437/*删除*/)}</div>,
                                        data: {type: 1, title: i18n.t(100437/*删除*/)}
                                    }, {
                                        permissions:'billrule.edit',                                        
                                        onClick: this.handleClick,
                                        content: <div><i className={'foddingicon fooding-alter_icon2'}/>{i18n.t(100439/*编辑*/)}</div>,
                                        data: {type: 2, title: i18n.t(100439/*编辑*/)}
                                    }]
                                }}
                            />
                            <Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader={this.state.showHeader}>
                                <NumberSPlug DialogContent={this.state.DialogContent}
                                             checkedData={this.state.checkedData}
                                             showSaveClose={this.state.showSaveClose}
                                             buttonLeft={this.state.buttonLeft}
                                             onSaveAndClose={this.onSaveAndClose}
                                             contentDate={this.state.contentDate}
                                             onCancel={this.onCancel}/>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default NavConnect(PlatformSMObjectList);

