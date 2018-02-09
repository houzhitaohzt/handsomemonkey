import React, { Component,PropTypes } from 'react';
import ContextMenuTrigger from './ContextMenuTrigger';
import ContextMenu from './ContextMenu';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import  './react-contextmenu.less';

const MENU_TYPE = 'MULTI';
// const array = [{type:1,child:'添加'},{type:2,child:'删除'},{array:[{type:1,child:'添加'},{type:2,child:'删除'}],second:1,child:'二级'}];
function collect(props) {
    return { name: props.name };
}

export default class extends Component{
	constructor(props) {
        super(props);

        this.state = { logs: [] };
    }
    // handleClick = (e, data, target) => {
    //     const count = parseInt(target.getAttribute('data-count'), 10);
    //     // if (data.action === 'Added') {
    //     //     target.setAttribute('data-count', count + 1);

    //     //     return this.setState(({logs}) => ({
    //     //         logs: [`${data.action} 1 ${data.name}`, ...logs]
    //     //     }));
    //     // }

    //     // if (data.action === 'Removed' && count > 0) {
    //     //     target.setAttribute('data-count', count - 1);

    //     //     return this.setState(({logs}) => ({
    //     //         logs: [`${data.action} 1 ${data.name}`, ...logs]
    //     //     }));
    //     // }

    //     // this.setState(({logs}) => ({
    //     //     logs: [` ${data.name} cannot be ${data.action.toLowerCase()}`, ...logs]
    //     // }));
    // }

	render(){
        let {handleClick,isShowMenu, style = {}, onLeftMouse} = this.props;

		const attributes = {
            'data-count': '',
            className: 'example-multiple-targets '
        };
        let itemArray;
        if(this.props.array){
            itemArray = this.props.array.map((value,i)=>{
                        if(value.second){
                            let com = value.array.map((data,i)=>{
                                return (
                                    <MenuItem key ={i}  onClick={handleClick} data={{item: data.type}}>{data.child}</MenuItem>
                                );
                            });
                            return(
                                <SubMenu title={value.child} key={i}>
                                    {com}
                                 </SubMenu>
                                );
                        }else{
                            return (
                                <MenuItem permissions={value['permissions']} key={i} onClick= {handleClick} data={{action: value.type}}>{value.child}</MenuItem>
                            );
                        }

           });
        }
        let Menu;
        if(this.props.isShowMenu){
            Menu = <ContextMenu id={this.props.id} style={style}>
                    {itemArray}
                  </ContextMenu> ;
        }else{
            Menu=<div></div>
        }
		return  (
            <div>
                <ContextMenuTrigger id={this.props.id} name={this.props.data} onLeftMouse={onLeftMouse}
                    holdToDisplay={1000}
                    collect={collect} attributes={attributes}>
                    {this.props.children}
                </ContextMenuTrigger>
                {Menu}
            </div>
        );
	}
}
