import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import Normal from "./Normal";
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList,API_FOODING_HR} from '../../../../../services/apiCall';
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
        apiGet(API_FOODING_HR,'/scheduleSet/getOne',{id:this.state.id},(response)=>{
            that.setState({
                getOne:response.data
            })
        },(error)=>{

        })
    }

    alterClick=(e, data, Template) =>{
        let {navAddTab,navReplaceTab} =this.props;
        navReplaceTab({id:7,name:I18n.t(500402/*排班设置编辑*/),component:I18n.t(500402/*排班设置编辑*/),url:'/shiftsettings/add'});
        this.props.router.push({pathname:'/shiftsettings/add',query:{id:this.state.id}});
    }
    jihuoClick = (e, data, Template) =>{
        Confirm(I18n.t(100436/*是否对该条数据激活？*/), {
            done: () => {
                //表示是激活
                apiForm(API_FOODING_HR,'/scheduleSet/modifyScheduleSetState',{id:this.state.id,state:true},(response)=>{
                    ServiceTips({text:response.message,type:'sucess'})
                    this.getOne();
                },(error)=>{
                    ServiceTips({text:error.message,type:'error'})
                })
            },
            close:() => {
            }
        });

    }
    shixiaoClick = (e, data, Template) =>{
        Confirm(I18n.t(100435/*是否对该条数据失效？*/), {
            done: () => {
                //表示是失效
                apiForm(API_FOODING_HR,'/scheduleSet/modifyScheduleSetState',{id:this.state.id,state:false},(response)=>{
                    ServiceTips({text:response.message,type:'sucess'})
                    this.getOne();
                },(error)=>{
                    ServiceTips({text:error.message,type:'error'})
                })
            },
            close:() => {
            }
        });
    }
    delClick = () =>{
        var that = this;
        let {navAddTab,navRemoveTab} =this.props;
        Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done: () => {
                apiForm(API_FOODING_HR,'/scheduleSet/delete',{id:this.state.id},(response)=>{
                    ServiceTips({text:response.message,type:'sucess'});
                    navRemoveTab({name:I18n.t(500404/*排班设置详情*/),component:I18n.t(500404/*排班设置详情*/),url:'/shiftsettings/detail'});
                    navRemoveTab({name:I18n.t(500404/*排班设置详情*/),component:I18n.t(500404/*排班设置详情*/),url:'/shiftsettings'});
                    navAddTab({name:I18n.t(500404/*排班设置详情*/),component:I18n.t(500404/*排班设置详情*/),url:'/shiftsettings'});
                    this.props.router.push({pathname:'/shiftsettings',state: {refresh: true}});
                },(error)=>{
                    ServiceTips({text:error.message,type:'error'});
                });
            }
        });
    }
    copyClick=()=>{
        ServiceTips({text:'下一版开发',type:'error'});
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

        if(this.state.id){
            this. getOne();
        }
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
                <Normal alterClick={this.alterClick} billId={this.state.id} getOne={this.state.getOne} copyClick={this.copyClick} jihuoClick={this.jihuoClick} delClick={this.delClick} shixiaoClick ={this.shixiaoClick} ref='normal'/>
                <Dialog width={926} visible={this.state.visible} title={this.state.title}>
                    {this.state.dialogContent}
                </Dialog>
            </div>
        );
    }

}
export default NavConnect(PayTrmDetail);
