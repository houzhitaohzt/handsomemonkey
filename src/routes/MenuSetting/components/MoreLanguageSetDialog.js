import i18n from './../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
//引入弹层
import Dialog from '../../../components/Dialog/Dialog';
//引入select插件
import Select, { Option } from 'rc-select';

import {I18n} from '../../../lib/i18n';
import {apiGet,apiPost,apiForm,API_FOODING_ES,language,pageSize,sizeList, API_FOODING_ERP} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
class MoreLanguageSetDialog extends Component{
	constructor(props){
		super(props);
		this.state=this.initState();
		this.onSaveAndCloseSecond = this.onSaveAndCloseSecond.bind(this);
		this.onCancelSecond = this.onCancelSecond.bind(this);
	}
	initState(){
		return {
			Language:[],
			data:{},
		}
	}
	componentDidMount(){
		apiGet(this.props.apiHost,'/contentI18N/getOne',{objectId:this.props.menusetView.id,object:this.props.object,attr:this.props.attr},
			(response)=>{
				this.setState({
					data:response.data||{},
					Language:response.data.languages||[]
				});
			},(error)=>{

			});
	}
	onSaveAndCloseSecond(){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				apiPost(this.props.apiHost,'/contentI18N/save',value,(response)=>{
					this.props.onCancel();
					//刷新名称
					this.props.onSaveAndClose();
					ServiceTips({text:response.message,type:'success'});
				},(error)=>{
					ServiceTips({text:error.message,type:'error'});
				});
			}

    	});
	}
	onCancelSecond(){
		this.props.onCancel();
	}
	render(){
		const {menusetView} = this.props;
		let   {data} = this.state;
		const { getFieldProps, getFieldError,getNFieldProps} = this.props.form;
		let dom;
		getFieldProps('object',{
					initialValue:this.props.object
		});
		getFieldProps('objectId',{
					initialValue:menusetView.id
		});
		getFieldProps('objectOptlock',{
			initialValue:menusetView.optlock
		})
        getFieldProps('attr',{
            initialValue:this.props.attr
        })
		return (
			<div>
				<div className='morelanguageset'>
				<div className={'row first'}>
						<label className={'col-xs-4'} style={{textAlign:'left',marginLeft:'7px'}}>{i18n.t(100235/*语言*/)}</label>
						<label className={'col-xs-4'} style={{textAlign:'left',marginLeft:'7px'}}>{i18n.t(200749/*值*/)}</label>
				</div>
				<div className='default'>
					<span className={'col-sm-4'}  style={{marginBottom:'10px'}}>
							{i18n.t(100123/*默认*/)}
					</span>
					<input type="text" className='text-input-nowidth col-sm-6'
                           style={{marginBottom:'10px'}}
						{...getFieldProps('objectName',{
										initialValue:data.default_content?data.default_content:''
						})}
					/>
				</div>
				<div className={'scroll content-menu'}>
					<div>
						{this.state.Language.map((value,i)=>{
								return (<div className={'row'} key={i} style={{marginBottom:'10px'}}>
											<Select
												{...getNFieldProps('contentList['+i+'].language',{
													rules: [{required:true}],
													initialValue:value.id?{s_label:value.name,language:value.id}:undefined
												})}
												className ='currency-btn select-from-currency col-sm-4'
												disabled
											>
											</Select>
											<input type="text"
												{...getFieldProps('contentList['+i+'].content',{
															initialValue:data.contents?(data.contents[value.id]?data.contents[value.id]:''):''
												})}
											 	className='text-input-nowidth col-sm-6'
											 />

										</div>)
						})}
					</div>
				</div>
				</div>
				<div className={'form-wrapper-footer'} >
                        <button type="button" className="btn btn-default btn-ok" onClick={this.onSaveAndCloseSecond}>
                            <span>
                                {i18n.t(200043/*确定*/)}
                            </span>
                        </button>
                        <button type="button" className="btn btn-default btn-cancel" onClick={this.onCancelSecond}>
                            <span>
                                {i18n.t(100461/*取消*/)}
                            </span>
                        </button>
                    </div>
			</div>
		);
	}
}

const MoreLanguageSet = createForm()(MoreLanguageSetDialog);

export default MoreLanguageSet;
