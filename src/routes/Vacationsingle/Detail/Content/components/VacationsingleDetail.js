import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import Normal from "./Normal";
import Oragn from "./Oragn";
import {
    apiGet, apiPost, apiForm, API_FOODING_DS, language, pageSize, sizeList,
    API_FOODING_HR, API_FOODING_ERP
} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
import {I18n} from "../../../../../lib/i18n";
export class PayTrmDetail extends Component{
    constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.getOne= this.getOne.bind(this);
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
        var that = this;
        apiGet(API_FOODING_HR,'/leave/getOne',{id:this.state.id},(response)=>{
            that.setState({
                getOne:response.data
            })
        },(error)=>{

        })
    }
    alterClick=(e, data, Template) =>{
        let {navAddTab,navReplaceTab} =this.props;
        navReplaceTab({id:7,name:I18n.t(500367/*休假单编辑*/),component:I18n.t(500367/*休假单编辑*/),url:'/vacationsingle/add'});
        this.props.router.push({pathname:'/vacationsingle/add',query:{id:this.state.id}});
    }
    submitClick=()=>{
        let getOne = this.state.getOne;
        Confirm(i18n.t(500422/*你确定提交此单据吗?*/), {
            done: () => {
                apiForm(API_FOODING_HR,"/common/submitBill",{billId:getOne.billId,billType:getOne.billType},response => {
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
    delClick = () =>{
        var that = this;
        let {navAddTab,navRemoveTab} =this.props;
        Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done: () => {
                apiForm(API_FOODING_HR,'/leave/delLeave',{ids:this.state.id},(response)=>{
                    ServiceTips({text:response.message,type:'sucess'});
                    navRemoveTab({name:I18n.t(500368/*休假单详情*/),component:I18n.t(500368/*休假单详情*/),url:'/vacationsingle/detail'});
                    navRemoveTab({name:I18n.t(500418/*休假单*/),component:I18n.t(500418/*休假单*/),url:'/vacationsingle'});
                    navAddTab({name:I18n.t(500418/*休假单*/),component:I18n.t(500418/*休假单*/),url:'/vacationsingle'});
                    that.props.router.push({pathname:'/vacationsingle',state: {refresh: true}});
                },(error)=>{
                    ServiceTips({text:error.message,type:'error'});
                });
            }
        });
    }
    /*dayinClick = () =>{
        ServiceTips({text:'下版本开发',type:'error'});
    }*/
    copyClick = () =>{
        ServiceTips({text:'下版本开发',type:'error'});
    }
    onApproveClick = () =>{
        let {getOne = {}} = this.state;
        let billId = getOne.billId,billType = getOne.billType;
        let content = require('../../../../Pinfakesingle/Detail/Content/components/ApprovalDialog').default;
        let element = React.createElement(content, {onCancel: this.onCancel,billType:billType,billId:billId});
        this.setState({
            visible: true,
            title: i18n.t(100470/*查看审批*/),
            dialogContent: element,
            showHeader:true
        })
    }
    xiaojiaClick =() =>{
        Confirm(I18n.t('确定生成销假单吗?'), {
            done: () => {
                apiGet(API_FOODING_HR,'/erasure/create',{leaveId:this.state.id},response => {
                    this.setState({
                        data:response.data
                    });
                    ServiceTips({text:response.message,type:"success"})
                    window.navTabs.open(I18n.t(500406/*销假单编辑*/), '/pinfakesingle/add', {id:response.data.billId});
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
            info:{},
            getOne:{},
            dilogTelmp:<div></div>,
            id:this.props.location.query.id
        }
    }
    componentDidMount(){
        this.handleResize();
        this. getOne();
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
        return (
            <div className='activity-detail' style={{height:this.state.scrollHeight}}>
                <Normal alterClick={this.alterClick} delClick={this.delClick} submitClick={this.submitClick} onApproveClick = {this.onApproveClick}  xiaojiaClick = {this.xiaojiaClick} copyClick={this.copyClick}  billId={this.state.id} getOne={this.state.getOne} ref='normal'/>
                <Oragn billId={this.state.id} getOne={this.state.getOne}/>
                <Dialog width={926} visible={this.state.visible} title={this.state.title}>
                    {this.state.dialogContent}
                </Dialog>
            </div>
        );
    }

}
export default NavConnect(PayTrmDetail);
