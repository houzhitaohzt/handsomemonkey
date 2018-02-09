import React, {Component, PropTypes} from 'react';
import "./assets/promotionPriceDialog.less";
import {createForm, FormWrapper} from "../../../components/Form";
//引入select插件
import PromotionPriceDialogMoreDetail from "./PromotionPriceDialogMoreDetail";
// ajax
import {API_FOODING_ERP, apiForm, apiGet} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import {I18n} from "../../../lib/i18n";
const {Table} =  require("../../../components/Table");

class PromotionPriceDialog extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.moreDetailClick=this.moreDetailClick.bind(this);
		this.state=this.initState();

		// init Func
		this.getPage = this.getPage.bind(this);
		this.sendMail = this.sendMail.bind(this);



		this.columns = [{
			title : I18n.t(200861/*产品代码*/),
			dataIndex : 'mtlCode',
			key : "mtlCode",
			width : '10%',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);

			}
		},{
			title : I18n.t(500061/*产品名称*/),
			dataIndex : "mtlName",
			key : "mtlName",
			width : "12%",
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);

			}
		},{
			title : I18n.t(100382/*产品规格*/),
			dataIndex : "basSpeci",
			key : "basSpeci",
			width : "22%",
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : I18n.t(400012/*品牌*/),
			dataIndex : "brandName",
			key : "brandName",
			width : "10%",
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);

			}
		},{
			title : I18n.t(100297/*起运港*/),
			dataIndex : "sStatnName",
			key : "sStatnName",
			width : "8%",
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);

			}
		},{
			title :  I18n.t(100298/*目的港*/),
			dataIndex : "eStatnName",
			key : "eStatnName",
			width : "8%",
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);

			}
		},{
			title : I18n.t(600049/*FOB价*/),
			dataIndex : "fobPrc",
			key : "fobPrc",
			width : "8%",
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);

			}
		},{
			title : I18n.t(600050/*CIF价*/),
			dataIndex : "cifPrc",
			key : "cifPrc",
			width : "8%",
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);

			}
		}];
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
			showDetailBol:false,
			record:[],
			HTML: '',
		}
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}
	componentDidMount(){
		this.getPage();
	}
	onSaveAndClose(){
		// const {form, onSaveAndClose} = this.props;
		// form.validateFields((errors, value) => {
		// 	if(null==errors){
		// 		if(onSaveAndClose){
		// 			let record= form.getFieldsValue();
		// 			addUpdateRecord
		// 			/*addUpdateJson*/(record,(value)=>{
		// 				onSaveAndClose(value);
		// 			},(msg)=>{
		// 				console.log(msg);
		// 			});
		// 		}
		// 	}
		// })
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}

	// 发送邮件
	sendMail(){
		let that = this;
		apiForm(API_FOODING_ERP,'/promoffer/sendMails',{billId: that.props.getOne['billId'] },
			(response)=>{
				ServiceTips({text:response.message,type:'sucess'});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 详情
	moreDetailClick(e){
		e.preventDefault();
		let that = this;
		let bol;
		if(this.state.showDetail) return false;
		bol = true;
		this.setState({
			showDetailBol:bol
		});

		apiGet(API_FOODING_ERP,'/promoffer/viewMails',{billId:that.props.getOne['billId']},
			(response)=>{
				that.setState({
					HTML: response['data'] || I18n.t(600051/*无记录！*/)
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 页面 刷新
	getPage(){
		let that = this;
		apiGet(API_FOODING_ERP,'/promoffer/getMtlList',{billId:that.props.getOne['billId']},
			(response)=>{
				that.setState({
					record: response.data || [],
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	render(){
		const {data,record,showDetailBol} = this.state;
		let domDetail;
		if(showDetailBol){
			domDetail = (<PromotionPriceDialogMoreDetail />)
		}else{
			domDetail = (<div></div>)
		}

		let fanfan = ('<p>ninni</p>');

		return (<FormWrapper showSaveClose={false} showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
				<div className={'promotionprice girdlayout scroll'} style={{height:"344px"}}>

					{ !this.props.getOne['mailId'] ?

						<button onClick={this.sendMail} style={{marginBottom: '10px'}} type="button" className="btn btn-info" title={I18n.t(600052/*发送邮件*/)}>{I18n.t(600052/*发送邮件*/)}</button>

						:
						''
					}
					<div className="row">
						<Table
							ref = "provider"
							columns={this.columns}
							data={record}
							checkboxConfig={{show:false}}
							colorFilterConfig={{show : false,dataIndex:'colorType'}}
							followConfig={{show:false}}
							//scroll={{x:true,y:200}}
							prefixCls={"rc-confirm-table"}
						/>
					</div>
					<button className={'promotionprice-details'} onClick={this.moreDetailClick}>{I18n.t(100097/*详情*/)}</button>
					{/*{this.state.allen}*/}

					<div dangerouslySetInnerHTML={{__html: this.state.HTML}} />
				</div>
			</FormWrapper>);
	}
}

const CommonForm = createForm()(PromotionPriceDialog);

export default CommonForm;
