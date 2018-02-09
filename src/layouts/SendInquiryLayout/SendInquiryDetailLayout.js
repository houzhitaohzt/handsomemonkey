import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import SendInquiryDetailsHead  from '../../routes/SendInquiry/SendInquiryDetail/Header/SendInquiryDetailsHead'
import {apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS} from '../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../components/ServiceTips";//提示框

export class SendInquiryDetailLayout extends Component{
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
		};
		this.onPackUp =this.onPackUp.bind(this);
		this.handleResize=this.handleResize.bind(this);
    }

    onPackUp(topnum){
		let sch=document.body.offsetHeight-80-topnum;
    	this.setState({
    		paddingTop:topnum,
				scrollHeight:sch+'px',
    	});
    };

    getDetailData = billId => {
        if( !billId) return errorTips("数据错误!");
        this.setState({billId});
        ///sendenquiry/getOne replace /inquiry/getOne
        apiGet(API_FOODING_ERP, '/inquiry/getOne', {
            billId: billId
        }, response => {
            this.setState({businessOne: response.data});
        }, error => {
            errorTips(error.message);
        });

        if (billId) {
            this.getListMtl(billId);
            this.getListSupplier(billId);
            this.getListCard(billId);
            this.getListShip(billId);
            this.getListTest(billId);
        }
    };

    /**
     * 询盘产品
     * @param billId
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
        ///enquiry/test/getList replace /inquiry/test/getList
        apiGet(API_FOODING_ERP, '/inquiry/test/getList', {billId},
            response => {
                this.setState({testData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    refreshDetail = (type = 'all') => {
        let billId = this.state.billId;
        switch (type){
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
            default:
                this.getDetailData(billId);
                break;
        }
    };

	handleResize(){
		let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
	};
	componentDidMount(){
        let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
		window.addEventListener('resize', this.handleResize);
        this.getDetailData(this.props.location.query.id);
    };

	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize);
  	};

    componentWillReceiveProps(nextProps) {
        let billId = nextProps.location.query.id;
        if (billId !== this.props.location.query.id) {
            this.getDetailData(billId);
        }
    }

	render(){
		let children=Object.assign({},this.props.children,{});
        children.props = Object.assign({}, children.props, this.state, {refreshDetail: this.refreshDetail});
		return (

			<div className='container-body'>
				<SendInquiryDetailsHead  onPackUp={this.onPackUp} {...this.state} refreshDetail={this.refreshDetail}/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						{children}
					</div>
			    </div>
			</div>
			);
	}
}
SendInquiryDetailLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default SendInquiryDetailLayout

