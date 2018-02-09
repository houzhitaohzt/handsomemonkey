import React ,{Component,PropTypes} from 'react';
import {createForm} from '../../../components/Form';
import {I18n} from '../../../lib/i18n';
import RetrieveHead from "./RetrieveHead";
import RetrieveFooter from "./RetrieveFooter";
import RetrieveSetupOne from "./RetrieveSetupOne";//第一步
import RetrieveSetupTwo from "./RetrieveSetupTwo";//第二步
import RetrieveSetupThree from "./RetrieveSetupThree";//第三步
// ajax
import {getQueryString, buildUrl, apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../services/apiCall";
import ServiceTips from '../../../components/ServiceTips';




class RetrievePassword extends Component{
	constructor(props){
		super(props);


		// init Func 
		this.changeTab=this.changeTab.bind(this);
		


		// init state 
		this.state = {
			scrollHeight:0,
			scroll:0,

			tabActive: 'One', // HTML 状态

		};
	}
	
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(0));
		if( getQueryString('token') ) this.setState({ tabActive:'Two' });
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(0));
	}


	handleResize(height){
		let sch=document.body.offsetHeight-80-height;
        let scroll = sch-100;
		this.setState({scrollHeight:sch+'px',scroll:scroll+'px'});
	}


	// 切换 Tab
	changeTab(){
		this.setState({ tabActive:'Three' });
	}

	render(){

		let {tabActive} = this.state;
		switch( tabActive ){
			case 'One' :
				var HTML = <RetrieveSetupOne />;
			break;
			case 'Two' :
				var HTML = <RetrieveSetupTwo  changeTab={this.changeTab}/>;
			break;	
			case 'Three' :
				var HTML = <RetrieveSetupThree />;
			break;
			default:					
		}
		return(<div className={'retrievepassword'}>
				<RetrieveHead />
				<div className={'retrievepassword-content'} style={{height:this.state.scrollHeight}}>
					<div className={'retrievepassword-content-main'} style={{height:this.state.scroll}}>
						{HTML}
					</div>
					<RetrieveFooter/>
				</div>
		</div>)
	}
}
export default RetrievePassword;
