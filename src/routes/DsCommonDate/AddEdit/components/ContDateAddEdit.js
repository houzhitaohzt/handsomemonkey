import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import Measurement from '../../../../components/RuleTemplate';
//引入常规
import AddNormal from "./AddNormal";
//引入组织
import ContDateOrigization from "./ContDateOrigization";

import MeasureCommon from '../../../../components/RuleTemplate';

import Dialog from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_ERP,
    API_FOODING_DS,
    API_FOODING_OA,
    language,
    pageSize,
    sizeList
} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import {createForm, FormWrapper} from "../../../../components/Form";
import WebData from '../../../../common/WebData';

import {I18n} from "../../../../lib/i18n";
/*客户 typeNumber = 10 dataType = 100
供应商 typeNuber = 20 dataType = 120
服务机构 typeNumber = 30 dataType = 140
市场活动 typeNumber = 40 
商机 typeNumber = 50
销售订单 typeNumber = 60
采购订单 typeNumber = 70
订舱单 typeNumber = 80
货代 typeNumber = 90 dataType = 130
供应商联系人 typeNumber = 100 dataTypeId = 120
服务机构联系人 typeNumber = 110 dataTypeId = 140
客户联系人 typeNumber = 120 dataTypeId = 100
货代联系人 typeNumber = 130 dataTypeId = 130
*/

let salBeEditArr = {
    '10': I18n.t(100311/*客户*/),
    '20': I18n.t(100312/*供应商*/),
    '30': I18n.t(100313/*服务机构*/),
    '40': I18n.t(100311/*客户*/),
    '50': I18n.t(100311/*客户*/),
    '60': I18n.t(100311/*客户*/),
    '70': I18n.t(100312/*供应商*/),
    '80': I18n.t(100299/*货代公司*/),
    '90': I18n.t(100299/*货代公司*/),
    '100': I18n.t(100312/*供应商*/),
    '110': I18n.t(100313/*服务机构*/),
    '120': I18n.t(100311/*客户*/),
    '130': I18n.t(100299/*货代公司*/)
}
let dataTypeArr = {
    '10': 100,
    '20': 120,
    '30': 140,
    '40': 100,
    '50': 100,
    '60': 100,
    '70': 120,
    '80': 130,
    '90': 130,
    '100': 120,
    '110': 140,
    '120': 100,
    '130': 130
}

export class ActivityAddEdit extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.state = {
            visible: false,
            dialogTitle: '',
            dilogTelmp: <div></div>,
            paddingTop: 0,
            scroll: 0,
            commonData: {}, //每次请求获取新的数据
            businessMtlList: [],
            inputValue: ""
        }
    }

    handleResize(height) {
        let padding = 80;
        let sch = document.body.offsetHeight - height - padding;
        let scroll = sch - 135;
        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }

    //列表删除操作
    handleClick = (e, data, Template) => {
        let that = this;
        if (data.number == 2) {
            let id = [], tempString = I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
            id = (data && data.record) ? [data.record.id] : data.selectArr.map((o) => o.id);
            if (!(data && data.record || data.selectArr.length == 1)) {
                tempString = I18n.t(100395/*已选中*/) + data.selectArr.length + I18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
            }
            Confirm(tempString, {
                done: () => {
                    if (data.id == "commonList") {
                        apiForm(API_FOODING_OA, '/activity/businessMtl/deletes', {id: id}, response => {
                            ServiceTips({text: response.message, type: 'success'});
                            that.initProductData(that.state.commonData.id || undefined);
                        }, error => ServiceTips({text: error.message, type: 'error'}))
                    }
                },
                close: () => {

                }
            });
        } else {
            let dialogTitle = data.action + data.name.title;
            this.setState({
                visible: true,
                dialogTitle: dialogTitle,
                dilogTelmp: Template
            });
        }
    }
    //约会目的的点击事件
    onTableClick = data => {
        this.setState({inputValue: data});
    }
    onSaveAndClose = values => {
        this.setState({visible: false}, () => {
            this.initProductData(this.state.commonData.id || undefined)
        });
    }
    onCancel = () => {
        this.setState({visible: false});
    }

    //进入新增或编辑页面时进行初始化
    getData = () => {
        let scheduleId = this.props.location.query.scheduleId || "";
        apiGet(API_FOODING_OA, '/activity/getOne', {id: scheduleId}, (response) => {
            let sessionObject = WebData.user.data, newObject;
            if (!scheduleId) {
                newObject = Object.assign({}, response.data, {
                    clusterId: sessionObject.clusters[0].id,
                    clusterEnName: sessionObject.clusters[0].name,
                    clusterLcName: sessionObject.clusters[0].localName,
                    ccId: sessionObject.companies[0].id,
                    ccEnName: sessionObject.companies[0].name,
                    ccLcName: sessionObject.companies[0].localName,
                    responsibleOfficerId: sessionObject.staffId,
                    responsibleOfficerEnName: sessionObject.staffEnName,
                    responsibleOfficerLcName: sessionObject.staffName
                });
            } else {
                newObject = Object.assign({}, response.data);
            }
            this.setState({
                commonData: newObject,
                inputValue: response.data && response.data.respond || ""
            })
        }, (error) => {
            ServiceTips({text: error.message, type: 'error'});
        })
    }
    //初始化 产品列表数据
    initProductData = scheduleId => {
        //scheduleId 商机id
        if (!scheduleId) return;
        apiGet(API_FOODING_OA, "/activity/businessMtl/getList", {activityId: scheduleId}, response => {
            this.setState({businessMtlList: response.data || []})
        }, error => ServiceTips({text: error.message, type: 'error'}))
    }
    //新增之前判断有没有保存？保存编辑函数
    addBeforeSaveClick = callback => {
        let commonData = this.state.commonData;
        if (commonData.id && callback) return callback(null, commonData.id);

        const {form} = this.props;
        form.validateFields((error, value) => {
            if (error) {
                callback(I18n.t(500211/*主表信息不完善!*/))
            } else {
                let param = this.props.form.getFieldsValue();
                param = Object.assign({}, param, {
                    respond: this.state.inputValue,
                    customerParticipantIds: param.customerParticipantIds.toString(),
                    participantIds: param.participantIds.toString(),
                    activityType: this.props.location.query.activityType || ""
                })
                apiPost(API_FOODING_OA, '/activity/save', param, response => {
                    param.id = response.data;
                    let oldQuery = this.props.location.query;
                    let newQuery = Object.assign({}, oldQuery, {scheduleId: param.id});
                    this.props.router.push({pathname: '/commondate/edit', query: newQuery, state: {refresh: false}});
                    this.setState({commonData: param})
                    callback(null, param.id);
                }, error => {
                    callback(error.message)
                })
            }
        })
    }
    //右上保存 保存就跳转页面
    saveClick = () => {
        let that = this;
        const {form} = that.props;
        form.validateFields((error, value) => {
            if (error) {

            } else {
                // if(this.state.businessMtlList.length == 0){
                // 	ServiceTips({text:I18n.t(400003/*请填写产品列表*/),type:'info'});
                // 	return false;
                // }
                if (this.state.inputValue == "") {
                    ServiceTips({text: I18n.t(500208/*请选择约会目的!*/), type: 'error'});
                    return false;
                }
                let param = this.props.form.getFieldsValue();
                param = Object.assign({}, param, {
                    respond: this.state.inputValue,
                    customerParticipantIds: param.customerParticipantIds.toString(),
                    participantIds: param.participantIds.toString(),
                    activityType: this.props.location.query.activityType || ""
                })
                let valueone = Object.assign({}, this.state.commonData, param);
                apiPost(API_FOODING_OA, "/activity/save", valueone, response => {
                    ServiceTips({text: response.message, type: 'success'})
                    let {navAddTab, navReplaceTab} = that.props;
                    let oldQuery = this.props.location.query, title;
                    let newQuery = Object.assign({}, oldQuery, {scheduleId: response.data})
                    navReplaceTab({
                        name: I18n.t(100587/*约会*/) + I18n.t(100097/*详情*/),
                        component: I18n.t(100587/*约会*/) + I18n.t(100097/*详情*/),
                        url: '/commondate/detail'
                    });
                    that.props.router.push({pathname: '/commondate/detail', query: newQuery, state: {refresh: true}});
                }, error => ServiceTips({text: error.message, type: 'error'}))
            }
        })
    }
    //返回按钮
    backClick = () => {
        /*let {navAddTab, navReplaceTab} =this.props;
      navReplaceTab({name:i18n.t(200112*/
        /*产品列表*/
        /*),component:i18n.t(200112*/
        /*产品列表*/
        /*),url:'/product/list'});
                this.props.router.push('/product/list');*/
    }
    //选择客户 获取当前的ID
    clientSelect = data => {
        let {commonData} = this.state;
        let newObject = Object.assign({}, commonData, {salBeId: data});
        this.setState({commonData: newObject});
    }

    componentDidMount() {
        this.getData();//初始化各个Select的Option数据
        this.initProductData(this.props.location.query.scheduleId || undefined);
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }

    componentWillReceiveProps(nextProps) {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }

    render() {
        const commonForm = this.state.dilogTelmp;
        let {form} = this.props;
        let typeNumber = this.props.location.query.typeNumber;
        return (
            <div className='addproduct scroll' style={{height: this.state.scrollHeight, overflow: scroll}}>
                <AddNormal
                    saveClick={this.saveClick}
                    backClick={this.backClick}
                    form={form}
                    commonData={this.state.commonData}
                    inputValue={this.state.inputValue}
                    onTableClick={this.onTableClick}
                    clientSelect={this.clientSelect}
                    isEdit={!!this.props.location.query.scheduleId}
                    Label={salBeEditArr[this.props.location.query.typeNumber]}
                    dataTypeId={dataTypeArr[this.props.location.query.typeNumber]}
                    salBeId={this.props.location.query.salBeId || this.props.form.getFieldValue('salBeId', {}).salBeId}
                    salBeLcName={decodeURIComponent(this.props.location.query.salBeLC || "")}
                    salbeEnName={decodeURIComponent(this.props.location.query.salBeEN || "")}
                    typeNumber={this.props.location.query.typeNumber}
                    isDt={this.props.location.query.isDt}
                    activityType={this.props.location.query.activityType}
                />
                <div>
                    {
                        (typeNumber == 30 || typeNumber == 80 || typeNumber == 90 || typeNumber == 110 || typeNumber == 130) ? "" :
                            <Measurement
                                menuList={[
                                    {type: 'add'},
                                    {type: 'delete'},
                                    {type: 'edit'}
                                ]}
                                onCancel={this.onCancel} title={I18n.t(100379/*产品*/)}
                                openDialog={this.handleClick}
                                addBeforeSaveClick={this.addBeforeSaveClick}
                                Zindex={9}
                                id={'commonList'}
                                DialogTempalte={require('./ProductAddEditDialog').default}
                                showHeader={true}
                                checkedRowsArray={[]}
                                otherData={{
                                    salBeId: this.props.location.query.salBeId || this.state.commonData.salBeId,
                                    scheduleId: this.state.commonData.id || ""
                                }}
                                onSaveAndClose={this.onSaveAndClose}
                                columns={
                                    [{
                                        title: I18n.t(100379/*产品*/),
                                        dataIndex: 'mtl' + language,
                                        key: "mtl",
                                        width: '18%',
                                        render(data, row, index) {
                                            return (<div title={data}>{data}</div>)
                                        }
                                    }, {
                                        title: I18n.t(100382/*产品规格*/),
                                        dataIndex: "basSpeci",
                                        key: "basSpeci",
                                        width: "25%",
                                        render(data, row, index) {
                                            return data;
                                        }
                                    }, {
                                        title: I18n.t(100422/*利润类型*/),
                                        dataIndex: "profType",
                                        key: "profType",
                                        width: "15%",
                                        render(data, row, index) {
                                            if (data == 10) {
                                                return (
                                                    <div>{row.profTypeName}&nbsp;&nbsp;&nbsp;&nbsp;{row.profRate ? (row.profRate + "%") : ''}</div>);
                                            } else if (data == 20) {
                                                return (
                                                    <div>{row.profTypeName}&nbsp;&nbsp;&nbsp;&nbsp;{row.ehProf}</div>);
                                            } else {
                                                return "";
                                            }
                                        }
                                    }, {
                                        title: I18n.t(100319/*采购数量*/),
                                        dataIndex: "needQty",
                                        key: "needQty",
                                        width: "15%",
                                        render(data, row, index) {
                                            return (<div>{data}&nbsp;&nbsp;{row.uomLcName || ""}</div>)
                                        }
                                    }, {
                                        title: I18n.t(100320/*销售指导价*/),
                                        dataIndex: 'fobSalePrc',
                                        key: "fobSalePrc",
                                        width: "15%",
                                        render(data, row, index) {
                                            return (<div>{data}&nbsp;&nbsp;{row.cnyLcName || ""}</div>);
                                        }
                                    }]
                                }
                                data={this.state.businessMtlList}
                            />
                    }
                </div>
                <ContDateOrigization form={form} commonData={this.state.commonData}/>
                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
                    {commonForm}
                </Dialog>
            </div>
        );
    }

}

export default NavConnect(createForm()(ActivityAddEdit));
