import React, { PropTypes,Component } from 'react';
import ReactDOM from 'react-dom';
import Align from 'rc-align';
import Animate from '../Animate';
import PopupInner from './PopupInner';
import LazyRenderBox from './LazyRenderBox';
import shallowequal from 'shallowequal';

export class Popup extends Component{
  constructor(props){
    super(props);
    this.getTarget=this.getTarget.bind(this);
    this.onAlign=this.onAlign.bind(this);    
    this.saveAlign=this.saveAlign.bind(this);
  }
  static propTypes= {
    visible: PropTypes.bool,
    style: PropTypes.object,
    getClassNameFromAlign: PropTypes.func,
    onAlign: PropTypes.func,
    getRootDomNode: PropTypes.func,
    onMouseEnter: PropTypes.func,
    align: PropTypes.any,
    destroyPopupOnHide: PropTypes.bool,
    className: PropTypes.string,
    prefixCls: PropTypes.string,
    onMouseLeave: PropTypes.func,
  }

  componentDidMount() {
    this.rootNode = this.getPopupDomNode();
  }
  shouldComponentUpdate(nextProps,nextState){
    return (!shallowequal(nextProps, this.props))||(!shallowequal(this.state,nextState));
  }
  onAlign(popupDomNode, align) {
    const props = this.props;
    const alignClassName = props.getClassNameFromAlign(props.align);
    const currentAlignClassName = props.getClassNameFromAlign(align);
    if (alignClassName !== currentAlignClassName) {
      this.currentAlignClassName = currentAlignClassName;
      popupDomNode.className = this.getClassName(currentAlignClassName);
    }
    props.onAlign(popupDomNode, align);
  }

  getPopupDomNode() {
    return ReactDOM.findDOMNode(this.refs.popup);
  }

  getTarget() {
    return this.props.getRootDomNode();
  }

  getMaskTransitionName() {
    const props = this.props;
    let transitionName = props.maskTransitionName;
    const animation = props.maskAnimation;
    if (!transitionName && animation) {
      transitionName = `${props.prefixCls}-${animation}`;
    }
    return transitionName;
  }

  getTransitionName() {
    const props = this.props;
    let transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = `${props.prefixCls}-${props.animation}`;
    }
    return transitionName;
  }

  getClassName(currentAlignClassName) {
    return `${this.props.prefixCls} ${this.props.className} ${currentAlignClassName}`;
  }

  getPopupElement() {
    const props = this.props;
    const { align, style, visible, prefixCls, destroyPopupOnHide } = props;
    const className = this.getClassName(this.currentAlignClassName ||
      props.getClassNameFromAlign(align));
    const hiddenClassName = `${prefixCls}-hidden`;
    if (!visible) {
      this.currentAlignClassName = null;
    }
    const newStyle = {
      ...style,
      ...this.getZIndexStyle(),
    };
    const popupInnerProps = {
      className,
      prefixCls,
      ref: 'popup',
      onMouseEnter: props.onMouseEnter,
      onMouseLeave: props.onMouseLeave,
      style: newStyle,
    };
    if (destroyPopupOnHide) {
      return (<Animate
        component=""
        exclusive
        transitionAppear
        transitionName={this.getTransitionName()}
      >
        {visible ? (<Align
          target={this.getTarget}
          key="popup"
          ref={this.saveAlign}
          monitorWindowResize
          align={align}
          onAlign={this.onAlign}
        >
          <PopupInner
            visible
            {...popupInnerProps}
          >
            {props.children}
          </PopupInner>
        </Align>) : null}
      </Animate>);
    }
    return (<Animate
      component=""
      exclusive
      transitionAppear
      transitionName={this.getTransitionName()}
      showProp="xVisible"
    >
      <Align
        target={this.getTarget}
        key="popup"
        ref={this.saveAlign}
        monitorWindowResize
        xVisible={visible}
        childrenProps={{ visible: 'xVisible' }}
        disabled={!visible}
        align={align}
        onAlign={this.onAlign}
      >
        <PopupInner
          hiddenClassName={hiddenClassName}
          {...popupInnerProps}
        >
          {props.children}
        </PopupInner>
      </Align>
    </Animate>);
  }

  getZIndexStyle() {
    const style = {};
    const props = this.props;
    if (props.zIndex !== undefined) {
      style.zIndex = props.zIndex;
    }
    return style;
  }

  getMaskElement() {
    const props = this.props;
    let maskElement;
    if (props.mask) {
      const maskTransition = this.getMaskTransitionName();
      maskElement = (
        <LazyRenderBox
          style={this.getZIndexStyle()}
          key="mask"
          className={`${props.prefixCls}-mask`}
          hiddenClassName={`${props.prefixCls}-mask-hidden`}
          visible={props.visible}
        />
      );
      if (maskTransition) {
        maskElement = (
          <Animate
            key="mask"
            showProp="visible"
            transitionAppear
            component=""
            transitionName={maskTransition}
          >
            {maskElement}
          </Animate>
        );
      }
    }
    return maskElement;
  }
  saveAlign(align) {
    this.alignInstance = align;
  }

  render() {
    return (<div>
      {this.getMaskElement()}
      {this.getPopupElement()}
    </div>);
  }
}

export default Popup;

