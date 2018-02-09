import i18n from './../../../../../lib/i18n';
import React, {Component} from "react";
import Dialog from "../../../../../components/Dialog/Dialog";

import BusinessKey from "./BusinessListKeys";
import NavConnect from "../../../../../components/NavigateTabs/containers/AddContainer";

import "../assets/_businessList.less";

import {errorTips} from "../../../../../components/ServiceTips"; //提示框
import {toDecimal,API_FOODING_ERP,apiGet,language} from "../../../../../services/apiCall";

const {Table} = require("../../../../../components/Table");

class PurchaseDIV extends Component{

	constructor(props){
		super(props);
        props.businesspro && props.businesspro(this);
        this.filterData = {};


		this.columns = [
			{
				title : i18n.t(400025/*仓库*/),
				dataIndex : 'sl'+language,
				key : "sl"+language,
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},{
				title : i18n.t(400026/*库区*/),
				dataIndex : 'st'+language,
				key : "st"+language,
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},{
				title : i18n.t(400027/*储位*/),
				dataIndex : 'slsp'+language,
				key : "slsp"+language,
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},{
				title : i18n.t(400012/*品牌*/),
				dataIndex : 'brand'+language,
				key : "brand"+language,
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},{
				title : i18n.t(400028/*原供应商*/),
				dataIndex : 'vndBe'+language,
				key : "vndBe"+language,
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},{
				title : i18n.t(400029/*过期日期*/),
				dataIndex : "shelfEdate",
				key : "shelfEdate",
				width : "10%",
				render(data,row,index){
					return new Date(data).Format('yyyy-MM-dd');
				}
			},{
				title : i18n.t(400030/*物料状态*/),
				dataIndex : "mStats"+language,
				key : "mStats"+language,
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}

			},{
				title : i18n.t(200903/*基础数量*/),
				dataIndex : "baseQty",
				key : "baseQty",
				render(data,row,index){
					return (row['baseQty']/row['eqBasnum']) + ' ' + row['uom'+language];
				}
			},{
				title : i18n.t(500151/*批次号*/),
				dataIndex : "batchNo",
				key : "batchNo",
				width : "8%",
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},{
				title : i18n.t(500141/*采购单价*/),
				dataIndex : "purTaxPrc",
				key : "purTaxPrc",
				render(data,row,index){
					return data?toDecimal(data) + ' ' + row['purCny'+language]:'';
				}
			},{
				title : i18n.t(600060/*销售成本*/),
				dataIndex : "saleUnitPrc",
				key : "saleUnitPrc",
				render(data,row,index){
					return data ? toDecimal(data)+' USD' : '';
				}
		}];


		this.state = {
			showDilaog:false,
			showApproval:false,
			paddingTop:false,
			selectArr:[],
			checkedRows:[],
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
			businessSource : [],			
		}

	}




	handleResize = (height)=> {

		let sch=document.body.offsetHeight;
		let scroll = sch - 330 ;
		this.setState({scrollHeight:sch-240,scroll:scroll});
	}

    getPages = (currentPage, size, filter, order)=> {
        filter = filter || {};
        //order = order || {column: 'billId', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || 1;
        size = size || page.size;
        let params = Object.assign({surplusStock:1,mtlId: this.props.material.id}, {currentPage: currentPage, pageSize: size}, filter, this.filterData);
        apiGet(API_FOODING_ERP, '/stock/getPage', params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
            this.setState({
                businessSource: data || [],
                page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            });
        }, (message) => {
            errorTips(message.message)
        });
    }

	componentDidMount(){
        this.handleResize();
		window.addEventListener('resize', this.handleResize(0));
    }
	
	componentWillUnmount() {
    	//window.removeEventListener('resize', this.handleResize(0));
  	}

  	// componentWillReceiveProps(nextProps){
  	// 	this.handleResize(0);
	// 	window.addEventListener('resize', this.handleResize(0));
	// 	if(!this.props.isDetail){
    //         if((nextProps.material || {}).id !== (this.props.material || {}).id){
    //             this.filterData['mtlId'] = nextProps.material.id;
    //             this.getPages();
    //         }
	// 	}
  	// }


	render(){
		return (
			<div className={"client-business-list"}>
				<div className="content-margin"></div>
				<div className={"client-business-list-content"} style={{height:this.state.scrollHeight}}>
					<BusinessKey  page={this.state.page} getPages={this.getPages.bind(this)}/>
					<Table
						columns={this.columns}
						data={this.state.businessSource}
						//data={[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]}
						checkboxConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						// onRowDoubleClick={this.onRowDoubleClick}
					/>
					<Dialog width={926} visible={this.state.showDilaog} titleLeft={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
				</div>
			</div>
		)
	}
}

export default NavConnect(PurchaseDIV);
