/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 13:58
 */
import React from 'react';
import Modal from 'react-modal';
import xt from '../../../common/xt';
import Draggable from 'react-draggable';
import { emitter } from '../../../common/EventEmitter';

import './../assets/im.less';
import Header from './ImHeader';
import Message from './message';
import Concat from './contact';
import Menu from './menu';

const customStyles = {
    overlay: {
        position: 'fixed', zIndex: 150, top: 0, minWidth: 1136, backgroundColor: 'rgba(126, 140, 153, .8)'
    },
    content: {
        top: '60px', left: '50%', right: 'auto', bottom: 'auto',
        transform: 'translate(-50%, 0%)', border: '0',
        backgroundColor: '#fff',  padding: '0', overflow: 'inherit', borderRadius: '6px',
    }
};

export default class extends React.PureComponent {

    constructor (props){
        super(props);

        this.state = {
            visible: false,
            headerIndex: 0,
        };

        window.addEventListener('keydown', (event)=> {
            event.keyCode === 115 && (!this.state.visible? this.openModal() : this.closeModal());
        });
    }

    componentDidMount() {
        let that = this;
        emitter.on("IM-VisibleEmit", (visible = true) => {
            visible ? that.openModal(): that.closeModal();
        });

    }

    componentWillUnmount() {
        emitter.off("IM-VisibleEmit");
    }

    closeModal = ()=> {
        this.setState({visible : false});
    };

    openModal = ()=> {
        this.setState({visible : true});
    };

    onNavChange = (da, index)=> {
        this.setState({ headerIndex: index});
    };

    openMessage = (user)=> {
        this.setState({ headerIndex: 0});
        this.message.openMessage({id:user.userId || user.id,name:user.staffLocalName || user.localName });
        //user 还没有值
        // this.message.openMessage({ id: UUID.v4(), name: '天生吃货 - ' + xt.guid() });
    };

    renderIm ({height, width}){
        let { visible, headerIndex } = this.state;
        let backgroundImage = localStorage.getItem("IM-BackgroundImage");
        return (
            <div className='ImContainer' style={{height, width, display: visible? 'block': 'none'}}>
                <Header onNavChange={this.onNavChange} index={headerIndex} close={this.closeModal}/>
                <div key={1} style={{display: headerIndex === 1? "block": "none", height: '100%'}}><Menu main={this}/></div>
                <div key={2} style={{display: headerIndex === 2? "block": "none", height: '100%'}}><Concat main={this}/></div>
                <div key={3} style={{display: headerIndex === 0? "block": "none", height: '100%', backgroundImage}}>
                    <Message main={this} ref={rf=>this.message=rf} visible={headerIndex === 0 && visible}/>
                </div>
            </div>
        )
    }

    render() {
        let { visible } = this.state;
        let height = document.body.offsetHeight - 100,
            width = document.body.offsetWidth - 500;
        return (
            <div style={{zIndex: 200, position: 'fixed', top: '50%', left: '50%', right: 'auto', bottom: 'auto', transform: 'translate(-50%, -50%)'}}>
                {/*<a onClick={this.openModal}><i className={"foddingicon fooding-home_16"}/></a>*/}
                <Draggable handle=".im-header">
                 {this.renderIm({ height, width })}
                </Draggable>
            </div>
        );
    }
}
