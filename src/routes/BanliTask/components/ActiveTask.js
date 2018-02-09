import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import {createForm,FormWrapper} from '../../../components/Form';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_WORK} from '../../../services/apiCall';
import WebData from '../../../common/WebData';
import Confirm from "../../../components/Dialog/Confirm";
import ServiceTips from "../../../components/ServiceTips";//提示框
class ActiveTask extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
    this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}
	onCancel(){
		let that = this;
		window.navTabs.close();
	}
	initState(){
		let that = this;
		return{
			rodalShow:false,
			position :{},
			message:null,
      taskId:this.props.location.query.taskId,
      content:<div></div>
		}
	}
  onSaveAndClose(){
    let that = this;
    if(document.getElementsByTagName('select')[0].value =='please select'){
        ServiceTips({text:i18n.t(300071/*请选择是否通过任务？*/), type: 'error'});
        return false;
    }
    let userId = WebData.user.data.id;
    this.props.form.validateFields((error, value) => {
        if(error){
          console.log(error, value);
        }else{
					Confirm(i18n.t(100141/*是*/)+i18n.t(100142/*否*/)+i18n.t(200110/*完成任务*/), {
							done: () => {
									let dd = value.message?value.message:(document.getElementsByTagName('select')[0].value==1?i18n.t(300072/*通过*/):i18n.t(300073/*不通过*/))
									apiPost(API_FOODING_WORK,'/service/runtime/tasks/'+this.state.taskId+'/complete',{
													assignee:userId,
													action:"complete",
													comment:{message:dd,saveProcessInstanceId:true},
													variables:[{name:document.getElementsByTagName('select')[0].name,
													value:document.getElementsByTagName('select')[0].value}]
													},(response)=>{
														ServiceTips({text:response.message,type:'success'});
														this.onCancel();
									},(error)=>{
												ServiceTips({text:error.message,type:'error'});
									})
							}
					});

        }
    });

  }
	componentDidMount(){
    let that = this;
    apiGet(API_FOODING_WORK,'/service/form/form-view/default-form2',{taskId:this.state.taskId},(response)=>{
       this.setState({
         content:response.data,
				 message:1
       })
    },(error)=>{
       this.setState({
				 message:error.message
			 })
    })
  }
	componentWillUnmount(){
	}
	render(){
    let {getFieldProps} = this.props.form;
		let diaConetent = <div></div>;
		if(this.state.message == 1){
			diaConetent=(
					 <div style={{width:'70%',margin:'auto'}}>
					 <div className='scroll' style={{maxHeight:'350px',overflowY:'auto',overflowX:'hidden'}}>
						 <div className='task'
						 dangerouslySetInnerHTML={{__html:this.state.content}}
						 >
						 </div>
						
						<div className='form-group' style={{marginLeft:'10px',marginRight:'10px'}}>
							<label className='col-sm-4 control-label' style={{paddingLeft:5,marginTop:15,paddingRight:20,textAlign:'right'}}>{i18n.t(300074/*批注*/)}</label>
							<div className='col-sm-8' style={{paddingLeft: '10px',paddingRight: '5px',marginTop:'10px'}}>
								<textarea
										{...getFieldProps('message',{
											initialValue:''
										 })}
										className={'text-input-nowidth'}
										style={{resize:'none',height:'100px',width:'100%',marginBottom:20}}
									/>
							</div>
						</div>
						</div>
						<div className='form-wrapper-footer'>
							<button className='btn btn-default btn-ok' onClick={this.onSaveAndClose}>
								<span >{i18n.t(200110/*完成任务*/)}</span>
							</button>
							<button className='btn btn-default btn-cancel' onClick={this.onCancel}>
								<span >{i18n.t(100461/*取消*/)}</span>
							</button>
						</div>
					</div>
		 )
	 }else {
	 	   diaConetent = this.state.message;
	 }

		return(
				<div className='client-body' style={{height:document.body.offsetHeight-80,marginTop:10,paddingTop:20}}>
					  {diaConetent}
			 </div>
		)
	}
}
export default createForm()(NavConnect(ActiveTask));
