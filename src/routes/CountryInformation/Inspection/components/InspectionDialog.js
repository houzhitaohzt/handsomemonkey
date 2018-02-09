import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
import Select, { Option } from 'rc-select';
import Checkbox from '../../../../components/CheckBox';
import Tree ,{TreeNode} from 'rc-tree';
import Radio from '../../../../components/Radio';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import Input from '../../../../components/FormValidating/FormValidating';
import ServiceTips from '../../../../components/ServiceTips';
import {I18n} from "../../../../lib/i18n";
export class InspectionDialog extends Component{
	constructor(props) {
		super(props);
		this.addSelect;
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.getData = this.getData.bind(this);
		this.onCheck = this.onCheck.bind(this);
		this.onExpand = this.onExpand.bind(this);
		this.state ={
			checkedKeys:[],
		    autoExpandParent: true,
		    expandedKeys: [],
		    info:[]
		}
		
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(this.props.num == 0){
					let params = this.props.form.getFieldsValue();
					delete params['optlock'];
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				}this.props.form.resetFields();

				
			}
		})
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	onExpand(expandedKeys) {
	    console.log('onExpand', arguments);
	    this.setState({
	      expandedKeys,
	      autoExpandParent: false,
	    });
	}
	onCheck(checkedKeys) {
	    console.log(checkedKeys);
	    this.setState({
	      checkedKeys,
	    });
	}
	componentDidMount(){
        var that = this;
        let object=Object.assign({},{sourceId:this.props.sourceId,dataTyId:10});
        apiPost(API_FOODING_DS,'/object/getMiniList',{
                obj:'com.fooding.fc.ds.entity.ServBe',sourceId:this.props.sourceId,dataTyId:10,
                queryParams:[{
                    'attr':'beDataMulDivIds',
                    'expression':'oin',
                    'value':70

                }]
            },
                (response)=>{
                    that.setState({
                        info:response.data
                    });
            },(error)=>{

            });
    }
	render(){
		const { getFieldProps, getFieldError, getNFieldProps} = this.props.form;
		let {checkedData} = this.props;
		let {info} = this.state;
		//info.servBeIds = info.servBeIds ||[];
		let content = <div></div>;
		getFieldProps('dataTyId',{
									initialValue:10,
								});
		if(this.props.num == 0){
			getFieldProps('sourceId',{
									initialValue:this.props.sourceId,
			});
		    content=( 
		    	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100102/*监装机构*/)}</label>
								<Select
										animation='slide-up'
										onClick={this.onClick}
										
										className ={ getFieldError("instBeId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										optionLabelProp="children"
										{...getFieldProps('instBeId',{
											validateFirst: true,
											rules: [{required:true}],
											initialValue:undefined
										})}
										>
										{
											info.map((e,i)=>{
												return  <Option value={e.id+""} title={e.localName} key={i}>{e.localName}</Option>
											})
										}
								</Select>
							</div>
						</div>
					</div>
				</div>
			);
		}
		return (
			<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
	           {content}
			</FormWrapper>
			);
	}
}
const InspectionForm =createForm()(InspectionDialog);
export default InspectionForm;
