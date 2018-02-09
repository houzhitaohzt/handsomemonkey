import i18n from './../../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../../components/Page";//分页
import Dialog from '../../../../../components/Dialog/Dialog';//弹层
import Confirm from '../../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import Checkbox from '../../../../../components/CheckBox';
import ServiceTips, {errorTips, successTips} from "../../../../../components/ServiceTips";//提示框
import {permissionsBtn,apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS, language} from '../../../../../services/apiCall';
import xt from '../../../../../common/xt';

import Filter from "./Filter";

class SupplieDetail extends Component{
	constructor(props){
		super(props);
        props.detail && props.detail(this);
		this.columns = [];
		this.getPages=this.getPages.bind(this);
		this.state = {
			showDilaog:false,
			scrollHeight:0,
			record: [],
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
            filter:null,
           	platformMtlId:this.props.location.query?this.props.location.query.id:""
		}
		this.filterData = {};
	}
	serchClick = value => {//表格上面的搜索条件
		this.setState({filter:value},()=>this.getPages(1,null,value));
	}
	cleanClick = () => {//表格上面的清空搜索条件
		this.setState({filter:null},() => this.getPages(1));
	}
	getPages(currentPage, size, filter, order) {
        filter = filter || this.state.filter;
        order = order || {column: 'billId', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || this.state.currentPage;
        size = size || page.size;
        //591ba56345ce8215d0a3d785
        let params = Object.assign({}, {currentPage: currentPage, pageSize: size, platformMtlId:this.state.platformMtlId, forSaleOrPurchase:0}, filter, order, this.filterData);
        apiGet(API_FOODING_DS, '/platformMaterial/getVendorsOrCustomers', params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
            this.setState({
                record: data || [],
                page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            });
        }, error => {
            errorTips(error.message)
        });
    }
    //收藏
    collectionClick = data => {
    	apiForm(API_FOODING_DS,"/beMtl/leadInBeMtl",{sourceId:data.id,pmtlId:this.state.platformMtlId,dataTyId:50},response => {
    		ServiceTips({text:response.message,type:"success"});
    		this.getPages();
    	},error => ServiceTips({text:error.message,type:"error"}))
    }
    enquirieClick = data => {
    	let that = this;
    	if(!that.state.platformMtlId || !data.id) return false;
    	///sendenquiry/platMtlToEnquiry replace /inquiry/platMtlToInquiry
    	apiGet(API_FOODING_ERP,"/inquiry/platMtlToInquiry",{mtlId:that.state.platformMtlId,vndBeId:data.id},response => {
    		let num = response.data;
    		let name = i18n.t(200016/*编辑发出的询盘*/) +'(' + num + ")";
    		let {navAddTab,navRemoveTab} = that.props;
			navRemoveTab({name:name,component:name,url:'/sendinquiry/edit/' + num});
			navAddTab({name:name,component:name,url:'/sendinquiry/edit/' + num});
			that.props.router.push({pathname:'/sendinquiry/edit/' + num, query:{id:num}});

    	},error => ServiceTips({text:error.message,type:"error"}))
    }
    LinkClick = data => {
    	let {navAddTab,navRemoveTab} =this.props;
		navRemoveTab({name:i18n.t(200545/*平台供应商*/),component:i18n.t(200545/*平台供应商*/),url:'/platform/provider/detail'});
		navAddTab({name:i18n.t(200545/*平台供应商*/),component:i18n.t(200545/*平台供应商*/),url:'/platform/provider/detail'});
		this.props.router.push({pathname:'/platform/provider/detail',query:{id:data.id}});
    }
	handleResize(height){
		let sch=document.body.offsetHeight-250;
		let scroll=sch-80;
		this.setState({scrollHeight:sch+'px',scroll:scroll + "px"});
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(100));
		if(!this.props.isDetail){
            // this.getPages();
		}
    };
    componentWillReceiveProps(nextProps){
    	let id = nextProps.location.query?nextProps.location.query.id:"";
    	if(id && this.props.location.query.id != id){
    		this.setState({platformMtlId:id},() => this.getPages(1))
    	}
    }
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(100));
	}
	render(){
		const {page, record} = this.state;
		return(<div>
			<div className={'clientcontact-list-body'} style={{height:this.state.scrollHeight}}>
				<div className={'clientcontact-list-body-single'}>
					<div className={'keys-page'}>
						<Filter serchClick={this.serchClick} cleanClick={this.cleanClick}/>
						<Page totalPages={page.totalPages}
                              currentPage={page.currentPage}
                              totalRecords={page.totalRecords}
                              sizeList={[20, 50, 200]}
                              currentSize={page.size}
                              pageSizeChange={(value) => {
                                  let {page} = this.state;
                                  if (page.size == value) {
                                      return;
                                  }
                                  this.getPages(page.currentPage, value);
                              }} backClick={(v) => {
	                            let {page} = this.state;
	                            if (page.currentPage == v) {
	                                return;
	                            }
	                            this.getPages(v);
	                        }} nextClick={(v) => {
	                            let {page} = this.state;
	                            if (page.currentPage == v) {
	                                return;
	                            }
	                            this.getPages(v);
	                        }}
	                              goChange={(v) => {
	                                  let {page} = this.state;
	                                  if (page.currentPage == v) {
	                                      return;
	                                  }
	                                  this.getPages(v);
	                              }}
                        />
					</div>
					<div className="line"></div>
					<div className="train-action-buttons scroll" style={{width:"100%",height:this.state.scroll}}>
						{
							record.map((dataItem,i)=>{
								return(
									<div className="train" key={i}>
										<div className="top">
											<span style={{flex:11}}>
												<span style={{color:'#5594ea',cursor:'pointer'}} onClick={this.LinkClick.bind(this,dataItem)}>
													{dataItem['localName']}		
												</span>
											</span>
											<span style={{flex:1,margin:'0px 5px'}}>
												<span style={{color:'#fff',cursor:'pointer',backgroundColor:"red",textAlign:'center',borderRadius:"6px",lineHeight:"2",padding:"0 4px"}} onClick={this.collectionClick.bind(this,dataItem)}>{i18n.t(200543/*收藏*/)}</span>
											</span>			
										</div>
										<div className="bottom">
											<span style={{flex:3}}>
												<span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(100371/*网站*/)}</span>
												<span style={{color:'#000033'}}>{dataItem.defaultWeb&&dataItem.defaultWeb.localName?dataItem.defaultWeb.localName:""}</span>
											</span>
											<span style={{flex:3}}>
												<span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(100229/*邮箱*/)}</span>
												<span style={{color:'#000033'}}>{dataItem.defaultEmail&&dataItem.defaultEmail.localName?dataItem.defaultEmail.localName:""}</span>
											</span>
											<span style={{flex:3}}>
												<span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(100478/*电话*/)}</span>
												<span style={{color:'#000033'}}>{dataItem.defaultTel&&dataItem.defaultTel.localName?dataItem.defaultTel.localName:""}</span>
											</span>
											<span style={{flex:3}}>
												<span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(100479/*传真*/)}</span>
												<span style={{color:'#000033'}}>{dataItem.defaultFax&&dataItem.defaultFax.localName?dataItem.defaultFax.localName:""}</span>
											</span>
											<span style={{flex:1,margin:'0px 20px'}}>
												<span style={{color:'#fff',backgroundColor:"#5594ea",cursor:'pointer',textAlign:'center',borderRadius:"6px",letterSpacing:"5px",lineHeight:"2.5",padding:"0 4px"}} onClick={this.enquirieClick.bind(this,dataItem)}>{i18n.t(200546/*询盘*/)}</span>
											</span>
										</div>
									</div>
									)
							})
						}
					</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(SupplieDetail);
