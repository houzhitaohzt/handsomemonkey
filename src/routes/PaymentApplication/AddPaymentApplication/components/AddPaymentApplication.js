import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import AddNormal from "./AddNormal";
import Organ from "./Organ";
import {createForm} from '../../../../components/Form';
import {ConstMiniSelect, Option} from '../../../../components/Select';
import xt from '../../../../common/xt'; // 下拉
import DataTime from '../../../../components/Calendar/Calendar';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import {API_FOODING_DS, API_FOODING_ERP, apiGet, apiPost, language} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
import Confirm from '../../../../components/Dialog/Confirm';

const {Table} = require("../../../../components/Table");
const  sourceType = 338;
class PayPlanceComp extends Component {

	render (){
		let {i,value,addClick,deleteClick} = this.props;
		let {getFieldError,getFieldProps} = this.props.form;
		return (
			<div className={'row'} style={{marginTop:'10px'}}>
					<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100181/*款项类型*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                     pbj={{
                                         apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                         params: {obj:'com.fooding.fc.ds.entity.FundType'}
                                     }} fieldName={'fundTyId'}
                                     initValueOptions={[]}
                                     initialValue={xt.initSelectValue(value["fundTy"+language], value, ['fundTyId', 'fundTyLcName', 'fundTyEnName'],"fundTy"+language, this.props.form)}
                                     optionValue={(da, di) => <Option key={di} objValue={{
                                         fundTyId: da.id,
                                         fundTyLcName: da.localName,
                                         fundTyEnName: da.name,
                                         s_label: da.localName
                                     }}>{da.localName}</Option>} reles={true}
                                     className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
					</div>
					<div className="form-group col-md-2 col-lg-2">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200622/*期数*/)}</label>
							<input type='text' className={getFieldError("periodNum")?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'}
														placeholder=""
														{...getFieldProps("periodNum",{
															validateFirst:true,
															rules:[{required:true}],
															valuedateTrigger:'onBlur',
															initialValue:value.periodNum?value.periodNum:''
														})}
							/>
					</div>
					<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-5 col-lg-5'}>{i18n.t(200840/*申请付款时间*/)}</label>
							<div className={'col-md-6 col-lg-6 datetime'} style={{paddingLeft:0}}>
								<DataTime
									showTime={false}
									isShowIcon={true}
									width={'100%'}
									value = {value.predictPayDate}
									form={this.props.form}
									validate={true}
									name={"predictPayDate"}
								/>
							</div>
					</div>
					<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-5 col-lg-5'}>{i18n.t(200841/*申请付款金额*/)}</label>
							<input type='text' className={getFieldError("predictPayAmt")?'col-xs-7 col-md-7 text-input-nowidth error-border':'col-xs-7 col-md-7 text-input-nowidth'}
									placeholder=""
									{...getFieldProps("predictPayAmt",{
										validateFirst:true,
										rules:[{required:true}],
										valuedateTrigger:'onBlur',
										initialValue:value.predictPayAmt?value.predictPayAmt:0
									})}
							/>
					</div>
					<i className={'foddingicon fooding-add-icon3'} style={{fontSize:'16px',marginLeft:'10px',lineHeight: '36px',cursor: 'pointer',color:'#8c949b'}} onClick ={addClick}></i>
					<i className={this.props.i==0?'none':'foddingicon fooding-delete-icon4'} style={{fontSize:'16px',marginLeft:'10px',lineHeight: '36px',cursor: 'pointer',color:'#8c949b'}} onClick ={deleteClick.bind(this,i)}></i>

				</div>
			);
	}
}

const PayPlance = createForm()(PayPlanceComp);

export  class  ActivityDetail extends Component{
	constructor(props){
		super(props);
		this.onTableClick = this.onTableClick.bind(this);
		// this.saveClick = this.saveClick.bind(this);
		this.backClick = this.backClick.bind(this);
		this.state = {
			inputValue:'',
			checked:0,
			paddingTop:0,
			scroll:0,
			planList:[],
			isnormal:this.props.location.query.isnormal?this.props.location.query.isnormal:false,
			getOne:{},
			id:this.props.location.query.id
		}
		this.setGetOne = this.setGetOne.bind(this);
		this.getOneCall = this.getOneCall.bind(this);
		this.saveClickLink = this.saveClickLink.bind(this);
	    this.addClick = this.addClick.bind(this);
	    this.deleteClick = this.deleteClick.bind(this);
	    	this.planeIndex = 0;
	    	this.planeForm = [];
	}

	setGetOne(obj){
		this.setState({
			getOne:obj
		});
	}
	onTableClick(value){
		if(this.state.checked == 0){
			this.setState({
				inputValue:value.business + '  '+ value.theme
			})
		}else if(this.state.checked == 1){
			this.setState({
				inputValue:value.business + '  '+ value.theme
			})
		}
	}
	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = 100;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;

		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
		this.getOneCall();
    };
    getOneCall(id){
    	let that = this;
    	apiGet(API_FOODING_ERP,'/paymentapplcat/getOne',{billId:this.state.id,sourceType:sourceType},(response)=>{
            that.setState({
				getOne:response.data,
				planList:response.data.planList||[]
			});
            that.bank();
		},(error)=>{

		})
    }
    bank=()=>{
        let that = this;
        let getOne= this.state.getOne;
        apiGet(API_FOODING_DS,'/bankacct/getList',{sourceId:getOne.receiptBeId,curcyId:getOne.cnyId},response => {
            let list =  response.data || [];
            let filterlist = list.filter( e => !!e.dfutMrk);
            let arr = filterlist.length == 0 ? list : filterlist;
        	if(getOne.cnyId=='583ceccbd1072ad765871494'){
                let providerOth = Object.assign({},getOne,{
                    receiverName:arr[0] && arr[0].actStaff?arr[0].actStaff :getOne.receiverName,
                    receBankAccount:arr[0] && arr[0].bacctCode ?arr[0].bacctCode :getOne.receBankAccount,
                    receBankLcName:arr[0] && arr[0].bankName ? arr[0].bankName :getOne.receBankLcName,
                    swiftCode:arr[0]&& arr[0].swiftCode ? arr[0].swiftCode :getOne.swiftCode,
                    receiverAddress:arr[0] && arr[0].actAddres ?arr[0].actAddres : getOne.receiverAddress});
                that.setState({
                    getOne:providerOth,
                })
			}else{
                let providerOth = Object.assign({},getOne,{
                    receiverName:arr[0] && arr[0].actStaff?arr[0].actStaff :getOne.receiverName,
                    receBankAccount:arr[0] && arr[0].bacctCode ?arr[0].bacctCode :getOne.receBankAccount,
                    receBankLcName:arr[0] && arr[0].bankName ? arr[0].bankName :getOne.receBankLcName,
                    bankEnAddr:arr[0] && arr[0].bankadres ? arr[0].bankadres :getOne.bankEnAddr,
                    swiftCode:arr[0]&& arr[0].swiftCode ? arr[0].swiftCode :getOne.swiftCode,
                    receiverAddress:arr[0] && arr[0].actAddres ?arr[0].actAddres : getOne.receiverAddress});
                that.setState({
                    getOne:providerOth,
                })
			}


			console.log(this.state.getOne)
        },error => {
        })
	}
    deleteClick(i){
    	console.log(i);
    	let that = this;
    	let array = this.state.planList;
    	array.splice(i,1);
    	this.setState({
    		planList:array
    	})
    }
    addClick(){
    	let that = this;
    	let array = this.state.planList;
    	this.planeIndex ++;
    	array.push({billDtlId: this.planeIndex});
    		console.log(this.planeIndex);
    	this.setState({
    		planList:array
    	})
    }
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}
  	backClick(){
  		let that = this;
  		this.props.navRemoveTab({name: i18n.t(200842/*付款申请编辑*/), component: i18n.t(200842/*付款申请编辑*/), url: '/paymentApplication/addEidt'});
        this.props.navReplaceTab({name:i18n.t(400040/*付款申请*/),component:i18n.t(400040/*付款申请*/),url:'/paymentApplication/list'});
        this.props.router.push({ pathname: '/paymentApplication/list'});
  	}

  	validateAllForm = callback =>{
		let allError = [], allValues = [], prodcuts = Object.entries(this.planeForm);
		let sucTotal = 0;
		let call = (error, val) => {
			sucTotal ++;
			error && allError.push(error);
			val && allValues.push(val);
			if(sucTotal === prodcuts.length ){
				callback(allError, allValues);
			}
		};

		for(let [key, value] of prodcuts){
			if(value) value.validateFields(call);
			else call()
		}
	};


  	saveClickLink(initAjax){
  		let that = this;
  		this.props.form.validateFields((error, value) => {

			if(error){
				console.log(error, value);
			}else{
				if(this.state.planList == 0){
					ServiceTips({text:i18n.t(200843/*没有付款计划*/),type:'error'});
				}else {
					delete value.swift;
					this.validateAllForm((error, allValue) => {
	  					if( !error.length){
	  						value.planList = allValue;
		  					apiPost(API_FOODING_ERP,'/paymentapplcat/save',Object.assign({},this.state.getOne,value),(response)=>{
									let param = response.data;
									let cancel = ()=>{
											this.props.router.push({pathname: this.props.router.location.pathname, query: {id: param}, state: {refresh: false}});
											this.setState({id:param},()=>{
												that.getOneCall();
											})
									};
									let done = ()=>{
											ServiceTips({text:response.message,type:'sucess'});
								  		this.props.navReplaceTab({ name: i18n.t(200405/*付款申请详情*/), component: i18n.t(200405/*付款申请详情*/), url: '/paymentApplication/detail'});
						        	this.props.router.push({pathname:'/paymentApplication/detail',query:{id:response.data}});
									};
									Confirm(i18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5,cancel, done});
						  },(error)=>{
						  		ServiceTips({text:error.message,type:'error'});
						  })
		  				}
	  				});
				}


			}

    	});
  	}
	render(){
			let {getFieldError,getFieldProps} = this.props.form;
			let common =<div></div>;
			common = this.state.planList.map((value,i)=> <PayPlance ref={rf=>this.planeForm[i]=rf} key={value.billDtlId} value={value} i={i} addClick={this.addClick} deleteClick={this.deleteClick}/>);
			return (
				<div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
					<AddNormal handleChange={this.handleChange}
						saveClick={this.saveClickLink}
						backClick={this.backClick}
						onTableClick ={this.onTableClick}
						inputValue ={this.state.inputValue}
						checked ={this.state.checked}
						columns = {this.state.columns}
						data = {this.state.data}
						getOne = {this.state.getOne}
						form = {this.props.form}
                        setGetOne ={this.setGetOne}
					 />
					 <div className={'businessdetailnormal'} style={{marginTop:'10px'}}>
						<div className={'addnormal-title'}>
							<span>{i18n.t(200844/*付款计划*/)}</span>
						</div>
						<div className={'  girdlayout'}>
						{common}
						</div>
					</div>
					  <Organ isShowChecked={true} getOne = {this.state.getOne} form ={this.props.form}/>
				</div>
			);

	}

}

export default createForm()(NavConnect(ActivityDetail));
