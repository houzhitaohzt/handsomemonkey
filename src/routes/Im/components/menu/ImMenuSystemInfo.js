import i18n from './../../../../lib/i18n';
/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 15:18
 */
import React from 'react';
import xt from '../../../../common/xt'
import { emitter } from '../../../../common/EventEmitter'
import ImMenuConcat from './ImMenuConcat';

let defaultAvatar = require('../../assets/default.png');
let dataFmt = {sameDay: 'LT', nextDay: '[明天] LT', lastDay: '[昨天] LT', month: 'MM-DD LT', year: 'YYYY-MM-DD LT', week: 'dddd LT'};
export default class extends React.PureComponent {

    constructor (props) {
        super(props);

        this.state = {

        }
    }

    componentDidUpdate() {
        if(this.detail){
            let children = this.detail.children;
            children && Array.from(children).forEach(child => {
                if(child.tagName === "A"){
                    child.onclick = ()=> emitter.emit("IM-VisibleEmit", false)
                }else{
                    let ahref = child.querySelector("a");
                    ahref && (ahref.onclick = ()=> emitter.emit("IM-VisibleEmit", false))
                }
                // child.onclick = ()=> emitter.emit("IM-VisibleEmit", false)
            });
        }
    }

    renderContainer = ()=> {
        let { item, singleItem } = this.props;
        // let msg = "销售订单(<a href=\"javascript:navTabs.open('采购需求', '/pruchaseneed/list?sourceNo=SC1710240005');\">SC1710240005</a>) 产品(蔗糖脂肪酸酯) 采购数量(330MT)";
        let msg = `${singleItem.text}`;
        return (
            <div className='im-menu-drawer-container'>
                <span dangerouslySetInnerHTML={{__html: msg}} ref={rf => this.detail = rf}/>
                <div>
                    <span>{xt.date.formatCalendarNow(singleItem.scheduleSendTime, dataFmt)}</span>
                </div>
            </div>
        )
    };

    render() {
        let { item, visible, openMessage, singleItem } = this.props;
        return (
            <div className='scroll im-menu-drawer im-menu-drawer-system-info'>
                <div className='im-menu-drawer-title'>
                    <i className='foddingicon fooding-system-information'/>
                    <span style={{color: '#F5A623'}}>{i18n.t(200762/*系统消息*/)}</span>
                </div>
                { this.renderContainer() }
                {/*<ImMenuConcat openMessage={openMessage} />*/}
                <div/>
            </div>
        );
    }
}
