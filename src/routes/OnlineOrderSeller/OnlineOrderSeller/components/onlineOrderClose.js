import React, {Component, PropTypes} from 'react'
import {createForm, FormWrapper} from "../../../../components/Form";
//引入弹层
//引入select插件
import {I18n } from '../../../../lib/i18n';
import {API_FOODING_ERP, apiForm} from '../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
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
                let param = Object.assign({}, otherData, values);
                ///nooorder/close replace /inquiryorder/close
                apiForm(API_FOODING_ERP, '/inquiryorder/close', {id: param.billId,closeInstruct: param.closeInstruct},
                    response => {
        				successTips(response.message);
                        this.props.onSaveAndClose();
                        otherData.optlock += 1;
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
 		const { getFieldProps, getFieldError } = this.props.form;

 		return (
			 <FormWrapper showFooter={true} onSaveAndClose={this.onSaveNormal} onCancel={this.onCancel}>
				<div className="close-business scroll">
					<div className={'col-sm-6'}>
						<div className={'row'}>
							<label className={'col-sm-2'}>{I18n.t(500084/*关闭原因*/)}</label>
                            <input type="text" className={'col-sm-10 text-input-nowidth'} 
                               {...getFieldProps('closeInstruct',
                                   {
                                       initialValue: '',
                                       validateFirst: true,
                                       rules: [{required:true,}],
                                   }
                               )}
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

