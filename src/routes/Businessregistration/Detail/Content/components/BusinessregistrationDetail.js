import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import Normal from "./Normal";
import RequireDetail from "./RequireDetail";
import {
    apiGet, apiPost, apiForm, API_FOODING_DS, language, pageSize, sizeList, API_FOODING_HR,
    API_FOODING_ERP
} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
import {I18n} from "../../../../../lib/i18n";
export class PayTrmDetail extends Component{
    constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
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
    alterClick=(e, data, Template) =>{
        let {navAddTab,navReplaceTab} =this.props;
        navReplaceTab({id:7,name:I18n.t(500372/*出差单编辑*/),component:I18n.t(500372/*出差单编辑*/),url:'/businessregistration/add'});
        this.props.router.push({pathname:'/businessregistration/add',query:{id:this.state.id}});
    }
    delClick = () =>{
        var that = this;
        let {navAddTab,navRemoveTab} =this.props;
        Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done: () => {
                apiForm(API_FOODING_HR,'/evection/register/delete',{billId:this.state.id},(response)=>{
                    ServiceTips({text:response.message,type:'sucess'});
                    navRemoveTab({name:I18n.t(500373/*出差单详情*/),component:I18n.t(500373/*出差单详情*/),url:'/businessregistration/detail'});
                    navRemoveTab({name:I18n.t(500373/*出差单详情*/),component:I18n.t(500373/*出差单详情*/),url:'/businessregistration'});
                    navAddTab({name:I18n.t(500421/*出差单*/),component:I18n.t(500421/*出差单*/),url:'/businessregistration'});
                    that.props.router.push({pathname:'/businessregistration',state: {refresh: true}});

                },(error)=>{
                    ServiceTips({text:error.message,type:'error'});
                });
            }
        });
    }
    /*dayinClick = () =>{
        ServiceTips({text:'前端待开发',type:"error"})
    }*/
    copyClick = () =>{
        ServiceTips({text:'下版本开发',type:"error"})
    }
    onApproveClick = () =>{
        let {getOneData = {}} = this.state;
        let billId = getOneData.billId,billType = getOneData.billType;
        let content = require('../../../../Pinfakesingle/Detail/Content/components/ApprovalDialog').default;
        let element = React.createElement(content, {onCancel: this.onCancel,billType:billType,billId:billId});
        this.setState({
            visible: true,
            title: i18n.t(100470/*查看审批*/),
            dialogContent: element,
            showHeader:true
        })
    }
    baoxiaoClick = () =>{
        ServiceTips({text:'下版本开发',type:"error"})
    }
    submitClick=()=>{
        let getOneData = this.state.getOneData;
        Confirm(i18n.t(500422/*你确定提交此单据吗?*/), {
            done: () => {
                apiForm(API_FOODING_HR,"/common/submitBill",{billId:getOneData.billId,billType:getOneData.billType},response => {
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
    onSaveAndClose(value){
        var that = this;
        value = Object.assign({},value);
        apiPost(API_FOODING_DS,'/payTrm/save',value,(response)=>{
            ServiceTips({text:response.message,type:'sucess'});
            that = that.refs.normal.getInit();
        },(error) =>{
            ServiceTips({text:error.message,type:'error'})
        })
        this.setState({
            visible:!this.state.visible
        })
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
            getOneData:{},
            listData:[],
        }
    }
    // 页面 刷新
    getOne(){
        let that = this;
        apiGet(API_FOODING_HR,'/evecregister/getOne',Object.assign({billId:that.state.id}),
            (response)=>{
                that.setState({
                    getOneData:response.data,
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
            });
    }

    //费用名称
    getList(){
        let that = this;
        apiGet(API_FOODING_HR,'/evecregister/dtl/getList',{billId:that.state.id},
            (response)=>{
                that.setState({
                    listData: response.data,
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
            });
    }
    componentDidMount(){
        this.handleResize();
        this. getOne();
        this.getList();
        window.addEventListener('resize', this.handleResize(20));
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
        let {getOneData} = this.state;
        return (
            <div className='activity-detail' style={{height:this.state.scrollHeight}}>
                <Normal alterClick={this.alterClick} delClick ={this.delClick} baoxiaoClick ={this.baoxiaoClick} onApproveClick = {this.onApproveClick}  submitClick={this.submitClick} copyClick={this.copyClick} id={this.state.id} getOneData={getOneData} ref='normal'/>
                <RequireDetail
                    getOneData={getOneData}
                    listData={this.state.listData}
                />
                <Dialog width={926} visible={this.state.visible} title={this.state.title}>
                    {this.state.dialogContent}
                </Dialog>
            </div>
        );
    }

}
export default NavConnect(PayTrmDetail);
