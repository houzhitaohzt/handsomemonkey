import React, {Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
//引入弹层
//引入滚动条
//引入select插件
import Select, {Option, ConstVirtualSelect} from "../../../../components/Select";
import * as ApiCall from "../../../../services/client/call";
import {apiGet, API_FOODING_ES} from '../../../../services/apiCall';
import ServiceTips, {errorTips} from "../../../../components/ServiceTips";
import i18n from '../../../../lib/i18n';
import WebData from "../../../../common/WebData";

/**
 * 客户分配
 */
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.state=this.initialState();
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.mngChange=this.mngChange.bind(this);

		this.custids = [];
		this.staffids = [];
		this.optlocks = [];
	}

	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func
	}

	static defaultProps={
		data:{
			main:{
				
			}
		}
	}
	initialState(){
		return {
			mng:[],
            staffs: [],
            allotAry: [],
            staffSelectValue: [],
		}
	}
	componentDidMount(){

        apiGet(API_FOODING_ES, '/user/getListForPermissionsInParty', {
                partyId: WebData.user.data.staff.ccid,
                typeAttributeIds: [601, 602, 603, 604]
            },
            response => {
                this.setState({staffs: response.data});
            }, error => {
                window.Tip.errorTips(error.message);
            });
       this.getAllotArr(this.props);
	}

	getAllotArr (props) {
        this.custids = [];
        this.optlocks = [];
        this.staffids = [];
        let ids = props.allotArr.map(o => {
            this.optlocks.push(o.optlock);
            this.custids.push(o.id);
            return o.id;
        });
        ApiCall.getCustsstaffs(ids, ({data}) => {
            data.forEach(o => this.staffids.push(o.id));
            this.setState({allotAry: data, mng: []});
        }, message => {
            errorTips(message.message);
        })
    }

	componentWillReceiveProps (props){
	    if(props.allotArr.length !== this.props.allotArr.length || !props.allotArr.includes(...this.props.allotArr)){
	        this.getAllotArr(props);
        }
    }

	mngChange(value){
		let form = this.props.form;
		let mng = this.state.staffs.filter(da => ~value.indexOf(da.refId));
		this.state.allotAry.map((allot,index) => {
			let id = form.getFieldValue("oldStaffIds#" + allot.id);
			console.log(id, value.indexOf(id));
			if(id && value.indexOf(id) === -1) {
				form.setFieldsValue({["oldStaffIds#" + allot.id]: undefined});
			}
		});
		this.setState({mng, staffSelectValue: value});
	}
	onSaveAndClose(){
		const {form, onSaveAndClose } = this.props;
		form.validateFields((errors, value) =>{

			if(null==errors){
				if(onSaveAndClose){
				    value = form.getFieldsValue();
                    let formData = {
                        newStaffIds: [],
                        oldStaffIds: [],
                        optlocks: this.optlocks,
                        staffIds: this.state.staffSelectValue,
                        custIds: this.custids
                    };
                    for (let key in value){
                        formData.oldStaffIds.push(key.replace("oldStaffIds#", ""));
                        formData.newStaffIds.push(value[key]);
                    }
                    console.log(formData);
                    ApiCall.saveStaffs(formData, response => {
                        onSaveAndClose();
                        ServiceTips({text: response.message, type: 'success'});
                        this.onCleanup();
                    }, message => {
                        errorTips(message.message)
                    });

				}
			}
		})
 	}

 	onCleanup = ()=>{
	    this.setState({mng: [], staffSelectValue: []});
	    this.props.form.resetFields();
    };

 	onCancel(){
 		const { onCancel } = this.props;
 		if(onCancel){
 			onCancel();
 			this.onCleanup();
 		}
 	}

 	render(){
 		const {form, data} = this.props;
 		const { getFieldProps, getFieldDecorator, setFieldsValue } = this.props.form;
 		const {main} = data;
 		const {mng} = this.state;
 		const disabled = form.isFieldValidating() || form.isSubmitting();
        let mngSelect = mng.map((staff, index) =>
            (<Option value={staff.refId} title={staff.staffLocalName} key={index}>{staff.staffLocalName}</Option>)
        );
 		let dom = this.state.allotAry.map((allot,index) => {
 			return (<div className="row" key={index} >
						<div className="col-xs-6">
							{allot.localName}
						</div>
						<div className="col-xs-6">

							<Select
								placeholder=""
								style={{width:'100%'}}
                                optionLabelProp="children"
								className ='currency-btn select-from-currency'			
								{...getFieldProps("oldStaffIds#" + allot.id,{
									validateFirst: true,
									rules: [{required:true,}],									
									valuedateTrigger:"onClick",
								})}
							>
								{mngSelect}
							</Select>
						</div>
					</div>)
 		});

 		return (
 			<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
				<div className="client-allote scroll">
					<div className="row">
						<div className="col-xs-6 client-allote-title">
                            {i18n.t(201274/*新分管人*/)}
						</div>
					</div>
					<div className="row">
						<div className="col-xs-6">
							<Select
								tags
								value={this.state.staffSelectValue}
								optionLabelProp="children"
								placeholder=""
								style={{width:'100%'}}
								onChange={this.mngChange}
								className ='currency-btn select-from-currency'
							>
								{
									this.state.staffs.map((o, index) => <Option value={o.refId} title={o.staffLocalName} key={index}>{o.staffLocalName}</Option>)
								}
							</Select>							
						</div>
					</div>
					<div className="row">
						<div className="col-xs-6 client-allote-title">
							业务原负责人
						</div>
						<div className="col-xs-6 client-allote-title">
							业务新负责人
						</div>
					</div>
					{dom}
				</div>
 			</FormWrapper>
 		)
 	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;


// <ConstVirtualSelect
// 	style={{width: '100%'}}
// 	form={this.props.form}
// 	isRequest={false}
// 	pageSize={6}
// 	fieldName='staffIds'
// 	labelKey="staffLocalName"
// 	valueKeys='refId'
// 	multi={true}
// 	initialValue={[]}
// 	initValueOptions={this.state.staffs}
// 	rules={false}
// 	onChange={this.mngChange}
// />




