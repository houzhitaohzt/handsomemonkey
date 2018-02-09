import React, { Component,PropTypes } from 'react';
import MeasureCommon from  '../../../../components/RuleTemplate';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import EditNormal from "./EditNormal";
import Payment from "../../Detail/Content/components/Payment";
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../services/apiCall';
export class SalesOrderDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
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
    saveClick=(e, data, Template) =>{
        let {navAddTab} =this.props;
        // navAddTab({id:7,name:'支付条款详情',component:'支付条款详情',url:'paytrm/detail'});
        this.props.router.push('paytrm/detail');
    }
    backClick=(e, data, Template) =>{
        // let {navAddTab} =this.props;
        // navAddTab({id:7,name:'支付条款详情编辑',component:'支付条款详情编辑',url:'/gather/detailedit'});
        // this.props.router.push('/gather/detailedit');
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
            dilogTelmp:<div></div>
        }
	}
    componentDidMount(){
        this.handleResize();
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
			  <div className='activity-detail  scroll' style={{height:this.state.scrollHeight}}>
	               <EditNormal backClick={this.backClick} saveClick={this.saveClick}/>
                   <Payment />
               </div>
			);
	}

}
export default NavConnect(SalesOrderDetail);
