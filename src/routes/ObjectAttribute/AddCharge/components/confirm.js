import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { ConstVirtualSelect, Option } from '../../../../components/Select'; // 下拉
import AddMoreLanguage from "../../../../components/AddMoreLanguage"; 


// ajax
import {getQueryString,apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,language,commonAjax,} from '../../../../services/apiCall';
export class Addnormal extends Component{
	constructor(props) {
        super(props);

        // state init 
        this.state = {
            data:{}, // getOne
            typeID: undefined, // 属性类型 ID 
        };
    }

    componentDidMount(){
        this.getOne();
    }

	componentWillUnmount() {
	}

    // getOne 
    getOne = ()=> {
        let {data} = this.props;

        if( data['number'] ) return;
        apiGet(API_FOODING_DS,'/formObjectAttr/getOne',{id:data.record.id},
            (response)=>{
                this.setState({data: response['data']});
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });	
    }

    // 属性类型 切换  
    TypeChange = (ID)=> this.setState({typeID:ID});
        
	// 保存
	onSaveAndClose =(result)=> {

		let that = this;
        let {data} = this.state;
		const {form,onSaveAndClose} = that.props;

		form.validateFields((errors, value) => {
			if(errors){
			}else{

                let otherData = !value['formObjectId'] ? {formObjectId:""} :{};
    
				apiPost(API_FOODING_DS,'/formObjectAttr/save',Object.assign({},data,{sourceId:getQueryString('id')},value,otherData),
					(response)=>{	
						that.setState({ billId: response.data },function(){
							ServiceTips({text:response.message,type:'success'});
                            that.props.onSaveAndClose();
						});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});		
	}

	render(){

		let that = this;
		const { getFieldProps, getNFieldProps, getFieldError} = this.props.form;
		let {form,otherData} = this.props;
        let {data,typeID} = this.state;


        return 	<FormWrapper showSaveClose={true} showFooter={true}  onSaveAndClose={this.onSaveAndClose.bind(this,true)} onCancel={this.props.onCancel}>
                    <div className={'girdlayout'} style={{height:"200px"}}>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label className={'col-md-3'}><span>*</span>{i18n.t(600228/*属性名称*/)}</label>
                                <div className="col-md-9" style={{padding:"0px"}}>
								<input  
                                    type="text"
                                    style={{width:"100%"}}
                                    className={getFieldError("localName") ?'text-input-nowidth error-border':'text-input-nowidth'} 
                                    {...getFieldProps('localName',{
                                        validateFirst: true,
                                        rules: [{required:true}],
                                        initialValue:data.localName}
                                    )}
								/>
                                { data['id'] ? 
                                    <AddMoreLanguage 
                                        menusetView={data}
                                        object = {'formObjectAttr'}
                                        isShowId={true}
                                        upload={this.getOne}
                                        onCancel ={this.onCancel}
                                    />:''
                                }
                                </div>											
                            </div>
                            <div className="form-group col-md-6">
                                <label className={'col-md-3'}><span>*</span>{i18n.t(600229/*属性标识*/)}</label>
                                <div className="col-md-9">
                                    <input
                                        style={{width:"100%"}}
                                        className={getFieldError('attrIdentity')?'text-input-nowidth error-border':'text-input-nowidth'}
                                        {...getFieldProps('attrIdentity',{
                                            rules:[{required:true}],
                                            initialValue: data.attrIdentity ? data.attrIdentity : ''
                                        })}
                                    />											
                                </div>																	
                            </div>							
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label className={'col-md-3'}><span>*</span>{i18n.t(600230/*属性类型*/)}</label>
                                <div className="col-md-9">
                                    <ConstVirtualSelect
                                        style={{width:'332px'}}
                                        form={form}
                                        apiType={apiPost}
                                        fieldName="attrTypeId"
                                        labelKey='localName'
                                        apiParams="com.fooding.fc.enumeration.FormObjectAttrType"
                                        initialValue={data.formObjectAttrType ? {s_label: data.formObjectAttrType.name,attrTypeId:data.formObjectAttrType.id} : undefined}
                                        clearable
                                        rules
                                        onChange={this.TypeChange}
                                    />
                                </div>
                            </div>	
                            { (typeID ? typeID == 4 : (data['attrTypeId']==4)) ?
                                <div className="form-group col-md-6">
                                    <label className={'col-md-3'}>{i18n.t(600227/*取值*/)}</label>
                                    <div className="col-md-9">
                                        <ConstVirtualSelect
                                            style={{width:'322px'}}
                                            form={form}
                                            apiType={apiPost}
                                            fieldName="formObjectId"
                                            labelKey='localName'
                                            apiParams={{
                                                obj:"com.fooding.fc.ds.entity.FormObject",
                                                name:"localName"
                                            }}
                                            initialValue={data.formObject ? {s_label: data.formObject.name,formObjectId:data.formObject.id} : undefined}
                                            clearable
                                        />
                                    </div>
                                </div>
                                :''	                            
                            }
															
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label className={'col-md-3'}>{i18n.t(600234/*参数*/)}</label>
                                <div className="col-md-9" style={{padding:"0px"}}>
								<input  
                                    type="text"
                                    style={{width:"100%"}}
                                    className="text-input-nowidth"
                                    {...getFieldProps('queryParams',{
                                        initialValue:data.queryParams}
                                    )}
								/>
                                </div>											
                            </div>
						
                        </div>                        
                    </div>
			    </FormWrapper>
    }

}
const ProductForm =createForm()(Addnormal);
export default ProductForm;