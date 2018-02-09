import i18n from './../../lib/i18n';
import React, {Component, PropTypes} from 'react'
import {createForm, FormWrapper} from "../../components/Form";
//引入弹层
//引入select插件
import {ConstMiniSelect, ConstVirtualSelect, Option} from '../../components/Select';
import NavConnect from '../../components/NavigateTabs/containers/AddContainer';

import {API_FOODING_ERP, apiForm, apiPost} from '../../services/apiCall';
import ServiceTips, {errorTips} from "../../components/ServiceTips"; //提示框
import Checkbox from '../../components/CheckBox';
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.state=this.initialState();
		this.onCancel=this.onCancel.bind(this);
		this.getData=this.getData.bind(this);
	}

	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func
	}

	static defaultProps={
		data:{

		}
	}
	initialState(){
		return {

		}
	}
	componentDidMount(){

	}
onSaveNormal = () => {
        const {form, onSaveAndClose, otherData} = this.props;
        form.validateFields((error, values) => {
            if (!error) {
                     let params = {billId: this.props.businessOne.billId, billMtlIds:this.props.billMtlIds,isClose:values.isClose};
                     apiForm(API_FOODING_ERP, '/business/createSaleOrder', params,
                         ({data}) => {
                             let {navReplaceTab} = this.props;
                             navReplaceTab({name:i18n.t(200239/*销售订单编辑*/),component:i18n.t(200239/*销售订单编辑*/),url:'salesorder/addeidt'});
                             this.props.router.push({pathname: 'salesorder/addeidt', query: {id: data}});
                         }, error => {
                             errorTips(error.message)
                         });
            }
        });
    };

 	onCancel(){
 		const { onCancel } = this.props;
 		if(onCancel){
 			onCancel();
 		}
 	}

 	getData(data,that){
    	this.addradio = that;
    }

 	render(){
 		const {form, data} = this.props;
 		const { getFieldProps, getFieldErrorStyle } = this.props.form;
 		const disabled = form.isFieldValidating() || form.isSubmitting();

 		return (
			 <FormWrapper showFooter={true} onSaveAndClose={this.onSaveNormal} onCancel={this.onCancel}>
				<div className="girdlayout">
					<div className={'col-sm-11 row'}>
							<label className={'col-sm-2'}><span>*</span>{i18n.t(200257/*关闭商机*/)}</label>
              <Checkbox
                       style={{lineHeight:'32px'}}
                   {...getFieldProps('isClose',{
                     initialValue:true
                   })}
                   checked={this.props.form.getFieldValue("isClose")}
              />
					</div>
				</div>
 			</FormWrapper>
 		)
 	}
}

CommonForm = createForm()(CommonForm);

export default NavConnect(CommonForm);
