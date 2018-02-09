import i18n from './../../../../lib/i18n';
import React, {Component} from "react";
//引入提示
import Tooltip from "antd/lib/tooltip";
//引入弹层
import Dialog from "../../../../components/Dialog/Dialog";
//import ListFilter from "./Navheader"
import ClientListFunctionKeys from "./ClientListFunctionKeys";
//邮件提示 用于分管人
import MailCard from "../MailCard/MailCard";
//邮件提示 用于默认联系人
import MailDefault from "../MailCard/MailDefault";
import Confirm from "../../../../components/Dialog/Confirm";
import NavConnect from "../../../../components/NavigateTabs/containers/AddContainer";
import Page from "../../../../components/Page";
import {deleteCustomer, getClientPage, getCustomerOne, saveCustomerPrefers} from "../../../../services/client/call";
import {I18n} from "../../../../lib/i18n";
import ServiceTips, {errorTips} from "../../../../components/ServiceTips";
import UUID from "uuid";
import {API_FOODING_DS, apiForm} from "../../../../services/apiCall";
import xt from "../../../../common/xt";

import Card from "../../../Common_confirm/Card.js";
const {Table} = require("../../../../components/Table");

export class Clentlist extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        let that = this;
        this.columns = [{
            title: I18n.t(100354/*客户代码*/),
            dataIndex: 'code',
            key: "code",
            width: '6%',
            render(data, row, index){
                let value = data == null ? null : data;
                return (<div className="text-ellipsis" title={value}>{value}</div>)
            }
        },{
            title: I18n.t(100355/*客户名称*/),
            dataIndex: 'localName',
            key: "localName",
            sort: 'name',
            width: '15%',
            render(data, row, index){
                let value = data == null ? null : data;
                return (<div className="text-ellipsis" title={value}>{value}</div>)
            }
        },{
            title: I18n.t(100087/*国家*/),
            dataIndex: "country",
            key: "country",
            width: "9%",
            render(data, row, index){
                let value = data;
                return data;
            }
        }, {
            title: I18n.t(100359/*客户等级*/),
            dataIndex: "level",
            key: "level",
            sort: 'cstmLevel',
            width: "5%",
            render(data, row, index){
                return data;
            }
        }, {
            title: I18n.t(100360/*客户类型*/),
            dataIndex: "type",
            key: "type",
            sort:'cstmType',
            width: "6%",
            render(data, row, index){
                let value = data;
                return (<div className="text-ellipsis">{value}</div>);
            }
        // }, {
        //     title: I18n.t(100371/*网站*/),
        //     dataIndex: 'defaultWeb',
        //     key: "defaultWeb",
        //     width: "17%",
        //     render(data, row, index){
        //         let value = data;
        //         // if(data && ('txt_name' in data)){
        //         // 	value=data.txt_name;
        //         // }
        //         return value;
        //     }
        }, {
            title: I18n.t(100372/*主联系人*/),
            dataIndex: "defaultContact",
            key: "defaultContact",
            sort: 'defaultEntContact',
            width: "10%",
            tooltip: false,
            render(data, row, index){

                return <Card type="userLinkMan" freight={true} data={row['defaultContact']} icon={['detail','date','contact','activity']}/>;


               let value = null;
                if (data && data.localName) {
                    value = data.localName;
                }
                if( !value) return null;
                return (<Tooltip
                    placement="bottomRight"
                    mouseEnterDelay={0.5}
                    arrowPointAtCenter={true}
                    mouseLeaveDelay={0.2}
                    prefixCls="card-toolip"
                    trigger="click"
                    overlay={<MailDefault data={data} router={that.props.router} type={'client'}/>}
                >
                    <span className={'mail-hover'}>{value}</span>
                </Tooltip>)
            }
        }, {
            title: I18n.t(100361/*分管人*/),
            dataIndex: 'staff',
            key: "staff",
            sort:'staffs',
            width: "5%",
            tooltip: false,
            render(data, row, index){

                return <Card type="admin" data={row['staff_bs'][0]}/>;

                let value = null;
                if (data && data.length > 0) {
                    value = data[0];
                }
                if( !value) return null;
                return (<Tooltip
                    placement="bottomRight"
                    mouseEnterDelay={0.5}
                    arrowPointAtCenter={true}
                    mouseLeaveDelay={0.2}
                    prefixCls="card-toolip"
                    trigger="click"
                    overlay={<MailCard data={row.staff_bs&&row.staff_bs[0]}/>}
                >
                    <span className={'mail-hover'}>{value}</span>
                </Tooltip>)
            }
        }, {
            title: I18n.t(100374/*最近联系时间*/),
            dataIndex: 'contactTime',
            key: "contactTime",
            width: "7%",
            render(data, row, index){
                if (data) {
                    return new Date(data).Format("yyyy-MM-dd hh:mm:ss");
                }
                return null;
            }
        }, {
            title: I18n.t(100230/*状态*/),
            dataIndex: 'irowSts',
            key: "irowSts",
            sort: 'rowSts',
            width: "3%",
            tooltip: false,
            render(data, row, index){
                return data.name;
            }
        }];
        this.state = {
            showDilaog: false,
            showLoading: false,
            choised: false,
            scrollHeight: 0,
            checkedRows: [],
            filter: null,
            data: null,
            width:926,
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
            dialogWidth:926
        };
        this.filterData = {};
        this.columnSort = {column: 'id', order: 'desc'};
        this.addClick = this.addClick.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.partyClick = this.partyClick.bind(this);
        this.onPartySaveAndClose = this.onPartySaveAndClose.bind(this);
        this.onPartyCancel = this.onPartyCancel.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.mergeClick = this.mergeClick.bind(this);
        this.onMergeSaveAndClose = this.onMergeSaveAndClose.bind(this);
        this.onMergeCancel = this.onMergeCancel.bind(this);
        this.allotClick = this.allotClick.bind(this);
        this.onAlloteSaveAndClose = this.onAlloteSaveAndClose.bind(this);
        this.onAlloteCancel = this.onAlloteCancel.bind(this);
        this.priceClick = this.priceClick.bind(this);
        this.onPriceSaveAndClose = this.onPriceSaveAndClose.bind(this);
        this.onPriceCancel = this.onPriceCancel.bind(this);
        this.distinctClick = this.distinctClick.bind(this);
        this.onDistinctSaveAndClose = this.onDistinctSaveAndClose.bind(this);
        this.onDistinctCancel = this.onDistinctCancel.bind(this);
        this.onSendEmialSaveAndClose = this.onSendEmialSaveAndClose.bind(this);
        this.onSendEmailCancel = this.onSendEmailCancel.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
        this.getPages = this.getPages.bind(this);
        this.initPageDefault = this.initPageDefault.bind(this);
        this.qunfaClick = this.qunfaClick.bind(this);//群发邮件
        this.addEnable = true;
    }
    addClick() {
        if (!this.addEnable) {
            //添加提示信息
            return;
        }
        this.addEnable = false;
        let content = require('./AddCommonDialog').default;
        let ele = React.createElement(content, {
            onSaveAndClose: this.onAddSaveAndClose,
            onCancel: this.onCancel,
            data: {}
        });
        this.setState({
            showDilaog: !this.state.showDilaog,
            title: i18n.t(200255/*新增客户-直接新增*/),
            dialogContent: ele,
            dialogWidth:926
        }, () => {
            this.addEnable = true;
        });
    }
    qunfaClick(){
        //群发
        let selectArray = this.refs.mainTable.getSelectArr();
        let obj = null;
        if(selectArray.length == 0 ){
            //没有勾选的情况
            obj = Object.assign({},this.searchForm.getFieldsValue(),{color:this.filterData['colorType']});
        }
        let content = require('./QunfaDialog').default;
        let ele = React.createElement(content, {
            onCancel: this.onCancel,
            data:obj,
            selectArray:selectArray
        });
        this.setState({
            showDilaog: !this.state.showDilaog,
            title: i18n.t(700103/*写群邮件*/),
            dialogContent: ele,
            dialogWidth:'95%'
        });
    }
    onAddSaveAndClose = (record) => {
        this.onSaveAndClose(()=>{
            setTimeout(()=>{
                window.navTabs.open(i18n.t(100311/*客户*/) + `(${record.name})`, '/client/detail/' + record.id, {id: record.id});
            }, 500);
        });
        this.getPages();
    };

    onSaveAndClose(callback = xt.noop()) {
        this.setState({showDilaog: false}, callback);
    }

    onCancel() {
        this.setState({showDilaog: false});
    }

    partyClick() {
		let content=require('./ForwarderAddParty').default;
		let element=React.createElement(content,{getPage:this.getPages,onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
    	this.setState({
    		showDilaog : true,
    		title: i18n.t(300005/*新增 - 平台引入*/),
    		dialogContent: element
    	})        

    }

    onPartySaveAndClose() {
        this.setState({showDilaog: !this.state.showDilaog});
    }

    onPartyCancel() {
        this.setState({showDilaog: false});
    }

    deleteClick() {
        this.deleteReocrd();
    }

    mergeClick() {
        let content = require('./MergeDialog').default;
        let element = React.createElement(content, {onSaveAndClose: this.onMergeSaveAndClose, onCancel: this.onMergeCancel, uuid: UUID.v4()});
        this.setState({
            showDilaog: true,
            title: i18n.t(200438/*合并记录*/),
            dialogContent: element,
            dialogWidth:926
        })
    }

    onMergeSaveAndClose() {
        this.setState({showDilaog: !this.state.showDilaog});
        this.getPages();
    }

    onMergeCancel() {
        this.setState({showDilaog: false});
    }

    allotClick() {
        let numArr = this.refs.mainTable.getSelectArr();
        let tempString = i18n.t(200439/*客户分配 - 已选中*/) + numArr.length + i18n.t(100400/*个客户*/);
        if (numArr.length === 0) {
            ServiceTips({text: i18n.t(100394/*请选择数据！*/), type: 'error'});
            return false;
        }
        let content = require('./AllotDialog').default;
        let element = React.createElement(content, {
            onSaveAndClose: this.onAlloteSaveAndClose,
            onCancel: this.onAlloteCancel,
            allotArr: numArr,
            // staffs: this.state.initData.chargePeople
        });
        this.setState({
            showDilaog: true,
            title: tempString,
            dialogContent: element,
            dialogWidth:926
        })
    }

    onAlloteSaveAndClose() {
        this.setState({showDilaog: !this.state.showDilaog,});
        this.getPages();
    }

    onAlloteCancel() {
        this.setState({showDilaog: false})
    }

    distinctClick() {
        let content = require('./DistinctDialog').default;
        let element = React.createElement(content, {onSaveAndClose: this.onDistinctSaveAndClose, onCancel: this.onDistinctCancel});
        this.setState({
            showDilaog: true,
            title: i18n.t(200437/*客户查重*/),
            dialogContent: element,
            dialogWidth:926
        })
    }

    onDistinctSaveAndClose() {
        this.setState({
            showDilaog: !this.state.showDilaog
        })
    }

    onDistinctCancel() {
        this.setState({
            showDilaog: false
        })
    }

    priceClick() {
        let numArr = this.refs.mainTable.getSelectArr();
        let tempString;
        let num = numArr.length;
        if (numArr.length === 0) tempString = i18n.t(100398/*自动报价*/);
        if (numArr.length === 1) tempString = i18n.t(100398/*自动报价*/) + "-" + numArr[0].localName;
        if (numArr.length > 1) tempString = i18n.t(200440/*自动报价-已选择*/) + numArr.length + i18n.t(100400/*个客户*/);
        let content = require('./PriceDialog').default;
        let element = React.createElement(content, {
            onSaveAndClose: this.onDistinctSaveAndClose,
            onCancel: this.onDistinctCancel,
            num: num,
            cusArr: numArr
        });
        this.setState({
            showDilaog: true,
            title: tempString,
            dialogContent: element,
            dialogWidth:'95%'
            
        })
    }

    onPriceSaveAndClose() {
        this.setState({
            showDilaog: !this.state.showDilaog
        })
    }

    onPriceCancel() {
        this.setState({
            showDilaog: false
        })
    }

    onSendEmialSaveAndClose() {
        this.setState({
            showDilaog: !this.state.showDilaog
        })
    }

    onSendEmailCancel() {
        this.setState({
            showDilaog: false
        })
    }

    handleChange(e) {
        this.setState({
            r: e.target.value
        })
    }

    onRowDoubleClick(record, index, checked) {
        let {navAddTab} = this.props;
        let name = i18n.t(100311/*客户*/) + `(${record.localName})`;
        navAddTab({id: 3, name: name, component: name, url: '/freightClient/detail/' + record.id});
        this.props.router.push({pathname:'/freightClient/detail/' + record.id,query:{id:record.id}, state: {refresh: true}});
    }

    handleClick = (e, data) => {
        let {navAddTab, navRemoveTab} = this.props;
        if (data.action == i18n.t(100439/*编辑*/)) {
            let name = data.record.name, {initData} = this.state;
            this.addEnable = false;
            getCustomerOne({id: data.record.id}, (response) => { 
                let content = require('./AddCommonDialog').default;
                let ele = React.createElement(content, {
                    onSaveAndClose: this.onAddSaveAndClose,
                    onCancel: this.onCancel,
                    data: response.data || {}//
                });
                this.setState({
                    showDilaog: !this.state.showDilaog,
                    title: i18n.t(200441/*编辑客户-直接编辑*/),
                    dialogContent: ele,
                    dialogWidth:926
                }, () => {
                    this.addEnable = true;
                });
            }, (error) => {
                ServiceTips({text: error.message, type: 'error'});
            });
        } else if (data.action == i18n.t(100437/*删除*/)) {
            this.deleteReocrd(data.record);
        } else if (data.action == i18n.t(200256/*发邮件*/)) {
            let name = data.record.name;
            let content = require('./SendEmail').default;
            let element = React.createElement(content, {
                onSaveAndClose: this.onSendEmialSaveAndClose,
                onCancel: this.onSendEmailCancel,
                dataMain: data.record
            });
            this.setState({
                showDilaog: !this.state.showDilaog,
                title: i18n.t(200579/*询价*/) + '-' + name,
                dialogContent: element,
                dialogWidth:926
            })
        } else if (data.action == i18n.t(100398/*自动报价*/)) {
            this.priceClick();
        } else if (data.action == i18n.t(200442/*客户合并*/)) {
            this.mergeClick();
        } else if (data.action == i18n.t(200443/*客户分配*/)) {
            this.allotClick();
        } else if (data.action == i18n.t(100321/*商机*/)) {

            let name = i18n.t(100311/*客户*/) + "(" + data.record.localName +")";
            navAddTab({name: name, component: name, url: '/client/detail/' + data.record.id});
            this.props.router.push({pathname: '/client/detail/' + data.record.id,query:{id:data.record.id,index:'business'}});
        } else if (data.action == i18n.t(100588/*联络*/)) {

            let name = i18n.t(100311/*客户*/) + "(" + data.record.localName +")";
            navAddTab({name: name, component: name, url: '/client/detail/' + data.record.id});
            this.props.router.push({pathname: '/client/detail/' + data.record.id,query:{id:data.record.id,index:'contact'}});
        } else if (data.action == i18n.t(100585/*市场活动响应*/)) {

            let name = i18n.t(100311/*客户*/) + "(" + data.record.localName+")";
            navAddTab({ name: name, component: name, url: '/client/detail/' + data.record.id});
            this.props.router.push({pathname: '/client/detail/' + data.record.id,query:{id:data.record.id,index:'activity'}});
        } else if (data.action == i18n.t(100587/*约会*/)) {

            let name = i18n.t(100311/*客户*/) + "(" + data.record.localName+")";
            navAddTab({ name: name, component: name, url: '/client/detail/' + data.record.id});
            this.props.router.push({pathname: '/client/detail/' + data.record.id,query:{id:data.record.id,index:'date'}});
        } else if (data.action == i18n.t(100350/*关注产品*/)) {
            let name = i18n.t(100311/*客户*/) + "(" + data.record.localName+")";
            navAddTab({ name: name, component: name, url: '/client/detail/' + data.record.id});
            this.props.router.push({pathname: '/client/detail/' + data.record.id,query:{id:data.record.id,index:'product'}});
        }else if(data.action==i18n.t(100442/*激活*/)){
            apiForm(API_FOODING_DS,'/customer/enable',{id:data.record.id,optlock:data.record.optlock},(response)=>{
                ServiceTips({text:response.message,type:'sucess'});
                this.getPages();
            },(error)=>{
                errorTips(error.message);
            })
        }else if(data.action==i18n.t(100441/*失效*/)){
            Confirm(i18n.t(100435/*是否对该条数据失效？*/), {
                done: () => {
                    //表示是失效
                    apiForm(API_FOODING_DS,'/customer/disable',{id:data.record.id,optlock:data.record.optlock},(response)=>{
                        ServiceTips({text:response.message,type:'sucess'});
                        this.getPages();
                    },(error)=>{
                        ServiceTips({text:error.message,type:'error'})
                    })
                }
            });
        }
    };

    handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let sch = document.body.offsetHeight - this.filterHeight - 92;
		let scroll = sch - 90;
        this.setState({scrollHeight: sch+'px',scroll:scroll});
    }

    getPages(currentPage, size, filter, order) {
        filter = filter || (this.searchForm && this.searchForm.getFieldsValue()) || {};
        let {page} = this.state;
        this.columnSort = order = order || this.columnSort;
        currentPage = currentPage || 0;
        size = size || page.size;

        filter.startTime = filter.startTime ? filter.startTime + ' 00:00:00' : filter.startTime;
        filter.endTime = filter.endTime ? filter.endTime + ' 23:59:59' : filter.endTime;
        filter.assignTime = filter.assignTime ? filter.assignTime + ' 23:59:59' : filter.assignTime;


        let params = Object.assign({}, {currentPage: currentPage, pageSize: size}, filter, order, this.filterData);
        getClientPage(params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
            this.setState({
                data: data,
                page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            });
        }, (message) => {
            errorTips(message.message);
        });
    }

    searchCustomer = ()=> {
        this.getPages();
    };

    searchColor = color => {
        this.filterData['colorType'] = color;
        this.getPages(0);
    };

    searchFollow = follow => {
        this.filterData['followMark'] = follow;
        this.getPages(0);
    };

    initPageDefault(id) {
        let params = {};
        if (id && id > 0) {
            params.id = id;
        }
        let header = require('./Navheader').default;
        header = React.createElement(header, {expandFilter: this.handleResize, searchCustomer: this.searchCustomer, formCall:form=>this.searchForm=form});
        this.setState({filter: header});
    }

    savePrefers = (color, rowData) => {
        if (!rowData) return;
        let params = {custId: rowData.id, colorType: color, optlock: rowData.optlock, followMark: rowData.followMark};
        saveCustomerPrefers(params, response => {
            rowData.optlock += 1;
            rowData.colorType = color || '#fff';
            ServiceTips({text: response.message, type: 'success'});
        }, message => {
            ServiceTips({text: message.message, type: 'error'});
        });
    };

    saveStats = rowData => {
        if (!rowData) return;
        let followMark = !rowData.followMark;
        let params = {custId: rowData.id, colorType: rowData.colorType, optlock: rowData.optlock, followMark};
        saveCustomerPrefers(params, response => {
            rowData.optlock += 1;
            rowData.followMark = followMark;
            ServiceTips({text: response.message, type: 'success'});
        }, message => {
            ServiceTips({text: message.message, type: 'error'});
        });
    };

    deleteReocrd = (row) => {
        let ids = (row && [row.id]) || this.refs.mainTable.getSelectArr().map(o => o.id);

        if (!ids.length) return errorTips(i18n.t(100434/*请选择一条数据！*/));

        let msg = i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
        Confirm(ids.length > 1 ? i18n.t(100395/*已选中*/) +`${ids.length}` + i18n.t(400182/*条数据*/) + `, ${msg}`: msg, {done: ()=>{
            deleteCustomer({id: ids}, response => {
                this.getPages();
                ServiceTips({text: response.message, type: 'success'});
            }, (error) => {
                ServiceTips({text: error.message, type: 'error'});
            });
        }});


    };

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        let {page} = this.state;
        this.getPages();
        this.initPageDefault();
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    shouldComponentUpdate(props, state) {
        return xt.equalsObject(state, this.state);
    }

    render() {
        let {data, page} = this.state, records;
        records = data || [];
        return (
            <div className="">
                {this.state.filter}
                <div className='content-margin'/>
                <div className="client-body" style={{height:this.state.scrollHeight}}>
                    <div className="client-body-single">
                        <div className="action-buttons">
                            <div className="key-page">
                                <ClientListFunctionKeys addClick={this.addClick} partyClick={this.partyClick} deleteClick={this.deleteClick}
                                                        mergeClick={this.mergeClick} allotClick={this.allotClick}
                                                        distinctClick={this.distinctClick} priceClick={this.priceClick}
                                                        qunfaClick ={this.qunfaClick} />
                                <Page totalPages={page.totalPages}
                                      currentPage={page.currentPage}
                                      totalRecords={page.totalRecords}
                                      currentSize={page.size}
                                      pageSizeChange={(value) => {
                                          let {page} = this.state;
                                          if (page.size == value) {
                                              return;
                                          }
                                          this.getPages(1, value);
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
                        <Table ref="mainTable"
                               columns={this.columns}
                               data={records}
                               checkboxConfig={{
                                   show: true,
                                   checkedRows: this.state.checkedRows,
                                   position: 'first'
                               }}
                               colorFilterConfig={{show: true, dataIndex: 'colorType', onSelect: this.savePrefers, onHeaderSelect: this.searchColor}}
                               followConfig={{show: true, onClick: this.saveStats, dataIndex: 'followMark', onHeaderClick: this.searchFollow}}
                               scroll={{x: true, y: this.state.scroll}}
                               onRowDoubleClick={this.onRowDoubleClick}
                               onHeaderSortClick={this.getPages.bind(this, null, null, null)}
                               contextMenuConfig={{
                                   enable: true,
                                   contextMenuId: 'SIMPLE_TABLE_MENU',
                                   menuItems: [
                                   //     {
                                   //     permissions:'clien.edit',
                                   //     onClick: this.handleClick,
                                   //     content: <div><i className={'foddingicon fooding-alter_icon2'}></i><span>编辑</span></div>,
                                   //     data: {action: '编辑'},
                                   // },
                                       {
                                       permissions:'clien.del',
                                       onClick: this.handleClick,
                                       condition: [{key: 'irowSts.id', value: 5, exp: '==='}],
                                       content: <div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
                                       data: {action: i18n.t(100437/*删除*/)}
                                   },{
                                       permissions:'clien.activation',
                                       onClick:this.handleClick,
                                       condition: [{key: 'irowSts.id', value: [5, 20], exp: '==='}],
                                       content:<div><i className={'foddingicon fooding-jh-icon2'}/><span>{i18n.t(100442/*激活*/)}</span></div>,
                                       data:{action:i18n.t(100442/*激活*/)}
                                   },{
                                       permissions:'clien.Invalid',
                                       onClick:this.handleClick,
                                       condition: [{key: 'irowSts.id', value: [5, 10], exp: '==='}],
                                       content:<div><i className={'foddingicon fooding-sx-icon2'}/><span>{i18n.t(100441/*失效*/)}</span></div>,
                                       data:{action:i18n.t(100441/*失效*/)}
                                    },
                                    //{
                                   //     permissions:'clien.semail',
                                   //     onClick: this.handleClick,
                                   //     content: <div><i className={'foddingicon fooding-email_32'}></i>{i18n.t(200256/*发邮件*/)}</div>,
                                   //     data: {action: i18n.t(200256/*发邮件*/)}
                                    //,} 
                                    /*{
                                       permissions:'clien.offer',
                                       onClick: this.handleClick,
                                       content: <div><i className={'foddingicon fooding-zdbj-icon3'}></i><span>{i18n.t(100398*//*自动报价*//*)}</span></div>,
                                       data: {action: i18n.t(100398*//*自动报价*//*)}
                                   }, {
                                       permissions:'clien.merge',
                                       onClick: this.handleClick,
                                       content: <div><i className={'foddingicon fooding-merge_icon'}></i>{i18n.t(200442*//*客户合并*//*)}</div>,
                                       data: {action:i18n.t(200442*//*客户合并*//*)}
                                   }, {
                                       permissions:'clien.assigned',
                                       onClick: this.handleClick,
                                       content: <div><i className={'foddingicon fooding-allot'}></i>{i18n.t(200443*//*客户分配*//*)}</div>,
                                       data: {action: i18n.t(200443*//*客户分配*//*)}
                                   }, {
                                       permissions:'clien.right.business',
                                       onClick: this.handleClick,
                                       content: <div><i className={'foddingicon fooding-business_icon'}></i><span>{i18n.t(100321*//*商机*//*)}</span></div>,
                                       data: {action: i18n.t(100321*//*商机*//*)}
                                   }, */
                                   {
                                       permissions:'clien.right.liaison',
                                       onClick: this.handleClick,
                                       content: <div><i className={'foddingicon fooding-contact'}></i>{i18n.t(100588/*联络*/)}</div>,
                                       data: {action: i18n.t(100588/*联络*/)}
                                   }, {
                                       permissions:'clien.right.response',
                                       onClick: this.handleClick,
                                       content: <div><i className={'foddingicon fooding-activity'}></i>{i18n.t(100585/*市场活动响应*/)}</div>,
                                       data: {action: i18n.t(100585/*市场活动响应*/)}
                                   }, {
                                       permissions:'clien.right.date',
                                       onClick: this.handleClick,
                                       content: <div><i className={'foddingicon fooding-yuehui'}></i>{i18n.t(100587/*约会*/)}</div>,
                                       data: {action: i18n.t(100587/*约会*/)}
                                   },
                                   /*{
                                       permissions:'clien.right.mtl',
                                       onClick: this.handleClick,
                                       content: <div><i className={'foddingicon fooding-product'}></i>{i18n.t(100350*//*关注产品*//*)}</div>,
                                       data: {action: i18n.t(100350*//*关注产品*//*)}
                                   }*/
                                   ]
                               }}
                        />
                        <Dialog visible={this.state.showDilaog} title={this.state.title} width={this.state.dialogWidth} >
                            {this.state.dialogContent}
                        </Dialog>
                    </div>

                </div>
            </div>
        )
    }
}

export default NavConnect(Clentlist);
