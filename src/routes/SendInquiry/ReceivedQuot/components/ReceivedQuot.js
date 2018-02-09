import React, {Component} from 'react';
import Page from "../../../../components/Page"
import Collapse, {Panel} from 'rc-collapse';

const {Table} = require("../../../../components/Table");//Table表格
//引入按钮键
import ButtonConfirm from '../../../../components/button/confirm'
import Confirm from '../../../../components/Dialog/Confirm'; //删除弹层
import Checkbox from '../../../../components/CheckBox';
//引入弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiForm, apiGet, getUser, language, apiGetOffline} from '../../../../services/apiCall';

import i18n from '../../../../lib/i18n';

export class ReceivedQuot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rodalShow: false,
            title: '',
            scroll: 0,
            paddingTop: 0,
            selectArr: [],
            activeKey: [],
            record: [],
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0}

        };
        let that = this;
        this.pageData = {}; //前端分页数组
        this.columns = [{
            title: i18n.t(200028/*报价编号*/),
            dataIndex: 'no',
            key: "no",
            width: '10%',
            render(data, row, index) {
                return data;
            }
        }, {
            title: i18n.t(100311/*客户*/),
            dataIndex: "vndBeLcName",
            key: "vndBeLcName",
            width: "14%",
            render(data, row, index) {
                return data;
            }
        }, {
            title: i18n.t(200861/*产品代码*/),
            dataIndex: "code",
            key: "code",
            width: "10%",
            render(data, row, index) {
                return data;
            }
        }, {
            title: i18n.t(500061/*产品名称*/),
            dataIndex: 'mtl' + language,
            key: "mtl" + language,
            width: "14%",
            render(data, row, index) {
                return data;
            }
        }, {
            title: i18n.t(100382/*产品规格*/),
            dataIndex: "basSpeci",
            key: "basSpeci",
            width: "20%",
            render(data, row, index) {
                return (<div className="text-ellipsis" >{data}</div>)
            }
        }, {
            title : i18n.t(400012/*品牌*/),
            dataIndex :"brand"+language,
            key :"brand"+language,
            width : "5%",
            render(data, row, index) {
                return data;
            }
        }, {
            title: i18n.t(200009/*目标价*/),
            dataIndex: "aimPrc",
            key: "aimPrc",
            width: "8%",
            render(data, row, index){
                return data ? data + row.cnyLcName :"";
            }
        }, {
            title: i18n.t(200116/*报价*/),
            dataIndex: 'quotationAmt',
            key: "quotationAmt",
            width: "6%",
            render(data, row, index) {
                return data ? data + row.cnyLcName :"";
            }
        }, {
            title : i18n.t(100230/*状态*/),
            dataIndex : 'quoStatusName',
            key : "quoStatusName",
            width : "6%",
            render(data,row,index){
                return data;
            }
        },{
            title : "版本号",
            dataIndex : 'versionNo',
            key : "versionNo",
            width : "4%",
            render(data,row,index){
                return data;
            }
        }, {
            title : i18n.t(200098/*操作*/),
            dataIndex : "handle",
            key : "handle",
            width : "8%",
            render(data,row,index){
                return  row.status == 10?<div><i className='foddingicon fooding-jieshou' onClick={that.onSendSingleClick.bind(that,row)} ></i></div>:null;
            }
        }];
    }

    historyClick(data) {
        let {navAddTab} = this.props;
        let name = i18n.t(200025/*收到的报价详情*/);
        navAddTab({id: 4, name, component: name, url: '/receivedquotation/feedback'});
        this.props.router.push('/receivedquotation/feedback');
    }

    onRowDoubleClick(record, index, checked) {
        // let {navAddTab} = this.props;
        // let name = i18n.t(200025/*收到的报价详情*/);
        // navAddTab({id: 5, name, component: name, url: '/receivedquotation/detail'});
        // this.props.router.push('/receivedquotation/detail');
    }

    getPages(currentPage, size, filter, order) {
        let {page} = this.state;
        currentPage = currentPage || 0;
        size = size || page.size;
        let params = {billId: this.props.location.query.id, isSend: false,currentPage:currentPage, pageSize:size};
        ///nooquotation/getPage replace /inquiryquote/getaccepts
        apiGetOffline(this.pageData, API_FOODING_ERP,'/inquiryquote/getaccepts',params, response => {
            let {pageSize, totalPages, totalRecords, currentPage } = response.data;
            let record = response.data.data || [];
            let page = {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords};
            this.setState({record, page});
        },error => errorTips(error.message))
    }

    onSendSingleClick = data => {
      let arr = [];
      arr.push(data);
      this.onHandle(arr);
    };

    //头上点击的那个
    onSendClick = () => {
        let arr = this.refs.mainTab.getSelectArr();
        this.onHandle(arr);
    };

    //点击报价时候的处理方法
    onHandle = arr => {
        if (!arr.length) return Confirm(i18n.t(100434/*请选择一条数据！*/));
        let one = arr[0];
        if (one.status !== 10) return Confirm(i18n.t(200026/*所选的数据已接受报价*/));

        Confirm(i18n.t(200027/*您是否接受全部产品的报价, 系统将自动关闭其他报价 ？*/), {
            done: () => {
                ///nooquotation/accept replace /inquiryquote/accept
                apiForm(API_FOODING_ERP, '/inquiryquote/accept', {
                    id: one.billDtlId
                }, (response) => {
                    successTips(response.message);
                    this.pageData = {};
                    this.getPages();
                }, error => {
                    errorTips(error.message);
                })
            }
        });
    };

    handleResize(height) {
        this.setState({
            paddingTop: !this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 173 : 262;
        let sch = document.body.offsetHeight - height - padding;
        let scroll = sch - 135;

        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }

    componentDidMount() {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
        this.getPages();
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }

    componentWillReceiveProps(nextProps) {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
        if (nextProps.businessOne.billId !== this.props.businessOne.billId) {
            this.pageData = {};
            this.getPages();
        }
    }

    viewClick(dataItem, event) {//查看详情
        event.stopPropagation();
        event.preventDefault();

        let {navAddTab} = this.props;
        let name = i18n.t(200025/*收到的报价详情*/);
        navAddTab({id: 9, name, component: name, url: '/receivedquotation/detail'});
        this.props.router.push({pathname: '/receivedquotation/detail', query: {id: dataItem.billId}});
    }

    render() {
        const {page, record , selectArr} = this.state;

        let iconArray = [{type: 'receive', onClick: this.onSendClick}];
        let title = <span>{this.state.title}<i className="font">{this.state.title_1}</i></span>;
        return (
            <div className="contact-fluid">
                <div className='content-margin'></div>
                <div className="contact-body" style={{height: this.state.scrollHeight}}>
                    <div className={'clientcontact-list-body-single'}>
                        <div className={'keys-page'}>
                            <ButtonConfirm iconArray={iconArray}/>
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
                            singleSelect={true}
                            columns={this.columns} ref="mainTab"
                            data={this.state.record || []}
                            checkboxConfig={{show: true, position: 'first'}}
                            scroll={{x: true, y: this.state.scroll}}
                            onRowDoubleClick={this.onRowDoubleClick}
                        />
                    </div>
                </div>
            </div>)
    }
}
export default NavConnect(ReceivedQuot);