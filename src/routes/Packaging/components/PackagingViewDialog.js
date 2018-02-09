import i18n from './../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
//引入select插件
import Select, { Option } from 'rc-select';
import {I18n} from '../../../lib/i18n';

class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
	}

	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func,
		initData:PropTypes.object
	}

	initState(){
		return {
			initData:{},
		}
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}
	componentDidMount(){

	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	render(){
		const {form,data} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		return (<FormWrapper showFooter={true}  onCancel={this.onCancel} showSaveClose={false}>
				<div className={'girdlayout scroll'} style={{height:"334px",overflow:'auto'}}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100000/*代码*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>SPK20150934758435</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100001/*名称*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>700 KG PLAADSTD SGDFGDG</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100243/*集团*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>{i18n.t(200810/*弘昊化工有限公司*/)}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100486/*公司*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>{i18n.t(200810/*弘昊化工有限公司*/)}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100029/*材质*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>PLASTTIC DRUM</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100030/*规格单位*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>DRUN</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100031/*规格长*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>39cm</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100032/*规格宽*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>39cm</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100033/*规格高*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>78CM</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100034/*容积单位*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>{i18n.t(100034/*容积单位*/)}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100035/*容积量*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>0</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100036/*承重单位*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>KGS</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100038/*承重*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>0</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100039/*自重*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>0</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100002/*描述*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p className={'paragraph'}>{i18n.t(200806/*常用*/)}</p>
							</div>
						</div>
					</div>
				</div>
			</FormWrapper>);
	}
}

const PackagingView = createForm()(CommonForm);

export default PackagingView;

