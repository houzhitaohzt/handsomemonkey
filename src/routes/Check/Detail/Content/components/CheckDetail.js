import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Page from "../../../../../components/Page";//分页
const {Table} = require("../../../../../components/Table");//Table表格
import Confirm from '../../../../../components/Dialog/Confirm';
import NormalDetail from "./NormalDetail";
import KucunDetail from "./KucunDetail";
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
export class SalesOrderDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.deleteClick = this.deleteClick.bind(this);
        this.submitClick = this.submitClick.bind(this);
        this.pandianClick = this.pandianClick.bind(this);
        this.anmoutClick = this.anmoutClick.bind(this);
        this.getOne=this.getOne.bind(this);

    }
    initState(){
        return {
            visible:false,
            dialogTitle:'',
            id:this.props.location.query.id,
            dilogTelmp:<div></div>,
            data:{}
        }
    }
    getOne(){
        var that = this;
        apiGet(API_FOODING_ERP,'/stocking/getOne',{billId:this.props.location.query.id},(response)=>{
            that.setState({
                data:response.data
            })
        },(error)=>{

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
    deleteClick(){
        var that = this;
        let {navAddTab,navRemoveTab} =this.props;
        Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                  done: () => {
                     apiForm(API_FOODING_ERP,'/stocking/delete',{billId:this.state.id},(response)=>{
                        ServiceTips({text:response.message,type:'sucess'});
                        navRemoveTab({name:i18n.t(200411/*盘点单详情*/),component:i18n.t(200411/*盘点单详情*/),url:'/check/detail'});
                        navRemoveTab({name:i18n.t(200413/*盘点单*/),component:i18n.t(200413/*盘点单*/),url:'/check/list'});
                        navAddTab({name: i18n.t(200413/*盘点单*/), component: i18n.t(200413/*盘点单*/), url: '/check/list'});
                        that.props.router.push('/check/list');
                },(error)=>{
                        ServiceTips({text:error.message,type:'error'});
                });
             }
        });
    }
 
        //提交
        submitClick = () => {
            Confirm(i18n.t(200414/*您确定要提交此单据吗*/), {
              done: () => {
                    apiForm(API_FOODING_ERP,"/common/submitBill",{billId:this.props.location.query.id,billType:240},response => {
                        ServiceTips({text:response.message,type:"success"})
                        this.getOne()
                    },error => {
                        ServiceTips({text:error.message,type:'error'})
                    })
                },
                close:() => {
                    console.log('no, close')
                }
            });
        }


    pandianClick(record){
       let {navAddTab,navRemoveCurrentTab} =this.props;
        navRemoveCurrentTab({name:i18n.t(200411/*盘点单详情*/),component:i18n.t(200411/*盘点单详情*/),url:'/check/detail'});
       navAddTab({name:i18n.t(200411/*盘点单详情*/),component:i18n.t(200411/*盘点单详情*/),url:'/pan/detail'});
       this.props.router.push({pathname: '/pan/detail',query:{id:this.props.location.query.id}});
    }
    anmoutClick(){
        Confirm(i18n.t(500185/*你确定执行库存调整*/), {
              done: () => {
                    apiForm(API_FOODING_ERP,"/stocking/adjust",{billId:this.props.location.query.id},response => {
                        ServiceTips({text:response.message,type:"success"})
                        this.getOne()
                    },error => {
                        ServiceTips({text:error.message,type:'error'})
                    })
                },
                close:() => {
                    console.log('no, close')
                }
            });
    }
    onSaveAndClose(values){
        console.log(values);
        this.setState({visible:false});
    }
	onCancel(){
        this.setState({visible:false});
	}
    componentDidMount(){
        this.handleResize();
        this.getOne();-
        window.addEventListener('resize', this.handleResize(20));
        apiGet(API_FOODING_ERP,'/stocking/getDtlList',{billId:this.state.id},(response)=>{
            this.setState({
                cangKuArray:response.data
            });
        },(error)=>{

        })
    }
     handleResize(height){
        this.setState({
            // paddingTop:!this.state.paddingTop
        });
        let padding = this.props.paddingTop;
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
			  <div className='scroll' style={{backgroundColor:'#f0f4f8',
                height:this.state.scrollHeight,overflow:'auto'}}>
               <NormalDetail  deleteClick={this.deleteClick} submitClick={this.submitClick} id={this.state.id} data={this.state.data} pandianClick={this.pandianClick} anmoutClick={this.anmoutClick} />
	           <div className={'cleint-body-single'} style={{marginTop:'10px'}}>
                 <KucunDetail ref ="product"  id={this.state.id} cangKuArray={this.state.cangKuArray}/> 
                </div>
               </div>
			);
	}

}
export default NavConnect(SalesOrderDetail);
