import i18n from './../../../lib/i18n';
import React, {Component,PropTypes} from 'react'
import { Link,browserHistory } from 'react-router'
import RightKey from '../../RightKey/RightKey';
import {ClipTip} from '../../Tip';
import xt from '../../../common/xt';

export  class TabItem extends Component{
	constructor(props) {
		super(props);
		this.onRemoveClick=this.onRemoveClick.bind(this);
		this.onNavClick=this.onNavClick.bind(this);
	}

	onRemoveClick(tabProps){
		let {tab, tarDom}=tabProps;
        tarDom.preventDefault();
        tarDom.stopPropagation();
		this.props.onItemRemove(tab);

	}

	onNavClick(obj, e){
        this.props.onItemClick(obj);
	}

	onNavDoubleClick (obj, e) {
	    // this.props.onItemRemove(obj);
    }

    handleClick = (e, data, target)=> {
        switch (data.action){
            case 1:
                this.props.onItemRefresh(data.name);
                break;
            case 2:
                this.props.onItemRemove(data.name);
                break;
            case 3:
                this.props.onItemRemoveOther(data.name);
                break;
            case 4:
                this.props.onItemRemoveAll();
                break;
            default:
                break;
        }
    };

	render(){
		let {tab,onClick,onRemove,currentTab} = this.props;
		let  currentClassName;
        let array = [
            {type: 1,child:<div><i className='foddingicon fooding-update'/>{i18n.t(400046/*刷新*/)}</div>},
            {type: 3,child:<div><i className='foddingicon fooding-close-other'/>{i18n.t(201263/*关闭其他*/)}</div>},
            {type: 4,child:<div><i className='foddingicon fooding-close-all'/>{i18n.t(201265/*关闭所有*/)}</div>}
        ];
        let closeNode, onDoubleClick;
		if(tab.id==0){
            onDoubleClick = ()=>{};
			tab.component= <i className="foddingicon fooding-home_16"/>;
		} else {
            onDoubleClick = this.onNavDoubleClick.bind(this, tab);
            closeNode = <i onMouseDown ={(e)=>this.onRemoveClick(Object.assign({},{tab},{tarDom:e}))} data-tab={tab} className='foddingicon fooding-menu_delete_32 clear-delete' value =""/>;
            array.splice(1, 0, {type: 2,child:<div><i className='foddingicon fooding-close-two'/>{i18n.t(100432/*关闭*/)}</div>})
        }

		if('id' in tab&&currentTab==tab.id){
			currentClassName='heightliang noselect noLineFeed';
            // tab.search = window.location.href.split("?")[1];
		}else{
			currentClassName='noselect noLineFeed';
		}

		return (
            <RightKey id={'M_TAB_ITEM_' + tab.id} isShowMenu={true} handleClick={this.handleClick} data ={tab} array={array} style={{minWidth: 150}}>
                <Link className = {currentClassName} style={{maxWidth: '200px'}}
                      onMouseDown={this.onNavClick.bind(this, tab)}
                      onDoubleClick={onDoubleClick}>
                    {xt.isString(tab.component)?tab.component.replace(/({[A-Za-z0-9_-]*})/g, ''):tab.component}  
                    {closeNode}
                </Link>
			</RightKey>
			);
	}
}

TabItem.PropTypes ={
	tab:PropTypes.object.isRequired,
	onRemove:PropTypes.func.isRequired
};

export default TabItem;

