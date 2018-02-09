import React, {Component, PropTypes} from 'react';
import xt from '../../../common/xt';
import WebData from '../../../common/WebData';
import i18n from '../../../lib/i18n';
import uuid from 'uuid';
export const NAV_ADD_TAB = 'NAV_ADD_TAB';
export const NAV_REPLACE_TAB = 'NAV_REPLACE_TAB';
export const NAV_REFRESH_TAB = 'NAV_REFRESH_TAB';
export const NAV_REMOVE_TAB = 'NAV_REMOVE_TAB';
export const NAV_REMOVE_OTHER_TAB = 'NAV_REMOVE_OTHER_TAB';
export const NAV_REMOVE_ALL_TAB = 'NAV_REMOVE_ALL_TAB';
export const NAV_REPLACE_ALL_TAB = 'NAV_REPLACE_ALL_TAB';

export const NAV_TAB_CHANGE = 'NAV_TAB_CHANGE';
export const LOCATION_CHANGE = 'LOCATION_CHANGE';

export const NAV_UPDATE_TAB = 'NAV_UPDATE_TAB';
export const SAVE_STATE = 'SAVE_STATE';
export const UN_DEFINE_TAB_ID = -1;
export const INDEX_ID = 0;
export const INDEX_URL = '/';

export function navTabUpdate(tab) {
    return {
        type: NAV_UPDATE_TAB,
        tab
    }
}

export function navAddTab(tab) {
    return {
        type: NAV_ADD_TAB,
        tab
    }
}

export function navReplaceTab(tab) {
    return {
        type: NAV_REPLACE_TAB,
        tab
    }
}

export function navRefreshTab(tab){
    return {
        type: NAV_REFRESH_TAB,
        tab
    }
}

export function navRemoveTab(tab) {
    return {
        type: NAV_REMOVE_TAB,
        tab
    }
}

export function navRemoveOtherTab(tab) {
    return {
        type: NAV_REMOVE_OTHER_TAB,
        tab
    }
}

export function navRemoveAllTab() {
    return {
        type: NAV_REMOVE_ALL_TAB,
        tab: undefined
    }
}

export function navReplaceAllTab(tabs, currentTab) {
    return {
        type: NAV_REPLACE_ALL_TAB,
        tab: tabs,
        currentTab
    }
}

export function navTabChange(tab) {
    return {
        type: NAV_TAB_CHANGE,
        tab
    }
}
export function save(key, data) {
    let obj = {key: key, data: data}

    return {
        type: SAVE_STATE,
        data: obj
    }
}

const HomeIndexTab = {
    id: INDEX_ID,
    name: '首页',
    component: <i className="foddingicon fooding-home_16"/>,
    url: INDEX_URL,
    search: '',
};
const initialState = {
    tabs: [HomeIndexTab],
    currentTab: INDEX_ID,
    tabsBak: {[INDEX_URL]: HomeIndexTab},
    stateMaps: {}
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [NAV_ADD_TAB]: function (state, action) {
        //最多可以加20个，如果打开的是同一个不添加新的把现有的激活
        let {tabs, tabsBak} = state;
        for (let i = 0; i < tabs.length; i++) {
            if (action.tab.name === tabs[i].name && action.tab.url in tabsBak) {
                let bTab = tabsBak[action.tab.url];
                if(bTab.id !== tabs[i].id) tabs[i] = bTab;
                return {
                    ...state,
                    tabs: tabs,
                    currentTab: bTab.id
                };
            }
        }
        if (tabs.length >= 50) return state;

        action.tab.id = action.tab.id === 0 ? 0 : uuid.v4();
        let index = tabs.findIndex(da => da.id === state.currentTab);
        if(index !== -1) tabs.splice(index + 1, 0, action.tab);
        else tabs.push(action.tab);

        tabsBak[action.tab.url] = action.tab;
        return {
            ...state,
            tabs,
            tabsBak,
            currentTab: action.tab.id
        };
    },
    [NAV_REPLACE_TAB]: function (state, action){
        let lastTab = state.tabs.find(tb => tb.id === state.currentTab);
        let newState = ACTION_HANDLERS[NAV_REMOVE_TAB](state, navRemoveTab(lastTab));
        return ACTION_HANDLERS[NAV_ADD_TAB](newState, action);
    },
    [NAV_REMOVE_TAB]: function (state, action) {
        let {tabs} = state;

        if (tabs.length < 2) {
            return state;
        }
        let newTabs = [];
        let activeIndex = -1;
        tabs.map((e, index) => {
            if (e.id !== action.tab.id) {
                newTabs.push(e);
            } else {
                if (state.currentTab === action.tab.id) {
                    activeIndex = index - 1;
                }
            }
        });
        if (activeIndex > -1) {
            return {
                ...state,
                tabs: newTabs,
                currentTab: tabs[activeIndex].id
            }
        }
        return {
            ...state,
            tabs: newTabs
        }
    },

    [NAV_REMOVE_OTHER_TAB]: (state, action) => {
        let tabs = [HomeIndexTab];
        if(action.tab.id !== INDEX_ID){
            tabs.push(action.tab);
        }
        return { ...state, tabs, currentTab: action.tab.id }
    },

    [NAV_REFRESH_TAB]: function (state, action){
        return { ...state, currentTab: action.tab.id}
    },

    [NAV_REMOVE_ALL_TAB]: function (state, action){
        return {...state, tabs: [HomeIndexTab], currentTab: INDEX_ID}
    },

    [NAV_TAB_CHANGE]: function (state, action) {
        return { ...state, currentTab: action.tab.id}
    },

    [LOCATION_CHANGE]: function (state, action) {
        let {tabs, tabsBak} = state;
        let tab = tabs.find(tb => tb.url === action.payload.pathname);
        if (tab) {
            tab.search = action.payload.search;
            tabsBak[action.payload.pathname] = tab;
            return {...state, tabsBak, currentTab: tab.id}
        } else {
            if (action.payload.pathname in tabsBak){
                tab = tabsBak[action.payload.pathname];
                tab.search = action.payload.search;
                return ACTION_HANDLERS[NAV_ADD_TAB](state, navAddTab(tab));
            }  else {
                // return {...state, currentTab: UN_DEFINE_TAB_ID};
                return state;
            }
         }
    },
    [NAV_UPDATE_TAB]: function (state, action) {
        //action 里tab是个复合对象，即要有原对象，也要有要改变的URL对象
        let {tabs} = state;
        let {tab} = action;
        let newTabs = tabs.map((item, index) => {
            if (item.id === tab.id) {
                item.url = tab.url;
                return item;
            } else {
                return item;
            }
        });
        return {
            ...state,
            tabs: newTabs
        }
    },
    [SAVE_STATE]: function (state, action) {
        let {stateMaps} = state;
        if (!stateMaps) {
            stateMaps = {}
        }
        let {key, data} = action.data;

        stateMaps[key] = data;
        return Object.assign({}, state, {stateMaps: stateMaps});
    },
    [NAV_REPLACE_ALL_TAB]: function (state, action){
        return {
            ...state,
            currentTab: action.currentTab || 0,
            tabs: action.tab
        };
    }
};

export default function navTabReducer(state = initialState, action) {

    const handler = ACTION_HANDLERS[action.type];
    if (handler) {
        return handler(state, action)
    } else {
        let temp = JSON.parse(localStorage.getItem('tabs'));
        let tabs = xt.getItemValue(temp, 'tabs_' + xt.getItemValue(WebData.user, 'data.id')+ "_" + i18n.getLang(), []);
        let newState = Object.assign(state, temp && {currentTab:temp.currentTab, tabsBak:temp.tabsBak, tabs});
        let path = window.location.pathname;

        if(path in newState.tabsBak){
            newState.currentTab = newState.tabsBak[path].id;
            let tab = newState.tabs.find(tb => tb.url === newState.tabsBak[path].url);
            if( !tab){
                tab = newState.tabsBak[path];
                newState.tabs.push(tab);
            }
            tab.search = window.location.href.split("?")[1];
            tab.search = tab.search ? "?" + decodeURIComponent(tab.search) : '';
        } else {
            newState.currentTab = UN_DEFINE_TAB_ID;
        }
        return newState;
    }
}

