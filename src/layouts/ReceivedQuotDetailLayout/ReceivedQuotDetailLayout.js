import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import ReceivedQuotDetailsHead  from '../../routes/ReceivedQuotation/ReceivedQuotationDetail/Header/ReceivedQuotDetailsHead'
import {apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS} from '../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../components/ServiceTips";//提示框

import DetailCommon from  '../../common/DetailCommon';
import Detail from  '../../routes/ReceivedQuotation/ReceivedQuotationDetail/Content/components/ReceivedQuotationDetail';
import Feedback from  '../../routes/SendQuotation/FeedbackInformation/components/FeedbackInformation';
export class ReceivedQuotDetailLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
            billId: null,
            enquiryId: null,
            paddingTop: 226,
            businessOne: {},
            productData: [],
            supplierData: [],
            cardData: [],
            shipData: [],
            testData: [],
            curentId:DetailCommon.ReceivedQuot[this.props.location.query.id] ||  this.props.location.query.index  || 'detail'
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
        DetailCommon.ReceivedQuot[this.props.location.query.id] = obj.id;
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
        ///nooquotation/getOne replace /inquiryquote/getOne
        apiGet(API_FOODING_ERP, '/inquiryquote/getOne', {
            billDtlId: billId
        }, response => {
            let enquiryId = response.data.enquiryId;
            this.setState({businessOne: response.data, enquiryId},()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            });
            if (enquiryId) {
                this.getListCard(enquiryId);
                this.getListShip(enquiryId);
                this.getListTest(enquiryId);
            }
        }, error => {
            errorTips(error.message);
        });
        this.getListMtl(billId);
    };

    getDetailData = (billId,obj) => {
        this.getEditOne(billId,obj);
    };

    /**
     * 询盘产品
     * @param billId
     */
    getListMtl = billId => {
        billId = billId || this.state.businessOne.billId;
        apiGet(API_FOODING_ERP, '/nooquotation/mtl/getList', {billId},
            response => {
                this.setState({productData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    /**
     * 询盘证书
     * @param billId
     */
    getListCard = billId => {
        billId = billId || this.state.businessOne.billId;
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
        billId = billId || this.state.businessOne.billId;
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
        billId = billId || this.state.businessOne.billId;
        ///enquiry/test/getList replace /inquiry/test/getList
        apiGet(API_FOODING_ERP, '/inquiry/test/getList', {billId},
            response => {
                this.setState({testData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    refreshOne = (billId)=>{
        // ///nooquotation/getOne replace /inquiryquote/getOne
        apiGet(API_FOODING_ERP, '/inquiryquote/getOne', {
            billDtlId: billId
        }, response => {
            this.setState({businessOne: response.data});
        }, error => {
            errorTips(error.message);
        });
    };

    refreshDetail = (type = 'all') => {
        let billId = this.state.billId;
        let enquiryId = this.state.enquiryId;
        switch (type){
            case 'one':
                this.refreshOne(billId);
                break;
            case 'mtl':
                this.getListMtl(billId);
                break;
            case 'supplier':
                this.getListSupplier(enquiryId);
                break;
            case 'card':
                this.getListCard(enquiryId);
                break;
            case 'ship':
                this.getListShip(enquiryId);
                break;
            case 'test':
                this.getListTest(enquiryId);
                break;
            default:
                this.getEditOne(billId);
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
		// window.addEventListener('resize', this.handleResize);
        this.getDetailData(this.props.location.query.id,true);
    };

	componentWillUnmount() {
    	// window.removeEventListener('resize', this.handleResize);
  	};

    componentWillReceiveProps(nextProps) {
        let billId = nextProps.location.query.id;
        if (billId !== this.props.location.query.id) {
            this.getDetailData(billId);
        }
    }

	render(){
		let children=Object.assign({},this.props.children,{});
        children.props = Object.assign({
            productRef: rf => this.productRef = rf
        }, children.props, this.state, {refreshDetail: this.refreshDetail});
		return (

			<div className='container-body'>
				<ReceivedQuotDetailsHead getProductRef={()=>this.productRef}
                                         curentId ={this.state.curentId}
                                         id={this.state.id}  onClickLink ={this.onClickLink}
                                         onPackUp={this.onPackUp} {...this.state} refreshDetail={this.refreshDetail}/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
                        <div className={this.state.curentId == 'detail' ?"":"none"}>
                            <Detail {...children.props} />
                        </div>
                        <div className={this.state.curentId == 'feedback' ?"":"none"}>
                            <Feedback {...children.props} feedback ={no => this.feedback = no}
                                      isDetail ={true}/>
                        </div>
					</div>
			    </div>
			</div>
			);
	}
}
ReceivedQuotDetailLayout.propTypes = {
  children : React.PropTypes.element.isRequired
};

export default ReceivedQuotDetailLayout

