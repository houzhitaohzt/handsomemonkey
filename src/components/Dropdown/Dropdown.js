import React, { PropTypes,Component } from 'react';
import ReactDOM from 'react-dom';
import Trigger from '../Trigger';
import shallowequal from 'shallowequal';
//import Trigger from 'rc-trigger';
import placements from './placements';

/*
 var MenuItem = Menu.Item;
 var menu = <Menu><MenuItem>1</MenuItem></Menu>;
 <DropDown trigger="click" animationName="" overlay={<>} onSelect={}>
 <button>open</button>
 </DropDown>
*/

export class Dropdown extends Component{
  
  constructor(props){
      super(props);
      this.state=this.initialState();
      this.onClick=this.onClick.bind(this);
      this.onVisibleChange=this.onVisibleChange.bind(this);  
      this.afterVisibleChange=this.afterVisibleChange.bind(this);    
  }

  initialState() {
    const props = this.props;
    if ('visible' in props) {
      return {
        visible: props.visible,
      };
    }
    return {
      visible: props.defaultVisible,
    };
  }

  componentWillReceiveProps({ visible }) {
    if (visible !== undefined) {
      this.setState({
        visible,
      });
    }
  }

  onClick(e) {
    const props = this.props;
    const overlayProps = props.overlay.props;
    // do no call onVisibleChange, if you need click to hide, use onClick and control visible
    if (!('visible' in props)) {
      this.setState({
        visible: false,
      });
    }
    if (overlayProps.onClick) {
      overlayProps.onClick(e);
    }
  }

  onVisibleChange(visible) {
    const props = this.props;
    if (!('visible' in props)) {
      this.setState({
        visible,
      });
    }
    props.onVisibleChange(visible);
  }

  getMenuElement() {
    const props = this.props;
    return React.cloneElement(props.overlay, {
      prefixCls: `${props.prefixCls}-menu`,
      onClick: this.onClick,
    });
  }

  getPopupDomNode() {
    return this.refs.trigger.getPopupDomNode();
  }
  shouldComponentUpdate(nextProps,nextState){
    return (!shallowequal(nextProps, this.props))||(!shallowequal(this.state,nextState));
  }
  afterVisibleChange(visible) {
    if (visible && this.props.minOverlayWidthMatchTrigger) {
      const overlayNode = this.getPopupDomNode();
      const rootNode = ReactDOM.findDOMNode(this);
      if (rootNode.offsetWidth > overlayNode.offsetWidth) {
        overlayNode.style.width = `${rootNode.offsetWidth}px`;
      }
    }
  }

  render() {
    const {
      prefixCls, children,
      transitionName, animation,
      align, placement, getPopupContainer,
      showAction, hideAction,
      overlayClassName, overlayStyle,
      trigger, ...otherProps,
    } = this.props;
    return (<Trigger
      {...otherProps}
      prefixCls={prefixCls}
      ref="trigger"
      popupClassName={overlayClassName}
      popupStyle={overlayStyle}
      builtinPlacements={placements}
      action={trigger}
      showAction={showAction}
      hideAction={hideAction}
      popupPlacement={placement}
      popupAlign={align}
      popupTransitionName={transitionName}
      popupAnimation={animation}
      popupVisible={this.state.visible}
      afterPopupVisibleChange={this.afterVisibleChange}
      popup={this.getMenuElement()}
      onPopupVisibleChange={this.onVisibleChange}
      getPopupContainer={getPopupContainer}
      destroyPopupOnHide={otherProps.destroyPopupOnHide}
    >{children}</Trigger>);
  }
}

Dropdown.propTypes={
    minOverlayWidthMatchTrigger: PropTypes.bool,
    onVisibleChange: PropTypes.func,
    prefixCls: PropTypes.string,
    children: PropTypes.any,
    transitionName: PropTypes.string,
    overlayClassName: PropTypes.string,
    animation: PropTypes.any,
    align: PropTypes.object,
    overlayStyle: PropTypes.object,
    placement: PropTypes.string,
    trigger: PropTypes.array,
    showAction: PropTypes.array,
    hideAction: PropTypes.array,
    getPopupContainer: PropTypes.func,
    destroyPopupOnHide:PropTypes.bool
  }

Dropdown.defaultProps= {    
      minOverlayWidthMatchTrigger: true,
      prefixCls: 'rc-dropdown',
      trigger: ['hover'],
      showAction: [],
      hideAction: [],
      overlayClassName: '',
      overlayStyle: {},
      defaultVisible: false,
      onVisibleChange() {
      },
      placement: 'bottomCenter',    
      destroyPopupOnHide:false
  }

export default Dropdown;
