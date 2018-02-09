import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
import Checkbox from '../../../../components/CheckBox';
import {I18n} from '../../../../lib/i18n';
// common
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, {Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select'; // 下拉
import xt from '../../../../common/xt'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../../services/apiCall';
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		// this.productChange = this.productChange.bind(this);
	    this.productSelect = this.productSelect.bind(this);
		this.state=this.initState();
		this.addClick = this.addClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
	}
	deleteClick(i){
		let matouArray=this.state.matouArray;
    	matouArray.splice(i, 1, null);
    	this.setState({
    		matouArray:matouArray
    	});
	}
	addClick(){
		let that = this;
		let matouArray = this.state.matouArray;
		matouArray.push({});
		this.setState({
		    matouArray:matouArray
		})
	}
	 initState() {
        return {
        	productArray:[],
            billDtlId: null,
            productData: {},
            matouArray:[{}],
            listArray:[]
        }
    }
	productSelect(e){
		let that =this;
		apiGet(API_FOODING_DS,'/tradruleShipmark/getListByMtlBeId',
			{mtlId:e.mtlId,sourceId:this.props.otherData.getOne.salBeId},(response)=>{

				let matouArray=[];
				response.data.map((e,i)=>{
					matouArray.push({key:e.itemId,value:e.itemName});
				});
				if(matouArray.length == 0 ){
					matouArray.push({});
				}
				that.setState({
					matouArray:matouArray
				});

			},(error)=>{
				ServiceTips({text:error.message,type:'error'});
			})
	}

	componentWillReceiveProps (props){
		let {data} = props;
        let {billDtlId} = this.state;
        let record = data.number === 1 ? null : data.record;
        if (record && record.billDtlId !== billDtlId) {
            this.getEditOne(record.billDtlId);
        }
	}

	componentDidMount() {
        let {data} = this.props;
        if (data.number !== 1 && data.record) {
            this.getEditOne(data.record.billDtlId);
        }
    }

    getEditOne = billDtlId => {
        if (!billDtlId) return;
        this.setState({billDtlId});
        apiGet(API_FOODING_ERP, '/saleorder/marks/getOne', {id: billDtlId},
            response => {
            	let matouArray = [];
            	for(var key in response.data.items){
            		matouArray.push({key:key,value:response.data.items[key]});
            	}
            	if(matouArray.length ==0){
            		matouArray.push({});
            	}
                this.setState({businessOne: response.data, productData: response.data,matouArray:matouArray});
            }, error => {
            });
    };

	onSaveAndClose(isAdd){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				if(this.props.data.number == 0){
					value = Object.assign({},this.state.businessOne,value,{billId:this.props.otherData.getOne.billId});
				}else{
					value = Object.assign({},value,{billId:this.props.otherData.getOne.billId})
				}
				let a={};
				for(var i=0;i< value.items.length;i++){
					a=Object.assign({}, a,
					{
						[value.items[i].key]:value.items[i].value
					});
				}
				delete value.items;
				let q = Object.assign({},value,{items:a});

				apiPost(API_FOODING_ERP,'/saleorder/marks/save',q,(response)=>{
						this.props.onSaveAndClose();
						this.props.form.resetFields();
						this.props.onCancel();
						ServiceTips({text:response.message,type:'sucess'});
						this.setState({...this.initState()});
				},(error)=>{
						ServiceTips({text:error.message,type:'error'});
				})
			}

    	});
	}
	onCancel(){
		this.props.form.resetFields();
		this.setState({...this.initState()}, this.props.onCancel);
	}
	render(){
		let that = this;
		let {data} = this.props;
		let initData = this.state.productData;
		const { getNFieldProps, getFieldProps, getFieldError,getFieldValue} = this.props.form;
		let beFieldValue = this.props.form.getFieldValue("title")|| {};
		let {matouArray} = this.state;
		let common = <div></div>;
		// if(initData.items){
		// 	   for(var key in initData.items){
		// 	   	    common = (<div className={'row'} key={key}>
		//                 <div className="form-group col-xs-12 col-md-12">
		// 					<ConstMiniSelect form={this.props.form} initRequest={true}
  //                                    pbj='com.fooding.fc.ds.entity.Item'
  //                                    initialValue={key}
  //                                    style={{float:'left'}}
  //                                    className ={'currency-btn select-from-currency col-md-2 col-lg-2'}
  //                   		/>
		// 					<input type='text' className={'col-xs-10 col-md-10 text-input-nowidth'}
		// 						placeholder=""
		// 						{...getFieldProps('items.'+ key,{
		// 							initialValue:initData.items[key]
		// 						})} />
		// 				</div>
		// 					</div>)
		// 	   };
		// }else {
			common = matouArray.map((value,i)=>{
					if( !value) return value;
					return (<div className={'row'} key={i} style={{marginBottom:'5px'}}>
						        <div className="form-group col-xs-12 col-md-12">
														<ConstVirtualSelect form={this.props.form}
														    defaultActiveFirstOption
															style={{float:'left'}}
															apiType={apiPost}
															initRequest
															apiParams="com.fooding.fc.ds.entity.Item"
															fieldName={"items["+i+"].key"}
			                                                 initialValue={value.key}
			                                                 className ={' col-md-2 col-lg-2'}
				                                		/>
														<input type='text' className={'col-md-8 text-input-nowidth'}
															placeholder=""
															{...getFieldProps("items["+i+"].value",{
																initialValue:value.value ?value.value:''
															})} />
														<div className='col-md-2'>
															<i className='foddingicon fooding-add-icon3'
															style={{paddingLeft:20}}
															onClick={this.addClick.bind(this,i)}></i>
															{  i==0?'':
																<i className='foddingicon fooding-delete-icon4'
															    style={{paddingLeft:'20px'}} onClick={this.deleteClick.bind(this,i)}></i>
															}
														</div>
					</div>
				</div>
			 )
			})
		// }
		let content = <div></div>
			if(data.number == 0 || data.number == 1){
				content =(
						<div className={'  girdlayout'} style={{height:"344px"}}>
						  	<div className={'row'}>
								                <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
													<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiGet, host: API_FOODING_ERP, uri:'/saleorder/mtl/getList',
			                                                     params: {billId:this.props.otherData.getOne.billId}
			                                                 }} fieldName="mtlId"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["mtl"+language], initData, ['mtlId', 'mtlLcName ', 'mtlEnName'], "mtl"+language, this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     mtlId: da.mtlId,
			                                                     mtlLcName: da.mtlLcName,
			                                                     mtlEnName: da.mtlTyEnName,
			                                                     s_label: da["mtl"+language]
			                                                 }}>{da["mtl"+language]}</Option>} reles ={true}
			                                                 onChange={this.productSelect}
			                                                 className ={'currency-btn select-from-currency col-md-10 col-lg-10'}
			                                		/>
												</div>
							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}><span>*</span>{i18n.t(400130/*贴唛方*/)}</label>
													<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.enumeration.MarksStick'}
			                                                 }} fieldName="stickDirection"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["stickDirectionName"], initData, ['stickDirection', 'stickDirectionName'], "stickDirectionName", this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     stickDirection: da.id,
			                                                     stickDirectionName: da.name,
			                                                     s_label: da.name
			                                                 }}>{da.name}</Option>} reles ={true}
			                                                 className ={'currency-btn select-from-currency col-md-10 col-lg-10'}
			                                		/>
												</div>
							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}><span>*</span>{i18n.t(400131/*唛头类型*/)}</label>
													<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.enumeration.MarkType'}
			                                                 }} fieldName="markTyId"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["markTy"+language], initData, ['markTyId', 'markTyLcName', 'markTyEnName'], "markTy"+language, this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     markTyId: da.id,
			                                                     markTyLcName: da.name,
			                                                     markTyEnName: da.name,
			                                                     s_label: da.name
			                                                 }}>{da.name}</Option>} reles ={true}
			                                                 className ={'currency-btn select-from-currency col-md-10 col-lg-10'}
			                                		/>
												</div>
							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}>{i18n.t(400132/*颜色*/)}</label>
													<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.enumeration.MarksColor'}
			                                                 }} fieldName="colorType"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["colorTypeName"], initData, ['colorType', 'colorTypeName'], "colorTypeName", this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     colorType: da.id,
			                                                     colorTypeName: da.name,
			                                                     s_label: da.name
			                                                 }}>{da.name}</Option>}
			                                                 className ={getFieldError('colorType')?'currency-btn select-from-currency col-md-10 col-lg-10 error-border':'currency-btn select-from-currency col-md-10 col-lg-10'}
			                                		/>
												</div>
							</div>
							{common}

						</div>)
			}
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
					<div style={{height:"344px",overflowY:'auto'}} className="scroll">
						{content}
					</div>
			</FormWrapper>);
	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;
