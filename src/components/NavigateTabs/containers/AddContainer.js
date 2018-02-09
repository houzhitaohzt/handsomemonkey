import {connect} from 'react-redux'
import {navAddTab, save, navRemoveTab, navReplaceAllTab, navRefreshTab, navReplaceTab, INDEX_URL} from '../modules/tabs'
import {emitter} from '../../../common/EventEmitter';
import {browserHistory} from 'react-router';

const onPush = location => {
    let search = location.search ? location.search : '';
    browserHistory.push(location.url + search);
};

const mapDispatchToProps = {

    isVisible: function (tabs, location){
        return (dispatch, getState) => {
            const {navigate} = getState();
            const currentTab = navigate.currentTab;
            const pathname = location.pathname;
            // console.log(pathname, currentTab, tabs);
            return !!~tabs.findIndex(da => da.id === currentTab);
        }
    },

    navAddTab: function (tab) {
    	emitter.emit("NavigateTabsItemAdd", tab);
        return (dispatch, getState) => {
            dispatch(navAddTab(tab));
        }
    },

    navReplaceTab: tab => {
        return (dispatch, getState) => {
        	let state = getState();
            let lastTab = state.navigate.tabs.find(tb => tb.id === state.navigate.currentTab);
            lastTab && emitter.emit("NavigateTabsItemRemove", lastTab);
            dispatch(navReplaceTab(tab));
        }
    },

    navRemoveTab: function(tab) {
        return (dispatch, getState) => {
            let state = getState();
            let nTab = state.navigate.tabs.find(tb => tb.name === tab.name && tb.url === tab.url);
            if (nTab){
                emitter.emit("NavigateTabsItemRemove", nTab);
                dispatch(navRemoveTab(nTab));
            }
        }
    },

    navCloseCurrentTab: () => {
        return (dispatch, getState) => {
            let state = getState();
            let index = state.navigate.tabs.findIndex(tb => tb.id === state.navigate.currentTab);
            if (index !== -1) {
                let tab = state.navigate.tabs[index];
                emitter.emit("NavigateTabsItemRemove", tab);
                dispatch(navRemoveTab(tab));
            }
            if (index <= 1) browserHistory.push(INDEX_URL);
            else return onPush(state.navigate.tabs[index - 1]);
        };
    },

    navRemoveCurrentTab: () => {
        return (dispatch, getState) => {
            let state = getState();
            let tab = state.navigate.tabs.find(tb => tb.id === state.navigate.currentTab);
            if (tab){
		        emitter.emit("NavigateTabsItemRemove", tab);
		        dispatch(navRemoveTab(tab));
            }
        }
    },

    navRefreshCurrentTab: () => {
        return (dispatch, getState) => {
            let state = getState();
            let tab = state.navigate.tabs.find(tb => tb.id === state.navigate.currentTab);
            if (tab){
				emitter.emit("NavigateTabsItemRefresh", tab);
				dispatch(navRefreshTab(tab));
            }
        }
    },

    navReplaceAllTabs: (tabs, currentTab) => {
        return (dispatch, getState) => {
            emitter.emit("NavigateTabsItemRemoveAll");
            dispatch(navReplaceAllTab(tabs, currentTab));
        }
    },

    saveState: function (key, data) {
        return (dispatch, getState) => {
            dispatch(save(key, data));
        }
    }
};

const mapStateToProps = function (state) {
    return {
        tabs: state.navigate.tabs,
        currentTab: state.navigate.currentTab,
        stateMaps: state.stateMaps
    }
};

export default connect(mapStateToProps, mapDispatchToProps);
