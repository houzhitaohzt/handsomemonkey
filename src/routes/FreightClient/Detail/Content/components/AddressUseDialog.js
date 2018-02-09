import i18n from './../../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, {Option} from '../../../../../components/Select';
import Checkbox from '../../../../../components/CheckBox';
//引入ajax请求
import {API_FOODING_DS, apiForm, apiGet} from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';

import {I18n} from "../../../../../lib/i18n";

export class  AddressUseDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        //复选框的checkbox 改变事件
        this.onChangeCheck = this.onChangeCheck.bind(this);
        //复选框  全选和反选
        this.onChangeAllCheck = this.onChangeAllCheck.bind(this);
        //新增地址用途的请选择详细地址的click事件
        this.inputClick =this.inputClick.bind(this);
        //找不到详细地址，自己新增的点击事件
        this.addClick = this.addClick.bind(this);
        this.state=this.initState();
        this.data = null;
	}
	initState(){
		return {
			disabled:false,
        	checked:false,
        	allChecked:false, //控制全选和反选
			selectValue:'',
        	isShowSelect:false,
			radioValue:-1, //显示哪一个是默认
			showAddress:false,
			addressDetailArr:[],
			/*checkedRowsArr:this.props.initData.bizFuncTypes.map((o,i) =>{return {checked:false,id:o.id,radio:-1}} ), //表示默认选中的某一行*/
			checkedRowsArr:this.props.initData.bizFuncTypes.map((o,i) =>{return {checked:false,id:o.id,defaultChecked:false}} ), //表示默认选中的某一行
			addressId:"", //选中的某一条详细地址数据的id
			defaultChecked:false //地址的默认
		}
	}
	//全选和反选
	onChangeAllCheck(e){
		let {allChecked,checkedRowsArr } = this.state;
		allChecked=e.target.checked;
		if(e.target.checked){//全选
			for(let i = 0; i < checkedRowsArr.length; i++){
				checkedRowsArr[i].checked = true;
			}
		}else{
			for(let i = 0; i < checkedRowsArr.length; i++){
				checkedRowsArr[i].checked = !checkedRowsArr[i].checked;
			}
		}
		this.setState({checkedRowsArr,allChecked:!this.state.allChecked})
	}
	//复选框的checkbox 改变事件
	onChangeCheck(k,id,e){
		let {allChecked,checkedRowsArr } = this.state;
		checkedRowsArr[k].checked = e.target.checked;
		checkedRowsArr[k].id = id;
		allChecked = true;
		for(let j = 0; j < checkedRowsArr.length; j++){
			if(!checkedRowsArr[j].checked){
				allChecked = false;
				break;
			}
		}
		this.setState({checkedRowsArr,allChecked});
	}
	//每一个radio的选中默认事件
	onChangeSingle(k,id,e){
		let checkedRowsArr = this.state.checkedRowsArr;
		checkedRowsArr[k].checked = checkedRowsArr[k].checked || false;
		checkedRowsArr[k].defaultChecked = e.target.checked;

		// checkedRowsArr[k].id = id;
		// for(let j=0;j<checkedRowsArr.length;j++){
		// 	if(k == j){
		// 		checkedRowsArr[j].radio = id;	
		// 	}else{
		// 		checkedRowsArr[j].radio = -1;
		// 	}
		// }
		// this.setState({checkedRowsArr,radioValue:id});
		this.setState({checkedRowsArr});
	}
	//获取详细地址 每一次点击inputClick时候拉取
	getDetailAddress(){
		let that = this;
		let API_FOODING = this.props.API_FOODING || API_FOODING_DS;
        console.log(this.props)
		apiGet(API_FOODING,'/address/address/getList',{beId:this.props.otherData.beId},response => {
			that.setState({
				addressDetailArr:response.data,
				isShowSelect:!this.state.isShowSelect
			},() => document.querySelector('.address-use-dialog').scrollTop = 380)
		},error => console.log(error.message))
	}
	//新增地址用途的请选择详细地址的click事件 地址之后。进行ajax请求 获取地址数据列表
	inputClick(){
		this.getDetailAddress();
	}
	//选中的点击事件
	selectAction(value){
		let country = value&&value.country?value.country.localName:""; //国家
		let province = value&&value.province?value.province.localName:""; //省
		let name = value&&value.name?value.name:'' //详细地址
		this.setState({
			addressId:value.id,
			isShowSelect:false,
			selectValue: country + province + name
		});
	}
	onConfim(){
	}
	onCancal(){
		this.setState({
			showAddress:false,
			disabled:false
		});
	}
	addClick(){
		//该方法试用来自定义选择国家，省州，市，区县，详细地址和邮编
		//该版本暂时不做，等到后面再实现
		// this.setState({
		// 	isShowSelect:false,
		// 	showAddress:true,
		// 	disabled:true
		// },function(){
		// 	document.querySelector('.address-use-dialog').scrollTop = 380;
		// });
	}
	componentWillReceiveProps(nextProps){
		if(this.props.initData.bizFuncTypes !== nextProps.initData.bizFuncTypes){
			//默认为radio按钮
			/*this.setState({checkedRowsArr:nextProps.initData.bizFuncTypes.map((o,i) =>{return {checked:false,id:o.id,radio:-1}} )})*/
			//默认为checkbox框
			this.setState({checkedRowsArr:nextProps.initData.bizFuncTypes.map((o,i) =>{return {checked:false,id:o.id,defaultChecked:false}} )})
		}
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {data,initData} = this.props;
		const {bizFuncTypes,address} = initData;
		this.data = Object.assign({},address);
		let content;
		if(data.number == 1){
           content = (
           	<div className='address-use-dialog scroll'>
           		<div className={this.state.showAddress ? 'opacify':''}>
	           		<div className ='up'>
		           		<ul className='head'>
		           			<li>
		           				<Checkbox
		           				  className='check-class'
					              name="my-checkbox"
					              onChange={this.onChangeAllCheck}
					              disabled={this.state.disabled}
					              checked={this.state.allChecked}
					            />
		           				{I18n.t(100546/*地址用途*/)}
		           			</li>
		           			<li>{I18n.t(100123/*默认*/)}</li>
		           		</ul>
		           		<div className="scroll address-scroll">
		           		    {
		           		    	bizFuncTypes.map((value,i)=>{
		           		    		return(
		           		    			<ul key={i}>
						           			<li>
						           				<Checkbox
						           				  className='check-class'
									              name="my-checkbox"
									              onChange={this.onChangeCheck.bind(this,i,value.id)}
									              disabled={this.state.disabled}
									              checked={this.state.checkedRowsArr[i].checked}
									            />
						           				{value.name}
						           			</li>
						           			<li>						           				
												<Checkbox
												   value={i}
						           				   className='check-class'
									               name="my-checkbox"
									               onChange={this.onChangeSingle.bind(this,i,value.id)}
									               disabled={this.state.disabled}
									               checked={this.state.checkedRowsArr[i].defaultChecked}
									            />
						           			</li>
						           		</ul>
		           		    		)
		           		    	})			           			
			           		}
						</div>
					</div>
					<div className='use-footer'>
						<span>{I18n.t(100481/*地址*/)}</span>
						<input
							readOnly={true}
						    value={this.state.selectValue}
							onClick={this.inputClick}
							disabled={this.state.disabled}
						 	type='text'  className='text-input'/>
						<i onClick={this.inputClick} 
						className={this.state.isShowSelect ?
							'foddingicon fooding-inputbox_arrow_16 foddingicon fooding-down rote':
						'foddingicon fooding-inputbox_arrow_16 foddingicon fooding-down'}></i>
					</div>
				</div>
				<div style={{paddingTop:20}} className={this.state.showAddress? '':'none'}>
					<div className='addresslist-dialog'>
						<label className='title'><span>*</span>{i18n.t(100087/*国家*/)}</label>
						<Select
							{...getFieldProps('nation',{
							validateFirst: true,
							rules: [{required:true,}],
							valuedateTrigger:"onBlur",
							initialValue:data.number == 1 ?'':data.record.nation
							})}
							style={{flex:3,marginLeft:10,marginRight:10}}
							className ='currency-btn select-from-currency'>
							<Option value ={'0'}>{'dd'}</Option>
						</Select>
						<span>*</span>
						<label>{i18n.t(100535/*省/州*/)}</label>
						<Select
							{...getFieldProps('province',{
							validateFirst: true,
							rules: [{required:true,}],
							valuedateTrigger:"onBlur",
							initialValue:data.number == 1 ?'':data.record.province
							})}
							style={{flex:1,marginLeft:10,marginRight:10}}
							className ='currency-btn select-from-currency'>
							<Option value ={'0'}>{'dd'}</Option>
						</Select>
						<span>*</span>
						<label>{i18n.t(100248/*市*/)}</label>
						<Select
							{...getFieldProps('city',{
							validateFirst: true,
							rules: [{required:true,}],
							valuedateTrigger:"onBlur",
							initialValue:data.number == 1 ?'':data.record.city
							})}
							style={{flex:1,marginLeft:10,marginRight:10}}
							className ='currency-btn select-from-currency'>
							<Option value ={'0'}>{'dd'}</Option>
						</Select>
						<span>*</span>
						<label>{i18n.t(100249/*区县*/)}</label>
						<Select
							{...getFieldProps('county',{
							validateFirst: true,
							rules: [{required:true,}],
							valuedateTrigger:"onBlur",
							initialValue:data.number == 1 ?'':data.record.county
							})}
							style={{flex:1,marginLeft:10,marginRight:10}}
							className ='currency-btn select-from-currency'>
							<Option value ={'0'}>{'dd'}</Option>
						</Select>
					</div>
					<div className='addresslist-dialog'>
						<span>*</span>
						<label className='title'>{i18n.t(100250/*详细地址*/)}</label>
						<Select
							{...getFieldProps('street',{
							validateFirst: true,
							rules: [{required:true,}],
							valuedateTrigger:"onBlur",
							initialValue:data.number == 1 ?'':data.record.street
							})}
							style={{flex:3,marginLeft:4,marginRight:10}}
							className ='currency-btn select-from-currency'>
							<Option value ={'0'}>{'dd'}</Option>
						</Select>
						<label>{i18n.t(100251/*邮编*/)}</label>
						<Select
							{...getFieldProps('postcode',{
							validateFirst: true,
							rules: [{required:true,}],
							valuedateTrigger:"onBlur",
							initialValue:data.number == 1 ?'':data.record.postcode
							})}
							style={{flex:1,marginLeft:10,marginRight:10}}
							className ='currency-btn select-from-currency'>
							<Option value ={'0'}>{'dd'}</Option>
						</Select>
					</div>
					<div className='footer-button'>
						<input type='button' value={i18n.t(200043/*确定*/)} className='button-confrim' onClick={this.onConfim} />
						<input type='button' value={i18n.t(100461/*取消*/)} className='button-cancal'  onClick={this.onCancal} />
					</div>
				</div>
				<div className={this.state.isShowSelect ?'dialog':'none'}>
						<ul className='head'>
							<li>{I18n.t(100481/*地址*/)}</li>
							<li>{I18n.t(100481/*地址*/) + '/' + I18n.t(100481/*地址*/)}</li>
							<li>{I18n.t(100481/*地址*/)}</li>
						</ul>
						<div className='scroll scroll-footer'>
							{
								this.state.addressDetailArr.map((value,i)=>{
									return (
										<ul key={i} onClick={this.selectAction.bind(this,value)}>
											<li>{value&&value.country?value.country.localName:''}</li>
											<li>{value&&value.province?value.province.localName:''}</li>
											<li>{value&&value.name?value.name:''}</li>
										</ul>
									)
								})
							}
						</div>
				</div>
           	</div>
         
           );
		}else if(data.number == 0){
			content = (
			<div className="girdlayout">
					<div className="row">
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100546/*地址用途*/)}</label>
							<Select
								animation='slide-up'
								className ='currency-btn select-from-currency col-xs-9 col-md-9 text-input-nowidth'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('bizFuncTypeId',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:address&&address.bizFuncTypeId?String(address.bizFuncTypeId):undefined,
								})}
								>
								{
									bizFuncTypes.map((e,i) =>{
										return (<Option key={i} value={String(e.id)} title={e.name}>{e.name}</Option>)							
									})
								}
							</Select>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100546/*地址用途*/)}</label>
							<Checkbox
									{...getFieldProps('dfutMrk',{
										initialValue:address&&address.dfutMrk?address.dfutMrk:false
								})}
								checked={this.props.form.getFieldValue("dfutMrk")}
							/>
						</div>
					</div>
				</div>);
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true}
				 onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
						{content}
				</FormWrapper>
			</div>
			);
	}
	onSaveAndClose(){
		let that = this;
		const {form,onSaveAndClose, API_FOODING = API_FOODING_DS} = this.props;
		if(this.props.data.number == 1){//地址用途新增
			let { checkedRowsArr,addressId} = this.state;
			if(!addressId || addressId == ""){
				ServiceTips({text:I18n.t(100543/*请选择详细地址*/),type:'error'})
				return false;
			}
			let bizFuncTypeIds=[],dfutMrks=[];
			for(let k = 0; k < checkedRowsArr.length; k++){
				//默认为radio按钮
				/*if(!checkedRowsArr[k].checked){
					continue;
				}else if(checkedRowsArr[k].radio !== -1){
					dfutMrks.push(true);
					bizFuncTypeIds.push(checkedRowsArr[k].id);
				}else{
					dfutMrks.push(false);
					bizFuncTypeIds.push(checkedRowsArr[k].id);
				}*/
				//默认为checkbox框
				if(!checkedRowsArr[k].checked){
					continue;
				}else if(checkedRowsArr[k].defaultChecked){
					dfutMrks.push(true);
					bizFuncTypeIds.push(checkedRowsArr[k].id);
				}else{
					dfutMrks.push(false);
					bizFuncTypeIds.push(checkedRowsArr[k].id);
				}
			}
			let value = Object.assign({},{bizFuncTypeIds:bizFuncTypeIds,dfutMrks:dfutMrks,addressId:addressId,beId:this.props.otherData.beId,dataTyId:this.props.otherData.dataTyId});
			apiForm(API_FOODING,'/address/saveFunct',value,response => {
				ServiceTips({text:response.message,type:'success'})
				that.props.onSaveAndClose()
				that.setState(this.initState())
			},error => {
				ServiceTips({text:error.message,type:'error'})
				that.setState(this.initState())
			})
		}else if(this.props.data.number == 0){//地址用途编辑
			form.validateFields((errors, value) => {
				if(errors){

				}else{
					//将form表单的对象的value值转换成数组
					let valueone = Object.assign({},this.props.form.getFieldsValue(),{beId:this.props.otherData.beId,dataTyId:this.props.otherData.dataTyId,id:this.data.id,optlock:this.data.optlock});
					apiForm(API_FOODING,'/address/funct/update',valueone,response => {
						ServiceTips({text:response.message,type:'success'})
						that.props.onSaveAndClose()
						that.setState(this.initState())
						},error => ServiceTips({text:error.message,type:'error'}))
				}
			})
		}		
		this.props.form.resetFields();
	}
	onCancel(){
		const {onCancel}=this.props;
		this.setState(this.initState())
        if(onCancel){
            onCancel();
        }
	}
}
AddressUseDialog.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
AddressUseDialog.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const DialogFrom =createForm()(AddressUseDialog);
export default DialogFrom;

/*<Radio
    value={i}
	name="radio"
	disabled={this.state.disabled}
	onChange={this.onChangeRadio.bind(this,i,value.id)}
	checked={this.state.radioValue == value.id}
/>*/
// <span className='add'><i onClick={this.addClick} className='foddingicon fooding-add-icon3'></i></span>

