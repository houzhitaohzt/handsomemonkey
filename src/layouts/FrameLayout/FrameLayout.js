import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Header from '../../components/Header';
import './FrameLayout.less';
import '../../styles/core.less';
import {emitter} from '../../common/EventEmitter';
import {INDEX_ID, INDEX_URL} from '../../components/NavigateTabs/modules/tabs';
import moment from 'moment';
import IQFrame from './IQFrame';
import Loading from '../../components/Loading';
import i18n from '../../lib/i18n';
import Im from '../../routes/Im';

export default class FrameLayout extends Component {

    static propTypes = {
        children: React.PropTypes.element.isRequired
    };
    constructor(props) {
        super(props);
        let routerMap = new Map();
        let path = props.location.pathname;
        routerMap.set(path, {
            component: props.children,
            location: props.location
        });
        this.state = {
            loading: true,
            refreshTime: 0,
            routerMap: routerMap,
        };
        this.frameRefresh = false;
    }

    onTabItemsRefresh = tabsItem => {
        let {url} = tabsItem;
        let {routerMap} = this.state;
        if(routerMap.has(url)){
            this.frameRefresh = true;
        }
    };

    onTabItemsRemove = tabsItem => {
        let {url} = tabsItem;
        let {routerMap} = this.state;
        if(routerMap.has(url)){
            routerMap.delete(url);
        }
        this.setState({routerMap});
    };

    onTabItemsRemoveOther = tabsItem => {
        let {url} = tabsItem;
        let {routerMap} = this.state;
        let keys = routerMap.keys();
        for (let name of keys){
            if (name !== url && name !== INDEX_URL){
                routerMap.delete(name);
            }
        }
        this.setState({routerMap: routerMap});
    };

    onTabItemsRemoveAll = () => {
        let {routerMap} = this.state;

        if(routerMap.has(INDEX_URL)){
            let indexRouter = routerMap.get(INDEX_URL);
            routerMap.clear();
            routerMap.set(INDEX_URL, indexRouter);
        } else {
            routerMap.clear();
        }
        this.setState({routerMap});
    };

    refreshChildren = ()=>{
        if( !this.state.loading) {
            this.setState({loading: true}, ()=> {
                this.setState({loading: false});
            });
        } else {
            this.setState({loading: false});
        }
    };

    componentDidMount() {
        i18n.on(this.refreshChildren);
        this.printRenderTime();
        emitter.on("NavigateTabsItemRemove", this.onTabItemsRemove);
        emitter.on("NavigateTabsItemRemoveOther", this.onTabItemsRemoveOther);
        emitter.on("NavigateTabsItemRemoveAll", this.onTabItemsRemoveAll);
        emitter.on("NavigateTabsItemRefresh", this.onTabItemsRefresh);
    };

    componentWillUnmount() {
        i18n.off(this.refreshChildren);
        emitter.off("NavigateTabsItemRemove", this.onTabItemsRemove);
        emitter.off("NavigateTabsItemRemoveOther", this.onTabItemsRemoveOther);
        emitter.off("NavigateTabsItemRemoveAll", this.onTabItemsRemoveAll);
        emitter.off("NavigateTabsItemRefresh", this.onTabItemsRefresh);
    }

    componentWillReceiveProps(props) {

        if(props.children !== this.props.children){
            let {routerMap, refreshTime} = this.state;

            let location = props.location, localState = location.state || {refresh: undefined};
            let oldRouter = routerMap.get(location.pathname) || {location: {}};
            routerMap.set(location.pathname, {
                component: props.children,
                location: location
            });
            let refresh = localState.refresh !== false && oldRouter.location.search !== location.search;
            if(localState.refresh === true) refresh = true;

            refreshTime = (refresh || this.frameRefresh) ? Date.now(): refreshTime;
            this.setState({routerMap, refreshTime});
            this.frameRefresh = false;

            //TODO 为了删除 location state
            sessionStorage.removeItem("@@History/"+location.key);
        }
    }

    printRenderTime(){
        let dt = Date.now() - this.beginTime;
        let color = dt >= 100? 'color: red': 'color: blue';
        console.log('%c本次渲染时间(s): ' + moment(dt).format('s.SSS'), color);
    }

    componentWillMount(){
        this.beginTime = Date.now();
    }

    componentWillUpdate() {
        this.beginTime = Date.now();
    }

    componentDidUpdate() {
        this.printRenderTime();
    }

    render() {
        const {routerMap, refreshTime} = this.state;
        const {location} = this.props;
        let component = [];
        for(let [key, value] of routerMap.entries()){
            component.push(
                <IQFrame visible={key === location.pathname} refreshTime={refreshTime} key={key}>{value.component}</IQFrame>
            );
        }
        return (
            <div className='container-body'>
                {
                    this.state.loading? null:
                        [
                            <Im key={'im'}/>,
                            <Header key="header"/>,
                            component
                        ]
                }
            </div>
        );
    }
}
