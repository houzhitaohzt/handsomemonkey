import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import {createForm,FormWrapper} from '../../../components/Form';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_WORK} from '../../../services/apiCall';
import WebData from '../../../common/WebData';
import ServiceTips from "../../../components/ServiceTips";//提示框
class ActiveTask extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
    this.onSaveAndClose = this.onSaveAndClose.bind(this);
	}
	initState(){
		let that = this;
		return{
			rodalShow:false,
			position :{},
      taskId:this.props.taskId,
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
          let dd = value.message?value.message:(document.getElementsByTagName('select')[0].value==1?i18n.t(300072/*通过*/):i18n.t(300073/*不通过*/))
					apiPost(API_FOODING_WORK,'/service/runtime/tasks/'+this.state.taskId+'/complete',{
									assignee:userId,
									action:"complete",
									comment:{message:dd,saveProcessInstanceId:true},
									variables:[{name:document.getElementsByTagName('select')[0].name,
								  value:document.getElementsByTagName('select')[0].value}]
									},(response)=>{
										this.props.onSaveAndClose();
										ServiceTips({text:response.message,type:'success'})

					},(error)=>{
								ServiceTips({text:error.message,type:'error'});
					})
        }
    });

  }
	componentDidMount(){
    let that = this;
    apiGet(API_FOODING_WORK,'/service/form/form-view/default-form2',{taskId:this.state.taskId},(response)=>{
       this.setState({
         content:response.data
       })
    },(error)=>{

    })
  }
	componentWillUnmount(){
	}
	render(){
    let {getFieldProps} = this.props.form;
		return(
      <FormWrapper
      showFooter={true}
      buttonLeft = {this.props.buttonLeft}
      onSaveAndClose={this.onSaveAndClose}
      onCancel={this.props.onCancel}
      showSaveClose={this.props.showSaveClose}
      >
				<div className='row scroll' style={{maxHeight:'344px',overflowY:'auto',overflowX:'hidden'}}>
          <div className='task' style={{height:this.state.scrollHeight}}
          dangerouslySetInnerHTML={{__html:this.state.content}}
          >
         </div>
         <div className='form-group' style={{marginLeft:'10px',marginRight:'10px'}}>
           <label className='col-sm-4 control-label' style={{paddingLeft:5,paddingRight:20,textAlign:'right'}}>{i18n.t(300074/*批注*/)}</label>
           <div className='col-sm-8' style={{paddingLeft: '10px',paddingRight: '5px',marginTop:'10px'}}>
             <textarea
                 {...getFieldProps('message',{
                   initialValue:''
                  })}
                 className={'text-input-nowidth'}
                 style={{resize:'none',height:'100px',width:'100%'}}
               />
           </div>
         </div>
			 </div>
		</FormWrapper>)
	}
}
export default createForm()(NavConnect(ActiveTask));
