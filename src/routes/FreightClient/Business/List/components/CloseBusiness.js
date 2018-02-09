import i18n from './../../../../../lib/i18n';
import React, {Component, PropTypes} from 'react'
import {createForm, FormWrapper} from "../../../../../components/Form";
//引入弹层
//引入select插件
import {ConstMiniSelect, ConstVirtualSelect, Option} from '../../../../../components/Select';

import {API_FOODING_ERP, apiForm, apiPost, apiGet} from '../../../../../services/apiCall';
import ServiceTips, {errorTips} from "../../../../../components/ServiceTips"; //提示框

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
            businessOne: {},
		}
	}
	componentDidMount(){
	    let {otherData} = this.props;
        apiGet(API_FOODING_ERP, '/business/getOne', {
            billId: otherData.billId
        }, response => {
            this.setState({businessOne: response.data});
        }, error => {
            errorTips(error.message);
        });
	}


	onSubmitBill = data =>{
	    const {onSaveAndClose} = this.props;
        apiForm(API_FOODING_ERP,"/common/submitBill",{billId: data.billId,billType: data.billType},response => {
            ServiceTips({text:response.message,type:"success"});
            onSaveAndClose && onSaveAndClose();
        },error => {
            ServiceTips({text:error.message,type:'error'});
        });
    };

    onSaveNormal = () => {
        let {form, onSaveAndClose, otherData} = this.props;
        let {businessOne} = this.state;
        form.validateFields((error, values) => {
            if (!error) {
                let param = Object.assign({}, businessOne, values);
                apiPost(API_FOODING_ERP, '/business/off', param,
                    response => {
                        // successTips("保存成功!");
                        otherData.optlock = businessOne.optlock + 1;
                        this.onSubmitBill(businessOne);
                    }, error => {
                        errorTips(error.message);
                    })
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
					<div className={'row'}>
                     <div className={'col-sm-11'}>
							<label className={'col-sm-2'}><span>*</span>{i18n.t(500084/*关闭原因*/)}</label>
                            <ConstMiniSelect form={this.props.form} pbj={{
                                            params: {
                                                    "obj": "com.fooding.fc.ds.entity.ReasonType",
                                                    "queryParams": [{"attr": "billMark", "expression": "=", "value": true}]
                                                }
                                            }} fieldName="closeCauseId"
                                             initValueOptions={[]}
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 closeCauseId: da.id,
                                                 closeCauseLcName: da.localName,
                                                 closeCauseEnName: da.name,
                                                 s_label: da.localName
                                             }} reles={true}>{da.localName}</Option>}
                                             initialValue={ undefined}  reles={true}
                                             className="col-sm-10"
                            />

                        </div>


					</div>
					<div className={'row'} style={{margin:'10px 0px'}}>
                        <div className={'col-sm-11'}>
    						<label className={'col-sm-2'}>{i18n.t(200229/*关闭说明*/)}</label>
    						<input type="text" className={getFieldErrorStyle('closeInstruct', 'error-border', 'col-sm-10 text-input-nowidth')} 
                                   {...getFieldProps('closeInstruct',
                                       {
                                           initialValue: '',
                                       }
                                   )}
                            />
                        </div>
					</div>
					<div className={'row'}>
                        <div className={'col-sm-11'}>
    					   <label className={'col-sm-2'}>{i18n.t(100449/*竞争对手*/)}</label>
                            <ConstVirtualSelect form={form}
                                apiType={apiPost}
                                apiParams="com.fooding.fc.ds.entity.Rival"
                                fieldName="competitorId"
                                className="col-sm-10"
                                labelKey="competitorLcName"
                                valueKeys={da => ({
                                    competitorId: da.id,
                                    competitorLcName: da.localName,
                                    competitorEnName: da.name,
                                })}
                            />
                        </div>
					</div>
				</div>
 			</FormWrapper>
 		)
 	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;

