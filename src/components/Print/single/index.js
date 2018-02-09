import React, {PropTypes, Component} from "react";
import i18n from '../../../lib/i18n';

import {getQueryString, apiGet, apiPost, apiForm, API_FOODING_ERP, language, pageSize, sizeList} from '../../../services/apiCall';
import xt from "../../../common/xt";

import ServiceTips from '../../ServiceTips'; // tip

import MessageFlow from "./messageFlow.js"; // 订单信息确认表-物流
import MessagePurchase from "./messagePurchase.js"; // 订单信息确认表-采购




export default class SinglePage extends Component {

    constructor(props) {
        super(props);

        // init state
        this.state = {
            active: 'page',    // 切换 页面
            getOneData: {}, // 单条数据
        };
    }

	componentDidMount(){
        this.getPage();
    };

    getPage = ()=>{
        let param = xt.parseQueryParameter(window.location.href);
        let that = this;

        switch (param['single']) {
            case 'messageFlow': // 订单信息确认表-物流
                var URL = '/orderaffirmshipping/getOne';
                break;
            case 'messagePurchase': // 订单信息确认表-物流
                var URL = '/orderaffirmpurorder/getOne';
                break;        
            default:
                return;
        }

        apiGet(API_FOODING_ERP, URL, Object.assign({billId:param['billId']}),
            (response) => {
                that.setState({
                    getOneData: response['data'],
                    active: param['single']
                });
            }, (errors) => {
                ServiceTips({text: errors.message, type: 'error'});
        });        
    }

    render(){
        let {getOneData,active} = this.state;


        // 判断页面 
        switch (active) {
            case 'messageFlow':
                var HTML = <MessageFlow getOneData={getOneData}/>;
                break;
            case 'messagePurchase':
                var HTML = <MessagePurchase getOneData={getOneData}/>;
                break;        
            default:
                var HTML = <i></i>;            
                break;
        }

        return active ? HTML : <i></i>;
    }
}