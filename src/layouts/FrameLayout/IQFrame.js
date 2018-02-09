import React, {Component} from "react";
import PropTypes from "prop-types";
import Loading from '../../components/Loading';
import WebData from '../../common/WebData';
import NavConnect from "../../components/NavigateTabs/containers/AddContainer";
import Currency from './../CurrencyLayout';

const shouldComponentUpdate = (children, props) => {
    if( !children) return;
    if(children.props.children){
        shouldComponentUpdate(children.props.children, props);
    } else {
        let prototype = children.type.prototype;
        if( prototype._shouldComponentUpdate === undefined){
            prototype._shouldComponentUpdate = prototype.shouldComponentUpdate || 0;
        }
        prototype.shouldComponentUpdate = function(nextProps, nextState){
            let visible = nextProps.location && props.isVisible(props.tabs, nextProps.location);
            let shouldUpdate = visible &&
                (prototype._shouldComponentUpdate === 0 || !!prototype._shouldComponentUpdate.call(this, nextProps, nextState));
            return Boolean(shouldUpdate);
        };
    }
};

export class IQFrame extends Component {

    static propTypes = {
        visible: PropTypes.bool,
        refreshTime: PropTypes.number
    };

    static defaultProps = {
        visible: false,
        refreshTime: 0,
    };

    constructor (props){
        super(props);
        this.state = {
            context: props.children
        };
    }

    shouldComponentUpdate(props, state) {
        return props.visible || this.props.visible;
    }

    componentWillReceiveProps(props) {
        if(props.refreshTime !== this.props.refreshTime && props.visible){
            this.setState(
                {context: null},
                ()=> this.setState({context: props.children})
            );
        } else {
            this.setState({context: props.children});
        }
    }

    getLoading = () => {
        return this._loading;
    };

    render (){
        const {visible, refresh} = this.props;
        const {context} = this.state;
        shouldComponentUpdate(context, this.props);
        if(visible) WebData.currentFrame = this;
        return (
            <div style={{display: visible? 'inherit': 'none', position: 'relative'}}>
                <Loading ref={rf => this._loading = rf} hiddenDelay={300}/>
                {context}
                <Currency />
            </div>
        );
    }
}

export default NavConnect(IQFrame);
