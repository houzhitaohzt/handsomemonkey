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

export class PruchaseNeedModel extends Component {
    constructor(props) {
        super(props);
        this.columnSort = {column: 'billId', order: 'desc'};
        this.filterData = {};
        let that = this;
        this.columns = [{
            title: I18n.t(400009/*下单日期*/),
            dataIndex: 'billDate',
            key: "billDate",
            width: '5%',
            sort: 'billDate',
            render(data, row, index) {
                if (data) {
                    return new Date(data).Format('yyyy-MM-dd');
                }
                return '------';
            }
        }, {
            title: I18n.t(400008/*销售单号*/),
            dataIndex: "sourceNo",
            key: "sourceNo",
            width: "6%",
            sort: 'sourceNo',
            render(data, row, index) {
                if (row && row.saleAdjustOrderNo) {
                    return (<div onClick={that.numDetailHandle.bind(this, data)} className="text-ellipsis"
                                 style={{color: "red"}}>{data}</div>);
                }
                return <div onClick={that.numDetailHandle.bind(this, data)}
                            className="text-ellipsis mail-hover">{data}</div>;
            }
        }, {
            title: I18n.t(100133/*支付条款*/),
            dataIndex: "salePayTrm" + language,
            key: "salePayTrm" + language,
            width: "8%",
            sort: 'salePayTrmId',
            render(data, row, index) {
                return (<div className={'text-ellipsis'} title={data}>{data}</div>);
            }
        }, {
            title: I18n.t(400011/*销售员*/),
            dataIndex: "needStaff" + language,
            key: "needStaff" + language,
            width: "3%",
            sort: 'needStaffId',
            render(data, row, index) {
                return data;
            }
        }, {
            title: I18n.t(100379/*产品*/),
            dataIndex: "mtl" + language,
            key: "mtl" + language,
            width: "8%",
            sort: 'mtlId',
            render(data, row, index) {
                return data;
            }
        }, {
            title: I18n.t(100382/*产品规格*/),
            dataIndex: "basSpeci",
            key: "basSpeci",
            width: "8%",
            sort: 'basSpeci',
            render(data, row, index) {
                return (<div className={'text-ellipsis'} title={data}>{data}</div>);
            }
        }, {
            title: I18n.t(400012/*品牌*/),
            dataIndex: "brand" + language,
            key: "brand" + language,
            width: "3%",
            sort: 'brandId',
            render(data, row, index) {
                return data;
            }
        }, {
            title: I18n.t(100319/*采购数量*/),
            dataIndex: "purQty",
            key: "purQty",
            width: "4%",
            sort: 'purQty',
            className: 'text-right',
            render(data, row, index) {
                return <div>{data}&nbsp;&nbsp;{row.uomEnName}</div>;
            }
        }, {
            title: I18n.t(400013/*需求装运日*/),
            dataIndex: 'ariveDate',
            key: 'ariveDate',
            width: "5%",
            sort: 'ariveDate',
            className: 'text-center',
            render(data, row, index) {
                return new Date(data).Format('yyyy-MM-dd');
            }
        }, {
            title: I18n.t(400014/*送达港口*/),
            dataIndex: "statn" + language,
            key: "statn" + language,
            width: "7%",
            sort: 'statnId',
            render(data, row, index) {
                return data;
            }
        }, {
            title: I18n.t(100298/*目的港*/),
            dataIndex: "eStatn" + language,
            key: "eStatn" + language,
            width: "7%",
            sort: 'eStatnId',
            render(data, row, index) {
                return data || "";
            }
        }, {
            title: I18n.t(600164/*出运信息*/),
            dataIndex: "sourceId",
            key: "sourceId",
            width: "4%",
            sort: 'sourceId',
            render(data, row, index) {
                return (row.sourceType == 318 ? <div
                    onClick={hrefFunc.bind(that, I18n.t(600164/*出运信息*/), `/print/single?single=messagePurchase&billId=${row['sourceId']}`)}
                    style={{textAlign: 'center'}} className={'text-ellipsis'} title={I18n.t(600164/*出运信息*/)}>
                    <i className="foddingicon fooding-transport-message"></i>
                </div> : '')
            }
        }];

        this.state = {
            data: [],
            currentPage: 1,
            pageSize: 20
        }
    }

    numDetailHandle = data => {
        this.props.numDetailHandle && this.props.numDetailHandle(data);
    };

    //拉取数据
    getPage = (currentPage, order) => {
        let that = this;
        this.columnSort = order = order || this.columnSort;
        let isManageObj = {};
        isManageObj = permissionsBtn('pruchaseneed.isManager') ? Object.assign({}, isManageObj, {isManager: 1}) : {};
        let params = Object.assign({}, {
            pageSize: this.state.pageSize,
            currentPage: 1,
            orderType: 10,
            sourceNo: that.state.sourceNo
        }, isManageObj, order)
        apiGet(API_FOODING_ERP, '/purorder/getPage', params, (response) => {
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

    componentDidMount() {
        this.getPage();
    }

    componentWillUnmount() {

    }

    shouldComponentUpdate(props, state) {
        // return xt.equalsObject(state, this.state);
        return true;
    }

    //更多
    onMore = () => {
        let {navAddTab} = this.props;
        navAddTab({name: i18n.t(500278/*采购需求*/), component: i18n.t(500278/*采购需求*/), url: '/pruchaseneed/list'});
        this.props.router.push({pathname: '/pruchaseneed/list', state: {refresh: true}});
    };

    //onRefresh 拖拽单个模块刷新
    onRefresh = () => {
        this.getPage();
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
                    <span className={"drageshow"}>{i18n.t(500278/*采购需求*/)}</span>
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
                    <Table
                        ref="pruchaseneed"
                        columns={this.columns}
                        data={this.state.data || []}
                        checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
                        colorFilterConfig={{show : false,dataIndex:'colorType'}}
                        followConfig={{show:false}}
                        onHeaderSortClick={this.getPage.bind(this, null)}
                        scroll={{x:true,y:this.state.scroll}}
                    />
                </div>
            </div>
        );
    }
};

export default NavConnect(PruchaseNeedModel);
