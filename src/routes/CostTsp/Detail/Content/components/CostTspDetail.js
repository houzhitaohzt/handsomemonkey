import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import NormalDetail from "./NormalDetail";
import RequireDetail from "./RequireDetail";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
export class SalesOrderDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.EditClick = this.EditClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);

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
                    apiForm(API_FOODING_ERP,'/lsbeport/delete',{id:that.state.id},(response)=>{
                            ServiceTips({text:response.message,type:'sucess'}); 
                            navRemoveTab({name:i18n.t(200530/*货运港杂详情*/),component:i18n.t(200530/*货运港杂详情*/),url:'/costtsp/detail'});
                            navRemoveTab({name:i18n.t(200532/*货运港杂*/),component:i18n.t(200532/*货运港杂*/),url:'/costtsp/list'});
                            navAddTab({name:i18n.t(200532/*货运港杂*/),component:i18n.t(200532/*货运港杂*/),url:'/costtsp/list'});
                            that.props.router.push('/costtsp/list');
                    },(error)=>{
                            ServiceTips({text:error.message,type:'error'});
                    });
                }
        });
    }
    EditClick(){
        let {navAddTab,navReplaceTab} =this.props;
        navReplaceTab({id:7,name:i18n.t(500117/*港杂费用详情编辑*/),component:i18n.t(500117/*港杂费用详情编辑*/),url:'/costtsp/add'});
        this.props.router.push({pathname:'/costtsp/add',query:{id:this.state.id}});
    }
    onSaveAndClose(values){
        console.log(values);
        this.setState({visible:false});
    }
	onCancel(){
        this.setState({visible:false});
	}
    initState(){
        return {
            visible:false,
            dialogTitle:'',
            id:this.props.location.query.id,
            dilogTelmp:<div></div>
        }
	}
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        let padding = 233;
        let sch=document.body.offsetHeight-90;
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
	               <NormalDetail  deleteClick={this.deleteClick} EditClick={this.EditClick} id={this.state.id}/>
                   <RequireDetail id={this.state.id}/>
               </div>
			);
	}

}
export default NavConnect(SalesOrderDetail);
