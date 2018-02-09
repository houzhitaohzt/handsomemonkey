import {navAddTab, navRemoveTab, navTabChange} from '../modules/tabs'
export const mapDispatchToProps = (dispatch) => {

    return {
        actions: {
            addTabs: function (tabs) {
                return dispatch(navAddTab(tabs))
            },
            navRemoveTab: function (tabs) {
                return dispatch(navRemoveTab(tabs));
            },
            navTabChange: function (tab) {
                return dispatch(navTabChange(tab));
            }
        }
    }
}
export const mapStateToProps = function (state) {
    return {
        tabs: state.navigate.tabs,
        currentTab: state.navigate.currentTab,
        tabsBak: state.navigate.tabsBak,
        location: state.location,
        locale: state.locale
    }

}


