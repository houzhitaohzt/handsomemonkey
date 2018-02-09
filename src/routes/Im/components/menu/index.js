/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 15:18
 */
import React from 'react';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import i18n from '../../../../lib/i18n';

import ImMenuList from './ImMenuList';
import ImMenuContainer from './ImMenuContainer';

import ImMenuSystemInfo from './ImMenuSystemInfo';
import ImMenuAiringInfo from './ImMenuAiringInfo';

import { emitter } from '../../../../common/EventEmitter';

//新增消息
import ImMunuNewRadio from "./ImMenuNewRadio";
//消息回复
import ImRadioReply from "./ImRadioReply";

import { notification } from 'antd';

/**
 * IM - 菜单界面
 */
export default class extends React.Component {

    constructor (props) {
        super(props);
        this.onSend = this.onSend.bind(this);
        this.state = {
            menuAry: [
                {name: i18n.t(200762/*系统消息*/), icon: 'fooding-system-information', type: 1, tags: 0 },
                {name: i18n.t(400198/*我收到的*/), icon: 'fooding-receive-1', type: 2, tags: 0 },
                {name: i18n.t(400199/*我发出的*/), icon: 'fooding-emit-1', type: 3, tags: 0 },
                // {name: '任务', icon: 'fooding-system-information', type: 3, tags: 0 },
                // {name: '任会议务', icon: 'fooding-system-information', type: 4, tags: 18 }
            ],
            singleItem:{} //某一个
        };
        this.state.selectMenu = this.state.menuAry[0];
    }

    componentDidMount() {
        emitter.on("WD-broadcastCount", this.broadcastCount);
        emitter.on("WD-sysMsgCount", this.sysMsgCount);
        emitter.on("fetchMessageStream", this.fetchMessageStream);
    }

    componentWillUnmount() {
        emitter.off("WD-broadcastCount", this.broadcastCount);
        emitter.off("WD-sysMsgCount", this.sysMsgCount);
        emitter.off('fetchMessageStream', this.fetchMessageStream);
    }

    fetchMessageStream = (data)=>{
        if( data['id'] || data['type'] ) return;
        this.openHandle(data);
    };

    // open message
    openHandle = (data)=>{
        let key = String(new Date().getTime());
        notification.open({
            //message: data['text'],
            description: data['text'],
            icon:<i className="foddingicon fooding-broadcast"></i>,
            key:key
        });
        this.intervalHandle(key);
    };

    // 定时器 控制
    intervalHandle = (key)=> {
        window.clearTimeout(window.interRadio);
        if(key) {
            window.interRadio = setTimeout(function(){
                notification.close(key);
            },5000);
        }
    };

    broadcastCount = (value)=> {
        this.changeTags(value, 2);
    };

    sysMsgCount = (value)=> {
        this.changeTags(value, 1);
    };

    changeTags = (value, type)=> {
        let { menuAry } = this.state;
        let menu = menuAry.find(da => da.type === type);
        menu && (menu.tags = value);
        this.setState({ menuAry});
    };

    onMenuChange = (item)=> {
        if(item){
            this.setState({ selectMenu: item});
        } else {
            this.setState({ selectMenu: null});
        }
    };

    renderDrawer = (menuItem, item)=> {
        let {  } = this.props;
        let { selectMenu , singleItem} = this.state;
        let Comp = null;
        switch (selectMenu.type){
            case 1: Comp = ImMenuSystemInfo; break;
            case 2: Comp = ImMenuAiringInfo; break;
            case 3: Comp = ImMenuAiringInfo; break;
        }
        return (
            <div className='im-menu-drawer-side-container' style={selectMenu.type == 2 || selectMenu.type == 3 ? {paddingBottom:"80px"} : {}}>
                <div className='im-menu-drawer-close'>
                    <div onClick={this.closeDrawer}>
                        <i className='foddingicon fooding-fork'/>
                    </div>
                </div>
                {Comp && <Comp item={item} singleItem={singleItem} drawerOpen={this.state.drawerOpen} openMessage={this.props.main.openMessage} ref="radioreply"/>}
                {(selectMenu.type == 2 || selectMenu.type == 3) && <ImRadioReply onSend={this.onSend} item={item} singleItem={singleItem}/>}
            </div>
        );
    };

    /**
     * onSend  广播回复 "发送" 按钮
     * */
    onSend = radioContent => {
        this.refs.radioreply.onSend && this.refs.radioreply.onSend(radioContent);
    };

    onOpenChange = (open)=> {
        this.setState({ drawerOpen: open});
    };

    openDrawer = (item,singleItem)=> {
        this.setState({ drawerOpen: true,singleItem});
    };

    closeDrawer = ()=> {
        this.setState({ drawerOpen: false});
    };

    onCreateRadio = () => {
        this.setState({radioShow:true})
    };

    onCloseRadio = () => {
        this.setState({radioShow:false})
    };

    render() {
        let {  } = this.props;
        let { selectMenu, drawerOpen, radioShow } = this.state;
        const drawerProps = {
            dragToggleDistance: 500,
        };
        return (
            <Drawer
                position={'right'}
                touch={true}
                open={drawerOpen}
                docked={false}
                enableDragHandle={true}
                transitions={true}
                dragToggleDistance={30}
                onOpenChange={this.onOpenChange}
                sidebar={this.renderDrawer()}
                style={{marginTop: '58px'}}
                sidebarStyle={{backgroundColor: '#F1F4F8', borderBottomRightRadius: '6px', willChange: 'inherit'}}
                overlayStyle={{backgroundColor: 'transparent'}}
            >
                <div className='im-menu'>
                    <ImMenuList menuAry={this.state.menuAry} onChange={this.onMenuChange}/>
                    { this.state.menuAry.map((item, index) =>
                        <ImMenuContainer key={index} item={item} visible={selectMenu === item} open={this.openDrawer} onCreateRadio={this.onCreateRadio}/>
                        )
                    }
                    {radioShow ? <ImMunuNewRadio onClose={this.onCloseRadio}/> : null}
                </div>

            </Drawer>
        );
    }
}
