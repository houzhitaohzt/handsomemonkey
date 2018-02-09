import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import SODetailsHead from '../../routes/MarkeSeale/Detail/Header/MarkeDetailsHead';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList } from "../../services/apiCall";
import ServiceTips from '../../components/ServiceTips';

import DetailCommon from  '../../common/DetailCommon';
import Detail from  '../../routes/MarkeSeale/Detail/Content/components/SalesOrderDetail';
import Date  from  '../../routes/MarkeSeale/Date/components/MarkeDate';
import Contact from  '../../routes/MarkeSeale/Contact/components/MarkeContact';
export class SODetailLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
			id:this.props.location.query.id,
			getOne:{},
			curentId:DetailCommon.marke[this.props.location.query.id] || this.props.location.query.index || 'detail',
		};
		this.onPackUp =this.onPackUp.bind(this);
		this.handleResize=this.handleResize.bind(this);

		// init func 
		this.getPage = this.getPage.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
    }
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){

        }else if(obj.id == 'date' && !obj.isLoading){
            this.date.getPage();
        }else if(obj.id == 'contact' && !obj.isLoading){
            this.contact.getPage();
        }
        DetailCommon.marke[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
    }
    onPackUp(topnum){
		let sch=document.body.offsetHeight-80-topnum;
    	this.setState({
    		paddingTop:topnum,
				scrollHeight:sch+'px',
    	});
    };
	handleResize(){
		let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
	};
	componentDidMount(){
        let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
		// window.addEventListener('resize', this.handleResize);
		this.getPage(true);
    };
	componentWillUnmount() {
    	// window.removeEventListener('resize', this.handleResize);
  	};

	getPage(obj){
    	apiGet(API_FOODING_ERP,'/activity/getOne',{billId:this.state.id},
		(response)=>{
			this.setState({
				getOne:response.data
			},()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            });
		},(error)=>{

		})
	}

	render(){
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{paddingTop:this.state.paddingTop,getOne:this.state.getOne,id:this.state.id});
		children.props=newProps;
		return (

			<div className='container-body'>
				<SODetailsHead 
					onPackUp={this.onPackUp}
					getOne={this.state.getOne}
					getPage={this.getPage}
					curentId ={this.state.curentId}
					id={this.state.id}  onClickLink ={this.onClickLink}
				/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						<div className={this.state.curentId == 'detail' ?"":"none"}>
							<Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
						</div>
						<div className={this.state.curentId == 'date' ?"":"none"}>
							<Date {...newProps} date ={no => this.date = no} isDetail ={true}  />
						</div>
						<div className={this.state.curentId == 'contact' ?"":"none"}>
							<Contact {...newProps} contact ={no => this.contact = no} isDetail ={true}  />
						</div>
					</div>
			    </div>
			</div>
			);
	}
}
SODetailLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default SODetailLayout

