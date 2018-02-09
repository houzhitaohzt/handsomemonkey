import React, { Component,PropTypes } from 'react';
import Confirm from '../../../components/Dialog/Confirm';
class RightFuncKeys extends Component{
	constructor(props){
		super(props)
	}
    static defaultProps = {
        id:"rightfunckeyproductcategory"
    };
    static PropTypes = {
        id:React.PropTypes.string
    };

    isFixedPos = () => {
    	let {x,y,iconArray} = this.props;
    	let curX = document.documentElement.clientWidth;
    	let curY = document.documentElement.clientHeight;
    	let len = (iconArray.length || 0) * 36 + 12;
    	if(x + 120 > curX){
    		x = curX - 120;
		}
		if(y + len > curY) {
    		y = curY - len;
		}
    	return {x,y}
	};

	render(){
		let {iconArray} = this.props;
		let pos = this.isFixedPos();
		let dom = iconArray.map((e,i) => {
			return (<div className={'single'} key={i}  onClick={this.props.handClick.bind(this,e.action,e.type)}><i className={e.classn}></i><span>{e.action || e.title}</span></div>)
		});
		return(<div className={'right-func-keys'} ref={"rightkeykey"} style={{top:pos.y + 'px',left:pos.x + 'px'}} onBlur={this.props.onBlur} id={this.props.id} tabIndex="-1">
				{dom}
			</div>)
	}
}
export default RightFuncKeys;
