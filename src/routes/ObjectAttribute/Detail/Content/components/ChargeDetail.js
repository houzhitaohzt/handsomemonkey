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
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,language,commonAjax,} from '../../../../../services/apiCall';


export class SalesOrderDetail extends Component{

	constructor(props) {
        super(props);

        this.state = {
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

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
    
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
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

    onSaveAndClose =(values)=> {
        this.setState({visible:false});
    }

	onCancel =()=> {
        this.setState({visible:false});
	}

    handleResize(height){
        let padding = 80;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }

    //表单对象编辑
    edit = ()=> {
		let {navReplaceTab} =this.props;
		navReplaceTab({id:13,name:i18n.t(600233/*表单对象编辑*/),component:i18n.t(600233/*表单对象编辑*/),url:'/objectAttribute/add'});
		this.props.router.push({ pathname: '/objectAttribute/add',query:{id:this.props.location.query['id']}});
    }

    //表单对象删除
    delete = ()=> {
        let {getOneData} = this.state;
        let that = this;	
        Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done:() => {

                apiForm(API_FOODING_DS,'/formObject/delete',{id:getOneData['id']},
                    (response)=>{	
                        ServiceTips({text:response.message,type:'success'});
                        let {navReplaceTab} = this.props;
                            navReplaceTab({ name: i18n.t(200406/*费用单*/), component: i18n.t(200406/*费用单*/), url: '/objectAttribute/list'});
                            this.props.router.push({pathname: '/objectAttribute/list',state: {refresh: true}});                
                    },(errors)=>{
                        ServiceTips({text:errors.message,type:'error'});
                });

            }
        });

    }

	// 页面 刷新
	getOne(){
		let that = this;
		apiGet(API_FOODING_DS,'/formObject/getOne',Object.assign({id:that.props.location.query['id'],content: 500},),
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
		apiGet(API_FOODING_DS,'/formObjectAttr/getList',{sourceId: that.props.location.query['id']},
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
	               <NormalDetail 
                        getOneData={getOneData} 
                        edit ={this.edit} 
                        delete={this.delete}
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
