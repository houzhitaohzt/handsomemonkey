/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 15:18
 */
import React from 'react';
import xt from '../../../../common/xt'

let sighImg = require('../../assets/sigh.svg');
let dataFmt = {sameDay: 'LT', nextDay: '[明天]', lastDay: 'MM-DD LT', year: 'YYYY-MM-DD', week: 'dddd LT', month: 'MM-DD LT'};
export default class extends React.Component {

    constructor (props) {
        super(props);
        this.state = {

        }
    }

    onSelectItem = (item, index, event)=> {
        this.props.onChange(item, index);
        event.stopPropagation();
        event.preventDefault();
    };

    onBlank = ()=> {
        this.props.onChange && this.props.onChange();
    };

    onItemRemove = (item, index, event)=> {
        this.props.remove(item, index);
        event.stopPropagation();
        event.preventDefault();
    };

    renderItem = (item, index)=> {
        let { messageList, userList, user } = this.props;
        let className = 'im-message-list-item';
        if(user === item) className += ' im-message-list-active';

        let msgList = messageList.get(String(item.id)) || [];
        let message = msgList[msgList.length - 1] || '';
        return (
            <div className={className} onClick={this.onSelectItem.bind(this, item, index)} key={item.id + "-" + index}>
                <span dangerouslySetInnerHTML={{ __html: '&times;' }} className='im-message-list-item-fork'
                      onClick={this.onItemRemove.bind(this, item, index)}/>
                <div><img className='im-message-list-avatar' src={item.avatar}/></div>
                <div>
                    <div className='im-message-list-title1'>
                        <span className='im-message-list-title noLineFeed'>
                            { message.status === 3? <span className='im-new-tags'/>: null}
                            { item.name }
                        </span>
                        <span >{message.date ? xt.date.formatCalendarNow(message.date, dataFmt): ''}</span>
                    </div>
                    <div className='im-message-list-title2'>
                        {message.status === 0 ? <img src={sighImg}/>: null}
                        <span className='im-message-list-msg noLineFeed'>{ message.message }</span>
                    </div>
                </div>
            </div>
        )
    };

    render() {
        let { userList } = this.props;
        return (
            <div className='scroll im-message-list' onClick={this.onBlank}>
                {userList.map(this.renderItem)}
            </div>
        );
    }
}
