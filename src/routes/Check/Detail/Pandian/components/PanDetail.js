import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import {createForm,FormWrapper} from '../../../../../components/Form';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Page from "../../../../../components/Page";//分页
const {Table} = require("../../../../../components/Table");//Table表格
import Confirm from '../../../../../components/Dialog/Confirm';
import PanNormal from "./panNormal";
import Xi from "./xi";
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
export class SalesOrderDetail extends Component{
	constructor(props) {
        super(props);
        this.state=this.initState();
        this.backClick = this.backClick.bind(this);
        this.saveClick = this.saveClick.bind(this);
        this.getOne=this.getOne.bind(this);
    }
    initState(){
        return {
            visible:false,
            dialogTitle:'',
            id:this.props.location.query.id,
            dilogTelmp:<div></div>
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
    backClick(e,data){
        let {navAddTab,navReplaceTab,navRemoveCurrentTab} =this.props;
        var that = this;
            this.props.navReplaceTab({name:i18n.t(200411/*盘点单详情*/),component:i18n.t(200411/*盘点单详情*/),url:'/pan/detail'});
            navAddTab({name:i18n.t(200411/*盘点单详情*/),component:i18n.t(200411/*盘点单详情*/),url:'/check/detail'});
            this.props.router.push({pathname: '/check/detail',query:{id:this.state.id}});
    }
    saveClick(value){
        var that = this;
        const {form} = this.props;
        form.validateFields((errors, value) => {
            if(errors){

            }else{
                let {navAddTab,navReplaceTab,navRemoveCurrentTab} =this.props;
                     value = Object.assign({},value,{billId:this.state.id});
                    apiPost(API_FOODING_ERP,'/stocking/check',value,(response)=>{
                            ServiceTips({text:response.message,type:'sucess'});
                            navRemoveCurrentTab({name:i18n.t(200411/*盘点单详情*/),component:i18n.t(200411/*盘点单详情*/),url:'/pan/detail'});
                            navAddTab({name:i18n.t(200411/*盘点单详情*/),component:i18n.t(200411/*盘点单详情*/),url:'/check/detail'});
                    this.props.router.push({pathname: '/check/detail',query:{id:this.state.id}});
                     this.getOne();
                    },(error)=>{
                            ServiceTips({text:error.message,type:'error'});
                    });
            }
        })
       
    }
    initState(){
        return {
            visible:false,
            dialogTitle:'',
             id:this.props.location.query.id,
             cangKuArray:[],
            dilogTelmp:<div></div>
        }
	}
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
        apiGet(API_FOODING_ERP,'/stocking/getDtlList',{billId:this.state.id},(response)=>{
            this.setState({
                cangKuArray:response.data
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
			  <div className='activity-detail  scroll' style={{height:this.state.scrollHeight}}>
               <PanNormal  saveClick={this.saveClick} backClick={this.backClick} id={this.state.id}/>
	           <div className={'client-body-single'} style={{marginTop:'10px'}}>
                 <Xi id={this.state.id} cangKuArray={this.state.cangKuArray} form={this.props.form}/> 
                </div>
               </div>
			);
	}

}
export default NavConnect(createForm()(SalesOrderDetail));
