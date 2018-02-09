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
    apiGet, apiPost, apiForm, API_FOODING_DS, language, pageSize, sizeList, API_FOODING_HR,
    API_FOODING_ERP
} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
import {I18n} from "../../../../../lib/i18n";
export class PayTrmDetail extends Component{
    constructor(props) {
        super(props);
        this.state=this.initState();
        this.getOne= this.getOne.bind(this);
        this.onCancel=this.onCancel.bind(this);
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
    onCancel(){
        this.setState({visible:false});
    }
    getOne(){
        var that = this;
        apiGet(API_FOODING_HR,'/workregister/getOne',{billId:this.state.id},(response)=>{
            that.setState({
                getOne:response.data
            })
        },(error)=>{

        })
    }
    alterClick=(e, data, Template) =>{
        let {navAddTab,navReplaceTab} =this.props;
        navReplaceTab({id:7,name:I18n.t(500363/*加班单编辑*/),component:I18n.t(500363/*加班单编辑*/),url:'/overtimeregister/add'});
        this.props.router.push({pathname:'/overtimeregister/add',query:{id:this.state.id}});
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
                apiForm(API_FOODING_HR,'/workregister/delete',{billId:this.state.id},(response)=>{
                    ServiceTips({text:response.message,type:'sucess'});
                    navRemoveTab({name:I18n.t(500364/*加班单详情*/),component:I18n.t(500364/*加班单详情*/),url:'/overtimeregister/detail'});
                    navRemoveTab({name:I18n.t(500416/*加班单*/),component:I18n.t(500416/*加班单*/),url:'/overtimeregister'});
                    navAddTab({name:I18n.t(500416/*加班单*/),component:I18n.t(500416/*加班单*/),url:'/overtimeregister'});
                    that.props.router.push({pathname:'/overtimeregister',state: {refresh: true}});
                },(error)=>{
                    ServiceTips({text:error.message,type:'error'});
                });
            }
        });
    }
    /*dayinClick = () =>{

    }*/
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
    copyClick = (e, data, Template) =>{
        ServiceTips({text:'下版本开发',type:"error"})
       /* let that = this;
        apiGet("您确定执行复制操作吗？", {
            done: () => {
                apiPost(API_FOODING_HR,'/workregister/copy',{billId:that.state.id},response => {
                    ServiceTips({text:response.message,type:"success"})
                    let {navAddTab, navRemoveTab,navReplaceTab} = this.props;
                    navAddTab({id:7,name:I18n.t(500362*//*加班单新增*//*),component:I18n.t(500362*//*加班单新增*//*),url:'/overtimeregister/add'});
                    that.props.router.push({pathname:'/overtimeregister/add',query:{id:response.data}});
                },error => {
                    ServiceTips({text:error.message,type:'error'})
                })
            },
            close:() => {
                console.log('no, close')
            }
        });*/

    }
    initState(){
        return {
            visible:false,
            dialogTitle:'',
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
                <Normal alterClick={this.alterClick} delClick={this.delClick} submitClick={this.submitClick} onApproveClick={this.onApproveClick} dayinClick={this.dayinClick} copyClick={this.copyClick}  billId={this.state.id} getOne={this.state.getOne} ref='normal'/>
                <Oragn billId={this.state.id} getOne={this.state.getOne}/>
                <Dialog width={926} visible={this.state.visible} title={this.state.title}>
                    {this.state.dialogContent}
                </Dialog>
            </div>
        );
    }

}
export default NavConnect(PayTrmDetail);
