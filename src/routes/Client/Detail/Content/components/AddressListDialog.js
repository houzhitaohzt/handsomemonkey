import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, {Option} from '../../../../../components/Select';
import '../../../../../components/Select/assets/index.less';
import {I18n} from '../../../../../lib/i18n';
import {API_FOODING_DS, apiGet} from "../../../../../services/apiCall";

export class  AddressListDialog extends Component{
	constructor(props){
		super(props);
		this.onCancel=this.onCancel.bind(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.countryChange=this.countryChange.bind(this);
		this.provinceChange=this.provinceChange.bind(this);
		this.cityChange=this.cityChange.bind(this);
        this.state={
        	provinceArr:[],
			cityArr:[],
			areaArr:[]
        }
        this.data = null;
	}
	//国家改变触发
	countryChange(e){
		if(e === '') return false;
		let provinceArr = [];
		apiGet(API_FOODING_DS,'/area/childs/getList',{parentId:e},(response) => {
			provinceArr = response.data;
			this.props.form.setFieldsValue({"provinceId": '',"cityId": '',"districtId": ''});
			this.setState({
				provinceArr:provinceArr,
				cityArr:[],
				areaArr:[]
			})
		},(error) => {

		})
	}
	//省州改变触发
	provinceChange(e){
		if(e === '') return false;
		let cityArr = [];
		apiGet(API_FOODING_DS,'/area/childs/getList',{parentId:e},(response) => {
			cityArr = response.data;
			this.props.form.setFieldsValue({"cityId": '',"districtId": ''});
			this.setState({
				cityArr:cityArr,
				areaArr:[],
			})
		},(error) => {

		})
	}
	//市
	cityChange(e){
		if(e === '') return false;
		let areaArr = [];
		apiGet(API_FOODING_DS,'/area/childs/getList',{parentId:e},(response) => {
			areaArr = response.data;
			this.props.form.setFieldsValue({"districtId": ''});
			this.setState({
				areaArr:areaArr
			})
		},(error) => {

		})
	}
	//对省州市区县进行初始化
	initGet(initData,data){
		initData = initData || this.props.initData;
		let {provinceArr,cityArr,areaArr} = this.state;
		if(data.number == 0){//说明是编辑
			let {country, cityId, provinceId, cntryId} = initData.address;
			apiGet(API_FOODING_DS,'/area/childs/getList',{parentId: cntryId || country.id},(response) => {
					provinceArr = response.data;
					this.setState({provinceArr})
				},(error) => console.log(error))
			apiGet(API_FOODING_DS,'/area/childs/getList',{parentId:provinceId},(response) => {
					cityArr = response.data;
					this.setState({cityArr})
				},error => console.log(error))
			apiGet(API_FOODING_DS,'/area/childs/getList',{parentId:cityId},(response) => {
					areaArr = response.data;
					this.setState({areaArr})
				},error => console.log(error))
		}else if(data.number == 1){
			let { id } = initData.initCountry || {};
			if(!id) return;
			apiGet(API_FOODING_DS,'/area/childs/getList',{parentId: id},(response) => {
					provinceArr = response.data;
					this.setState({provinceArr})
				},(error) => console.log(error))
		}else{
			return false;
		}
	}
	componentDidMount(){
		this.initGet(null,this.props.data)
	}
	componentWillReceiveProps(nextProps){
/*		if(nextProps.data.number == 1) return false;*/
		if(this.props.initData.address !== nextProps.initData.address){
			this.initGet(nextProps.initData,nextProps.data);
		}
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {data,initData} = this.props;
		let {provinceArr,cityArr,areaArr} = this.state;
		let {countrys,address,initCountry} = initData;
		this.data = Object.assign({},address);
		let content;
		if(data.number == 0 || data.number == 1){
           content = (
           	<div className="contact-bianji scroll">
           		<div className='addresslist-dialog'>
					<label className='title'><span>*</span>{I18n.t(100087/*国家*/)}</label>
					<Select
						animation='slide-up'

						style={{flex:3,marginLeft:10,marginRight:10,width:250}}
						className ={getFieldError('cntryId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
						choiceTransitionName="rc-select-selection__choice-zoom"
						optionLabelProp="children"
						{...getFieldProps('cntryId',{
							validateFirst: true,
							rules: [{required:true,}],
							onChange:this.countryChange,
							initialValue:address&&address.country?address.country.id:(initCountry && initCountry.id || "")
						})}
					>
						{
							countrys.map((e,i) =>{
								return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
							})
						}
					</Select>
					<label>{I18n.t(100535/*省/州*/)}</label>
					<Select
						animation='slide-up'

						className ='currency-btn select-from-currency'
						choiceTransitionName="rc-select-selection__choice-zoom"
						optionLabelProp="children"
						style={{width:120}}
						{...getFieldProps('provinceId',{
							initialValue:address && address.provinceId?address.provinceId:'',
							onChange:this.provinceChange
						})}
					>
						{
							provinceArr.map((e,i) =>{
								return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
							})
						}
					</Select>
					<label>{I18n.t(100248/*市*/)}</label>
					<Select
						animation='slide-up'
						className ='currency-btn select-from-currency'
						choiceTransitionName="rc-select-selection__choice-zoom"
						optionLabelProp="children"
						style={{width:120}}
						{...getFieldProps('cityId',{
							initialValue:address && address.cityId?address.cityId:'',
							onChange:this.cityChange
						})}
					>
						{
							cityArr.map((e,i) =>{
								return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
							})
						}
					</Select>
					<label>{I18n.t(100249/*区县*/)}</label>
					<Select
						animation='slide-up'
						style={{width:120}}
						className ='currency-btn select-from-currency'
						choiceTransitionName="rc-select-selection__choice-zoom"
						optionLabelProp="children"
						{...getFieldProps('districtId',{
							initialValue:address && address.districtId?address.districtId:'',
						})}
					>
						{
							areaArr.map((e,i) =>{
								return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
							})
						}
					</Select>
				</div>
				<div className='addresslist-dialog'>
					<label className='title'><span>*</span>{I18n.t(100250/*详细地址*/)}</label>
					<input type='text'
						style={{width:'560px'}}
						className ={getFieldError('name')?'text-input-nowidth error-border':'text-input-nowidth'}
						{...getFieldProps('name',
                            {
                            	validateFirst: true,
								rules: [{required:true,}],
                                initialValue:address && address.name?address.name:''
                        })}
                    />
					<label>{I18n.t(100251/*邮编*/)}</label>
					<input type='text'
						style={{width:'160px'}}
						className ={getFieldError('zip')?'text-input-nowidth error-border':'text-input-nowidth'}
						{...getFieldProps('zip',
                            {
                            	validateFirst: true,
								rules: [{required:true,}],
                                initialValue:address && address.zip?address.zip:''
                        })}
                    />
				</div>
			</div>
           );
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
						{content}
				</FormWrapper>
			</div>
			);
	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.data);
				this.props.form.resetFields();
			}
		})
	}
	onCancel(){
		const {onCancel}=this.props;
        if(onCancel){
            onCancel();
            this.props.form.resetFields();
        }
	}
}
AddressListDialog.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
AddressListDialog.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const AddressListDialogFrom =createForm()(AddressListDialog);
export default AddressListDialogFrom;
