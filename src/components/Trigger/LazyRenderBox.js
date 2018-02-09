import React, { PropTypes,Component } from 'react';

export class LazyRenderBox extends Component{
  constructor(props){
    super(props);
  }
  static propTypes= {
    children: PropTypes.any,
    className: PropTypes.string,
    visible: PropTypes.bool,
    hiddenClassName: PropTypes.string,
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.hiddenClassName || nextProps.visible;
  }
  render() {
    const { hiddenClassName, visible, ...props } = this.props;

    if (hiddenClassName || React.Children.count(props.children) > 1) {
      if (!visible && hiddenClassName) {
        props.className += ` ${hiddenClassName}`;
      }
      return <div {...props}/>;
    }

    return React.Children.only(props.children);
  }
}

export default LazyRenderBox;

