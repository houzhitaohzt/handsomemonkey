import i18n from './../../../../../lib/i18n';
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


export class SalesOrderDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();

        // init func
        this.edit = this.edit.bind(this);
        this.commit = this.commit.bind(this);
        this.pay = this.pay.bind(this);
        this.delete = this.delete.bind(this);
        this.shall = this.shall.bind(this);
        this.tongzhi = this.tongzhi.bind(this);
        
        
        

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
        this.getOne();
        this.getList();
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
    pay(){
        let {getOneData} = this.state;
        Confirm(i18n.t(200043/*确定*/)+i18n.t(400040/*付款申请*/), {
            done:() => {
                apiForm(API_FOODING_ERP,'/charge/payapply',{billId:getOneData['billId']},
                    (response)=>{	
                        ServiceTips({text:response.message,type:'success'});
                        // 跳至 付款申请编辑 
                        if(response['data']) window.navTabs.open(i18n.t(200842/*付款申请编辑*/),`/paymentApplication/addEidt`,{id:response['data']},{refresh: true});
                       
                    },(errors)=>{
                        ServiceTips({text:errors.message,type:'error'});
                });
            }
        }); 
    }

    shall(){
        let {getOneData} = this.state;
		let {router,navReplaceTab} =this.props;
        
        Confirm(i18n.t(200043/*确定*/)+i18n.t(500149/*撤销*/), {
            done:() => {
                apiForm(API_FOODING_ERP,'/charge/cancel',{billId:getOneData['billId']},
                    (response)=>{	
                        ServiceTips({text:response.message,type:'success'});

			            navReplaceTab({name:i18n.t(200406/*费用单*/),component:i18n.t(200406/*费用单*/),url:'/charge/list'});
			            router.push({pathname: '/charge/list'});

                    },(errors)=>{
                        ServiceTips({text:errors.message,type:'error'});
                });
            }
        });
    }

    // 费用确认 
    charge = ()=>{
        let that = this;
        Confirm(i18n.t(200043/*确定*/)+i18n.t(200408/*费用确认*/), {
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
    //费用单编辑
    edit(){
		let {navReplaceTab} =this.props;
		navReplaceTab({id:13,name:i18n.t(200407/*费用单编辑*/),component:i18n.t(200407/*费用单编辑*/),url:'/charge/add'});
		this.props.router.push({ pathname: '/charge/add',query:{id:this.props.location.query['id']}});
    }
    //费用单提交
    commit(){
		let that = this;
        let {getOneData} = this.state;
        
        Confirm(i18n.t(200736/*您确定要提交吗*/), {
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
    //费用单删除
    delete(){
        let {getOneData} = this.state;
        let that = this;	
        Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done:() => {

                apiForm(API_FOODING_ERP,'/charge/delete',{billId:getOneData['billId']},
                    (response)=>{	
                        ServiceTips({text:response.message,type:'success'});
                        let {navReplaceTab} = this.props;
                            navReplaceTab({ name: i18n.t(200406/*费用单*/), component: i18n.t(200406/*费用单*/), url: '/charge/list'});
                            this.props.router.push({pathname: '/charge/list',state: {refresh: true}});                
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
	// 页面 刷新
	getOne(){
		let that = this;
		apiGet(API_FOODING_ERP,'/charge/getOne',Object.assign({billId:that.props.location.query['id'],content: 500},),
			(response)=>{	
				that.setState({	
					getOneData: response.data,
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

    //费用名称
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
	               <NormalDetail getOneData={getOneData} shall={this.shall} pay ={this.pay}  commit ={this.commit}  tongzhi ={this.tongzhi} edit ={this.edit} delete={this.delete}
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
