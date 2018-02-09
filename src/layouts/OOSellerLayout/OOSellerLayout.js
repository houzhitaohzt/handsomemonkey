import i18n from './../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import Dialog  from '../../components/Dialog';
import OnlineOrderClose from '../../routes/OnlineOrderSeller/OnlineOrderSeller/components/onlineOrderClose'// 关闭
import OnlineOrderSellerDetailsHead from '../../routes/OnlineOrderSeller/OnlineOrderSellerDetail/Header/OnlineOrderSellerDetailsHead';
import {apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS} from '../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../components/ServiceTips";//提示框
export class OOBuyerLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			billId: null,
			paddingTop:226,
			businessOne: {},
            productData: [],
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
        ///nooorder/getOne replace /inquiryorder/getOne
        apiGet(API_FOODING_ERP, '/inquiryorder/getOne', {
           id : billId
        }, response => {
            this.setState({businessOne: response.data});
        }, error => {
            errorTips(error.message);
        });

        if (billId) {
            this.getListMtl(billId);
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
        billId = billId || this.state.businessOne.billId;
        // /nooorder/mtl/getList replace /inquiryorder/mtl/getList
        apiGet(API_FOODING_ERP, '/inquiryorder/mtl/getList', {billId},
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
        ///nooorder/card/getList replace /inquiryorder/card/getList
        apiGet(API_FOODING_ERP, '/inquiryorder/card/getList', {billId},
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
        // /nooorder/pakg/getList replace /inquiryorder/ship/getList
        apiGet(API_FOODING_ERP, '/inquiryorder/ship/getList', {billId},
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
        ///nooorder/test/getList replace /inquiryorder/test/getList
        apiGet(API_FOODING_ERP, '/inquiryorder/test/getList', {billId},
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
    onCloseBusinessCancel = () => {
        this.setState({ visible: false});
    };

    onCloseBusinessSave = () => {
        this.setState({ visible: false});
        this.refreshDetail();
    };

    closeClick = ()=>{
        let {businessOne} = this.state;
        this.setState({
            visible: true,
            title: i18n.t(500109/*关闭订单*/),
            dialogContent: <OnlineOrderClose onSaveAndClose={this.onCloseBusinessSave} onCancel={this.onCloseBusinessCancel} otherData={businessOne}/>
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
		 let {businessOne, productData, cardData, testData, shipData} = this.state;
		let children=Object.assign({},this.props.children,{});
		children.props =Object.assign({},children.props, {comp: this, paddingTop: this.state.paddingTop, businessOne: businessOne, productData, cardData, testData, shipData}, {refreshDetail: this.refreshDetail});
		return (

			<div className='container-body'>
				<OnlineOrderSellerDetailsHead  onPackUp={this.onPackUp}  businessOne={businessOne} comp={this} refreshDetail={this.refreshDetail}/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						{children}
					</div>
			    </div>
			    <Dialog visible={this.state.visible} title={this.state.title} width={926}>
                    {this.state.dialogContent}
                </Dialog>
			</div>
			);
	}
}
OOBuyerLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default OOBuyerLayout

