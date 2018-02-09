import {connect} from "react-redux";
import {navAddTab, navRefreshTab, navRemoveAllTab, navRemoveOtherTab, navRemoveTab, navTabChange} from "../modules/tabs";

import NavigateTabs from "../components/NavigateTabs";
import NavMenu from "../components/NavTabsMenu";
import {emitter} from "../../../common/EventEmitter";

const mapDispatchToProps = {
    navAddTab: function (tab) {
        emitter.emit("NavigateTabsItemAdd", tab);
        return (dispatch, getState) => {
            dispatch(navAddTab(tab));
        }
    },
    onItemRemove: function (sender) {
        let tab = sender;
        emitter.emit("NavigateTabsItemRemove", sender);
        return (dispatch, getState) => {
            dispatch(navRemoveTab(tab));
        }
    },
    onItemRefresh: function(sender) {
        let tab = sender;
        emitter.emit("NavigateTabsItemRefresh", sender);
        return (dispatch, getState) => {
            dispatch(navRefreshTab(tab));
        }
    },
    onItemRemoveOther: function (sender) {
        let tab = sender;
        emitter.emit("NavigateTabsItemRemoveOther", sender);
        return (dispatch, getState) => {
            dispatch(navRemoveOtherTab(tab));
        }
    },
    onItemRemoveAll: function () {
        emitter.emit("NavigateTabsItemRemoveAll");
        return (dispatch, getState) => {
            dispatch(navRemoveAllTab());
        }
    },

    onItemClick: function (sender) {
        let tab = sender;
        emitter.emit("NavigateTabsItemClick", tab);
        return (dispatch, getState) => {
            dispatch(navTabChange(tab));
        }
    }
};

const mapStateToProps = function (state) {
    return {
        tabs: state.navigate.tabs,
        currentTab: state.navigate.currentTab
    }
};

export const NavTabsMenu = connect(mapStateToProps, mapDispatchToProps)(NavMenu);
export default connect(mapStateToProps, mapDispatchToProps)(NavigateTabs);

