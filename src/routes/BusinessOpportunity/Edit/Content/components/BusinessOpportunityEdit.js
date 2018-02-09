import i18n from './../../../../../lib/i18n';
import React, {Component} from 'react';
import BOEditOrg from './BOEditOrg';
import Measurement from '../../../../../components/RuleTemplate';
import Dialog from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer'; //引入
import BODetailNormal from './BOEditNormal'; // 常规详情
import {createForm} from '../../../../../components/Form';
import {API_FOODING_ERP, apiForm, apiGet, apiPost} from '../../../../../services/apiCall';
import {errorTips, successTips} from "../../../../../components/ServiceTips"; //提示框
export class BODdit extends Component {
    constructor(props) {
        super(props);
        let that = this;
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = this.initState();
        this.columns =
            [
                {
                    title : i18n.t(100379/*产品*/),
                    dataIndex : 'mtlLcName',
                    key : "mtlLcName",
                    width : '10%',
                    render(data,row,index){
                        return (<div title={data}>{data}</div>)
                    }
                },{
                title : i18n.t(100382/*产品规格*/),
                dataIndex : "basSpeci",
                key : "basSpeci",
                width : "20%",
                render(data,row,index){
                    return data;
                }
            },{
                title : i18n.t(500067/*包装*/),
                dataIndex : "packagLcName",
                key : "packagLcName",
                width : "15%",
                render(data,row,index){
                    return data;
                }
            },{
                title : i18n.t(500065/*需求数量*/),
                dataIndex : "needQty",
                key : "needQty",
                width : "10%",
                tooltip: false,
                render(data,row,index){
                    return data? data + "" + row.uomLcName: data;
                }
            },{
                title : "FOB成本价",
                dataIndex : 'fobCostPrc',
                key : "fobCostPrc",
                width : "10%",
                tooltip: false,
                render(data,row ,index){
                    return data? data + "" + row.cnyLcName: data;
                }
            },{
                title : i18n.t(200230/*客户目标价*/),
                dataIndex : 'customerPrc',
                key : "customerPrc",
                width : "10%",
                tooltip: false,
                render(data,row ,index){
                    return data? data + "" + row.cnyLcName: data;
                }
            },{
                title : i18n.t(201262/*FOB销售价*/),
                dataIndex : 'fobSalePrc',
                key : "fobSalePrc",
                width : "10%",
                tooltip: false,
                render(data,row ,index){
                    return data? data + "" + row.cnyLcName: data;
                }
            }/*,{
                title : i18n.t(100449*//*竞争对手*//*),
                dataIndex : 'businessMtlCompetitors',
                key : "businessMtlCompetitors",
                width : "10%",
                render(data,row ,index){
                    return (data || []).join(',');
                }
            },{
                title : i18n.t(500084*//*关闭原因*//*),
                dataIndex : 'closeInstruct',
                key : "closeInstruct",
                width : "10%",
                render(data,row ,index){
                    return data;
                }
            }*/
            ];
    }

    handleClick = (e, data, Template) => {
        if (data.number == 2) {
            Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    let uri = '', host = API_FOODING_ERP, params = {}, callback;
                    if (data.id === 'client-detail-05') {
                        uri = '/business/team/delete';
                        callback = this.getListTeam;
                    } else if(data.id === 'client-detail-07'){
                        uri = "/business/linker/delete";
                        callback = this.getProfitTeam;
                    } else if(data.id === 'client-detail-06'){
                        uri = '/business/mtl/delete';
                        callback = this.getEditOne;
                    }

                    if (!uri) return;
                    params.id = data.selectArr.map(ar => ar.billDtlId);

                    apiForm(host, uri, params,
                        response => {
                            successTips("删除成功!");
                            callback && callback(this.state.businessOne.billId);
                        }, error => {
                            errorTips("删除失败!");
                        })
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
    };

    onSaveAndClose() {
        this.setState({visible: false});
    }

    onCancel() {
        this.setState({visible: false});
    }

    backClick = () => {
        let {navReplaceTab} = this.props;
        let {businessOne} = this.state;
        let billId = this.props.location.query.id;
        let cid = this.props.location.query.cid;
        if(cid && businessOne.salBeLcName){

            let name = i18n.t(100311/*客户*/) + "(" + businessOne.salBeLcName+")";
            navReplaceTab({name: name, component: name, url: '/client/detail/' + cid});
            this.props.router.push({pathname: '/client/detail/' + cid,query:{id: cid,index:'business'}});
        } else {
            if (billId && businessOne.no) {

                let name = i18n.t(100321/*商机*/) + '(' + businessOne.no+")";
                navReplaceTab({name: name, component: name, url: '/businessOpportunity/detail/' + billId});
                this.props.router.push({pathname: '/businessOpportunity/detail/' + billId, query: {id: billId}});
            } else {
                navReplaceTab({name: i18n.t(100321/*商机*/), component: i18n.t(100321/*商机*/), url: '/businessOpportunity/list'});
                this.props.router.push({pathname: '/businessOpportunity/list'});
            }
        }

    };

    onSaveTeamClose = () => {
        this.onSaveAndClose();
        this.getListTeam();
    };

    onSaveProfitClose = () => {
        this.onSaveAndClose();
        this.getProfitTeam();
    };

    onSaveMtlClose = () => {
        this.onSaveAndClose();
        this.getEditOne(this.state.businessOne.billId);
    };

    initState() {
        return {
            businessOne: {},
            profitData: [],
            saleData: [],
            isnormal: this.props.location.query.isnormal ? this.props.location.query.isnormal : false,
            visible: false,
            dialogTitle: '',
            dilogTelmp: <div/>
        }
    }

    onSaveNormal = callback => {
      let that = this;
        let businessOne = this.state.businessOne;
        if (businessOne.billId && callback)
         return callback(null, businessOne);

        const {form} = this.props;
        form.validateFields((error, values) => {
            if (!error) {
                let param = Object.assign({}, businessOne, values);
                apiPost(API_FOODING_ERP, '/business/save', param,
                    response => {
                        param.billId = response.data;
                        let cancel = ()=>{
                            this.props.router.push({pathname: this.props.router.location.pathname, query: {...this.props.router.location.query, id: param.billId}, state: {refresh: false}});
                            param.optlock++;
                            this.setState({businessOne: param},()=>{
                              that.getEditOne(that.state.businessOne.billId,that.state.businessOne.salBeId);
                            });
                        };
                        let done = ()=>{
                            let name = i18n.t(100321/*商机*/) + '(' + businessOne.no + ")";
                            this.props.navReplaceTab({name: name, component: name, url: '/businessOpportunity/detail/' + param.billId});
                            this.props.router.push({pathname: '/businessOpportunity/detail/' + param.billId, query: {id: param.billId}});
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

    getListTeam = billId => {
        billId = billId || this.state.businessOne.billId;
        apiGet(API_FOODING_ERP, '/business/team/getList', {billId},
            response => {
                this.setState({saleData: response.data});
            }, error => {
                errorTips(error.message);
            })
    };

    getProfitTeam = billId => {
        billId = billId || this.state.businessOne.billId;
        apiGet(API_FOODING_ERP, '/business/linker/getList', {billId},
            response => {
                this.setState({profitData: response.data});
            }, error => {
                errorTips(error.message);
            })
    };

    getListMtl = billId =>{
        billId = billId || this.state.businessOne.billId;
        apiGet(API_FOODING_ERP, '/business/mtl/getList', {billId},
            response => {
                this.setState({productData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    getEditOne = (billId, salBeId) => {
        apiGet(API_FOODING_ERP, '/business/getOne', {
            billId: billId, salBeId: salBeId
        }, response => {
            this.setState({businessOne: response.data});
        }, error => {
            errorTips(error.message);
        });
        if(billId){
            this.getProfitTeam(billId);
            this.getListTeam(billId);
            this.getListMtl(billId);
        }
    };

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
        this.getEditOne(this.props.location.query.id, this.props.location.query.cid);
    }

    handleResize = (height = 0) => {
        this.setState({
            // paddingTop: !this.state.paddingTop
        });
        let sch = document.body.offsetHeight - height - 85;
        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentWillReceiveProps(nextProps) {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize);

        let billId = nextProps.location.query.id;
        let salBeId = nextProps.location.query.cid;
        if (billId !== this.props.location.query.id || salBeId !== this.props.location.query.cid) {
            this.getEditOne(billId, salBeId);
        }
    }

    render() {
        const commonForm = this.state.dilogTelmp;
        return (
            <div>
                <div className='scroll activity-detail' style={{
                    backgroundColor: '#f0f4f8',
                    height: this.state.scrollHeight, overflow: 'auto'
                }}>
                    <div style={{paddingBottom: 10}}>

                        <BODetailNormal form={this.props.form} businessOne={this.state.businessOne} onSaveNormal={this.onSaveNormal} backClick={this.backClick} location={this.props.location}/>
                    </div>
                    <div>
                        <Measurement
                            menuList={[
                                {type:'add'},
                                {type:'delete'},
                                {type:'edit'}
                            ]}
                            addBeforeSaveClick={this.onSaveNormal}
                                    form={this.props.form}
                                     title={i18n.t(200231/*商机产品*/)}
                                     DialogTempalte={require('./BOEditProduct').default}
                                     openDialog={this.handleClick}
                                     onSaveAndClose={this.onSaveMtlClose}
                                     onCancel={this.onCancel}
                                     singleSelect={true}
                                     otherData={this.state.businessOne}
                                     showHeader={true}
                                     columns={this.columns}
                                     data={this.state.productData}
                                     id={'client-detail-06'}
                        />
                    </div>
                    <div className='col' style={{paddingLeft: 0}}>
                        <BOEditOrg form={this.props.form} businessOne={this.state.businessOne}/>
                    </div>
                    <div className='col' style={{paddingLeft: 0,paddingRight:0}}>
                        <div className='col' style={{paddingLeft: 0, paddingTop: 0}}>
                            <Measurement
                                menuList={[
                                    {type:'add'},
                                    {type:'delete'},
                                    {type:'edit'}
                                ]}
                                addBeforeSaveClick={this.onSaveNormal}
                                         onCancel={this.onCancel}
                                         title={i18n.t(200232/*利益干系人*/)}
                                         singleSelect={true}
                                         onSaveAndClose={this.onSaveProfitClose}
                                         otherData={this.state.businessOne}
                                         openDialog={this.handleClick}
                                         DialogTempalte={require('./BOEditContact').default}
                                         showHeader={false}
                                         checkedRowsArray={[]}
                                         id={'client-detail-07'}
                                         columns={
                                             [{
                                                 title: "linkLcName",
                                                 dataIndex: 'linkLcName',
                                                 key: "linkLcName",
                                                 render(data, row, index){
                                                     return <div>{data}</div>
                                                 }
                                             }
                                             ]
                                         }
                                         data={this.state.profitData}
                            />
                        </div>
                        <div className='col' style={{paddingLeft: 0, paddingTop: 0,paddingRight:0}}>
                            <Measurement
                                menuList={[
                                    {type:'add'},
                                    {type:'delete'},
                                    {type:'edit'}
                                ]}
                                addBeforeSaveClick={this.onSaveNormal}
                                         onCancel={this.onCancel}
                                         title={i18n.t(200233/*销售团队*/)}
                                         onSaveAndClose={this.onSaveTeamClose}
                                         openDialog={this.handleClick}
                                         DialogTempalte={require('./AddNewSalesTeam').default}
                                         showHeader={false}
                                         singleSelect={true}
                                         otherData={this.state.businessOne}
                                         checkedRowsArray={[]}
                                         id={'client-detail-05'}
                                         columns={
                                             [{
                                                 title: i18n.t(200234/*销售人*/),
                                                 dataIndex: 'salSaffLcName',
                                                 key: "salSaffLcName",
                                                 width: '40%',
                                                 render(data, row, index){
                                                     return <div>{data}</div>
                                                 }
                                             },
                                                 {
                                                     title: i18n.t(200221/*是否主力*/),
                                                     dataIndex: 'mainMark',
                                                     key: "mainMark",
                                                     render(data, row, index){
                                                         return (<div title={data}>{data === true ? i18n.t(200235/*主力*/) : ''}</div>)
                                                     }
                                                 }
                                             ]
                                         }
                                         data={this.state.saleData}
                            />
                        </div>
                    </div>

                </div>
                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
                    {commonForm}
                </Dialog>
            </div>
        );

    }

}
export default NavConnect(createForm()(BODdit));
