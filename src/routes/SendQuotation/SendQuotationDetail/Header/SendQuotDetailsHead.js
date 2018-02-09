import React, {Component} from 'react';
import {browserHistory, withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import xt from '../../../../common/xt';
import Confirm from '../../../../components/Dialog/Confirm'; //删除弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiPost, permissionsBtn} from '../../../../services/apiCall';
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
            {name: i18n.t(100097/*详情*/), url: '/sendquotation/detail', id: 0},
            {name: i18n.t(200031/*反馈信息*/), url: '/sendquotation/feedback', id: 1}
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

    componentDidMount() {
        let activeId = getActiveTab(this.props.location.pathname, this.state.navContent);
        this.setState({activeTab: activeId});
    }

    onclickXin() {
        this.setState({
            isShow: !this.state.isShow
        });
    }

    onChangeDataClick = ()=>{
        let {navAddTab, navReplaceTab} =this.props;
        let name = i18n.t(200032/*编辑发出的报价*/);
        navReplaceTab({name,component: name,url:'/sendquotation/edit/change'});
        this.props.router.push({pathname: '/sendquotation/edit/change', query: {id: this.props.billId}});

        // Confirm('你确定要变更此报价吗 ？', {
        //     done: () => {
        //         apiGet(API_FOODING_ERP, '/nooquotation/changeVersion', {
        //             billId: this.props.billId
        //         }, ({data}) => {
        //
        //         }, error => {
        //             errorTips(error.message);
        //         })
        //     }
        // });
    };

    onSendClick = ()=>{
        let {navAddTab, navReplaceTab} =this.props;
        Confirm(i18n.t(200055/*发出后将无法撤销, 你确定要发出此报价吗 ？*/), {
            done: () => {
                const {businessOne} = this.props;
                ///nooquotation/sendQuotation replace /inquiryquote/send
                apiPost(API_FOODING_ERP, '/inquiryquote/send', {
                    ...businessOne
                }, (response) => {
                    successTips(response.message);
                    this.props.refreshDetail('one');
                }, error => {
                    errorTips(error.message);
                })
            }
        });
    };

    onEditDetail = ()=> {
        let {navAddTab, navRemoveTab, navReplaceTab} = this.props;
        let name = i18n.t(200032/*编辑发出的报价*/);
        navReplaceTab({ name, component: name, url: '/sendquotation/edit'});
        this.props.router.push({pathname: '/sendquotation/edit', query: {id: this.props.billId}});
    };

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
                                <p>{businessOne.no}</p>
                                <StateShow statusName={businessOne.statusName} status={businessOne.status}/>
                                <span style={{float: 'right'}}>
                                     {
                                         xt.conditionComponents(businessOne, [
                                             {
                                                 condition: {key: 'status', value: 1, exp: '=='},
                                                 content: <i key='1' className={permissionsBtn('sendquotation.edit') ? 'foddingicon fooding-Edit' : 'hide'} style={{fontSize: '16px', marginRight: '20px'}}
                                                             title={i18n.t(100439/*编辑*/)}  onClick={this.onEditDetail}/>
                                             },
                                             {
                                                 condition: {key: 'status', value: 1, exp: '=='},
                                                 content:  <i key="2" className= {permissionsBtn('sendquotation.sendprice') ? 'foddingicon fooding-send-price' : 'hide'} style={{fontSize: '16px', marginRight: '20px'}}
                                                              title={i18n.t(200056/*发出报价*/)} onClick={this.onSendClick}/>
                                             },
                                             {
                                                 condition: [
                                                     {key: 'status', value: 10, exp: '=='},
                                                     'and',
                                                     {key: 'isChanged', value: true, exp: '!=='},
                                                 ],
                                                 content: <i key="3" className={permissionsBtn('sendquotation.editprice') ? 'foddingicon fooding-charge' : 'hide'} onClick={this.onChangeDataClick}
                                                             style={{fontSize: '16px', marginRight: '20px'}} title={i18n.t(200057/*变更*/)}/>
                                             }
                                         ])
                                     }
                                </span>
                            </div>
                            <span className="name"><p>{businessOne.ccLcName}</p></span>
                        </div>
                        <div className="box4">
                            <div className="flex">
                                <div className="nation"><span>{i18n.t(200005/*询盘编号*/)}</span><b>{businessOne.enquiryNo}</b></div>
                            </div>
                            <div className="flex">
                                <div className="contact"><span>{i18n.t(200024/*询价人*/)}</span><b>{businessOne.enquiryStaffLcName}</b></div>
                            </div>
                            <div className="flex">
                                <div className="source"><span>{i18n.t(200008/*有效期*/)}</span><b>{new Date(businessOne.validityDate).Format('yyyy-MM-dd')}</b>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="web"><span>{i18n.t(100229/*邮箱*/)}</span><b>{businessOne.enquiryMail}</b></div>
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

