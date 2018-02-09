import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import NormalDetail from "./NormalDetail";
import RequireDetail from "./RequireDetail";
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList } from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
export class SalesOrderDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.commitClick = this.commitClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.editClick = this.editClick.bind(this);
        this.shenpiClick = this.shenpiClick.bind(this);
    }
    shenpiClick(){
        let {getOne = {}} = this.state;
        let billId = getOne.billId,billType = getOne.billType;
        let content = require('../../../../PruchaseOrder/Detail/Content/components/ApprovalDialog').default;
        let element = React.createElement(content, {onCancel: this.onCancel,billType:billType,billId:billId});
        this.setState({
                visible: true,
                dialogTitle: i18n.t(100470/*查看审批*/),
                dilogTelmp: element,
                showHeader:true
        })
    }
    handleClick = (e, data, Template) => {
        if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				    console.log('ok, got it');
				}
		   	});
        }else{
        	let dialogTitle= data.action+data.name.title;
        	 this.setState({
        	 	visible:true,
                dialogTitle:dialogTitle,
                dilogTelmp:Template
        	});
        }
    }
    getOne(){
        let that = this;
        apiGet(API_FOODING_ERP,'/saleadjust/getOne',{billId:this.state.id||id},(response)=>{
            this.setState({
                getOne:response.data
            });
        },(error)=>{

        })
    }
    onSaveAndClose(values){
        console.log(values);
        this.setState({visible:false});
    }
	onCancel(){
        this.setState({visible:false});
	}
    initState(){
        return {
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>,
            id:this.props.location.query.id,
            getOne:{}
        }
	}
    componentDidMount(){
        this.handleResize();
        this.getOne();
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        let padding = 233;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }
    commitClick(){
            Confirm(i18n.t(200369/*您确定要提交此订单吗*/), {
              done: () => {
                    apiForm(API_FOODING_ERP,"/common/submitBill",{billId:this.state.getOne.billId,billType:this.state.getOne.billType},response => {
                        //刷新当前页面
                        this.getOne();
                        ServiceTips({text:response.message,type:"success"})
                    },error => {
                        ServiceTips({text:error.message,type:'error'})
                    })
                },
                close:() => {
                    console.log('no, close')
                }
            });

    }
    deleteClick(){
        Confirm(i18n.t(300020/*货代联系人详情*/), {
              done: () => {
                    apiForm(API_FOODING_ERP,"/saleadjust/delete",{billId:this.state.getOne.billId},response => {
                        let {navAddTab, navRemoveTab,navReplaceTab} = this.props;
                        navRemoveTab({ name: i18n.t(201076/*销售订单调整单详情*/), component: i18n.t(201076/*销售订单调整单详情*/), url: '/tiaozheng/detail'});
                        navRemoveTab({name:i18n.t(200962/*销售订单详情*/),component:i18n.t(200962/*销售订单详情*/),url:'/salesorder/detail'});
                        navAddTab({name:i18n.t(200962/*销售订单详情*/),component:i18n.t(200962/*销售订单详情*/),url:'/salesorder/detail'});
                        this.props.router.push({pathname:'/salesorder/detail',query:{id:this.state.getOne.saleBillId}});
                        ServiceTips({text:response.message,type:"success"})
                    },error => {
                        ServiceTips({text:error.message,type:'error'})
                    })
                },
                close:() => {
                    console.log('no, close')
                }
        });
    }
    editClick(){
        let {navAddTab, navRemoveTab,navReplaceTab} = this.props;
        navReplaceTab({name:i18n.t(201069/*销售调整单编辑*/),component:i18n.t(201069/*销售调整单编辑*/),url:'/tiaozheng/edit'});
        this.props.router.push({pathname:'/tiaozheng/edit',query:{id:this.state.id}});
    }
	render(){
		const commonForm = this.state.dilogTelmp;
		return (
			  <div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
	               <NormalDetail  getOne={this.state.getOne} id={this.state.id}
                    deleteClick = {this.deleteClick}
                    commitClick={this.commitClick}
                    editClick ={this.editClick}
                    shenpiClick={this.shenpiClick}
                   />
                   <RequireDetail getOne={this.state.getOne} id={this.state.id}/>
                   <Dialog width={926} visible={this.state.visible} title={this.state.title} showHeader={this.state.showHeader}>
                        {this.state.dilogTelmp}
                   </Dialog>
               </div>
			);
	}

}
export default NavConnect(SalesOrderDetail);
