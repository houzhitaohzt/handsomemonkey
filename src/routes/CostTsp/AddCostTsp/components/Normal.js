import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import {createForm,FormWrapper} from '../../../../components/Form';
import Select, {Option } from '../../../../components/Select';
import DataTime from '../../../../components/Calendar/Calendar';
import  SelectChange from "../../../../components/SelectChange";
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
class Addnormal extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState();
		this.getOne = this.getOne.bind(this);
		this.chuangsClick = this.chuangsClick.bind(this);
		this.handleCertificate = this.handleCertificate.bind(this);
		this.saveClick = this.saveClick.bind(this);
		this.backClick = this.backClick.bind(this);
		this.qiyunClick = this.qiyunClick.bind(this);
		props.normalRef && props.normalRef(this);
		console.log(props, "test")
	}
	initState(){
		return {
			radioState:'',
			radioAddress:'',
			data:{},
			chuangArray:[],
			qiyunArray:[],
			info:[]
		}
	}
	StateChange(e){
		let tex;
		tex = e.target.value;
		this.setState({
			radioState:tex
		})
	}
	qiyunClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Statn',
			queryParams:[{
			attr:"statnTyId",
			expression:"=",
			value:10
		}]
		},
			(response)=>{
				that.setState({
					qiyunArray:response.data
				})
		},(error)=>{

		});
	}
	chuangsClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',
			{
				"obj":"com.fooding.fc.ds.entity.Carrier",
				"prettyMark":true
			},
			(response)=>{
				that.setState({
					chuangArray:response.data
				});
		},(error)=>{

		});
	}
	getOne(){
		var that = this;
		apiGet(API_FOODING_ERP,'/lsbeport/getOne',{id:this.props.id},(response)=>{
			that.setState({
				data:response.data
			})
		},(error)=>{

		})
	}
	handleCertificate(){
		var that = this;
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{clusId:getUser().staff.clusId},(response)=>{
			that.setState({
				info:response.data
			})
		},(error)=>{

		})
	}
	componentDidMount(){
		if(this.props.id){
				this.getOne();
		}

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
	backClick(){
		this.props.backClick(this.state.data);
	}
	AddressChange(e){
		let addres;
		addres = e.target.value;
		this.setState({
			radioAddress:addres
		})
	}
	render(){
		let {getNFieldProps,getFieldError} = this.props.form;
		const {radioAddress, radioState,data} = this.state;
		getNFieldProps('type',{
								initialValue:10
		})
		return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span>{i18n.t(100138/*常规*/)}</span>

					<span onClick={this.backClick.bind(this,null)}><i className={'foddingicon fooding-back'}></i></span>
					<span onClick={this.saveClick.bind(this,null)}><i className={'foddingicon fooding-save'}></i></span>

				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200343/*货运公司*/)}</label>
							<Select
								{...getNFieldProps('lsBeId',{
									rules: [{required:true}],
								    initialValue:data["lsBe"+language]?{s_label:data["lsBe"+language],
								     lsBeId: data.lsBeId, lsBeLcName:data.lsBeLcName,
								      lsBeEnName:data.lsBeEnName}:undefined
								})}
							    placeholder=''
								optionLabelProp="children"
								className ={getFieldError('lsBeId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
							    onClick={this.chuangsClick}
							>
							  {this.state.chuangArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, lsBeId: o.id, lsBeLcName:o.localName, lsBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100155/*港口*/)}</label>
							<Select
								{...getNFieldProps('statnId',{
										                    rules: [{required:true}],
										                    initialValue:data["statn"+language]?{s_label:data["statn"+language], statnId: data.statnId, statnLcName:data.statnLcName,statnEnName:data.statnEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={getFieldError('statnId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
										                onClick={this.qiyunClick}
							>
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, statnId: o.id, statnLcName :o.localName, statnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100288/*发布日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									showTime={false}
									isShowIcon={true}
									value={data['reDate']}
									width={'100%'}
									form={this.props.form}
									name={'reDate'}
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100286/*生效日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									showTime={false}
									value={data['sDate']}
									isShowIcon={true}
									width={'100%'}
									form={this.props.form}
									name={'sDate'}
								/>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100287/*失效日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									showTime={false}
									isShowIcon={true}
									value={data['eDate']}
									width={'100%'}
									form={this.props.form}
									name={'eDate'}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const ProductForm =createForm()(Addnormal);
export default ProductForm;
