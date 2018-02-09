import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import Page from "../../../../components/Page"
import Confirm from '../../../../components/Dialog/Confirm'; //删除弹层
//引入按钮键
import ButtonConfirm from '../../../../components/button/confirm'
import Collapse, {Panel} from 'rc-collapse';
import Checkbox from '../../../../components/CheckBox';
//引入弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiForm, apiGet, apiPost, getUser, apiGetOffline, language} from '../../../../services/apiCall';

const {Table} = require("../../../../components/Table");
import QuotProDialog from "../../ReceivedInquiryDetail/Content/components/QuotProDialog";
import Dialog from "../../../../components/Dialog/Dialog";

export class SendQuot extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.getPages=this.getPages.bind(this);
        let that = this;
        props.feedback && props.feedback(this);
        this.state = {
            rodalShow: false,
            title: '',
            scroll: 0,
            paddingTop: 0,
            selectArr: [],
            record: [],
            activeKey: [],
            productData: {},
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
            showDialog:false,
            dialogTitle:"",
            dilogTelmp:<div></div>
        };
        this.filterData = {};
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
            dataIndex: "purLcName",
            key: "purLcName",
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
        }, {
            title : "版本号",
            dataIndex : 'versionNo',
            key : "versionNo",
            width : "4%",
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(200098/*操作*/),
            dataIndex : "handle",
            key : "handle",
            width : "8%",
            render(data,row,index){
                if(row.status == 1){
                    return <div><i className='foddingicon fooding-send-price' onClick={that.onSendSingleClick.bind(that,row)} title={i18n.t(200424/*发送报价单*/)}></i></div>;
                }else if(row.isNew == true && row.status == 10 ){
                    return <div><i className='foddingicon fooding-charge' onClick={that.onUpdateClick.bind(that,row)} title={i18n.t(200061/*变更报价*/)}></i></div>;
                }else{
                    return null;
                }
            }
        }];
    }

    historyClick(data) {
        let {navAddTab} = this.props;
        navAddTab({id: 4, name: i18n.t(200053/*发出的报价详情*/), component: i18n.t(200053/*发出的报价详情*/), url: '/sendquotation/feedback'});
        this.props.router.push('/sendquotation/feedback');
    }

    getPages(currentPage, size, filter, order) {
        let {page} = this.state;
        currentPage = currentPage || 1;
        size = size || page.size;
        let params = {billId: this.props.location.query.id, isSend: true,currentPage:currentPage, pageSize:size};
        apiGetOffline(this.pageData, API_FOODING_ERP,'/inquiryquote/getsends',params, response => {
            let {pageSize, totalPages, totalRecords, currentPage } = response.data;
            let record = response.data.data || [];
            let page = {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords};
            this.setState({record, page});
        },error => errorTips(error.message))
    }

    //变更报价
    onUpdateClick = data => {
        this.setState({
            showDilaog:true,
            dialogTitle: i18n.t(200061/*变更报价*/),
            dilogTelmp: <QuotProDialog
                businessOne={this.props.businessOne}
                onSaveAndClose={this.onSaveAndClose}
                onCancel={this.onCancel}
                updateQuot={true}
                mtlDtlId={data.mtlDtlId}
                billDtlId={data.billDtlId}
            />,
            width:"90%"
        });
    };

    onSaveAndClose = () => {
      this.setState({showDilaog:false},() => {
          this.pageData = {};
          this.getPages()
      })
    };

    onCancel = () => {
        this.setState({showDilaog:false})
    };

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
        let that = this;
        if( !arr.length) return Confirm(i18n.t(200328/*请选择一条数据进行操作*/));
        for(let i = 0; i < arr.length; i++ ){
            if(arr[i].status != 1){
                return Confirm(i18n.t(201291/*所选的数据已处于报价中!*/))
                break;
            }
        }
        let ids = arr.map( e => e.billDtlId);

        Confirm("是否确认发送产品的报价?", {
            done: () => {
                ///nooquotation/sendQuotation replace /inquiryquote/send
                apiForm(API_FOODING_ERP, '/inquiryquote/send', {
                    ids: ids
                }, (response) => {
                    successTips(response.message);
                    that.pageData = {};
                    that.getPages();
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
        // window.addEventListener('resize', this.handleResize(0));
    };

    componentWillUnmount() {
        // window.removeEventListener('resize', this.handleResize(0));
    }

    componentWillReceiveProps(nextProps) {
        this.handleResize(0);
        // window.addEventListener('resize', this.handleResize(0));
    }

    deleteClick = ()=>{
        let numArr = this.refs.mainTab.getSelectArr();
        if( !numArr.length) return Confirm(i18n.t(200328/*请选择一条数据进行操作*/));
        if( parseInt(numArr[0].status) !== 1) return Confirm(i18n.t(201291/*所选的数据已处于报价中!*/));

        Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done: () => {
                ///nooquotation/delete replace /inquiryquote/delete
                apiForm(API_FOODING_ERP, '/inquiryquote/delete', {
                    billDtlId: numArr[0].billDtlId
                }, response => {
                    successTips(response.message);
                    this.pageData = {};
                    this.getPages();
                }, error => {
                    errorTips(error.message);
                })
            }
        });
    };

    render() {
        const {page, record, productData, selectArr} = this.state;
        let iconArray = [{type: 'delete', onClick: this.deleteClick}, {type: 'sendprice', onClick: this.onSendClick}];
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
                        columns={this.columns} ref="mainTab"
                        data={this.state.record || []}
                        checkboxConfig={{show: true, position: 'first'}}
                        scroll={{x: true, y: this.state.scroll}}
                        onRowDoubleClick={this.onRowDoubleClick}
                    />
                </div>
                </div>
                <Dialog visible={this.state.showDilaog} title={this.state.dialogTitle} width={this.state.width}>
                    {this.state.dilogTelmp}
                </Dialog>
            </div>
        )
    }
}

export default NavConnect(SendQuot);
