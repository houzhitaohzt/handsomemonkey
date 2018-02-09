import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import './index.less';

export default class extends PureComponent {
    static propTypes = {
        visible: PropTypes.bool,
        hiddenDelay: PropTypes.number,
    };

    static defaultProps = {
        visible: false,
        hiddenDelay: 0,
    };

    constructor (props){
        super(props);
        this.state = {
            visible: props.visible
        };
        this.dtOut = 0;
        this.number = 0;
        this.isClose = false;
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentWillReceiveProps(props) {
        if(props.visible !== this.props.visible){
            this.setState({visible: props.visible});
        }
    }

    _setVisible = visible => {
        if( !this.mounted) return;
        this.isClose = false;
        if(visible !== this.state.visible) this.setState({visible});
    };

    setVisible = (visible = false) => {
        let that = this;
        if(visible === false) {
            that.number --;
            if(that.number <= 0) {
                that.number = 0;
                that.isClose = true;
                if(that.dtOut === 0) that._setVisible(false);
            }
        } else {
            that.number ++;
            that._setVisible(visible);
            if(that.dtOut === 0){
                that.dtOut = setTimeout(()=>{
                    that.dtOut = 0;
                    if(that.isClose) that._setVisible(false);
                }, that.props.hiddenDelay);
            }
        }
        return this;
    };

    show = ()=>{
        return this.setVisible(true);
    };

    hide = ()=>{
        return this.setVisible(false);
    };

    render () {
        if(!this.state.visible) return null;
        return (
            <div className='fooding-loading-mask fooding-loading'>
                <div className="fooding-loading-mask2">
                    <div className="ball-clip-rotate-multiple">
                        <div/><div/>
                    </div>
                </div>
            </div>
        );
    }
}