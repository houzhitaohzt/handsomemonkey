import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
import Checkbox from '../../../../components/CheckBox';
import {I18n} from '../../../../lib/i18n';
// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, {Option,ConstMiniSelect} from '../../../../components/Select'; // 下拉
import xt from '../../../../common/xt'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,API_FOODING_OA,language,commonAjax,} from '../../../../services/apiCall';
class ProductAddEditDialog extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.productChange = this.productChange.bind(this);
	    this.productSelect = this.productSelect.bind(this);
		this.state=this.initState();
		this.lirunChange = this.lirunChange.bind(this);
	}
	initState() {
        return {
        	productArray:[],
            ID: null, //某一条产品的ID
            productData: {},
        }
    }
    //利润类型的改变
	lirunChange(e){
		let {setFieldsValue,getFieldValue} =this.props.form;
		if(e&&(e.profType==10)){
			setFieldsValue({ehProf:''});
		}else{
			setFieldsValue({profRate:''});		
		}
	}
    //产品选择
	productSelect(e,item){
		let that = this;
		apiGet(API_FOODING_DS,'/material/getProductInforErp',{sourceId:this.props.otherData.salBeId,id:item.props.objValue.mtlId,mtlType:'mtl'},(response)=>{
			let obj = Object.assign({},this.state.productData,{basSpeci:response.data.basSpeci || ""});
			this.setState({productData:obj});
		},(error)=>{

		});
	}
	//产品改变
	productChange(e){
		let that = this;
		if(that.props.otherData.salBeId == "") return;
		apiGet(API_FOODING_DS,'/beMtl/getMtlList',{sourceId:that.props.otherData.salBeId},(response)=>{
			that.setState({
				productArray:response.data||[]
			});
		},(error)=>{

		});
	}
	//编辑时候获取某一条数据
	getEditOne = ID => {
		if(!ID) return;
		this.setState({ID});
		apiGet(API_FOODING_OA,"/activity/businessMtl/getOne",{id:ID},response =>{
			this.setState({productData:response.data});
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	onSaveAndClose = () => {
		let { form } = this.props;
		let that = this;
		form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				let schedule={};
				schedule.id = that.props.otherData.scheduleId;
				let params = Object.assign({},{schedule:schedule},that.state.productData,value);
				apiPost(API_FOODING_OA,`/activity/businessMtl/save?activityId=${schedule['id']}`,params,(response)=>{
						that.props.onSaveAndClose();
						that.props.form.resetFields();
						ServiceTips({text:response.message,type:'sucess'});
						that.setState({...this.initState()});
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
	componentDidMount() {
        let {data} = this.props;
        if (data.number === 0 && data.record) { 
            this.getEditOne(data.record.id);
        }
    }
    componentWillReceiveProps (nextProps){
		let {data} = nextProps;
        let {ID} = this.state;
        let record = data.number === 1 ? null : data.record;
        if (record && record.id !== ID) {
            this.getEditOne(record.id);
        }
	}

	render(){
		let that = this;
		let {data} = this.props;
		let initData = this.state.productData;
		const { getNFieldProps, getFieldProps, getFieldError,getFieldValue} = this.props.form;
		let basSpeci = getNFieldProps('basSpeci',{
			initialValue:initData?initData.basSpeci:""
		})
		let content = <div></div>
		//产品
		if(data.number == 0 || data.number == 1){
			content =(
					<div className={'  girdlayout'}>
					  	<div className={'row'}>
			                <div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100379/*产品*/)}</label>
								<Select 
										{...getNFieldProps('mtlId',{
											rules: [{required:true}],
											initialValue:initData["mtl"+language]?{s_label:initData["mtl"+language],mtlId:initData.mtlId,mtlLcName:initData.mtlLcName,mtlEnName:initData.mtlEnName}:undefined
										 })}
										animation='slide-up'
										placeholder=''
									    optionLabelProp="children"
										optionFilterProp="children"							
										className ={'currency-btn select-from-currency col-md-9 col-lg-9'}							
										onClick={this.productChange}
										onSelect ={this.productSelect}
									>	
									{this.state.productArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, mtlId:o.id, mtlLcName:o.localName, mtlEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
								</Select>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>{I18n.t(100382/*产品规格*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
	                                <p className={'paragraph shengyue'}>{initData.basSpeci}</p>
	                            </div>
							</div>
						</div>
						<div className={'row'}>
			                <div className="form-group col-xs-3 col-md-3">
								<label className={'col-xs-6 col-md-6'}><span>*</span>{I18n.t(100422/*利润类型*/)}</label>
								<ConstMiniSelect form={this.props.form}
                                         pbj={{
                                             apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                             params: {obj: 'com.fooding.fc.enumeration.ProfitType'}
                                         }} fieldName="profType"
                                         initValueOptions={[]}
                                         initialValue={
                                         		xt.initSelectValue(initData["profTypeName"], initData, ['profType', 'profTypeName'],"profTypeName", this.props.form)
										}
                                         optionValue={(da, di) => <Option key={di} objValue={{
                                             profType: da.id,
                                             profTypeName:da.name,
                                             s_label: da.name
                                         }}>{da.name}</Option>} reles ={true}
                                         onChange = {this.lirunChange}
                                         className ={'currency-btn select-from-currency col-md-6 col-lg-6'}	
                        		/>
							</div>
							<div className="form-group col-xs-3 col-md-3">
								<label className={'col-xs-6 col-md-6'}>
								{this.props.form.getFieldValue('profType').profType == 10 ?I18n.t(100420/*利润率%*/):I18n.t(100421/*利润额*/)}</label>
								<input type='text' className={this.props.form.getFieldValue('profType').profType == 10?'col-xs-6 col-md-6 text-input-nowidth none':'col-xs-6 col-md-6 text-input-nowidth'} 
									placeholder=""
									{...getFieldProps('ehProf',{
										initialValue:initData.ehProf?initData.ehProf:''
									})}/>
								<input type='text' className={this.props.form.getFieldValue('profType').profType == 10?'col-xs-6 col-md-6 text-input-nowidth':'col-xs-6 col-md-6 text-input-nowidth none'}
									placeholder=""
									{...getFieldProps('profRate',{
										initialValue:initData.profRate?initData.profRate:''
									})}/>
							</div>
							<div className="form-group col-xs-3 col-md-3">
								<label className={'col-xs-6 col-md-6'}><span>*</span>{I18n.t(100319/*采购数量*/)}</label>
								<input type='text' className ={getFieldError('needQty')?'col-md-6 col-lg-6 text-input-nowidth error-border':'col-md-6 col-lg-6 text-input-nowidth'}
									{...getFieldProps('needQty', {
										validateFirst: true,
										rules: [{required:true}],
					                    initialValue:initData.needQty?initData.needQty:''
					                })} 
					            />
							</div>
							<div className="form-group col-xs-3 col-md-3">
								<label className={'col-xs-2 col-md-2'}></label>
								<ConstMiniSelect form={this.props.form}				
									pbj="com.fooding.fc.ds.entity.Unitofmea"
									 fieldName={'uomId'}
		                             initValueOptions={[]}
		                             optionValue={da => <Option key={da.id} objValue={{
		                                  uomId: da.id,
		                                 uomLcName:da.localName,
		                                 uomEnName: da.name,
		                                 s_label: da.localName,
		                             }}>{da.localName}</Option>}
		                             initialValue={xt.initSelectValue(initData.uomId && getFieldValue("mtlId",{mtlId:initData.mtlId}).mtlId, initData, ['uomId', 'uomLcName', 'uomEnName'], 'uomLcName', this.props.form)}
		                             className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
		                        />
							</div>			
						</div>
						<div className={'row'}>
							<div className="form-group col-xs-3 col-md-3">
								<label className={'col-xs-6 col-md-6'}>{I18n.t(100320/*销售指导价*/)}</label>
								<input type='text' className ={'col-md-6 col-lg-6 text-input-nowidth'}
									{...getFieldProps('fobSalePrc', {
					                    initialValue:initData.fobSalePrc?initData.fobSalePrc:''
					                })} 
					            />
							</div>
							<div className="form-group col-xs-3 col-md-3">
								<label className={'col-xs-2 col-md-2'}></label>
								<ConstMiniSelect form={this.props.form} pbj='com.fooding.fc.ds.entity.Curren' fieldName="cnyId"
		                             initValueOptions={[]}
		                             optionValue={da => <Option key={da.id} objValue={{
		                                 cnyId: da.id,
		                                 cnyLcName: da.localName,
		                                 cnyEnName: da.name,
		                                 s_label: da.localName
		                             }}>{da.localName}</Option>}
		                             initialValue={xt.initSelectValue(initData.cnyId && getFieldValue("mtlId",{mtlId:initData.mtlId}).mtlId, initData, ['cnyId', 'cnyLcName', 'cnyEnName'], 'cnyLcName', this.props.form)}
		                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
		                        />
							</div>			
						</div>
					</div>)
		}
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
						{content}
			</FormWrapper>);
	}
}

const CommonForm = createForm()(ProductAddEditDialog);

export default CommonForm;




{/*<div className="row">
	<div className="form-group col-md-4 col-lg-4">
	    <label className={'col-md-4 col-lg-4'}>{i18n.t(200113*//*采购类型*//*)}</label>
	    <label style={{paddingLeft: 10, color: "#1E1E1E"}}>
	        <input
	            style={{paddingLeft: 10}}
	            type="radio"
	            {...getFieldProps('normal.0', {
	                exclusive: true,
	                getValueFromEvent(e) {
	                    return e.target.checked ? '0' : '';
	                },
	                getValueProps(value) {
	                    return {
	                        checked: value === '0',
	                    };
	                },
	            })}
	        /> &nbsp;&nbsp;周期
	    </label>
	    <label style={{paddingLeft: 10, color: "#1E1E1E"}}>
	        <input
	            style={{marginLeft: 10}}
	            type="radio"
	            {...getFieldProps('normal.1', {
	                exclusive: true,
	                getValueFromEvent(e) {
	                    return e.target.checked ? '1' : '';
	                },
	                getValueProps(value) {
	                    return {
	                        checked: value === '1',
	                    };
	                },
	            })}
	        />&nbsp;&nbsp;非周期
	    </label>
	</div>
	{
	    getFieldValue('normal') === '0' ?
	        <div className="form-group col-md-4 col-lg-4">
	            <label className={'col-md-4 col-lg-4'}>{i18n.t(200114*//*采购规律*//*)}</label>
	            <ConstMiniSelect form={this.props.form}
	                             pbj='com.fooding.fc.ds.entity.Brand' fieldName="brandId2"
	                             optionValue={da => <Option key={da.id} objValue={{
	                                 brandId2: da.id,
	                                 brandLcName2: da.localName,
	                                 brandEnName2: da.name,
	                                 s_label: da.localName
	                             }}>{da.localName}</Option>}
	                             initialValue={xt.initSelectValue(businessOne.brandId, businessOne, ['brandId2', 'brandLcName2', 'brandEnName2'], 'brandLcName', form) }
	                             className='currency-btn select-from-currency col-md-8 col-lg-8'
	            />
	        </div> :
	        <div className="form-group col-md-4 col-lg-4">
	            <label className={'col-md-5 col-lg-5'}>{i18n.t(200115*//*下次采购时间*//*)}</label>
	            <div className={'col-md-7 col-lg-7'}>
	                <DataTime
	                    showTime={false}
	                    isShowIcon={true}
	                    width={'100%'}
	                    form={this.props.form}
	                    name={'billDate'}
	                    value={businessOne.billDate}
	                />
	            </div>
	        </div>
	}
	</div>
	<div className={'row'}>
	<div className="form-group col-xs-6 col-md-6">
		<label className={'col-xs-4 col-md-4'}>{i18n.t(100449*//*竞争对手*//*)}</label>
		<ConstMiniSelect form={this.props.form}
	             pbj={{
	                 apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
	                 params: {obj: 'com.fooding.fc.ds.entity.TradruleCompetitor'}
	             }} fieldName="profType"
	             initValueOptions={[]}
	             initialValue={
	             		xt.initSelectValue(initData["profTypeName"], initData, ['profType', 'profTypeName'],"profTypeName", this.props.form)
				}
	             optionValue={(da, di) => <Option key={di} objValue={{
	                 profType: da.id,
	                 profTypeName:da.name,
	                 s_label: da.name
	             }}>{da.name}</Option>} reles ={true}
	             onChange = {this.lirunChange}
	             className ={getFieldError('profType')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
		/>
	</div>
	<div className="form-group col-xs-4 col-md-4">
		<label className={'col-xs-4 col-md-4'}>{i18n.t(200116*//*报价*//*)}</label>
		<input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'} 
			placeholder=""
			{...getFieldProps('ehProf',{
				valuedateTrigger:'onBlur',
				initialValue:initData.ehProf?initData.ehProf:'',
				onChange:this.lirunNum
			})}/>
	</div>
	<div className="form-group col-xs-2 col-md-2">
		<label className={'col-xs-1 col-md-1'}></label>
		<ConstMiniSelect form={this.props.form} pbj='com.fooding.fc.ds.entity.Curren' fieldName="cnyId"
	         initValueOptions={[]}
	         optionValue={da => <Option key={da.id} objValue={{
	             cnyId: da.id,
	             cnyLcName: da.localName,
	             cnyEnName: da.name,
	             s_label: da.localName
	         }}>{da.localName}</Option>} reles={true}
	         initialValue={{}}
	         className ={'currency-btn select-from-currency col-md-11 col-lg-11'}
	    />
	</div>			
</div>*/}