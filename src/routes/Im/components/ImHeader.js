/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 15:18
 */
import React from 'react';
import { emitter } from '../../../common/EventEmitter';
import WebData from '../../../common/WebData';

const HeaderConfig = [
    { icon: 'fooding-Chat-two', a_icon: 'fooding-Chat-one' },
    { icon: 'fooding-Workbench-two', a_icon: 'fooding-Workbench-one'  },
    { icon: 'fooding-Contacts-two', a_icon: 'fooding-Contacts-one'  }
];

export default class extends React.PureComponent {

    constructor (props) {
        super(props);

        this.state = {
            index: props.index || 0,
            menuConfig: [
                {tag: 0},
                {tag: 0},
                {}
            ]
        }
    };

    componentDidMount() {
        emitter.on("WD-totalChatCount", this.totalChatCount);
        emitter.on("WD-sysMsgCount", this.sysMenuCount);
        emitter.on("WD-broadcastCount", this.sysMenuCount);
    }

    componentWillUnmount() {
        emitter.off("WD-totalChatCount", this.totalChatCount);
        emitter.off("WD-sysMsgCount", this.sysMenuCount);
        emitter.off("WD-broadcastCount", this.sysMenuCount);
    }

    sysMenuCount = ()=> {
        let menuConfig = this.state.menuConfig.slice();
        menuConfig[1].tag = WebData.sysMsgCount + WebData.broadcastCount;
        this.setState({menuConfig});
    };

    totalChatCount = (value)=> {
        let menuConfig = this.state.menuConfig.slice();
        menuConfig[0].tag = value;
        this.setState({menuConfig});
    };

    componentWillReceiveProps(props) {
        if(props.index !== this.props.index){
            this.setState({ index: props.index});
        }
    }

    onNav = (da, index, event)=> {
        let { onNavChange} = this.props;
        this.setState({ index });
        onNavChange && onNavChange(da, index);
    };

    onMouseDown = (event) => {
        event.stopPropagation();
        event.preventDefault();
    };

    renderNav =  (da, index) => {
        let { menuConfig } = this.state;
        let it = menuConfig[index];
        let className = `foddingicon ${da.icon}`;
        if(index === this.state.index)  className = `foddingicon ${da.a_icon}`;
        return (
            <div key={index} onClick={this.onNav.bind(this, da, index)} onMouseDown={this.onMouseDown}>
                <i className={className}/>
                {it.tag? <div><span>{it.tag}</span></div>: null}
            </div>
        )
    };

    render() {
        let {  } = this.props;
        return (
            <div className='im-header'>
                <div className='im-header-center'>
                    {  HeaderConfig.map(this.renderNav) }
                </div>
                <i className='foddingicon fooding-clear' onClick={this.props.close}/>
            </div>
        );
    }
}
