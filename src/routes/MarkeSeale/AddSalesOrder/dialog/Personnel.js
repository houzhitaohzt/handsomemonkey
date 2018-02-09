import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';


// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../../services/apiCall';



export class Addnormal extends Component{

	constructor(props) {
        super(props);

        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);

        // init func        
		this.searchPersonnel = this.searchPersonnel.bind(this);
		this.changeProduct = this.changeProduct.bind(this);
		


        // state init 
        this.state = {
			searchPersonnel: [{id:1,staffLocalName:'Looding...'}], // 产品下拉
			personnelData:{mtlType:{}}, // 产品、类型、规格
            

        };


    }

    componentDidMount(){
    };
	componentWillUnmount() {
	};

	// 产品
	searchPersonnel(e=''){
		apiGet(API_FOODING_ES,'/user/getListForPermissionsInParty',{partyId:this.props.otherData.ccId},
			(response)=>{							
				this.setState({	searchPersonnel: response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 产品 切换
	changeProduct(ID=''){
		apiGet(API_FOODING_DS,'/material/getOne',{id:ID},
			(response)=>{							
				this.setState({	personnelData: response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

     

	// 保存
	onSaveAndClose(){

		let that = this;
		const {form, onSaveAndClose} = that.props;

		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_ERP,'/activity/staff/save',value,
					(response)=>{	
						that.setState({ 
							billId: response.data,
							personnelData:{mtlType:{}},
							searchPersonnel: [{id:1,localName:''}]
						},function(){
							ServiceTips({text:'成功！',type:'success'});
                            that.props.onSaveAndClose(2);
                            that.props.form.resetFields(); // 清除表单
						});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});		
	}

    // 取消
	onCancel(){
        this.props.form.resetFields(); // 清除表单
        this.props.onCancel();
		this.setState({ 
			personnelData:{mtlType:{}},
			searchPersonnel: [{id:1,localName:''}]
		});		
	}

	render(){

		let that = this;
		const { getFieldProps, getNFieldProps, getFieldError} = this.props.form;
		let {otherData,data} = this.props;

		let record = data.number ? {} : data.record;			


        	
        if(data.number == 1){
			// 新增					
			getFieldProps('billId', {
				initialValue: otherData.billId,
			});				
            getFieldProps('billDtlId', {
                initialValue: '',
            });	 
            getFieldProps('optlock', {
                initialValue: otherData.optlock,
            });				           
        } else{
			// 编辑 参数
			getFieldProps('billId', {
				initialValue: record.billId,
			});	
            getFieldProps('billDtlId', {
                initialValue: data.record.billDtlId,
            });	
            getFieldProps('optlock', {
                initialValue: data.record.optlock,
            });	                       
        }

        return 	<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
                    <div className={'  girdlayout'} style={{height:"344px"}}>
                        <div className={'row'}>
							<div className="form-group col-md-12">
								<label className={'col-md-2'}><span>*</span>{i18n.t(400145/*职员*/)}</label>
								<Select
									{...getNFieldProps('staffId',{
										rules: [{required:true}],
										initialValue: record['staffId'] ? 
														{ s_label: record['staff'+language], staffId: record.staffId, staffLcName: record.staffLcName, staffEnName: record.staffEnName} 
														: 
														'',
									})}
									placeholder=''
								    optionFilterProp="children"
                                    className ={getFieldError('staffId')?'costName-btn select-from-costName col-md-10 col-lg-10 error-border':'costName-btn select-from-costName col-md-10 col-lg-10'}
									onClick={that.searchPersonnel}	
								>
									{this.state.searchPersonnel.map((o,i)=><Option key={o.id} objValue={{s_label:o.staffLocalName, staffId:o.refId, staffLcName:o.staffLocalName, staffEnName:o.staffLocalName}} title={o.staffLocalName}>{o.staffLocalName}</Option>)}
								</Select>
							</div>							
                        </div>
						<div className={'row'}>
							<div className="form-group col-md-12 col-lg-12">
								<label className={'col-md-2 col-lg-2'}>{i18n.t(200714/*工作内容*/)}</label>
								<div className={''}>								
									<textarea className={'col-md-10 col-lg-10 textarea'}
										{...getNFieldProps('workNote',{
											initialValue: record['workNote'] || ''
										})}											
									>
									</textarea>
								</div>
							</div>
						</div>
                    </div>
			    </FormWrapper>
    }

}
const ProductForm =createForm()(Addnormal);
export default ProductForm;