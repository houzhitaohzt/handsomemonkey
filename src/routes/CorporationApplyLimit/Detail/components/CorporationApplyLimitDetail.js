import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option } from 'rc-select';
import Dialog from '../../../../components/Dialog/Dialog';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';


// ajax
import {permissionsBtn,apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,commonAjax,toDecimal} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';



class CorporationApplyLimitDetail extends Component{
	constructor(props){
		super(props)
		this.onModifyClick=this.onModifyClick.bind(this);
		this.onUpdateClick=this.onUpdateClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState()
	}
	initState(){
		return {
			scrollHeight:0,
			paymentMethod:'L/C',
			corportationStatus:i18n.t(200494/*未投*/),
			showDilaog:false,

			getOneData:{}, // 单条数据
		}
	}
	onModifyClick(){
		let that = this;
		 let {navAddTab,navReplaceTab} =this.props;
		 navReplaceTab({id:'corporationapplylimit-add',name:i18n.t(200495/*信保限额申请修改*/),component:i18n.t(200495/*信保限额申请修改*/),url:'/corporationapplylimit/add'});
		this.props.router.push({
			pathname:'/corporationapplylimit/add',
			query:{id:that.state.getOneData['billId']},
		});

	}
	onUpdateClick(){
		let content=require('./CorporationApplyLimitUpdateDialog').default;
		let element=React.createElement(content,{getOneData:this.state['getOneData'],onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel})
    	this.setState({
    		showDilaog: true,
    		title: i18n.t(200496/*更改申请状态*/),
    		dialogContent: element
    	})
	}
	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog
		});
		this.getOne();
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	handleResize(height){
		let sch=document.body.offsetHeight-70-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
		console.log(scroll);
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(47));
		this.getOne();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}


    // getOne
    getOne(){

        let that = this;
        apiGet(API_FOODING_ERP,'/creditinslimit/getOne',{billId:that.props.location.query['id']},
            (response)=>{               
                that.setState({ 
                    getOneData: response.data,
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        }); 
    }

	render(){
		let {getOneData} = this.state;
		let common ;
		if(getOneData.status == 1){
						common = (
								<div className={'addnormal-title'}>
									<span></span>
									{permissionsBtn('credit_ins_limit.update') ? <span onClick={this.onUpdateClick} title={i18n.t(200497/*更新状态*/)}><i className={'foddingicon fooding-update'}></i></span>:''}
									{permissionsBtn('credit_ins_limit.edit') ? <span onClick={this.onModifyClick} title={i18n.t(200376/*修改*/)}><i className={'foddingicon fooding-alter_icon'}></i></span>:''}
								</div>
								)
				}else{ 
					common = (
								<div className={'addnormal-title'}>
									<span></span>
									{permissionsBtn('credit_ins_limit.update') ? <span onClick={this.onUpdateClick} title={i18n.t(200497/*更新状态*/)}><i className={'foddingicon fooding-update'}></i></span>:''}
								</div>
								)
				}
		return(<div style={{padding:' 0 10px',backgroundColor:'#f4f6f8'}}>
			<div className={'addnormal scroll'} style={{overflow:'auto',height:this.state.scrollHeight}}>
				{common}
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} >{i18n.t(100230/*状态*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['statusName']}</p>
							</div>
						</div>						
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} >{i18n.t(400011/*销售员*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['saleStaff'+language]}</p>
							</div>
						</div>						
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} ><span>*</span>{i18n.t(100355/*客户名称*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['salBe'+language]}</p>
							</div>
						</div>						
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} >{i18n.t(100354/*客户代码*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['salBeCode']}</p>
							</div>
						</div>						
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} >{i18n.t(500207/*赔付比例*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData.compenScale?getOneData.compenScale:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} >{i18n.t(100336/*备注*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData.remark?getOneData.remark:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} ><span>*</span>{i18n.t(200498/*客户地址*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['salBeAddress']}</p>
							</div>
						</div>						
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} >{i18n.t(200499/*客户国家/地区*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{(getOneData.beCntryId?getOneData['beCntry'+language]:'') + (getOneData.beCntryId &&getOneData.beAreaId? ' / ':'') + (getOneData.beAreaId?getOneData['beArea'+language]:'')}</p>
							</div>
						</div>
											
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} ><span>*</span>{i18n.t(200500/*客户电话*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['clientTel']}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} >{i18n.t(200501/*客户传真*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['clientFax']}</p>
							</div>
						</div>						
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} >{i18n.t(200502/*客户注册号*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['cliregistNum']}</p>
							</div>
						</div>						
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} >{i18n.t(200503/*客户税号*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['dutyPara']}</p>
							</div>
						</div>						
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} >{i18n.t(500061/*产品名称*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['mtl'+language]}</p>
							</div>
						</div>						
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} >{i18n.t(100385/*海关编码*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['customsCode']}</p>
							</div>
						</div>						
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} ><span>*</span>{i18n.t(100284/*币种*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['cny'+language]}</p>
							</div>
						</div>						
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} >{i18n.t(500038/*订单金额*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{toDecimal(getOneData['orderCost'])}</p>
							</div>
						</div>						
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} >{i18n.t(200504/*投保金额*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{toDecimal(getOneData['insureCost'])}</p>
							</div>
						</div>						
					</div>
					<div className={'row'}>
						{/*<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} ><span>*</span>{i18n.t(100133*//*支付条款*//*)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['payTrm'+language]}</p>
							</div>
						</div>		*/}						
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} ><span>*</span>{i18n.t(200505/*合同支付方式*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['payTrmCorpTy'+language]}</p>
							</div>
						</div>						
					</div>					
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} ><span>*</span>{i18n.t(200506/*信用期限*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['creTerm']} {" "}{i18n.t(200519/*天*/)}</p>
							</div>
						</div>						
					</div>					
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} ><span>*</span>{i18n.t(100224/*运输方式*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['trans'+language]}</p>
							</div>
						</div>						
					</div>					
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} ><span>*</span>{i18n.t(200507/*限额额度申请*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{toDecimal(getOneData['creditAmt'])}</p>
							</div>
						</div>						
					</div>					
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} >{i18n.t(200508/*预计出运日期*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{new Date(getOneData['preTranDate']).Format('yyyy-MM-dd')}</p>
							</div>
						</div>						
					</div>
					<div className={'row'}>
						<div className="col-md-12">
							<label className={'col-md-2 col-md-offset-3'} ><span>*</span>{i18n.t(200509/*咨信调查报告*/)}</label>
							<div className={'col-md-6'}>
								<p className={'paragraph'}>{getOneData['creReportMark'] ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/)}</p>
							</div>
						</div>							
					</div>					
					{ getOneData['payTrmCorpTyId'] == '20' ?
						<div>
							<div className={'row'}>
								<div className="col-md-12">
									<label className={'col-md-2 col-md-offset-3'} ><span>*</span>{i18n.t(200510/*开证银行英文名称*/)}</label>
									<div className={'col-md-6'}>
										<p className={'paragraph'}>{getOneData['issBankEnName']}</p>
									</div>
								</div>								
							</div>					
							<div className={'row'}>
								<div className="col-md-12">
									<label className={'col-md-2 col-md-offset-3'} ><span>*</span>{i18n.t(100508/*银行地址*/)}</label>
									<div className={'col-md-6'}>
										<p className={'paragraph'}>{getOneData['bankAddr']}</p>
									</div>
								</div>								
							</div>					
							<div className={'row'}>
								<div className="col-md-12">
									<label className={'col-md-2 col-md-offset-3'} ><span>*</span>{i18n.t(200511/*开证所属国家地区*/)}</label>
									<div className={'col-md-6'}>
										<p className={'paragraph'}>{getOneData['bankCoutry'+language]}</p>
									</div>
								</div>								
							</div>					
							<div className={'row'}>
								<div className="col-md-12">
									<label className={'col-md-2 col-md-offset-3'} ><span>*</span>{i18n.t(200512/*开证银行SWIFT码*/)}</label>
									<div className={'col-md-6'}>
										<p className={'paragraph'}>{getOneData['bankSWIFT']}</p>
									</div>
								</div>								
							</div>					
							<div className={'row'}>
								<div className="col-md-12">
									<label className={'col-md-2 col-md-offset-3'} >{i18n.t(100478/*电话*/)}</label>
									<div className={'col-md-6'}>
										<p className={'paragraph'}>{getOneData['bankTel']}</p>
									</div>
								</div>								
							</div>
							<div className={'row'}>
								<div className="col-md-12">
									<label className={'col-md-2 col-md-offset-3'} >{i18n.t(200513/*邮政编码*/)}</label>
									<div className={'col-md-6'}>
										<p className={'paragraph'}>{getOneData['bankPocode']}</p>
									</div>
								</div>								
							</div>					
							<div className={'row'}>
								<div className="col-md-12">
									<label className={'col-md-2 col-md-offset-3'} >{i18n.t(200514/*最迟装船日*/)}</label>
									<div className={'col-md-6'}>
										<p className={'paragraph'}>{new Date(getOneData['laShip']).Format('yyyy-MM-dd')}</p>
									</div>
								</div>								
							</div>					
							<div className={'row'}>
								<div className="col-md-12">
									<label className={'col-md-2 col-md-offset-3'} >{i18n.t(200515/*最早装船日*/)}</label>
									<div className={'col-md-6'}>
										<p className={'paragraph'}>{new Date(getOneData['earliShip']).Format('yyyy-MM-dd')}</p>
									</div>
								</div>								
							</div>					
						</div>
						:
						<i></i>
					}

				</div>
			</div>
			<Dialog width={926} visible={this.state.showDilaog} title={this.state.title} showFooter={true}>
					{this.state.dialogContent}
			</Dialog>
		</div>
		)
	}
}
export default NavConnect(CorporationApplyLimitDetail);
