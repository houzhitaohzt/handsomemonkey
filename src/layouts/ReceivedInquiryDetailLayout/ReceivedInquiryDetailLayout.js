import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import ReceivedInquiryDetailsHead  from '../../routes/ReceivedInquiry/ReceivedInquiryDetail/Header/ReceivedInquiryDetailsHead'
import {apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS} from '../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../components/ServiceTips";//提示框
import Dialog from "../../components/Dialog/Dialog";


import DetailCommon from  '../../common/DetailCommon';
import Detail from  '../../routes/ReceivedInquiry/ReceivedInquiryDetail/Content/components/ReceivedInquiryDetail';
import Feedback from '../../routes/ReceivedInquiry/SendQuot/components/SendQuot';
export class ReceivedInquiryDetailLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
		    billId: null,
			paddingTop: 226,
            businessOne: {},
            productData: [],
            supplierData: [],
            cardData: [],
            shipData: [],
            testData: [],
            quotData: [],
            showDilaog:false,
            dialogTitle: '',
            dilogTelmp: <div/>,
            curentId:DetailCommon.receivedInquiry[this.props.location.query.id] || this.props.location.query.index || 'detail'
		};
		this.onPackUp =this.onPackUp.bind(this);
		this.handleResize=this.handleResize.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
    }
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){
            // this.detail.getTableInitData();
            this.setState({
                isDetail:true
            });
        }else if(obj.id == 'feedback' && !obj.isLoading){
            this.feedback.getPages();
        }
        DetailCommon.receivedInquiry[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
    }
    onPackUp(topnum){
		let sch=document.body.offsetHeight-80-topnum;
    	this.setState({
    		paddingTop:topnum,
				scrollHeight:sch+'px',
    	});
    };

	getEditOne = (billId,obj) => {
        if( !billId) return errorTips("数据错误!");
        this.setState({billId});
        ///receiveenquiry/getOne replace /inquiry/getOne
        apiGet(API_FOODING_ERP, '/inquiry/getOne', {
            billId: billId
        }, response => {
            this.setState({businessOne: response.data},()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            });
        }, error => {
            errorTips(error.message);
        });
    };

    getDetailData = billId => {
        this.getEditOne(billId,true);
        if (billId) {
            this.getListMtl(billId);
            this.getListSupplier(billId);
            this.getListCard(billId);
            this.getListShip(billId);
            this.getListTest(billId);
            this.getQuotList(billId);
        }
    };

    /**
     * 询盘产品
     * @param billIdid
     */
    getListMtl = billId => {
        billId = billId || this.state.businessOne.id;
        ///enquiry/mtl/getList replace /inquiry/mtl/getList
        apiGet(API_FOODING_ERP, '/inquiry/mtl/getList', {billId},
            response => {
                this.setState({productData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    /**
     * 询盘供应商
     * @param billId
     */
    getListSupplier = billId => {
        billId = billId || this.state.businessOne.id;
        ///enquiry/supplier/getList replace /inquiry/vendor/getList
        apiGet(API_FOODING_ERP, '/inquiry/vendor/getList', {billId},
            response => {
                this.setState({supplierData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    /**
     * 询盘证书
     * @param billId
     */
    getListCard = billId => {
        billId = billId || this.state.businessOne.id;
        // /enquiry/card/getList replace /inquiry/card/getList
        apiGet(API_FOODING_ERP, '/inquiry/card/getList', {billId},
            response => {
                this.setState({cardData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    /**
     * 询盘 船公司要求
     * @param billId
     */
    getListShip = billId => {
        billId = billId || this.state.businessOne.id;
        // /enquiry/ship/getList replace /inquiry/ship/getList
        apiGet(API_FOODING_ERP, '/inquiry/ship/getList', {billId},
            response => {
                this.setState({shipData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    /**
     * 询盘 检验要求
     * @param billId
     */
    getListTest = billId => {
        billId = billId || this.state.businessOne.id;
        // /enquiry/test/getList replace /inquiry/test/getList
        apiGet(API_FOODING_ERP, '/inquiry/test/getList', {billId},
            response => {
                this.setState({testData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    /**
     * 发出的报价
     * @param billId
     * */
    getQuotList = billId => {
       billId = billId  || this.state.businessOne.id;
        apiGet(API_FOODING_ERP, '/inquiryquote/getsends', {billId, isSend:true},
            response => {
                this.setState({quotData: response.data || []});
            }, error => {
                errorTips(error.message);
            });

    };

    refreshDetail = (type = 'all') => {
        let billId = this.state.billId;
        switch (type){
            case 'one':
                this.getEditOne(billId);
                break;
            case 'mtl':
                this.getListMtl(billId);
                break;
            case 'supplier':
                this.getListSupplier(billId);
                break;
            case 'card':
                this.getListCard(billId);
                break;
            case 'ship':
                this.getListShip(billId);
                break;
            case 'test':
                this.getListTest(billId);
                break;
            case "quot":
                this.getQuotList(billId);
                break;
            default:
                this.getDetailData(billId);
                break;
        }
    };

    openDialog = (title, dilogTelmp,width)=>{
        this.setState({
            showDilaog:true,
            dialogTitle: title,
            dilogTelmp: dilogTelmp,
            width:width || 926
        });
    };

    closeDialog = ()=>{
        this.setState({showDilaog:false	})
    };

    //报价 保存并不关闭按钮
    onSendSaveAndClose = () => {
        this.refreshDetail('one');
        this.refreshDetail('quot');
        this.closeDialog();
        this.feedback.pageData = {};
        this.feedback.getPages();
    };

	handleResize(){
		let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
	};
	componentDidMount(){
        let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
		// window.addEventListener('resize', this.handleResize);
        this.getDetailData(this.props.location.query.id, this.props.location.query.sourceId);
    };

	componentWillUnmount() {
    	// window.removeEventListener('resize', this.handleResize);
  	};

    componentWillReceiveProps(nextProps) {
        let billId = nextProps.location.query.id;
        let sourceId = nextProps.location.query.sourceId;
        if (billId !== this.props.location.query.id) {
            this.getDetailData(billId, sourceId);
        }
    }

	render(){
		let children=Object.assign({},this.props.children,{});
        children.props = Object.assign({}, children.props, this.state, {refreshDetail: this.refreshDetail});
		return (
			<div className='container-body'>
				<ReceivedInquiryDetailsHead  onPackUp={this.onPackUp} {...this.state} closeDialog={this.closeDialog}
                                             refreshDetail={this.refreshDetail} openDialog={this.openDialog}
                                             curentId ={this.state.curentId}
                                             id={this.state.id}  onClickLink ={this.onClickLink} onSendSaveAndClose={this.onSendSaveAndClose}
                />
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div className={this.state.curentId == 'detail' ?"":"none"}>
						<Detail {...children.props} />
					</div>
                    <div className={this.state.curentId == 'feedback' ?"":"none"}>
                        <Feedback {...children.props} feedback ={no => this.feedback = no}
                                  isDetail ={true}/>
                    </div>
			    </div>

                <Dialog visible={this.state.showDilaog} title={this.state.dialogTitle} width={this.state.width}>
                    {this.state.dilogTelmp}
                </Dialog>
			</div>
			);
	}
}
ReceivedInquiryDetailLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default ReceivedInquiryDetailLayout

