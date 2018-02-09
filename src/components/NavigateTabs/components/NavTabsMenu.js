import React ,{Component,PropTypes} from 'react'
import {browserHistory} from 'react-router';

import RightKey from '../../../components/RightKey/RightKey';
import {UN_DEFINE_TAB_ID, INDEX_URL} from './../modules/tabs';

export default class NavTabsMenu extends Component{
    constructor(props){
        super(props);
    }

    onPush = location => {
        let search = location.search ? location.search : '';
        browserHistory.push(location.url + search);
    };

    onItemRemove = (tab) => {
        this.props.onItemRemove(tab);
        if(tab.id==this.props.currentTab){
            let index=this.props.tabs.indexOf(tab);
            if(index<=1){
                browserHistory.push(INDEX_URL);
            }else{
                this.onPush(this.props.tabs[index-1]);
            }
        }
    };

    onItemClick = (tab) => {
        if (this.props.currentTab !== tab.id){
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

    onItemRemoveAll = ()=>{
        this.props.onItemRemoveAll();
        browserHistory.push(INDEX_URL);
    };

    handleClick = (event, data)=>{
        let {tabs} = this.props;
        let tab = tabs.find(da => da.id === data.action);
        if(tab) this.onItemClick(tab);
    };

    render(){
        let {tabs,currentTab, style}  = this.props;
        let itemProps = {
            onItemClick: this.onItemClick,
            onItemRemove: this.onItemRemove,
            onItemRemoveOther: this.onItemRemoveOther,
            onItemRemoveAll: this.onItemRemoveAll,
            onItemRefresh: this.onItemRefresh
        };
        let rightAry = tabs.map(da=>{
            return { type: da.id, child: <span>{da.name}</span>, data: da}
        });

        return (
           <RightKey array={rightAry} handleClick={this.handleClick} isShowMenu={true} id='NavTabsMenu_ID' onLeftMouse={true} style={{
               overflowY: 'auto', maxHeight: '98%', minWidth: 160
           }}>
               <div className="noselect" style={style}>M</div>
           </RightKey>

        );
    }
}

