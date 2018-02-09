import i18n from './../../../../../lib/i18n';
import React, {Component} from "react";
import Dialog from "../../../../../components/Dialog/Dialog";

import BusinessKey from "./BusinessListKeys";
import NavConnect from "../../../../../components/NavigateTabs/containers/AddContainer";

import "../assets/_businessList.less";

import {errorTips} from "../../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiGet} from "../../../../../services/apiCall";

const {Table} = require("../../../../../components/Table");

class BusinessList extends Component{
	constructor(props){
		super(props);
        props.businesspro && props.businesspro(this);
		this.columns = [{
			title : i18n.t(100322/*商机编号*/),
			dataIndex : 'no',
			key : "no",
			width : '10%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(200420/*商机主题*/),
			dataIndex : "theme",
			key : "theme",
			width : "20%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200224/*可能截止日期*/),
			dataIndex : "mbEDate",
			key : "mbEDate",
			width : "10%",
			render(data,row,index){
				return new Date(data).Format("yyyy-MM-dd");
			}
		},{
			title : i18n.t(200252/*实际截止日期*/),
			dataIndex : "actEDate",
			key : "actEDate",
			width : "10%",
			render(data,row,index){
                return (<div className="text-ellipsis">{new Date(data).Format("yyyy-MM-dd")}</div>);
			}
		},{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : 'statusName',
			key : "statusName",
			width : "8%",
			render(data,row ,index){
				return data;
			}
		},{
			title : i18n.t(200253/*关闭类型*/),
			dataIndex : "closeCauseLcName",
			key : "closeCauseLcName",
			width : "15%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200422/*商机开始日期*/),
			dataIndex : "startDate",
			key : "startDate",
			width : "10%",
			render(data,row,index){
				return new Date(data).Format("yyyy-MM-dd");
			}
		}];
		this.handleResize = this.handleResize.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.state=this.initState();
        this.filterData = {};
	}
	initState(){
		return {
			showDilaog:false,
			showApproval:false,
			paddingTop:false,
			selectArr:[],
			checkedRows:[],
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
			businessSource : [],
		}
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
        // navAddTab({id: 11, name: '商机详情', component: '商机详情', url: '/businessOpportunity/detail'});
        // this.props.router.push({pathname: '/businessOpportunity/detail', query: {id: record.billId}});

        let name = '商机(' + record.no + ")";
        let billId = record.billId;
        navAddTab({name: name, component: name, url: '/businessOpportunity/detail/' + billId});
        this.props.router.push({pathname: '/businessOpportunity/detail/' + billId, query: {id: billId}});
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

    getPages(currentPage, size, filter, order) {
        filter = filter || {};
        order = order || {column: 'billId', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || 0;
        size = size || page.size;
        let params = Object.assign({mtlId: this.props.material.id}, {currentPage: currentPage, pageSize: size}, filter, order, this.filterData);
        apiGet(API_FOODING_ERP, '/business/getPage', params, (response) => {
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
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
		if(!this.props.isDetail){
            if((nextProps.material || {}).id !== (this.props.material || {}).id){
                this.filterData['mtlId'] = nextProps.material.id;
                this.getPages();
            }
		}
  	}
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
						onRowDoubleClick={this.onRowDoubleClick}
					/>
					<Dialog width={926} visible={this.state.showDilaog} titleLeft={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
				</div>
			</div>
		)
	}
}

export default NavConnect(BusinessList);
