import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import Header from '../../components/Header';
import SystemSetHead from '../../routes/MailCenter/Head/MailCenterHeader';


export class SystemSetLayout extends Component{
	constructor(props) {
		super(props);
    }
	render(){
		let children=Object.assign({},this.props.children,{});
		return (
			<div className='system-set'>
				<SystemSetHead />
			    <div className={'system-set-single-viewport'}>
					<div>
						{children}
					</div>
			    </div>
			</div>
			);
	}
}
SystemSetLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default SystemSetLayout;

