import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NormalDetail from "./NormalDetail";
import ClientDetail from "./ClientDetail";
import RequireDetail from "./RequireDetail";
import ShouKuan from "./ShouKuan";
import ZhuangYun from "./ZhuangYun";
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,
    pageSize,sizeList,language} from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
export class SalesOrderDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.getOne = this.getOne.bind(this);
        this.Edit = this.Edit.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.shenpiClick = this.shenpiClick.bind(this);
        this.chukuClick = this.chukuClick.bind(this);
    }
    shenpiClick(){
        let {getOne = {}} = this.state;
        let billId = getOne.billId,billType = getOne.billType;
        let content = require('../../../../PruchaseOrder/Detail/Content/components/ApprovalDialog').default;
        let element = React.createElement(content, {onCancel: this.onCancel,billType:billType,billId:billId});
        this.setState({
                visible: true,
                title: i18n.t(100470/*查看审批*/),
                dialogContent: element,
                showHeader:false
        })
    }
    chukuClick(){
        let that = this;
        Confirm(i18n.t(300034/*您确定要执行销售出库吗？*/), {
                done: () => {
                    apiForm(API_FOODING_ERP,'/insale/noticeOut',{billId:this.state.id},(response)=>{
                        ServiceTips({text:response.message,type:'sucess'});
                        this.props.navAddTab({name:i18n.t(500160/*出库通知单详情*/),component:i18n.t(500160/*出库通知单详情*/),url:'/stockout/detail'});
                        this.props.router.push({ pathname:'/stockout/detail',query:{id:response.data}});
                    },(error)=>{
                        ServiceTips({text:error.message,type:'error'});
                    });
                }
        });
    }
    Edit(){
        let that = this;
        let {navAddTab,navRemoveTab,navReplaceTab} =this.props;
        navReplaceTab({name:i18n.t(201061/*国内销售订单编辑*/),component:i18n.t(201061/*国内销售订单编辑*/),url:'/salesn/addEidt'});
        this.props.router.push({pathname:'/salesn/addEidt',query:{id:this.state.id}});
    }
    deleteClick(){
        let that =this;
        Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
                done: () => {
                    apiForm(API_FOODING_ERP,'/insale/delete',{billId:this.state.id},(response)=>{
                        ServiceTips({text:response.message,type:'sucess'});
                        this.props.navRemoveTab({name: i18n.t(201057/*国内销售订单详情*/), component: i18n.t(201057/*国内销售订单详情*/), url: '/salesn/detail'});
                        this.props.navReplaceTab({name:i18n.t(201062/*国内销售订单*/),component:i18n.t(201062/*国内销售订单*/),url:'/salesn/list'});
                        this.props.router.push({ pathname: '/salesn/list'});
                    },(error)=>{
                        ServiceTips({text:error.message,type:'error'});
                    });
                }
        });
    }
    onSaveAndClose(values){
        this.setState({visible:false});
    }
	onCancel(){
        this.setState({visible:false});
	}
    initState(){
        return {
            visible:false,
            title:'',
            dilogTelmp:<div></div>,
            getOne:{},
            id:this.props.location.query.id,
            dialogContent:<div></div>
        }
	}
    componentDidMount(){
        this.handleResize();
        this.getOne();
        window.addEventListener('resize', this.handleResize(20));
    }
    getOne(){
          apiGet(API_FOODING_ERP,'/insale/getOne',{billId:this.state.id},(response)=>{
                this.setState({
                    getOne:response.data
                });
          },(error)=>{

          })  
    }
    handleResize(height){
        let padding = 80;
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
	render(){
		const commonForm = this.state.dilogTelmp;
		return (
			  <div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
	               <NormalDetail  getOne={this.state.getOne} id={this.state.id}
                    Edit ={this.Edit}  deleteClick = {this.deleteClick}
                    shenpiClick ={this.shenpiClick}
                    getOneCall={this.getOne}
                    chukuClick = {this.chukuClick}
                   />
                   <ClientDetail  getOne={this.state.getOne} id={this.state.id}/>
                   <ShouKuan  getOne={this.state.getOne} id={this.state.id} />
                   <ZhuangYun getOne={this.state.getOne} id={this.state.id} />
                   <RequireDetail getOne={this.state.getOne} id={this.state.id}/>
                   <Dialog visible={this.state.visible} title={this.state.title} width={926}>
                        {this.state.dialogContent}
                   </Dialog>
               </div>
			);
	}

}
export default NavConnect(SalesOrderDetail);
