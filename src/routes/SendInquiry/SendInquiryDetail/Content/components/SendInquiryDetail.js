import React, {Component} from 'react';
import Template1 from '../../../../Client/Detail/Content/components/Template1';
import OnlyreadyRuleTemplate from '../../../../../components/OnlyreadyRuleTemplate';
import i18n from '../../../../../lib/i18n';
import Dialog from '../../../../../components/Dialog';

import ReceivingInformation from "./ReceivingInformation"; //收货信息
import CommerceClause from "./CommerceClause"; //商务条款

export class SendInquiryDetail extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = this.initState();
    }

    handleClick = (e, data, Template) => {
        if (data.number == 2) {
            console.log("delete", data)
            // Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            //     done: () => {
            //         apiForm(API_FOODING_ERP, '/sendenquiry/delete', {
            //             billId: numArr[0].billId
            //         }, response => {
            //             successTips("删除成功!");
            //             this.getPages();
            //         }, error => {
            //             errorTips("删除失败!");
            //         })
            //     }
            // });
        } else {
            let dialogTitle = data.action + data.name.title;
            this.setState({
                visible: true,
                dialogTitle: dialogTitle,
                dilogTelmp: Template
            });
        }
    }

    onSaveAndClose(values) {
        console.log(values);
        this.setState({visible: false});
    }

    onCancel() {
        this.setState({visible: false});
    }

    initState() {
        return {
            visible: false,
            dialogTitle: '',
            dilogTelmp: <div></div>
        }
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize(0));
    }

    handleResize(height) {
        this.setState({
            // paddingTop: !this.state.paddingTop
        });
        let padding = 232;
        let sch = document.body.offsetHeight - height - padding;
        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }

    componentWillReceiveProps(nextProps) {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }

    render() {
        const {businessOne} = this.props;
        const commonForm = this.state.dilogTelmp;
        return (
            <div>
                <div className='scroll' style={{
                    backgroundColor: '#f0f4f8',
                    height: this.state.scrollHeight, overflow: 'auto'
                }}>
                    <div style={{padding: '0 10px', backgroundColor: '#f0f4f8'}}>
                        <CommerceClause {...this.props}/>
                        <ReceivingInformation {...this.props}/>
                        <OnlyreadyRuleTemplate onCancel={this.onCancel} title={i18n.t(200021/*询价产品*/)}
                                               Zindex={4}
                                               showHeader={true}
                                               checkedRowsArray={[]}
                                               id={'sendquotation-detail-01'}
                                               columns={
                                                   [{
                                                       title: i18n.t(100377/*产品编码*/),
                                                       dataIndex: 'code',
                                                       key: "code",
                                                       width: '7%',
                                                       render(data, row, index){
                                                           return (<div title={data}>{data}</div>)
                                                       }
                                                   },
                                                       {
                                                           title: i18n.t(500061/*产品名称*/),
                                                           dataIndex: 'mtlLcName',
                                                           key: "mtlLcName",
                                                           width: '10%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       },
                                                       {
                                                           title: i18n.t(100382/*产品规格*/),
                                                           dataIndex: 'basSpeci',
                                                           key: "basSpeci",
                                                           width: '12%',
                                                           render(data, row, index){
                                                               return (<div title={data} className={'text-ellipsis'}>{data}</div>)
                                                           }
                                                       },
                                                       {
                                                           title: i18n.t(400012/*品牌*/),
                                                           dataIndex: 'brandLcName',
                                                           key: "brandLcName",
                                                           width: '6%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       },
                                                       {
                                                           title: i18n.t(500065/*需求数量*/),
                                                           dataIndex: 'requireQty',
                                                           key: "requireQty",
                                                           width: '8%',
                                                           render(data, row, index){
                                                               return (<div title={data + row.uomLcName}>{data}{row.uomLcName}</div>)
                                                           }
                                                       },
                                                       {
                                                           title: i18n.t(200009/*目标价*/),
                                                           dataIndex: "aimPrc",
                                                           key: "aimPrc",
                                                           width: "10%",
                                                           cnyLcName: businessOne.cnyLcName,
                                                           render(data, row, index){
                                                               return data ? data + businessOne.cnyLcName: '';
                                                           }
                                                       }, {
                                                       title: i18n.t(500067/*包装*/),
                                                       dataIndex: "packagLcName",
                                                       key: "packagLcName",
                                                       width: "10%",
                                                       render(data, row, index){
                                                           return data;
                                                       }
                                                   }, {
                                                       title: i18n.t(500068/*托盘*/),
                                                       dataIndex: "salvrLcName",
                                                       key: "salvrLcName",
                                                       width: "8%",
                                                       render(data, row, index){
                                                           return data;
                                                       }
                                                   }, {
                                                       title: i18n.t(500069/*可否混装*/),
                                                       dataIndex: "isMixed",
                                                       key: "isMixed",
                                                       width: "8%",
                                                       render(data, row, index){
                                                           return data ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/);
                                                       }
                                                   }]
                                               }
                                               data={this.props.productData}
                        />
                    </div>
                    <div className={'col'}>
                        <OnlyreadyRuleTemplate onCancel={this.onCancel} title={i18n.t(200023/*询价供应商*/)}
                                               Zindex={5}
                                               showHeader={true}
                                               checkedRowsArray={[]}
                                               id={'sendinquiry-add-02'}
                                               columns={
                                                   [
                                                       {
                                                           title: i18n.t(100312/*供应商*/),
                                                           dataIndex: 'vndBeLcName',
                                                           key: "vndBeLcName",
                                                           width: '50%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       },
                                                       {
                                                           title: i18n.t(500075/*指定/禁止*/),
                                                           dataIndex: 'spickTypeName',
                                                           key: "spickTypeName",
                                                           width: '50%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       }]
                                               }
                                               data={this.props.supplierData}
                        />
                        <OnlyreadyRuleTemplate onCancel={this.onCancel} title={i18n.t(100512/*船公司要求*/)}
                                               Zindex={4}
                                               showHeader={true}
                                               checkedRowsArray={[]}
                                               id={'sendquotation-detail-02'}
                                               columns={
                                                   [
                                                       {
                                                           title: i18n.t(500075/*指定/禁止*/),
                                                           dataIndex: 'spickTypeName',
                                                           key: "spickTypeName",
                                                           width: '50%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       },
                                                       {
                                                           title: i18n.t(500076/*船公司*/),
                                                           dataIndex: 'shipBeLcName',
                                                           key: "shipBeLcName",
                                                           width: '25%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       }]
                                               }
                                               data={this.props.shipData}
                        />
                    </div>
                    <div className={'col'}>
                        <OnlyreadyRuleTemplate onCancel={this.onCancel} title={i18n.t(500078/*证书要求*/)}
                                               Zindex={5}
                                               showHeader={true}
                                               checkedRowsArray={[]}
                                               id={'sendquotation-detail-02'}
                                               columns={
                                                   [
                                                       {
                                                           title: i18n.t(500070/*证书名称*/),
                                                           dataIndex: 'cardLcName',
                                                           key: "cardLcName",
                                                           width: '50%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       },
                                                       {
                                                           title: i18n.t(500071/*是否加急*/),
                                                           dataIndex: 'gentMark',
                                                           key: "gentMark",
                                                           width: '25%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/)}</div>)
                                                           }
                                                       },
                                                       {
                                                           title: i18n.t(500072/*是否正本*/),
                                                           dataIndex: 'origMark',
                                                           key: "origMark",
                                                           width: '25%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/)}</div>)
                                                           }
                                                       }]
                                               }
                                               data={this.props.cardData}
                        />
                        <OnlyreadyRuleTemplate onCancel={this.onCancel} title={i18n.t(500079/*检验要求*/)}
                                               Zindex={4}
                                               showHeader={true}
                                               columns={
                                                   [
                                                       {
                                                           title: i18n.t(500061/*产品名称*/),
                                                           dataIndex: 'mtlLcName',
                                                           key: "mtlLcName",
                                                           width: '50%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       },
                                                       {
                                                           title: i18n.t(500073/*测试项目*/),
                                                           dataIndex: 'testItmLcName',
                                                           key: "testItmLcName",
                                                           width: '25%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       },
                                                       {
                                                           title: i18n.t(100606/*测试方法*/),
                                                           dataIndex: 'testMethLcName',
                                                           key: "testMethLcName",
                                                           width: '25%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       }]
                                               }
                                               data={this.props.testData}
                        />
                        <Template1 
                            menuList={[
                                {type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
                            ]}                        
                            id={'6'}   isShowIcon={false} title={i18n.t(100140/*组织*/)}
                                   tempArray={[
                                       {key: i18n.t(100244/*企业*/), value: businessOne.ccLcName},
                                       {key: i18n.t(400036/*采购组织*/), value: businessOne.porLcName},
                                       {key: i18n.t(200024/*询价人*/), value: businessOne.staffLcName}
                                   ]}/>
                    </div>
                </div>
                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
                    {commonForm}
                </Dialog>
            </div>
        );
    }

}
export default SendInquiryDetail;
