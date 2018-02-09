import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Dialog from '../../../../components/Dialog/Dialog';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
// common
import Select, { Option } from '../../../../components/Select'; // 下拉
import Calendar from  '../../../../components/Calendar/Calendar';
// ajax
import {permissionsBtn,apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,commonAjax,toDecimal} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
class OrderCorporationDetail extends Component{
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
		let {navReplaceTab} =this.props;
        navReplaceTab({id:'ordercorporation-edit',name:i18n.t(200797/*订单信保修改*/),component:i18n.t(200797/*订单信保修改*/),url:'/ordercorporation/edit'});
		this.props.router.push({
			pathname:'/ordercorporation/edit',
			query:{id:that.state.getOneData['billId']},
		});
	}
	onUpdateClick(){

		let content=require('./OrderCorporationUpdateDialog').default;
		let element=React.createElement(content,{getOneData:this.state['getOneData'],onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel})
    	this.setState({
    		showDilaog: true,
    		title: i18n.t(200798/*更改状态*/),
    		dialogContent: element
    	})
	}
	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog
		},function(){
            this.getOne();
        });
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	handleResize(height){
		let sch=document.body.offsetHeight-50-height;
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
        apiGet(API_FOODING_ERP,'/ordercredit/getOne',{billId:that.props.location.query['id']},
            (response)=>{
                that.setState({
                    getOneData: response.data,
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });
    }


	render(){


        const {getOneData,userMessage,productMessage,creditTypeMessage} = this.state;
        const {form} = this.props;




		return(<div style={{padding:'10px',backgroundColor:'#f4f6f8'}}>
			<div className={'addnormal scroll'} style={{overflow:'auto',height:this.state.scrollHeight}}>
				<div className={'addnormal-title'}>
					<span></span>
					{permissionsBtn('order_credit_insurance.update') && getOneData['finStatus'] !=35 ? <span onClick={this.onUpdateClick} title={i18n.t(200497/*更新状态*/)}><i className={'foddingicon fooding-update'}></i></span>:''}
					{permissionsBtn('order_credit_insurance.edit') && getOneData['finStatus'] !=35 ? <span onClick={this.onModifyClick} title={i18n.t(200376/*修改*/)}><i className={'foddingicon fooding-alter_icon'}></i></span>:''}

				</div>
				<div className={'  girdlayout'}>

                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200518/*信保状态*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['statusName']}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(400011/*销售员*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['saleStaff'+language]}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(100355/*客户名称*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['salBe'+language]}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(100354/*客户代码*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['salBeCode']}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200498/*客户地址*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['salBeAddress']}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200499/*客户国家/地区*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['beCntry'+language]}{'/'}{getOneData['beArea'+language]}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200792/*收货人名称*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['revBusiness'+language]}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200387/*销售订单号*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['salesOrderNo']}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(500061/*产品名称*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['mtl'+language]}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(100385/*海关编码*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['customsNo']}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(100284/*币种*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['cny'+language]}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(500038/*订单金额*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{toDecimal(getOneData['orderAccount'])}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200504/*投保金额*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{toDecimal(getOneData['coverAccount'])}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(100133/*支付条款*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['payTrm'+language]}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200505/*合同支付方式*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['payTrmCorpTy'+language]}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200793/*加保支付方式*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['corpTy'+language]}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200506/*信用期限*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['useLimit']} {i18n.t(200519/*天*/)}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(100224/*运输方式*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['trans'+language]}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200802/*出运日期*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{new Date(getOneData['sendDate']).Format('yyyy-MM-dd')}</p>
                            </div>
                        </div>
                    </div>                    
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200794/*预计到达目的港日期*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{new Date(getOneData['predictArrivalDate']).Format('yyyy-MM-dd')}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200795/*融资*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['financing'] ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/)}</p>
                            </div>
                        </div>
                    </div>

					{ (getOneData['payTrmCorpTyId']=='20' ? true : false) ?
						<div>
                            <div className={'row'}>
                                <div className="col-md-12">
                                    <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200510/*开证银行英文名称*/)}</label>
                                    <div className={'col-md-6'}>
                                        <p className={'paragraph'}>{getOneData['bankEnName']}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className="col-md-12">
                                    <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200511/*开证所属国家地区*/)}</label>
                                    <div className={'col-md-6'}>
                                        <p className={'paragraph'}>{getOneData['beCntry'+language]}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className="col-md-12">
                                    <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200512/*开证银行SWIFT码*/)}</label>
                                    <div className={'col-md-6'}>
                                        <p className={'paragraph'}>{getOneData['bankSWIFT']}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className="col-md-12">
                                    <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200796/*信用证编号*/)}</label>
                                    <div className={'col-md-6'}>
                                        <p className={'paragraph'}>{getOneData['lcNo']}</p>
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
export default NavConnect(OrderCorporationDetail);
