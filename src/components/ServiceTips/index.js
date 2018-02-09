import React, {Component} from "react";
import ReactDOM from "react-dom";
import xt from '../../common/xt';

export class ServiceTips extends Component {
    static defaultProps = {
        text: '',
        type: 'success',
        top: "82px",
        zIndex:99999
    };

    constructor(props) {
        super(props);
        this.state = {
            showServiceTip: true,
            showTip: true
        };
    }

    componentDidMount() {
        var that = this;
        setTimeout(function () {
            that.setState({
                showServiceTip: false
            }, function () {
                setTimeout(function () {
                    that.setState({
                        showTip: false
                    });
                }, 100)
            });
        }, 3000);
    }

    render() {
        let classn;
        if (this.state.showServiceTip) {
            classn = this.props.type == 'error' ? (this.props.top == "82px" ? 'keep-backgroud-red movedown' : 'keep-backgroud-red selfmovedown') :
                (this.props.top === "82px" ? 'keep-backgroud-green movedown' : 'keep-backgroud-green selfmovedown');
        } else {
            classn = this.props.type == 'error' ? (this.props.top == "82px" ? 'keep-backgroud-red moveup' : 'keep-backgroud-red selfmoveup' ):
                (this.props.top === "82px"?'keep-backgroud-green moveup':'keep-backgroud-green selfmoveup');
        }
        if (!this.state.showTip) {
            classn = 'none';
        }
        return <div
            className={classn}
            style={{
                width: '60%', top: this.props.top, position: 'absolute', left: '20%',
                opacity: '0.8', padding: '10px 5px', display: 'flex', alignItems: 'center',
                borderRadius: '0 0px 6px 6px', zIndex: this.props.zIndex, minHeight: '60px', fontSize: 14,
                boxShadow: 'rgba(0, 0, 0, 0.5) 0px 0px 2px 3px'
            }}>
  	    		<span className='keep'>
  	    			<i className='foddingicon fooding-keep' style={{display: 'table-cell', verticalAlign: 'middle'}}/>
  	    			<span dangerouslySetInnerHTML={{__html: this.props.text}}
                          style={{display: 'table-cell', lineHeight: 'initial'}}/>
  	    		</span>
        </div>
    }

}

export default function serviceTips(options = {}) {
    if (!options.text || options.text.trim() === '') return;
    const container = document.createElement('div');
    document.body.appendChild(container);

    const props = {container};
    if (xt.isFunction(options)) {
        props.done = options;
    } else {
        Object.assign(props, options);
    }

    ReactDOM.render(<ServiceTips {...props} />, container);
}

export function successTips(text) {
    serviceTips({text})
}

export function errorTips(text) {
    serviceTips({text, type: 'error'})
}