import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
const {Table} = require("../../../../components/Table");
import Page from "../../../../components/Page"
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import ServiceTips from '../../../../components/ServiceTips';
export class Customer extends Component{
			constructor(props){
			super(props);
			props.customer && props.customer(this);
			let that= this;
		this.columns = [{
			title : i18n.t(100355/*客户名称*/),
			dataIndex : 'localName',
			key : "localName",
			width : '35%',
			render(data,row,index){
				return data || "";
			}
		},{
			title : i18n.t(100341/*所属国家*/),
			dataIndex : "country",
			key : "country",
			width : "30%",
			render(data,row,index){
				return data || "";
			}
		},{
			title : i18n.t(200866/*最新更新日期*/),
			dataIndex : "updateDate",
			key : "updateDate",
			width : "30%",
			render(data,row,index){
				return  new Date(data).Format('yyyy-MM-dd');
			}
		}];
		this.state = {
			rodalShow:false ,
			title:'',
			scroll:0,
			paddingTop:0,
			selectArr:[],
			checkedRows:[],
			checkedData:'',
			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
			data : [],
			platformMtlId:this.props.location.query.id
		}
	}
	handleResize(height){
  		let padding = 230;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	getPages(currentPage,size,filter,order){
		filter=filter||{};
		order=order||{column:'id',order:'desc'};
		let {page}=this.state;
		currentPage = currentPage||this.state.currentPage;
		size=size||this.state.pageSize;
		let params=Object.assign({},{platformMtlId:this.state.platformMtlId,forSaleOrPurchase:1,dataTyId:25,currentPage:currentPage,pageSize:size},filter,order,this.filterData);
		apiGet(API_FOODING_DS,'/platformMaterial/getVendorsOrCustomers',params,(response)=>{
			this.setState({
				data:response.data.data,
				pageSize:response.data.pageSize,
				totalPages:response.data.totalPages,
				currentPage:response.data.currentPage,
				totalRecords:response.data.totalRecords
			})
		},error =>{
			ServiceTips({text: error.message,type:'error'});
		});
	}
	componentDidMount(){
        this.handleResize(0);
        if(!this.props.isDetail){
            this.getPages();
		}
		window.addEventListener('resize', this.handleResize(0));
    };
    componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}
	render(){
		return (
				<div className="client-body" style = {{height:this.state.scrollHeight}}>
					<div className='content-margin'></div>
					<div className="client-body-single">
					<div className='client-buttons'>
						<div className={'key-page'}>
							<Page 
								currentPage={this.state.currentPage}
								totalPages={this.state.totalPages} 
								sizeList={sizeList}
								currentSize={this.state.pageSize}
								pageSizeChange={(num)=>{	
									if(this.state.currentPage == num) return;				
									this.getPages(this.state.currentPage,num);
								}} 
								backClick={(num)=>{
									if(this.state.currentPage == num) return;
									this.getPages(num);
								}} 
								nextClick={(num)=>{
									if(this.state.currentPage == num) return;
									this.getPages(num);									
								}}
								goChange={(num)=>{
									if(this.state.currentPage == num) return;
									this.getPages(num);									
								}}								
							/>
						</div>
						<Table
								columns={this.columns}
								scroll={{x:true,y:this.state.scroll}}
								data={this.state.data}
								checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
								colorFilterConfig={{show : false}}
								followConfig={{show:false}}
								style={{width:'100%'}}
						/>
					</div>
					</div>
				</div>
			);
	}

}
export default NavConnect(Customer);
