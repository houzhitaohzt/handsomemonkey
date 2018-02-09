import React, {Component} from 'react';
import {browserHistory, withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import xt from '../../../../common/xt';
import Confirm from '../../../../components/Dialog/Confirm'; //删除弹层
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP,apiGet, apiForm, permissionsBtn} from '../../../../services/apiCall';
import StateShow from '../../../../components/StateShow';
import i18n from '../../../../lib/i18n';

function getActiveTab(pathname, navTabs) {
    let currents, activeTab = 0;
    currents = navTabs.filter((item, index) => (item.url == pathname));
    if (currents && currents.length > 0) {
        activeTab = currents[0].id;
    }
    return activeTab;
}
export class SendQuotDetailsHead extends Component {
    constructor(props) {
        super(props);
        this.array = [];
        let navTabs = [
            {name: i18n.t(100097/*详情*/), url: '/sendinquiry/detail', id: 0},
            {name: i18n.t(200015/*收到的报价*/), url: '/sendinquiry/receivequotation', id: 1}
        ];
        let activeTabId = getActiveTab(props.location.pathname, navTabs);
        this.state = {
            visible: false, isUp: false, activeTab: activeTabId,
            isShow: false,
            navContent: navTabs
        };
        this.onClickLink = this.onClickLink.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onclickXin = this.onclickXin.bind(this);
    }

    onItemClick() {
        this.setState({
            isUp: !this.state.isUp
        });
        if (this.state.isUp) {
            this.props.onPackUp(226);
        } else {
            this.props.onPackUp(173);
        }
    }

    onClickLink(e, v) {
        let tab = {id: this.props.navigate.currentTab, url: v.url};
        this.props.updateTab(tab);
        browserHistory.push({pathname:v.url,query:{id:this.props.location.query.id}});
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
    }

    onEditDetail = ()=> {
        let {navAddTab, navRemoveTab, navReplaceTab, businessOne, billId} = this.props;
        let name = i18n.t(200016/*编辑发出的询盘*/) + '(' + businessOne.no + ")";
        navReplaceTab({ name, component: name, url: '/sendinquiry/edit/' + billId});
        this.props.router.push({pathname: '/sendinquiry/edit/' + billId, query: {id: billId}});
    };

    onReleaseClick = ()=>{
        Confirm(i18n.t(200003/*发布后无法撤回, 你确定要发布此询盘吗 ？*/), {
            done: () => {
                // /sendenquiry/release replace /inquiry/release
                apiForm(API_FOODING_ERP, '/inquiry/release', {
                    billId: this.props.billId
                }, response => {
                    successTips(response.message);
                    this.props.refreshDetail('one');
                }, error => {
                    errorTips(error.message);
                })
            }
        });
    };

    onCancelCLick = ()=>{
        Confirm(i18n.t(201301/*关闭后无法撤回, 你确定要关闭此询盘吗 ？*/), {
            done: () => {
                ///sendenquiry/cancel replace /inquiry/cancel
                apiForm(API_FOODING_ERP, '/inquiry/cancel', {
                    billId: this.props.billId
                }, response => {
                    successTips(response.message);
                    this.props.refreshDetail('one');
                }, error => {
                    errorTips(error.message);
                })
            }
        });
    };

    onDeleteClick = ()=>{
        Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done: () => {
                ///sendenquiry/delete replace /inquiry/delete
                apiForm(API_FOODING_ERP, '/inquiry/delete', {
                    billId: this.props.billId
                }, response => {
                    successTips(response.message);
                    let {navReplaceTab} = this.props;
                    let name = i18n.t(200004/*发出的询盘*/);
                    navReplaceTab({ name: name, component: name, url: '/sendinquiry'});
                    this.props.router.push({pathname: '/sendinquiry'});
                }, error => {
                    errorTips(error.message);
                })
            }
        });
    };

    //生成网上订单
    onOrderClick = () => {
        Confirm(i18n.t("您确定生成网上订单吗?"), {
            done: () => {
                apiGet(API_FOODING_ERP, '/inquiryquote/createOrder', {
                    id: this.props.billId
                }, response => {
                    successTips(response.message);
                    this.props.refreshDetail('one');
                }, error => {
                    errorTips(error.message);
                })
            }
        });
    };


    componentDidMount() {
        let activeId = getActiveTab(this.props.location.pathname, this.state.navContent);
        this.setState({activeTab: activeId});
    }

    onclickXin() {
        this.setState({
            isShow: !this.state.isShow
        });
    }

    render() {
        const {businessOne} = this.props;
        let array_name = this.state.navContent;
        return (
            <div className='cdetails'>
                <div className="box1">
                    <div className="touxiang">
                        <div className="tupian"><i className="foddingicon fooding-user_icon"/></div>
                    </div>
                    <div className="right">
                        <div className="box3">
                            <div className="daima">
                                <p/>
                                <StateShow statusName={businessOne.statusName} status={businessOne.status}/>
                                <span style={{float: 'right'}}>
                                    {
                                        xt.conditionComponents(businessOne, [
                                            {
                                                condition: {key: 'status', value: 1, exp: '=='},
                                                content: <i key="0" className={permissionsBtn('sendinquiry.edit') ? "foddingicon fooding-Edit" : 'hide'} style={{fontSize: '16px', marginRight: '20px'}}
                                                            title={i18n.t(100439/*编辑*/)} onClick={this.onEditDetail}/>
                                            },
                                            {
                                                condition: {key: 'status', value: 1, exp: '=='},
                                                content:  <i key="1" className={permissionsBtn('sendinquiry.release') ? "foddingicon fooding-relese" : 'hide'} style={{fontSize: '16px', marginRight: '20px'}}
                                                             title={i18n.t(100462/*发布*/)} onClick={this.onReleaseClick}/>
                                            },
                                            {
                                                condition: {key: 'status', value: 5, exp: '=='},
                                                content: <i key="2" className={permissionsBtn('sendinquiry.cancel') ? "foddingicon fooding-cancal-p" : 'hide'} onClick={this.onCancelCLick}
                                                            style={{fontSize: '16px', marginRight: '20px'}} title={i18n.t(100432/*关闭*/)}/>
                                            },
                                            {
                                                condition: {key: 'status', value: 1, exp: '=='},
                                                content: <i key="2" className={permissionsBtn('sendinquiry.del') ? "foddingicon fooding-delete-icon4" : 'hide'} onClick={this.onDeleteClick}
                                                            style={{fontSize: '16px', marginRight: '20px'}} title={i18n.t(100437/*删除*/)}/>
                                            },
                                            {
                                                condition: {key: 'status', value: 20, exp: '=='},
                                                content: <i key="2" className={"foddingicon fooding-creat-order"} onClick={this.onOrderClick}
                                                            style={{fontSize: '16px', marginRight: '20px'}} title={i18n.t(100457/*下单*/)}/>
                                            }
                                        ])
                                    }
                                </span>
                            </div>
                            <span className="name"><p>{businessOne.no}</p></span>
                        </div>
                        <div className="box4">
                            <div className="flex" style={{flex: 1}}>
                                <div className="nation"><span>{i18n.t(200017/*有效期至*/)}</span><b>{new Date(businessOne.validityDate).Format('yyyy-MM-dd')}</b></div>
                            </div>
                            <div className="flex" style={{flex: 1}}>
                                <div className="contact"><span>{i18n.t(100145/*创建时间*/)}</span><b>{new Date(businessOne.billDate).Format('yyyy-MM-dd')}</b></div>
                            </div>
                            <div className="flex" style={{flex: 1}}>
                                <div className="contact"><span>{i18n.t(100288/*发布日期*/)}</span><b>{new Date(businessOne.sendDate).Format('yyyy-MM-dd')}</b></div>
                            </div>
                            <div className="flex" style={{flex: 2}}>
                                <div className="source"><span>{i18n.t(100376/*交易条款*/)}</span><b>{businessOne.incotmLcName}</b></div>
                            </div>
                            <div className="flex" style={{flex: 2}}>
                                <div className="web" style={{maxWidth: 320}}><span>{i18n.t(100133/*支付条款*/)}</span><b>{businessOne.payTrmLcName}</b></div>
                            </div>
                        </div>
                    </div>

                </div>
                <ul className="box2">
                    {
                        array_name.map((item, i) => {
                            return (<li key={i}><a onClick={() => this.onClickLink(i, item)}
                                                   className={this.state.activeTab == item.id ? 'heghtL' : ''}>{item.name} </a></li>);
                        })
                    }

                </ul>
            </div>
        );
    }
}
export default NavConnect(LocationConnect(withRouter(SendQuotDetailsHead)));

