import i18n from './../../../../lib/i18n';
import React, {Component} from "react";
import {browserHistory, withRouter} from "react-router";
import LocationConnect from "../../../../components/location/Container";
import ColorSelect from "../../../../components/Table/ColorColumn";
import NavConnect from "../../../../components/NavigateTabs/containers/AddContainer";
import Confirm from "../../../../components/Dialog/Confirm";
import {API_FOODING_ERP, apiForm, permissionsBtn} from "../../../../services/apiCall";
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import xt from '../../../../common/xt';

function getActiveTab(pathname, navTabs) {
    let currents, activeTab = {};
    currents = navTabs.filter((item, index) => (item.url.indexOf(pathname) !== -1));
    if (currents && currents.length > 0) {
        activeTab = currents[0];
    }
    return activeTab;
}

export class BODetailHeader extends Component {
    constructor(props) {
        super(props);
        this.array = [];
        let urlName = props.params.name || props.location.query.id;
        let navTabs = [
            {name: i18n.t(100097/*详情*/), url: '/businessOpportunity/detail/' + urlName, id: 'detail',isLoading:false},
            {name: i18n.t(200236/*样品*/), url: '/businessOpportunity/sample/' + urlName, id: 'sample',isLoading:false},
            {name: i18n.t(200116/*报价*/), url: '/businessOpportunity/price/' + urlName, id: 'price',isLoading:false},
            {name: i18n.t(200237/*销售订单*/), url: '/businessOpportunity/salesOrder/' + urlName, id: 'salesOrder',isLoading:false},
            {name: i18n.t(100586/*邮件*/), url: '/businessOpportunity/email/' + urlName, id: 'email',isLoading:false},
            {name: i18n.t(100588/*联络*/), url: '/businessOpportunity/contact/' + urlName, id: 'contact',isLoading:false},
            {name: i18n.t(100587/*约会*/), url: '/businessOpportunity/date/' + urlName, id: 'date',isLoading:false},
            {name: i18n.t(100136/*附件*/), url: '/businessOpportunity/accessory/' + urlName, id: 'accessory',isLoading:false},
            {name: i18n.t(100148/*注释*/), url: '/businessOpportunity/annotation/' + urlName, id: 'annotation',isLoading:false},

        ];
        // let activeTabId = getActiveTab(props.location.pathname, navTabs);
        this.state = {
            visible: false, isUp: false, activeTab:this.props.curentId,
            isShow: false,
            color: '',
            navContent: navTabs
        };
        this.onClickLink = this.onClickLink.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onclickXin = this.onclickXin.bind(this);
        this.getProduct =this.getProduct.bind(this);
        //this.createSaleOffer = this.createSpecimen.bind(this);
    }

    onItemClick() {
        // this.setState({
        //     isUp: !this.state.isUp
        // });
        // if (this.state.isUp) {
        //     this.props.onPackUp(226);
        // } else {
        //     this.props.onPackUp(173);
        // }
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
        // let {businessOne}=this.props;
        // console.log(businessOne);
        // browserHistory.push({pathname:v.url,query:{id:this.props.location.query.id,no:businessOne.no}});
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        let state = {};
        if( nextProps.location.pathname === this.props.location.pathname &&
            nextProps.location.query.index !== this.props.location.query.index){
            let activeTab = getActiveTab(nextProps.location.query.index, this.state.navContent);
            if(activeTab.id){
                state.activeTab = activeTab.id;
            }
        }

        if(nextProps.businessOne.followMark !== this.props.businessOne.followMark){
            state.isShow = nextProps.businessOne.followMark;
        }
        this.setState({...state});
    }

    componentDidMount() {
        // let activeId = getActiveTab(this.props.location.pathname, this.state.navContent);
        // this.setState({activeTab: activeId});

        let activeTab = getActiveTab(this.props.location.query.index, this.state.navContent);
        if(activeTab.id){
            this.setState({ activeTab: activeTab.id });
            this.props.onClickLink({id:activeTab.id, dataTyId: activeTab.dataTyId,activeTab: this.state.activeTab, isLoading:activeTab.isLoading});
        }
    }

    onclickXin() {
        let isShow = !this.state.isShow;
        this.setState({isShow});
        this.saveStats(isShow);
    }

    saveColors = color => {
        this.setState({color});
        let params = {billId: this.props.businessOne.billId, billType: 301, color: color};
        apiForm(API_FOODING_ERP, '/userprefer/setcolor', params, response => {
            successTips(response.message);
        }, error => {
            errorTips(error.message)
        });
    };

    saveStats = mark => {
        let params = {billId: this.props.businessOne.billId, billType: 301, mark: mark};
        apiForm(API_FOODING_ERP, '/userprefer/setmark', params, response => {
            successTips(response.message);
        }, error => {
            errorTips(error.message)
        });
    };

    onReStart = () => {
        let billId = this.props.businessOne.billId;
        apiForm(API_FOODING_ERP, '/business/restart', {billId},
            response => {
                successTips(response.message);
                this.props.comp.refreshDetail();
            }, error => {
                errorTips(error.message);
            })
    };


    /**
     * 生成样品单
     */
    createSpecimen = ()=>{
        let rowData = [];
        if(this.props.comp.product) rowData = this.props.comp.product.dataTable.getSelectArr();
        let msg = i18n.t(201267/*是否把所有的产品数据生成销售样品单?*/);
        let billMtlIds = [];
        if( rowData.length) {
            msg = i18n.t(201268/*是否把选中的 %s条 产品数据生成销售样品单?*/, rowData.length);
            billMtlIds = rowData.map(da => da.billDtlId);
           Confirm(msg, {
            done: ()=> {
                let params = {billMtlIds};
                apiForm(API_FOODING_ERP, '/business/createSpecimen', params,
                    ({data}) => {
                        let {navReplaceTab} = this.props;
                        navReplaceTab({name:i18n.t(200182/*编辑销售样品单*/),component:i18n.t(200182/*编辑销售样品单*/),url:'/samporder/edit'});
                        this.props.router.push({pathname: '/samporder/edit', query: {id: data}});
                    }, error => {
                        errorTips(error.message)
                    });
            }
        }); 
        }else{
            Confirm(msg, {
            done: ()=> {
                let params = {billId: this.props.businessOne.billId};
                apiForm(API_FOODING_ERP, '/business/createSpecimen', params,
                    ({data}) => {
                        let {navReplaceTab} = this.props;
                        navReplaceTab({name:i18n.t(200182/*编辑销售样品单*/),component:i18n.t(200182/*编辑销售样品单*/),url:'/samporder/edit'});
                        this.props.router.push({pathname: '/samporder/edit', query: {id: data}});
                    }, error => {
                        errorTips(error.message)
                    });
            }
        }); 

        }
        
    };
    getProduct(){
      return this.product.dataTable.getSelectArr();
    }
    /**
     * 生成销售报价
     */
    createSaleOffer = ()=>{
        let rowData = [];
        if(this.props.comp.product) rowData = this.props.comp.product.dataTable.getSelectArr();
        let msg = i18n.t(201269/*是否把所有的产品数据生成销售报价?*/);
        let billMtlIds = [];
        if( rowData.length) {
            msg = i18n.t(201270/*是否把选中的 %s条 产品数据生成销售报价?*/, rowData.length);
            billMtlIds = rowData.map(da => da.billDtlId);
            Confirm(msg, {
            done: ()=> {
                let params = {billMtlIds};
                apiForm(API_FOODING_ERP, '/business/createSaleOffer', params,
                    response => {
                        let {navReplaceTab} = this.props;
                        navReplaceTab({name:i18n.t(200238/*销售报价编辑*/),component:i18n.t(200238/*销售报价编辑*/),url:'/quotation/addedit'});
                        this.props.router.push({pathname: '/quotation/addedit', query: {id: response.data}});
                    }, error => {
                        errorTips(error.message)
                    });
            }
        });
        }else{
          Confirm(msg, {
            done: ()=> {
                let params = {billId: this.props.businessOne.billId};
                apiForm(API_FOODING_ERP, '/business/createSaleOffer', params,
                    response => {
                        let {navReplaceTab} = this.props;
                        navReplaceTab({name:i18n.t(200238/*销售报价编辑*/),component:i18n.t(200238/*销售报价编辑*/),url:'/quotation/addedit'});
                        this.props.router.push({pathname: '/quotation/addedit', query: {id: response.data}});
                    }, error => {
                        errorTips(error.message)
                    });
            }
        });  
        }
        
    };
    onEditDetail = ()=> {
        let {navReplaceTab, businessOne, navRemoveTab} = this.props;
        let name = i18n.t(201273/*编辑商机*/) + '(' + businessOne.no + ")";
        navReplaceTab({name,component:name,url:'/businessOpportunity/edit/' + businessOne.billId});
        this.props.router.push({ pathname: '/businessOpportunity/edit/' + businessOne.billId, query: {id: businessOne.billId,no:businessOne.no}});
    };

    render() {
        let {businessOne} = this.props;
        let array_name = this.state.navContent;
        let colorDom = <ColorSelect onSelect={this.saveColors} value={this.state.color || businessOne.color}/>;
        if (this.state.isUp) {
            return (
                <div className='cdetail'>
                    <div className="box5">
                        <div className="top">
                            <div className="box6">
                                <div className="name">
                                    <p>{businessOne.salBeLcName}</p>
                                    <i className="foddingicon fooding-bm-icon"/>
                                </div>
                                <div className="daima">
                                    <p>{businessOne.no}</p>
                                    {colorDom}
                                    <span className={this.state.isShow ? 'glyphicon glyphicon-star' : 'glyphicon glyphicon-star-empty'} onClick={this.onclickXin}></span>
                                </div>
                                <div className="gery">
                                    <div className="flex">
                                        <div className="nation">
                                            <span>{i18n.t(100304/*主题*/)}</span>
                                            <b>{businessOne.theme}</b>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="contact">
                                            <span>{i18n.t(100370/*联系人*/)}</span>
                                            <b>{businessOne.bizLinkLcName}</b>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="source">
                                            <span>{i18n.t(100323/*业务日期*/)}</span>
                                            <b>{new Date(businessOne.billDate).Format('yyyy-MM-dd')}</b>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="web">
                                            <span>{i18n.t(200240/*预计收入*/)}</span>
                                            <b>{businessOne.expInAmt} {businessOne.cnyLcName}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <ul className="box2">
                        {
                            array_name.map((item, i) => {
                                return (<li key={i}><a onClick={() => this.onClickLink(i, item)}
                                                       className={this.state.activeTab == item.id ? 'heghtL' : ''}>{item.name}</a></li>);
                            })
                        }
                        <li style={{position: 'absolute', right: 10}}><a><span>
                            <i onClick={this.onItemClick} className={this.state.isUp ? "foddingicon fooding-up_icon" : "foddingicon fooding-pull_down_icon"}/></span></a>
                        </li>

                    </ul>
                </div>
            );
        } else {

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
                                    {colorDom}
                                    <span className={this.state.isShow ? 'glyphicon glyphicon-star' : 'glyphicon glyphicon-star-empty'}
                                          onClick={this.onclickXin}/>
                                    <span className="state"><b>{businessOne.statusName}</b></span>
                                    <div style={{float: 'right'}}>
                                        {
                                            xt.conditionComponents(businessOne, [
                                                {
                                                    visible: permissionsBtn('business.tosample'),
                                                    content: <i key="0" className="foddingicon fooding-approve" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100470/*查看审批*/)} onClick={this.props.comp.onLookApproval}/>
                                                },
                                                {
                                                    visible: permissionsBtn('business.tosample'),
                                                    condition: {key: 'status', value: 20, exp: '!=='},
                                                    content: <i key="1" className="foddingicon fooding-delay-quote" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100582/*样品单*/)} onClick={this.createSpecimen}/>
                                                },
                                                {
                                                    visible: permissionsBtn('business.toffer'),
                                                    condition: {key: 'status', value: 20, exp: '!=='},
                                                    content: <i key="2" className="foddingicon fooding-quote" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200241/*销售报价*/)} onClick={this.createSaleOffer}/>
                                                },
                                                {
                                                    visible: permissionsBtn('business.tosorder'),
                                                    condition: {key: 'status', value: 20, exp: '!=='},
                                                    content: <i key="3" className="foddingicon fooding-creat-order" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200237/*销售订单*/)} onClick={this.props.comp.createSaleOrder}/>
                                                },
                                                {
                                                    visible: permissionsBtn('business.close'),
                                                    condition: [{key: 'status', value: 20, exp: '!=='}, 'and', {key: 'status', value: 15, exp: '==='}],
                                                    content: <i key="4" className="foddingicon fooding-close-two" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100432/*关闭*/)} onClick={this.props.comp.onCloseBusiness}/>
                                                },
                                                {
                                                    visible: permissionsBtn('business.edit'),
                                                    condition: [{key: 'status', value: 20, exp: '!=='}, 'and', {key: 'status', value: 15, exp: '==='}],
                                                    content: <i key="5" className="foddingicon fooding-Edit" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100439/*编辑*/)} onClick={this.onEditDetail}/>
                                                },
                                                {
                                                    visible: permissionsBtn('business.restart'),
                                                    condition: {key: 'status', value: 20, exp: '==='},
                                                    content: <i key="6" className="foddingicon fooding-update" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200242/*重启*/)} onClick={this.onReStart}/>
                                                }
                                            ])
                                        }
                                    </div>
                                </div>
                                <span className="name" style={{cursor:'pointer', display:"inline-block", width:"100%"}} onClick={()=>{
                                    let {navAddTab} = this.props;
                                    let name = i18n.t(100311/*客户*/) + `(${businessOne.salBeLcName})`;
                                    navAddTab({id: 3, name: name, component: name, url: '/client/detail/' + businessOne.salBeId});
                                    this.props.router.push({pathname:'/client/detail/' + businessOne.salBeId,query:{id:businessOne.salBeId}, state: {refresh: true}});
                                }}><p style={{height:"34px"}}>{permissionsBtn('beIdName') ? businessOne.salBeLcName : ""}</p>{permissionsBtn('beIdName') ?<i className="foddingicon fooding-bm-icon"/>:null}</span>
                            </div>
                            <div className="box4">
                                <div className="flex">
                                    <div className="nation"><span>{i18n.t(100304/*主题*/)}</span><b>{businessOne.theme}</b></div>
                                </div>
                                <div className="flex">
                                    <div className="contact"><span>{i18n.t(100370/*联系人*/)}</span><b>{businessOne.bizLinkLcName}</b></div>
                                </div>
                                <div className="flex">
                                    <div className="source"><span>{i18n.t(100323/*业务日期*/)}</span><b>{new Date(businessOne.billDate).Format('yyyy-MM-dd')}</b></div>
                                </div>
                                <div className="flex">
                                    <div className="web"><span>{i18n.t(200240/*预计收入*/)}</span><b>{businessOne.expInAmt} {businessOne.cnyLcName}</b></div>
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
}
export default NavConnect(LocationConnect(withRouter(BODetailHeader)));
