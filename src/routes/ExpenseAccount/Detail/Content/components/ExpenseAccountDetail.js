import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';

import NormalDetail from "./NormalDetail";
import RequireDetail from "./RequireDetail";


// common 
import ServiceTips from '../../../../../components/ServiceTips'; // 提示


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../../../services/apiCall';
import {I18n} from "../../../../../lib/i18n";
import i18n from "../../../../../lib/i18n";


export class SalesOrderDetail extends Component{
	constructor(props) {
        super(props);
        props.detail && props.detail(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();

        // init func
        this.edit = this.edit.bind(this);
        this.commit = this.commit.bind(this);
        this.pay = this.pay.bind(this);
        this.delete = this.delete.bind(this);
        this.shall = this.shall.bind(this);
        this.getPage = this.getPage.bind(this);
        this.tongzhi = this.tongzhi.bind(this);
    }
    getPage(){
        this.getOne();
        this.getList();
    }
    handleClick = (e, data, Template) => {
        if(data.number ==2){
        	 Confirm(I18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
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
    onSaveAndClose(values){
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
            getOneData:{},
            listData:[],
        }
	}
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
        if(!this.props.isDetail){
            this.getOne();
            this.getList();
        }
    }
    handleResize(height){
        let padding = 80;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        // window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        // window.addEventListener('resize', this.handleResize(0));
    }
    shall(){
        let {getOneData} = this.state;
		let {router,navReplaceTab} =this.props;
        
        Confirm(I18n.t(300029/*您确定要撤销吗？*/), {
            done:() => {
                apiForm(API_FOODING_ERP,'/charge/cancel',{billId:getOneData['billId']},
                    (response)=>{	
                        ServiceTips({text:response.message,type:'success'});

			            navReplaceTab({name:I18n.t(600079/*报销单*/),component:I18n.t(600079/*报销单*/),url:'/expenseaccount/list'});
			            router.push({pathname: '/expenseaccount/list'});                        
                           
                    },(errors)=>{
                        ServiceTips({text:errors.message,type:'error'});
                });
            }
        });
    }
    pay(){
        let {getOneData} = this.state;
        Confirm(I18n.t(600080/*您确定要付款申请吗？*/), {
            done:() => {
                apiForm(API_FOODING_ERP,'/charge/payapply',{billId:getOneData['billId']},
                    (response)=>{	
                        ServiceTips({text:response.message,type:'success'});
                    },(errors)=>{
                        ServiceTips({text:errors.message,type:'error'});
                });
            }
        });


    }

    // 费用确认 
    charge = ()=>{
        let that = this;
        Confirm(I18n.t(600081/*您确定要费用确认吗？*/), {
            done:() => {
                apiForm(API_FOODING_ERP,'/charge/confirmNotice',{billId:that.props.location.query['id']},
                    (response)=>{	
                        ServiceTips({text:response.message,type:'success'});
                        that.getOne();
                    },(errors)=>{
                        ServiceTips({text:errors.message,type:'error'});
                });
            }
        });        
    }
    tongzhi(){
        let {getOneData} = this.state;
        let that = this;
        Confirm(i18n.t(500327/*你确定通知上级吗?*/), {
            done:() => {

                apiForm(API_FOODING_ERP,'/charge/informSuperior',{billId:getOneData['billId']},
                    (response)=>{
                        ServiceTips({text:response.message,type:'success'});
                    },(errors)=>{
                        ServiceTips({text:errors.message,type:'error'});
                    });

            }
        });
    }
    edit(){
		let {navReplaceTab} =this.props;
		navReplaceTab({name:I18n.t(600082/*报销单编辑*/),component:I18n.t(600082/*报销单编辑*/),url:'/expenseaccount/add'});
		this.props.router.push({ pathname: '/expenseaccount/add',query:{id:this.props.location.query['id']}});
   
 }

    commit(){
		let that = this;
        let {getOneData} = this.state;
        
        Confirm(I18n.t(600083/*您确定要提交吗？*/), {
            done:() => {
                apiForm(API_FOODING_ERP,'/common/submitBill',{billId:that.props.location.query['id'],billType:getOneData['billType']},
                    (response)=>{	
                        ServiceTips({text:response.message,type:'success'});
                        that.getOne();
                    },(errors)=>{
                        ServiceTips({text:errors.message,type:'error'});
                });		
            }
        });        
    }
    
    delete(){
        let {getOneData} = this.state;
        let that = this;	
        Confirm(I18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
            done:() => {
                apiForm(API_FOODING_ERP,'/charge/delete',{billId:getOneData['billId']},
                    (response)=>{	
                        ServiceTips({text:response.message,type:'success'});
                        let {navReplaceTab} = this.props;
                            navReplaceTab({ name: I18n.t(600079/*报销单*/), component: I18n.t(600079/*报销单*/), url: '/expenseaccount/list'});
                            this.props.router.push({pathname: '/expenseaccount/list',state: {refresh: true}});                
                    },(errors)=>{
                        ServiceTips({text:errors.message,type:'error'});
                });
            }
        });

    }

	// 页面 刷新
	getOne(){
		let that = this;
		apiGet(API_FOODING_ERP,'/charge/getOne',Object.assign({billId:that.props.location.query['id'],content: 499},),
			(response)=>{	
				that.setState({	
					getOneData: response.data,
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

    // 费用 名称
	getList(){

		let that = this;
		apiGet(API_FOODING_ERP,'/charge/dtl/getList',{billId: that.props.location.query['id']},
			(response)=>{	
				that.setState({	
					listData: response.data,
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	render(){
        let {getOneData} = this.state;
		const commonForm = this.state.dilogTelmp;
		return (
			  <div className='activity-detail  scroll' style={{height:this.state.scrollHeight}}>
                    <NormalDetail getOneData={getOneData} shall={this.shall} pay ={this.pay}  commit ={this.commit}  tongzhi = {this.tongzhi} edit ={this.edit} delete={this.delete}
                        Data={this.state.getOneData}  
                        charge={this.charge}
                   />
                   <RequireDetail 
                        getOneData={getOneData}
                        listData={this.state.listData}
                   />
               </div>
			);
	}

}

export default NavConnect(SalesOrderDetail);
