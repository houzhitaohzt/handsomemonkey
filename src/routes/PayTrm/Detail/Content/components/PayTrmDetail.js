import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import Normal from "./Normal";
import Payment from "./Payment";
import Oragn from "./Oragn";
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
export class PayTrmDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.getInfo= this.getInfo.bind(this);
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
    getInfo(){
       var that = this;
       apiGet(API_FOODING_DS,'/payTrm/getOne',{id:this.state.id},(response)=>{
            that.setState({
                data:response.data
            })
        },(error)=>{

        })
    }
    alterClick=(e, data, Template) =>{
        var that = this;
         apiGet(API_FOODING_DS,'/payTrm/getOne',{id:this.state.id},(response)=>{
           let content=require('./EditNormal').default;
            let element=React.createElement(content,{onSaveAndClose:that.onSaveAndClose,
                onCancel:that.onCancel,info:that.state.info,
                upload :that.refs.normal.getInit,
                data:response.data});
            that.setState({
                dialogContent: element
            })
        },(error)=>{

        })
            this.setState({
                visible : true,
                title: i18n.t(200837/*常规编辑*/),
                dialogContent: <div></div>
            })
    }
    onSaveAndClose(value){
        var that = this;
        value = Object.assign({},value);
        apiPost(API_FOODING_DS,'/payTrm/save',value,(response)=>{
            ServiceTips({text:response.message,type:'sucess'});
            that = that.refs.normal.getInit();
        },(error) =>{
            ServiceTips({text:error.message,type:'error'})
        })
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
            data:{},
            dilogTelmp:<div></div>,
            id:this.props.location.query.id
        }
	}
        getinit(){
            var that = this;
       apiGet(API_FOODING_DS,'/payTrm/getInit',{},(response)=>{
            that.setState({
                info:response.data
            })
        },(error)=>{

        })
        }
    componentDidMount(){
        this.handleResize();
        this. getinit();
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
	               <Normal alterClick={this.alterClick} id={this.state.id} info={this.state.info} ref='normal'/>
                   <Payment id={this.state.id}/>
                   <Oragn id={this.state.id}/>
                <Dialog width={926} visible={this.state.visible} title={this.state.title}>
                        {this.state.dialogContent}
                    </Dialog>
               </div>
			);
	}

}
export default NavConnect(PayTrmDetail);
