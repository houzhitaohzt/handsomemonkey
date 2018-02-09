import i18n from './../../../../../lib/i18n';
import React, {Component} from "react";
import Dialog from "../../../../../components/Dialog/Dialog";
import Confirm from "../../../../../components/Dialog/Confirm";
import BusinessKey from "./BusinessListKeys";
import CloseBusiness from "./CloseBusiness"; //关闭商机
import Approval from "./Approval"; //查看审批
import {errorTips,successTips} from "../../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiForm, apiGet} from "../../../../../services/apiCall";
import NavConnect from "../../../../../components/NavigateTabs/containers/AddContainer"
const {Table} = require("../../../../../components/Table");
class BusinessList extends Component{
	constructor(props){
		super(props);
        props.business && props.business(this);
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
            dataIndex : "billDate",
            key : "billDate",
            width : "10%",
            render(data,row,index){
                return (<div className="text-ellipsis">{new Date(data).Format("yyyy-MM-dd")}</div>);
            }
        }];
		this.filterData = {};
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onCloseBusinessSave=this.onCloseBusinessSave.bind(this);
		this.onCloseBusinessCancel=this.onCloseBusinessCancel.bind(this);
		this.onApprovalSave=this.onApprovalSave.bind(this);
		this.onApprovalCancel=this.onApprovalCancel.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.state=this.initState()
	}
	initState(){
		return {
			showDilaog:false,
			showApproval:false,
			paddingTop:false,
			selectArr:[],
			checkedRows:[],
			businessSource : [],
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
		}
	}

	addClick(){
	    let irowSts=this.props.customer.irowSts.id;
	    if(irowSts==10){
            let {navAddTab, navRemoveTab} = this.props;
            navAddTab({ name: i18n.t(200254/*新增商机*/), component: i18n.t(200254/*新增商机*/), url: '/businessOpportunity/edit/add'});
            this.props.router.push({pathname: '/businessOpportunity/edit/add', query: {cid: this.props.customer.id}});
        }else{
            errorTips('请先激活此客户!');
        }

    }

	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;

        // navAddTab({id: 11, name: '商机详情', component: '商机详情', url: '/businessOpportunity/detail'});
        // this.props.router.push({pathname: '/businessOpportunity/detail', query: {id: record.billId}});

        let name = i18n.t(100321/*商机*/) + '(' + record.no + ")";
        let billId = record.billId;
        navAddTab({name: name, component: name, url: '/businessOpportunity/detail/' + billId});
        this.props.router.push({pathname: '/businessOpportunity/detail/' + billId, query: {id: billId}});
	}

    deleteClick = () =>{
        let numArr = this.refs.mainTable.getSelectArr();
        if( !numArr.length) return errorTips(i18n.t(201284/*请选择需要删除的数据!*/));
        Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done: () => {
                apiForm(API_FOODING_ERP, '/business/delete', {billId: numArr[0].billId}, response => {
                    successTips(response.message);
                    this.getPages();
                }, error=>{
                    errorTips(error.message)
                })
            },
            close: () => {}
        });
    };

    getPages(currentPage, size, filter, order) {
        filter = filter || {};
        order = order || {column: 'billId', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || 0;
        size = size || page.size;
        let params = Object.assign({salBeId: this.props.customer.id}, {currentPage: currentPage, pageSize: size}, filter, order, this.filterData);
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
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));

		if((nextProps.customer || {}).id !== (this.props.customer || {}).id){
		    this.filterData['salBeId'] = nextProps.customer.id;
		    // this.getPages();
        }
  	}

    /**
     * 生成销售报价
     */
    createSaleOffer = record =>{
        let msg = i18n.t(201269/*是否把所有的产品数据生成销售报价?*/);
        Confirm(msg, {
            done: ()=> {
                apiForm(API_FOODING_ERP, '/business/createSaleOffer', {billId: record.billId},
                    response => {
                        let {navAddTab} = this.props;
                        navAddTab({name:i18n.t(200238/*销售报价编辑*/),component:i18n.t(200238/*销售报价编辑*/),url:'/quotation/addedit'});
                        this.props.router.push({pathname: '/quotation/addedit', query: {id: data}});
                    }, error => {
                        errorTips(error.message)
                    });
            }
        });
    };

    /**
     * 生成销售订单
     */
    createSaleOrder = record => {
        let msg = i18n.t(201271/*是否把所有的产品数据生成销售订单?*/);
        Confirm(msg, {
            done: ()=> {
                apiForm(API_FOODING_ERP, '/business/createSaleOrder', {billId: record.billId},
                    ({data}) => {
                        let {navAddTab} = this.props;
                        navAddTab({name:i18n.t(200239/*销售订单编辑*/),component:i18n.t(200239/*销售订单编辑*/),url:'salesorder/addeidt'});
                        this.props.router.push({pathname: 'salesorder/addeidt', query: {id: data}});
                    }, error => {
                        errorTips(error.message)
                    });
            }
        });

    };

	handleClick = (e, data) => {
        if (data.action == i18n.t(100439/*编辑*/)) {
            // let name = data.record.name,{initData}=this.state;
            // this.addEnable=false;
            // let content=require('./AddCommonDialog').default;
            // let ele =React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,initData:initData,data:data.record});
            // this.setState({
            // 	showDilaog : !this.state.showDilaog,
            // 	title:i18n.t(200255/*新增客户-直接新增*/),
            // 	dialogContent:ele
            // },()=>{
            // 	this.addEnable=true;
            // });
        } else if (data.action == i18n.t(100437/*删除*/)) {
            Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    console.log('ok, got it');
                }
            });
        } else if (data.action == i18n.t(200256/*发邮件*/)) {
            // let name = data.record.name;
            // let content=require('./SendEmail').default;
            // let element=React.createElement(content,{onSaveAndClose:this.onSendEmialSaveAndClose,onCancel:this.onSendEmailCancel,dataMain:data.record});
            // this.setState({
            // 	showDilaog : !this.state.showDilaog,
            // 	title:'选择收件人 - '+ name,
            // 	dialogContent:element
            // })
        } else if (data.action == i18n.t(100470/*查看审批*/)) {
            this.setState({
                showDilaog: true,
                title: i18n.t(100470/*查看审批*/),
                dialogContent: <Approval dataOne={data.record} onSaveAndClose={this.onApprovalSave} onCancel={this.onApprovalCancel}/>
            })
        } else if (data.action == i18n.t(100588/*联络*/)) {
            let {navAddTab, navRemoveTab} = this.props;

            let name = i18n.t(100321/*商机*/) + '(' + data.record.no + ")";
            let billId = data.record.billId;
            navAddTab({name: name, component: name, url: '/businessOpportunity/detail/' + billId});
            this.props.router.push({pathname: '/businessOpportunity/detail/' + billId, query: {id: billId,index:"contact"}});

        } else if (data.action == i18n.t(200257/*关闭商机*/)) {
            if(data.record.status === 20) return Confirm(i18n.t(201266/*所选的商机已关闭, 不可重复操作!*/));
            this.setState({
                showDilaog: true,
                title: i18n.t(200257/*关闭商机*/),
                dialogContent: <CloseBusiness onSaveAndClose={this.onCloseBusinessSave} onCancel={this.onCloseBusinessCancel} otherData={data.record}/>
            })

        } else if (data.action == i18n.t(100587/*约会*/)) {
            let {navAddTab, navRemoveTab} = this.props;

            let name = i18n.t(100321/*商机*/) + '(' + data.record.no + ")";
            let billId = data.record.billId;
            navAddTab({name: name, component: name, url: '/businessOpportunity/detail/' + billId});
            this.props.router.push({pathname: '/businessOpportunity/detail/' + billId, query: {id: billId,index:"date"}});
        } else if(data.action == i18n.t(200242/*重启*/)){
            let billId = data.record.billId;
            apiForm(API_FOODING_ERP, '/business/restart', {billId},
                response => {
                    successTips(response.message);
                    this.getPages();
                }, error => {
                    errorTips(error.message);
                })
        }
	};

	onCloseBusinessSave(){
		this.setState({
			showDilaog: !this.state.showDilaog
		})
	}
	onCloseBusinessCancel(){
		this.setState({
			showDilaog : false
		})
	}
	onApprovalSave(){
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}
	onApprovalCancel(){
		this.setState({
			showDilaog:false
		})
	}
	render(){
		return (
			<div className={"client-business-list"}>
				<div className="content-margin"></div>
				<div className={"client-business-list-content"} style={{height:this.state.scrollHeight}}>
					<BusinessKey addClick={this.addClick} deleteClick={this.deleteClick} page={this.state.page} getPages={this.getPages.bind(this)} />
					<Table ref="mainTable"
						columns={this.columns}
						data={this.state.businessSource}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
                        singleSelect={true}
						onRowDoubleClick={this.onRowDoubleClick}
						contextMenuConfig={{
							enable:true,
							contextMenuId:'SIMPLE_TABLE_MENU',
							menuItems:[{
                                permissions:'business.restart',
                                condition: {key: 'status', value: 20, exp: '==='},
                                onClick: this.handleClick,
                                content: <div><i className={'foddingicon fooding-update'}/>{i18n.t(200242/*重启*/)}</div>,
                                data: {action: i18n.t(200242/*重启*/)}
                            },{
                                onClick: this.handleClick,
                                content: <div><i className={'foddingicon fooding-contact'}/><span>{i18n.t(100588/*联络*/)}</span></div>,
                                data: {action: i18n.t(100588/*联络*/)}
                            }, {
                                onClick: this.handleClick,
                                content: <div><i className={'foddingicon fooding-yuehui'}/><span>{i18n.t(100587/*约会*/)}</span></div>,
                                data: {action: i18n.t(100587/*约会*/)}
                            }, {
                                permissions:'business.examine',
                                condition: {key: 'status', value: [20, 5], exp: '==='},
                                onClick: this.handleClick,
                                content: <div><i className={'foddingicon fooding-approve'}/><span>{i18n.t(100470/*查看审批*/)}</span></div>,
                                data: {action: i18n.t(100470/*查看审批*/)}
                            },{
                                permissions:'business.close',
                                condition: [{key: 'status', value: 20, exp: '!=='}, 'and', {key: 'status', value: 15, exp: '==='}],
                                onClick: this.handleClick,
                                content: <div><i className={'foddingicon fooding-menu_delete_32'}/><span>{i18n.t(200257/*关闭商机*/)}</span></div>,
                                data: {action: i18n.t(200257/*关闭商机*/)}
                            }]
						}}
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
