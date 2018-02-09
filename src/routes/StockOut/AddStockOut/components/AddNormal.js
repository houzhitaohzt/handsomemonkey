import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option } from '../../../../components/Select';
import DataTime from '../../../../components/Calendar/Calendar';
import SelectChange from "../../../../components/SelectChange";
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import {I18n} from '../../../../lib/i18n';
class Addnormal extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState()
		props.normalRef && props.normalRef(this);
		this.shiwuClick = this.shiwuClick.bind(this);
		this.cangkuClick= this.cangkuClick.bind(this);
		this.kehuClick= this.kehuClick.bind(this);
		this.onSelect=this.onSelect.bind(this);

	}
	initState(){
		return {
			radioState:'',
			radioAddress:'',
			data:{},
			info:[],
			shiwuArray:[],
			cangkuArray:[],
			//kehuArray:[]
		}
	}
	StateChange(e){
		let tex;
		tex = e.target.value;
		this.setState({
			radioState:tex
		})
	}
	shiwuClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.StorOpert',queryParams:[{attr:'stOpeID',expression:'=',value:'20'}]},
			(response)=>{
				that.setState({
					shiwuArray:response.data
				})
		},(error)=>{

		});
	}
	cangkuClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.StorLocatn'},

			(response)=>{
				that.setState({
					cangkuArray:response.data
				})
		},(error)=>{

		});
	}
	kehuClick(){
		// var that = this;
		// apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Customer'},


		// 	(response)=>{
		// 		that.setState({
		// 			kehuArray:response.data
		// 		})
		// },(error)=>{

		// });
	}
	AddressChange(e){
		let addres;
		addres = e.target.value;
		this.setState({
			radioAddress:addres
		})
	}
	saveClick(isclose,initAjax){
		var that = this;
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
	      		if(that.state.data.billId){
	      			value = Object.assign({},this.state.data,value);
	      		}
	      		if(this.props.id){
	      			value=Object.assign({},value,{billId:this.props.id});
	      			that.props.saveClick(value,isclose,initAjax);
	      		}else {
	      			that.props.saveClick(value,isclose,initAjax);
	      		}
			}

    	});

	}
	onSelect(slId,item){
		var that = this;
		let getOne = this.props.getOne;
		apiGet(API_FOODING_DS, '/storLocatn/getOne', {id: item.props.objValue.slId}, response => {
			let thirdMark = response.data.stroTyId == 20?true:false;
        getOne = Object.assign({},getOne,{thirdMark:thirdMark});
           that.props.setGetOne(getOne);
        }, error => {
        })

	}
	backClick(){
		this.props.backClick(this.state.data);
	}
	render(){
		let {getNFieldProps,getFieldError,getFieldProps} = this.props.form;
		let {getOne} = this.props;
		const {radioAddress, radioState,data} = this.state;
		getNFieldProps('billType',{
								initialValue:223
		})
		return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span>{I18n.t(100138/*常规*/)}</span>
					<span onClick={this.backClick.bind(this,null)}><i className={'foddingicon fooding-back'}></i></span>
					<span onClick={this.props.saveClickLink}><i className={'foddingicon fooding-save'}></i></span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400048/*单据编号*/)}</label>
							<input
											    type="text"
												{...getFieldProps('no',{
												validateFirst: true,
												rules: [{required:true}],
												initialValue:getOne.no||''})}
												className={'col-xs-8 col-md-8 text-input-nowidth'}
												disabled = {true}
							/>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									isShowIcon={true}
									showTime={false}
									width={'100%'}
									name={'billDate'}
									value={getOne.billDate}
									form={this.props.form}
								/>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400049/*业务状态*/)}</label>
							<Select
								{...getNFieldProps('status',{
										                    rules: [{required:true}],
										                    initialValue:getOne.status?{s_label:getOne.statusName,status:getOne.status}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
										                disabled={true}
							>

							</Select>
						</div>

					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400025/*仓库*/)}</label>
							<Select
								{...getNFieldProps('slId',{

										                    initialValue:getOne["sl"+language]?{s_label:getOne["sl"+language], slId: getOne.slId, slLcName:getOne.slLcName,slEnName:getOne.slEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
										                onClick={this.cangkuClick}
										                onSelect={this.onSelect}
							>
										                {this.state.cangkuArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, slId: o.id, slLcName :o.localName, slEnName: o.name}} title={o.name}>{o.localName}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(500135/*三方仓*/)}</label>
							<Select
									{...getNFieldProps('thirdMark',{
										initialValue:getOne.thirdMark?{s_label:getOne.thirdMark?I18n.t(100141/*是*/):I18n.t(100142/*否*/),thirdMark:getOne.thirdMark}:{s_label:I18n.t(100142/*否*/),thirdMark:getOne.thirdMark}
									 })}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"
									className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
									disabled
								>
							</Select>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(500136/*目的地*/)}</label>
							<input
											    type="text"
												{...getFieldProps('receAddress',{
												initialValue:getOne.receAddress || ''})}
												className={'col-xs-8 col-md-8 text-input-nowidth'}
							/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500172/*预计出库日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									showTime={false}
									isShowIcon={true}
									width={'100%'}
									form={this.props.form}
									validate={true}
									name={'predictDate'}
									value={getOne.predictDate || ''}
								/>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500131/*事物类型*/)}</label>
							<Select
								{...getNFieldProps('stOpeId',{
										                    rules: [{required:true}],
										                    initialValue:getOne["stOpe"+language]?{s_label:getOne["stOpe"+language], stOpeId: getOne.stOpeId, stOpeLcName:getOne.stOpeLcName,stOpeEnName:getOne.stOpeEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={getFieldError('stOpeId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
										                onClick={this.shiwuClick}
							>
										                {this.state.shiwuArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, stOpeId: o.id, stOpeLcName :o.localName, stOpeEnName: o.name}} title={o.name}>{o.localName}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100311/*客户*/)}</label>
							<Select
								{...getNFieldProps('salBeId',{
										                    initialValue:getOne["salBe"+language]?{s_label:getOne["salBe"+language], salBeId: getOne.salBeId, salBeLcName:getOne.salBeLcName,salBeEnName:getOne.salBeEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
										                onClick={this.kehuClick}
										                disabled={true}
							>

							</Select>
						</div>

					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100336/*备注*/)}</label>
							<input
											    type="text"
												{...getFieldProps('note',{
												initialValue:getOne.note || ''})}
												className={'col-xs-8 col-md-8 text-input-nowidth'}
							/>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(500129/*源单编号*/)}</label>
							<input
											    type="text"
												{...getFieldProps('sourceNo',{
												initialValue:getOne.sourceNo})}
												className={'col-xs-8 col-md-8 text-input-nowidth'}
												disabled = {true}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const ProductForm =Addnormal;
export default ProductForm;
