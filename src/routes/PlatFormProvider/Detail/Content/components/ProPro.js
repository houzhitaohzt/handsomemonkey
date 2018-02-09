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
import {I18n} from "../../../../../lib/i18n";
import JisuanPricePlug from './JisuanPricePlug';
class ProPro extends Component{
	constructor(props){
		super(props);
		this.columns = [];
		this.getPages=this.getPages.bind(this);
		this.state = {
			showDilaog:false,
            showSaveAdd:false,
            showSaveClose:true,
            contentTemplate:<div></div>,
			scrollHeight:0,
			record: [],
            records:{},
            checkedData:'',
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
            filter:null,
            ccid:this.props.location.query?this.props.location.query.id:"",
            platformMtlId:this.props.location.query?this.props.location.query.mtleId:""
		}
		this.filterData = {};
        this.onCancel=this.onCancel.bind(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.getPage =this.getPage.bind(this);
        this.getPages =this.getPages.bind(this);
	}
	getPages(currentPage, size, filter, order) {
        filter = filter || this.state.filter;
        order = order || {column: 'billId', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || this.state.currentPage;
        size = size || page.size;
        let params = Object.assign({}, {currentPage: currentPage, pageSize: size, ccid:this.state.ccid, forSaleOrPurchase:1}, filter, order, this.filterData);
        apiGet(API_FOODING_DS, '/material/vndMaterial/getPage', params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
            this.setState({
                record: data || [],
                page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            });
        }, error => {
            errorTips(error.message)
        });
    }
    getPage(){
        apiGet(API_FOODING_DS, '/material/getVndMaterial', {platformMtlId:this.state.platformMtlId,ccid:this.state.ccid}, (response) => {
            this.setState({
                records: response.data || {},
            });
        }, error => {
            errorTips(error.message)
        });
    }
    enquirieClick = data => {
    	/*let that = this;
    	if(!that.state.ccid || !data.platformMtlId) return false;
    	///sendenquiry/platMtlToEnquiry replace /inquiry/platMtlToInquiry
    	apiGet(API_FOODING_ERP,"/inquiry/platMtlToInquiry",{mtlId:data.platformMtlId,vndBeId:that.state.ccid},response => {
    		let num = response.data;
    		let name = i18n.t(200016*//*编辑发出的询盘*//*)+'(' + num + ")";
    		let {navAddTab,navRemoveTab} = that.props;
			navRemoveTab({name:name,component:name,url:'/sendinquiry/edit/' + num});
			navAddTab({name:name,component:name,url:'/sendinquiry/edit/' + num});
			that.props.router.push({pathname:'/sendinquiry/edit/' + num, query:{id:num}});

    	},error => ServiceTips({text:error.message,type:"error"}))*/
        ServiceTips({text:'前端待开发',type:'error'});
    }
    jisuanClick = data =>{
        this.setState({
            showDilaog : true,
            showHeader:true,
            showSaveClose:false,
            showSaveAdd:false,
            DialogContent:1,
            checkedData:data || record,
            title:I18n.t(500428/*计算价格*/)

        })
	}
	handleResize(height){
        let platformMtlId = this.state.platformMtlId;
		if(platformMtlId){
            let sch=document.body.offsetHeight-350;
            let scroll=sch-80;
            this.setState({scrollHeight:sch+'px',scroll:scroll + "px"});
        }else{
            let sch=document.body.offsetHeight-250;
            let scroll=sch-80;
            this.setState({scrollHeight:sch+'px',scroll:scroll + "px"});
        }


	}
	componentDidMount(){

		window.addEventListener('resize', this.handleResize(0));

		let platformMtlId = this.state.platformMtlId;
		if(platformMtlId){
            this.getPage();
            this.getPages();
        }else{
            this.getPages();
        }

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
    onCancel(that){
        this.setState({
            showDilaog:false
        })
    }
    onSaveAndClose(value,data,isAdd){
        var that = this;
        value=Object.assign({},data,value);
        apiPost(API_FOODING_DS,'/cstmCrsekt/save',value,(response)=>{
            that.setState({
                rodalShow:!!isAdd
            })
            ServiceTips({text:response.message,type:'success'});
            this.getPage();
        },(errors)=>{
            ServiceTips({text:errors.message,type:'error'});
            that.setState({
                rodalShow:!!isAdd
            })
        })
    }
	render(){
		const {page, record, records} = this.state;
        let platformMtlId = this.state.platformMtlId;
        let content = <div></div>;
        let contents = <div></div>;

        if(platformMtlId) {
            content = (
                <div className="train-action-buttons scroll">
                 <div className="train">
                                    <div className="top">
											<span style={{flex:4}}>
												<span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(200861/*产品代码*/)}</span>
												<span style={{color:'#000033'}}>{records.code || ""}</span>
											</span>
                                        <span style={{flex:3}}>
												<span style={{color:'#000033',cursor:'pointer'}}>
													{records.localName || ""}
												</span>
											</span>
                                        <span style={{flex:7}}>
												<span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(100226/*英文名称*/)}</span>
												<span style={{color:'#000033'}}>{records.enName}</span>
											</span>
                                        <span style={{flex:6,display:"inline-flex"}}>
												<span style={{flex:1,color:'#888',margin:'0px 10px'}}>{i18n.t(200557/*规格*/)}</span>
												<span style={{flex:8,color:'#000033',whiteSpace:"nowrap",textOverflow:"ellipsis",overflow:"hidden",width:"600px"}} title={records.specTxt || ""}>{records.specTxt || ""}</span>
											</span>



                                    </div>
                                    <div className="bottom">
                                        {records&&records.promoteMtls&&records.promoteMtls.length==0?'':<span style={{flex:6,display:"inline-flex"}}>
												<span style={{flex:1,color:'#888',margin:'0px 10px'}}>{i18n.t(100133/*支付条款*/)}</span>

                                                <span style={{flex:8,color:'#000033',whiteSpace:"nowrap",textOverflow:"ellipsis",overflow:"hidden",width:"600px"}} title={records.payTermName || ""}>{records.payTermName || ""}</span>
										</span>}
                                        {
                                            records&&records.promoteMtls?
                                                <span style={{flex:5}}>


                                                                    {
                                                                        records.promoteMtls.map((dataItem,i)=>{
                                                                            return(

                                                                                <div style={{textAlign:'center',color:'red',margin:'0px 10px'}} key={i}><span style={{color:'red',margin:'0px 10px'}}>FOB - </span>{dataItem?dataItem.sStatnName + ' ' + dataItem.fobPrc +' '+dataItem.cnyName:''}</div>
                                                                            )
                                                                        })
                                                                    }


                                                </span>:''
                                        }
                                        {
                                            records&&records.promoteMtls?
                                                <span style={{flex:5}}>


                                                                    {
                                                                        records.promoteMtls.map((dataItem,i)=>{
                                                                            return(

                                                                                dataItem.cifPrc?<div style={{color:'red',margin:'0px 10px'}} key={i}><span style={{color:'red',margin:'0px 10px'}}>FOB -</span>{dataItem.cifPrc?dataItem.sStatnName + ' ' + dataItem.cifPrc +' '+dataItem.cnyName:''}</div>:''
                                                                            )
                                                                        })
                                                                    }


                                                </span>:''
                                        }

                                        {records&&records.promoteMtls&&records.promoteMtls.length==0?<span style={{color:'red',margin:'0px 10px',flex:5}}>无价格</span>:''}

                                        <button className={'button'} style={{color:'#fff',backgroundColor:"#5594ea",cursor:'pointer',margin:'5px 20px',textAlign:'center',borderRadius:"6px",letterSpacing:"10px",lineHeight:"2.5",width:'120px'}} onClick={this.enquirieClick.bind(this,records)}>{i18n.t(200860/*立即询盘*/)}</button>
                                        {records&&records.promoteMtls&&records.promoteMtls.length==0?<button className={'button'} style={{color:'#fff',backgroundColor:"#5594ea",cursor:'pointer',margin:'5px 20px',textAlign:'center',borderRadius:"6px",letterSpacing:"10px",lineHeight:"2.5",width:'120px'}} onClick={this.jisuanClick.bind(this,records)}>{i18n.t(500428/*计算价格*/)}</button>:''}


                                    </div>
                 </div>


                </div>)
        }

		return(<div>
			<div className={'clientcontact-list-body'} style={{height:this.state.scrollHeight}}>
				<div className={'clientcontact-list-body-single'}>
                    {content}
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
											<span style={{flex:4}}>
												<span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(200861/*产品代码*/)}</span>
												<span style={{color:'#000033'}}>{dataItem.code || ""}</span>
											</span>
											<span style={{flex:3}}>
												<span style={{color:'#000033',cursor:'pointer'}}>
													{dataItem.localName || ""}		
												</span>
											</span>
                                            <span style={{flex:6}}>
												<span style={{color:'#888',margin:'0px 10px'}}>{i18n.t(100226/*英文名称*/)}</span>
												<span style={{color:'#000033'}}>{dataItem.enName}</span>
											</span>
											<span style={{flex:6,display:"inline-flex"}}>
												<span style={{flex:1,color:'#888',margin:'0px 10px'}}>{i18n.t(200557/*规格*/)}</span>
												<span style={{flex:8,color:'#000033',whiteSpace:"nowrap",textOverflow:"ellipsis",overflow:"hidden",width:"600px"}} title={dataItem.specTxt || ""}>{dataItem.specTxt || ""}</span>
											</span>


										</div>
										<div className="bottom">
                                            {dataItem.promoteMtls.length==0?'':<span style={{flex:6,display:"inline-flex"}}>
												<span style={{flex:1,color:'#888',margin:'0px 10px'}}>{i18n.t(100133/*支付条款*/)}</span>

                                                <span style={{flex:8,color:'#000033',whiteSpace:"nowrap",textOverflow:"ellipsis",overflow:"hidden",width:"600px"}} title={dataItem.payTermName || ""}>{dataItem.payTermName || ""}</span>
										    </span>}
                                            {
                                                dataItem.promoteMtls?
                                                    <span style={{flex:5}}>


                                                                    {
                                                                        dataItem.promoteMtls.map((data,i)=>{
                                                                            return(

                                                                                <div style={{color:'red',margin:'0px 10px'}} key={i}><span style={{color:'red',margin:'0px 10px'}}>FOB - </span>{data?data.sStatnName + ' ' + data.fobPrc +' '+data.cnyName:''}</div>
                                                                            )
                                                                        })
                                                                    }


                                                </span>:''
                                            }
                                            {
                                                dataItem.promoteMtls?
                                                    <span style={{flex:5}}>


                                                                    {
                                                                        dataItem.promoteMtls.map((data,i)=>{
                                                                            return(

                                                                                data.cifPrc?<div style={{color:'red',margin:'0px 10px'}} key={i}><span style={{color:'red',margin:'0px 10px'}}>FOB -</span>{data.cifPrc?data.sStatnName + ' ' + data.cifPrc +' '+data.cnyName:''}</div>:''
                                                                            )
                                                                        })
                                                                    }


                                                </span>:''
                                            }
                                            {dataItem.promoteMtls.length==0?<span style={{color:'red',margin:'0px 10px',flex:5}}>无价格</span>:''}
                                            <button className={'button'} style={{color:'#fff',backgroundColor:"#5594ea",cursor:'pointer',margin:'5px 20px',textAlign:'center',borderRadius:"6px",letterSpacing:"10px",lineHeight:"2.5",width:'120px'}} onClick={this.enquirieClick.bind(this,dataItem)}>{i18n.t(200860/*立即询盘*/)}</button>
                                            {dataItem.promoteMtls.length==0?<button className={'button'} style={{color:'#fff',backgroundColor:"#5594ea",cursor:'pointer',margin:'5px 20px',textAlign:'center',borderRadius:"6px",letterSpacing:"10px",lineHeight:"2.5",width:'120px'}} onClick={this.jisuanClick.bind(this,dataItem)}>{i18n.t(500428/*计算价格*/)}</button>:''}

											
										</div>
									</div>
									)
							})
						}

                        <Dialog width={926} visible={this.state.showDilaog} title={this.state.title} showHeader ={this.state.showHeader}>
                            <JisuanPricePlug DialogContent={this.state.DialogContent}
											 checkedData = {this.state.checkedData}
											 showSaveAdd ={this.state.showSaveAdd}
                                             showSaveClose={this.state.showSaveClose}
                                             buttonLeft = {this.state.buttonLeft}
                                             ccid = {this.state.ccid}
                                             platformMtlId = {this.state.platformMtlId}
                                             getPage = {this.getPage}
                                             getPages = {this.getPages}
                                             onSaveAndClose ={this.onSaveAndClose}
											 onCancel = {this.onCancel} />
                        </Dialog>
					</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(ProPro);
