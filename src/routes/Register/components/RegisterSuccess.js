import React ,{Component,PropTypes} from 'react';
import RegisterFooter from "../../RetrievePassword/components/RetrieveFooter";
import i18n from '../../../lib/i18n';

class RegisterSuccess extends Component{
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
				<div className={'register-content-single-success'}>
					<div className={'register-content-single-success-gonration'}>
						<i className={'foddingicon fooding-dui-icon2'}></i>
						<span style={{fontSize:'23px'}}>{i18n.t(600150/*恭喜,注册成功*/)}</span>
					</div>
					<div className={'register-content-single-success-tip'}>
						{i18n.t(600151/*请您在您的邮箱中点击激活链接来激活您的账号*/)}
					</div>
					<div className={'register-content-single-success-email'}>
						{/*<a href={this.props['getOneData']} target='_blank'>进入邮箱</a>*/}
					</div>
				</div>
			</div>
			<RegisterFooter footerClassName={'register-foot'} />
		</div>)
	}
}
export default RegisterSuccess;
