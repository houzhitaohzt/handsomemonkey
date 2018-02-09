import React,{Component} from 'react';
import Checkbox from '../../CheckBox';
import "../asset/index.less"

export default class Radio extends Component{
  static defaultProps= {
      prefixCls: 'rc-radio',
      type: 'radio'
  }

  render() {
    return <Checkbox {...this.props} ref="checkbox"/>;
  }
}

