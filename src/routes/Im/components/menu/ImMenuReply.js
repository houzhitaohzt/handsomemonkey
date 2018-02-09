/**
 *
 * @flow
 * @author Monkey
 * @sine 2018-1-19 15:18
 */
import React from 'react';
import xt from '../../../../common/xt'

let defaultAvatar = require('../../assets/default.png');
let dataFmt = {sameDay: 'LT', nextDay: '[明天]', lastDay: 'MM-DD LT', year: 'YYYY-MM-DD', week: 'dddd LT', month: 'MM-DD LT'};

export default class extends React.PureComponent {

    constructor (props) {
        super(props);
        this.state = {
            readerType: 3,// 2未读 3已读
        }
    }

    // onReadChange = (type)=> {
    //     this.setState({ readerType: type });
    // };

    // onConcatClick = (item)=> {
    //     this.props.openMessage(item);
    // };

    renderReplyItem = (item, index)=> {
        return (
            <div className='im-message-drawer-item-c' style={{width:"100%", marginLeft:"10px"}} key={index}>
                <div><img className='im-avatar' src={defaultAvatar}/></div>
                <div>
                    <div className='im-message-drawer-item-ci' style={{display:'flex',justifyContent:"space-between"}}>
                        <span>{item.replyUser && item.replyUser.staffLocalName ? item.replyUser.staffLocalName : ""}</span>
                        <span>{item.replyDate ? xt.date.formatCalendarNow(item.replyDate, dataFmt): ''}</span>
                    </div>
                    <span style={{fontSize:"12px"}}>{item.content}</span>
                </div>
            </div>
        )
    };

    render() {
        let { replyRadioList } = this.props;
        //let { readerType } = this.state;
        //let already = (replyRadioList || []).filter(da => da.status == 3).length;
        //let unread = (replyRadioList || []).length - already;
        return (
            <div className='im-menu-drawer-concat'>
                <div className='im-menu-drawer-concat-c1'>
                    <span className={'active'}>回复 {replyRadioList.length}</span>
                    <span></span>
                </div>
                <div className='im-menu-drawer-concat-c2'>
                    {(replyRadioList || []).map(this.renderReplyItem)}
                </div>
            </div>
        )
    }
}
