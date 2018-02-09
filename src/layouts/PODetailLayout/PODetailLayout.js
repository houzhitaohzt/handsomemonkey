import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import PODetailsHead from '../../routes/PruchaseOrder/Detail/Header/PODetailsHead'
import DetailCommon from  '../../common/DetailCommon';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,language,pageSize,sizeList} from '../../services/apiCall';
import ServiceTips from '../../components/ServiceTips';

import Detail from  '../../routes/PruchaseOrder/Detail/Content/components/PruchaseOrderDetail';
import Email  from  '../../routes/PruchaseOrder/Email/components/Email';
import Contact from  '../../routes/PruchaseOrder/Contact/components/PruchaseOrderContact';
import Date  from  '../../routes/PruchaseOrder/Date/components/PruchaseOrderDate';
import Print from  '../../routes/PruchaseOrder/Print/components/print';
import Accessory from  '../../routes/PruchaseOrder/Accessory/components/Accessory';
import Annotation  from  '../../routes/PruchaseOrder/Annotation/components/Annotation';
import Share from  '../../routes/PruchaseOrder/Share/components/Share';
export class PODetailLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
			value:{},
			billId:this.props.location.query.id,
			PurOrder:{}, //详情拿到的数据
            curentId:DetailCommon.pruchaseOrder[this.props.location.query.id] || this.props.location.query.index || 'detail',
		};
		this.handleResize=this.handleResize.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
    }
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){
            this.detail.getTableInitData();
            this.setState({
                isDetail:true
            });
        }else if(obj.id == 'email' && !obj.isLoading){
            this.email.getPage();
        }else if(obj.id == 'contact' && !obj.isLoading){
            this.contact.getPages();
        }else if(obj.id == 'date' && !obj.isLoading){
            this.date.getPage();
        }else if(obj.id == 'print' && !obj.isLoading){

        }else if(obj.id == 'accessory' && !obj.isLoading){
            this.accessory.getPage();
        }else if(obj.id == 'annotation' && !obj.isLoading){
            this.annotation.getPage();
        }else if(obj.id == 'share' && !obj.isLoading){
            this.share.getPages();
        }
        DetailCommon.pruchaseOrder[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
    }
    getDetail = (obj) => {
    	apiGet(API_FOODING_ERP,'/purorder/getOne',{billId:this.state.billId},response => {
    		this.setState({PurOrder:response.data,value:response.data},()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            })
    	},error => ServiceTips({text:error.message,type:'error'}))
    }
	handleResize(){
		let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
	};
	componentDidMount(){
		this.getDetail(true);
        let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
		// window.addEventListener('resize', this.handleResize);
    };
	componentWillUnmount() {
    	// window.removeEventListener('resize', this.handleResize);
  	};
	render(){
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{paddingTop:this.state.paddingTop,PurOrder:this.state.PurOrder,value:this.state.value});
		children.props=newProps;
		return (

			<div className='container-body'>
				<PODetailsHead PurOrder={this.state.PurOrder} getDetail={this.getDetail}
							   curentId ={this.state.curentId}
							   id={this.state.id}  onClickLink ={this.onClickLink}
				/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						<div className={this.state.curentId == 'detail' ?"":"none"}>
							<Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
						</div>
						<div className={this.state.curentId == 'email' ?"":"none"}>
							<Email {...newProps} email ={no => this.email = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'contact' ?"":"none"}>
							<Contact {...newProps} contact ={no => this.contact = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'date' ?"":"none"}>
							<Date {...newProps} date ={no => this.date = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'print' ?"":"none"}>
							<Print {...newProps}  />
						</div>
						<div className={this.state.curentId == 'accessory' ?"":"none"}>
							<Accessory {...newProps} accessory ={no => this.accessory = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'annotation' ?"":"none"}>
							<Annotation {...newProps} annotation ={no => this.annotation = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'share' ?"":"none"}>
							<Share {...newProps} share ={no => this.share = no} isDetail ={true} />
						</div>
					</div>
			    </div>
			</div>
			);
	}
}
export default PODetailLayout
