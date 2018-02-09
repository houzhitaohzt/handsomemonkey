import i18n from './../../../lib/i18n';
import React,{Component} from 'react';
import Confirm from '../../../components/Dialog/Confirm';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,API_FOODING_OA,language,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import {createForm,FormWrapper} from "../../../components/Form";
import WebData from '../../../common/WebData';
export class Record extends Component{
	constructor(props){
		super(props)
		this.deleteSingle=this.deleteSingle.bind(this);
		this.replySingle=this.replySingle.bind(this);
		this.textArea=this.textArea.bind(this);
		this.published = this.published.bind(this);
		this.chakanClick = this.chakanClick.bind(this);
		this.state={
			ShowtextIndex:-1,
			textAreaArr:[],
			activeShow:-1,
			pinLunArray:[]
		}
	}
	chakanClick(item,index){
		let that = this;
		apiGet(API_FOODING_OA,'/comment/getReplyList',{id:item.id},(response)=>{
			let pinlun = this.state.pinLunArray;
			pinlun[item.id] = response.data;
			this.setState({
				pinLunArray:pinlun
			})
		},(error)=>{

		});
	}
	deleteSingle(item,index){
		Confirm(i18n.t(200372/*删除后将无法恢复，您确定要删除吗*/),{
  			done:() => {
  				apiForm(API_FOODING_OA,'/comment/delete',{id:item.id},(response)=>{
  					ServiceTips({text:response.message,type:'sucess'});
  					if(item.comment){
						this.chakanClick(item.comment,index);
  					}else {
  						this.props.getPage();
  					}

  				},(error)=>{
  					ServiceTips({text:error.message,type:'error'});
  				})
  			},
  			close:()=> {
  				console.log('no close');
  			}
  		})
	}
	published(item,index){
		//发表评论
		let that = this;
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				let obj = Object.assign({},value,{businessType:this.props.businessType,
					businessId:this.props.id,parentCommentId:item.id,flag:1});
				obj.comment={id:item.id};
				apiPost(API_FOODING_OA,'/comment/create',obj,(response)=>{
					this.chakanClick(item,index);
					this.props.form.resetFields();
				},(error)=>{
					ServiceTips({text:error.message,type:'error'});
				});
			}

    	});
	}
	replySingle(item,index){
		this.setState({
			ShowtextIndex:item.id,
			activeShow:item.id
		});
		this.props.form.resetFields();
	}
	textArea(item,index,e){
		let {textAreaArr} = this.state;
		for(var i = 0; i< this.props.arr.length; i++){
			if(index === i){
				textAreaArr[i]=i18n.t(300057/*回复*/)+'@'+item.userName+':';
			}
		}
		textAreaArr[index] = e.target.value;
		this.setState({
			textAreaArr : textAreaArr
		})

	}
	render(){
		let {arr} = this.props;
		let {getFieldProps,getFieldError} = this.props.form;
		let that = this;
		let loginName = WebData.user?WebData.user.data.loginName:'';
		return (
			<div>
				{
					arr.map((item,index)=>{
						let pl=that.state.pinLunArray[item.id]||[];
						return (
							<div className={'annotation-content-comment-single'}  key={index}>
								<div className={'annotation-content-comment-single-left'}>
									<p><i className="foddingicon fooding-user_icon"></i></p>
								</div>
								<div className={'annotation-content-comment-single-right'}>
									<div className={'right-name'}><span>{item["userName"]}</span>&nbsp;&nbsp;<span>{new Date(item.dateTime).Format('yyyy-MM-dd hh:mm:ss')}</span></div>
									<div className={'right-theme'}>
										<h5>{item.title}</h5>
										<div className={'right-key'}>
											{item["userName"] == loginName?<a href="javascript:;" onClick={this.deleteSingle.bind(this,item,index)}>{i18n.t(100437/*删除*/)}</a>:''}
											<a href="javascript:;" onClick={this.replySingle.bind(this,item,index)} className={this.state.ShowtextIndex == item.id ? 'active':''}>{i18n.t(200271/*回复*/)}</a>
											<a href="javascript:;" onClick={this.chakanClick.bind(this,item,index)}>{i18n.t(200272/*查看评论*/)}</a>
										</div>
									</div>
									<p className={'right-content'}>{item.content}</p>
									{
										pl.map((value,i)=>{
													return (<div key={i} className={'right-theme'}>
															<h1 style={{marginBottom:5,wordWrap:'break-word',width:'80%',wordBreak: 'normal'}}><span className={'right-content'} style={{marginRight:10}}>{value.userName+'@'+value.title+':'}</span>{value.content}</h1>
															<div className={'right-key'}>
																<span style ={{color:'#ccc',fontSize:'12px'}}>{new Date(value.dateTime).Format('yyyy-MM-dd hh:mm:ss')}</span>
																<a href="javascript:;" onClick={this.deleteSingle.bind(this,value,index)}>{i18n.t(100437/*删除*/)}</a>
															</div>
														</div>);
										})
									}
									<div className={this.state.ShowtextIndex == item.id ? 'right-input':'none'}>
										<textarea
										onChange={this.textArea.bind(this,item,index)}
										{...getFieldProps('content',{
															validateFirst:true,
															rules:[{required:true}],
															valuedateTrigger:'onBlur',
															initialValue:''
										})}
										className={getFieldError("content")?'error-border':''}
										></textarea>
										<input type='button' value={i18n.t(200273/*发表*/)} className={'button'} onClick={this.published.bind(this,item,index)}/>
									</div>
								</div>
							</div>
						)
					})
				}
			</div>
		)
	};
}
export default createForm()(Record);
