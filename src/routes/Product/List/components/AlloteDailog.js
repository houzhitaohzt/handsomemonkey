import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
//引入弹层
//引入滚动条
//引入select插件
import Select, {Option, ConstVirtualSelect} from "../../../../components/Select";
import ServiceTips, {errorTips} from "../../../../components/ServiceTips";
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ES,language,pageSize,sizeList} from '../../../../services/apiCall';
import WebData from '../../../../common/WebData';
/**
 * 客户分配
 */
class AlloteDailog extends Component{
	constructor(props){
		super(props)
		this.state=this.initialState();
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
	}

	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func
	}

	static defaultProps={
			
	}
	initialState(){
		return {
			staffs:[]
		}
	}
	componentDidMount(){
      
	}
	componentWillReceiveProps (props){
	    
    }
	onSaveAndClose(){
		const {form, onSaveAndClose } = this.props;
		form.validateFields((errors, value) =>{
			if(errors){

			}else{
				let mtlIds = this.props.numArr.map(e => e.id);
				let optlocks = this.props.numArr.map(e => e.optlock);
				let valueone = Object.assign({},value,{mtlIds:mtlIds,optlocks:optlocks});
				console.log(valueone);
				apiForm(API_FOODING_DS,"/material/saveStaffs",valueone,response => {
					ServiceTips({text:response.message,type:'success'})
					onSaveAndClose();
					form.resetFields();
				},error => ServiceTips({text:error.message,type:"error"}))

			}
		})
 	}
 	onCancel = () =>{
 		const {form, onCancel } = this.props;
 		if(onCancel){
 			onCancel();
 			form.resetFields();
 		}
 	}
 	//拉分管人
 	onStaffClick = () => {
 		let ccId = WebData.user.data.companies[0].id;
		apiGet(API_FOODING_ES,'/user/getListForPermissionsInParty',{typeAttributeIds:605,partyId:ccId},response=>{
			 let staffData = response.data;
			this.setState({
				staffs:staffData
			})
		},(error)=>ServiceTips({text:error.message,type:"error"}))
 	}
 	render(){
 		const {form} = this.props;
 		const { getFieldProps, getNFieldProps, setFieldsValue } = this.props.form;
 		const disabled = form.isFieldValidating() || form.isSubmitting();
 		return (
 			<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
 				<div className={'girdlayout'} >
				 	<div className={'row'}>
						<div className="form-group col-md-9 col-lg-9">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100361/*分管人*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								fieldName="staffIds"
								rules
								multi
								valueKeys="refId"
								labelKey="staffLocalName"
								apiHost={API_FOODING_ES}
								apiParams={{typeAttributeIds:605,partyId:WebData.user.data.companies[0].id}}
								apiUri="/user/getListForPermissionsInParty"
								initValueOptions={[]}
								initialValue={undefined}
							/>                         
						</div>
					</div>
			 	</div>
 			</FormWrapper>
 		)
 	}
}

const CommonForm = createForm()(AlloteDailog);
export default CommonForm;

/*
<Select
	tags
	optionFilterProp="children"
	optionLabelProp="children"
	placeholder=""
	className ='currency-btn select-from-currency col-md-9 col-lg-9'
	{...getNFieldProps('staffIds',{
		validateFirst: true,
		rules: [{required:true}],
		initialValue:undefined
	})}
	onClick={this.onStaffClick}
>
	{
		this.state.staffs.map((o, index) => <Option value={o.refId} title={o.staffLocalName} key={index}>{o.staffLocalName}</Option>)
	}
</Select>		   
*/