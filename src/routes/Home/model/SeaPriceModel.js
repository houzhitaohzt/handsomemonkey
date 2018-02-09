import i18n, {I18n} from './../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import NavConnect from "../../../components/NavigateTabs/containers/AddContainer";
import Table from "../../../components/Table"; //Table表格

//引入提示
import ServiceTips, {errorTips, successTips} from "../../../components/ServiceTips"; //提示框
import {
    apiGet, apiPost, apiForm, API_FOODING_ES,hrefFunc,permissionsBtn,
    API_FOODING_ERP, API_FOODING_DS, pageSize, sizeList, toDecimal, language
} from "../../../services/apiCall";
import xt from "../../../common/xt";
import WebData from '../../../common/WebData';
import Dialog from '../../../components/Dialog/Dialog';//弹层
import Checkbox from '../../../components/CheckBox';

export class SeaPriceModel extends Component {
    constructor(props) {
        super(props);
        this.columnSort = {column: 'billId', order: 'desc'};
        this.filterData = {};
        this.state = {
            data: [],
            currentPage: 1,
            pageSize: 20,
            seaMeasure:[],
            seaBox:[],
            getTermModes:{},
        }
    }

    //拉取数据
    getPage = (currentPage, order) => {
        let that = this;
        this.columnSort = order = order || this.columnSort;
        let params = Object.assign({}, {
            pageSize: this.state.pageSize,
            currentPage: 1,
            isPlatform: true,
            type: 10,
        });
        apiGet(API_FOODING_ERP, '/termsfreight/cc/getPage', params, (response) => {
            this.setState({
                data: response.data.data,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                totalRecords: response.data.totalRecords
            })
        }, (error) => {
            ServiceTips({text: error.message, type: 'error'});
        });
    };

    getXiang = () => {
        var that = this;
        apiGet(API_FOODING_ERP,'/common/getTermModes',{},(response)=>{
            that.setState({
                seaMeasure:response.data.seaMeasure,
                seaBox:response.data.seaBox,
                getTermModes:response.data
            });
        },(error)=>{

        })
    };

    componentDidMount() {
        this.getPage();
        this.getXiang();
    }

    componentWillUnmount() {

    }

    shouldComponentUpdate(props, state) {
        return true;
    }

    //更多
    onMore = () => {
        let {navAddTab} = this.props;
        navAddTab({name: i18n.t(500286/*企业海运报价*/), component: i18n.t(500286/*企业海运报价*/), url: '/seaPrice'});
        this.props.router.push({pathname: '/seaPrice', state: {refresh: true}});
    };

    //onRefresh 拖拽单个模块刷新
    onRefresh = () => {
        this.getPage();
        this.getXiang();
    };

    //onDrageEdit 拖拽编辑
    onDrageEdit = () => {
        let {onDrageEdit, laysingle} = this.props;
        onDrageEdit && onDrageEdit(laysingle)
    };

    //onDrageDelete 单个模块删除
    onDrageDelete = () => {
        let {onDrageDelete, laysingle} = this.props;
        onDrageDelete && onDrageDelete(laysingle)
    };

    render() {
        return (
            <div className="dragesingle">
                <div className={"dragetitle"}>
                    <span className={"drageshow"}>{i18n.t(500284/*海运运价*/)}</span>
                    <span className="dragehandle"></span>
                    <span className={"dragemore"} onClick={this.onMore}>{i18n.t(200634/*更多*/)} &gt;</span>
                    <span className={"drageaction"}>
                        <i className={"foddingicon fooding-sd-icon2"}></i>
                        <span className="action">
                            <span onClick={this.onRefresh}><i className={"foddingicon fooding-update"}></i>&nbsp;&nbsp;{i18n.t(400046/*刷新*/)}</span>
                            <span onClick={this.onDrageEdit}><i className={"foddingicon fooding-alter_icon2"}></i>&nbsp;&nbsp;{i18n.t(100439/*编辑*/)}</span>
                            <span onClick={this.onDrageDelete}><i className={"foddingicon fooding-delete-icon4"}></i>&nbsp;&nbsp;{i18n.t(100437/*删除*/)}</span>
                        </span>
                    </span>
                </div>
                <div className={"dragecontent"} style={{height:Number(this.props.rowHeight + 10) * Number(this.props.laysingle.h) - 50 + "px"}}>
                    <div className="train-action-buttons" >
                    {
                        this.state.data.map((dataItem,i)=>{
                            return(
                                <div className="train" key={i}>
                                    <div className="top">
                                        <span style={{flex:2,color:'#5594ea',marginLeft:'19px'}}>{dataItem["sStatn"+language]}-{dataItem["eStatn"+language]}</span>
                                        <span style={{flex:1,color:'#3d495a'}}>{dataItem["lsBe"+language]}</span>
                                        { dataItem.reStatus ? <span style={{flex:3,color:'#3d495a'}}>{dataItem["reCc" + language]}</span> : <span style={{flex:3,color:'#3d495a'}}>{dataItem["forBe" + language]}</span>}
                                        <span style={{flex:2,color:'#3d495a'}}><span style={{marginRight:'20px'}}>{i18n.t(100286/*生效日期*/)}</span>{new Date(dataItem["sDate"]).Format("yyyy-MM-dd")}</span>
                                        <span style={{flex:2,color:'#3d495a'}}><span style={{marginRight:'20px'}}>{i18n.t(100287/*失效日期*/)}</span>{new Date(dataItem["eDate"]).Format("yyyy-MM-dd")}</span>
                                        <span style={{flex:1,color:'#3d495a'}}>{dataItem["reStatusName"]}</span>
                                    </div>
                                    <div className="bottom">
									<span style={{flex:2,color:'#5594ea',marginLeft:'50px'}}>
										<span style={{paddingRight:'20px'}}>{i18n.t(201093/*船期*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["shipdate"]}</span>
									</span>
                                        <span style={{flex:2,color:'#5594ea'}}>
										<span style={{marginRight:'20px'}}>{i18n.t(300049/*航程(天)*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
                                        <span style={{flex:2,color:'#5594ea'}}>
										<span style={{marginRight:'20px'}}>{i18n.t(100284/*币种*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["cny"+language]}</span>
									</span>
                                        <span style={{color:'#5594ea',flex:5}}>
									<span style={{marginRight:'10px'}}>{i18n.t(100295/*整箱价*/)}</span>
                                            {
                                                this.state.seaBox.map((e,i)=>{
                                                    if(dataItem.prices[e.id]){
                                                        return <span style={{color:'#f33535',marginRight:'30px'}} key={i}>{e.localName}/{toDecimal(dataItem.prices[e.id])}</span>
                                                    }
                                                })
                                            }
									</span>
                                        <span style={{color:'#5594ea',flex:3}}>
										<span style={{marginRight:'10px'}}>{i18n.t(100296/*拼箱价*/)}</span>
                                            {
                                                this.state.seaMeasure.map((e,k)=>{
                                                    let price = dataItem.prices[e.id] || "";
                                                    let lb = String(e.localName + "/" + toDecimal(price));
                                                    if(dataItem.prices[e.id]){
                                                        return <span style={{color:'#f33535',marginRight:'30px'}} key={k}>{lb}</span>
                                                    }
                                                })
                                            }
									</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
            </div>
        );
    }
};

export default NavConnect(SeaPriceModel);
