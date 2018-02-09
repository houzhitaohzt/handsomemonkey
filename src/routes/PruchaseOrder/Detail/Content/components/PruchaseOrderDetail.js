import React, { Component,PropTypes } from 'react';
import ProductInformation from "./ProductInformation";//产品信息
import ProviderInformtion from "./ProviderInformation";//供应商信息
import ShippingInformation from "./ShippingInformation";//装运信息
import Organization from "./Organization";//组织
import RequireDetail from "./RequireDetail";//下面的table展示
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';

export class PruchaseOrderDetail extends Component{
	constructor(props){
		super(props);
        props.detail && props.detail(this);
		this.state=this.initState()
	}
	initState(){
		return{
			id:this.props.location.query.id,
			scrollHeight:0,
			billreqirListData:[],//单据
			cardListData:[],//证书要求
			marksListData:[],//麦头
			requireListData:[]//装船要求
		}
	}
	getTableInitData = (billId) => {
		if( !billId) return;
		//单据要求初始化
		apiGet(API_FOODING_ERP,'/purorder/getBillreqirList',{billId:billId},response => {
			this.setState({billreqirListData:response.data})
		},error => ServiceTips({text:error.message,type:'error'}))
		//证书要求
		apiGet(API_FOODING_ERP,'/purorder/getCardList',{billId:billId},response => {
			this.setState({cardListData:response.data})
		},error => ServiceTips({text:error.message,type:'error'}))
		//麦头
		apiGet(API_FOODING_ERP,'/purorder/getMarksList',{billId:billId},response => {
			this.setState({marksListData:response.data})
		},error => ServiceTips({text:error.message,type:'error'}))
		//装船要求
		apiGet(API_FOODING_ERP,'/purorder/getRequireList',{billId:billId},response => {
			this.setState({requireListData:response.data})
		},error => ServiceTips({text:error.message,type:'error'}))
	}

	componentDidMount(){
		// this.getTableInitData(this.props.location.query.id);
        // window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        let padding = 233;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        // window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
        if(this.props.location.query.id !== nextProps.location.query.id){
        	let billId = nextProps.location.query.id;
        	this.setState({id:billId},() =>this.getTableInitData(billId) )
        }
    }
	render(){
		let purorderData = this.props.PurOrder;
		return(<div className='activity-detail scroll' style={{height:this.state.scrollHeight,overflowY:"auto"}}>
			<ProductInformation purorderData={purorderData} />
			<ProviderInformtion purorderData={purorderData}/>
			<ShippingInformation purorderData={purorderData}/>
			<Organization purorderData={purorderData}/>
			<RequireDetail billreqirListData={this.state.billreqirListData} cardListData={this.state.cardListData} marksListData={this.state.marksListData} requireListData={this.state.requireListData} billId={this.state.id}/>
		</div>)
	}
}
export default PruchaseOrderDetail;
