import i18n from './../../../../lib/i18n';
import React, {Component} from "react";
//引入提示
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiForm, apiGet, apiPost} from "../../../../services/apiCall";

import NavConnect from "../../../../components/NavigateTabs/containers/AddContainer";
import Page from "../../../../components/Page"; //分页
import Dialog from "../../../../components/Dialog/Dialog"; //弹层
import Table from "../../../../components/Table"; //Table表格
import Confirm from "../../../../components/Dialog/Confirm"; //删除弹层
import CloseBusiness from "../../../Client/Business/List/components/CloseBusiness"; // 关闭商机
import Approval from "../../../Client/Business/List/components/Approval"; // 查看审批
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import xt from "../../../../common/xt";
import Filter from "./Filter"
export class BusinessOpportunityList extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.filterData = {};
        this.columnSort = {column: 'billId', order: 'desc'};
        // TODO： 宽度待调整
        this.columns = [{
            title: i18n.t(400048/*单据编号*/),
            dataIndex: 'no',
            key: "no",
            width: '10%',
            render(data, row, index){
                let value = data;
                return (<div className="text-ellipsis" title={value}>{value}</div>)
            }
        }, {
            title: i18n.t(100323/*业务日期*/),
            dataIndex: "billDate",
            key: "billDate",
            width: "10%",
            tooltip: false,
            render(data, row, index){
                return new Date(data).Format("yyyy-MM-dd");
            }
        }, {
            title: i18n.t(100311/*客户*/),
            dataIndex: 'salBeLcName',
            key: "salBeLcName",
            width: '20%',
            render(data, row, index){
                let value = data;
                return (<div className="text-ellipsis" title={value}>{value}</div>)
            }
        }, {
            title: i18n.t(100304/*主题*/),
            dataIndex: "theme",
            key: "theme",
            width: "14%",
            render(data, row, index){
                let value = data;
                return value;
            }
        }, {
            title: i18n.t(400011/*销售员*/),
            dataIndex: "saleStaffLcName",
            key: "saleStaffLcName",
            width: "7%",
            render(data, row, index){
                return data;
            }
          },{
                title: i18n.t(400049/*业务状态*/),
                dataIndex: 'statusName',
                key: "statusName",
                sort: 'status',
                width: "5%",
                tooltip: false,
                render(data, row, index){
                    return data;
                }
            }, {
                title: i18n.t(200252/*实际截止日期*/),
                dataIndex: "actEDate",
                key: "actEDate",
                width: "10%",
                tooltip: false,
                render(data, row, index){
                    return new Date(data).Format("yyyy-MM-dd");
                }
            },{
                title: i18n.t(200253/*关闭类型*/),
                dataIndex: "closeCauseLcName",
                key: "closeCauseLcName",
                width: "5%",
                render(data, row, index){
                    return data;
                }
            }
        ];

        this.state = {
            showDilaog: false,
            choised: false,
            scrollHeight: 0,
            selectArr: [],
            checkedRows: [],
            filter: null,
            data: null,
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
            clientFiler:"",
            MeunState: true,
            record: []

        };

        this.addClick = this.addClick.bind(this);

        this.onRowDoubleClick = this.onRowDoubleClick.bind(this);

        this.onCloseBusinessCancel = this.onCloseBusinessCancel.bind(this);
        this.onCloseBusinessSave = this.onCloseBusinessSave.bind(this);
        this.onApprovalCancel = this.onApprovalCancel.bind(this);
        this.onApprovalSave = this.onApprovalSave.bind(this);
        this.getPages=this.getPages.bind(this);
    }

    addClick() {
        let {navAddTab, navRemoveTab} = this.props;
        navAddTab({ name: i18n.t(200254/*新增商机*/), component: i18n.t(200254/*新增商机*/), url: '/businessOpportunity/edit/add'});
        this.props.router.push({pathname: '/businessOpportunity/edit/add'});

    }

    onSaveAndClose() {
        this.setState({showDilaog: !this.state.showDilaog});
    }

    onCancel() {
        this.setState({showDilaog: false});
    }

    deleteClick = () =>{
        let numArr = this.refs.mainTable.getSelectArr();
        if( !numArr.length) return errorTips(i18n.t(100434/*请选择一条数据！*/));
        Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done: () => {
                apiForm(API_FOODING_ERP, '/business/delete', {billId: numArr[0].billId}, response => {
                    successTips(response.message);
                    this.getPages();
                }, error=>{
                    errorTips(error.message)
                })
            },
            close: () => {}
        });
    };

    onMergeSaveAndClose() {
        this.setState({showDilaog: !this.state.showDilaog,})
    }

    onMergeCancel() {
        this.setState({showDilaog: false});
    }

    onAlloteSaveAndClose() {
        this.setState({showDilaog: !this.state.showDilaog,})
    }

    onAlloteCancel() {
        this.setState({showDilaog: false})
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
        let name = i18n.t(100321/*商机*/) + '(' + record.no + ")";
        navAddTab({id: 11, name: name, component: name, url: '/businessOpportunity/detail/' + record.billId});
        this.props.router.push({pathname: '/businessOpportunity/detail/'  + record.billId, query: {id: record.billId}});
    }

    handleClick = (e, data) => {
        if (data.action == i18n.t(100439/*编辑*/)) {
            // let name = data.record.name,{initData}=this.state;
            // this.addEnable=false;
            // let content=require('./AddCommonDialog').default;
            // let ele =React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,initData:initData,data:data.record});
            // this.setState({
            // 	showDilaog : !this.state.showDilaog,
            // 	title:i18n.t(200255/*新增客户-直接新增*/),
            // 	dialogContent:ele
            // },()=>{
            // 	this.addEnable=true;
            // });
        } else if (data.action == i18n.t(100437/*删除*/)) {
            Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    console.log('ok, got it');
                }
            });
        } else if (data.action == i18n.t(200256/*发邮件*/)) {
            // let name = data.record.name;
            // let content=require('./SendEmail').default;
            // let element=React.createElement(content,{onSaveAndClose:this.onSendEmialSaveAndClose,onCancel:this.onSendEmailCancel,dataMain:data.record});
            // this.setState({
            // 	showDilaog : !this.state.showDilaog,
            // 	title:'选择收件人 - '+ name,
            // 	dialogContent:element
            // })
        } else if (data.action == i18n.t(100470/*查看审批*/)) {
            this.setState({
                showDilaog: true,
                title: i18n.t(100470/*查看审批*/),
                dialogContent: <Approval dataOne={data.record} onSaveAndClose={this.onApprovalSave} onCancel={this.onApprovalCancel}/>
            })
        } else if (data.action == i18n.t(100588/*联络*/)) {
            let {navAddTab, navRemoveTab} = this.props;
             // navRemoveTab({name:i18n.t(200250/*商机详情*/),component:i18n.t(200250/*商机详情*/),url:'/businessOpportunity/contact'});
             // navAddTab({ name: i18n.t(200250/*商机详情*/), component: i18n.t(200250/*商机详情*/), url: '/businessOpportunity/contact'});
             // this.props.router.push({pathname: '/businessOpportunity/contact',query:{id:data.record.billId}});

            let name = i18n.t(100321/*商机*/) + '(' + data.record.no + ")";
            let billId = data.record.billId;
            navAddTab({name: name, component: name, url: '/businessOpportunity/detail/' + billId});
            this.props.router.push({pathname: '/businessOpportunity/detail/' + billId, query: {id: billId,index:"contact"}});

        } else if (data.action == i18n.t(200257/*关闭商机*/)) {
            if(data.record.status === 20) return Confirm(i18n.t(201266/*所选的商机已关闭, 不可重复操作!*/));
            this.setState({
                showDilaog: true,
                title: i18n.t(200257/*关闭商机*/),
                dialogContent: <CloseBusiness onSaveAndClose={this.onCloseBusinessSave} onCancel={this.onCloseBusinessCancel} otherData={data.record}/>
            })

        } else if (data.action == i18n.t(100587/*约会*/)) {
            let {navAddTab, navRemoveTab} = this.props;
             // navRemoveTab({name:i18n.t(200250/*商机详情*/),component:i18n.t(200250/*商机详情*/),url:'/businessOpportunity/detail'});
             // navAddTab({ name: i18n.t(200250/*商机详情*/), component: i18n.t(200250/*商机详情*/), url: '/businessOpportunity/detail'});
             // this.props.router.push({pathname: '/businessOpportunity/detail',query:{id:data.record.billId}});

            let name = i18n.t(100321/*商机*/) + '(' + data.record.no + ")";
            let billId = data.record.billId;
            navAddTab({name: name, component: name, url: '/businessOpportunity/detail/' + billId});
            this.props.router.push({pathname: '/businessOpportunity/detail/' + billId, query: {id: billId,index:"date"}});
        } else if(data.action == i18n.t(200242/*重启*/)){
            let billId = data.record.billId;
            apiForm(API_FOODING_ERP, '/business/restart', {billId},
                response => {
                    successTips(response.message);
                    this.getPages();
                }, error => {
                    errorTips(error.message);
                })
        }
    };

    onCloseBusinessSave() {
        this.getPages();
        this.setState({ showDilaog: !this.state.showDilaog})
    }

    onCloseBusinessCancel() {
        this.setState({
            showDilaog: false
        })
    }

    onApprovalSave() {
        this.setState({
            showDilaog: !this.state.showDilaog
        })
    }

    onApprovalCancel() {
        this.setState({
            showDilaog: false
        })
    }

    handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        this.setState({scroll: scroll});
    }

    getPages(currentPage, size, filter, order) {
        filter = filter || (this.searchForm && this.searchForm.getFieldsValue()) || {};
        this.columnSort = order = order || this.columnSort;
        let {page} = this.state;
        currentPage = currentPage || 0;
        size = size || page.size;
        let params = Object.assign({}, {currentPage: currentPage, pageSize: size,type:this.state.clientFiler}, filter, order, this.filterData);
        apiGet(API_FOODING_ERP, '/business/getPage', params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
            this.setState({
                record: data || [],
                page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            });
            this.getPreferList((data || []).map(da => da.billId));
        }, error => {
            errorTips(error.message)
        });
    }

    getPreferList = billIds => {
        apiGet(API_FOODING_ERP, '/userprefer/getList', {billIds: billIds.join(','), billType: 301},
            response => {
                let prefer = response.data || [], record = this.state.record;
                let newRecord = [];
                record.forEach( da => {
                    let nPre = prefer.find(pda => pda.billId === da.billId) || {};
                    newRecord.push(Object.assign({}, da, {color: nPre.color, followMark: nPre.followMark}));
                });
                this.setState({record: newRecord});
            }, error => {
                errorTips(error.message);
            });
    };
    onfilterChange = data => {
        this.setState({clientFiler:data.id}, () => {
            this.getPages(1,null,null,null)
        })
    };
    searchCustomer = () => {
        this.getPages();
    };

    searchColor = color => {
        this.filterData['color'] = color;
        this.getPages(0);
    };

    searchFollow = follow => {
        this.filterData['followMark'] = follow;
        this.getPages(0);
    };

    saveColors = (color, rowData) => {
        let params = {billId: rowData.billId, billType: 301, color: color};
        apiForm(API_FOODING_ERP, '/userprefer/setcolor', params, response => {
            rowData.color = color;
            successTips(response.message);
        }, error => {
            errorTips(error.message)
        });
    };

    saveStats = rowData => {
        let mark = !rowData.followMark;
        let params = {billId: rowData.billId, billType: 301, mark};
        apiForm(API_FOODING_ERP, '/userprefer/setmark', params, response => {
            rowData.followMark = mark;
            successTips(response.message);
        }, error => {
            errorTips(error.message)
        });
    };

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        let {page} = this.state;
        this.getPages();
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    shouldComponentUpdate(props, state) {
        return xt.equalsObject(state, this.state);
    }

    render() {
        let {record, page} = this.state;
        let meun = [{
            permissions:'business.restart',
            condition: {key: 'status', value: 20, exp: '==='},
            onClick: this.handleClick,
            content: <div><i className={'foddingicon fooding-update'}/>{i18n.t(200242/*重启*/)}</div>,
            data: {action: i18n.t(200242/*重启*/)}
        },{
            onClick: this.handleClick,
            content: <div><i className={'foddingicon fooding-contact'}/><span>{i18n.t(100588/*联络*/)}</span></div>,
            data: {action: i18n.t(100588/*联络*/)}
        }, {
            onClick: this.handleClick,
            content: <div><i className={'foddingicon fooding-yuehui'}/><span>{i18n.t(100587/*约会*/)}</span></div>,
            data: {action: i18n.t(100587/*约会*/)}
        }, {
            permissions:'business.examine',
            condition: {key: 'status', value: [20, 5], exp: '==='},
            onClick: this.handleClick,
            content: <div><i className={'foddingicon fooding-approve'}/><span>{i18n.t(100470/*查看审批*/)}</span></div>,
            data: {action: i18n.t(100470/*查看审批*/)}
        },
        // },{
        //     onClick: this.handleClick,
        //     content: <div><i className={'foddingicon fooding-send-email'}/>{i18n.t(200256/*发邮件*/)}</div>,
        //     data: {action: i18n.t(200256/*发邮件*/)}
        // }, {
            {
            permissions:'business.close',
            condition: [{key: 'status', value: 20, exp: '!=='}, 'and', {key: 'status', value: 15, exp: '==='}],
            onClick: this.handleClick,
            content: <div><i className={'foddingicon fooding-menu_delete_32'}/><span>{i18n.t(200257/*关闭商机*/)}</span></div>,
            data: {action: i18n.t(200257/*关闭商机*/)}
        }];

        return (
            <div>
                <FilterHeader searchCustomer={ this.searchCustomer}
                 getPages = {this.getPages} expandFilter={this.handleResize}
                formCall={form => this.searchForm = form}/>
                <div className={'contact-body'} style={{height: '100%', position: 'absolute'}}>
                    <div className={'client-body-single'}>
                       <div className="action-buttons">
                        <div className={'key-page'}>
                            <FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}/>
                            <Filter getPage ={this.getPages} expandFilter={this.handleResize} searchCustomer={this.searchCustomer} formCall={form=>this.searchForm=form} onfilterChange={this.onfilterChange}/>
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
                        <Table ref="mainTable"
                               columns={this.columns}
                               data={record}
                               singleSelect={true}
                               checkboxConfig={{show: true, position: 'first'}}
                               colorFilterConfig={{
                                   show: true,
                                   dataIndex: 'color',
                                   onSelect: this.saveColors,
                                   onHeaderSelect: this.searchColor
                               }}
                               followConfig={{
                                   show: true,
                                   onClick: this.saveStats,
                                   dataIndex: 'followMark',
                                   onHeaderClick: this.searchFollow
                               }}
                               scroll={{x: true, y: this.state.scroll}}
                               onRowDoubleClick={this.onRowDoubleClick}
                               onHeaderSortClick={this.getPages.bind(this, null, null, null)}
                               contextMenuConfig={{
                                   enable: true,
                                   contextMenuId: 'SIMPLE_TABLE_MENU',
                                   menuItems: meun
                               }}
                        />
                        <Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
                            {this.state.dialogContent}
                        </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default NavConnect(BusinessOpportunityList);
