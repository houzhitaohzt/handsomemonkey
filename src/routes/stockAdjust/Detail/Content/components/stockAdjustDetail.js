import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
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
        this.getOne=this.getOne.bind(this);
    }
    initState(){
        return {
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>,
            id:this.props.location.query.id,
            data:{}
        }
    }
     getOne(){
        var that = this;
        apiGet(API_FOODING_ERP,'/stockadjust/getOne',{billId:this.props.location.query.id},(response)=>{
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
    onSaveAndClose(values){
        console.log(values);
        this.setState({visible:false});
    }
	onCancel(){
        this.setState({visible:false});
	}
    
    componentDidMount(){
        this.handleResize();
         this.getOne();
        window.addEventListener('resize', this.handleResize(20));
        apiGet(API_FOODING_ERP,'/stockadjust/dtl/getList',{billId:this.state.id},(response)=>{
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
	               <NormalDetail id={this.state.id} data={this.state.data}/>
                   <RequireDetail id={this.state.id}  ref ="product"  id={this.state.id} cangKuArray={this.state.cangKuArray}/>
               </div>
			);
	}

}
export default SalesOrderDetail;
