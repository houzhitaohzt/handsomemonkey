import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import ProductHead from '../../routes/EnterprisePlatProduct/Detail/Header/PDetailsHead'
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../services/apiCall";


import DetailCommon from  '../../common/DetailCommon';

import Detail from  '../../routes/EnterprisePlatProduct/Detail/Content/components/Supplie';
import Client from  '../../routes/EnterprisePlatProduct/Customer/components/EnterprisePlatCustomer';
import Annotation  from  '../../routes/EnterprisePlatProduct/Annotation/components/Annotation';
class EnterprisePlatProLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
			id:this.props.location.query.id,
			valueone:{},
            curentId:DetailCommon.enterprisePlatProduct[this.props.location.query.id] || this.props.location.query.index || 'detail'
		};		
		this.initObj=this.initObj.bind(this);
		this.handleResize=this.handleResize.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
    }
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){
            this.detail.getPages();
            this.setState({
                isDetail:true
            });
        }else if(obj.id == 'client' && !obj.isLoading){
            this.client.getPages();
        }else if(obj.id == 'annotation' && !obj.isLoading){
            this.annotation.getPage();
        }
        DetailCommon.enterprisePlatProduct[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
    }
	 //进入详情初始化数据
    initObj = (obj) => {
        apiGet(API_FOODING_DS,"/platformMaterial/getOne",{id:this.state.id}, (response) => {
        	let valueone = response.data;
            this.setState({ valueone },()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            })
        },(error) => {
            console.log(error.message)
        })
    };
	handleResize(){
		let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
	};
	componentDidMount(){
		this.initObj(true);
        let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
		// window.addEventListener('resize', this.handleResize);
    };
    componentWillReceiveProps(nextProps){
    	let id = nextProps.location.query?nextProps.location.query.id:"";
    	if(id && this.props.location.query.id != id){
    		this.setState({id:id},() => this.initObj())
    	}
    }
	componentWillUnmount() {
    	// window.removeEventListener('resize', this.handleResize);
  	};
	render(){
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{paddingTop:this.state.paddingTop,valueone:this.state.valueone});
		children.props=newProps;
		return (
			<div className='container-body'>
				<ProductHead valueone={this.state.valueone}  curentId ={this.state.curentId}
							 id={this.state.id}  onClickLink ={this.onClickLink}/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						<div className={this.state.curentId == 'detail' ?"":"none"}>
							<Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
						</div>
						<div className={this.state.curentId == 'client' ?"":"none"}>
							<Client {...newProps} client ={no => this.client = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'annotation' ?"":"none"}>
							<Annotation {...newProps} annotation ={no => this.annotation = no} isDetail ={true} />
						</div>
					</div>
			    </div>
			</div>
			);
	}
}
EnterprisePlatProLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default EnterprisePlatProLayout

