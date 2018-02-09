import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import {browserHistory, withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import Confirm from '../../../../components/Dialog/Confirm'; //删除弹层
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiGet, apiPost, permissionsBtn} from '../../../../services/apiCall';
import xt from '../../../../common/xt';
import StateShow from '../../../../components/StateShow';

function getActiveTab(pathname, navTabs) {
    let currents, activeTab = 0;
    currents = navTabs.filter((item, index) => (item.url == pathname));
    if (currents && currents.length > 0) {
        activeTab = currents[0].id;
    }
    return activeTab;
}

export class ReceivedQuotDetailsHead extends Component {
    constructor(props) {
        super(props);
        this.array = [];
        let navTabs = [
            {name: i18n.t(100097/*详情*/), url: '/receivedquotation/detail', id: 'detail',isLoading:false},
            {name: i18n.t(200031/*反馈信息*/), url: '/receivedquotation/feedback', id: 'feedback',isLoading:false}
        ];
        let activeTabId = getActiveTab(props.location.pathname, navTabs)
        this.state = {
            visible: false, isUp: false, activeTab:  this.props.curentId,
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
        this.props.onClickLink({id:v.id, dataTyId: v.dataTyId,activeTab:this.state.activeTab,isLoading:v.isLoading});
        let navContent = this.state.navContent;
        navContent[e].isLoading = true;
        this.setState({
            activeTab:v.id,
            navContent:navContent
        });
        // let tab = {id: this.props.navigate.currentTab, url: v.url};
        // this.props.updateTab(tab);
        // browserHistory.push({pathname:v.url,query:{id:this.props.location.query.id}});
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
    }

    componentDidMount() {
        // let activeId = getActiveTab(this.props.location.pathname, this.state.navContent);
        // this.setState({activeTab: activeId});
    }

    onclickXin() {
        this.setState({
            isShow: !this.state.isShow
        });
    }

    onSendClick = ()=>{
        let {navAddTab, navReplaceTab} =this.props;
        let product = this.props.getProductRef();
        let proAry = [];
        if(product) proAry = product.getSelectArr().map(da => da.billDtlId);

        let msg = i18n.t(201293/*您是否接受全部产品的报价, 系统将自动关闭其他报价？*/);
        let isAllAccept = true;
        if(proAry.length !== 0 && proAry.length !== this.props.productData.length) {
            isAllAccept = false;
            msg = i18n.t(201294/*是否接受此报价, 系统将自动关闭其他报价 ？*/);
        }

        Confirm(msg, {
            done: () => {
                ///nooquotation/accept replace /inquiryquote/accept
                apiPost(API_FOODING_ERP, '/inquiryquote/accept', {
                    billId: this.props.billId, isAllAccept,
                    mtls: this.props.productData.map(da => ({
                        billDtlId: da.billDtlId,
                        isAccept: isAllAccept || proAry.indexOf(da.billDtlId) !== -1
                    }))
                }, (response) => {
                    successTips(response.message);
                    this.props.refreshDetail('one');
                    this.props.refreshDetail('mtl');
                }, error => {
                    errorTips(error.message);
                })
            }
        });
    };

    onCreateNooOrder = ()=>{
        let {navAddTab, navReplaceTab} =this.props;
        Confirm(i18n.t(201295/*是否确定生成网上订单 ？*/), {
            done: () => {
                apiGet(API_FOODING_ERP, '/nooquotation/createNooOrder', {
                    billId: this.props.billId
                }, (response) => {
                    successTips(response.message);
                    this.props.refreshDetail('one');

                    navAddTab({name:i18n.t(500024/*编辑买家订单*/),component:i18n.t(500024/*编辑买家订单*/),url:'/onlineorderbuyer/edit'});
                    this.props.router.push({pathname:'/onlineorderbuyer/edit', query: {id: response.data}});
                }, error => {
                    errorTips(error.message);
                })
            }
        });
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
                                                condition: {key: 'status', value: [15, 12], exp: '=='},
                                                content: <i key="1" className="foddingicon fooding-add-icon2" style={{fontSize: '16px', marginRight: '20px'}}
                                                            title={i18n.t(200145/*生成网上订单*/)} onClick={this.onCreateNooOrder}/>
                                            },
                                            {
                                                condition: {key: 'status', value: 10, exp: '=='},
                                                content: <i key="1" className={permissionsBtn('receivedquotation.accept') ? "foddingicon fooding-jieshou" : "hide"} style={{fontSize: '16px', marginRight: '20px'}}
                                                            title={i18n.t(100464/*接受报价*/)} onClick={this.onSendClick}/>
                                            },
                                        ])
                                    }

                                </span>
                            </div>
                            <span className="name"><p>{businessOne.ccLcName}</p></span>
                        </div>
                        <div className="box4">
                            <div className="flex">
                                <div className="nation"><span>{i18n.t(200146/*询盘号*/)}</span><b>{businessOne.enquiryNo}</b></div>
                            </div>
                            <div className="flex">
                                <div className="contact"><span>{i18n.t(200066/*报价人*/)}</span><b>{businessOne.quotationLcName}</b></div>
                            </div>
                            <div className="flex">
                                <div className="source"><span>{i18n.t(200008/*有效期*/)}</span><b>{new Date(businessOne.validityDate).Format('yyyy-MM-dd')}</b>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="web"><span>{i18n.t(100229/*邮箱*/)}</span><b>{businessOne.quotationMail}</b></div>
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

export default NavConnect(LocationConnect(withRouter(ReceivedQuotDetailsHead)));

