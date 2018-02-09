import i18n from './../../lib/i18n';
import React, { Component,PropTypes } from 'react';
//引入select插件
import Select, {Option, ConstMiniSelect, ConstVirtualSelect} from '../../components/Select';
import ReactDOM from 'react-dom';
import Header from '../../components/Header';
import Confirm from '../../components/Dialog/Confirm';
import BKDetailHeader from '../../routes/Booking/Detail/Head/BKDetailHead';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList } from "../../services/apiCall";
import ServiceTips from '../../components/ServiceTips';
import FaYunDialog from '../../routes/Booking/Detail/Head/FaYunDialog'; //发运信息
import ChuKuDialog from '../../routes/Booking/Detail/Head/ChuKuDialog'; //发运信息
import SongHuoDialog from '../../routes/Booking/Detail/Head/SongHuoDialog'; //送货通知
import Dialog  from '../../components/Dialog';

import xuanyinhangDialog from '../../routes/Booking/Detail/Head/xuanyinhang'; //选择银行
import DetailCommon from  '../../common/DetailCommon';
import Detail from  '../../routes/Booking/Detail/Content/components/BookingDetail';
import Email  from  '../../routes/Booking/Email/components/Email';
import Date  from  '../../routes/Booking/Date/components/BookingDate';
import Contact  from  '../../routes/Booking/Contact/components/BookidngContact';
import Print  from  '../../routes/Booking/Print/components/print';
import Portfht from  '../../routes/Booking/Portfht/components/Portfht';
import Feiyong from  '../../routes/Booking/Feiyong/components/Feiyong';
import Accessory from '../../routes/Booking/Accessory/components/Accessory';
import Share  from  '../../routes/Booking/Share/components/Share';
import Annotation  from  '../../routes/Booking/Annotation/components/Annotation';
export class BKDetailLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
			id:this.props.location.query.id,
			showDilaog:false,
			title:'',
			dialogContent:<div></div>,
			getOne:{},
			value:{},
			selectRow:[],
            curentId:DetailCommon.booking[this.props.location.query.id]||this.props.location.query.index || 'detail'
		};
		this.onPackUp =this.onPackUp.bind(this);
		this.handleResize=this.handleResize.bind(this);
		this.fayunClick = this.fayunClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.chukutonglzhiClick = this.chukutonglzhiClick.bind(this);
		this.getSelectRow = this.getSelectRow.bind(this);
		this.songhuotonglzhiClick = this.songhuotonglzhiClick.bind(this);
		this.shenpiClick = this.shenpiClick.bind(this);
		this.zhuangtaiClick = this.zhuangtaiClick.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
        this.songhuoConfirm = this.songhuoConfirm.bind(this);
        this.fyClick=this.fyClick.bind(this);
    }
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){

        }else if(obj.id == 'email' && !obj.isLoading){
            this.email.getPage();
        }else if(obj.id == 'date' && !obj.isLoading){
            this.date.getPage();
        }else if(obj.id == 'contact' && !obj.isLoading){
            this.contact.getPage();
        }else if(obj.id == 'print' && !obj.isLoading){

        }else if(obj.id == 'portfht' && !obj.isLoading){
            this.portfht.getPage();
        }else if(obj.id == 'feiyong' && !obj.isLoading){
            this.feiyong.getPage();
        }else if(obj.id == 'accessory' && !obj.isLoading){
            this.accessory.getPage();
        }else if(obj.id == 'share' && !obj.isLoading){
            this.share.getPages();
        }else if(obj.id == 'annotation' && !obj.isLoading){
            this.annotation.getPage();
        }
        DetailCommon.booking[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
    }
    shenpiClick(){
    	let {getOne = {}} = this.state;
		let billId = getOne.billId,billType = getOne.billType;
		let content = require('../../routes/PruchaseOrder/Detail/Content/components/ApprovalDialog').default;
	    let element = React.createElement(content, {onCancel: this.onCancel,billType:billType,billId:billId});
	    this.setState({
	            showDilaog: true,
	            title: i18n.t(100470/*查看审批*/),
	            dialogContent: element,
	            showHeader:false
	    })
    }
    //选择银行
    fyClick(){
        let that = this;
        let {getOne = {}} = this.state;
        let billId = getOne.billId;
        Confirm(i18n.t(300056/*您确定要执行发运操作吗？*/), {
            done: () => {
                apiForm(API_FOODING_ERP,"/shipping/shipment",{billId:billId},response => {
                    that.setState({
                        data: response.data==null?"":response.data.exsitLimits
                    });
                    if(response.data!=null){
                        if(response.data.exsitLimits!=null){
                            let content = require('../../routes/Booking/Detail/Head/xuanyinhang').default;
                            let element = React.createElement(content, {onCancel: this.onCancel,router:this.props.router, getOne:getOne,onSaveAndClose: this.xuanzeyinhangClick, bankName: response.data.exsitLimits});
                            this.setState({
                                showDilaog: true,
                                title:'选择银行',
                                dialogContent: element,
                                showHeader:true
                            })
                        }
                    }else{
                        //刷新当前页面
                        this.onPackUp();
                        ServiceTips({text:response.message,type:"success"})
                    }



                },error => {
                    ServiceTips({text:error.message,type:'error'})
                })
            },
            close:() => {
                console.log('no, close')
            }
        });
    }
    xuanzeyinhangClick = (data,value) => {
        this.setState({
            showDilaog:false,
        });
        this.onPackUp();
    };
	// 发送模板
	sendTemplateHandle = ()=> {
		let {getOne} = this.state;
		let content = require('../../routes/Common_confirm/sendTpl').default;
	    let element = React.createElement(content, {
			active:'booking',
			getOne:getOne,
			onCancel: this.onCancel,
		});

	    this.setState({
			showDilaog: true,
			title: i18n.t(600293/*发送模板*/),
			dialogContent: element,
			showHeader:false
	    })
	}

    songhuoConfirm(){
        let that = this;
        let PurOrder = this.state.getOne;
        apiGet(API_FOODING_ERP,'/shipping/checkNotice',{billId:PurOrder.billId},(response)=>{
            if(response.data.pass){
                this.songhuotonglzhiClick();
            }else{
                let content = require('../../routes/PruchaseOrder/Detail/Header/PruchaseConfrim').default;
                let element = React.createElement(content, {onSaveAndClose: this.songhuotonglzhiClick,data:response.data.infos, onCancel: this.onCancel});
                this.setState({
                    showDilaog: true,
                    title: i18n.t(200324/*收款情况*/),
                    dialogContent: element,
                    showHeader:true
                });
            }

        },(error)=>{
            ServiceTips({text:error.message,type:"error"});
        });
	}
	//销售订单执行情况
		zhuangtaiClick(num){
			let that = this;
			this.setState({
					showDilaog: true,
					title:i18n.t(500260/*销售订单执行情况*/),
					dialogContent: React.createElement(require('../../routes/BookNeed/components/sourceNoDetail').default,{onCancel:that.onCancel,num:num})
				});
			}
    songhuotonglzhiClick(){
    	this.setState({
	    	showDilaog:true,
			title:i18n.t(200374/*送货通知*/),
			dialogContent:<SongHuoDialog onCancel={this.onCancel}
			selectRow={this.state.selectRow}
			getOne ={this.state.getOne} onPackUp={this.onPackUp}/>
		});
    }
    chukutonglzhiClick(){
    	//出库通知
    	if(this.state.selectRow.length < 1){
    		ServiceTips({text:'请选择一条订单产品进行操作',type:'error'});
    	}else {
    		apiGet(API_FOODING_ERP,'/shipping/getNotice',{billId:this.state.selectRow[0].billId},(response)=>{
			this.setState({
	    		showDilaog:true,
				title:i18n.t(400125/*出库通知*/),
				dialogContent:<ChuKuDialog onCancel={this.onCancel} selectRow={this.state.selectRow}
				getOne ={this.state.getOne} onPackUp={this.onPackUp} data ={response.data}/>
		    	});
			},(error)=>{
				ServiceTips({text:error.message,type:'error'});
			});
    	}

    }
    getSelectRow(selectRow){
    	this.setState({
    		selectRow:selectRow
    	});
    }
    fayunClick(){
    	//发运信息
    	this.setState({
    		showDilaog:true,
			title:i18n.t(200342/*发运信息*/),
			dialogContent:<FaYunDialog onCancel={this.onCancel}
			getOne ={this.state.getOne} onPackUp={this.onPackUp}/>
    	});
    }
    onCancel(){
    	this.setState({
    		showDilaog:false,
    	});
    }
    onPackUp(obj){
    	apiGet(API_FOODING_ERP,'/shipping/getOne',{billId:this.state.id},(response)=>{
			this.setState({
				getOne:response.data,
				value:response.data
			},()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            });
		},(error)=>{

		})
    };
	handleResize(){
		let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
	};
	componentDidMount(){
        let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
		window.addEventListener('resize', this.handleResize);
    	this.onPackUp(true);
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize);
  	};
	render(){
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{
			paddingTop:this.state.paddingTop,
			getOne:this.state.getOne,
			id:this.state.id,
			value:this.state.value,
			showDilaog:this.state.showDilaog,
			title:this.state.title,
			dialogContent:this.state.dialogContent,
			onCancel:this.onCancel,
			getSelectRow:this.getSelectRow
		});
		children.props=newProps;
		return (

			<div className='container-body'>
				<BKDetailHeader  onPackUp={this.onPackUp} id={this.state.id}
								 curentId ={this.state.curentId}
								 onClickLink ={this.onClickLink}
				getOne={this.state.getOne}  shenpiClick ={this.shenpiClick}
				sendTemplateHandle={this.sendTemplateHandle}
				fayunClick={this.fayunClick} chukutonglzhiClick={this.chukutonglzhiClick} songhuotonglzhiClick={this.songhuoConfirm} zhuangtaiClick={this.zhuangtaiClick} fyClick={this.fyClick}/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						<div className={this.state.curentId == 'detail' ?"":"none"}>
							<Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
						</div>
						<div className={this.state.curentId == 'email' ?"":"none"}>
							<Email {...newProps} email ={no => this.email = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'date' ?"":"none"}>
							<Date {...newProps} date ={no => this.date = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'contact' ?"":"none"}>
							<Contact {...newProps} contact ={no => this.contact = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'print' ?"":"none"}>
							<Print {...newProps}  />
						</div>
						<div className={this.state.curentId == 'portfht' ?"":"none"}>
							<Portfht {...newProps} portfht ={no => this.portfht = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'feiyong' ?"":"none"}>
							<Feiyong {...newProps} feiyong ={no => this.feiyong = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'accessory' ?"":"none"}>
							<Accessory {...newProps} accessory ={no => this.accessory = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'share' ?"":"none"}>
							<Share {...newProps} share ={no => this.share = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'annotation' ?"":"none"}>
							<Annotation {...newProps} annotation ={no => this.annotation = no} isDetail ={true} />
						</div>
					</div>
					<Dialog showHeader={true} width={926} visible={this.state.showDilaog} title={this.state.title}>
                            {this.state.dialogContent}
                   </Dialog>
			    </div>
			</div>
			);
	}
}
export default BKDetailLayout



