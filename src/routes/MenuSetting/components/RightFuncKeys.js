import React, { Component,PropTypes } from 'react';
import Confirm from '../../../components/Dialog/Confirm';
class RightFuncKeys extends Component{
    constructor(props){
        super(props)
    }
    render(){
        let {iconArray,x,y} = this.props;
        let dom = iconArray.map((e,i) => {
            return (<div className={'single'} key={i} onClick={this.props.handClick.bind(this,e.action)}><i className={e.classn}></i><span>{e.action}</span></div>)
        })
        return(<div className={'right-func-keys'} style={{top:y+'px',left:x+'px'}} onBlur={this.props.onBlur} id={'rightfunckeymenu'} tabIndex="-1">
            {dom}
        </div>)
    }
}
export default RightFuncKeys;