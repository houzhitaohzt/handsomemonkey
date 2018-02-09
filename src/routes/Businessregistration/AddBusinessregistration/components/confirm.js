import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { ConstVirtualSelect, Option } from '../../../../components/Select'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,API_FOODING_HR} from '../../../../services/apiCall';
import xt from "../../../../common/xt";
export class Addnormal extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        // init func
        // this.handleNumber = this.handleNumber.bind(this);
        this.handleCostName = this.handleCostName.bind(this);
        // state init
        this.state = {
            number: ['Loding...'], // 原单编号
            costName: [{id:1,localName:''}], // 原单编号
        };


    }

    componentDidMount(){
    };
	componentWillUnmount() {
	}

	// 单据编号 ajax
	// handleNumber(){
    //     let that = this;
	// 	apiGet(API_FOODING_ERP,'/common/getNoList',{billType:that.props.otherData.sourceType},
	// 		(response)=>{
	// 			that.setState({	number:response.data });
	// 		},(errors)=>{
	// 			ServiceTips({text:errors.message,type:'error'});
	// 	});
	// }

    // 费用名称
	handleCostName(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.costName,
			(response)=>{
				this.setState({	costName:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 保存
	onSaveAndClose(result){
		let that = this;
		const {data,form, onSaveAndClose, getOneData} = that.props;
        form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_HR,'/evecregister/dtl/save',value,
					(response)=>{	
						that.setState({ billId: response.data },function(){
							ServiceTips({text:response.message,type:'success'});
                            that.props.onSaveAndClose();
                            that.props.form.resetFields(['costlvtrId','chargeAmt','remark']); // 清除表单
                            result && that.onCancel();
						});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});		
	}

    // 取消
	onCancel(){
        this.props.onCancel();
	}

	render(){
		let that = this;
		const { getFieldProps, getNFieldProps, getFieldError} = this.props.form;
		let {otherData,data} = this.props;
		console.log(otherData);
        // 保存 参数
        getFieldProps('billId', {
            initialValue: otherData.sourceId,
        });
        // 编辑 参数
        if(data.number == 0){
            getFieldProps('billDtlId', {
                initialValue: data.record.billDtlId,
            });
            getFieldProps('optlock', {
                initialValue: data.record.optlock,
            });
        } else{
            getFieldProps('billDtlId', {
                initialValue: '',
            });
        }
        return 	<FormWrapper showSaveAdd={data.number} showSaveClose={true} showFooter={true} onSaveAdd={this.onSaveAndClose} onSaveAndClose={this.onSaveAndClose.bind(this,true)} onCancel={this.onCancel}>
                    <div className={'  girdlayout'} style={{height:"344px"}}>
                        <div className={'row'}>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500121/*费用名称*/)}</label>
                                <Select
                                    {...getNFieldProps('costlvtrId',{
                                        rules: [{required:true}],
                                        initialValue: data.number == 0 ? 
                                                        { s_label: data.record['costlvtr'+language], costlvtrId:data.record['costlvtrId'], costlvtrLcName:data.record['costlvtrLcName'], costlvtrEnName:data.record['costlvtrEnName']} 
                                                        : 
                                                        ''
                                    })}
                                    placeholder=''
                                    optionLabelProp="children"
                                    optionFilterProp="children"
                                    allowClear={false}
                                    className ={getFieldError('costlvtrId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
                                    onClick={this.handleCostName}
                                >
                                    {this.state.costName.map((o,i)=><Option key={i} objValue={{s_label:o.localName, costlvtrId: o.id, costlvtrLcName:o.localName, costlvtrEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
                                </Select>
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200246/*金额*/)}</label>
                                <input type="text"
                                       {...getNFieldProps('chargeAmt',{
                                           rules: [{required:true,pattern: xt.pattern.positiveNonZero}],
                                           initialValue: data.number == 0 ? data.record['chargeAmt'] : '',
                                       })}
                                       placeholder={''}
                                       className ={getFieldError('chargeAmt')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
                                />
                            </div>
                        </div>
                        <div className={'row'}>

                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}>{i18n.t(100336/*备注*/)}</label>
                                <input type="text"
                                    {...getNFieldProps('remark',{
                                       initialValue: data.number == 0 ? data.record['remark'] : '',
                                    })}                                
                                    placeholder={''}
                                    className ={'col-md-8 col-lg-8 text-input-nowidth'}
                                />
                            </div>                             
                        </div>
                        
                    </div>
			    </FormWrapper>
    }

}
const ProductForm =createForm()(Addnormal);
export default ProductForm;