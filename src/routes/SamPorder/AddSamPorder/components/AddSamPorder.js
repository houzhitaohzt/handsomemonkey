import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import {createForm} from '../../../../components/Form';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import Confirm from "../../../../components/Dialog/Confirm"; //删除弹层
import {API_FOODING_ERP, apiGet, apiPost} from '../../../../services/apiCall';
import {errorTips} from "../../../../components/ServiceTips"; //提示框
import AddNormal from "./AddNormal";
import Organ from "./Organ";
import Require from "./Require";
import Finance from "./Finance";
import {navRemoveTab} from "../../../../components/NavigateTabs/modules/tabs";

const {Table} = require("../../../../components/Table");

export class ActivityDetail extends Component {
    constructor(props) {
        super(props);
        this.backClick = this.backClick.bind(this);
        this.state = {
            productData: [],
            businessOne: {},
            paddingTop: 0,
            scroll: 0,
            data: []
        }
    }

    handleResize(height) {
        this.setState({
            // paddingTop: !this.state.paddingTop
        });
        let padding = 100;
        let sch = document.body.offsetHeight - height - padding;
        let scroll = sch - 105;

        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }

    componentDidMount() {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
        this.getEditOne(this.props.location.query.id, this.props.location.query.cid);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }

    componentWillReceiveProps(nextProps) {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));

        let billId = nextProps.location.query.id;
        let salBeId = nextProps.location.query.cid;
        if (billId !== this.props.location.query.id || salBeId !== this.props.location.query.cid) {
            this.getEditOne(billId, salBeId);
        }
    }

    backClick() {
        let {navReplaceTab} = this.props;
        let billId = this.props.location.query.id;
        let cid = this.props.location.query.cid;
        if(cid){
            window.navTabs.close();
            // navReplaceTab({name:i18n.t(200169/*客户详情*/),component:i18n.t(200169/*客户详情*/),url:'/client/sample-list'});
            // this.props.router.push({pathname: '/client/sample-list', query: {id: cid}});
        } else {
            if(billId){
                navReplaceTab({name:i18n.t(200170/*销售样品单详情*/),component:i18n.t(200170/*销售样品单详情*/),url:'/samporder/detail'});
                this.props.router.push({pathname: '/samporder/detail', query: {id: billId}});
            } else {
                navReplaceTab({name:i18n.t(200171/*销售样品单*/),component:i18n.t(200171/*销售样品单*/),url:'/SamPorder/list'});
                this.props.router.push({pathname: '/SamPorder/list'});
            }
        }

    }

    saveClick = ()=>{
        this.onSaveNormal();
    };

    onSaveNormal = callback => {
        let businessOne = this.state.businessOne;
        if (businessOne.billId && callback) return callback(null, businessOne);
        let that = this;
        const {form} = this.props;
        form.validateFields((error, values) => {
            if (!error) {
                let param = Object.assign({}, businessOne, values);
                apiPost(API_FOODING_ERP, '/specimen/save', param,
                    response => {
                        param.billId = response.data;
                        let cancel = ()=>{
                            this.props.router.push({
                                pathname: this.props.router.location.pathname,
                                query: {...this.props.router.location.query, id: param.billId},
                                state: {refresh: false}
                            } );
                            param.optlock++;
                            this.setState({businessOne: param},()=>{
                              that.getEditOne(param.billId,param.salBeId);
                            });
                        };
                        let done = ()=>{
                            let name = i18n.t(200170/*销售样品单详情*/);
                            this.props.navReplaceTab({name: name, component: name, url: '/samporder/detail'});
                            this.props.router.push({pathname: '/samporder/detail', query: {id: param.billId}});
                        };
                        if(callback){
                            cancel();
                            callback && callback(null, param);
                        } else {
                            Confirm(i18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5, cancel, done  });
                        }
                    }, error => {
                        (callback && callback(error.message)) || errorTips(error.message);
                    })
            }
        });
    };

    getListMtl = billId =>{
        billId = billId || this.state.businessOne.billId;
        apiGet(API_FOODING_ERP, '/specimen/mtl/getList', {billId},
            response => {
                this.setState({productData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    getEditOne = (billId, salBeId) => {
        apiGet(API_FOODING_ERP, '/specimen/getOne', {
            billId: billId, salBeId: salBeId
        }, response => {
            this.setState({businessOne: response.data});
        }, error => {
            errorTips(error.message);
        });
        if(billId){
            this.getListMtl(billId);
        }
    };

    render() {

        return (
            <div className='activity-detail scroll' style={{height: this.state.scrollHeight}}>
                <AddNormal businessOne={this.state.businessOne}
                           form={this.props.form}
                           saveClick={this.saveClick}
                           backClick={this.backClick}
                           location={this.props.location}
                />
                <Require data={this.state.productData} refreshMtl={this.getListMtl} businessOne={this.state.businessOne} onSaveNormal={this.onSaveNormal}/>
                <Finance form={this.props.form}  businessOne={this.state.businessOne}/>
                <Organ form={this.props.form}  businessOne={this.state.businessOne}/>
            </div>
        );

    }

}

export default NavConnect(createForm()(ActivityDetail));
