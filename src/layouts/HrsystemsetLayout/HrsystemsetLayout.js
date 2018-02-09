import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom';
// import './index.less';
import Header from '../../components/Header';
import Hrsystemsethead from '../../routes/Hrsystemsetting/Head/Hrsystemsethead';


export class HrsystemsetLayout extends Component{
	constructor(props) {
		super(props);
    }
	render(){
		let children=Object.assign({},this.props.children,{});
		return (
			<div className='system-set'>
				 <Hrsystemsethead />
			    <div className={'system-set-single-viewport'}>
					<div>
						{children}
					</div>
			    </div>
			</div>
			);
	}
}
HrsystemsetLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default HrsystemsetLayout;
