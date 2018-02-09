import React ,{Component,PropTypes} from 'react';
import RegisterFooter from "../../RetrievePassword/components/RetrieveFooter";
import i18n from '../../../lib/i18n';

class RegisterFail extends Component{
	constructor(props){
		super(props)
		this.state = this.initState()
	}
	initState(){
		return{
			scrollHeight:0,
			scroll:0,
		}
	}
	handleResize(height){
		let sch=document.body.offsetHeight-100-height;
        let scroll = sch-100;
		this.setState({scrollHeight:sch+'px',scroll:scroll+'px'});
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(0));
	}
	render(){
		return(<div className={'register'}>
			<div className={'register-content'} style={{height:this.state.scrollHeight}}>
				<div className={'register-content-single-fail'}>
					<div className={'register-content-single-fail-gonration'}>
						<i className={'foddingicon fooding-dui-icon2'}></i>
						<span>{i18n.t(600141/*抱歉,链接已失效*/)}</span>
					</div>
					<div className={'register-content-single-fail-email'}>
						<span>{i18n.t(600142/*重新注册*/)}</span>
					</div>
				</div>
			</div>
			<RegisterFooter footerClassName={'register-foot'} />
		</div>)
	}
}
export default RegisterFail;
