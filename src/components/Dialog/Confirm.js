import i18n from './../../lib/i18n';
import isfunction from 'lodash.isfunction';
import noop from 'lodash.noop';
import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import Dialog from './Dialog';

class Confirm extends Component {
    static defaultProps = {
        description: null,
        confirmLabel: null,
        abortLabel: null,
        unmount: noop,
        close: noop,
        cancel: noop,
        done: noop,
        show: true,
        timing: 0, // 定时消失
        showConfirmClose:false,  //右上角出现删除icon
        showFooter:true, //当showFooter 为false时,,可设置showConfirmClose:true
        width:600
    };

    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            countdown: '',
        };
        this.cancel = this.cancel.bind(this);
        this.done = this.done.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentDidMount() {
        let timing = parseInt(this.props.timing);
        if(timing > 0){
            let df = ()=>{
                timing -= 1; 
                if(timing < 0){
                    this.done();
                }
                let countdown = ` (${timing})`;
                this.setState({countdown});
            };
            this.interval = window.setInterval(df, 1000);
            this.setState({countdown: ` (${timing})`});
        }
    }

    componentWillUnmount() {
        window.clearInterval(this.interval);
    }

    unmount() {
        const container = this.props.container;
        ReactDOM.unmountComponentAtNode(container);
        container.parentNode.removeChild(container); // was previously container.remove(); which doesn't work in IE11
    }

    cancel() {
        window.clearInterval(this.interval);
        this.setState({show: true});
        setTimeout(() => {
            this.unmount();
            this.props.cancel();
            this.props.close();
        });
    }

    done() {
        window.clearInterval(this.interval);
        this.setState({show: false});
        setTimeout(() => {
            this.unmount();
            this.props.done();
        });
    }

    onClose() {
        window.clearInterval(this.interval);
        this.setState({show: false}, () => {
            this.props.onClose && this.props.onClose();
        });
    }

    render() {
        let {props} = this;
        let optButtons = [{className: "btn btn-default btn-ok", children: (<span>{props.confirmLabel || i18n.t(200043/*确定*/)}{this.state.countdown}</span>), onClick: () => this.done()},
            {className: "btn btn-default btn-cancel", children: (<span>{props.abortLabel || i18n.t(100461/*取消*/)}</span>), onClick: () => this.cancel()}];
        let dlgProps = {};
        if (typeof(props.message) === 'string' && props.message.length > 0) {
            dlgProps.title = props.message;
            dlgProps.showHeader = true;
        } else {
            dlgProps.showHeader = false;
        }
        dlgProps.oprateButtons = optButtons;
        dlgProps.visible = this.state.show;
        dlgProps.showFooter = this.props.showFooter;
        dlgProps.className = 'confirm-dialog';
        dlgProps.showConfirmClose = !!props.showConfirmClose;
        dlgProps.onClose = this.onClose;
        dlgProps.width = this.props.width;
        return <Dialog {...dlgProps} style={{zIndex: 120}}>
            {this.props.description}
        </Dialog>
    }
}

export default function confirm(description, options = {}) {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const props = {description, container};
    if (isfunction(options)) {
        props.done = options;
    } else {
        Object.assign(props, options);
    }

    ReactDOM.render(<Confirm {...props} />, container);
}

// export const Confirm={
//     show:function(){
//         let dialog= React.createElement(Dialog,{visible:true,children:<div>123456</div>});
//         ReactDOM.render(dialog,document.body);
//     },
// }

// export default Confirm;


