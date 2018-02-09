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

class ProCustomer extends Component{
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
            ccid:this.props.location.query?this.props.location.query.id:""
		};
		this.filterData = {};
	}
	getPages(currentPage, size, filter, order) {
        filter = filter || this.state.filter;
        order = order || {column: 'billId', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || this.state.currentPage;
        size = size || page.size;
        let params = Object.assign({}, {currentPage: currentPage, pageSize: size, ccid:this.state.ccid, forSaleOrPurchase:0}, filter, order, this.filterData);
        apiGet(API_FOODING_DS, '/material/platform/getPage', params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
            this.setState({
                record: data || [],
                page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            });
        }, error => {
            errorTips(error.message)
        });
    }
    enquirieClick = () => {
    	//console.log(i18n.t(200860/*立即询盘*/))
    }
	handleResize(height){
		let sch=document.body.offsetHeight-250;
		let scroll=sch-80;
		this.setState({scrollHeight:sch+'px',scroll:scroll + "px"});
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(0));
		// this.getPages();
    };
    componentWillReceiveProps(nextProps){
    	let id = nextProps.location.query?nextProps.location.query.id:"";
    	if(id && this.props.location.query.id != id){
    		this.setState({ccid:id},() => this.getPages(1))
    	}
    }
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(0));
	}
	render(){
		const {page, record} = this.state;
		return(<div>
			<div className={'clientcontact-list-body'} style={{height:this.state.scrollHeight}}>
				<div className={'clientcontact-list-body-single'}>
				
					<div className={'keys-page'}>
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
					<div className="train-action-buttons scroll" style={{height:this.state.scroll}}>
						{
							record.map((dataItem,i)=>{
								return(
									<div className="train" key={i}>
										<div className="top">
											<span style={{flex:2}}>
												<span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(200861/*产品代码*/)}</span>
												<span style={{color:'#000033'}}>{dataItem.code || ""}</span>
											</span>
											<span style={{flex:3}}>
												<span style={{color:'#5594ea',cursor:'pointer'}}>
													{dataItem.localName || ""}		
												</span>
											</span>
											<span style={{flex:2}}>
												<span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(100226/*英文名称*/)}</span>
												<span style={{color:'#000033'}}>{dataItem.enName}</span>
											</span>		
										</div>
										<div className="bottom">
											<span style={{flex:10,display:"inline-flex"}}>
												<span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(200557/*规格*/)}</span>
												<span style={{color:'#000033',whiteSpace:"nowrap",textOverflow:"ellipsis",overflow:"hidden",width:"600px"}} title={dataItem.specTxt || ""}>{dataItem.specTxt || ""}</span>
											</span>
											<span style={{flex:1,color:'#fff',backgroundColor:"#5594ea",cursor:'pointer',margin:'5px 20px',textAlign:'center',borderRadius:"6px",letterSpacing:"10px",lineHeight:"2.5"}} onClick={this.enquirieClick.bind(this)}>{i18n.t(200860/*立即询盘*/)}</span>
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
export default ProCustomer;
