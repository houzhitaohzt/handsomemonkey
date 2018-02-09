import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
//引入弹层
import NoIconAndRightKeys from "./NoIconAndRightKeys";

class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onCancel=this.onCancel.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
	}

	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onCancel: PropTypes.func,
		initData:PropTypes.object
	}


	componentDidMount(){

	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(null==errors){
				if(onSaveAndClose){
					let record= form.getFieldsValue();
					addUpdateRecord
					/*addUpdateJson*/(record,(value)=>{
						onSaveAndClose(value);
					},(msg)=>{
						console.log(msg);
					});
				}
			}
		})
	}
	render(){
		const {form} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		return (<FormWrapper showFooter={true}  onCancel={this.onCancel} onSaveAndClose={this.onSaveAndClose}>
			<div className={'  girdlayout scroll'} style={{height:"344px",overflow:'auto'}}>
				<div className={'row'}>
					<div className="form-group col-xs-4 col-md-4">
						<label className={'col-xs-5 col-md-5'}><span>*</span>{i18n.t(200067/*成本利用率*/)}</label>
						<input type='text' className={'col-xs-5 col-md-5 text-input-nowidth'} 
							placeholder=""
							{...getFieldProps('code',{
								validateFirst:true,
								rules:[{required:true,}],
								valuedateTrigger:'onBlur',
								initialValue:''
							})} />
							<label className={'col-xs-2 col-md-2'} style={{textAlign:'left'}}>%</label>
					</div>
					<div className="form-group col-xs-3 col-md-3">
						<label className={'col-xs-6 col-md-6'}>{i18n.t(200068/*询价总额*/)}</label>
						<div className={'col-xs-6 col-md-6'}>
                            <p className={'paragraph'}>20000</p>
                        </div>
					</div>
					<div className="form-group col-xs-3 col-md-3">
						<label className={'col-xs-6 col-md-6'}>{i18n.t(200069/*报价总额*/)}</label>
						<div className={'col-xs-6 col-md-6'}>
                            <p className={'paragraph'}>18000</p>
                        </div>
					</div>
					<div className="form-group col-xs-2 col-md-2">
						<span className={'col-xs-4 col-md-4'} style={{backgroundColor:'#0066cc', textAlign:'center',color
						:'#fff',fontSize:'16px',borderRadius:'6px',padding:'0px'}}><i className={'foddingicon fooding-count-price'}></i></span>
					</div>
				</div>
			<NoIconAndRightKeys title={i18n.t(200070/*产品价格*/)} showHeader={true} showCheckbox={false} 
				columns ={[{
                            title : i18n.t(500061/*产品名称*/),
                            dataIndex : 'name',
                            key : "name",
                            width : '20%',
                            render(data,row,index){
                                return (<div title={data}>{data}</div>)
                            }
                        },
                        {
                            title : i18n.t(500065/*需求数量*/),
                            dataIndex : 'number',
                            key : "number",
                            width : '15%',
                            render(data,row,index){
                                return (<div title={data}>{data}</div>)
                            }
                        },
                        {
                            title : i18n.t(200009/*目标价*/),
                            dataIndex : 'targetValue',
                            key : "targetValue",
                            width : '20%',
                            render(data,row,index){
                                return (<div title={data}>{data}</div>)
                            }
                        },{
                            title : "FOB成本价",
                            dataIndex : 'FOB',
                            key : "FOB",
                            width : '20%',
                            render(data,row,index){
                                return (<div title={data}>{data}</div>)
                            }
                        },{
                            title : i18n.t(200071/*销售价*/),
                            dataIndex : 'saleValue',
                            key : "saleValue",
                            width : '20%',
                            render(data,row,index){
                                return (<div title={data}>{data}</div>)
                            }
                        }]}
                data={[{'name':i18n.t(200072/*转运前检验证书*/),'number':'12MT','targetValue':'9000.00USD','FOB':'','saleValue':''},{'name':i18n.t(200072/*转运前检验证书*/),'number':'12MT','targetValue':'9000.00USD','FOB':'','saleValue':''}]}
            />
            <NoIconAndRightKeys title={i18n.t(200073/*费用详情*/)} showHeader={true} showCheckbox={false} 
				columns ={[{
                            title : i18n.t(200074/*费用类型*/),
                            dataIndex : 'type',
                            key : "type",
                            width : '50%',
                            render(data,row,index){
                                return (<div title={data}>{data}</div>)
                            }
                        },
                        {
                            title : i18n.t(200075/*费用*/),
                            dataIndex : 'pay',
                            key : "pay",
                            width : '50%',
                            render(data,row,index){
                                return (<div title={data}>{data}</div>)
                            }
                        }]}
                data={[{'type':i18n.t(200076/*证书费用*/),'pay':'9000.00USD'}]}
            />
			</div>


			</FormWrapper>);
	}
}

const QuotationCalculationDialog = createForm()(CommonForm);

export default QuotationCalculationDialog;

