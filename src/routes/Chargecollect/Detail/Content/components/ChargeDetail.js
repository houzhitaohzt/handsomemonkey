import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import NormalDetail from "./NormalDetail";
import RequireDetail from "./RequireDetail";
import ServiceTips from '../../../../../components/ServiceTips'; // 提示
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../../../services/apiCall';
export class SalesOrderDetail extends Component{
	constructor(props) {
        super(props);
        this.state=this.initState();
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
    // 页面 刷新
	getOne(){
		let that = this;
		apiGet(API_FOODING_ERP,'/chargecollect/getOne',Object.assign({billId:that.props.location.query['id'],content: 500},),
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
		apiGet(API_FOODING_ERP,'/chargecollect/dtl/getList',{billId: that.props.location.query['id']},
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
	               <NormalDetail getOneData={getOneData}  Data={this.state.getOneData}  
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
