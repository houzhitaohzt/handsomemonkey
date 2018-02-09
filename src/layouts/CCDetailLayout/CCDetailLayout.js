import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import FWDetailsHead from '../../routes/ClientContact/Detail/Header/CCDetailsHead';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../services/apiCall";
import ServiceTips from '../../components/ServiceTips';
import DetailCommon from  '../../common/DetailCommon';

import Detail from  '../../routes/ClientContact/Detail/Content/components/ProviderDetail';
import Email  from  '../../routes/ClientContact/Email/components/Email';
import Activity from  '../../routes/ClientContact/Activity/components/ClientContactActivity';
import Date  from  '../../routes/ClientContact/Date/components/ClientContactDate';
import Contact from '../../routes/ClientContact/Contact/components/ClientContactContact';
import Accessory from  '../../routes/ClientContact/Accessory/components/Accessory';
import Annotation from '../../routes/ClientContact/Annotation/components/Annotation';
export class SVCDetailLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
			value:{},
			detail:{},
			id:this.props.location.query.id,
			sourceId:this.props.location.query.sourceId,
            curentId: DetailCommon.clientContact[this.props.location.query.id] || this.props.location.query.index || 'detail'
		};
		this.onPackUp =this.onPackUp.bind(this);
		this.handleResize=this.handleResize.bind(this);
		this.getDetailData = this.getDetailData.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
    }

    onPackUp(topnum){
		let sch=document.body.offsetHeight-80-topnum;
    	this.setState({
    		paddingTop:topnum,
				scrollHeight:sch+'px',
    	});
    };
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){
            this.detail.getPage();
            this.setState({
                isDetail:true
            });
        }else if(obj.id == 'email' && !obj.isLoading){
            this.email.getPage();
        }else if(obj.id == 'activity' && !obj.isLoading){
            this.activity.getPage();
        }else if(obj.id == 'date' && !obj.isLoading){
            this.date.getPage();
        }else if(obj.id == 'contact' && !obj.isLoading){
            this.contact.getPage();
        }else if(obj.id == 'accessory' && !obj.isLoading){
            this.accessory.getPage();
        }else if(obj.id == 'annotation' && !obj.isLoading){
            this.annotation.getPage();
        }
        DetailCommon.clientContact[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
    }
    getDetailData(obj){
    	let that = this;
    	apiGet(API_FOODING_DS,'/entContact/getDetail',{id:this.state.id,sourceId:this.state.sourceId},(response)=>{
    		that.setState({
    			detail:response.data.entPrisContact,
    			value:response.data
    		},()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            });
    	},(error)=>{
    	})
    }
	handleResize(){
		let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
	};
	componentDidMount(){
        let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
		// window.addEventListener('resize', this.handleResize);
		this.getDetailData(true);
    };
	componentWillUnmount() {
    	// window.removeEventListener('resize', this.handleResize);
  	};
	render(){
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{paddingTop:this.state.paddingTop,getDetailData:this.getDetailData,value:this.state.value,detail:this.state.detail});
		children.props=newProps;
		return (

			<div className='container-body'>
				<FWDetailsHead  onPackUp={this.onPackUp} value={this.state.detail}
								curentId ={this.state.curentId}
								id={this.state.id}  onClickLink ={this.onClickLink}
				/>
			    <div className={'detail-layout__viewport'} 
			    style={{paddingTop:this.state.paddingTop}}>
					<div>
						<div className={this.state.curentId == 'detail'  ?"":"none"}>
							<Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
						</div>
						<div className={this.state.curentId == 'email' ?"":"none"}>
							<Email {...newProps} email ={no => this.email = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'activity' ?"":"none"}>
							<Activity {...newProps} activity ={no => this.activity = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'date' ?"":"none"}>
							<Date {...newProps} date ={no => this.date = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'contact' ?"":"none"}>
							<Contact {...newProps} contact ={no => this.contact = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'accessory' ?"":"none"}>
							<Accessory {...newProps} accessory ={no => this.accessory = no} isDetail ={true} />
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
SVCDetailLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default SVCDetailLayout

