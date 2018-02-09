/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 15:18
 */
import React from 'react';

export default class extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            selectIndex: 0,
            children: null,
        }
    }

    onSelectItem = (item, index, event)=> {
        let { selectIndex, children } = this.state;
        if(selectIndex === index && index.split('-').length === 2 && children){
            children = null;
        } else {
            if(item.children)  children = item.children;
        }

        this.setState({ selectIndex: index, children });
        this.props.onChange && this.props.onChange(item, index);
        event.stopPropagation();
        event.preventDefault();
    };

    renderMenu = (item, index, childIndex)=> {
        let { children, selectIndex } = this.state;
        let className = 'im-concat-list-item';
        let cix = childIndex + "-" + index;
        let isChild =  children && children === item.children;
        if(String(selectIndex).indexOf(cix) === 0) className += ' im-concat-list-active';

        return (
            <div key={index} className={item.children? 'im-concat-list-item-line': ''}>
                <div onClick={this.onSelectItem.bind(this, item, cix)} className={className}>
                    <div>
                        <i className={`foddingicon ${item.icon}`}/>
                        <span className='noLineFeed'>{item.localName}</span>
                    </div>
                    {item.children && <i className={`foddingicon fooding-inputbox_arrow_16 ${isChild ? 'transform-icon': ''}`}/>}
                </div>
                {isChild && this.renderChildrenMenu(children, item, cix)}
            </div>
        )
    };

    renderChildrenMenu = (children, item, cix)=> {
        return children.map((da, ix) => {
            da.parent = item;
            return (
                <div className='im-concat-child-list-item' key={"child-" + ix}>
                    {this.renderMenu(da, ix, cix)}
                </div>
            );
        })
    };

    render() {
        let { menuAry } = this.props;
        return (
            <div className='im-concat-list'>
                { menuAry.map((da, index) => this.renderMenu(da, index, '0'))  }
            </div>
        );
    }
}
