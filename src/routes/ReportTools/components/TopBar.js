import React from 'react';
import {observer} from 'mobx-react';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import {ReportConst} from '../stores/Config';

@observer
export default class TopBar extends React.Component {

    constructor(props) {
        super(props);

        let that = this, store = props.store;
        that.menuRender = that.renderItem.bind(that, 1, store.onMenuClick, null);
        that.barRender = that.renderItem.bind(that, 2, store.onItemClick, store.onListItemClick);
    }

    renderItem = (type: number, onItemClick: (item: Object) => {},
                  onListItemClick: (item:Object, value: Object)=>{}, item: Object, index: number) => {
        let Comp = type === 1 ? MenuItem : TopBarItem;
        return <Comp key={index} item={item} onItemClick={onItemClick} onListItemClick={onListItemClick}/>
    };

    render() {
        let that = this;
        let {store} = that.props;
        return (
            <div className='rp-topbar'>
                <div> {store.toolbarAry.map(that.barRender)} </div>
                <div> {store.menuItemAry.map(that.menuRender)} </div>
            </div>
        )
    }
}

class Item extends React.Component {
    onItemClick = () => {
        let {onItemClick, item} = this.props;
        onItemClick && onItemClick(item);
    };

    onListItemClick = (value) => {
        let {onListItemClick, item} = this.props;
        onListItemClick && onListItemClick(item, value);
    };
}

@observer
class MenuItem extends Item {

    render() {
        let {item} = this.props;
        return (
            <div className={'rp-topbar-item'} onClick={this.onItemClick}>
                <i className={"foddingicon " + item.icon}/>
            </div>
        )
    }
}

@observer
class TopBarItem extends Item {

    renderButton = ()=>{
        let {item} = this.props;
        return (
            <div className={'rp-topbar-item ' + (item.isSelect ? "rp-topbar-item-sl" : "")} onClick={this.onItemClick}>
                <i className={item.icon}/>
            </div>
        )
    };

    renderList = ()=>{
        let that = this;
        let {item} = that.props;
        let value = item.children[item.childrenValue];
        return (
            <div className={'rp-topbar-item'}>
                <Dropdown options={item.children} onChange={that.onListItemClick} value={value} />
            </div>
        )
    };

    render() {
        let {item} = this.props;
        if ( item.type === ReportConst.TYPE_LIST){
            return this.renderList();
        } else {
            return this.renderButton();
        }
    }
}
