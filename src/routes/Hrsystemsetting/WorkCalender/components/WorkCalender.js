import i18n, {I18n} from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";

//引入弹层
import Dialog from '../../../../components/Dialog/Dialog'
const {Table} = require("../../../../components/Table");

import Page from '../../../../components/Page';
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层

import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import ServiceTips, {errorTips, successTips} from '../../../../components/ServiceTips';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_HR, API_FOODING_DS, sizeList} from '../../../../services/apiCall';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

class WorkCalender extends Component {
    constructor(props) {
        super(props);
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
            title: i18n.t(400209/*日历编号*/),
            dataIndex: 'code',
            key: "code",
            width: '12%',
            render(data, row, index){
                return (<div className="text-ellipsis">{data}</div>)
            }
        }, {
            title: i18n.t(400230/*日历名称*/),
            dataIndex: "name",
            key: "name",
            width: "15%",
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(400232/*年度*/),
            dataIndex: "calendarYear",
            key: "calendarYear",
            width: "20%",
            render(data, row, index){
                return (<div className="text-ellipsis">{data}</div>)
            }
        }, {
            title: i18n.t(400231/*日历类型*/),
            dataIndex: "calendarType",
            key: "calendarType",
            width: "10%",
            render(data, row, index){
                return data && data.name ? data.name : "";
            }
        }, {
            title: i18n.t(400233/*开始日期*/),
            dataIndex: "dateBegin",
            key: "dateBegin",
            width: "15%",
            render(data, row, index){
                if (data) {
                    return new Date(data).Format("yyyy-MM-dd");
                }
                return null;
            }
        }, {
            title: i18n.t(400234/*结束日期*/),
            dataIndex: 'dateEnd',
            key: "dateEnd",
            width: "15%",
            render(data, row, index){
                if (data) {
                    return new Date(data).Format("yyyy-MM-dd");
                }
                return null;
            }
        },{
            title: i18n.t(100300/*创建日期*/),
            dataIndex: 'createDate',
            key: "createDate",
            width: "15%",
            render(data, row, index){
                if (data) {
                    return new Date(data).Format("yyyy-MM-dd");
                }
                return null;
            }
        },{
            title: i18n.t(100002/*描述*/),
            dataIndex: 'remark',
            key: "remark",
            width: "15%",
            render(data, row, index){
               return data;
            }
        }, {
            title: i18n.t(100230/*状态*/),
            dataIndex: 'irowSts',
            key: "irowSts",
            width: "8%",
            render(data, row, index){
                return data && data.name ? data.name : "";
            }
        }];
    }

    initState() {
        return {
            scrollHeight: 0,
            record: [],
            initData: { },
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
        }
    }

    getPages(currentPage, size, filter, order) {
        filter = filter || (this.searchForm && this.searchForm.getFieldsValue()) || {};
        order = order || {column: 'id', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || page.currentPage;
        size = size || page.size;
        let params = Object.assign({}, {currentPage: currentPage, pageSize: size}, filter, order, this.filterData);
        apiGet(API_FOODING_HR, "/calendar/getPage", params,
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
        this.getPages(1);
    };

    onSaveAndClose() {
        this.setState({showDilaog: !this.state.showDilaog });
    }

    onEditSaveAndClose = () => {
        this.setState({showDilaog: !this.state.showDilaog });
        this.getPages();
    };

    onCancel() {
        this.setState({showDilaog: false})
    }

    addClick() {
        let {navAddTab} =this.props;
        navAddTab({name:i18n.t(400235/*工作日历新增*/),component:i18n.t(400235/*工作日历新增*/),url:'/workcalender/addedit'});
        this.props.router.push({pathname:'/workcalender/addedit',state: {refresh: true}});
    }

    deleteClick() {
        let numArr = this.formTable.getSelectArr();
        let tempString = "";
        if(numArr.length==0){
            ServiceTips({text:i18n.t(100394/*请选择数据！*/),type:'error'});
            return false;
        }else if(numArr.length==1){
            tempString=i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
        }else{
            tempString=i18n.t(100395/*已选中*/) + numArr.length + i18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
        }
        for (var i = 0; i < numArr.length; i++) {
            if(numArr[i].rowSts != 5)
                return ServiceTips({text:i18n.t(400245/*请选择草稿状态删除*/), type:"error"});
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
        apiForm(API_FOODING_HR, '/calendar/delete', {id: ids}, response => {
            ServiceTips({text: response.message, type:'success'});
            this.getPages();
        }, error =>  ServiceTips({text: error.message, type: 'error'}))
    }

    handleClick(e, {type, record}) {
        if (type == 1){//编辑
            let {navAddTab} =this.props;
            navAddTab({name:i18n.t(400236/*工作日历编辑*/),component:i18n.t(400236/*工作日历编辑*/),url:'/workcalender/addedit'});
            this.props.router.push({pathname:'/workcalender/addedit',query:{id:record.id},state: {refresh: true}});
        } else if (type == 2) {//删除
            Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    this._deleteUser([record.id]);
                },
                close: () => {
                    console.log('no, close')
                }
            });
        } else if(type == 3){//激活
            apiForm(API_FOODING_HR,'/calendar/modifyWorkingCalendar',{id:record.id,state:true},(response)=>{
                ServiceTips({text:response.message,type:'success'});
                this.getPages();
            },(error)=>{

            })
        }else if(type == 4){//失效
            Confirm(I18n.t(100435/*是否对该条数据失效？*/), {
                done: () => {
                    //表示是失效
                    apiForm(API_FOODING_HR,'/calendar/modifyWorkingCalendar',{id:record.id,state:false},(response)=>{
                        ServiceTips({text:response.message,type:'success'});
                        this.getPages();
                    },(error)=>{
                        ServiceTips({text:error.message,type:'error'})
                    })
                },
                close:() => {
                }
            });
        }
    }

    onRowDoubleClick(record, index, checked) {
        let {navAddTab} =this.props;
        navAddTab({name:i18n.t(400237/*工作日历详情*/),component:i18n.t(400237/*工作日历详情*/),url:'/workcalender/detail'});
        this.props.router.push({pathname:'/workcalender/detail',query:{id:record.id},state: {refresh: true}});
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
                              sizeList={sizeList}
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
                           singleSelect={true}
                           contextMenuConfig={{
                               enable: true,
                               contextMenuId: 'SIMPLE_TABLE_MENU',
                               menuItems: [{
                                   permissions:'workcalender.edit',
                                   onClick: this.handleClick,
                                   content: <div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
                                   data: {action: i18n.t(100439/*编辑*/),type:1}
                               }, {
                                   permissions:'workcalender.del',
                                   condition: [{key: 'irowSts.id', value: 5, exp: '==='}],
                                   onClick: this.handleClick,
                                   content: <div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
                                   data: {action: i18n.t(100437/*删除*/),type:2}
                               },{
                                   permissions:'workcalender.activation',
                                   onClick:this.handleClick,
                                   condition: [{key: 'irowSts.id', value: [5, 20], exp: '==='}],
                                   content:<div><i className={'foddingicon fooding-jh-icon2'}/><span>{i18n.t(100442/*激活*/)}</span></div>,
                                   data:{action:i18n.t(100442/*激活*/),type:3}
                               },{
                                   permissions:'workcalender.Invalid',
                                   onClick:this.handleClick,
                                   condition: [{key: 'irowSts.id', value: 10, exp: '==='}],
                                   content:<div><i className={'foddingicon fooding-sx-icon2'}/><span>{i18n.t(100441/*失效*/)}</span></div>,
                                   data:{action:i18n.t(100441/*失效*/),type:4}
                               }]
                           }}
                    />
                </div>
            </div>
        </div>)
    }
}
export default NavConnect(WorkCalender);
