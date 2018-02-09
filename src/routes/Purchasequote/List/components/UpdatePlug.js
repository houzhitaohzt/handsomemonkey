import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option } from '../../../../components/Select';
import Confirm from '../../../../components/Dialog/Confirm';
import DataTime from  '../../../../components/Calendar/Calendar';
import WebData from '../../../../common/WebData';
import {I18n} from "../../../../lib/i18n";
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList, toDecimal} from '../../../../services/apiCall';
//引入table
const {Table} = require("../../../../components/Table");
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import xt from "../../../../common/xt";

export class Productplug extends Component{
	constructor(props){
		super(props);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				apiPost(API_FOODING_ERP,'/purquotation/updatePrice',value, response => {
					onSaveAndClose && onSaveAndClose();
                    ServiceTips({text:response.message,type:'success'});
						// this.setState({
						// 	data:response.data
						// });
						// this.props.onCancel();
						// window.navTabs.open(i18n.t(201017/*供应商报价编辑*/), '/purchasequote/add', {id:response.data});
		               // // window.location.href ='/purchasequote/add?'+'id='+value.billId
					},errors=> ServiceTips({text:errors.message,type:'error'}));
			}
		})
	}

	onCancel(){
		const {form, onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}
	onClick(){

	}
	render(){
		let that = this;
		let {form} = this.props;
		const { getFieldProps, getFieldError, getNFieldProps} = this.props.form;
		let {checkedDataArr} = this.props;
		//let content = <div></div>;
		// getFieldProps('billId',{
		// 						initialValue:checkedData.billId
		// })


		// if(this.props.DialogContent == 1){
		// 	content = (
         //   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
		// 			<div className={'  girdlayout'}>
		// 				<div className={'row'}>
		// 					<div className="form-group col-md-6 col-lg-6">
		// 						<label className={'col-md-4 col-lg-4'}>{i18n.t(500125/*货币*/)}</label>
		// 						<div className={'col-md-8 col-lg-8'}>
		// 								<p className={'paragraph'}>{checkedData["cny"+language]?checkedData["cny"+language]:''}</p>
		// 						</div>
        //
		// 					</div>
		// 					<div className="form-group col-md-6 col-lg-6">
		// 						<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200951/*整柜价*/)}</label>
		// 						<input  type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
		//                                {...getFieldProps('fclPrice', {
		//                                    validateFirst: true,
		//                                    rules: [{required: true,}],
		//                                    initialValue: String(checkedData.fclPrice || ''),
		//                                })}
		//                         />
		// 					</div>
		// 				</div>
		// 				<div className={'row'}>
		// 						<div className="form-group col-md-6 col-lg-6">
		// 							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
		// 							<div className={'col-md-8 col-lg-8 datetime'}>
		// 								<DataTime
		// 									showTime={false}
		// 									isShowIcon={true}
		// 									width={'100%'}
		// 									form={this.props.form}
		// 									name={'sDate'}
		// 									value={new Date()}
		// 								/>
		// 							</div>
		// 						</div>
		// 						<div className="form-group col-md-6 col-lg-6">
		// 							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100287/*失效日期*/)}</label>
		// 							<div className={'col-md-8 col-lg-8 datetime'}>
		// 								<DataTime
		// 									showTime={false}
		// 									isShowIcon={true}
		// 									width={'100%'}
		// 									form={this.props.form}
		// 									name={'eDate'}
		// 									validate={true}
		// 								/>
		// 							</div>
		// 						</div>
		// 				</div>
        //
		// 			</div>
		// 	</div>
         //   	);
		// }
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true}
							onSaveAndClose={this.onSaveAndClose.bind(this)} onCancel={this.onCancel}
							>
						<Table
							columns={[{
                                title : i18n.t(100312/*供应商*/),
                                dataIndex : 'vndBe'+language,
                                key : "vndBe"+language,
                                width : "18%",
                                render(data,row,index){
                                    return (<div className={'text-ellipsis'} style={{width:"140px"}}>{data}</div>)
                                }
                            },{
                                title : i18n.t(100379/*产品*/),
                                dataIndex : 'mtl'+language,
                                key : "mtl"+language,
                                width : "12%",
                                render(data,row,index){
                                    return (<div className={'text-ellipsis'} style={{width:"90px"}}>{data}</div>)
                                }
                            },{
                                title : i18n.t(100382/*产品规格*/),
                                dataIndex : 'basSpeci',
                                key : 'basSpeci',
                                width : "20%",
                                render(data,row,index){
                                    return (<div className={'text-ellipsis'} style={{width:"160px"}}>{data}</div>)
                                }
                            },{
                                title : i18n.t(200951/*整柜价*/),
                                dataIndex : 'fclPrice',
                                key : "fclPrice",
                                width : "16%",
                                className:'text-right',
								ignore_equals:true,
                                render(data,row,index){
                                	return (<div>
										<span hidden {... getFieldProps('list[' + index.index + '].billId', { initialValue: row.billId})} />
										<input style={{width: 60}} className={getFieldError('list[' + index.index + '].fclPrice')?"error-border text-input-nowidth":'text-input-nowidth'}
                                               {...getFieldProps('list[' + index.index + '].fclPrice', {
                                                   validateFirst: true,
                                                   rules: [{required: true, pattern: xt.pattern.positiveNonZero}],
                                                   initialValue: Number(data),
                                               })}
										/>&nbsp;
										{row["cny"+language]}
									</div>);
                                }
                            },{
                                title : i18n.t(100286/*生效日期*/),
                                dataIndex : 'sDate',
                                key : 'sDate',
                                width : "18%",
                                ignore_equals:true,
                                render(data,row,index){
                                    return (<DataTime
										//range={true}
										//type="start"
										//startName={"entity[" + index.index + "].sDate"}
										name={"list[" + index.index + "].sDate"}
										//endName={"entity[" + index.index + "].eDate"}
										showTime={false}
										width={'100%'}
										isShowIcon={true}
										form={form}
										validate={true}
										value={new Date().Format('yyyy-MM-dd')}
										//value={data && row.eDate? [new Date(data).Format('yyyy-MM-dd'), new Date(row.eDate).Format('yyyy-MM-dd')] : [undefined, undefined]}
									/>)
                                }
                            },{
                                title : i18n.t(100287/*失效日期*/),
                                dataIndex : 'eDate',
                                key : "eDate",
                                width : '18%',
                                ignore_equals:true,
                                render(data,row,index){
                                    return (<DataTime
										//range={true}
										//type="end"
										//startName={"entity[" + index.index + "].sDate"}
										name={"list[" + index.index + "].eDate"}
										//endName={"entity[" + index.index + "].eDate"}
										showTime={false}
										width={'100%'}
										isShowIcon={true}
										form={form}
										validate={true}
										value={undefined}
										//value={data && row.sDate? [new Date(row.sDate).Format('yyyy-MM-dd'), new Date(data).Format('yyyy-MM-dd')] : [undefined, undefined]}
									/>)
                                }
                            }]}
							data={checkedDataArr || []}
							checkboxConfig={{show:false}}
							colorFilterConfig={{show:false}}
							followConfig={{show:false}}
							prefixCls={"rc-confirm-table"}
							scroll={{x:false, y:210}}
						/>
							</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(Productplug);
export default ProductForm;
