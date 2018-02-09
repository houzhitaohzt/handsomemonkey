import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../../components/Select';
import {I18n} from '../../../../lib/i18n';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
class Filter extends Component {
	constructor(props) {
	  super(props);	
	  this.state ={
	  	countryList:[],
	  	customerList:[]
	  }
	}
	serchClick = () =>{
		const { form } = this.props;
		this.props.serchClick(this.props.form.getFieldsValue());
	};
	cleanClick = () => {
		const { form } = this.props;
		this.props.cleanClick(null);
		this.props.form.resetFields();
	};
		// 国家 click
	/*countryClick = () =>{
		let that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Country'},
			(response)=>{							
				that.setState({	countryList: response.data || [] });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}
	customerClick = () => {
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Customer'},
			(response)=>{							
				this.setState({	customerList: response.data || [] });
			},(errors)=>{
				ServiceTips({text:errors.message,type: 'error'});
		});
	}*/
	render(){
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		return(<div className={'filter-header'} style={{display:"inline-block",float:"left",width:"60%"}}>
                    <div className={'filter-header-information-pre'}>
						<label>{i18n.t(100311/*客户*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder={""}
						{...getNFieldProps('name',{
								initialValue:''
							})}/>
					</div>
                    <div className={'filter-header-information-pre'}>
                       <label>{i18n.t(100087/*国家*/)}</label>
					   <ConstVirtualSelect
							form={this.props.form}
							fieldName="statnId"
							apiParams="com.fooding.fc.ds.entity.Country"
							apiType={apiPost}
							initValueOptions={[]}
							initialValue={""}
							style={{width:"200px"}}
							clearable={true}
						/> 
                    </div>
					<div className={'filter-header-key'}>
						<span className="search" onClick={this.serchClick}><i className="foddingicon fooding-search_icon"/></span>
						<span className="clean" onClick={this.cleanClick}><i className="foddingicon fooding-clean_icon"/></span>
					</div>
				</div>)
	}
}
export default createForm()(Filter);