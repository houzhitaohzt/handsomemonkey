import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import PlatFProviderHead from '../../routes/PlatFormProvider/Detail/Header/PlatFProviderHead'
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../services/apiCall";

class PlatProviderLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
			id:this.props.location.query.id,
			valueone:{},			
		};		
		this.initObj=this.initObj.bind(this);
		this.handleResize=this.handleResize.bind(this);
    }
	 //进入详情初始化数据
    initObj = () => {
        apiGet(API_FOODING_ES,"/party/getRegisterInfo",{partyId:this.state.id}, (response) => {
        	let valueone = response.data.party;
            this.setState({ valueone })
        },(error) => {
            console.log(error.message)
        })
    };
	handleResize(){
		let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
	};
	componentDidMount(){
		this.initObj();
        let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
		window.addEventListener('resize', this.handleResize);
    };
    componentWillReceiveProps(nextProps){
    	let id = nextProps.location.query?nextProps.location.query.id:"";
    	if(id && this.props.location.query.id != id){
    		this.setState({id:id},() => this.initObj())
    	}
    }
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize);
  	};
	render(){
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{paddingTop:this.state.paddingTop,valueone:this.state.valueone});
		children.props=newProps;
		return (
			<div className='container-body'>
				<PlatFProviderHead valueone={this.state.valueone}/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						{children}
					</div>
			    </div>
			</div>
		);
	}
}
PlatProviderLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default PlatProviderLayout;

