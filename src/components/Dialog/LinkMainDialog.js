
import React from 'react';
import Loading from '../Loading';
const { PropTypes, Component } = React;
const propTypes = {
    // width            : PropTypes.number,
    // measure          : PropTypes.string,
    // visible          : PropTypes.bool,
    // showMask         : PropTypes.bool,
    // animation        : PropTypes.string,
    // duration         : PropTypes.number,
    // className        : PropTypes.string,
    // customStyles     : PropTypes.object,
    // customMaskStyles : PropTypes.object,
    // title            :PropTypes.string,
    // titleLeft        :PropTypes.any,
    // titleRight       :PropTypes.string,
    // showHeader       :PropTypes.bool,
    // showFooter       :PropTypes.bool,
    // oprateButtons    :PropTypes.array,

};

const defaultProps = {
    width            : 600,
    measure          : 'px',
    visible          : false,
    showMask         : true,
    animation        : 'zoom',
    duration         : 300,
    className        : '',
    customStyles     : {},
    customMaskStyles : {},
    title            : '',
    titleLeft        : '',
    titleRight       : '',
    showHeader       :true,
    showFooter       :false,
    oprateButtons    :[],
    isShowPicture    :false
};

const DialogWrapper = props => {

    const className = `fooding-dialog-${props.animation}-${props.animationType}`;
    const { width, height, measure, duration, customStyles } = props;
    let ww = isNaN(width)?width:width+measure;
    const style = {
        width                   : ww,
        // animationDuration       : duration + 'ms',
        // WebkitAnimationDuration : duration + 'ms',
        padding :0,
        margin:'auto'
    };

    const mergedStyles = Object.assign(style, customStyles)
    let header= props.showHeader?(<div className={'dialog-title'}>
                        <div className={'title-left'}>{props.titleLeft}</div>
                        <div className={'title-center'}>{props.title}</div>
                        <div className={'title-right'}>{props.titleRight}</div>
    </div>):null;
    let footer=props.showFooter?(<div className={'dialog-footer'} >
                                {
                                props.oprateButtons.map((value,index)=>
                                    (<button type="button" {...value} key={index}>
                                </button>))
                                }
                    </div>):null;
    return (
        <div className={'dialog-wrapper'}>
            <div className={'content'}>
                <div style={mergedStyles} className={className}>
                        {header}
                    <div className={props.isShowPicture?"dialog-content-picture scroll":'dialog-content'}>
                        {props.children}
                        {
                            props.isShowPicture?<i className={'foddingicon fooding-close picture-close'} onClick={props.onClose}></i>:null
                        }
                    </div>
                    {footer}
                </div>
            </div>
        </div>
    )
};

class Dialog extends Component {
    constructor(props) {
        super(props);

        this.animationEnd = this.animationEnd.bind(this);
        this.state = {
            isShow        : false,
            animationType : 'leave'
        };
    }

    componentDidMount() {
        if (this.props.visible) {
            this.enter();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.enter();
        } else if (this.props.visible && !nextProps.visible) {
            this.leave();
        }
    }

    enter() {
        this.setState({
            isShow: true,
            animationType: 'enter'
        });
    }

    leave() {
        this.setState({
            animationType: 'leave'
        });
    }

    animationEnd() {
        if (this.state.animationType === 'leave') {
            this.setState({
                isShow: false
            });
        }
    }

    render() {
        if( !this.state.isShow) return <div/>;

        const mask = this.props.showMask ? <div className="fooding-dialog-mask" style={this.props.customMaskStyles} onClick={this.props.onClose} /> : null;
        const style = {
            display                 : this.state.isShow ? 'inline-block' : 'none',
            WebkitAnimationDuration : this.props.duration + 'ms',
            animationDuration       : this.props.duration + 'ms',
            ...this.props.style
        };

        return (
            <div style={style}
                 className={"fooding-dialog fooding-dialog-fade-" + this.state.animationType + ' ' + this.props.className}
                 onAnimationEnd={this.animationEnd}
            >
                {mask}
                <DialogWrapper {...this.props} animationType={this.state.animationType} >
                    {this.props.children}
                </DialogWrapper>
            </div>
        )
    }
}

Dialog.propTypes = propTypes;
Dialog.defaultProps = defaultProps;

export default Dialog;
