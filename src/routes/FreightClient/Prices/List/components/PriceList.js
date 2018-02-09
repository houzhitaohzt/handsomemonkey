import i18n from './../../../../../lib/i18n';
import React, {Component} from "react";
import Page from "../../../../../components/Page";//分页
import Dialog from "../../../../../components/Dialog/Dialog";
import Confirm from "../../../../../components/Dialog/Confirm";
import BusinessKey from "./BusinessListKeys";
import PricePlug from "./PricePlug"; //关闭商机
import Approval from "./Approval"; //查看审批
import {errorTips, successTips} from "../../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiForm, apiGet, language,API_FOODING_DS,pageSize,toDecimal} from "../../../../../services/apiCall";
import NavConnect from "../../../../../components/NavigateTabs/containers/AddContainer"
const {Table} = require("../../../../../components/Table");
class BusinessList extends Component{
	constructor(props){
		super(props);
        props.prices && props.prices(this);
        this.columns = [{
            title : i18n.t(200861/*产品代码*/),
            dataIndex : 'mtlCode',
            key : "mtlCode",
            width : '10%',
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        },{
            title : i18n.t(100379/*产品*/),
            dataIndex : 'mtlName',
            key : 'mtlName',
            width : "20%",
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(100382/*产品规格*/),
            dataIndex : "basSpeci",
            key : "basSpeci",
            width : "10%",
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(400012/*品牌*/),
            dataIndex : "brandName",
            key : "brandName",
            width : "10%",
            render(data,row,index){
                return (<div className="text-ellipsis">{data}</div>);
            }
        },{
            title : i18n.t(100297/*起运港*/),
            dataIndex :'sStatnName',
            key : 'sStatnName',
            width : "8%",
            render(data,row ,index){
                return data;
            }
        },{
            title : i18n.t(100298/*目的港*/),
            dataIndex : 'eStatnName',
            key : 'eStatnName',
            width : "15%",
            render(data,row,index){
                return data;
            }
        },{
            title : 'FOB价',
            dataIndex : "fobPrc",
            key : "fobPrc",
            width : "10%",
            render(data,row,index){
                return <div>{data?toDecimal(data):''}</div>;
            }
        },{
            title : 'CIF价',
            dataIndex : "cifPrc",
            key : "cifPrc",
            width : "10%",
            render(data,row,index){
              return <div>{data?toDecimal(data):''}</div>;
            }
        },{
            title : i18n.t(100287/*失效日期*/),
            dataIndex : "eDate",
            key : "eDate",
            width : "10%",
            render(data,row,index){
                return new Date(data).Format("yyyy-MM-dd");
            }
        }];
		this.filterData = {};
        this.updateClick = this.updateClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.getPage = this.getPage.bind(this);
		this.state=this.initState()
	}
	initState(){
		return {
			showDilaog:false,
			showApproval:false,
			paddingTop:false,
			selectArr:[],
			checkedRows:[],
			data : [],
            pageSize:pageSize,
            currentPage:1

		}
	}
    updateClick(react,row){
        
        let that = this;
        let select = this.refs.mainTable.getSelectArr();
        let value=[];
        // 删除 条件判断
        if(react){

                if(select.length == 0 ){
                Confirm(i18n.t(500115/*请选中一条数据？*/));
                return
                }
        this.setState({
                showDilaog : true,
                showHeader:true,
                DialogContent:1,
                showSaveAdd:true,
                showSaveClose:true,
                title:i18n.t(100454/*发送报价*/),
                selectArr:select
        })
    }
    }
    //请求列表  list
    getPage(currentPage,objValue){
       
            let that = this;
            var sID = sID || '';
            let currentP = !isNaN(currentPage)?currentPage:1;
            let beId = this.props.location.query.id || "";
            let object=Object.assign({},{beId:beId,isPlatform:true, pageSize: that.state.pageSize, currentPage: currentP});
                apiGet(API_FOODING_ERP,'/promoteprice/getAllEffectPrices',object,
                        (response)=>{   
                            that.setState({ 
                                data: response.data,
                                totalRecords:response.data.totalRecords,
                                totalPages: response.data.totalPages,
                                currentPage: response.data.currentPage  
                            });
                        },(errors)=>{
                });
            
            
    }
	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = this.state.paddingTop ? 173:262;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch - 135 ;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
        this.handleResize();
		window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
        // this.getPage()
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
		
  	}
    onSaveAndClose(value,data,isAdd){
        var that = this;
        value=Object.assign({},data,value);
        apiPost(API_FOODING_DS,'/dangLv/save',value,(response)=>{
                that.setState({
                    showDilaog:!!isAdd
                })
                 ServiceTips({text:response.message,type:'success'});
                 this.getPage();
        },(errors)=>{
            ServiceTips({text:errors.message,type:'error'});
            that.setState({
                    showDilaog:!!isAdd
            })
        })
    }
    onCancel(that){
        this.setState({
            showDilaog:false
        })
    }
   
	render(){
        let {page,currentPage} =this.state;
		return (
        <div className={"client-business-list"}>
          <div className="content-margin"></div>
          <div className={"client-business-list-content"} style={{height:this.state.scrollHeight}}>
          <BusinessKey updateClick={this.updateClick}/>
		      <Table ref="mainTable"
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
                        
			/>
					<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
						<PricePlug DialogContent={this.state.DialogContent}
                         data = {this.state.data}
                          showSaveAdd ={this.state.showSaveAdd}
                         showSaveClose={this.state.showSaveClose}
                         buttonLeft = {this.state.buttonLeft}
                          onSaveAndClose ={this.onSaveAndClose}
                          contentDate = {this.state.contentDate}
                          upload ={this.getPage}
                          selectArr ={this.state.selectArr}
                          beId={this.props.location.query.id}
                          onCancel = {this.onCancel}/>
					</Dialog>
				</div>
			</div>
		)
	}
}

export default NavConnect(BusinessList);
