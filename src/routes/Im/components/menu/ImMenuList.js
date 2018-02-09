/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 15:18
 */
import React from 'react';

/**
 * IM - 消息菜单列表
 */
export default class extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            selectIndex: 0,
        };
    }

    onSelectItem = (item, index, event)=> {
        this.setState({ selectIndex: index });
        this.props.onChange && this.props.onChange(item, index);
        event.stopPropagation();
        event.preventDefault();
    };

    renderMenu = (item, index)=> {
        let className = 'im-menu-list-item';
        if(this.state.selectIndex === index) className += ' im-menu-list-active';

        return (
            <div key={index} onClick={this.onSelectItem.bind(this, item, index)} className={className}>
                <i className={`foddingicon ${item.icon}`}/>
                <div>
                    <span className='noLineFeed'>{item.name}</span>
                    { item.tags > 0 && <div><span>{item.tags}</span>  </div>}
                </div>
            </div>
        )
    };

    render() {
        let { menuAry } = this.props;
        return (
            <div className='im-menu-list'>
                { menuAry.map(this.renderMenu)  }
            </div>
        );
    }
}
