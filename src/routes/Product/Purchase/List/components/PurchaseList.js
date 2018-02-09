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


		this.columns = [{
			title : i18n.t(400048/*单据编号*/),
			dataIndex : "no",
			key : "no",
			width : "6%",
			sort:'no',
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "6%",
			sort:'billDate',
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(100312/*供应商*/),
			dataIndex : "vndBe"+language,
			key : "vndBe"+language,
			width : "14%",
			sort:'vndBeId',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : i18n.t(100319/*采购数量*/),
			dataIndex : "purQty",
			key : "purQty",
			width : "5%",
			sort:'purQty',
			className:'text-center',
			render(data,row,index){
				if(data && !row.type){
					return (<div>{data}&nbsp;&nbsp;{row['uom'+language]}</div>)
				}
				return "";
			}
		},{
			title : i18n.t(200847/*含税单价*/),
			dataIndex : "purTaxPrc",
			key : "purTaxPrc",
			width : "5%",
			sort:'purTaxPrc',
			className:'text-center',
			render(data,row,index){
				if(data && !row.type){
					return (<div>{toDecimal(data)}&nbsp;&nbsp;{row.cnyEnName}</div>)
				}
				return "";
			}
		},{
			title : i18n.t(400098/*采购总额*/),
			dataIndex : "setTaxAgg",
			key : "setTaxAgg",
			width : "6%",
			sort:'setTaxAgg',
			className:'text-right',
			render(data,row,index){
				if(data){
					return (<div>{toDecimal(data)}&nbsp;&nbsp;{row.cnyEnName}</div>)
				}
				return "";
			}
		},{
			title : i18n.t(400037/*采购员*/),
			dataIndex : "purStaff"+language,
			key : "purStaff"+language,
			width : "8%",
			sort:'purStaffId',
			className:'text-center',
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : 'statusName',
			key : "statusName",
			width : '4%',
			sort:'status',
			render(data,row,index){
				return data;
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


	onRowDoubleClick = (record,index,checked)=> {
		let {navAddTab} =this.props;
        navAddTab({name: i18n.t(200990/*采购订单详情*/), component: i18n.t(200990/*采购订单详情*/), url: '/pruchaseorder/detail'});
        this.props.router.push({pathname: '/pruchaseorder/detail', query: {id: record.billId}});

        // let name = '商机(' + record.no + ")";
        // let billId = record.billId;
        // navAddTab({name: name, component: name, url: '/businessOpportunity/detail/' + billId});
        // this.props.router.push({pathname: '/businessOpportunity/detail/' + billId, query: {id: billId}});
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
        let params = Object.assign({orderType:20,mtlId: this.props.material.id}, {currentPage: currentPage, pageSize: size}, filter, this.filterData);
        apiGet(API_FOODING_ERP, '/purorder/getPage', params, (response) => {
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
						checkboxConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						//onRowDoubleClick={this.onRowDoubleClick}
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
