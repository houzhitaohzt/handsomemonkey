import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import {browserHistory, withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import {errorTips} from "../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiForm} from '../../../../services/apiCall';
import ReceivedAllotEdit from './../../ReceivedInquiry/components/ReceivedAllotEdit';
import StateShow from '../../../../components/StateShow';

import QuotProDialog from "../Content/components/QuotProDialog";

function getActiveTab(pathname, navTabs) {
    let currents, activeTab = 0;
    currents = navTabs.filter((item, index) => (item.url == pathname));
    if (currents && currents.length > 0) {
        activeTab = currents[0].id;
    }
    return activeTab;
}
export class ReceivedInquiryDetailsHead extends Component {
    constructor(props) {
        super(props);
        this.array = [];
        let navTabs = [
            {name: i18n.t(100097/*详情*/), url: '/receivedinquiry/detail', id: 'detail',isLoading:false},
            {name: i18n.t(200059/*发出的报价*/), url: '/receivedinquiry/feedback', id: 'feedback',isLoading:false}
        ];
        let activeTabId = getActiveTab(props.location.pathname, navTabs);
        this.state = {
            visible: false, isUp: false, activeTab: this.props.curentId,
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

    onSaveAndClose = () => {
        this.props.refreshDetail('one');
        this.props.refreshDetail('quot');
        this.onCancel();
    };

    onCancel = () =>{
        this.props.closeDialog();
    };

    releseClick = ()=>{
        this.props.openDialog(i18n.t(100446/*分配*/),
            <ReceivedAllotEdit
                businessOne={this.props.businessOne}
                onSaveAndClose={this.onSaveAndClose}
                onCancel={this.onCancel}
            />
        );
    };

    //报价
    onSendClick = ()=>{
        // let {navAddTab, navReplaceTab} =this.props;
        // apiForm(API_FOODING_ERP, '/receiveenquiry/sendQuotation', { // /nooquotation/sendQuotation
        //     billId: this.props.billId
        // }, ({data}) => {
        //     // this.props.refreshDetail('one');
        //     navReplaceTab({name:i18n.t(200032/*编辑发出的报价*/),component:i18n.t(200032/*编辑发出的报价*/),url:'/sendquotation/edit'});
        //     this.props.router.push({pathname: '/sendquotation/edit', query: {id: data}});
        // }, error => {
        //     errorTips(error.message);
        // })
        this.props.openDialog(i18n.t(200116/*报价*/),
            <QuotProDialog
                businessOne={this.props.businessOne}
                onSaveAndClose={this.onSendSaveAndClose}
                onCancel={this.onCancel}
                updateQuot={false}
            />,
            "90%"
        );
    };

    //报价 保存并关闭按钮
    onSendSaveAndClose = () => {
      this.props.onSendSaveAndClose && this.props.onSendSaveAndClose()
    };

    onclickXin() {
        this.setState({
            isShow: !this.state.isShow
        });
    }

    render() {
        const {businessOne, quotData} = this.props;
        let array_name = this.state.navContent;
        return (
            <div className='cdetails'>
                <div className="box1">
                    <div className="touxiang">
                        <div className="tupian"><i className="foddingicon fooding-user_icon"></i></div>
                    </div>
                    <div className="right">
                        <div className="box3">
                            <div className="daima">
                                <p/>
                                <StateShow statusName={businessOne.statusName} status={businessOne.status}/>
                                <span style={{float: 'right'}}>
                                {
                                     quotData && quotData.length == 0?
                                        <i className="foddingicon fooding-quote" style={{fontSize: '16px', marginRight: '20px'}}
                                           title={i18n.t(200116/*报价*/)} onClick={this.onSendClick}/>
                                        : null
                                }
                                </span>
                            </div>
                            <span className="name"><p>{businessOne.no}</p></span>
                        </div>
                        <div className="box4">
                            <div className="flex">
                                <div className="nation"><span>{i18n.t(200017/*有效期至*/)}</span><b>{new Date(businessOne.validityDate).Format('yyyy-MM-dd')}</b></div>
                            </div>
                            <div className="flex">
                                <div className="contact"><span>{i18n.t(200135/*询盘人*/)}</span><b>{businessOne.staffLcName}</b></div>
                            </div>
                            <div className="flex">
                                <div className="source"><span>{i18n.t(100376/*交易条款*/)}</span><b>{businessOne.incotmLcName}</b></div>
                            </div>
                            <div className="flex">
                                <div className="web"><span>{i18n.t(100133/*支付条款*/)}</span><b>{businessOne.payTrmLcName}</b></div>
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
export default NavConnect(LocationConnect(withRouter(ReceivedInquiryDetailsHead)));

//{
//businessOne.status !== 1 && !businessOne.saleId?
//<i className="foddingicon fooding-information2" style={{fontSize: '16px', marginRight: '20px'}}
//title={i18n.t(100446/*分配*/)} onClick={this.releseClick}/>: null
//}
//</span>

