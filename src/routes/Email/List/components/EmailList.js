import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';

const {Table} = require("../../../../components/Table");
import Page from "../../../../components/Page"
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog'
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_DS,
    API_FOODING_MAIL,
    language,
    pageSize,
    sizeList,
    getQueryString,
    getUser
} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import EmailDetaiDialog from './EmailDetaiDialog';

export class Clentlist extends Component {
    constructor(props) {
        super(props);
        props.email && props.email(this);
        this.columns = [{
            title: i18n.t(100136/*附件*/),
            dataIndex: 'containAttach',
            key: "containAttach",
            width: '5%',
            render(data, row, index) {
                return <div title={data}>{data ? <i className='fooding-accessory foddingicon'></i> : ''}</div>
            }
        }, {
            title: i18n.t(100304/*主题*/),
            dataIndex: "subject",
            key: "subject",
            width: "20%",
            render(data, row, index) {
                return <div>{data}</div>;
            }
        }, {
            title: i18n.t(200539/*发件人*/),
            dataIndex: "sendAddress",
            key: "sendAddress",
            width: "15%",
            className: 'text-center',
            render(data, row, index) {
                return <div>{data}</div>;
            }
        }, {
            title: i18n.t(200540/*收件人*/),
            dataIndex: "toAddress",
            key: "toAddress",
            width: "15%",
            className: 'text-center',
            render(data, row, index) {
                return <div>{data}</div>;
            }
        }, {
            title: i18n.t(400104/*时间*/),
            dataIndex: "sendTime",
            key: "sendTime",
            width: "10%",
            render(data, row, index) {
                return <div>{new Date(data).Format('yyyy-MM-dd hh:mm:ss')}</div>
            }
        }, {
            title: i18n.t(200080/*类型*/),
            dataIndex: 'box',
            key: "box",
            width: "10%",
            render(data, row, index) {
                return <div>{data}</div>;
            }
        }];
        this.state = {
            rodalShow: false,
            title: '',
            scroll: 0,
            paddingTop: 0,
            data: [],
            dataTyId: getQueryString("dataTyId"),
            currentPage: 0,
            pageSize: pageSize,
            cp: 1,
            billId: null,
            billType: null,
            searchValue:"",
            array:[]
        }
        this.onCancel = this.onCancel.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.searchClick = this.searchClick.bind(this);
    }

    searchChange(e){
        this.setState({
            searchValue:e.target.value
        });
    }

    searchClick(){
        this.setState({currentPage:1},() => {this.getPage()})
    }

    onSaveAndClose(value, data) {
        var that = this;
        value = Object.assign({}, value, {beId: getQueryString("id")});
        apiPost(API_FOODING_DS, '/entContact/save', value, (response) => {
            ServiceTips({text: response.message, type: 'sucess'});
            that.getPage();
        }, (error) => {
            ServiceTips({text: error.message, type: 'error'});
        })
        this.setState({
            rodalShow: false
        });
    }

    onCancel(that) {
        this.setState({
            rodalShow: false
        });
    }

    handleResize(height) {
        let sch = document.body.offsetHeight - 226;
        let scroll = sch - 135;

        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }

    getPage(value) {
        let that = this;
        let object = {};
        let billId = value ? value.billId : this.state.billId;
        let billType = value ? value.billType : this.state.billType;
        if (value) {
            if (value.emailList) {
                this.setState({
                    array: value.emailList
                })
            } else if (value.billId) {
                this.setState({billId: value.billId, billType: value.billType});
            }
        }
        if (billId) {
            object = Object.assign({}, {
                currentPage: this.state.currentPage,
                pageSize: this.state.pageSize, billType: billType, billId: billId,subject:this.state.searchValue
            });
        } else {
            object = Object.assign({}, {
                currentPage: this.state.currentPage,
                pageSize: this.state.pageSize,
                addressList: this.state.array && this.state.array.join(',') || value.emailList.join(','),
                subject:this.state.searchValue
            });
        }
        apiGet(API_FOODING_MAIL, '/box/getList', object,
            (response) => {
                that.setState({
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage
                });
            }, (errors) => {
            });
    }

    componentDidMount() {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }

    componentWillReceiveProps(nextProps) {
        this.handleResize(0);
        let that = this;
        if ((this.props.value != nextProps.value) && nextProps.value && nextProps.value.emailList && nextProps.value.emailList.length > 0) {
            if (!this.props.isDetail) {
                this.getPage(nextProps.value);
            }
        } else if ((this.props.value != nextProps.value) && nextProps.value && nextProps.value.billId) {
            if (!this.props.isDetail) {
                this.getPage(nextProps.value);
            }
        }
        window.addEventListener('resize', this.handleResize(0));
    }

    onRowDoubleClick(record, index, checked) {
        // this.setState({
        // 	rodalShow:true,
        // 	title:i18n.t(200541/*邮件详细*/),
        // 	contentTemplate:<EmailDetaiDialog onCancel={this.onCancel}
        // 	  router ={this.props.router}
        // 	  record ={record}
        // 	/>
        // });
        let row = record;
        let active = '';
        window.navTabs.open(`(${row['subject']}){${row['id']}}`, `/mail/detail/${row['id']}`, {
            active: active,
            mailId: row['id'],
            collectionName: row['collectName'],
            isOwn: (getUser().staff.contacts.filter((o) => o['localName'] == row['collectName']).length ? true : false)
        }, {refresh: true});
    }

    render() {
        var that = this;
        let title = <span>{this.state.title}<i className="font">{this.state.title_1}</i></span>;
        return (
            <div className="contact-fluid">
                <div className='content-margin'></div>
                <div className="contact-body" style={{height: this.state.scrollHeight}}>
                    <div style={{width:"1px",height:"40px",float:"left"}}></div>
                    {
                        this.state.array.length == 0?null:<div className="search">
                            <input type='search'
                                   name="search" placeholder={"搜索主题"}
                                   value ={this.state.searchValue} onChange = {this.searchChange}
                                   onKeyDown={(e)=>{
                                       if(e.keyCode == 13){
                                           this.searchClick()
                                       }
                                   }}
                            />
                            <i className="foddingicon fooding-search_icon" onClick={this.searchClick}></i>
                        </div>
                    }
                    <Page
                        currentPage={this.state.currentPage}
                        totalPages={this.state.totalPages}
                        sizeList={[20, 50, 100]}
                        currentSize={this.state.pageSize}
                        pageSizeChange={(num) => {
                            that.setState({pageSize: Number.parseInt(num), currentPage: 1}, () => that.getPage());
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
                    <div className="action-normal-buttons">
                        <Table ref="linkman"
                               columns={this.columns}
                               scroll={{x: true, y: this.state.scroll}}
                               data={this.state.data}
                               checkboxConfig={{
                                   show: true,
                                   checkedAll: this.state.choised,
                                   checkedRows: this.state.checkedRows,
                                   position: 'first'
                               }}
                               colorFilterConfig={{show: false}}
                               followConfig={{show: false}}
                               style={{width: '100%'}}
                               onRowDoubleClick={this.onRowDoubleClick}
                        />
                        <Dialog visible={this.state.rodalShow} title={title} width={926}>
                            {this.state.contentTemplate}
                        </Dialog>
                    </div>
                </div>

            </div>
        )
    }
}

export default NavConnect(Clentlist);
