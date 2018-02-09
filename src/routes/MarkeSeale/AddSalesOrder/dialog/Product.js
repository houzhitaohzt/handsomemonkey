import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';


// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../../services/apiCall';
import ProductSelect from '../../../../components/FindGridSelect';


export class Addnormal extends Component{

	constructor(props) {
        super(props);

        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);

        // init func        
		this.searchProduct = this.searchProduct.bind(this);
		this.changeProduct = this.changeProduct.bind(this);
		


        // state init 
        this.state = {
			searchProduct: [{id:1,localName:''}], // 产品下拉
			productData:{mtlType:{}}, // 产品、类型、规格
            

        };


    }

    componentDidMount(){
    };
	componentWillUnmount() {
	};

	// 产品
	searchProduct(e=''){
		apiGet(API_FOODING_DS,'/material/search',{keyword:e},
			(response)=>{							
				this.setState({	searchProduct: response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 产品 切换
	changeProduct(ID=''){
		apiGet(API_FOODING_DS,'/material/getOne',{id:ID.id},
			(response)=>{							
				this.setState({	productData: response.data });
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
				apiPost(API_FOODING_ERP,'/activity/mtl/save',value,
					(response)=>{	
						that.setState({ 
							billId: response.data,
							productData:{mtlType:{}},
							searchProduct: [{id:1,localName:''}]
						},function(){
							ServiceTips({text:'成功！',type:'success'});
                            that.props.onSaveAndClose(1);
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
			productData:{mtlType:{}},
			searchProduct: [{id:1,localName:''}]
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
								<label className={'col-md-2'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
								<ProductSelect 
									form={this.props.form}
									className={getFieldError('mtlId')?'costName-btn select-from-costName col-md-10 col-lg-10 error-border':'costName-btn select-from-costName col-md-10 col-lg-10'}
									titleClass={"col-md-10 col-lg-10"}
									value={record["mtl"+language]?{s_label:record["mtl"+language],mtlId:record.mtlId,mtlLcName:record.mtlLcName,mtlEnName:record.mtlEnName}:undefined}
									onSelect = {this.changeProduct}
									url='/material/search'
								/>
							</div>							
                        </div>
						<div className={'row'}>
							<div className="form-group col-md-12 col-lg-12">
								<label className={'col-md-2 col-lg-2'}>{i18n.t(200172/*产品分类*/)}</label>
								<div className={'col-md-10 col-lg-10'}>
									<p 
										{...getNFieldProps('mtlTyId',{
											rules: [{required:true}],
											initialValue: record['mtlTyId'] ?
															this.state.productData['optlock'] ? 
															{s_label:'',mtlTyId:this.state.productData.mtlType['id'],mtlTyLcName:this.state.productData.mtlType['localName'],mtlTyEnName:this.state.productData.mtlType['localName']}															
															: 
															{s_label:'',mtlTyId:record.mtlTyId,mtlTyLcName:record.mtlTyLcName,mtlTyEnName:record.mtlTyEnName} 
															: 
															{s_label:'',mtlTyId:this.state.productData.mtlType['id'],mtlTyLcName:this.state.productData.mtlType['localName'],mtlTyEnName:this.state.productData.mtlType['localName']}
										})}									
									>
										{  this.state.productData['optlock'] ? this.state.productData.mtlType['localName'] : record['mtlTy'+language] || ''}
									</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-12 col-lg-12">
								<label className={'col-md-2 col-lg-2'}>{i18n.t(100382/*产品规格*/)}</label>
								<div className={'col-md-10 col-lg-10'}>								
									<p 
										{...getNFieldProps('basSpeci',{
											initialValue: this.state.productData['specTxt'] || ''
										})}											
									>
										{ this.state.productData['optlock'] ? this.state.productData['specTxt'] : record['basSpeci'] || ''}
									</p>
								</div>
							</div>
						</div>
                    </div>
			    </FormWrapper>
    }

}
const ProductForm =createForm()(Addnormal);
export default ProductForm;