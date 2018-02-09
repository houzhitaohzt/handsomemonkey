import i18n from './../../../lib/i18n';
import React,{Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,API_FOODING_OA,language,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import xt from '../../../common/xt';
class Edit extends Component{
	constructor(props){
		super(props)
		this.onZhushi = this.onZhushi.bind(this);
		this.state={
			num:2000
		}
	}
	onContentChange = (value,prevValue,allValues) => {
		let newV = value.replace(/\s+/gim,"");
		let Max = 2000,number = 0;
		let curNum = newV.length;
		if(curNum > Max){
			alert(i18n.t(200117/*文字已经不能输入*/))
			return prevValue.replace(/\s+/gim,"");
		}
		number = Max - curNum;
		this.setState({num : number})
		return value;
	}
	onZhushi(){
		let that = this;
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				let obj = Object.assign({},value,{businessType:this.props.businessType,businessId:this.props.id})
				apiPost(API_FOODING_OA,'/comment/create',obj,(response)=>{
					this.props.getPage();
					this.props.form.resetFields();
				},(error)=>{

				});
			}
	      	
    	});
	}
	render(){
		let {getFieldError,getFieldProps}= this.props.form;
		let {permissions=''} = this.props;
		
		return(<div className={'annotation-content-input'}>
			<div className={'annotation-content-input-theme'}>
				<label><span>*</span>{i18n.t(100304/*主题*/)}</label>
				<input type='text' className={getFieldError("title")?'text-input-nowidth error-border':'text-input-nowidth'} 
														placeholder=""
														{...getFieldProps('title',{
															validateFirst:true,
															rules:[{required:true}],
															valuedateTrigger:'onBlur',
															initialValue:''
														})}  
					style={{width:'100%'}}
				/>
			</div>
			<div className={'annotation-content-input-textarea'}>
				<div><span className="annotation-show">{i18n.t(200041/*内容*/)}</span>{i18n.t(200040/*还可以输入*/)}<span>{this.state.num}</span>{i18n.t(200042/*字符*/)}</div>
				<textarea 
					{...getFieldProps('content',{
															validateFirst:true,
															rules:[{required:true}],
															valuedateTrigger:'onBlur',
															initialValue:'',
															normalize: (value, prevValue, allValues) => {
																if (value === prevValue) {
																	return value;
																}
																return this.onContentChange(value,prevValue,allValues);
															}
					})} 
					className={getFieldError("content")?'error-border':''}
				>
				</textarea>
				{ permissions ?
					<input data-permissions={permissions} type='button' value={i18n.t(100148/*注释*/)} className={'button'} onClick={this.onZhushi}/>
					:
					''
				}
			</div>
		</div>)
	}
}
export default createForm()(Edit);
