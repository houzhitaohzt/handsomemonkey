import React, {Component} from 'react';
import {browserHistory, withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import ColorSelect from "../../../../components/Table/ColorColumn";
import xt from '../../../../common/xt';
//引入ajax请求
import {webInit, API_FOODING_DS, apiForm, permissionsBtn, API_FOODING_ERP} from "../../../../services/apiCall";
import ServiceTips, {errorTips} from '../../../../components/ServiceTips';

import {I18n} from '../../../../lib/i18n';
//引入提示
import Tooltip from 'antd/lib/tooltip';
import FormerNameDailog from "../FormerName/FormerNameDialog";
import i18n from "../../../../lib/i18n";
import Confirm from "../../../../components/Dialog/Confirm";
import Dialog from "../../../../components/Dialog/Dialog";


// 切换 tab
function getActiveTab(pathname, navTabs) {
    let currents, activeTab = {};
    currents = navTabs.filter((item, index) => (item.url.indexOf(pathname) !== -1));
    if (currents && currents.length > 0) {
        activeTab = currents[0];
    }
    return activeTab;
}

    export class CDetailsHead extends React.PureComponent {
    constructor(props) {
        super(props);
        this.array = [];
        let urlName = props.params.name;
        let navTabs = [
            {name: I18n.t(100097/*详情*/), url: '/client/detail/' + urlName, id: 'detail',isLoading:false},
            {name: I18n.t(100350/*关注产品*/), url: '/client/product/' + urlName, id: 'product',isLoading:false},
            {name:I18n.t(500202/*最新价格*/), url: '/client/prices/' + urlName, id: 'prices',isLoading:false},
            {name: I18n.t(100370/*联系人*/), url: '/client/linkman/' + urlName, id: 'linkman', dataTyId: 100,isLoading:false},
            {name: I18n.t(500430/*关系企业*/), url: '/client/enterprise/' + urlName, id: 'enterprise',isLoading:false},
            {name: I18n.t(100321/*商机*/), url: '/client/business/' + urlName, id: 'business',isLoading:false},
            {name: I18n.t(100582/*样品单*/), url: '/client/sample-list/' + urlName, id: 'sampleList',isLoading:false},
            {name: I18n.t(100583/*报价单*/), url: '/client/price/' + urlName, id: 'salePrices',isLoading:false},
            {name: I18n.t(100324/*订单*/), url: '/client/order/' + urlName, id: 'order',isLoading:false},
            {name: I18n.t(100585/*市场活动响应*/), url: '/client/activity/' + urlName, id: 'activity',isLoading:false},
            {name: I18n.t(100586/*邮件*/), url: '/client/email/' + urlName, id: 'email',isLoading:false},
            {name: I18n.t(300081/*群发邮件*/), url: '/client/massemail/' + urlName, id: 'massEmail',isLoading:false},
            {name: I18n.t(100587/*约会*/), url: '/client/date/' + urlName, id: 'date',isLoading:false},
            {name: I18n.t(100588/*联络*/), url: '/client/contact/' + urlName, id: 'contact',isLoading:false},
            {name: I18n.t(100136/*附件*/), url: '/client/accessory/' + urlName, id: 'accessory',isLoading:false},
            {name: I18n.t(100148/*注释*/), url: '/client/annotation/' + urlName, id: 'annotation',isLoading:false},
            {name: I18n.t(100311/*客户*/), url: '/client/client/' + urlName, id: 'client',isLoading:false},
            {name: I18n.t(100449/*竞争对手*/), url: '/client/contender/' + urlName, id: 'contender',isLoading:false},
            {name: I18n.t(300083/*组织关系*/), url: '/client/organizational/' + urlName, id: 'organizational',isLoading:false},
            {name:I18n.t(600212/*海关数据*/), url: '/client/detail/' + urlName, id: 'customs',isLoading:false}

        ];

        // let activeTabId = getActiveTab(props.location.pathname, navTabs);
        this.state = {
            visible: false, isUp: false,
            isShow: false,
            navContent: navTabs,
            activeTab: this.props.curentId,
            dialogTitle:"",
            dialogContent:<div></div>
        };
        this.onClickLink = this.onClickLink.bind(this);
        this.onStarClick = this.onStarClick.bind(this);
        this.savePrefers = this.savePrefers.bind(this);
    }

    onClickLink(e, v) {
        this.props.onClickLink({id:v.id, dataTyId: v.dataTyId,activeTab:this.state.activeTab,isLoading:v.isLoading});
        let navContent = this.state.navContent;
        navContent[e].isLoading = true;
        this.setState({
            activeTab:v.id,
            navContent:navContent
        });
        let tab = {id: this.props.navigate.currentTab, url: v.url};
        // this.props.updateTab(tab);

        // browserHistory.push({pathname: v.url, query: {id: this.props.location.query.id, dataTyId: v.dataTyId}});
    }

    componentWillReceiveProps(nextProps) {
        if( nextProps.location.pathname === this.props.location.pathname &&
            nextProps.location.query.index !== this.props.location.query.index){
            let activeTab = getActiveTab(nextProps.location.query.index, this.state.navContent);
            activeTab.id && this.setState({ activeTab: activeTab.id });
        }
    }

    componentDidMount() {
        let activeTab = getActiveTab(this.props.location.query.index, this.state.navContent);
        if(activeTab.id){
            this.setState({ activeTab: activeTab.id });
            this.props.onClickLink({id:activeTab.id, dataTyId: activeTab.dataTyId,activeTab: this.state.activeTab, isLoading:activeTab.isLoading});
        }
        /*
        let activeId= getActiveTab(this.props.location.pathname,this.state.navContent);
        this.setState({activeTab:activeId});
        */
    }

    //颜色分类
    savePrefers = (color) => {
        let that = this;
        let {value} = this.props;
        let params = {custId: value.id, colorType: color, optlock: value.optlock, followMark: value.followMark};
        apiForm(API_FOODING_DS, '/customer/savePrefers', params, response => {
            ServiceTips({text: response.message, type: 'success'})
            that.props.getDetailData();
        }, error => {
            ServiceTips({text: error.message, type: 'error'});
        });
    };

    //五角星选中与补选中的状态
    onStarClick = () => {

        let that = this;
        let {value} = this.props;
        let params = {custId: value.id, colorType: value.colorType, optlock: value.optlock, followMark: !value.followMark};
        apiForm(API_FOODING_DS, '/customer/savePrefers', params, response => {
            ServiceTips({text: response.message, type: 'success'})
            that.props.getDetailData();
        }, error => {
            ServiceTips({text: error.message, type: 'error'});
        });
    };
    shouldComponentUpdate(props, state) {
        return xt.equalsObject(state, this.state)
            || props.value !== this.props.value
            || props.id !== this.props.id;
    }
    enableClick=()=>{
        var data = this.props.value;
        var that = this;
        Confirm(i18n.t(100436/*是否对该条数据激活？*/), {
            done: () => {
                //表示是激活
                apiForm(API_FOODING_DS,'/customer/enable',{id:data.id,optlock:data.optlock},(response)=>{
                    ServiceTips({text:response.message,type:'sucess'});
                    that.props.getDetailData();
                },(error)=>{
                    ServiceTips({text:error.message,type:'error'})
                })
            }
        });
    }
    disableClick=()=>{
        var data = this.props.value;
        var that = this;
        Confirm(i18n.t(100435/*是否对该条数据失效？*/), {
            done: () => {
                //表示是失效
                apiForm(API_FOODING_DS,'/customer/disable',{id:data.id,optlock:data.optlock},(response)=>{
                    ServiceTips({text:response.message,type:'sucess'});
                    that.props.getDetailData();
                },(error)=>{
                    ServiceTips({text:error.message,type:'error'})
                })
            }
        });
    }

    // 发送邮件
    sendMailHandle = () => {

        let {value={}} = this.props;
        let content = require('../../../Common_confirm/sendlinkTpl').default;
        let element = React.createElement(content, {
            active:'client',
            getOne: value,
            onCancel: this.onCancal,
        });

        this.setState({
            showDialog:true,
            title: I18n.t(600315/*选择收件人*/),
            dialogContent: element,
            showHeader:false
        }); 
    }

    onCancal = () => {
        this.setState({showDialog:false})
    }

    confirmClick = () => {

    }



    render() {
        //从cDetailsLayout 传过来的数据
        let {value = {}} = this.props;
        let array_name = this.state.navContent;
        let common =<div></div>;

        // let cuurntTab = getActiveTab(this.props.location.pathname, this.state.navContent);
        return (
            <div className='cdetails' style={{zIndex:22}}>
                <div className="box1">
                    <div className="touxiang">
                        <div className="tupian"><i className="foddingicon fooding-user_icon"></i></div>
                    </div>
                    <div className="right">
                        <div className="box3">
                            <div className="daima"><p>{value.code}</p><ColorSelect dataIndex={'colorType'} onSelect={this.savePrefers} value={value.colorType}/>
                                <span className={value.followMark ? 'glyphicon glyphicon-star' : 'glyphicon glyphicon-star-empty'} onClick={this.onStarClick}> </span>
                                <span style={{float:'right'}}>
									{common}
                                    { value.irowSts.id==5 || value.irowSts.id==20?<i className="foddingicon fooding-start" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(100453/*启用*/)} onClick={this.enableClick} ></i>:''}
                                    { value.irowSts.id==10?<i className="foddingicon fooding-shixiao" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(100441/*失效*/)} onClick={this.disableClick} ></i>:''}

                                    { permissionsBtn('clien.add') && 1 ? <i className="foddingicon fooding-write-mail-new" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(200256/*发邮件*/)} onClick={this.sendMailHandle} ></i> : ''}

                                    
                                </span>
                            </div>
                            <span className="name"><p>{value.localName}</p>
                            <Tooltip
                                placement="right"
                                mouseEnterDelay={0.5}
                                arrowPointAtCenter={true}
                                mouseLeaveDelay={0.2}
                                prefixCls="card-toolip"
                                overlay={<FormerNameDailog sourceId={this.props.location.query.id} />}
                            >
                                <i className="foddingicon fooding-bm-icon" style={{cursor:"pointer"}}></i>
                            </Tooltip>
                            </span>
                        </div>
                        <div className="box4">
                            <div className="flex">
                                <div className="nation"><span>{I18n.t(100087/*国家*/)}/{I18n.t(100091/*地区*/)}</span><b>{value.country}</b></div>
                            </div>
                            <div className="flex">
                                <div className="contact"><span>{I18n.t(100372/*主联系人*/)}</span><b>{value.defaultContact&&value.defaultContact.localName?value.defaultContact.localName:""}</b></div>
                            </div>
                            <div className="flex">
                                <div className="source"><span>{I18n.t(100362/*客户来源*/)}</span><b>{value.source}</b></div>
                            </div>
                            <div className="flex">
                                <div className="web"><span>{I18n.t(100371/*网站*/)}</span><a href={webInit(value.defaultWeb)} target="_blank"><b title={value.defaultWeb}>{value.defaultWeb}</b></a></div>
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
                <Dialog showHeader={true} width={926} showHeader={true} visible={this.state.showDialog} title={this.state.title}>
                    {this.state.dialogContent}
                </Dialog>
            </div>
        );
    }
}

export default LocationConnect(withRouter(CDetailsHead));

