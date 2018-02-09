/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 15:18
 */
import React from 'react';
import xt from '../../../../common/xt'

let defaultAvatar = require('../../assets/default.png');
export default class extends React.PureComponent {

    constructor (props) {
        super(props);

        this.state = {
            readerType: 3,// 2未读 3已读
        }
    }

    onReadChange = (type)=> {
        this.setState({ readerType: type });
    };

    onConcatClick = (item)=> {
        this.props.openMessage(item);
    };

    renderConcatItem = (item, index)=> {
        return (
            <div className='im-menu-drawer-concat-c3' key={index} onClick={this.onConcatClick.bind(this, item)}>
                <div><img className='im-avatar' src={defaultAvatar}/></div>
                <span className='noLineFeed'>{item.staffLocalName}</span>
            </div>
        )
    };

    render() {
        let { item, visible, content } = this.props;
        let { readerType } = this.state;
        let already = (content.receivers || []).filter(da => da.status == 3).length;
        let unread = (content.receivers || []).length - already;
        return (
            <div className='im-menu-drawer-concat'>
                <div className='im-menu-drawer-concat-c1'>
                    <span onClick={this.onReadChange.bind(this, 3)} className={readerType == 3? 'active': ''}>已读 {already}</span>
                    <span onClick={this.onReadChange.bind(this, 2)} className={readerType == 2? 'active': ''}>未读 {unread}</span>
                </div>
                <div className='im-menu-drawer-concat-c2'>
                    {(content.receivers || []).filter(da => da.status==readerType).map(this.renderConcatItem)}
                </div>
            </div>
        )
    }
}
