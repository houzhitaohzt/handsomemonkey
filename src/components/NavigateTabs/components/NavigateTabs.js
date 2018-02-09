import React, {Component, PropTypes} from 'react'
import {browserHistory} from 'react-router';
import TabItem from './TabItem'
import {UN_DEFINE_TAB_ID, INDEX_URL, INDEX_ID} from './../modules/tabs';

export class NavigateTabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            duration: 0.1,
        };
        this.un_tab = {
            id: UN_DEFINE_TAB_ID,
            name: '? ++ ',
            component: '? ++',
            url: 'undefine'
        };
    }

    onPush = location => {
        let search = location.search ? location.search : '';
        browserHistory.push(location.url + search);
    };

    onItemRemove = (tab) => {
        this.props.onItemRemove(tab);
        if (tab.id == this.props.currentTab) {
            let index = this.props.tabs.indexOf(tab);
            if (index <= 1) {
                browserHistory.push(INDEX_URL);
            } else {
                this.onPush(this.props.tabs[index - 1]);
            }
        }
    };

    onItemClick = (tab) => {
        if (this.props.currentTab !== tab.id) {
            this.props.onItemClick(tab);
            this.onPush(tab);
        }
    };

    onItemRefresh = (tab) => {
        this.props.onItemRefresh(tab);
        this.onPush(tab);
    };

    onItemRemoveOther = (tab) => {
        this.props.onItemRemoveOther(tab);
        this.onPush(tab);
    };

    onItemRemoveAll = () => {
        this.props.onItemRemoveAll();
        browserHistory.push(INDEX_URL);
    };

    componentWillReceiveProps(props, state) {
        let s = Math.abs(props.left - this.props.left);
        let v = 2000;
        let t = s / v;
        this.setState({duration: Math.min(t, 0.5)});
    }

    render() {
        let {tabs, currentTab, left} = this.props;
        let {duration} = this.state;
        let itemProps = {
            onItemClick: this.onItemClick,
            onItemRemove: this.onItemRemove,
            onItemRemoveOther: this.onItemRemoveOther,
            onItemRemoveAll: this.onItemRemoveAll,
            onItemRefresh: this.onItemRefresh
        };
        if (left > 0) left = 0;
        let homeTab = tabs.find(da => da.id === INDEX_ID);
        return (
            <ul style={{minWidth: '1000%', height: '100%', position: 'absolute', left: left, transitionDuration: `${duration}s`}}>
                {
                    homeTab ?
                        <li key={homeTab.id}>
                            <TabItem tab={homeTab}  {...itemProps} currentTab={currentTab}/>
                        </li>
                        : null
                }
                {
                    tabs.map(
                        (e, index) => {
                            if (e.id === INDEX_ID) return null;
                            return (
                                <li key={e.id}>
                                    <TabItem tab={e}  {...itemProps} currentTab={currentTab}/>
                                </li>
                            )
                        })
                }
                {
                    currentTab === UN_DEFINE_TAB_ID ?
                        <li key={UN_DEFINE_TAB_ID}>
                            <TabItem tab={this.un_tab} {...itemProps} currentTab={currentTab}/>
                        </li> : null
                }
            </ul>

        );
    }
}

NavigateTabs.propTypes = {
    tabs: PropTypes.array.isRequired,
    onItemRemove: PropTypes.func.isRequired
};
export default NavigateTabs;

