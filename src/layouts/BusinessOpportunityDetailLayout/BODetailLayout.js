import i18n from './../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Dialog  from '../../components/Dialog';
import CloseBusiness from '../../routes/Client/Business/List/components/CloseBusiness'// 关闭商机
import Approval from "../../routes/Client/Business/List/components/Approval"; // 查看审批
import Header from '../../components/Header'
import BusinessOpportunityHeader from '../../routes/BusinessOpportunity/Detail/Header/BODetailHeader'
import {apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS} from '../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../components/ServiceTips";//提示框
import SaleBusiness from './SaleBusiness';

import DetailCommon from  '../../common/DetailCommon';

import Detail from  '../../routes/BusinessOpportunity/Detail/Content/components/BusinessOpportunityDetail';
import Sample from  '../../routes/BusinessOpportunity/Sample/components/SampleList';
import Price  from  '../../routes/BusinessOpportunity/Price/components/BODetailPrice';
import SalesOrder from  '../../routes/BusinessOpportunity/SalesOrder/components/BODetailSalesOrder';
import Email from  '../../routes/BusinessOpportunity/Email/components/Email';
import Contact from  '../../routes/BusinessOpportunity/Connect/components/BusinOppoContact';
import Date   from  '../../routes/BusinessOpportunity/Date/components/BusinOppoDate';
import Accessory from  '../../routes/BusinessOpportunity/Attachment/components/Accessory';
import Annotation from  '../../routes/BusinessOpportunity/Annotation/components/Annotation';
export class BusinessOpportunityLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paddingTop: 226,
            businessOne: {},
            productData: [],
            preferData: {},
            profitData: [],
            saleData: [],
            value:{},
            curentId: DetailCommon.businessOpportunity[this.props.location.query.id]||this.props.location.query.index || 'detail'
        };
        this.onPackUp = this.onPackUp.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
    }
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){

        }else if(obj.id == 'sample' && !obj.isLoading){
            this.sample.getPages();
        }else if(obj.id == 'price' && !obj.isLoading){
            this.price.getPage();
        }else if(obj.id == 'salesOrder' && !obj.isLoading){
            this.salesOrder.getPage();
        }else if(obj.id == 'email' && !obj.isLoading){
            this.email.getPage();
        }else if(obj.id == 'contact' && !obj.isLoading){
            this.contact.getPage();
        }else if(obj.id == 'date' && !obj.isLoading){
            this.date.getPage();
        }else if(obj.id == 'accessory' && !obj.isLoading){
            this.accessory.getPage();
        }else if(obj.id == 'annotation' && !obj.isLoading){
            this.annotation.getPage();
        }
        DetailCommon.businessOpportunity[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
    }
    onPackUp(topnum) {
        let sch = document.body.offsetHeight - 80 - topnum;
        this.setState({
            paddingTop: topnum,
            scrollHeight: sch + 'px',
            visible: false,
            dialogTitle: '',
            dilogTelmp: <div></div>,
        });
    };

    getPreferOne = billId => {
        apiGet(API_FOODING_ERP, '/userprefer/getList', {billIds: billId, billType: 301},
            response => {
                this.setState({businessOne: Object.assign({}, this.state.businessOne, response.data[0] || {})});
            }, error => {
                errorTips(error.message);
            });
    };

    getDetailData = (billId,obj) => {
        if( !billId) return errorTips("数据错误!");

        apiGet(API_FOODING_ERP, '/business/getOne', {
            billId: billId
        }, response => {
            this.setState({businessOne: response.data,value:response.data},()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            });
            if(this.state.curentId == 0) {
                this.getPreferOne(response.data.billId);
            }

        }, error => {
            errorTips(error.message);
        });
        if(this.state.curentId == 0){
            apiGet(API_FOODING_ERP, '/business/team/getList', {billId},
                response => {
                    this.setState({saleData: response.data});
                }, error => {
                    errorTips(error.message);
                });

            apiGet(API_FOODING_ERP, '/business/linker/getList', {billId},
                response => {
                    this.setState({profitData: response.data});
                }, error => {
                    errorTips(error.message);
                });

            apiGet(API_FOODING_ERP, '/business/mtl/getList', {billId},
                response => {
                    this.setState({productData: response.data});
                }, error => {
                    errorTips(error.message);
                });
        }

    };

    refreshDetail = ()=> {
        this.getDetailData(this.props.location.query.id);
    };

    onCloseBusinessCancel = () => {
        this.setState({ visible: false});
    };

    onCloseBusinessSave = () => {
        this.setState({ visible: false});
        this.refreshDetail();
    };
    /**
     * 生成销售订单
     */
    createSaleOrder = ()=>{
        let rowData = [];
        let that = this;
        if(this.product) rowData = this.product.dataTable.getSelectArr();
        console.log(rowData);
        let msg = i18n.t(201271/*是否把所有的产品数据生成销售订单?*/);
        let billMtlIds = [];
        if( rowData.length) {
            msg = i18n.t(201272/*是否把选中的 %s条 产品数据生成销售订单?*/, rowData.length);
            billMtlIds = rowData.map(da => da.billDtlId);
        }
        this.setState({
            visible: true,
            title: msg,
            dialogContent: <SaleBusiness onSaveAndClose={this.onCloseBusinessSave}
              onCancel={this.onCloseBusinessCancel}
              router ={this.props.router}
              businessOne ={this.state.businessOne}
              billMtlIds = {billMtlIds}
            />
        })

    };
    onApprovalSave = () => {
        this.setState({
            visible: false
        })
    };

    onApprovalCancel = ()=> {
        this.setState({
            visible: false
        })
    };

    onCloseBusiness = ()=>{
        let {businessOne} = this.state;
        this.setState({
            visible: true,
            title: i18n.t(200257/*关闭商机*/),
            dialogContent: <CloseBusiness onSaveAndClose={this.onCloseBusinessSave} onCancel={this.onCloseBusinessCancel} otherData={businessOne}/>
        })
    };

    onLookApproval = ()=>{
        let {businessOne} = this.state;
        this.setState({
            visible: true,
            title: i18n.t(100470/*查看审批*/),
            dialogContent: <Approval dataOne={businessOne} onSaveAndClose={this.onApprovalSave} onCancel={this.onApprovalCancel}/>
        })
    };


    handleResize() {
        let sch = document.body.offsetHeight - this.state.paddingTop;
        this.setState({scrollHeight: sch + 'px'});
    };

    componentDidMount() {
        let sch = document.body.offsetHeight - this.state.paddingTop;
        this.setState({scrollHeight: sch + 'px'});
        window.addEventListener('resize', this.handleResize);
        this.getDetailData(this.props.location.query.id,true);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    };

    componentWillReceiveProps(nextProps) {
        // let billId = nextProps.location.query.id;
        // if (billId !== this.props.location.query.id) {
        //     this.getDetailData(billId);
        // }
    }

    render() {
        let {businessOne, productData, profitData, saleData} = this.state;
        let children = Object.assign({}, this.props.children, {});
        let newProps = Object.assign({}, children.props, {comp: this,
            paddingTop: this.state.paddingTop, businessOne: businessOne,
            productData, profitData, saleData,value:this.state.value});
        children.props = newProps;
        return (

            <div className='container-body'>
                <BusinessOpportunityHeader onPackUp={this.onPackUp} businessOne={businessOne} comp={this}
                                           curentId ={this.state.curentId}
                                           onClickLink ={this.onClickLink}
                ref='Header'/>
                <div className={'detail-layout__viewport'} style={{paddingTop: this.state.paddingTop}}>
                    <div>
                        <div className={this.state.curentId == 'detail' ?"":"none"}>
                            <Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
                        </div>
                        <div className={this.state.curentId == 'sample' ?"":"none"}>
                            <Sample {...newProps} sample ={no => this.sample = no} isDetail ={true} />
                        </div>
                        <div className={this.state.curentId == 'price' ?"":"none"}>
                            <Price {...newProps} price ={no => this.price = no} isDetail ={true} />
                        </div>
                        <div className={this.state.curentId == 'salesOrder' ?"":"none"}>
                            <SalesOrder {...newProps} salesOrder ={no => this.salesOrder = no} isDetail ={true} />
                        </div>
                        <div className={this.state.curentId == 'email' ?"":"none"}>
                            <Email {...newProps} email ={no => this.email = no} isDetail ={true} />
                        </div>
                        <div className={this.state.curentId == 'contact' ?"":"none"}>
                            <Contact {...newProps} contact ={no => this.contact = no} isDetail ={true} />
                        </div>
                        <div className={this.state.curentId == 'date' ?"":"none"}>
                            <Date {...newProps} date ={no => this.date = no} isDetail ={true} />
                        </div>
                        <div className={this.state.curentId == 'accessory' ?"":"none"}>
                            <Accessory {...newProps} accessory ={no => this.accessory = no} isDetail ={true} />
                        </div>
                        <div className={this.state.curentId == 'annotation' ?"":"none"}>
                            <Annotation {...newProps} annotation ={no => this.annotation = no} isDetail ={true} />
                        </div>
                    </div>
                </div>
                <Dialog visible={this.state.visible} title={this.state.title} width={926}>
                    {this.state.dialogContent}
                </Dialog>
            </div>
        );
    }
}
BusinessOpportunityLayout.propTypes = {
    children: React.PropTypes.element.isRequired
}

export default BusinessOpportunityLayout
