import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_ERP,
    API_FOODING_DS,
    language,
    pageSize,
    sizeList
} from '../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from '../../../../components/ServiceTips';

import {I18n} from '../../../../lib/i18n';

//出现导航条 行数
const singleNav = obj => {
    let NavList = []; //导航栏为空数组
    let object = obj;
    let i = 0;
    for (; object.parent;) {
        NavList.unshift({name: object.localName, id: object.id, len: i});
        object = object.parent;
        i++;
    }
    if (object) {
        NavList.unshift({name: object.localName, id: object.id, len: -2});
    }
    return NavList;
};

class EnterprisePlatEnter extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.state = this.initState();
    }

    initState() {
        return {
            dataTree: [],
            dataSingleTree: {}, //某一个分类里面的产品
            isHome: true, //表示是首页
            navObj: {}
        }
        this.title = "";
    }

    //点击进入详情
    onEnterClick = data => {
        let {navAddTab, navRemoveTab} = this.props;
        navRemoveTab({
            name: i18n.t(200547/*企业平台产品列表*/),
            component: i18n.t(200547/*企业平台产品列表*/),
            url: '/enterprise/platproduct/list'
        });
        navAddTab({
            name: i18n.t(200547/*企业平台产品列表*/),
            component: i18n.t(200547/*企业平台产品列表*/),
            url: '/enterprise/platproduct/list'
        });
        this.props.router.push({
            pathname: '/enterprise/platproduct/list',
            query: {id: data.id, name: encodeURIComponent(data.localName)}
        });
    };

    //点击进入下一个
    onNextClick = data => {
        this.title = data.localName;
        this.getPages(data.id);
        this.getInitNav(data.id);
    };

    //导航条点击
    onNavLink = obj => {
        if (obj.len == -2) {
            this.initObjList();
            this.getInitNav(obj.id);
        } else {
            this.getPages(obj.id);
            this.getInitNav(obj.id);
            this.title = obj.name;
        }
    };

    handleResize = height => {
        let sch = document.body.offsetHeight - 100 - height;
        let scroll = sch - 140;
        this.setState({scrollHeight: sch + 'px'})
    };
    //初始化数据
    initObjList = () => {
        let that = this;
        apiGet(API_FOODING_DS, "/dataMulDiv2/getAllDataTree", {}, response => {
            that.setState({
                dataTree: response.data || [],
                isHome:true
            })
        }, error => ServiceTips({text: error.message, type: 'error'}))
    };

    //拉取数据 根据导航条
    getPages = id => {
        apiGet(API_FOODING_DS, "/fc/portal/dataMulDiv2/getTree", {id: id}, (response) => {
            this.setState({
                dataSingleTree: response.data || [],
                isHome: false
            })
        }, error => {
            ServiceTips({text: error.message, type: 'error'});
        });
    };

    //拉取导航栏
    getInitNav = dataMulDiv2Id => {
        let that = this;
        apiGet(API_FOODING_DS, "/fc/portal/dataMulDiv2/getNav", {dataMulDiv2Id: dataMulDiv2Id}, response => {
            let navObj = response.data || {};
            that.setState({navObj});
        }, error => {
            ServiceTips({text: error.message, type: 'error'})
        })
    };

    componentDidMount() {
        this.initObjList();
        this.getInitNav("57737953a672301cb5de734b");
        window.addEventListener('resize', this.handleResize(0));
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }

    componentWillReceiveProps(nextProps) {
        window.addEventListener('resize', this.handleResize(0));
    }

    render() {
        let {isHome, dataSingleTree, dataTree, navObj} = this.state;
        dataSingleTree.dataMulDiv2s = dataSingleTree.dataMulDiv2s || [];
        dataSingleTree.mtlTypes = dataSingleTree.mtlTypes || [];

        let List = singleNav(navObj);
        let dom = List.map((e, i) => {
            return i === List.length - 1 ?
                (<span key={i} className={"enterplatenter1-content-advice-navheader-single"}><a
                    className={"enterplatenter1-content-advice-navheader-single-link"}
                    onClick={this.onNavLink.bind(this, e)}>{e.name}</a></span>)
                :
                (<span key={i}><a className={"enterplatenter1-content-advice-navheader-single-link"}
                                  onClick={this.onNavLink.bind(this, e)}>{e.name}</a>&nbsp;&nbsp;
                    <span>{">"}</span>&nbsp;&nbsp;</span>)
        });

        return (
            <div className={'enterplatenter1'}>
                <div className={'enterplatenter1-content'} style={{height: this.state.scrollHeight}}>
                    <div className={'enterplatenter1-content-advice'}>
                        <div className={"enterplatenter1-content-advice-navheader"}>
                            {dom}
                        </div>
                    </div>
                    {
                        isHome ? dataTree.map((e, i) => {
                            return (<div className={"enterplatenter1-content-detail line-0"} key={'aaa' + i}>
                                <div className={"type-total"}>
                                    &bull;     {e.localName}
                                </div>
                                {e.children && e.children.map((da, di) => {
                                    return (<h3 key={di} className={'enterplatenter1-content-detail-single'}><span
                                        className={"enterplatenter1-content-detail-single-click"}
                                        onClick={this.onNextClick.bind(this, da)}>{da.localName}</span></h3>)
                                })}
                            </div>)
                        }) : <div className={"enterplatenter1-content-detail line-0"}>
                            <div className={"type-total"}>
                                &bull;     {this.title}
                            </div>
                            {
                                dataSingleTree.dataMulDiv2s && dataSingleTree.dataMulDiv2s.length > 0 ?
                                    dataSingleTree.dataMulDiv2s.map((da, di) => {
                                        return (<h3 key={di} className={'enterplatenter1-content-detail-single'}><span
                                            className={"enterplatenter1-content-detail-single-click"}
                                            onClick={this.onNextClick.bind(this, da)}>{da.localName}</span></h3>)
                                    }) :
                                    dataSingleTree.mtlTypes.map((da, di) => {
                                        return (<h3 key={di} className={'enterplatenter1-content-detail-single'}><span
                                            className={"enterplatenter1-content-detail-single-click"}
                                            onClick={this.onEnterClick.bind(this, da)}>{da.localName}</span></h3>)
                                    })
                            }
                        </div>
                    }
                </div>
            </div>)
    }
}

export default NavConnect(EnterprisePlatEnter);